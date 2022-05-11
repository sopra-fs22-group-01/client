import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
//import {Button} from 'components/ui/Button';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import "styles/ui/PopUp.scss";
import {MdOutlineModeEditOutline} from "react-icons/ai";
import {AiOutlineCheckCircle} from "react-icons/ai";
import {BsCircle} from "react-icons/bs";
import {BiCircle, BiCheckCircle} from "react-icons/bi";
import user from "../../models/User";
import {CardButton} from "../ui/CardButton";
import {SecondaryButton} from "../ui/SecondaryButton";
// test



const Popup = props => {
    return (
        <div className="popup-box">
            <div className="box">
                <span className="close-icon" onClick={props.handleClose}>x</span>
                {props.content}
            </div>
        </div>
    );
};


const Player = ({user}) => (
    <div className="player playerContainer">
        <div className="player username">{user.username}</div>
        <div className="player ready_status">
            {user.isReady}
        </div>
    </div>
);

Player.propTypes = {
    user: PropTypes.object
};

const Lobby = () => {
    // use react-router-dom's hook to access the history.
    const history = useHistory();

    const [users, setUsers] = useState(null);
    const [readyText, setReadyText] = useState("I am Ready");
    const [user, setUser] = useState(null);
    const [rules, setRules] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [hasCustom, setHasCustom] = useState(false);

    //const [readyIcon, setReadyIcon] = useState(<BiCircle/>);
    const {userId} = useParams();
    const {lobbyId} = useParams(); // will be deleted after lobby creates match


    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const togglePopup2 = () => {
        setIsOpen2(!isOpen2);
    }

    const isReady = async () => {

        if (user.isReady === "READY") {
            setReadyText("I am Ready")
        } else {
            setReadyText("Unready")
        }

        try {
            //why do we have here a requestBody?
            const requestBody = JSON.stringify(
                {
                    "id": userId,
                    "isReady": user.isReady
                }); //creates .json file

            const updateResponse = await api.put(`/lobbies/${lobbyId}/users/${userId}`, requestBody);
            console.log(updateResponse)
        } catch (error) {
            alert(`Something went wrong during ready-status update: \n${handleError(error)}`);
        }

    }

    /*
    //Removes a user from the list of all current players in the lobby
    @DeleteMapping("/lobbies/{lobbyId}/players")
    public void deleteUserFromLobby(@PathVariable long lobbyId, @RequestBody UserPostDTO userPostDTO){
    */
    const leaveLobby = async () => {
        try {
            const deletionResponse = await api.delete(`/lobbies/${lobbyId}/players/${userId}`);
            console.log(deletionResponse)
        } catch (error) {
            alert(`Something went wrong during the deletion of the player from the lobby list: \n${handleError(error)}`);
        }
        history.push(`/users/profile/${userId}`);
    }


    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            console.log("LOBBY ID FROM LOBBY.JS", lobbyId)

            // fetch all match players
            try{
                const response = await api.get(`lobbies/${lobbyId}/users`);
                setUsers(response.data);
            }catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users ! See the console for details.");
            }
            try{ // fetch current player
                const userResponse = await api.get(`/users/?id=${userId}`);
                setUser(userResponse.data);
                setHasCustom(userResponse.data.customWhiteText);
            }catch (error) {
                console.error(`Something went wrong while fetching the current user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the current user ! See the console for details.");
            }
            try{
                const rules = await api.get(`/rules`);
                setRules(rules.data);
            }catch (error) {
                console.error(`Something went wrong while fetching the rules: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the rules ! See the console for details.");
            }
            try{ // get lobby status
                const lobby_status_response = await api.get(`/lobbies/${lobbyId}/status`); //
                const lobby_stat = lobby_status_response.data;
                if (lobby_stat === "All_Ready") {
                    history.push(`/lobbies/${lobbyId}/players/${userId}/loading`)
                }
            }catch (error) {
                console.error(`Something went wrong while fetching the lobby status: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the lobby status ! See the console for details.");
            }
        }
        const t = setInterval(fetchData, 600);//this part is responsible for periodically fetching data.
        return () => clearInterval(t); // clear
    }, [user]);

    let content = <Spinner/>;
    let popupContent = <Spinner/>
    if (users) {
        content = (
            <div className="lobby">
                    <h1>Lobby {lobbyId}</h1>
                <ul className="lobby user-list">
                    {/*
                    {users.map(user => (
                        {user.token === localStorage.getItem(`token`) ? (
                                <div>
                                    {user.username}
                                </div>
                            ) : (
                                <Link
                                    to={`/users/profile/${user.id}`}
                                >
                                    <Player user={user}/>
                                </Link>
                            )}
                    ))}*/}

                    {users.map(user => (
                        <Link
                            style={
                                user.token === localStorage.getItem(`token`) ?
                                    ({ pointerEvents: 'none' }):({ pointerEvents: '' })
                        }
                            to={`/users/profile/${user.id}`}
                        >
                            <Player user={user}/>
                        </Link>
                    ))}

                </ul>
                <div className="lobby button_container">
                    <PrimaryButton className="lobby ready_button"
                                   onClick={() => isReady()}
                    >
                        {readyText}
                    </PrimaryButton>
                    <PrimaryButton className="lobby leave_button"
                                   onClick={() => leaveLobby()}
                    >
                        Leave Lobby
                    </PrimaryButton>
                </div>

                {/*-------------------CUSTOM CARDS----------------------------------------------------------------*/}
                <PrimaryButton className="primary-button small_version"
                               onClick={togglePopup2}
                               disabled={!hasCustom}
                >
                    see your custom card
                </PrimaryButton>

                <div className="lobby game_rules">
                    {isOpen2 && <Popup
                        content={<>
                            <b>Your current custom card</b>
                            <div>______________________</div>
                            <CardButton>
                                {user.customWhiteText}
                            </CardButton>
                        </>}
                        handleClose={togglePopup2}
                    />}
                </div>
                <PrimaryButton className="primary-button small_version"
                        onClick={() => history.push(`/lobbies/${lobbyId}/players/${userId}/cards/custom`)}
                        >
                        create new custom card
                </PrimaryButton>

                {/*-------------------RULES----------------------------------------------------------------*/}
                <PrimaryButton className="lobby rules_button"
                               onClick={togglePopup}
                >
                    Rules
                </PrimaryButton>

                <div className="lobby game_rules">
                    {isOpen && <Popup
                        content={<>
                            <b>Game Rules</b>
                            <div>
                                {rules.map((line, index) =>
                                    (
                                        <p key={index}>{line}</p>
                                    )
                                )}
                            </div>
                            <button>Test button</button>
                        </>}
                        handleClose={togglePopup}
                    />}
                </div>
            </div>

        );
    }

    return (
        <BaseContainer className="lobby container">
            {content}
        </BaseContainer>
    );
}



export default Lobby;