import "styles/ui/SecondaryButton.scss";

export const SecondaryButton = props => (
    <button
        {...props}
        style={{width: props.width, ...props.style}}
        className={`secondary-button ${props.className}`}>
        {props.children}
    </button>
);
