import React, {useState, Component, useEffect} from 'react';
import {api, handleError} from 'helpers/api';
import User from 'models/User';
import {Link, useHistory, useParams} from 'react-router-dom';
import {PrimaryButton} from 'components/ui/PrimaryButton';
import 'styles/views/CustomCards.scss';
import BaseContainer from "components/ui/BaseContainer";
import PropTypes from "prop-types";
import {AiOutlineCheckCircle} from "react-icons/ai";
import {CardButton} from "../ui/CardButton";
import Card from "../../models/Card";


/*
It is possible to add multiple components inside a single file,
however be sure not to clutter your files with an endless amount!
As a rule of thumb, use one file per component and only add small,
specific components that belong to the main one in the same file.
 */
const FormField = props => {
    return (
        <div className="customCards field">
            <label className="customCards label">
                {props.label}
            </label>
            <textarea
                className="customCards input"
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

const CustomCards = props => {
   //const current = new Date();
   // const date = `${current.getDate()}/${current.getMonth()+1}/${current.getFullYear()}`;
    const history = useHistory();
    const [password, setPassword] = useState(null);
    const [customText, setCustomText] = useState(null);
    const [user, setUser] = useState(null);

    const {userId} = useParams();
    const {lobbyId} = useParams(); // will be deleted after lobby creates match


    const createCard = async () => {
        try {
            const requestBody = JSON.stringify(
                {
                    "id":user.id,
                    "username":user.username,
                    "customWhiteText": customText
                    });
            const response = await api.put(`/matches/${lobbyId}/white-cards/${userId}/custom`, requestBody); //request get to restcontoller (POST sends to server)

            //console.log("SUCCESSFULLY CREATED CARD: ", customText)
            // Login successfully worked --> navigate to the route /game in the GameRouter
            history.push(`/lobbies/${lobbyId}/players/${userId}`);
        } catch (error) {
            alert(`Something went wrong during creating your card: \n${handleError(error)}`);
        }
    };

    useEffect(() => {

        // effect callbacks are synchronous to prevent race conditions. So we put the async function inside:
        async function fetchData() {
            try {
                const response1 = await api.get(`/users/?id=${userId}`);
                setUser(response1.data);
            } catch (error) {
                console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the user! See the console for details.");
            }
            try{ // fetch true player and redirect to correct userId
                const t = localStorage.getItem("token")
                const true_UserResponse = await api.get(`/users/${t}`);
                //console.log("TRUE USER DATA")
                //console.log(true_UserResponse)
                const true_UserId = true_UserResponse.data.id

                if (true_UserId !== userId){
                    history.push(`/lobbies/${lobbyId}/players/${true_UserId}/cards/custom`)
                }

            }catch (error) {
                console.error(`Something went wrong while fetching the true user: \n${handleError(error)}`);
                console.error("Details:", error);
                alert("Something went wrong while fetching the true user! See the console for details.");
            }
        };

        const t = setInterval(fetchData, 6000);//this part is responsible for periodically fetching data
        return () => clearInterval(t); // clear
    }, []);

    return (
        <BaseContainer>
            <div className="customCards container">
                <h1>Create your own white card !</h1>
                <div className="customCards form">

                    <FormField
                        //label="your text:"
                        value={customText}
                        onChange={un => setCustomText(un)}
                    />

                    <div className="customCards button-container">
                        <PrimaryButton
                            disabled={!customText} //if no birthday or username is entered, button cant be clicked
                            width="50%" //define size of button here so it can be 100% in the button template
                            onClick={() => createCard()}
                        >
                            create
                        </PrimaryButton>
                    </div>
                    <div className="customCards registrationText">
                        <text>Changed your mind? </text>
                        <Link to={`/lobbies/${lobbyId}/players/${userId}`}>
                            <text>Return</text>
                        </Link>
                        <text> to lobby</text>
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
export default CustomCards;
