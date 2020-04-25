import React from "react";
import {connect} from 'react-redux'
import * as actions from '../../Redux/actions';

class Profile extends React.Component {
    componentDidMount() {
        this.props.getProfileInfo(this.props.uid)
    }

    render() {
        return (
            <div>

            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        uid: state.loggedIn
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        getProfileInfo: (uid) => dispatch(actions.getProfileInfo(uid))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);