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
import "styles/ui/CardButton.scss"
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
    const numberMaxPlayers = 5;

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

    const checkIfUserInLobby = (userList, trueId) =>{
        const length = userList.length;
        for (var i = 0; i < length; i++){
            //console.log("check for userId: ", i)
            if (userList[i].id === trueId){
                //console.log("return true, user in this lobby with Userid= ", trueId)
                return true;
            }
        }
        //console.log("user is not in lobby, return false")
        return false;
    }

    const findLobbyOfUser = (lobbyList, trueUserId) =>{
        const lobbyListLength = lobbyList.length;
        // iterate through each lobbyId
        for (var i = 0; i < lobbyListLength; i++){
            //console.log("check for userId: ", i)
            const lobbyLength = lobbyList[i].length
            // iterate through each user in a lobby
            for (var j = 0; i > lobbyLength; j++){
                if (lobbyList[i].currentPlayers[j].id === trueUserId){
                    return i
                }
            }
        }
        //console.log("user is not in any lobby, return false")
        return false;
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
        history.push(`/lobbies/players/${userId}`);
    }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            let lobbyUsersResponse = null;
            let lobbyListResponse = null;
            try{
                const response2 = await api.get('/lobbies');
                lobbyListResponse = response2.data
                //console.log("ALL LOBBIES RESPONSE")
                //console.log(lobbyListResponse)
            }catch (error) {
                console.error(`Something went wrong while fetching all lobbies: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching all lobbies ! See the console for details.");
            }
            // fetch all match players
            try{
                const response = await api.get(`lobbies/${lobbyId}/users`);
                setUsers(response.data);
                lobbyUsersResponse = response.data
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
            try{ // fetch true player
                const t = localStorage.getItem("token")
                const true_UserResponse = await api.get(`/users/${t}`);
                //console.log("TRUE USER DATA")
                //console.log(true_UserResponse)
                const true_UserId = true_UserResponse.data.id

                //const true_lobbyId = findLobbyOfUser(lobbyListResponse, true_UserId)
               // console.log("true lobbyId: ", true_lobbyId)

                // if trueUserId != Id || trueLobbyId != lobbyId
                if (true_UserId !== userId){
                    history.push(`/lobbies/${lobbyId}/players/${true_UserId}`)
                }
                if (! checkIfUserInLobby(lobbyUsersResponse, true_UserId)){
                    try{ // deletes the user from all lobbies
                        const deletionResponse = await api.delete(`/lobbies/-1/players/${userId}`);
                    }catch{
                        console.error(`Something went wrong while deleting user from all lobbies: }`);
                        alert("Something went wrong while deleting user from all lobbies");
                    }

                    history.push(`/lobbies/players/${true_UserId}`)
                }
                //history.push(`/users/profile/${true_id}`)

            }catch (error) {
                console.error(`Something went wrong while fetching the true user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the true user! See the console for details.");
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

    if (users) {
        content = (
            <div className="lobby">

                <h1>Lobby {lobbyId}</h1>
                <h2>{users.length}/{numberMaxPlayers} Players</h2>

                <ul className="lobby user-list">
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


                {/*buttons in flex-grid*/}
                <div className="lobby grid-container">

                    <div className="lobby grid-content1">
                        <PrimaryButton className="lobby ready_button"
                                       onClick={() => isReady()}
                        >
                            {readyText}
                        </PrimaryButton>
                    </div>
                    <div className="lobby grid-content2">
                    </div>

                    <div className="lobby grid-content3">
                        <PrimaryButton className="lobby leave_button"
                                       onClick={() => leaveLobby()}
                        >
                            Leave Lobby
                        </PrimaryButton>
                    </div>

                    <div className="lobby grid-content3">

                    </div>
                    <div className="lobby grid-content4">
                        <PrimaryButton className="lobby small_button"
                                       onClick={togglePopup2}
                                       disabled={!hasCustom}
                        >
                            your custom card
                        </PrimaryButton>

                        <div className="lobby game_rules">
                            {isOpen2 && <Popup
                                content={<>
                                    <b>Your current custom card</b>
                                    <div>______________________</div>

                                    <CardButton  className="cardButton inActiveWhiteCard">
                                        {user.customWhiteText}
                                    </CardButton>
                                </>}
                                handleClose={togglePopup2}
                            />}
                        </div>
                        <PrimaryButton className="lobby small_button"
                                       onClick={() => history.push(`/lobbies/${lobbyId}/players/${userId}/cards/custom`)}
                        >
                            create custom card
                        </PrimaryButton>
                        <PrimaryButton className="lobby small_button"
                                       onClick={togglePopup}
                        >
                            Rules
                        </PrimaryButton>
                    </div>

                </div>

                <div className="lobby game_rules">
                    {isOpen && <Popup
                        content={<>
                            <h2>Game Rules</h2>
                            <div>
                                {rules.map((line, index) =>
                                    (
                                        <h3 key={index}>{line}</h3>
                                    )
                                )}
                            </div>
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