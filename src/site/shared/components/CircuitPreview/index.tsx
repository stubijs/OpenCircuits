import {CircuitMetadata} from "core/models/CircuitMetadata";

import "./index.scss";


type CircuitPreviewProps = {
    readonly?: boolean;
    data: CircuitMetadata;
    onClick: () => void;
    onDelete: () => void;
}
export const CircuitPreview = ({ readonly, data, onClick, onDelete }: CircuitPreviewProps) => (
    <div role="button" tabIndex={0} className="circuit__preview" title="Load circuit" onClick={onClick}>
        <span className="circuit__preview__icon">
            <img src={data.getThumbnail()} alt={`Thumbnail for blackbox circuit, ${data.getName()}`} />
        </span>
        <span className="circuit__preview__text">
            <div className="circuit__preview__text__name">{data.getName()}</div>
        </span>
        {/* Don't show 'x' if readonly */}
        {!readonly &&
        (<span className="circuit__preview__controls">
            <img className="circuit_options" width="20px" src="img/icons/close.svg"
                 title="Delete Circuit" alt="X to delete"
                 onClick={(e) => { e.stopPropagation(); onDelete(); }} />
        </span>)}
    </div>
);
