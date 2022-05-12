import React, {useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {api, handleError} from "../../helpers/api";

const EndOfRound = props => {
    const history = useHistory();
    const {userId} = useParams();
    const {matchId} = useParams();

    const nextStep = async () => {
        try {
            // starts next round, or end Match if we're on the last round
            const response = await api.get(`/matches/${matchId}/rounds`)
            console.log(response)
            if (response.data === "MatchOngoing"){
                try{
                    await api.put(`/matches/${matchId}/countdown/selection`)
                }
                catch (error){
                    alert(`Something went wrong when starting the selection timer in the backend: \n${handleError(error)}`);
                }
                history.push(`/matches/${matchId}/hand/${userId}`);
            }
            else{
                history.push(`/matches/${matchId}/ranking/${userId}`)
            }

        } catch (error) {
            alert(`Something went wrong during the next step: \n${handleError(error)}`);
        }
    }


    useEffect( () =>{
        async function fetchData() {
            await nextStep();
        }
        /*const t = setInterval(fetchData, 500);//this part is responsible for periodically fetching  data
        return () => clearInterval(t); // clear*/
        fetchData();
    }, []);

    return (
        <BaseContainer>
            <div className="startpage container">
                <div className="startpage text-container">
                    <text>Match gets started >></text>
                </div>
            </div>
        </BaseContainer>
    );
};
export default EndOfRound;