import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import 'styles/views/StartPage.scss';
import BaseContainer from "components/ui/BaseContainer";
import {api, handleError} from "../../helpers/api";


const NextPage = props => {
    const history = useHistory();
    const {userId} = useParams();
    const {matchId} = useParams();

    const [timer, setTimer] = useState(null);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    //useEffect for Countdown
    useEffect( () =>{
        async function fetchData() {
            try {
                await sleep(2000);
                //gets countdown
                const timeResponse = await api.get(`/matches/${matchId}/countdown`);

                //sets time in frontend
                setTimer(timeResponse.data);


                if(timeResponse.data === 0){
                    await startNewRound();
                }

            } catch (error) {
                console.error(`Something went wrong while fetching the timer: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the timer! See the console for details.");
            }
        };
        const t = setInterval(fetchData, 500);//this part is responsible for periodically fetching data
        return () => clearInterval(t); // clear
    }, []);


    const startNewRound = async () => {
        try {


            //await api.put(`/matches/${matchId}/rounds`) // does not work when called from useeffect
            history.push(`/matches/${matchId}/hand/${userId}`);

        } catch (error) {
            alert(`Something went wrong during logging the chosen card into the backend: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <div className="startpage container">
                <div className="startpage text-container">
                    <text>Next round >></text>
                </div>
                <div className="startpage button-container">
                    <div className="round grid-content3">
                        <div className= "round timer" >
                            {timer}
                        </div>
                    </div>
                    <PrimaryButton
                        onClick={() => startNewRound()}
                    >
                        next
                    </PrimaryButton>
                </div>
            </div>
        </BaseContainer>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default NextPage;
