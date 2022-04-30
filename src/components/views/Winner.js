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

const ScoreBoardPlayer = ({user}) => (
    <div>
        <div className={ScoreBoard}>{user.username} : {user.score}</div>
    </div>
);


ScoreBoardPlayer.propTypes = {
    user: PropTypes.object
};

const Winner = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [users, setUsers] = useState(null);
    const [blackCard, setBlackCard] = useState(null);
    const [scores, setScores] = useState(null);


    const {userId} = useParams();
    const {matchId} = useParams();
    const [timer, setTimer] = useState(15);

    const exit = async () => {
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
    }

    const nextStep = async () => {
        try {
            // starts next round, or end Match if we're on the last round
            const response = await api.put(`/matches/${matchId}/rounds`)
            console.log("MATCHSTATUS INCOMING")
            console.log(response)
            if (response.data === "MatchOngoing"){
                await sleep(500);
                history.push(`/matches/${matchId}/hand/${userId}`);
            }
            else{
                history.push(`/matches/${matchId}/ranking/${userId}`)
            }

        } catch (error) {
            alert(`Something went wrong during the next step: \n${handleError(error)}`);
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {//retrieves all user from specific match
                const response = await api.get(`/matches/${matchId}/users`);
                // Get the returned users and update the state.
                setUsers(response.data);
                console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the users of this specific match: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users for this specific match! See the console for details.");

            }
            try {
                //retrieves blackCard
                const blackCard_response = await api.get(`/matches/${matchId}/blackCard`)
                setBlackCard(blackCard_response.data);
                console.log(blackCard_response);
            } catch (error) {
                console.error(`Something went wrong while fetching the blackcard: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the black Card! See the console for details.");
            }
            try {
                await sleep(800); //so the result gets not fetched before the result has been calculated propperly
                // retrieve winner cards
                const roundWinnerResponse = await api.get(`/matches/${matchId}/winner`) ///matches/0/hands/1
                setScores(roundWinnerResponse.data)
                console.log(roundWinnerResponse);
            } catch (error) {
                console.error(`Something went wrong while fetching the scores: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the scores! See the console for details.");
            }

        }
        fetchData();
    }, []);

    //useEffect for Countdown
    useEffect( () =>{
        async function fetchData() {
            try {

                //gets countdown
                await sleep(500);
                const timeResponse = await api.get(`/matches/${matchId}/countdown`);

                //sets time in frontend
                setTimer(timeResponse.data);

                //!= "X" makes sure doesnt try to vote before card got selected --> would try to imediately vote since timer first at 0
                //and needs some time to restart

                if(timeResponse.data === 0){
                    console.log("clicked card when timer == 0:")
                    //sends put request to backend to set chosenCard in backend and makes history.push to election
                    await nextStep();
                }

            } catch (error) {
                console.error(`Something went wrong while fetching the timer: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the timer! See the console for details.");
            }
        };
        const t = setInterval(fetchData, 500);//this part is responsible for periodically fetching data
        return () => clearInterval(t); // clear
    }, []); // Use effect only checks clicked card once and logs the value, if the value changes later it takes it out of the log. Even if the value of the state variable changes in the mean time it will still use the logged value.
    // To get the new state value one has to render the use effect every time the value changes -> therefor it needs to be in the [] in the end.

    let whiteCardContent = null;
    let winnersContent = null;

    if (scores) {
        whiteCardContent = (
            <div className="round cards">
                {scores.map(card => (
                    <CardButton className="card whiteCard"
                    >
                        {card.text}
                    </CardButton>
                ))}
            </div>
        )
    }
    if (scores) {
        winnersContent = (
            <div className="round user-list">
                {scores.map(card => (
                    <h1 className="round user-item"
                    >
                        {card.owner.username}
                    </h1>
                ))}
            </div>
        )
    }

    return (
        <BaseContainer className="round container">
            <div className="round grid-container">
                <div className="round grid-content1">
                </div>
                <div className="round grid-content2">
                    <h1 className="round user-item">WINNERS OF THIS ROUND</h1>
                    <h3 className="round user-item">{winnersContent}</h3>
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
                        {whiteCardContent}
                    </div>
                </div>
                <div className="round grid-content6">
                    <div className="round clickedCard">

                    </div>
                    <PrimaryButton
                        onClick={() => nextStep()}
                        //onClick={() => history.push(`/matches/${matchId}/next/${userId}`)}
                    >
                        next
                    </PrimaryButton>
                </div>
            </div>
        </BaseContainer>
    );
}

export default Winner;
