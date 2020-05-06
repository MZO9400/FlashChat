import React from "react";
import {connect} from 'react-redux'
import {getProfileInfo} from "../../Redux/actions";
import {Avatar, Card, Typography} from "@material-ui/core";
import CSS from './Profile.module.css';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';
import AddIcon from '@material-ui/icons/Add';
import ClearIcon from '@material-ui/icons/Clear';
import DeleteIcon from '@material-ui/icons/Delete';
import TextField from '@material-ui/core/TextField';
import {withRouter} from 'react-router-dom';
import Axios from '../../axiosInstance';
import * as actionTypes from '../../Redux/actionTypes';

class Profile extends React.Component {
    state = {
        name: "",
        email: "",
        date: "",
        currentPass: "",
        newPass: "",
        editing: false,
        comments: [],
        username: "",
        avatar: {
            image: "",
            mimetype: ""
        }
    }

    componentDidMount = async () => {
        const {data} = await getProfileInfo(this.props.uid);
        this.setState({
            name: data.name,
            email: data.email,
            date: data.date,
            username: data._id
        })
        Axios.post("/api/comments/getAll", {userID: this.props.uid})
            .then(res => this.setState({comments: res.data ? res.data : []}));
        Axios.post("/api/users/image", {uid: this.props.uid})
            .then(res => this.setState({avatar: res.data}))
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
        Axios.post("/api/users/setInfo", data).then(res => {
            if (res.status === 200) {
                this.props.history.push("/");
            }
        }).catch(e => this.props.setError({title: e.response.statusText, text: e.response.data.error}))
    }
    toggleVisibility = (_id) => {
        Axios.post("/api/comments/toggleVisibility", {_id}).then(res => {
            if (res.status === 200) {
                const comments = [...this.state.comments];
                for (let i = 0; i < comments.length; i++) {
                    if (comments[i]._id === _id) {
                        comments[i].hidden = !comments[i].hidden;
                        break;
                    }
                }
                this.setState({comments});
            }
        }).catch(e => this.props.setError({title: e.response.statusText, text: e.response.data.error}))
    }
    deleteComment = (_id) => {
        Axios.post("/api/comments/delete", {_id}).then(res => {
            if (res.status === 200) {
                console.log(res);
                const comments = [...this.state.comments].filter(i => i._id !== _id);
                this.setState({comments});
            }
        }).catch(e => this.props.setError({title: e.response.statusText, text: e.response.data.error}))
    }
    updateAvatar = (event) => {
        if (event.target.files && event.target.files[0]) {
            const formData = new FormData();
            let reader = new FileReader();
            let file = event.target.files[0];
            reader.onloadend = () => {
                this.setState({
                    avatar: reader.result,
                });
                formData.append("image", file);
                const config = {
                    headers: {
                        "content-type": "multipart/form-data"
                    }
                }
                Axios.put("/api/users/image", formData, config)
                    .catch(e => this.props.setError({title: e.response.statusText, text: e.response.data.error}))
            };
            reader.readAsDataURL(file);
        }
    }

    render() {
        let toShow = (<>
            <EditIcon className={CSS.editIcon} onClick={() => this.setState({editing: true})}/>
            <Avatar className={CSS.avatar}
                    src={`data:${this.state.avatar.mimetype};base64,${this.state.avatar.image}`}
            >{this.state.name && this.state.name[0].toUpperCase()}</Avatar>
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
                    <input
                        accept="image/*"
                        onChange={this.updateAvatar}
                        id="avatarselect"
                        style={{display: "none"}}
                        type="file"
                    />
                    <label htmlFor="avatarselect">
                        <Avatar className={CSS.avatar} src={this.state.avatar}>
                            <AddIcon className={CSS.avatarPlus}/>
                        </Avatar>
                    </label>
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
                {this.state.comments.length > 0 &&
                <Card className={CSS.posts}>
                    {this.state.comments.map((val, key) => (
                        <Card className={CSS.postCard} key={key}>
                            {val.hidden ?
                                <AddIcon className={CSS.editIcon} onClick={() => this.toggleVisibility(val._id)}/> :
                                <ClearIcon className={CSS.editIcon} onClick={() => this.toggleVisibility(val._id)}/>
                            }
                            <DeleteIcon className={[CSS.editIcon, CSS.removeIcon].join(" ")}
                                        onClick={() => this.deleteComment(val._id)}/>
                            <Typography
                                variant="body1"
                                color="textSecondary"
                                style={{cursor: "pointer"}}
                                onClick={() => this.props.history.push(`/u/${val.fromID}`)}
                            >{val.name}</Typography>
                            <Typography style={{fontSize: "0.5rem"}}>{new Date(val.date).toLocaleString()}</Typography>
                            <Typography variant="h6" style={{fontWeight: "bold"}}>{val.title}</Typography>
                            <Typography variant="body1">{val.comment}</Typography>
                            {val.edited && <Typography
                                variant="body2">{`Edited at ${new Date(val.editedTime).toLocaleString()}`}</Typography>}
                        </Card>
                    ))}
                </Card>
                }
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