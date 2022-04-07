import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {Button} from 'components/ui/Button';
import {Card} from 'components/ui/Card';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/ProfilePage.scss";
import profileIcon from 'images/profileIcon2.png';



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


  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get(`/users/?id=${id}`);

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        //await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUser(response.data);

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
        alert("Something went wrong while fetching the user! See the console for details.");
      }
    }

    fetchData();
  }, []); //there cold be something in this array,  the code inside
  //of the useEffect hook only renders, if something in the array changes. Since the
  //empty array never changes, the code inside useEffect never runs again

  //ul = unordered list
  let content = <Spinner/>;

  if(user){
    content =(
    <div className="lobby">
      <div>
      <p>Hello {user.username} !</p>
      </div>
      <div className="profilePage button-container">
        <Button
          width="60%"
          onClick={() => history.push(`/lobby/players/${user.id}`)}
        >
          Go to Game Lobby
        </Button>

        <Button
          disabled={!(localStorage.getItem('token')=== user.token)}
          width="60%"
          onClick={() => history.push(`/editor/${user.id}`)}
        >
          Edit Username
        </Button>
      </div>
    </div>

    );
  }

  return (
    <BaseContainer className="profilePage container">
      <h2>Profile</h2>
      <div>
        <div>
          <img className="profilePage photo" src={profileIcon} alt=""/>
          <div className="avatar user-item">
            <Button
                width="100%"
            >
              avatar
            </Button>
          </div>

        </div>
      </div>
      {content}
    </BaseContainer>
  );
  // at line 100: <img className="profilePage photo" src={profileIcon} alt=""/>

}

export default ProfilePage;
