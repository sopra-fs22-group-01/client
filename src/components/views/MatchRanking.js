import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/MatchRanking.scss";

const Ranking = ({ranking}) => (
    <div className="ranking grid-container">
        <div className="ranking rank">
            Rank {ranking.rank}:
        </div>
        <div className="ranking username">
            {ranking.username}
        </div>
        <div className="ranking score">
            Points: {ranking.score}
        </div>
    </div>
);



const MatchRanking = () => {
    const history = useHistory();
    const [ranking, setRanking] = useState(null);

    const {userId} = useParams();
    const {matchId} = useParams();


    const resetPlayerScoreAndGetToLobbies = async () => {
        try{
            //resets the Score of the user, so after the game, when joining a new game, the score will be back to 0
            await api.delete(`/users/${userId}/scores`)
        }
        catch (error){
            alert(`Something went wrong when resetting the users score in the backend: \n${handleError(error)}`);
        }
        history.push(`/lobbies/players/${userId}`)

    }

    useEffect(() => {
        async function fetchData() {
            try {
                //retrieves the ranking
                const response = await api.get(`/matches/${matchId}/scores`);
                setRanking(response.data);
                console.log("Success Fetch Scores")
                console.log(response);
            } catch (error) {
                alert("Something went wrong while fetching the ranking for this specific match! See the console for details.");
                console.log("Error Fetch Scores", error)
            }
        }
        fetchData();
    }, []);

    let rankingContent = null;

    /*if (ranking) {
        rankingContent = (
            <div className="matchRanking playerScores">
                {ranking.map(ranking => (
                    <h2>Rank {ranking.rank}: {ranking.username}{ ".".repeat(30-ranking.username.length)}{ranking.score}</h2>
                ))}
            </div>
        )
    }*/

    if (ranking){
        rankingContent=(
            <ul className="matchRanking user-list">
                {ranking.map(ranking => (
                        <Ranking ranking={ranking}/>
                ))}
            </ul>
        )
    }

    return (
        <BaseContainer>
            <div className="matchRanking base-container">
                <div className="matchRanking text-container">
                    <text>END OF GAME</text>
                </div>
                {rankingContent}
                <div className="matchRanking button-container">
                    <PrimaryButton className="matchRanking back-to-lobby-button"
                        onClick={() => resetPlayerScoreAndGetToLobbies()}
                    >
                        back to lobbies
                    </PrimaryButton>
                </div>
            </div>
        </BaseContainer>
    );
}
export default MatchRanking;
