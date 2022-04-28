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
import {SecondaryButton} from "../ui/SecondaryButton";
import Card from "../../models/Card";

const ScoreBoardPlayer = ({user}) => (
    <div>
        <div className={ScoreBoard}>{user.username} : {user.score}</div>
    </div>
);


ScoreBoardPlayer.propTypes = {
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
    let [clickedCard, setClickedCard] = useState(new Card());

    const [btnColor, setBtnColor] = useState("red");
    const [buttonColor, setButtonColor] = useState("white");

    const {userId} = useParams();
    const {matchId} = useParams();
    const [timer, setTimer] = useState(null);


/*    const exit = async () => {
        try {
            let currentToken = localStorage.getItem('token');

            const response = await api.put(`/logout/?token=${currentToken}`)

            localStorage.removeItem('token');
            history.push('/login');
        } catch (error) {
            alert(`Something went wrong during the logout: \n${handleError(error)}`);
        }
        localStorage.removeItem('token');
        history.push('/users/login');
    }*/

    const selectCard = (cardText) => {
        console.log("CLICKED ON  A CARD!")
        try {
            let clickedCardObject=new Card();
            clickedCardObject.text=cardText;
            setClickedCard(clickedCardObject);

           /* // handle color changes
            btnColor === "red" ? setBtnColor("green") : setBtnColor("red");
            const newColor = buttonColor === "white" ? "yellow" : "white";
            setButtonColor(newColor);*/

        } catch (error) {
            alert(`Something went wrong setting clicked card: \n${handleError(error)}`);
        }
    };

    const confirmSelectedCard = async () => {
        try {
            const requestBody = JSON.stringify(clickedCard);

            console.log("CLICKED CARD IS THIS (REQUEST BODY)")
            console.log(requestBody)

            await api.put(`matches/${matchId}/white-card/selection`, requestBody) // does not work when called from useeffect
            history.push(`/matches/${matchId}/election/${userId}`);

        } catch (error) {
            alert(`Something went wrong during logging the chosen card into the backend: \n${handleError(error)}`);
        }
        localStorage.removeItem('token');
    };


    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get(`/matches/${matchId}/users`); //retrieves all user from specific match
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
                setBlackCard(blackCard_response.data);
                // See here to get more data.
                console.log(blackCard_response);
            } catch (error) {
                console.error(`Something went wrong while fetching the blackcard: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the black Card! See the console for details.");
            }
            try {
                //const response = await api.get(`/matches/${matchId}/users`); //retrieves all user from specific match
                const whiteCardResponse = await api.get(`/matches/${matchId}/hands/${userId}`) ///matches/0/hands/1
                setCards(whiteCardResponse.data)
                console.log(whiteCardResponse);
            } catch (error) {
                console.error(`Something went wrong while fetching your hand: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching your hand! See the console for details.");
            }

        }
        fetchData();
    }, []);

    //useEffect for Countdown
    useEffect( () =>{
        async function fetchData() {
            try {
                //gets countdown
                const timeResponse = await api.get(`/matches/${matchId}/countdown`);

                //sets time in frontend
                setTimer(timeResponse.data);

                if(timeResponse.data === 5){
                    console.log("clicked card when timer == 5:")
                    console.log(clickedCard)
                    //sends put request to backend to set chosenCard in backend and makes history.push to election
                     await confirmSelectedCard();
                }

            } catch (error) {
                console.error(`Something went wrong while fetching the timer: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the timer! See the console for details.");
            }
        };
        const t = setInterval(fetchData, 500);//this part is responsible for periodically fetching data
        return () => clearInterval(t); // clear
    }, [clickedCard]); // Use effect only checks clicked card once and logs the value, if the value changes later it takes it out of the log. Even if the value of the state variable changes in the mean time it will still use the logged value.
                            // To get the new state value one has to render the use effect every time the value changes -> therefor it needs to be in the [] in the end.


    let scoreboardContent = <Spinner/>;
    let cardContent = "nothing";

    if (users) {
        scoreboardContent = (
            <div className= "round scoreBoardPlayers">
                {users.map(user => (
                    <ScoreBoardPlayer user={user}/>
                ))}
            </div>
        );
    }

    if (cards) {
        cardContent = (
            <div className="round cards">
                {cards.map(card => (
                    <CardButton className="card whiteCard"
                        onClick={() => selectCard(card.text)}
                    >
                        {card.text}
                    </CardButton>
                ))}
            </div>
        )
    }


    return (
        <BaseContainer className="round container">
            <div className="round grid-container">
                <div className="round grid-content1">
                    <ScoreBoard className="round scoreBoard">
                        <h4>Score Board</h4>
                        {scoreboardContent}
                    </ScoreBoard>
                </div>
                <div className="round grid-content2">
                    <CardButton className="blackCard"
                    >
                        {blackCard}
                    </CardButton>
                </div>
                <div className="round grid-content3">
                    <div className= "round timer" >
                        {timer}
                    </div>
                </div>
                <div className="round grid-content4">
                    <div className="round card-list">
                        {cardContent}
                    </div>
                </div>
                <div className="round grid-content5">
                    <PrimaryButton
                      width="100%"
                      onClick={() => confirmSelectedCard()}
                    >
                        Select card, go to voting
                    </PrimaryButton>
                </div>
                <div className="round grid-content6">
                    <div className="round clickedCard">
                        <h2>Your current choice:</h2>
                        {clickedCard.text}
                    </div>
                </div>

            </div>
        </BaseContainer>
    );
}

export default Round;
