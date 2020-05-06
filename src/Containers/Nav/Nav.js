import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AccountCircle from "@material-ui/icons/AccountCircle";
import CircularProgress from "@material-ui/core/CircularProgress";
import HomeIcon from "@material-ui/icons/Home";
import FavoriteRoundedIcon from "@material-ui/icons/FavoriteRounded";
import StarsIcon from "@material-ui/icons/Stars";
import SearchIcon from "@material-ui/icons/Search";
import {withRouter} from "react-router-dom";
import {connect} from "react-redux";
import {Divider, fade, List, ListItem, ListItemIcon, ListItemText, SwipeableDrawer} from "@material-ui/core";
import * as actions from "../../Redux/actions";
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import InputBase from "@material-ui/core/InputBase";
import Axios from '../../axiosInstance';


const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    },
    list: {
        width: 250,
        cursor: "pointer"
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(1),
            marginRight: theme.spacing(2),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: "pointer"
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '12ch',
            '&:focus': {
                width: '20ch',
            },
        },
    }
}));

const useStylesProgress = makeStyles(theme => ({
    root: {
        display: "flex",
        "& > * + *": {
            marginLeft: theme.spacing(2)
        }
    }
}));

function CircularIndeterminate() {
    const classes = useStylesProgress();

    return (
        <div className={classes.root}>
            <CircularProgress color="secondary"/>
        </div>
    );
}

const Nav = props => {
    React.useEffect(() => {
        props.checkLogStatus(() =>
            props.history.push(props.redirect === "/login" ? "/" : props.redirect));
        // hacky alternative to componentDidMount() lifecycle
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    let [loggedInMenuOpen, setLoggedInMenuOpen] = React.useState(false);
    let [searchValue, setSearchValue] = React.useState('');
    let title;
    switch (props.location.pathname) {
        case "/provide-a-service":
            title = "Provide a service";
            break;
        case "/login":
            title = "Sign in";
            break;
        case "/":
            title = "Home";
            break;
        case "/volunteers":
            title = "See Volunteers";
            break;
        default:
            title = "Home";
            break;
    }
    const classes = useStyles();
    let [isDrawerOpen, setDrawer] = React.useState(false);
    const searchHandler = () => {
        if (searchValue.length > 0) {
            Axios.post('/api/users/search', {search: searchValue})
                .then(res => props.history.push({
                    pathname: '/search',
                    state: res.data
                }))
        }
    }
    let volunteers = props.isAdmin ? (
        <ListItem onClick={() => props.history.push("/volunteers")}>
            <ListItemIcon>
                <StarsIcon/>
            </ListItemIcon>
            <ListItemText>Volunteers</ListItemText>
        </ListItem>
    ) : null;
    return (
        <React.Fragment>
            <div className={classes.root}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={() => setDrawer(true)}
                        >
                            <MenuIcon/>
                        </IconButton>
                        <Typography variant="h6" className={classes.title}>
                            {title}
                        </Typography>
                        {props.isAdmin ? <StarsIcon/> : null}
                        <div className={classes.search}>
                            <div className={classes.searchIcon} onClick={searchHandler}>
                                <SearchIcon/>
                            </div>
                            <InputBase
                                placeholder="Search…"
                                classes={{
                                    root: classes.inputRoot,
                                    input: classes.inputInput,
                                }}
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                inputProps={{'aria-label': 'search'}}
                                onKeyDown={(e) => e.key === 'Enter' ? searchHandler() : null}
                            />
                        </div>
                        {props.loggingAction ? (
                            <CircularIndeterminate/>
                        ) : props.loggedIn ? (
                            <>
                                <span style={{display: "flex", cursor: "pointer"}}
                                      onClick={(e) => setLoggedInMenuOpen(e.currentTarget)}>
                                    <AccountCircle/>
                                    <Typography style={{marginLeft: "0.5em"}}>{props.loggedIn}</Typography>
                                </span>
                                <Menu
                                    anchorEl={loggedInMenuOpen === false ? null : loggedInMenuOpen}
                                    keepMounted
                                    open={loggedInMenuOpen}
                                    onClose={() => setLoggedInMenuOpen(false)}
                                >
                                    <MenuItem onClick={() => {
                                        setLoggedInMenuOpen(false);
                                        props.history.push("/profile")
                                    }}>Profile</MenuItem>
                                    <MenuItem onClick={() => {
                                        setLoggedInMenuOpen(false);
                                        props.logOut();
                                    }}>Logout</MenuItem>
                                </Menu>
                            </>
                        ) : (
                            <Button
                                color="inherit"
                                onClick={() => props.history.push("/login")}
                            >
                                Sign In
                            </Button>
                        )}
                    </Toolbar>
                </AppBar>
            </div>
            <SwipeableDrawer
                anchor={"left"}
                open={isDrawerOpen}
                onClose={() => setDrawer(false)}
                onOpen={() => setDrawer(true)}
            >
                <div
                    className={classes.list}
                    role="presentation"
                    onClick={() => setDrawer(false)}
                    onKeyDown={() => setDrawer(false)}
                >
                    <List>
                        <ListItem onClick={() => props.history.push("/")}>
                            <ListItemIcon>
                                <HomeIcon/>
                            </ListItemIcon>
                            <ListItemText>Home</ListItemText>
                        </ListItem>
                        <ListItem onClick={() => props.history.push("/profile")}>
                            <ListItemIcon>
                                <FavoriteRoundedIcon/>
                            </ListItemIcon>
                            <ListItemText>Profile</ListItemText>
                        </ListItem>
                    </List>
                    <Divider/>
                    {volunteers}

                    {props.loggingAction ? (
                        <CircularIndeterminate/>
                    ) : props.loggedIn ? (
                        <List onClick={() => props.logOut()}>
                            <ListItem>
                                <ListItemIcon>
                                    <AccountCircleIcon/>
                                </ListItemIcon>
                                <ListItemText>Sign out</ListItemText>
                            </ListItem>
                        </List>
                    ) : (
                        <List onClick={() => props.history.push("/login")}>
                            <ListItem>
                                <ListItemIcon>
                                    <AccountCircleIcon/>
                                </ListItemIcon>
                                <ListItemText>Sign in</ListItemText>
                            </ListItem>
                        </List>
                    )}
                </div>
            </SwipeableDrawer>
        </React.Fragment>
    );
};
const mapStateToProps = state => {
    return {
        loggedIn: state.loggedIn,
        isAdmin: state.isAdmin,
        loggingAction: state.loggingAction,
        error: state.error
    };
};
const mapDispatchToProps = dispatch => {
    return {
        checkLogStatus: (callback) => dispatch(actions.checkLogStatus(callback)),
        logOut: () => dispatch(actions.logOut()),
        resetError: () => dispatch(actions.resetErrorCode())
    };
};
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(withRouter(Nav));