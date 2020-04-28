import React from 'react';
import Axios from 'axios';
import {withRouter} from 'react-router-dom';
import Container from '@material-ui/core/Container';
import Card from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";
import CSS from './UserProfile.module.css'
import * as actionTypes from "../../Redux/actionTypes";
import {connect} from "react-redux";
import TextField from "@material-ui/core/TextField";
import EditIcon from "@material-ui/icons/Edit"
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import HowToRegIcon from '@material-ui/icons/HowToReg';
import HourglassFullIcon from '@material-ui/icons/HourglassFull';

class UserProfile extends React.Component {
    state = {
        id: "",
        newPostTitle: "",
        newPostText: "",
        commentEditTitle: "",
        commentEditText: "",
        editing: false,
        isFriend: "none",
        comments: []
    }
    componentDidUpdate = (prevProps) => {
        if (this.props.match.params.id !== this.state.id) {
            this.componentDidMount();
        }
        if (this.props.loggedIn !== prevProps.loggedIn && this.props.loggedIn !== false) {
            Axios.post("http://localhost:8000/api/users/getFriendshipStatus", {id: this.state.id})
                .then(response => this.setState({isFriend: response.data.friendshipStatus}))
                .catch(e => {
                    this.props.setError({title: "Error", text: e.response.data.error})
                });
        }
    }
    componentDidMount = async () => {
        const {id} = this.props.match.params;
        this.setState({id})
        Axios.post("http://localhost:8000/api/users/getInfoPub", {uid: id})
            .then(response => {
                if (!response.data) {
                    this.props.setError({title: "Error", text: "User not found"});
                } else {
                    this.setState({id: response.data._id, name: response.data.name})
                }
            })
            .catch(e => {
                this.props.setError({title: "Error", text: e.response.data.error})
            });
        Axios.post("http://localhost:8000/api/comments/getPublic", {id})
            .then(response => {
                this.setState({comments: response.data ? response.data : []})
            })
            .catch(e => {
                this.props.setError({title: "Error", text: e.response.data.error})
            });
    }
    addPost = () => {
        const payload = {
            comment: this.state.newPostText,
            userID: this.state.id
        }
        if (this.state.newPostTitle.length) {
            payload.title = this.state.newPostTitle;
        }
        Axios.post("http://localhost:8000/api/comments/postNew", payload)
            .then(() => {
                this.setState({
                    newPostTitle: "",
                    newPostText: ""
                })
            })
            .catch(e => this.props.setError({title: "Error", text: e.response.data.error}));
    }
    isValid = () => {
        return (this.state.newPostText.length > 0);
    }
    deleteComment = (_id) => {
        Axios.post("http://localhost:8000/api/comments/delete", {_id}).then(res => {
            if (res.status === 200) {
                console.log(res);
                const comments = [...this.state.comments].filter(i => i._id !== _id);
                this.setState({comments});
            }
        }).catch(e => this.props.setError({title: e.response.statusText, text: e.response.data.error}))
    }
    toggleFriend = () => {
        Axios.post("http://localhost:8000/api/users/toggleFriend", {_id: this.state.id})
            .then(() => {
                if (this.state.isFriend === "none") {
                    this.setState({isFriend: "pending"});
                } else {
                    this.setState({isFriend: "none"});
                }
            })
            .catch(e => this.props.setError({title: "Error", text: e.response.data.error}));
    }

    render() {
        let editing = (
            <Dialog
                open={this.state.editing}
                onClose={() => this.setState({editing: false})}
            >
                <DialogTitle>Editing Comment</DialogTitle>
                <DialogContent>
                    <form>
                        <div style={{display: "flex", flexDirection: "column"}}>
                            <TextField
                                value={this.state.commentEditTitle}
                                placeholder="Change title"
                                onChange={(e) => this.setState({commentEditTitle: e.target.value})}
                            />
                            <TextField
                                value={this.state.commentEditText}
                                placeholder="Change text"
                                onChange={(e) => this.setState({commentEditText: e.target.value})}
                            />
                        </div>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        this.setState({
                            editing: false,
                            commentEditTitle: "",
                            commentEditText: ""
                        })
                    }}>Cancel</Button>
                    <Button onClick={() => {
                        Axios.post("http://localhost:8000/api/comments/edit", {
                            _id: this.state.editing,
                            title: this.state.commentEditTitle,
                            comment: this.state.commentEditText,
                        })
                            .then(() => {
                                let comments = [...this.state.comments].filter(x => x._id !== this.state.editing);
                                this.setState({
                                    editing: false,
                                    commentEditTitle: "",
                                    commentEditText: "",
                                    comments
                                })
                            })
                            .catch((e) => this.props.setError({title: "Error", text: e.response.data.error}))
                    }}
                    >Save Changes</Button>
                </DialogActions>
            </Dialog>
        );
        return (
            <Container maxWidth="md">
                {editing}
                <Card className={CSS.root}>
                    {(this.state.id !== this.props.loggedIn) ? this.state.isFriend === "none" ?
                        <PersonAddIcon className={CSS.editIcon} onClick={this.toggleFriend}/> :
                        this.state.isFriend === "pending" ?
                            <HourglassFullIcon className={CSS.editIcon} onClick={this.toggleFriend}/> :
                            <HowToRegIcon className={CSS.editIcon} onClick={this.toggleFriend}/> : null
                    }
                    <Typography color="textSecondary">{this.state.id}</Typography>
                    {this.state.name && <Typography>{this.state.name}</Typography>}
                </Card>
                <Card className={CSS.root}>
                    {this.isValid() && <AddIcon className={CSS.editIcon} onClick={this.addPost}/>}
                    <Typography>New Post</Typography>
                    <form style={{marginTop: "2em"}}>
                        <TextField
                            placeholder="Give your post a title"
                            value={this.state.newPostTitle}
                            onChange={(e) => this.setState({newPostTitle: e.target.value})}
                            style={{marginBottom: "1rem"}}
                        />
                        <TextField
                            multiline
                            placeholder="Write something."
                            maxrows="8"
                            value={this.state.newPostText}
                            onChange={(e) => this.setState({newPostText: e.target.value})}
                            fullWidth
                        />
                    </form>
                </Card>
                {this.state.comments.length > 0 &&
                <Card className={CSS.posts}>
                    {this.state.comments.map((val, key) => (
                        <Card className={CSS.postCard} key={key}>
                            {val.fromID === this.props.loggedIn &&
                            <>
                                <EditIcon
                                    className={CSS.editIcon}
                                    onClick={() => {
                                        this.setState({
                                            editing: val._id,
                                            commentEditTitle: val.title,
                                            commentEditText: val.comment
                                        })
                                    }}
                                />
                                <DeleteIcon
                                    className={[CSS.editIcon, CSS.removeIcon].join(" ")}
                                    onClick={() => this.deleteComment(val._id)}

                                />
                            </>
                            }

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
            </Container>
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
        loggedIn: state.loggedIn
    }
}
export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserProfile));