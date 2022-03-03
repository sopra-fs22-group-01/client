import React, {useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory} from 'react-router-dom';
import {Button} from 'components/ui/Button';
import 'styles/views/Registration.scss';
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
        <div className="registration field">
            <label className="registration label">
                {props.label}
            </label>
            <input
                className="registration input"
                placeholder="enter here.."
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

const Registration = props => {
   //const current = new Date();
   // const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    const history = useHistory();
    const [password, setPassword] = useState(null);
    const [username, setUsername] = useState(null);
    const [date, setDate] = useState(null);

    //in what order does the "Registration" run?

    const doRegistration = async () => {
        try {
            const requestBody = JSON.stringify({username, password, date});
            const response = await api.post('/users', requestBody); //request get to restcontoller (POST sends to server)
            /*await makes sure doRegistration waits until it gets a response before it goes on.
              however, other functions in the program can already run. so the return, where the username and password get asked
              can already be executed(?)
                * */
            // Get the returned user and update a new object.
            const user = new User(response.data);

            // Store the token into the local storage.
            localStorage.setItem('token', user.token);

            // Login successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/game`);
        } catch (error) {
            alert(`Something went wrong during the login: \n${handleError(error)}`);
        }
    };

    return (
        <BaseContainer>
            <div className="registration container">
                <div className="registration form">
                    <FormField
                        label="Username"
                        value={username}
                        onChange={un => setUsername(un)}
                    />
                    <FormField
                        label="Password"
                        value={password}
                        onChange={(n) => {setPassword(n) ; setDate('03.03.22')}} //hard coded to see if it would work like this
                    />

                    <div className="registration button-container">
                        <Button
                            disabled={!username || !password} //if no password or username is entered, button cant be clicked
                            width="100%"
                            onClick={() => doRegistration()}
                        >
                            Register
                        </Button>
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
