import React, {useState} from 'react';
import {useHistory, useParams} from 'react-router-dom';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import 'styles/views/StartPage.scss';
import BaseContainer from "components/ui/BaseContainer";


const NextPage = props => {
    const history = useHistory();
    const {userId} = useParams();
    const {matchId} = useParams();

    return (
        <BaseContainer>
            <div className="startpage container">
                <div className="startpage text-container">
                    <text>Next round >></text>
                </div>
                <div className="startpage button-container">
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
