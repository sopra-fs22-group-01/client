import {Redirect, Route} from "react-router-dom";
import PropTypes from 'prop-types';
import Round from "../../views/Round";

const MatchRouter = props => {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>

            <Route exact path={`${props.base}/:matchId/hand/:userId`}>
                <Round/>
            </Route>
            {/**/}


        </div>
    );
};

//(?) used to check if props are of type string (?)
MatchRouter.propTypes = {
    base: PropTypes.string
}

export default MatchRouter;