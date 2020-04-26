import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import * as actions from "../../Redux/actions";
import {connect} from "react-redux";

const useStylesSU = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

function SignUp(props) {
    const classes = useStylesSU();
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
                </Typography>
                <form className={classes.form} autoComplete="on">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="name"
                                name="Name"
                                variant="outlined"
                                required
                                fullWidth
                                id="Name"
                                label="Name"
                                autoFocus
                                value={props.name.val}
                                onChange={e => props.name.fn(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={props.email.val}
                                onChange={e => props.email.fn(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="username"
                                label="User name"
                                name="username"
                                autoComplete="username"
                                value={props.username.val}
                                onChange={e => props.username.fn(e)}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={props.pass.val}
                                onChange={e => props.pass.fn(e)}
                            />
                        </Grid>
                        <Grid item xs={12}/>
                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => props.submit()}
                        disabled={!props.validity}
                    >
                        Sign Up
                    </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link
                                onClick={() => props.switchSignState()}
                                variant="body2"
                                style={{cursor: "pointer"}}
                            >
                                Already have an account? Sign in
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}

const useStylesSI = makeStyles(theme => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1)
    },
    submit: {
        margin: theme.spacing(3, 0, 2)
    }
}));

function SignIn(props) {
    const classes = useStylesSI();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline/>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon/>
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <form className={classes.form} noValidate>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={props.email.val}
                        onChange={e => props.email.fn(e)}
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={props.pass.val}
                        onChange={e => props.pass.fn(e)}
                    />
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => props.submit()}
                        disabled={!props.validity}
                    >
                        Sign In
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link
                                onClick={() => props.switchSignState()}
                                style={{cursor: "pointer"}}
                                variant="body2"
                            >
                                {"Don't have an account? Sign Up"}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    );
}

class LoginPage extends React.Component {
    state = {
        signIn: true,
        name: "",
        pass: "",
        email: "",
        username: ""
    };
    validateSignIn = () => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
        const passRegex = /^(?=.*\d).{4,8}$/; // 4-8 with one digit
        return emailRegex.test(this.state.email) && passRegex.test(this.state.pass);
    };
    validateSignUp = () => {
        const usernameRegex = /^[a-z0-9_]{3,16}$/igm;
        return this.state.name.length && this.validateSignIn() && usernameRegex.test(this.state.username);
    };
    updateEmail = e => {
        this.setState({email: e.target.value});
    };
    updatePass = e => {
        this.setState({pass: e.target.value});
    };
    updateName = e => {
        this.setState({name: e.target.value});
    };
    updateUsername = e => {
        this.setState({username: e.target.value});
    };

    switchSignState = () => {
        this.setState(state => {
            return {signIn: !state.signIn};
        });
    };
    redirect = () => {
        let afterLogin = this.props.location.data.from.pathname;
        if (afterLogin === "/login") afterLogin = "/";
        this.props.history.push(afterLogin);
    }
    submit = () => {
        if (this.state.signIn) {
            this.props.signInEmail(this.state.email, this.state.pass, this.redirect);
        } else {
            this.props.signUpEmail(
                this.state.email,
                this.state.pass,
                this.state.name,
                this.state.username,
                this.redirect
            );
        }
    };

    render() {
        return (
            <>
                {this.state.signIn ? (
                    <SignIn
                        switchSignState={this.switchSignState}
                        pass={{fn: this.updatePass, val: this.state.pass}}
                        email={{fn: this.updateEmail, val: this.state.email}}
                        submit={this.submit}
                        validity={this.validateSignIn()}
                    />
                ) : (
                    <SignUp
                        switchSignState={this.switchSignState}
                        pass={{fn: this.updatePass, val: this.state.pass}}
                        email={{fn: this.updateEmail, val: this.state.email}}
                        name={{fn: this.updateName, val: this.state.name}}
                        username={{fn: this.updateUsername, val: this.state.username}}
                        submit={this.submit}
                        validity={this.validateSignUp()}
                    />
                )}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        loggedIn: state.loggedIn
    };
};
const mapDispatchToProps = dispatch => {
    return {
        signInEmail: (user, pass, callback) => dispatch(actions.signInEmail(user, pass, callback)),
        signUpEmail: (email, pass, name, user, callback) =>
            dispatch(actions.signUpEmail(email, pass, name, user, callback))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginPage);