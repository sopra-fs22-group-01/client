import React, {useEffect} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import {api, handleError} from "../../helpers/api";

const LoadingPage = props => {
    const history = useHistory();
    const {userId} = useParams();
    const {lobbyId} = useParams();

    useEffect( () =>{
        async function fetchData() {
            try{ // create new Match using lobbyId (matchId receives same id) (gamecontroller)

                const createdMatchResponse = await api.post(`/matches/${lobbyId}`); //starts a match
                console.log("RECEIVE MATCH ID")
                console.log(createdMatchResponse.data);
            }
            catch(error){
                console.error(`Something went wrong while creating a match: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while creating a match ! See the console for details.");
            }

            try{
                await api.put(`/matches/${lobbyId}/countdown/selection`)
            }
            catch (error){
                alert(`Something went wrong when starting the selection timer in the backend: \n${handleError(error)}`);
            }

            try{
                //resets the ReadyStatus of the user to Unready, so after the game, a new lobby
                //can be joined without directly starting the game
                await api.put(`/lobbies/${lobbyId}/users/${userId}/status`)
            }
            catch (error){
                alert(`Something went wrong when resetting the ReadyStatus in the backend: \n${handleError(error)}`);
            }
            //because the id of the match is the same as the id of the lobby
            history.push(`/matches/${lobbyId}/hand/${userId}`)

        }
        const t = setInterval(fetchData, 500);//this part is responsible for periodically fetching  data
        return () => clearInterval(t); // clear
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
export default LoadingPage;