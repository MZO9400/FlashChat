import React from "react";
import Axios from '../../axiosInstance';
import {connect} from 'react-redux';
import {withRouter} from 'react-router-dom'
import * as actionTypes from "../../Redux/actionTypes";
import Card from "@material-ui/core/Card";
import CSS from "../UserProfile/UserProfile.module.css";
import ArrowRightAltIcon from '@material-ui/icons/ArrowRightAlt';
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";


class Wall extends React.Component {
    state = {
        posts: [],
        fetchSize: 20,
        page: 0
    }
    componentDidMount = () => {
        window.addEventListener("scroll", this.onScroll, false);
        this.fetchNextPosts();
    }
    componentWillUnmount = () => {
        window.removeEventListener("scroll", this.onScroll, false);
    }
    fetchNextPosts = () => {
        Axios.post("/api/users/populateWall",
            {limit: this.state.fetchSize, page: this.state.page})
            .then(response => this.setState({
                posts: [...this.state.posts, ...response.data.posts],
                page: this.state.page + 1
            }))
            .catch(e => this.props.setError({title: "Error", text: e.response.data.error}));
    }
    onScroll = () => {
        if (this.hasReachedBottom()) {
            this.fetchNextPosts();
        }
    };

    hasReachedBottom = () => {
        return (window.innerHeight + document.documentElement.scrollTop === document.scrollingElement.scrollHeight);
    }

    render() {
        return (<Container maxWidth="md" onScroll={this.onScroll}>
            {this.state.posts.length > 0 &&
            <Card className={CSS.posts}>
                {this.state.posts.map((val, key) => (
                    <Card className={CSS.postCard} key={key}>
                        <div style={{display: "flex"}}>
                            <Typography
                                variant="body1"
                                color="textSecondary"
                                style={{cursor: "pointer"}}
                                onClick={() => this.props.history.push(`/u/${val.fromID}`)}>{val.fromName}</Typography>
                            {
                                val.fromID !== val.toID &&
                                <>
                                    <ArrowRightAltIcon/>
                                    <Typography
                                        variant="body1"
                                        color="textSecondary"
                                        style={{cursor: "pointer"}}
                                        onClick={() => this.props.history.push(`/u/${val.toID}`)}>{val.toName}</Typography>
                                </>
                            }
                        </div>
                        <Typography style={{fontSize: "0.5rem"}}>{new Date(val.date).toLocaleString()}</Typography>
                        <Typography variant="h6" style={{fontWeight: "bold"}}>{val.title}</Typography>
                        <Typography variant="body1">{val.comment}</Typography>
                        {val.edited && <Typography
                            variant="body2"
                            style={{fontSize: "0.5rem"}}>{`Edited at ${new Date(val.editedTime).toLocaleString()}`}</Typography>}
                    </Card>
                ))}
            </Card>
            }
        </Container>)
    }
}

const mapStateToProps = state => {
    return {
        loggedIn: state.loggedIn
    }
}
const mapDispatchToProps = dispatch => {
    return {
        setError: (payload) => dispatch({type: actionTypes.ERROR, payload})
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Wall));