import React, { Component } from 'react'
import { Link } from "react-router-dom"
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import MailIcon from '@material-ui/icons/Mail'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'


const styles = {
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
};
  
  class SideMenu extends Component {
    state = {
      left: false,
    };
  
    toggleDrawer = (side, open) => () => {
      this.setState({
        [side]: open,
      });
    };
  
    render() {
        const { classes } = this.props;

        const subPages = {
            home: "Home",
            login: "Login",
            chart: "Chart",
            chartsTable: "ChartsTable",
            signup: "SignUp"
        }
  
        const sideList = (
            <div className={classes.list}>
                <List>
                    {Object.keys(subPages).map((key) => (
                    <Link to={key} key = {key} style={{textDecoration: 'none'}}>    
                        <ListItem button key={key}>
                            <ListItemIcon>
                                <MailIcon />
                            </ListItemIcon>
                            <ListItemText primary={subPages[key]} />
                        </ListItem>
                    </Link>
                    ))}
                </List>
            </div>
        );
  
  
        return (
            <div>
                <IconButton color="inherit" aria-label="Open drawer" onClick={this.toggleDrawer('left', true)}>
                    <MenuIcon />
                </IconButton>
                <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
                    <div
                        tabIndex={0}
                        role="button"
                        onClick={this.toggleDrawer('left', false)}
                        onKeyDown={this.toggleDrawer('left', false)}
                    >
                        {sideList}
                    </div>
                </Drawer>
            </div>
        );
    }
  }
  
  SideMenu.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
  export default withStyles(styles)(SideMenu);