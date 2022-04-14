import "styles/ui/ScoreBoard.scss";

export const ScoreBoard = props => (
  <button
    {...props}
    style={{width: props.width, ...props.style}}
    className={`scoreBoard ${props.className}`}>
    {props.children}
  </button>
);
