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
    //useEffect for Countdown
    useEffect( () =>{
        async function fetchData() {
            try {
                //gets countdown
                const timeResponse = await api.get(`/matches/${matchId}/countdown`);

                //sets time in frontend
                setTimer(timeResponse.data);

                /* SHOULD REDIRECT TO NEW HAND AFTER 3 SECONDS
                if(timeResponse.data === 0){
                    history.push(`/matches/${matchId}/hand/${userId}`)
                }
                */

            } catch (error) {
                console.error(`Something went wrong while fetching the timer: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the timer! See the console for details.");
            }
        };
        const t = setInterval(fetchData, 500);//this part is responsible for periodically fetching data
        return () => clearInterval(t); // clear
    }, []);

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
                        onClick={() => history.push(`/matches/${matchId}/hand/${userId}`)}
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
