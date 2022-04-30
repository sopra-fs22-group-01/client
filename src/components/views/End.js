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


    const startNewMatch = async () => {
        try {
            await api.put(`/matches/${matchId}/rounds`) // does not work when called from useeffect
            history.push(`/startpage`);

        } catch (error) {
            alert(`Something went wrong during logging the chosen card into the backend: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <div className="startpage container">
                <div className="startpage text-container">
                    <text>END OF GAME</text>
                </div>
                <div className="startpage button-container">
                    <PrimaryButton
                        onClick={() => startNewMatch()}
                    >
                        to startPage
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
