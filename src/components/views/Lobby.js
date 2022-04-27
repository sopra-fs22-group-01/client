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
    <div className="player container">
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
    // use react-router-dom's hook to access the history
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [users, setUsers] = useState(null);
    const [readyText, setReadyText] = useState("I am Ready");
    const [user, setUser] = useState(null);
    const [rules, setRules] = useState(null);
    //const [readyIcon, setReadyIcon] = useState(<BiCircle/>);
    const {userId} = useParams();
    const {lobbyId} = useParams();
    const [matchId, setMatchId] = useState(null);

    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const logout = async () => {
        try {
            let currentToken = localStorage.getItem('token');

            const response = await api.put(`/logout/?token=${currentToken}`)
            localStorage.removeItem('token');
            history.push('/users/login');
        } catch (error) {
            alert(`Something went wrong during logout: \n${handleError(error)}`);
        }

        localStorage.removeItem('token');
        history.push('/users/login');
    }

    const isReady = async () => {

        if (user.isReady === "READY") {
            setReadyText("I am Ready")
        } else {
            setReadyText("Unready")
        }

        try {
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


    //comment
    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            setMatchId(1);

            try{const response = await api.get('/users');
                setUsers(response.data);
            }catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users ! See the console for details.");
            }
            try{
                const u = await api.get(`/users/?id=${userId}`);
                setUser(u.data);
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
            try{
                const lobby_status_response = await api.get(`/lobbies/${lobbyId}/status`);
                const lobby_stat = lobby_status_response.data;
                if (lobby_stat === "All_Ready") {
                    history.push(`/matches/${matchId}/hand/${user.id}`)
                }
            }catch (error) {
                console.error(`Something went wrong while fetching the lobby status: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the lobby status ! See the console for details.");
            } /*
            try {
                const response = await api.get('/users');
                const u = await api.get(`/users/?id=${userId}`);
                const rules = await api.get(`/rules`);
                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));


                // Get the returned users and update the state.
                setUsers(response.data);
                setUser(u.data);
                setRules(rules.data);
                setMatchId(1);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                // See here to get more data.
                console.log(response);
                                                                        // lobby/libbyId/status
                const lobby_status_response = await api.get(`/lobbies/${lobbyId}/status`);
                const lobby_stat = lobby_status_response.data;
                console.log(lobby_status_response);
                //setReadyText(gameStat)
                if (lobby_stat === "All_Ready") {
                    history.push(`/matches/${matchId}/hand/${user.id}`)
                }

            } catch (error) {
                console.error(`Something went wrong while fetching the users/user or rules: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users/user or rules ! See the console for details.");
            }*/


        }
        const t = setInterval(fetchData, 600);//this part is responsible for periodically fetching data
        return () => clearInterval(t); // clear

    }, [user]);

    let content = <Spinner/>;
    let popupContent = <Spinner/>
    if (users) {
        content = (
            <div className="lobby">
                <div className="lobby text-container">
                    <text>Lobby</text>
                </div>
                <ul className="lobby user-list">
                    {users.map(user => (
                        <Link to={`/users/profile/${user.id}`}>
                            <Player user={user}/>
                        </Link>
                    ))}
                </ul>
                <div className="lobby button_container">
                    <PrimaryButton className="lobby logout_button"

                        onClick={() => logout()}
                    >
                        Logout
                    </PrimaryButton>
                    <PrimaryButton className="lobby ready_button"
                                   onClick={() => isReady()}
                    >
                        {readyText}
                    </PrimaryButton>
                </div>
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