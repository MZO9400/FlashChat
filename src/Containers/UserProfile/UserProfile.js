import React from 'react';
//TODO: Add public user profiles
class UserProfile extends React.Component {
    componentDidMount() {
        const {id} = this.props.match.params;
        this.setState({id})
    }
    state = {
        id: "",
    }
    render() {
        return <div>{this.state.id}</div>
    }
}
export default UserProfile;