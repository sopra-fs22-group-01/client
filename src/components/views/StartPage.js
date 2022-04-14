import React, {useState} from 'react';
import {useHistory} from 'react-router-dom';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import 'styles/views/StartPage.scss';
import BaseContainer from "components/ui/BaseContainer";


const StartPage = props => {
    const history = useHistory();

    const pressLoginButton = async () => {
        history.push(`/login`);
    };

    const pressRegistrationButton = async () => {
        history.push(`/registration`);
    };

    return (
        <BaseContainer>
            <div className="startpage container">
                <div className="startpage text-container">
                    <text>Welcome to Cards Against Humanity 2.0</text>
                </div>
                <div className="startpage button-container">
                    <PrimaryButton
                        width="40%" //define size of button here, so it can be 100% in the button template
                        onClick={() => pressRegistrationButton()}
                    >
                        Register
                    </PrimaryButton>
                    <PrimaryButton
                        width="40%" //define size of button here, so it can be 100% in the button template
                        onClick={() => pressLoginButton()}
                    >
                        Login
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
export default StartPage;
