import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/JoinLobby.scss";
import profileIcon from 'images/profileIcon1.png';
import {MdOutlineEdit} from "react-icons/md";
import {SecondaryButton} from "../ui/SecondaryButton";
import LobbyModel from "../../models/LobbyModel";
import PropTypes from "prop-types";
import User from "../../models/User";


const LobbyObject = ({lobbyModel}) => (
    <div className="lobbyObject container">
        <div className="lobbyObject id">
            LobbyID:
            {lobbyModel.id}
        </div>
        <div className="lobbyObject playerCount">
            Players:
            {lobbyModel.currentPlayerCount}
        </div>
    </div>
);

LobbyObject.propTypes = {
    lobby: PropTypes.object
};


const JoinLobby = () => {
    // use react-router-dom's hook to access the history

    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [user, setUser] = useState(null);
    const {userId} = useParams(); //extracts the id from the URL
    const [lobbies, setLobbies] = useState(null);
    const [clickedLobby, setClickedLobby] = useState(null);
    const [hasMatchVar, setHasMatchVar] = useState(false);

    const logout = async () => {
        try {
            let currentToken = localStorage.getItem('token');

            //const deletionResponse = await api.delete(`/lobbies/${lobbyId}/players/${userId}`);

            const response = await api.put(`/logout/?token=${currentToken}`)
            localStorage.removeItem('token');
            history.push('/users/login');
        } catch (error) {
            alert(`Something went wrong during logout: \n${handleError(error)}`);
        }

        localStorage.removeItem('token');
        history.push('/users/login');
    }

    const createNewLobby = async () => {
        try {
            const response = await api.post(`/lobbies/`);

        } catch (error) {
            alert(`Something went wrong when creating a new lobby: \n${handleError(error)}`);
        }
    };

    const addUserLobby = async (lobbyId) => {
        try {
            console.log("Add this user to lobby")
            const response = api.post(`/lobbies/${lobbyId}/lists/players/${userId}`);
            history.push(`/lobbies/${lobbyId}/players/${userId}`);


        } catch (error) {
            alert(`Something went wrong when creating a new lobby: \n${handleError(error)}`);
        }
    };


    const hasMatch = async (lobbyId) => {
        try {
            const response = api.get(`/matches/${lobbyId}/status`);
            const status = (await response).data;
            // console.log("MATCH STATUS", lobbyId)
            // console.log(status)
            /*
                        if (status === "NotYetCreated"){
                            console.log("FALSEE")
                            setHasMatchVar(false)

                        }
                        else{
                            console.log("TRUEE")
                            setHasMatchVar(true)

                        }*/

            return status.toString();
        } catch (error) {
            alert(`Something went wrong fetching MatchStatus: \n${handleError(error)}`);
        }
    };

    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {

        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response1 = await api.get(`/users/?id=${userId}`);
                const response2 = await api.get('/lobbies');
                setLobbies(response2.data);

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                //await new Promise(resolve => setTimeout(resolve, 10000));

                // Get the returned users and update the state.
                setUser(response1.data);

                // REDIRECT TO OWN PROFILE
                if (localStorage.getItem("token") !== response1.data.token){
                    console.log("USER NOT THE SAME")
                    try{
                        const t = localStorage.getItem("token")
                        const true_UserResponse = await api.get(`/users/${t}`);
                        console.log("TRUE USER DATA")
                        console.log(true_UserResponse)
                        const true_id = true_UserResponse.data.id
                        history.push(`/users/profile/${true_id}`)
                    }catch (error) {
                        console.error(`Something went wrong while fetching the true user: \n${handleError(error)}`);
                        console.error("Details:", error);
                        alert("Something went wrong while fetching the true user! See the console for details.");
                    }
                }

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                /*
                console.log('request to:', response1.request.responseURL);
                console.log('status code:', response1.status);
                console.log('status text:', response1.statusText);
                console.log('requested data:', response1.data);*/

                // See here to get more data.
                // console.log(response1);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        };
        const t = setInterval(fetchData, 600);//this part is responsible for periodically fetching data
        return () => clearInterval(t); // clear


    }, []); //there cold be something in this array,  the code inside
    //of the useEffect hook only renders, if something in the array changes. Since the
    //empty array never changes, the code inside useEffect never runs again

    //ul = unordered list
    let content = <Spinner/>;

    if (user) {
        content = (
            <BaseContainer className="joinLobby base-container">

                <div className="joinLobby titleContainer">
                    <h1>Create or join a lobby, {user.username} !</h1>
                </div>

                <div className="joinLobby lobbyListContainer">
                    <h2>Choose a lobby:</h2>
                    <ul className="joinLobby lobbyList">
                        {lobbies.map((lobbyModel, d) => (
                            <button className="joinLobby lobbyButton"
                                    onClick={() => addUserLobby(lobbyModel.id)}
                                    disabled={!(user.token === localStorage.getItem(`token`))}
                            >
                                <LobbyObject lobbyModel={lobbyModel}/>
                            </button>
                        ))}
                    </ul>
                </div>
                <div className="joinLobby button-container">
                    <PrimaryButton className="joinLobby new_lobby_button"
                                   onClick={() => createNewLobby()}
                                   disabled={!(user.token === localStorage.getItem(`token`))}
                    >
                        New lobby
                    </PrimaryButton>

                    <PrimaryButton className="joinLobby logout_button"
                                   disabled={!(user.token === localStorage.getItem(`token`))}
                                   onClick={() => logout()}
                    >
                        Logout
                    </PrimaryButton>

                    <PrimaryButton className="joinLobby profile_button"
                                   disabled={!(user.token === localStorage.getItem(`token`))}
                                   onClick={() => history.push(`/users/profile/${user.id}`)}
                    >
                        Profile
                    </PrimaryButton>

                </div>

            </BaseContainer>
        );
    }
    return content;
}
export default JoinLobby;