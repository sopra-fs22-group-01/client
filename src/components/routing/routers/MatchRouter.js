import {Redirect, Route} from "react-router-dom";
import PropTypes from 'prop-types';
import Round from "../../views/Round";
import Voting from "../../views/Voting";
import Winner from "../../views/Winner";
import NextPage from "../../views/NextPage";
import End from "../../views/End";
import MatchRanking from "../../views/MatchRanking";

const MatchRouter = props => {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>

            <Route exact path={`${props.base}/:matchId/hand/:userId`}>
                <Round/>
            </Route>

            <Route exact path={`${props.base}/:matchId/election/:userId`}>
                <Voting/>
            </Route>

            <Route exact path={`${props.base}/:matchId/winner/:userId`}>
                <Winner/>
            </Route>
            <Route exact path={`${props.base}/:matchId/next/:userId`}>
                <NextPage/>
            </Route>
            <Route exact path={`${props.base}/:matchId/ranking/:userId`}>
                <MatchRanking/>
            </Route>

            <Route exact path={`${props.base}/:matchId/end/:userId`}>
                <End/>
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
