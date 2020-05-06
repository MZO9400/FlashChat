import React from 'react';
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import {withRouter} from 'react-router-dom';

export default withRouter(props => {
    return (
        <Container maxWidth="md">
            {props.location.state.result.map((value, key) =>
                <Card
                    key={key}
                    onClick={() => props.history.push(`/u/${value._id}`)}
                    style={{
                        cursor: "pointer",
                        display: "flex",
                        alignContent: "center",
                        alignItems: "center",
                        padding: "1.5em"
                    }}
                >
                    <Avatar
                        src={value.avatar.error ? null : `data:${value.avatar.mimetype};base64,${value.avatar.image}`}>{value.name[0]}</Avatar>
                    <Typography style={{padding: "1em"}}>{value.name}</Typography>
                </Card>
            )}
        </Container>
    )
})