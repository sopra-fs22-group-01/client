import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
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

const Winner = () => {
    const history = useHistory();
    const [users, setUsers] = useState(null);
    const [blackCard, setBlackCard] = useState(null);
    const [scores, setScores] = useState(null);
    const [roundNumber,setRoundNumber]=useState(null);


    const {userId} = useParams();
    const {matchId} = useParams();
    const [timer, setTimer] = useState(15);
    const [read,setRead] = useState(false);


    useEffect(() => {
        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response = await api.get(`/matches/${matchId}/users`);
                // Get the returned users and update the state.
                setUsers(response.data);
                // console.log(response);
            } catch (error) {
                console.error(`Something went wrong while fetching the users of this specific match: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the users for this specific match! See the console for details.");

            }
            try{ // fetch true player and redirect to correct userId
                const t = localStorage.getItem("token")
                const true_UserResponse = await api.get(`/users/${t}`);
                //console.log("TRUE USER DATA")
                //console.log(true_UserResponse)
                const true_UserId = true_UserResponse.data.id

                if (true_UserId !== userId){
                    history.push(`/matches/${matchId}/winner/${true_UserId}`)
                }

            }catch (error) {
                console.error(`Something went wrong while fetching the true user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the true user! See the console for details.");
            }
            try {
                //retrieves blackCard
                const blackCard_response = await api.get(`/matches/${matchId}/blackCard`)
                setBlackCard(blackCard_response.data);
            } catch (error) {
                console.error(`Something went wrong while fetching the blackcard: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the black Card! See the console for details.");
            }
            try {

                // retrieve winner cards
                const roundWinnerResponse = await api.get(`/matches/${matchId}/winner`) ///matches/0/hands/1
                setScores(roundWinnerResponse.data)
            } catch (error) {
                console.error(`Something went wrong while fetching the scores: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the scores! See the console for details.");
            }

            try {
                //updates player scores
               await api.put(`/matches/${matchId}/scores/${userId}`)

            } catch (error) {
                console.error(`Something went wrong while updating  the player scores: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while updating the player scores! See the console for details.");
            }
            try {
                // retrieve round number
                const roundNumberResponse = await api.get(`/matches/${matchId}/roundnumbers`)
                setRoundNumber(roundNumberResponse.data)
            } catch (error) {
                console.error(`Something went wrong while fetching the round number: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the round number! See the console for details.");
            }


        }
        fetchData();
    }, []);

    //useEffect for Countdown
    useEffect( () =>{
        async function fetchData() {
            try {

                //gets countdown
                const timeResponse = await api.get(`/matches/${matchId}/countdown/roundwinners`);

                //sets time in frontend
                setTimer(timeResponse.data);

                //!= "X" makes sure doesnt try to vote before card got selected --> would try to imediately vote since timer first at 0
                //and needs some time to restart

                if(timeResponse.data === 0){
                    // console.log("clicked card when timer == 0:")
                    //sends put request to backend to set chosenCard in backend and makes history.push to election
                    history.push(`/matches/${matchId}/round/end/${userId}`);
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
            <div>
                {scores.map(card => (
                    <CardButton className="cardButton inActiveWhiteCard">
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

    function replaceCharwithChar(str,old, new_chr) { // replaces in str at idx with chr
        //if(index > str.length-1) return str;
        const cleanedWhite = new_chr
        const idx = str.indexOf(old);

        const text = str.substring(0,idx) + "\""+  cleanedWhite + "\" "+ str.substring((idx+old.length)+1);

        return text;

    }

    function questionText(cardText){
        let blackCardText = blackCard.toString();
        return blackCardText + cardText;
    }

    function textToRead(){
        let text = ""
        const blank = blackCard.toString().indexOf("____")
        if (blank === -1){

            scores.map(card => text += questionText(card.text));
        }
        else {
            scores.map(card => text += replaceCharwithChar(blackCard.toString(), "____", card.text));
        }
        return text;
    }

    if (blackCard && scores && !read ){
        var synth = window.speechSynthesis;
        let utter = new SpeechSynthesisUtterance();
        utter.lang = 'en-US';
        utter.text = textToRead();
        synth.speak(utter);
        setRead(true);
    }

    return (
        <BaseContainer className="round container">
            <div className="round grid-container">
                <div className="round grid-content1">
                </div>
                <div className="round grid-content2">
                    <h1 className="round user-item">WINNER(S) OF ROUND {roundNumber}</h1>
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
            </div>
        </BaseContainer>
    );
}

export default Winner;
