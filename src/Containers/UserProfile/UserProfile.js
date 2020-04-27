import React from 'react';
import Axios from 'axios';
import {withRouter} from 'react-router-dom';

//TODO: Add public user profiles
class UserProfile extends React.Component {
    state = {
        id: "",
    }

    componentDidMount = () => {
        const {id} = this.props.match.params;
        this.setState({id})
        Axios.post("http://localhost:8000/api/users/getInfoPub", {uid: id})
            .then(response => console.log(response))
            .catch(e => console.log(e.response));
    }

    render() {
        return <div>{this.state.id ? this.state.id : "id not found"}</div>
    }
}

export default withRouter(UserProfile);