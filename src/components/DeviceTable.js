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

class DeviceTable extends Component {

  constructor(props) {
      super(props)
      const { classes } = props
      this.state = {
          classes: classes,
          id: props.id,
          name: props.device.name,
          type: props.device.type,
          state: props.device.state
      }
      this.onChange = this.onChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
  }

  onChange(event) {
    this.setState({ [event.target.name]: event.target.value })
  }

  handleSubmit(event) {
    event.preventDefault()
    this.props.saveDeviceData(this.state)
  }

  render() {
    const { name, id, type } = this.state
    return (
        <Paper className={this.state.classes.root}>
        <form onSubmit={this.handleSubmit}>
        <Table className={this.state.classes.table}>
            <TableHead>
            <TableRow>
                <TableCell>Parameter</TableCell>
                <TableCell>Value</TableCell>
            </TableRow>
            </TableHead>
            <TableBody>
                <TableRow>
                <TableCell> ID </TableCell>
                <TableCell> 
                {id} 
                </TableCell>
                </TableRow>
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
                        <option value="both">Both</option>
                        <option value="farm">Farm</option>
                    </Select>
                </TableCell>
                </TableRow>
            </TableBody>

        </Table>
        <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
        >
            Save
        </Button>
        </form>
        </Paper>
    )
  }
}

DeviceTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(DeviceTable);
