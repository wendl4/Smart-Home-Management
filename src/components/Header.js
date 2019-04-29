import React from 'react'
import * as ROUTES from '../config/routes'
import { withFirebase } from './Firebase'
import { withRouter } from 'react-router-dom'
import SideMenu from './SideMenu'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import CssBaseline from '@material-ui/core/CssBaseline'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import MoreIcon from '@material-ui/icons/MoreVert'

const styles = theme => ({
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  paper: {
    paddingBottom: 50,
  },
  list: {
    marginBottom: theme.spacing.unit * 2,
  },
  subHeader: {
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    bottom: 'auto',
    top: 0,
  },
  toolbar: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  fabButton: {
    position: 'absolute',
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: '0 auto',
  },
});

const TopAppBar = ({ authUser }) => (
  <div>{authUser ? <StyledForSignedIn authUser={authUser}/> : <StyledForNotSignedIn authUser={authUser} />}</div>
);


const SignOutButton = (props) => (
  <button type="button" onClick={e => {
    props.history.push(ROUTES.HOME)
    props.firebase.doSignOut()
  }}>
    Sign Out
  </button>
)



function ForSignedIn(props) {
  const { classes } = props
  const SignOut = withRouter(withFirebase(SignOutButton))
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="primary" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <SideMenu authUser={props.authUser} />
          <div>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
              <SignOut/>
            <IconButton color="inherit">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}


function ForNotSignedIn(props) {
  const { classes } = props
  return (
    <React.Fragment>
      <CssBaseline />
      <AppBar position="static" color="primary" className={classes.appBar}>
        <Toolbar className={classes.toolbar}>
          <SideMenu authUser={props.authUser}/>
          <div>
            <IconButton color="inherit">
              <SearchIcon />
            </IconButton>
            <IconButton color="inherit">
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
}

const StyledForSignedIn = withStyles(styles)(ForSignedIn)
const StyledForNotSignedIn = withStyles(styles)(ForNotSignedIn)

ForSignedIn.propTypes = {
  classes: PropTypes.object.isRequired,
}

ForNotSignedIn.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default withStyles(styles)(TopAppBar);