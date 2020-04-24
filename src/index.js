import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Nav from './Containers/Nav/Nav';
import Profile from './Containers/Profile/Profile';
import Login from './Containers/Login/Login';
import Wall from './Containers/Wall/Wall'
import {CssBaseline} from '@material-ui/core';
import {Redirect, Route, BrowserRouter, Switch} from 'react-router-dom';
import { store } from './Redux/Store';
import { Provider } from 'react-redux';
import * as serviceWorker from './serviceWorker';


let ToRender = (
        <Switch>
            <Route path="/profile" component={Profile}/>
            <Route path="/login" component={Login}/>
            <Route path="/" component={Wall}/>
            <Redirect to="/"/>
        </Switch>
)


ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
        <BrowserRouter>
            <CssBaseline/>
            <Nav/>
            {ToRender}
        </BrowserRouter>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
