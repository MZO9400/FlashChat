import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Nav from './Containers/Nav/Nav';
import Profile from './Containers/Profile/Profile';
import Login from './Containers/Login/Login';
import Wall from './Containers/Wall/Wall'
import {CssBaseline} from '@material-ui/core';
import {Redirect, BrowserRouter, Route, Switch} from 'react-router-dom';
import {store} from './Redux/Store';
import {connect, Provider} from 'react-redux';
import * as serviceWorker from './serviceWorker';

const privateRoutes = (
    <>
        <Route exact path="/profile" component={Profile}/>
        <Route exact path="/" component={Wall}/>
        <Redirect to="/" />
    </>
)
const loginRoutes = (
    <>
        <Route exact path="/login" component={Login}/>
        <Redirect to="/login" />
    </>
)
const publicRoutes = (
    <>
    </>
)
const toRender = props => (
    <Switch>
        {props.loggedIn ? privateRoutes : loginRoutes}
        {publicRoutes}
    </Switch>
)

const mapStateToProps = state => {
    return {
        loggedIn: state.loggedIn
    }
}
const ToRender = connect(mapStateToProps)(toRender);

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <CssBaseline/>
                <Nav/>
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
