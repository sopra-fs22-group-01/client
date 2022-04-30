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
                    <li> {ranking.rank}. {ranking.username}         {ranking.score}</li>
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
                <h2 className="round user-item">{rankingContent}</h2>
                <div className="startpage button-container">
                    <PrimaryButton
                        onClick={() => history.push(`/startpage`)}
                    >
                        Startpage
                    </PrimaryButton>
                </div>
            </div>
        </BaseContainer>
    );


}

export default MatchRanking;