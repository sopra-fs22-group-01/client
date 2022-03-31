import "styles/ui/Card.scss";

export const Card = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`card ${props.className}`}>
    {props.children}
  </button>
);
