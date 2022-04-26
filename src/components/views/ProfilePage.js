import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/ProfilePage.scss";
import profileIcon from 'images/profileIcon1.png';
import {MdOutlineEdit} from "react-icons/md";
import {SecondaryButton} from "../ui/SecondaryButton";
import LobbyModel from "../../models/LobbyModel";
import PropTypes from "prop-types";
import User from "../../models/User";


const Lobby = ({lobbyModel}) => (
    <div className="lobby container">
        <div className="lobby id">
            LobbyID:
            {lobbyModel.id}
        </div>
        <div className="lobby playerCount">
            Players:
            {lobbyModel.currentPlayerCount}
        </div>
    </div>
);

Lobby.propTypes = {
    lobby: PropTypes.object
};


const ProfilePage = () => {
    // use react-router-dom's hook to access the history

    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [user, setUser] = useState(null);
    const {id} = useParams(); //extracts the id from the URL
    const [lobbies, setLobbies] = useState(null);


    const createNewLobby = async () => {
        try {
            const response = await api.post(`/lobbies/`);

        } catch (error) {
            alert(`Something went wrong when creating a new lobby: \n${handleError(error)}`);
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
                const response1 = await api.get(`/users/?id=${id}`);
                const response2 = await api.get('/lobbies');
                setLobbies(response2.data);

                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                //await new Promise(resolve => setTimeout(resolve, 10000));

                // Get the returned users and update the state.
                setUser(response1.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response1.request.responseURL);
                console.log('status code:', response1.status);
                console.log('status text:', response1.statusText);
                console.log('requested data:', response1.data);

                // See here to get more data.
                console.log(response1);
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
            <BaseContainer>
                <div className="profilePage container">
                    <div className="profilePage titleContainer">
                        <text>Profile</text>
                    </div>
                    <img className="profilePage photo" src={profileIcon} alt=""/>
                    <div className="profilePage infos">
                        <div className="profilePage username">
                            <text>Username:</text>
                            {user.username}
                            <SecondaryButton
                                disabled={!(user.token === localStorage.getItem(`token`))}
                                onClick={() => history.push(`/editor/${user.id}`)}>
                                <MdOutlineEdit className="profilePage icon"/>
                            </SecondaryButton>

                        </div>
                        <div className="profilePage password">
                            <text>Password: ● ● ● ● ●</text>
                            <SecondaryButton
                                disabled={!(user.token === localStorage.getItem(`token`))}
                                onClick={() => history.push(`/editor/${user.id}`)}>
                                <MdOutlineEdit className="profilePage icon"/>
                            </SecondaryButton>
                        </div>
                    </div>

                    <div className="profilePage lobbyListContainer">
                        Choose a lobby
                        <ul className="profilePage lobbyList">
                            {lobbies.map(lobbyModel => (
                                <Link to={`/lobbies/${lobbyModel.id}/players/${user.id}`}>
                                <Lobby lobbyModel={lobbyModel}/>
                                </Link>
                            ))}
                        </ul>
                    </div>


                    <div className="profilePage buttonContainer">
                        <PrimaryButton onClick={() => createNewLobby()}>
                            Create new lobby
                        </PrimaryButton>
                    </div>
                </div>
            </BaseContainer>
        );
    }
    return content;
}
export default ProfilePage;