import React, { Component } from 'react'
import { Link } from "react-router-dom"
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { withFirebase } from './Firebase'
import { withAuthentication } from './session'

const styles = theme => ({
  root: {
    width: '30%',
    textAlign: 'center',
    margin: 'auto',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});


class SimpleTable extends Component {

  constructor(props) {
    super(props)

    this.state = {
      devices : []
    }
  }

  componentDidMount() {
    this.firebaseListener = this.props.firebase.auth.onAuthStateChanged(authUser => {
      if (authUser) {
        this.props.firebase.deviceOwners().orderByChild("userId").equalTo(authUser.uid).once('value', snapshot => {
          const deviceOwners = snapshot.val()
          if (deviceOwners) {
              Object.keys(deviceOwners).forEach(id => { 
                this.props.firebase.device(deviceOwners[id].deviceId).once('value', snapshot => {
                    let device = snapshot.val()
                    if (device && device.type === "farm") {
                      device.id = deviceOwners[id].deviceId
                      this.setState( state => ({
                        devices: [...state.devices,device],
                      }))
                    }
                })
              })
              
          }
        })
      }
    })
  }

  componentWillUnmount() {
    this.firebaseListener()
  }

  render() {
    let index = 0
    const { classes } = this.props
    return (
      <Paper className={classes.root}>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell>Device</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {this.state.devices.map(device => {
              index++
              return <TableRow key={index}>
                      <TableCell component="th" scope="row">
                        <Link to={`/farm/${device.id}`} key = {device.id} style={{textDecoration: 'none'}}>
                        {device.name}
                        </Link>
                      </TableCell>
                    </TableRow>
            })}
          </TableBody>
        </Table>
      </Paper>
    )
  }
}

SimpleTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withAuthentication(withFirebase(withStyles(styles)(SimpleTable)))
