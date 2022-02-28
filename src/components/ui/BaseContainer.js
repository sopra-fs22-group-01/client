import 'styles/ui/BaseContainer.scss';
import PropTypes from "prop-types";

const BaseContainer = props => (
  <div {...props} className={`base-container ${props.className ?? ''}`}>
    {props.children}
  </div>
);

// Anything that can be rendered: numbers, strings, elements or an array
// (or fragment) containing these types.
BaseContainer.propTypes = {
  children: PropTypes.node,
};

export default BaseContainer;