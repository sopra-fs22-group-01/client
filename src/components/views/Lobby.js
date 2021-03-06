import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import "styles/ui/PopUp.scss";
import "styles/ui/CardButton.scss"
import {CardButton} from "../ui/CardButton";





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
    const [createUpdate, setCreateUpdate]=useState("Create Custom Card");
    const [user, setUser] = useState(null);
    const [rules, setRules] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isOpen2, setIsOpen2] = useState(false);
    const [hasCustom, setHasCustom] = useState(null);
    const numberMaxPlayers = 5;

    const {userId} = useParams();
    const {lobbyId} = useParams(); // will be deleted after lobby creates match


    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const togglePopup2 = () => {
        setIsOpen2(!isOpen2);
    }

    const toggle_create_update=()=>{
        if (hasCustom!==null){
            setCreateUpdate("Update Custom Card")
        }
    }

    const make_ready_status_unready= async ()=>{
        if (user.isReady === "READY") {
            setReadyText("I am Ready")
            try {
                //why do we have here a requestBody?
                const requestBody = JSON.stringify(
                    {
                        "id": userId,
                        "isReady": user.isReady
                    }); //creates .json file

                const updateResponse = await api.put(`/lobbies/${lobbyId}/users/${userId}`, requestBody);
                //console.log(updateResponse)
            } catch (error) {
                alert(`Something went wrong during ready-status update: \n${handleError(error)}`);
            }
        }
    }

    const change_ready_status = async () => {

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
            //console.log(updateResponse)
        } catch (error) {
            alert(`Something went wrong during ready-status update: \n${handleError(error)}`);
        }
    }

    const unready_and_customCard = () =>{
        make_ready_status_unready();
        history.push(`/lobbies/${lobbyId}/players/${userId}/cards/custom`)
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


    const leaveLobby = async () => {
        try {
            const deletionResponse = await api.delete(`/lobbies/${lobbyId}/players/${userId}`);
            //console.log(deletionResponse)
        } catch (error) {
            alert(`Something went wrong during the deletion of the player from the lobby list: \n${handleError(error)}`);
        }
        history.push(`/lobbies/players/${userId}`);
    }

    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            let lobbyUsersResponse = null;
            //changing text on button from create to update depending on if there is a custom card
            toggle_create_update();

            // fetch all lobby players
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
                //console.log(lobby_status_response.data);
                if (lobby_stat === "All_Ready" && users.length >=3) {

                    try {
                        // create new Match using lobbyId (matchId receives same id)
                        const createdMatchResponse = await api.post(`/matches/${lobbyId}`); //starts a match
                        //console.log(createdMatchResponse.data);

                    } catch (error) {
                        console.error(`Something went wrong while creating a match: \n${handleError(error)}`);
                        console.error("Details:", error);
                        alert("Something went wrong while creating a match ! See the console for details.");
                    }


                    //increments the request counter (vote count) in backend
                    try{
                        await api.put(`/matches/${lobbyId}/synchronization`)
                        //console.log("incremented  vote count")
                    }
                    catch (error){
                        alert(`Something went wrong when incrementing the vote count in the backend: \n${handleError(error)}`);
                    }

                    history.push(`/lobbies/${lobbyId}/players/${userId}/loading`)
                }
            }catch (error) {
                console.error(`Something went wrong while fetching the lobby status: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the lobby status ! See the console for details.");
            }
            //console.log(hasCustom);
        }
        const t = setInterval(fetchData, 1200);//this part is responsible for periodically fetching data.
        return () => clearInterval(t); // clear
    }, [hasCustom,users]);

    let content = <Spinner/>;

    if (users) {
        content = (
            <div className="lobby">

                <h1>Lobby {lobbyId}</h1>
                <h2>{users.length}/{numberMaxPlayers} Players</h2>
                <h3> At least 3 players required to play, at most 5 possible</h3>

                <ul className="lobby user-list">
                    {users.map(user => (
                        <Link
                            style={
                                user.token === localStorage.getItem(`token`) ?
                                    ({ pointerEvents: 'none' }):({ pointerEvents: '' })
                            }
                            to={`/users/profile/${user.id}`}
                            onClick={()=>make_ready_status_unready()}
                        >
                            <Player user={user}/>
                        </Link>
                    ))}
                </ul>

                <div className="lobby grid-container">

                    <div className="lobby grid-content1">
                        <PrimaryButton className="lobby ready_button"
                                       onClick={() => change_ready_status()}
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
                            show custom card
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
                                       onClick={() => unready_and_customCard()}
                        >
                            {createUpdate}
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