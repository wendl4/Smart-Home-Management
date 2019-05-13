import React, { Component } from 'react'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Select from '@material-ui/core/Select'
import Button from '@material-ui/core/Button'
import { withFirebase } from './Firebase'

class AdminPanelItem extends Component {

    constructor(props) {
        super(props)
        const { classes } = props
        this.state = {
            classes: classes,
            role: this.props.role,
        }
        this.onChange = this.onChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
  
    onChange(event) {
        this.setState({ [event.target.name]: event.target.value })
    }

    handleSubmit(event) {
        this.props.firebase.user(this.props.id).update({
            role: this.state.role
        })
    }


  render() {
    const { role } = this.state
    return (
        <React.Fragment>
            <TableRow>
                <TableCell>
                    {this.props.name}
                </TableCell>
                <TableCell>
                    <Select
                        native
                        value={role}
                        fullWidth={true}
                        onChange={this.onChange}
                        inputProps={{
                        name: 'role',
                        id: 'role',
                        }}
                    >
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                        <option value="farmer">Farmer</option>
                    </Select>
                </TableCell>
                <TableCell>
                    <Button
                        onClick={this.handleSubmit}
                        fullWidth
                        variant="contained"
                        color="primary"
                    >
                        Save
                    </Button>
                </TableCell>

            </TableRow>
        </React.Fragment>
    )
  }

}

export default withFirebase(AdminPanelItem)
