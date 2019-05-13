import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import { withFirebase } from './Firebase'
import CircularDeterminate from './Loading'
import AdminPanelItem from './AdminPanelItem'
import { withAutorization } from './session';

const styles = theme => ({
  root: {
    margin: 'auto',
    width: '60%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
});

class AdminPanel extends Component {

  constructor(props) {
      super(props)
      const { classes } = props
      this.state = {
          classes: classes,
          users: {}
      }
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.deviceActionListener = this.props.firebase.users().once('value', snapshot => {   
      const users = snapshot.val()
        this.setState(state => ({   
          loading: false,
          users: users
        }))
    })
  }

  render() {
    const layout = (
    <Paper className={this.state.classes.root}>
      <Table className={this.state.classes.table}>
          <TableHead>
          <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
          </TableRow>
          </TableHead>
          <TableBody>
          {Object.keys(this.state.users).map(userId => {
            return <AdminPanelItem name = {this.state.users[userId].email} id = {userId} role = {this.state.users[userId].role} key = {userId} />
          })

          }
          </TableBody>

      </Table>
      </Paper>
    )
    return (
      <div style={{textAlign: 'center'}}>
        {this.state.loading !== false ? <CircularDeterminate/> : layout}
      </div>
    )
  }
}

AdminPanel.propTypes = {
  classes: PropTypes.object.isRequired,
}

const condition = authUser => !!authUser

export default withAutorization(condition)(withFirebase(withStyles(styles)(AdminPanel)))
