import {Redirect, Route} from "react-router-dom";
import Lobby from "components/views/Lobby.js";
import PropTypes from 'prop-types';

const GameRouter = props => {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>

            {/*<Route exact path={`${props.base}`}>
                <Redirect to={`${props.base}/:lobbyId/players`}/>
            </Route>
            */}

            <Route exact path={`${props.base}/:lobbyId/players/:userId`}>
                <Lobby/>
            </Route>



        </div>
    );
};

//(?) used to check if props are of type string (?)
GameRouter.propTypes = {
    base: PropTypes.string
}

export default GameRouter;
