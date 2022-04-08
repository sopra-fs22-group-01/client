import {Redirect, Route} from "react-router-dom";
import Lobby from "components/views/Lobby";
import PropTypes from 'prop-types';
import Round from "../../views/Round";

const GameRouter = props => {
  /**
   * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
   */
  return (
    <div style={{display: 'flex', flexDirection: 'column'}}>
      <Route exact path={`${props.base}/players/:id`}>
        <Lobby/>
      </Route>

      <Route exact path={`${props.base}/rounds`}>
         <Round/>
      </Route>

      <Route exact path={`${props.base}`}>
        <Redirect to={`${props.base}/players`}/>
      </Route>

    </div>
  );
};
/*
* Don't forget to export your component!
 */

//(?) used to check if props are of type string (?)
GameRouter.propTypes = {
  base: PropTypes.string
}

export default GameRouter;
