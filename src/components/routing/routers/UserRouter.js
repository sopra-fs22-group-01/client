import {Redirect, Route} from "react-router-dom";
import PropTypes from 'prop-types';
import Registration from "../../views/Registration";
import ProfilePage from "../../views/ProfilePage";
import Login from "../../views/Login";
import Statistics from "../../views/Statistics";

const UserRouter = props => {
    /**
     * "this.props.base" is "/app" because as been passed as a prop in the parent of GameRouter, i.e., App.js
     */
    return (
        <div style={{display: 'flex', flexDirection: 'column'}}>

            <Route exact path={`${props.base}/registration`}>
                <Registration/>
            </Route>

            <Route exact path={`${props.base}/login`}>
                <Login/>
            </Route>

            <Route exact path={`${props.base}/profile/:userId`}>
                <ProfilePage/>
            </Route>

            <Route exact path={`${props.base}/profile/statistics/:userId`}>
                <Statistics/>
            </Route>

        </div>
    );
};

//(?) used to check if props are of type string (?)
UserRouter.propTypes = {
    base: PropTypes.string
}

export default UserRouter;
