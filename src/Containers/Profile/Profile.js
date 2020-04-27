import React from "react";
import {connect} from 'react-redux'
import {getProfileInfo} from "../../Redux/actions";
import {Avatar, Card, Typography} from "@material-ui/core";
import CSS from './Profile.module.css';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import TextField from '@material-ui/core/TextField';
import {withRouter} from 'react-router-dom';
import Axios from 'axios';
import * as actionTypes from '../../Redux/actionTypes';

class Profile extends React.Component {
    state = {
        name: "",
        email: "",
        date: "",
        currentPass: "",
        newPass: "",
        editing: false
    }

    componentDidMount = async () => {
        const {data} = await getProfileInfo(this.props.uid);
        this.setState({
            name: data.name,
            email: data.email,
            date: data.date,
            username: data._id
        })
    }

    changeName = (v) => {
        this.setState({name: v});
    }
    changeEmail = (v) => {
        this.setState({email: v})
    }
    changeCurrPass = (v) => {
        this.setState({currentPass: v})
    }
    changePass = (v) => {
        this.setState({newPass: v})
    }
    updateProfile = () => {
        const data = {
            email: this.state.email,
            username: this.state.username,
            name: this.state.name,
            currentPass: this.state.currentPass,
        }
        if (this.state.newPass) {
            data.newPass = this.state.newPass;
        }
        Axios.post("http://localhost:8000/api/users/setInfo", data).then(res => {
            if (res.status === 200) {
                this.props.history.push("/");
            }
        }).catch(e => this.props.setError({title: e.response.statusText, text: e.response.data.error}))
    }

    render() {
        let toShow = (<>
            <EditIcon className={CSS.editIcon} onClick={() => this.setState({editing: true})}/>
            <Avatar className={CSS.avatar}>{this.state.name && this.state.name[0].toUpperCase()}</Avatar>
            <Typography>
                {this.state.name}
            </Typography>
            <Typography>
                {this.state.email}
            </Typography>

            <Typography onClick={() => this.props.history.push(`/u/${this.state.username}`)} style={{cursor: "pointer"}}
                        color="textSecondary"
            >
                {this.state.username}
            </Typography>
            <Typography>
                {new Date(this.state.date).toLocaleString()}
            </Typography>
        </>);
        if (this.state.editing) {
            toShow = (
                <>
                    <SaveIcon className={CSS.editIcon} onClick={this.updateProfile}/>
                    <Avatar className={CSS.avatar}>{this.state.name && this.state.name[0].toUpperCase()}</Avatar>
                    <form className={CSS.inputForm}>
                        <div className={CSS.inputpadding}>
                            <TextField
                                type="name"
                                value={this.state.name}
                                onChange={e => this.changeName(e.target.value)}
                                label="Name"
                                autoComplete="name"
                            />
                        </div>
                        <div className={CSS.inputpadding}>
                            <TextField
                                type="email"
                                value={this.state.email}
                                onChange={e => this.changeEmail(e.target.value)}
                                label="Email"
                                autoComplete="email"
                            />
                        </div>
                        <div className={CSS.inputpadding}>
                            <TextField
                                type="password"
                                value={this.state.currentPass}
                                onChange={e => this.changeCurrPass(e.target.value)}
                                label="Current Password"
                                autoComplete="password"
                                required
                            />
                        </div>
                        <div className={CSS.inputpadding}>
                            <TextField
                                type="password"
                                value={this.state.newPass}
                                onChange={e => this.changePass(e.target.value)}
                                label="New Password"
                                autoComplete="new-password"
                            />
                        </div>
                    </form>
                </>
            )
        }
        return (
            <>
                <Card className={CSS.root}>
                    {toShow}
                </Card>
                <Card className={CSS.root}>
                    //TODO: Fetch and show comments along with delete, and hide
                </Card>
            </>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setError: (payload) => dispatch({type: actionTypes.ERROR, payload})
    }
}
const mapStateToProps = state => {
    return {
        uid: state.loggedIn
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Profile));