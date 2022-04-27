import {BrowserRouter, Redirect, Route, Switch} from "react-router-dom";
import {GameGuard} from "components/routing/routeProtectors/GameGuard";
import GameRouter from "components/routing/routers/GameRouter";
import {LoginGuard} from "components/routing/routeProtectors/LoginGuard";
import Login from "components/views/Login";
import EditProfile from "components/views/EditProfile";
import Registration from "../../views/Registration";
import {RegistrationGuard} from "../routeProtectors/RegistrationGuard";
import ProfilePage from "../../views/ProfilePage";
import Game from "../../views/Game";
import StartPage from "../../views/StartPage";
import Round from "../../views/Round";
import MatchRouter from "./MatchRouter";
import UserRouter from "./UserRouter";

/**
 * Main router of your application.
 * In the following class, different routes are rendered. In our case, there is a Login Route with matches the path "/login"
 * and another Router that matches the route "/game".
 * The main difference between these two routes is the following:
 * /login renders another component without any sub-route
 * /game renders a Router that contains other sub-routes that render in turn other react components
 * Documentation about routing in React: https://reacttraining.com/react-router/web/guides/quick-start
 */ // test


const AppRouter = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/startpage">
                    <StartPage/>
                </Route>

                <Route path="/users">
                     <UserRouter base="/users"/>
                </Route>

                <Route path="/matches">
                    <MatchRouter base="/matches"/>
                </Route>
                {/*-------------------------------*/}

                <Route path="/editor/:id">
                    <GameGuard>
                        <EditProfile/>
                    </GameGuard>
                </Route>

                {/* <Route path="/matches/:matchId/hand/:userId">
                    <GameGuard>
                        <Round/>
                    </GameGuard>
                </Route>

                <Route path="/lobbies/:lobbyId/players/:userId">
                    <GameGuard>
                        <LobbyView/>
                    </GameGuard>
                </Route>*/}

                <Route path="/lobbies">
                    <GameGuard>
                        <GameRouter base="/lobbies"/>
                    </GameGuard>
                </Route>


                <Route exact path="/">
                    <Redirect to="/startpage"/>
                </Route>
            </Switch>
        </BrowserRouter>
    );
};
export default AppRouter;