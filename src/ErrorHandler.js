import React from "react";
import DialogModal from "./Components/DialogModal/DialogModal";
import {connect} from 'react-redux';
import * as actions from './Redux/actions';

class ErrorHandler extends React.Component {
    render() {
        let title, text;
        if (this.props.error) {
            title = this.props.error.title;
            text = this.props.error.text;
        }
        return (
            <DialogModal
                open={this.props.error !== null}
                title={title}
                text={text}
                accept={() => this.props.resetError()}
            />
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        resetError: () => dispatch(actions.resetErrorCode())
    }
}
const mapStateToProps = state => {
    return {
        error: state.error
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ErrorHandler);