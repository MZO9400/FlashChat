import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Nav from './Containers/Nav/Nav';
import Profile from './Containers/Profile/Profile';
import Login from './Containers/Login/Login';
import Wall from './Containers/Wall/Wall'
import UserProfile from './Containers/UserProfile/UserProfile';
import {CssBaseline} from '@material-ui/core';
import {BrowserRouter, Redirect, Route, withRouter} from 'react-router-dom';
import {store} from './Redux/Store';
import {connect, Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';
import ErrorHandler from "./ErrorHandler";

const toRender = props => {
    const privateRoutes = (
        <>
            <Route exact path="/" component={Wall}/>
            <Route exact path="/profile" component={Profile}/>
        </>
    )
    const loginRoutes = (
        <>
            <Route exact path="/login" component={Login}/>
            <Redirect to={{
                pathname: '/login',
                data: {from: props.location},
            }}/>
        </>
    )
    const publicRoutes = (
        <>
            <Route path="/u/:id" component={UserProfile}/>
        </>
    )
    return (
        <>
            <Nav redirect={props.location}/>
            {props.loggedIn ? privateRoutes : loginRoutes}
            {publicRoutes}
        </>
    )
}

const mapStateToProps = state => {
    return {
        loggedIn: state.loggedIn,
    }
}
const ToRender = connect(mapStateToProps)(withRouter(toRender));

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <CssBaseline/>
                <ErrorHandler/>
                <ToRender/>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
