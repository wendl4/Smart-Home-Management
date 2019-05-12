import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Input from '@material-ui/core/Input'
import Select from '@material-ui/core/Select'
import { withFirebase } from '../components/Firebase'
import { withRouter } from "react-router-dom"
import CircularDeterminate from '../components/Loading'
import { Link } from "react-router-dom"

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

class DeviceActionTable extends Component {

  constructor(props) {
      super(props)
      const { classes } = props
      this.state = {
          classes: classes,
          deviceId: "",
          name: "",
          apiCall: "",
          type: "",
          state: "",
      }
      this.onChange = this.onChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.deleteAction = this.deleteAction.bind(this)
  }

  componentDidMount() {
    this.setState({ loading: true })
    this.deviceActionListener = this.props.firebase.deviceAction(this.props.match.params.id).once('value', snapshot => {   
      const action = snapshot.val()
      const actionState = action.state ? action.state : ""
        this.setState(state => ({   
          loading: false,
          deviceId: action.deviceId,
          name: action.name,
          apiCall: action.apiCall,
          type: action.type,
          state: actionState
        }))
    })
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.firebase.deviceAction(this.props.match.params.id).update({
      deviceId: this.state.deviceId,
      name: this.state.name,
      type: this.state.type,
      apiCall: this.state.apiCall,
      state: this.state.state
  })
  }

  deleteAction(id) {
    this.props.firebase.deviceAction(this.props.match.params.id).remove()
    this.props.history.push(`/device/${this.state.deviceId}`)
  }

  render() {
    const { name, type, apiCall, state } = this.state
    const disabled = this.state.type === "controlled" ? false : true
    const layout = (
    <Paper className={this.state.classes.root}>
      <Table className={this.state.classes.table}>
          <TableHead>
          <TableRow>
              <TableCell>Parameter</TableCell>
              <TableCell>Value</TableCell>
          </TableRow>
          </TableHead>
          <TableBody>
              <TableRow>
              <TableCell> Name </TableCell>
              <TableCell>
                  <Input
                      name="name"
                      value={name}
                      onChange={this.onChange}
                      id="name"
                      fullWidth={true}
                  />
              </TableCell>
              </TableRow>
              <TableRow>
              <TableCell> Type </TableCell>
              <TableCell>
                  <Select
                      native
                      value={type}
                      fullWidth={true}
                      onChange={this.onChange}
                      inputProps={{
                      name: 'type',
                      id: 'type',
                      }}
                  >
                      <option></option>
                      <option value="controlled">Controlled</option>
                      <option value="sensor">Sensor</option>
                      <option value="farm">Farm</option>
                  </Select>
              </TableCell>
              </TableRow>
              <TableRow>
                <TableCell> State </TableCell>
                <TableCell>
                    <Select
                        native
                        disabled = {disabled}
                        value={state}
                        fullWidth={true}
                        onChange={this.onChange}
                        inputProps={{
                        name: 'state',
                        id: 'state',
                        }}
                    >
                        <option value="on">On</option>
                        <option value="off">Off</option>
                    </Select>
                </TableCell>
              </TableRow>
              <TableRow>
              <TableCell> Api Call </TableCell>
              <TableCell> 
              <Input
                  name="apiCall"
                  value={apiCall}
                  onChange={this.onChange}
                  id="apiCall"
                  fullWidth={true}
              />
              </TableCell>
              </TableRow>
              
          </TableBody>

      </Table>
      <Button
          onClick={this.handleSubmit}
          fullWidth
          variant="contained"
          color="primary"
      >
          Save
      </Button>
      <Button
          fullWidth
          variant="contained"
          color="secondary"
          onClick={this.deleteAction}
      >
          Delete
      </Button>
      <Link to={`/device/${this.state.deviceId}`} style={{textDecoration:"none"}}>
        <Button
            fullWidth
            variant="contained"
        >
            Back To Device
        </Button>
      </Link>
      </Paper>
    )
    return (
      <div style={{textAlign: 'center'}}>
        {this.state.loading !== false ? <CircularDeterminate/> : layout}
      </div>
    )
  }
}

DeviceActionTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withRouter(withFirebase(withStyles(styles)(DeviceActionTable)))
