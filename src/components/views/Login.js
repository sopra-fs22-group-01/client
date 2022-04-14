import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {Link, useHistory, useParams} from 'react-router-dom';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import 'styles/views/Login.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
    return (
        <div className="login field">
            <label className="login label">
                {props.label}
            </label>
            <input
                className="login input"
                value={props.value}
                onChange={e => props.onChange(e.target.value)}
            />
        </div>
    );
};

FormField.propTypes = {
    label: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func
};

const Login = props => {
    const history = useHistory();
    const [password, setPassword] = useState(null);
    const [username, setUsername] = useState(null);


    const doLogin = async () => {
        try {
            const requestBody = JSON.stringify({username, password}); //creates .json file (?)
            const response = await api.post(`/users/`, requestBody);//request get to userController (GET sends to server)

            // Get the returned user and update a new object.
            const user = new User(response.data);
            console.log(response.data);

            // Store the token into the local storage.
            localStorage.setItem('token', user.token);
            //localStorage.setItem('status', user.status);

            history.push(`/users/${user.id}`);

            // Login successfully worked --> navigate to the route /game in the GameRouter
            //history.push(`/game`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <div className="login container">
                <div className="login form">
                    <FormField
                        label="Username:"
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    <FormField
                        label="Password:"
                        value={password}
                        onChange={n => setPassword(n)}
                    />
                    <div className="login button-container">
                        <PrimaryButton
                            disabled={!username || !password} //if no password or username is entered, button cant be clicked
                            width="50%" //define size of button here so it can be 100% in the button template
                            onClick={() => doLogin()}
                        >
                            Login
                        </PrimaryButton>
                    </div>
                    <div className="login registrationText">
                        <text>Don't have an account yet? Click </text>
                        <Link to={`/registration`}>
                            <text>here</text>
                        </Link>
                        <text> to register.</text>
                    </div>
                </div>
            </div>
        </BaseContainer>
    );
};

/**
 * You can get access to the history object's properties via the withRouter.
 * withRouter will pass updated match, location, and history props to the wrapped component whenever it renders.
 */
export default Login;
