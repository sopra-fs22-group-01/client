import React, {useEffect, useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {api, handleError} from "../../helpers/api";

const LoadingPage = props => {
    const history = useHistory();
    const {userId} = useParams();
    const {lobbyId} = useParams();
    const [votingStatus, setVotingStatus] = useState(null);

    useEffect(() => {
        async function fetchData() {

            try {
                const votingStatusResponse = await api.get(`/matches/${lobbyId}/synchronization`);
                //console.log("Voting Status Response")
                //console.log(votingStatusResponse.data);
                setVotingStatus(votingStatusResponse.data);
                //console.log("Voting Status Variable")
                //console.log(votingStatus)
            } catch (error) {
                console.error(`Something went wrong while fetching the voting status: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the voting status! See the console for details.");
            }

            if (votingStatus === "COMPLETE") {
                //starting selection countdown
                try {
                    await api.put(`/matches/${lobbyId}/countdown/selection`)
                } catch (error) {
                    alert(`Something went wrong when starting the selection timer in the backend: \n${handleError(error)}`);
                }
                try {
                    //resets the ReadyStatus of the user to Unready, so after the game, a new lobby
                    //can be joined without directly starting the game
                    await api.put(`/lobbies/${lobbyId}/users/${userId}/status`)
                } catch (error) {
                    alert(`Something went wrong when resetting the ReadyStatus in the backend: \n${handleError(error)}`);
                }
                //delete lobby
                try {
                    await api.delete(`/lobbies/${lobbyId}`)
                } catch (error) {
                    alert(`Something went wrong when deleting the Lobby in the backend: \n${handleError(error)}`);
                }

                //because the id of the match is the same as the id of the lobby
                history.push(`/matches/${lobbyId}/hand/${userId}`)
            }
        }

        const t = setInterval(fetchData, 600);//this part is responsible for periodically fetching  data
        return () => clearInterval(t); // clear
    }, [votingStatus]);

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
export default LoadingPage;