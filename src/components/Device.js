import React, { Component } from 'react'
import DeviceTable from './DeviceTable'
import { withStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { Link } from "react-router-dom"
import Fab from '@material-ui/core/Fab'
import AddIcon from '@material-ui/icons/Add'
import CircularDeterminate from '../components/Loading'
import { withFirebase } from '../components/Firebase'

const styles = theme => ({
    root: {
        width: '100%',
        margin: 'auto',
        maxWidth: 360,
        backgroundColor: theme.palette.background.paper,
    },
});

class Device extends Component {

    constructor(props) {
        super(props)

        this.state = {
            device: null,
            loading: true,
            deviceActions: []
        }
        this.saveDeviceData = this.saveDeviceData.bind(this)
        this.addAction = this.addAction.bind(this)
    }


    componentDidMount() {
        this.setState({ loading: true })
        this.deviceListener = this.props.firebase.device(this.props.match.params.id).on('value', snapshot => {   
            this.setState({
                device: snapshot.val(),
                loading: false
            })
        })
        this.setState({ loading: true })
        this.deviceActionListener = this.props.firebase.deviceActions().orderByChild("deviceId").equalTo(this.props.match.params.id).once('value', snapshot => {   
            this.setState(state => ({
                 deviceActions: [snapshot.val()],
                 loading: false
            }))
        })
    }

    saveDeviceData(data) {
        this.props.firebase.device(this.props.match.params.id).update({
            name: data.name,
            type: data.type,
            state: "off"
        })
    }

    addAction() {
        let obj = {}
        let deviceRef = this.props.firebase.deviceActions().push()
        const actionType = (this.state.device.type === "both") ? "" : this.state.device.type
        const actionTemplate = {deviceId: this.props.match.params.id, name: "New action", apiCall: "", type: actionType}
        deviceRef.set(actionTemplate)
        obj[deviceRef.path.pieces_[1]] = actionTemplate
        this.setState(state => ({
            deviceActions: [...state.deviceActions,obj],
            loading: false
       }))
    }

    render() {
        const { classes } = this.props

        let deviceActions = ""
        deviceActions = this.state.deviceActions.map(deviceAction => {
            if (deviceAction) {
                return Object.keys(deviceAction).map(id =>{
                    return (
                        <Link to={`/deviceaction/${id}`} key = {id} style={{textDecoration: 'none'}}>
                            <ListItem button>
                                <ListItemText style={{textAlign:'center'}} primary={deviceAction[id].name} />
                            </ListItem>
                        </Link>
                    )
                }
                )
            }
            else return ""
        })

        const deviceActionsList = (
            <div className={classes.root}>
                <List>
                    {deviceActions}
                </List>
            </div>
        )

        return (
            <div style={{textAlign: 'center'}}>
                <h2>Device</h2>
                {(this.state.loading !== false) ? <CircularDeterminate/> : <DeviceTable saveDeviceData={this.saveDeviceData} id={this.props.match.params.id} device={this.state.device}/>}
                <h2 style={{marginTop:50}}>Device actions</h2>
                
                {(this.state.loading !== false) ? <CircularDeterminate/> : deviceActionsList}

                <Fab style={{marginTop:30}} onClick={this.addAction} color="primary" aria-label="Add">
                    <AddIcon />
                </Fab> 
            </div>
        )
    }


}

export default withFirebase(withStyles(styles)(Device))