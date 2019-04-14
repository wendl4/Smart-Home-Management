import React, { Component } from 'react';
import { FirebaseContext } from './Firebase';
import * as ROUTES from './config/routes';
import { Link, withRouter } from "react-router-dom"
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
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
  error: {
    color: "red"
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: "#0066ff",
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
  password: '',
  error: null,
}

const LoginPage = () => (
  <div>
      <FirebaseContext.Consumer>
          {firebase => <StyledLogin firebase={firebase} />}
      </FirebaseContext.Consumer>
  </div>
);

class Login extends Component {

  constructor(props) {
    super(props)
    const { classes } = this.props
    this.classes = classes
    this.state = { ...INITIAL_STATE }
  }

  onSubmit = event => {
    const { email, password } = this.state

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE })
        this.props.history.push(ROUTES.HOME)
      })
      .catch(error => {
        this.setState({ error })
      })

    event.preventDefault()
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {

    const {
      email,
      password,
      error
    } = this.state;

    return (
      <main className={this.classes.main}>
        <CssBaseline />
        <Paper className={this.classes.paper}>
          <Avatar className={this.classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Log in
          </Typography>
          <form className={this.classes.form} onSubmit={this.onSubmit}>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email Address</InputLabel>
              <Input 
                id="email"
                value={email}
                onChange={this.onChange}
                name="email" 
                autoComplete="email" 
                autoFocus 
              />
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="password">Password</InputLabel>
              <Input 
                name="password" 
                value={password} 
                onChange={this.onChange}
                type="password" 
                id="passwordt" 
                autoComplete="current-password" />
            </FormControl>
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={this.classes.submit}
            >
              Log in
            </Button>
            {error && <p className={this.classes.error}>{error.message}</p>}
            <p>Not registered? 
              <Link to="signup" key = "signup" style={{textDecoration: 'none'}}> 
              {' '} Click Here {' '}
              </Link>  
            to register.
            </p>
          </form>
        </Paper>
      </main>
    )
  }
}

Login.propTypes = {
  classes: PropTypes.object.isRequired,
}

const StyledLogin = withRouter(withStyles(styles)(Login))

export default LoginPage