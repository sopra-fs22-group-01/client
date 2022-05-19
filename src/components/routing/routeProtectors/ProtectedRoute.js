import {Redirect, Route} from "react-router-dom";
import PropTypes from "prop-types";
import {api, handleError} from "../../../helpers/api";
import {useState} from "react";

export async function ProtectedRoute({isAuth: isAuth, component: Component}) {
    const [user, setUser] = useState(null);
    const [same, setSame] = useState(null);
    try {
        const response1 = await api.get(`/users/?id=${isAuth}`);
        setUser(response1.data);
        if (user.token === localStorage.getItem("token")){
            setSame(true);
        }
        else {
            setSame(false);
        }
    } catch (error) {
        console.error(`Something went wrong while fetching the user: \n${handleError(error)}`);
        console.error("Details:", error);
        alert("Something went wrong while fetching the user! See the console for details.");
    }
    return (
        <Route
            render={(props) => {
                if (same) {
                    return <Component/>;
                } else {
                    return <Redirect to={{pathname: '/', state: {from: props.location}}}/>;
                }
            }}
        />
    );

}