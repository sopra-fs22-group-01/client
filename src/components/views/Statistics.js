import {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import {Spinner} from 'components/ui/Spinner';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import {Link, useHistory, useParams} from 'react-router-dom';
import BaseContainer from "components/ui/BaseContainer";
import "styles/views/Statistics.scss";
import PropTypes from "prop-types";


const Statistics = () => {
    // use react-router-dom's hook to access the history

    const history = useHistory();

    // define a state variable (using the state hook).
    // if this variable changes, the component will re-render, but the variable will
    // keep its value throughout render cycles.
    // a component can have as many state variables as you like.
    // more information can be found under https://reactjs.org/docs/hooks-state.html
    const [user, setUser] = useState(null);
    const {userId} = useParams(); //extracts the id from the URL

    const logout = async () => {
        try {
            let currentToken = localStorage.getItem('token');

            //const deletionResponse = await api.delete(`/lobbies/${lobbyId}/players/${userId}`);

            const response = await api.put(`/logout/?token=${currentToken}`)
            localStorage.removeItem('token');
            history.push('/users/login');
        } catch (error) {
            alert(`Something went wrong during logout: \n${handleError(error)}`);
        }

        localStorage.removeItem('token');
        history.push('/users/login');
    }



    // the effect hook can be used to react to change in your component.
    // in this case, the effect hook is only run once, the first time the component is mounted
    // this can be achieved by leaving the second argument an empty array.
    // for more information on the effect hook, please see https://reactjs.org/docs/hooks-effect.html
    useEffect(() => {

        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response1 = await api.get(`/users/?id=${userId}`);

                // Get the returned users and update the state.
                setUser(response1.data);
                console.log(response1);
            } catch (error) {
                console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
        };
        fetchData();

    }, []); //there cold be something in this array,  the code inside
    //of the useEffect hook only renders, if something in the array changes. Since the
    //empty array never changes, the code inside useEffect never runs again

    //ul = unordered list
    let content = <Spinner/>;

    if (user) {
        content = (
            <BaseContainer className="statistics base-container">


                <div className="statistics titleContainer">
                    <h1>Statistics</h1>
                </div>
                <div className="statistics infos">
                    <ul> Overall wins: {user.overallWins}</ul>
                    <ul> Played games: {user.playedGames}</ul>
                    <ul> Win/Loss ratio: {(user.overallWins/ (user.playedGames - user.overallWins)).toFixed(1)}</ul>

                    <div className="statistics button-container">

                        <PrimaryButton className="statistics back_button"
                                       onClick={() => history.goBack()}
                        >
                            Back
                        </PrimaryButton>
                    </div>
                </div>


            </BaseContainer>
        );
    }
    return content;
}
export default Statistics;