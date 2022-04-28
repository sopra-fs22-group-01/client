import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Round.scss";
import {CardButton} from "../ui/CardButton";
import {ScoreBoard} from "../ui/ScoreBoard";

const Player = ({user}) => (
    <div>
        <div className={ScoreBoard}>{user.username} : {user.score}</div>
    </div>
);
/*
const WhiteCard = ({card}) => (
    <div className="whitecard container">
        <div className="whitecard cardText">
            {card.text}
        </div>
    </div>
);
*/

Player.propTypes = {
    user: PropTypes.object
};

const Voting = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [users, setUsers] = useState(null);
    const [allChosenCards, setAllChosenCards] = useState(null);
    const [blackCard, setBlackCard] = useState(null);
    const [clickedCard, setClickedCard] = useState("your card");

    const {userId} = useParams();
    const {matchId} = useParams();

    const exit = async () => {
        try {
            let currentToken = localStorage.getItem('token');

            //const response = await api.put(`/logout/?token=${currentToken}`)

            localStorage.removeItem('token');
            history.push('/login');
        } catch (error) {
            alert(`Something went wrong during the logout: \n${handleError(error)}`);
        }
        localStorage.removeItem('token');
        history.push('/users/login');
    }

    const selectCard = async(card) => {
        try {
            setClickedCard(card)
            //await api.put(`matches/${matchId}/white-cards/${clickedCard.owner.id}`)
            //history.push(`/matches/${matchId}/election/${userId}`);

        } catch (error) {
            alert(`Something went wrong setting clicked card: \n${handleError(error)}`);
        }
    };
    const vote = async() => {
        try {
            const ownerId = clickedCard.owner.id
            await api.put(`matches/${matchId}/white-cards/${ownerId}`)
            history.push(`/matches/${matchId}/winner/${userId}`);

        } catch (error) {
            alert(`Something went wrong setting clicked card: \n${handleError(error)}`);
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
                //retrieves all user from specific match
                const response = await api.get(`/matches/${matchId}/users`);

                await new Promise(resolve => setTimeout(resolve, 1000));
                // Get the returned users and update the state.
                setUsers(response.data);
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the users of this specific match: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users for this specific match! See the console for details.");

            }
            try {
                //const response = await api.get(`/matches/${matchId}/users`); //retrieves all user from specific match
                const blackCard_response = await api.get(`/matches/${matchId}/blackCard`)
                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));
                setBlackCard(blackCard_response.data);
                // See here to get more data.
                console.log("BlackCard");
                console.log(blackCard_response.data);
            } catch (error) {
                console.error(`Something went wrong while fetching the blackcard: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the black Card! See the console for details.");
            }
            try {
                // get chosen cards from all players
                const chosenWhiteCardsResponse = await api.get(`/matches/${matchId}/election/white-cards`) ///matches/0/hands/1
                setAllChosenCards(chosenWhiteCardsResponse.data)
                console.log("ALL THE CHOSEN CARDS");
                console.log(chosenWhiteCardsResponse.data);
            } catch (error) {
                console.error(`Something went wrong while fetching the white cards: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the white cards! See the console for details.");
            }
        }
        fetchData();
        speechSynthesis.speak(new SpeechSynthesisUtterance(blackCard))
        allChosenCards.map((card) => speechSynthesis.speak(new SpeechSynthesisUtterance(card.text)));
    }, []);

    let scoreboardContent = <Spinner/>;
    let cardContent = "nothing";

    if (users) {
        scoreboardContent = (
            <div>
                {users.map(user => (
                    <Player user={user}/>
                ))}
            </div>
        );
    }

    if (allChosenCards) {
        cardContent = (
            <div className="round cards">
                {allChosenCards.map(card => (
                    <CardButton
                        onClick={() => selectCard(card)}
                    >
                        {card.text}
                    </CardButton>
                ))}
            </div>
        )
    }


    return (
        <BaseContainer className="round container">
            <h2>YOUR CURRENT CHOICE </h2>
            {clickedCard.text}
            <CardButton className="blackCard"
            >
                {blackCard}
            </CardButton>
            <ScoreBoard>
                <h4>Score Board</h4>
                {scoreboardContent}
            </ScoreBoard>
            <div className="round card-list">
                <h1>CHOSE YOUR FAVOURITE COMBINATION</h1>
                {cardContent}
                <PrimaryButton
                    width="100%"
                    onClick={() => exit()}
                >
                    Exit
                </PrimaryButton>
                <PrimaryButton
                    width="100%"
                    onClick={() => vote()}
                >
                    chose this card
                </PrimaryButton>

            </div>
        </BaseContainer>
    );
}

export default Voting;
