import React, {createRef}             from "react";
import ReactDOM                       from "react-dom";
import {Provider}                     from "react-redux";
import {applyMiddleware, createStore} from "redux";
import thunk, {ThunkMiddleware}       from "redux-thunk";

import {DEV_CACHED_CIRCUIT_FILE} from "shared/utils/Constants";

import {Images} from "core/utils/Images";

import {InteractionTool}  from "core/tools/InteractionTool";
import {PanTool}          from "core/tools/PanTool";
import {RotateTool}       from "core/tools/RotateTool";
import {SelectionBoxTool} from "core/tools/SelectionBoxTool";
import {SplitWireTool}    from "core/tools/SplitWireTool";
import {TranslateTool}    from "core/tools/TranslateTool";
import {WiringTool}       from "core/tools/WiringTool";

import {CleanUpHandler}       from "core/tools/handlers/CleanUpHandler";
import {CopyHandler}          from "core/tools/handlers/CopyHandler";
import {DeleteHandler}        from "core/tools/handlers/DeleteHandler";
import {DeselectAllHandler}   from "core/tools/handlers/DeselectAllHandler";
import {DuplicateHandler}     from "core/tools/handlers/DuplicateHandler";
import {FitToScreenHandler}   from "core/tools/handlers/FitToScreenHandler";
import {PasteHandler}         from "core/tools/handlers/PasteHandler";
import {RedoHandler}          from "core/tools/handlers/RedoHandler";
import {SaveHandler}          from "core/tools/handlers/SaveHandler";
import {SelectAllHandler}     from "core/tools/handlers/SelectAllHandler";
import {SelectionHandler}     from "core/tools/handlers/SelectionHandler";
import {SelectPathHandler}    from "core/tools/handlers/SelectPathHandler";
import {SnipWirePortsHandler} from "core/tools/handlers/SnipWirePortsHandler";
import {UndoHandler}          from "core/tools/handlers/UndoHandler";

import "digital/models/ioobjects";

// import {GetCookie}     from "shared/utils/Cookies";
import {LoadingScreen} from "shared/utils/LoadingScreen";

import {DevGetFile, DevListFiles} from "shared/api/Dev";


// import {NoAuthState} from "shared/api/auth/NoAuthState";

import {SetCircuitSaved} from "shared/state/CircuitInfo";

// import {Login} from "shared/state/thunks/User";

import {App}                from "./containers/App";
import {AppState, AppStore} from "./state";
import {AllActions}         from "./state/actions";
import {reducers}           from "./state/reducers";
import {Setup}              from "./utils/CircuitInfo/Setup";
import {DigitalPaste}       from "./utils/DigitalPaste";

import ImageFiles from "./data/images.json";


async function Init(): Promise<void> {
    const startPercent = 30;
    let store: AppStore;

    await LoadingScreen("loading-screen", startPercent, [
        [80, "Loading Images", async (onProgress) => {
            await Images.Load(ImageFiles.images, onProgress);
        }],

        [85, "Initializing redux", async () => {
            store = createStore(reducers, applyMiddleware(thunk as ThunkMiddleware<AppState, AllActions>));
        }],
        [100, "Rendering", async () => {
            // Setup
            const canvas = createRef<HTMLCanvasElement>();

            // Setup circuit and get the CircuitInfo and helpers
            const [info, helpers] = Setup(
                store, canvas,
                new InteractionTool([
                    SelectAllHandler, FitToScreenHandler, DuplicateHandler,
                    DeleteHandler, SnipWirePortsHandler, DeselectAllHandler,
                    SelectionHandler, SelectPathHandler, RedoHandler, UndoHandler,
                    CleanUpHandler, CopyHandler,
                    PasteHandler((data) => DigitalPaste(data, info, undefined)),
                    SaveHandler(() => store.getState().user.isLoggedIn && helpers.SaveCircuitRemote()),
                ]),
                PanTool, RotateTool,
                TranslateTool, WiringTool,
                SplitWireTool, SelectionBoxTool
            );

            info.history.addCallback(() => {
                store.dispatch(SetCircuitSaved(false));
            });

            if (process.env.NODE_ENV === "development") {
                // Load dev state
                const files = await DevListFiles();
                if (files.includes(DEV_CACHED_CIRCUIT_FILE))
                    await helpers.LoadCircuit(() => DevGetFile(DEV_CACHED_CIRCUIT_FILE));
            }

            ReactDOM.render(
                <React.StrictMode>
                    <Provider store={store}>
                        <App info={info} helpers={helpers} canvas={canvas} />
                    </Provider>
                </React.StrictMode>,
                document.getElementById("root")
            );
        }],
    ]);
}

Init();
