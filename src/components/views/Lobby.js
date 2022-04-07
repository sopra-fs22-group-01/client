import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Lobby.scss";
import "styles/ui/PopUp.scss";
//import {Card} from "../ui/Card";
import {AiOutlineCheckCircle} from "react-icons/ai";
import {BsCircle} from "react-icons/bs";
import {BiCircle, BiCheckCircle} from "react-icons/bi";
import user from "../../models/User";



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



let readyIcon = <BiCircle/>;
const Player = ({user}) => (
    <div className="player container">
        <div className="player username">{user.username}</div>
        <div className="player id">
            {readyIcon}
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
    const [readyStat, setReadyStat] = useState("UNREADY");
    const[rules,setRules] = useState(null);
    //const [readyIcon, setReadyIcon] = useState(<BiCircle/>);
    const {id} = useParams();

    const [isOpen, setIsOpen] = useState(false);

    const togglePopup = () => {
        setIsOpen(!isOpen);
    }

    const logout = async () => {
        try{
            let currentToken = localStorage.getItem('token');

            const response = await api.put(`/logout/?token=${currentToken}`)


            localStorage.removeItem('token');
            history.push('/login');
        }
        catch (error){
            alert(`Something went wrong during the logout: \n${handleError(error)}`);
        }

        localStorage.removeItem('token');
        history.push('/login');
    }

    const isReady = async  () => {
        if (readyText === "I am Ready"){
            setReadyText("Unready")
            setReadyStat("READY")
            readyIcon = <BiCheckCircle/>
        }
        else{
            setReadyText("I am Ready")
            setReadyStat('UNREADY');
            readyIcon = <BiCircle/>;
        }
        try{
            const a =  null;
            //const requestBody = JSON.stringify({"id":user.id,"username":user.username, "date":user.date, "userStatus":user.userStatus, "readyStatus":{ready: readyStatus}}); //creates .json file (?)
            //const response = await api.put(`/users/`+ user.id, requestBody);
            //console.log(response)
        }
        catch (error) {
            alert(`Something went wrong during ready-status update: \n${handleError(error)}`);
        }

    }



    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get('/users');
                const u = await api.get(`/users/?id=${id}`);
                const rules = await api.get(`/rules`);
                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Get the returned users and update the state.
                setUsers(response.data);
                setUser(u.data);
                setRules(rules.data);

                // This is just some data for you to see what is available.
                // Feel free to remove it.
                console.log('request to:', response.request.responseURL);
                console.log('status code:', response.status);
                console.log('status text:', response.statusText);
                console.log('requested data:', response.data);

                // See here to get more data.
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users! See the console for details.");
            }
        }

        fetchData();
    }, []);

    let content = <Spinner/>;
    let popupContent = <Spinner/>
    if (users) {
        content = (
            <div className="lobby">
                <ul className="lobby user-list">
                    {users.map(user => (
                        <Link to={`/users/${user.id}`} style={{color: 'white'}}>
                            <Player user={user} key={user.id}/>
                        </Link>
                    ))}
                </ul>
                <Button
                    width="100%"
                    onClick={() => logout()}
                >
                    Logout
                </Button>
                <Button
                    width="100%"
                    onClick={() => isReady()}
                >
                    {readyText}
                </Button>

                <Button
                    width= "27%"
                    onClick={togglePopup}
                >
                    Rules

                </Button>

                {isOpen && <Popup
                  content={<>
                      <b>Game Rules</b>
                      {rules}
                      <p>Rule 2:................</p>
                      <p>Rule 3:................</p>
                      <button>Test button</button>
                  </>}
                  handleClose={togglePopup}
                />}

            </div>

        );
    }

    return (
        <BaseContainer className="lobby container">
            <h2>Lobby {readyStat}</h2>
            <p className="lobby paragraph">
                Get all users from secure endpoint:
            </p>
            {content}
        </BaseContainer>
    );
}

export default Lobby;