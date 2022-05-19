import React, {useState, Component} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {Link, useHistory} from 'react-router-dom';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import {SecondaryButton} from 'components/ui/SecondaryButton';
import 'styles/views/Registration.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {AiOutlineCheckCircle} from "react-icons/ai";
import AiFillEye from 'react-icons/fa';
import AiFillEyeInvisible from 'react-icons/fa';


/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
    return (
        <div className="registration field">
            <label className="registration label">
                {props.label}
            </label>
            <input
                className="registration input"
                value={props.value}
                type={props.type}
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

const Registration = props => {
   //const current = new Date();
   // const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    const history = useHistory();
    const [password, setPassword] = useState(null);
    const [passwordType, setPasswordType] = useState("password");
    const [username, setUsername] = useState(null);
    const [usernameAlreadyExists, setUsernameAlreadyExists]=useState(null);

    //in what order does the "Registration" run?

    const togglePassword = () => {
        if(passwordType === "password"){
            setPasswordType("text")
            return;
        }
        setPasswordType("password")
    }

    const doRegistration = async () => {
        try {
            const requestBody = JSON.stringify({username, password});
            const response = await api.post('/users', requestBody); //request get to restcontoller (POST sends to server)
            /*await makes sure doRegistration waits until it gets a response before it goes on.
              however, other functions in the program can already run. so the return, where the username and birthdate get asked
              can already be executed(?)
                * */
            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store the token into the local storage.
            localStorage.setItem('token', user.token);

            // Login successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/users/profile/${user.id}`);
        } catch (error) {
            setUsernameAlreadyExists("Username already exists!")
            /*alert(`Something went wrong during the registration: \n${handleError(error)}`);*/
        }
    };

    return (
        <BaseContainer>
            <div className="registration container">
                <div className="registration form">
                    <div className="registration usernameExists">
                            {usernameAlreadyExists}
                    </div>
                    <FormField
                        label="Username:"
                        value={username}
                        onChange={un => setUsername(un)}
                    />

                    <FormField
                        label="Password:"
                        value={password}
                        type={passwordType}
                        onChange={(n) => setPassword(n) }
                    />
                    <div className="registration button-container_show_password">
                    <SecondaryButton className="registration show_password_button"
                        type="button"
                        onClick={() => togglePassword()}
                    >
                        {passwordType === "password" ? "Show password" : "Hide Password"}
                    </SecondaryButton>
                    </div>
                    <div className="registration button-container">
                        <PrimaryButton
                            disabled={!username || !password} //if no birthday or username is entered, button cant be clicked
                            width="50%" //define size of button here so it can be 100% in the button template
                            onClick={() => doRegistration()}
                        >
                            Register
                        </PrimaryButton>
                    </div>
                    <div className="login registrationText">
                        <text>Already have an account? Click </text>
                        <Link to={`/users/login`}>
                            <text>here</text>
                        </Link>
                        <text> to log in.</text>
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
export default Registration;
