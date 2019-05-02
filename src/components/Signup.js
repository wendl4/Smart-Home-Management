import React, { Component } from 'react';
import { FirebaseContext } from './Firebase';
import { withRouter } from "react-router-dom"
import * as ROUTES from '../config/routes';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
  main: {
    width: 'auto',
    display: 'block', 
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: "#0066ff",
  },
  error: {
    color: "red"
  },
  form: {
    width: '100%',
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

const INITIAL_STATE = {
    email: '',
    passwordOne: '',
    passwordTwo: '',
    role: 'user',
    error: null,
};

const SignupPage = () => (
  <div>
      <FirebaseContext.Consumer>
          {firebase => <StyledSignup firebase={firebase} />}
      </FirebaseContext.Consumer>
  </div>
);

class Signup extends Component {
  
  constructor(props) {
    super(props)
    const { classes } = this.props
    this.classes = classes
    this.state = { ...INITIAL_STATE }
  }

  onSubmit = event => {
    const { email, passwordOne } = this.state
    let { role } = this.state

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(
        this.props.firebase.users().once("value", snapshot => {
          if(snapshot.val() === null) {
            role = 'admin'
          }
        })
      )
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase
          .user(authUser.user.uid)
          .set({
            email,
            role
          })
      })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE })
        this.props.history.push(ROUTES.EDITOR)
      })
      .catch(error => {
        this.setState({ error })
      })

    event.preventDefault();  
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const {
        email,
        passwordOne,
        passwordTwo,
        error,
    } = this.state

    const isInvalid =
    passwordOne !== passwordTwo ||
    passwordOne === '' ||
    email === '';

    return (
        <main className={this.classes.main}>
        <CssBaseline />
        <Paper className={this.classes.paper}>
            <Avatar className={this.classes.avatar}>
            <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
            Sign Up
            </Typography>
            <form className={this.classes.form} onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input 
                    id="email"
                    name="email"
                    value={email}
                    onChange={this.onChange}
                    autoComplete="email"
                    autoFocus
                />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input 
                    name="passwordOne" 
                    value={passwordOne}
                    onChange={this.onChange}
                    type="password" 
                    id="passwordOne"
                />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password again</InputLabel>
                <Input
                    name="passwordTwo"
                    value={passwordTwo}
                    onChange={this.onChange}
                    type="password" 
                    id="passwordTwo"/>
            </FormControl>
            <Button
                type="submit"
                disabled={isInvalid}
                fullWidth
                variant="contained"
                color="primary"
                className={this.classes.submit}
            >
                Sign Up
            </Button>
            {error && <p className={this.classes.error}>{error.message}</p>}
            </form>
        </Paper>
        </main>
    );
  }
}

const StyledSignup = withRouter(withStyles(styles)(Signup))

Signup.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default SignupPage
