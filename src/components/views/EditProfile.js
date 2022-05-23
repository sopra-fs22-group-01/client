import React, {useEffect, useState} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {useHistory, useParams} from 'react-router-dom';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import 'styles/views/Login.scss';
import 'styles/views/EditProfile.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import AiFillEye from 'react-icons/fa';
import AiFillEyeInvisible from 'react-icons/fa';
import {SecondaryButton} from "../ui/SecondaryButton";

/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
  return (
      <div className="editProfile field">
        <label className="editProfile label">
          {props.label}
        </label>
        <input
            className="editProfile input"
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


const EditProfile = () =>{

  const history = useHistory();
  const [password, setPassword] = useState(null);
  const [passwordType, setPasswordType] = useState("password");
  const [username, setUsername] = useState(null);
  const [user, setUser] = useState(null);
  const {id} = useParams();

  const togglePassword = () => {
    if(passwordType === "password"){
      setPasswordType("text")
      return;
    }
    setPasswordType("password")
  }

  const saveChanges = async () => {

    try {

      //maybe fails due to date -> creation_date renaming?
      // console.log({"id":user.id,"username":username, "date":user.date, "userStatus":user.userStatus, "password":password});
      const requestBody = JSON.stringify(
          {
            "id":user.id,
            "username":username,
            "date":user.date,
            "userStatus":user.userStatus,
            password}); //creates .json file (?)

      await api.put(`/users/`+ user.id, requestBody);//request get to userController (GET sends to server)
      history.push(`/users/profile/${user.id}`)

    } catch (error) {
      alert(`Something went wrong during the editing: \n${handleError(error)}`);
    }

  }

//getting user data
  useEffect(() => {
    // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
    async function fetchData() {
      try {
        const response = await api.get(`/users/?id=${id}`);

        // delays continuous execution of an async operation for 1 second.
        // This is just a fake async call, so that the spinner can be displayed
        // feel free to remove it :)
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Get the returned users and update the state.
        setUser(response.data);
        console.log("TOKEN")
        console.log(response.data.token)

        // REDIRECT TO OWN PROFILE
        if (localStorage.getItem("token") !== response.data.token){
          console.log("USER NOT THE SAME")
          try{
            const t = localStorage.getItem("token")
            const true_UserResponse = await api.get(`/users/${t}`);
            console.log("TRUE USER DATA")
            console.log(true_UserResponse)
            const true_id = true_UserResponse.data.id
            history.push(`/users/profile/${true_id}`)
          }catch (error) {
            console.error(`Something went wrong while fetching the true user: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the true user! See the console for details.");
          }
        }
        // This is just some data for you to see what is available.
        // Feel free to remove it.
        /*
        console.log('request to:', response.request.responseURL);
        console.log('status code:', response.status);
        console.log('status text:', response.statusText);
        console.log('requested data:', response.data);*/

        // See here to get more data.
        // console.log(response);
      } catch (error) {
        console.error(`Something went wrong while fetching the users: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the users! See the console for details.");
      }
    }

    fetchData();
  }, []);



  return (
      <BaseContainer>
        <div className="editProfile container">
          <div className="editProfile form">
            <FormField
                label="Change username:"
                value={username}
                onChange={un => setUsername(un)}
            />
            <FormField
                label="Change password:"
                value={password}
                type={passwordType}
                onChange={pw => setPassword(pw)}
            />
            <div className="login button-container_show_password">
              <SecondaryButton className="login show_password_button"
                               type="button"
                               onClick={() => togglePassword()}
              >
                {passwordType === "password" ? "Show password" : "Hide Password"}
              </SecondaryButton>
            </div>
            <div className="editProfile button-container">
              <PrimaryButton
                  width="100%"
                  onClick={() => saveChanges()}
              >
                Save changes
              </PrimaryButton>
            </div>

            <div className="editProfile button-container">
              <PrimaryButton
                  width="100%"
                  onClick={() => history.goBack()}
              >
                Back
              </PrimaryButton>
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
export default EditProfile;