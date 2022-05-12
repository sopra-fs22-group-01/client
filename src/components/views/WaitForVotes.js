import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {api, handleError} from "../../helpers/api";

const WaitForVotes = props => {
    const history = useHistory();
    const {userId} = useParams();
    const {matchId} = useParams();
    const [votingStatus,setVotingStatus] = useState(null);

    useEffect( () =>{
        async function fetchData() {
            try{
                const votingStatusResponse = await api.get(`/matches/${matchId}/synchronization`);
                console.log("Voting Status Response")
                console.log(votingStatusResponse.data);
                setVotingStatus(votingStatusResponse.data);
                console.log(votingStatus)
            }
            catch(error){
                console.error(`Something went wrong while fetching the voting status: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the voting status! See the console for details.");
            }

            if(votingStatus === "COMPLETE"){
                //starts countdown of next view (winner view)
                console.log("Inside if: ", votingStatus)
                try{
                    await api.put(`/matches/${matchId}/countdown/roundwinners`)
                }
                catch (error){
                    alert(`Something went wrong when starting the selection timer in the backend: \n${handleError(error)}`);
                }

                history.push(`/matches/${matchId}/winner/${userId}`);
            }

        }
        const t = setInterval(fetchData, 500);//this part is responsible for periodically fetching  data
        return () => clearInterval(t); // clear
    }, [votingStatus]);

    return (
        <BaseContainer>
            <div className="startpage container">
                <div className="startpage text-container">
                    <text>Waiting for everyone to vote >></text>
                </div>
            </div>
        </BaseContainer>
    );
};
export default WaitForVotes;