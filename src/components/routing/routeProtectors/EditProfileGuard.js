import {Redirect, useParams, useHistory} from "react-router-dom";
import PropTypes from "prop-types";
import {api, handleError} from "../../../helpers/api";
import {useEffect, useState} from "react";

/**
 *
 * Another way to export directly your functional component.
 */
export const EditProfileGuard = () => {
    const {id} = useParams(); //extracts the id from the URL

    const getUser = async () => {
        try {
            const response = await api.get(`/users/?id=${id}`);
            console.log("USER FETCHED in getUser(): ", response.data)

            if (localStorage.getItem("token") === response.data.token) {
                console.log("GetUser() 2")
                console.log("USER: ", response.data.token)
                // eslint-disable-next-line no-restricted-globals
                history.push(`/editor/${id}`)

                //return <Redirect to="/editor/:id"/>;//props.children;

            } else {
                console.log("FAILED")
                return <Redirect to="/startpage"/>;
            }

            return response
            //console.log("USER USER USER USER.TOKE= ",user.token)

        } catch (error) {
            console.error(`Something went wrong while fetching the user in GetUser: \n${handleError(error)}`);
            console.error("Details:", error);
            alert("Something went wrong while fetching the user in GetUser! See the console for details.");
        }
    }

    if (localStorage.getItem("token")/* === user.token*/) {
        console.log("HERE 1")
        let response = null;
        response = getUser();

        console.log("COMPARISON")
        console.log(localStorage.getItem("token"))
        console.log(response.data.token)

        if (localStorage.getItem("token") === response.data.token) {
            console.log("HERE 2")
            console.log("USER: ", response.data.token)
            return <Redirect to="/editor/:id"/>;//props.children;

        } else {
            console.log("FAILED")
            return <Redirect to="/startpage"/>;
        }
    }
    // if userId's token doesnt correspond to this current user's token, redirect to startpage
    return <Redirect to="/startpage"/>;
};

EditProfileGuard.propTypes = {
    children: PropTypes.node
}