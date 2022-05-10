import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import "styles/views/Voting.scss";
import {CardButton} from "../ui/CardButton";
import {ScoreBoard} from "../ui/ScoreBoard";
import Card from "../../models/Card";
import {FiVolume2} from "react-icons/fi";
import Sitcom_Laugh_Track from 'images/Sitcom_Laugh_Track.mp3';

import { BsEmojiLaughing } from "react-icons/bs";
import {SecondaryButton} from "../ui/SecondaryButton";

const Player = ({user}) => (
    <div>
        <div className={ScoreBoard}>{user.username} : {user.score}</div>
    </div>
);

Player.propTypes = {
    user: PropTypes.object
};

const Voting = () => {
    // use react-router-dom's hook to access the history
    const history = useHistory();

    // def ine a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [users, setUsers] = useState(null);
    const [allChosenCards, setAllChosenCards] = useState(null);
    const [blackCard, setBlackCard] = useState(null);
    const defaultCard = new Card();
    defaultCard.text = "X"
    const [clickedCard, setClickedCard] = useState(defaultCard);

    const [usedLaugh, setUsedLaugh] = useState(false);

    const [read,setRead] = useState(false);
    const {userId} = useParams();
    const {matchId} = useParams();
    const [timer, setTimer] = useState(null);

    let audio = new Audio(Sitcom_Laugh_Track);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const laugh = () => {
        if (clickedCard.text !== "X"){
            setUsedLaugh(true);
            audio.volume = 0.25;
            audio.play();
        }
        else{
            alert("Vote for a card first!")
        }

    }

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
            console.log("SELECT CARD")
            console.log(card)
            setClickedCard(card)

        } catch (error) {
            alert(`Something went wrong setting clicked card: \n${handleError(error)}`);
        }
    };
    const voteAndStartCountdown = async() => {
        if (usedLaugh.toString() === "true"){
            try{
                const ownerId = clickedCard.owner.id
                await api.put(`matches/${matchId}/white-cards/${ownerId}`)
                console.log("VOTED 1/2 X")

                await api.put(`matches/${matchId}/white-cards/${ownerId}`)
                console.log("VOTED 2X")
            }catch (error) {
                alert(`Something went wrong with supervoting the card: \n${handleError(error)}`);
            }

        }
        else{
            try {//adds a point to the clicked card (every user does this)
                const ownerId = clickedCard.owner.id
                await api.put(`matches/${matchId}/white-cards/${ownerId}`)
                console.log("VOTED 1X")

            } catch (error) {
                alert(`Something went wrong with voting the card: \n${handleError(error)}`);
            }
        }


        //starts countdown of next view (winner view)
        try{
            await api.put(`/matches/${matchId}/countdown/roundwinners`)
        }
        catch (error){
            alert(`Something went wrong when starting the selection timer in the backend: \n${handleError(error)}`);
        }

        history.push(`/matches/${matchId}/winner/${userId}`);

    };

    function replaceCharwithChar(str,old, new_chr) { // replaces in str at idx with chr
        //if(index > str.length-1) return str;
        const cleanedWhite = new_chr
        const idx = str.indexOf(old);

        return str.substring(0,idx) + "\""+  cleanedWhite + "\""+ str.substring((idx+old.length)+1);

    }

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
                // retrieve Black card
                const blackCard_response = await api.get(`/matches/${matchId}/blackCard`)
                // delays continuous execution of an async operation for 1 second.
                // This is just a fake async call, so that the spinner can be displayed
                // feel free to remove it :)
                await new Promise(resolve => setTimeout(resolve, 1000));
                setBlackCard(blackCard_response.data);
                console.log(blackCard_response);
            } catch (error) {
                console.error(`Something went wrong while fetching the blackcard: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the black Card! See the console for details.");
            }
            try {
                // get all chosen cards
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
    }, []);

    //useEffect for Countdown
    useEffect( () =>{
        async function fetchData() {
            try {
                //gets countdown
                const timeResponse = await api.get(`/matches/${matchId}/countdown/voting`);

                //sets time in frontend
                setTimer(timeResponse.data);

                //!= "X" makes sure doesnt try to vote before card got selected --> would try to imediately vote since timer first at 0
                //and needs some time to restart
                if(timeResponse.data === 0 && clickedCard.text != "X"){
                    console.log("clicked card when timer == 0:")
                    console.log(clickedCard)
                    //sends put request to backend to set chosenCard in backend and makes history.push to election
                    await voteAndStartCountdown();
                }

            } catch (error) {
                console.error(`Something went wrong while fetching the timer: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the timer! See the console for details.");
            }


        };
        const t = setInterval(fetchData, 500);//this part is responsible for periodically fetching data
        return () => clearInterval(t); // clear
    }, [clickedCard, usedLaugh]); // Use effect only checks clicked card once and logs the value, if the value changes later it takes it out of the log. Even if the value of the state variable changes in the mean time it will still use the logged value.
    // To get the new state value one has to render the use effect every time the value changes -> therefor it needs to be in the [] in the end.


    let scoreboardContent = <Spinner/>;
    let cardContent = "waiting for cards";

    if (blackCard && allChosenCards && clickedCard.owner == null && !read){
        const blank = blackCard.toString().indexOf("____")
        if (blank === -1){ // if there is no underscore (questions f.e) -> read normally
            speechSynthesis.speak(new SpeechSynthesisUtterance(blackCard.toString()))
            allChosenCards.map((card) => speechSynthesis.speak(new SpeechSynthesisUtterance(card.text)));
        }
        else{
            //speechSynthesis.speak(new SpeechSynthesisUtterance(blackCard.toString()))
            //allChosenCards.map((card) => speechSynthesis.speak(new SpeechSynthesisUtterance(card.text)));
            allChosenCards.map((card) => speechSynthesis.speak(new SpeechSynthesisUtterance(replaceCharwithChar(blackCard.toString(), "____", card.text))));
        }
        setRead(true);
    }

    if (users) {
        scoreboardContent = (
            <div>
                {users.map(user => (
                    <Player user={user}/>
                ))}
            </div>
        );
    }

    let laughingButton = null;
    if (allChosenCards) {
        laughingButton = <SecondaryButton
            onClick={() => laugh()}
            disabled={usedLaugh}>
            <BsEmojiLaughing
                className="voting laughingButton"
            >
            </BsEmojiLaughing>
        </SecondaryButton>
        cardContent = (
            <div className="round cards">
                {allChosenCards.map(card => (
                    <CardButton
                        onClick={() => selectCard(card)}
                        disabled={usedLaugh}
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
                <h2>YOUR CURRENT CHOICE: (used laugh: {usedLaugh.toString()})</h2>
                <h2>{clickedCard.text}</h2>
                    <div className= "round timer" >
                        {timer}
                    </div>
            </div>
            <div className="round grid-content4">
                <div className="round card-list">
                    <h1>CHOSE YOUR FAVOURITE COMBINATION</h1>

                    <FiVolume2 fontSize="3em"/>
                    {cardContent}
                    {laughingButton}
                    {/*
                    <SecondaryButton
                        onClick={() => laugh()}
                        disabled={usedLaugh}>
                        <BsEmojiLaughing
                            className="voting laughingButton"
                        >
                        </BsEmojiLaughing>
                    </SecondaryButton>
                    */}
                    <h4>(once you chose to supervote, you can't change it anymore)</h4>
                </div>
            </div>
            <div className="round grid-content6">
                <PrimaryButton
                    width="100%"
                    onClick={() => exit()}
                >
                    Exit
                </PrimaryButton>
               {/*     <PrimaryButton
                        width="100%"
                        onClick={() => vote()}
                    >
                        chose this card
                    </PrimaryButton>*/}

            </div>
            </div>
        </BaseContainer>
    );
}

export default Voting;
