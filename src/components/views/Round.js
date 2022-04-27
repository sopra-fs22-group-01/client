import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Round.scss";
import {Card} from "../ui/Card";
import {ScoreBoard} from "../ui/ScoreBoard";

const Player = ({user}) => (
  <div >
    <div className={ScoreBoard} >{user.username} : {user.score}</div>

    </div>
);

const Whitecard = ({card}) => (
  <div className="whitecard container">
    <div className="whitecard username">{card.text}</div>
    <div className="whitecard id">id: {card.id}</div>
  </div>
);


Player.propTypes = {
  user: PropTypes.object
};

const Round = () => {
  // use react-router-dom's hook to access the history
  const history = useHistory();

  // define a state variable (using the state hook).
  // if this variable changes, the component will re-render, but the variable will
  // keep its value throughout render cycles.
  // a component can have as many state variables as you like.
  // more information can be found under https://reactjs.org/docs/hooks-state.html
  const [users, setUsers] = useState(null);
  const [cards, setCards] = useState(null);
  const [blackCard, setBlackCard] = useState(null);
  const {userId} = useParams();
  const {matchId} = useParams();

  const exit = async () => {
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
    history.push('/users/login');
  }

  // the effect hook can be used to react to change in your component.
  // in this case, the effect hook is only run once, the first time the component is mounted
  // this can be achieved by leaving the second argument an empty array.
  // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get(`/users`);
        const blackCard_response = await api.get(`/matches/${matchId}/blackCard`)
        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUsers(response.data);
        setBlackCard(blackCard_response.data);

        // See here to get more data.
        console.log(response);
        console.log(blackCard_response);
      } catch (error) {
        console.error(`Something went wrong whle fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users or the black Card! See the console for details.");
      }
    }
    fetchData();
  }, []);

  let content = <Spinner/>;
  let content2 = null;

  if (users) {
    content = (
      <div className="round">
          {users.map(user => (

              <Player user={user} key={user.id}/>

          ))}
      </div>
    );
  }

  if (cards) {
    content2 = (
      <div className="round">
        <dic className="round card-list">
          {cards.map(card => (
            <Card style={{color: 'red'}}>
              <Whitecard card={card} key={card.text}/>
            </Card>
          ))}
        </dic>
      </div>
    );
  }

  return (
    <BaseContainer className="round container">
      <Card className="blackC"
      >
          {blackCard}
      </Card>
      <ScoreBoard>
        <h4>Score Board</h4>
        {content}
      </ScoreBoard>
      <div className="round card-list">

          <Card className="whiteC">1</Card>
          <Card className="whiteC">2</Card>
          <Card className="whiteC">3</Card>
          <Card className="whiteC">4</Card>
          <Card className="whiteC">5</Card>
          <Card className="whiteC">1</Card>
          <Card className="whiteC">1</Card>
          <Card className="whiteC">1</Card>
          <Card className="whiteC">1</Card>
          <Card className="whiteC">10</Card>

        <PrimaryButton
          width="100%"
          onClick={() => exit()}
        >
          Exit
        </PrimaryButton>
      </div>
    </BaseContainer>
  );

}

export default Round;
