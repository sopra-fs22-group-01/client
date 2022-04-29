import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Round.scss";
import {CardButton} from "../ui/CardButton";
import {ScoreBoard} from "../ui/ScoreBoard";

const ScoreBoardPlayer = ({user}) => (
    <div>
        <div className={ScoreBoard}>{user.username} : {user.score}</div>
    </div>
);


ScoreBoardPlayer.propTypes = {
    user: PropTypes.object
};

const MatchRanking = () => {
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
                // retrieve winner cards
                const scoresResponse = await api.get(`/matches/${matchId}/winner`) ///matches/0/hands/1
                setScores(scoresResponse.data)
                console.log(scoresResponse);
            } catch (error) {
                console.error(`Something went wrong while fetching the scores: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the scores! See the console for details.");
            }

        }
        fetchData();
    }, []);

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
            <h1 className="round user-item">Victory Ceremony:</h1>
            <h3>{winnersContent}</h3>
            <PrimaryButton
                onClick={() => history.push(`/startpage`)}
            >
                Exit
            </PrimaryButton>
        </BaseContainer>
    );
}

export default MatchRanking;