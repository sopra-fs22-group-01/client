import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import {useHistory, useParams} from 'react-router-dom';
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
        }
        fetchData();
    }, []);

    let rankingContent = null;

    if (ranking) {
        rankingContent = (
            <div className="round cards">
                {ranking.map(ranking => (
                    <CardButton className="card whiteCard"
                    >
                        {ranking.username}
                    </CardButton>
                ))}
            </div>
        )
    }

    return (
        <BaseContainer className="round container">
            <h1 className="round user-item">Victory Ceremony:</h1>
            <h3>{rankingContent}</h3>
            <PrimaryButton
                onClick={() => history.push(`/startpage`)}
            >
                Exit
            </PrimaryButton>
        </BaseContainer>
    );
}

export default MatchRanking;