import {useSharedDispatch, useSharedSelector} from "shared/utils/hooks/useShared";

import {CloseHeaderMenus, OpenHeaderMenu, OpenHeaderPopup} from "shared/state/Header";

import {Dropdown} from "./Dropdown";


export const TutorialDropdown = () => {
    const { curMenu } = useSharedSelector(
        (state) => ({ curMenu: state.header.curMenu })
    );
    const dispatch = useSharedDispatch();

    return (
        <Dropdown open={(curMenu === "tutorial")}
                  btnInfo={{ title: "Help", src: "img/icons/help.svg" }}
                  onClick={() => dispatch(OpenHeaderMenu("tutorial"))}
                  onClose={() => dispatch(CloseHeaderMenus())}>
            <h1>Resources</h1>
            <hr />
            <div role="button" tabIndex={0}
                 onClick={() => {
                    dispatch(CloseHeaderMenus());
                    dispatch(OpenHeaderPopup("quick_start"));
                }}>
                <img src="img/icons/quick_start.svg" height="100%" alt="Check out our Quick Start guide" />
                <span>Quick Start</span>
            </div>
            <div role="button" tabIndex={0}
                 onClick={() => {
                    dispatch(CloseHeaderMenus());
                    dispatch(OpenHeaderPopup("keyboard_shortcuts"));
                }}>
                <img src="img/icons/keyboard.svg" height="100%" alt="See our Keyboard Shortcuts" />
                <span>Keyboard Shortcuts</span>
            </div>
        </Dropdown>
    );
}
