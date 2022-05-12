import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Round.scss";


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

    if (ranking) {
        rankingContent = (
            <div className="round cards">
                {ranking.map(ranking => (
                    <h2>Rank {ranking.rank}: {ranking.username}..{ ".".repeat(10-ranking.username.length)}{ranking.score}</h2>
                ))}
            </div>
        )
    }
    return (
        <BaseContainer>
            <div className="startpage container">
                <div className="startpage text-container">
                    <text>END OF GAME</text>
                </div>
                <h1 className="round user-item">{rankingContent}</h1>
                <div className="startpage button-container">
                    <PrimaryButton
                        //onClick={() => history.push(`/users/profile/${userId}`)}
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

{/*

<BaseContainer className="round container">
            <div className="round grid-container">
                <div className="round grid-content1">
                    <h1 className="round user-item">WINNER IS</h1>
                </div>
                <div className="round grid-content2">
                <h1 className="round user-item">WINNER IS</h1>
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
                        width="100%"
                        onClick={() => confirmSelectedCard()}
                    >
                        Select card
                    </PrimaryButton>
                </div>

*/}