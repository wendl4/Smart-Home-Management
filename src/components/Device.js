import React, { Component } from 'react'
import DeviceTable from './DeviceTable'
import DeviceActionTable from './DeviceActionTable'
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import CircularDeterminate from '../components/Loading'
import { withFirebase } from '../components/Firebase'

class Device extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true,
            deviceActions: []
        }
        this.saveDeviceData = this.saveDeviceData.bind(this)
        this.saveActionData = this.saveActionData.bind(this)
        this.addAction = this.addAction.bind(this)
        this.deleteAction = this.deleteAction.bind(this)
    }

    getDeviceRef(id) {
        return this.props.firebase.device(id)
    }

    componentDidMount() {
        this.setState({ loading: true })
        this.props.firebase.device(this.props.match.params.id).on('value', snapshot => {   
            this.setState({
                device: snapshot.val(),
                loading: false
            })
        })
        this.setState({ loading: true })
        this.props.firebase.deviceActions().orderByChild("deviceId").equalTo(this.props.match.params.id).on('value', snapshot => {   
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
            state: data.state
        })
    }

    saveActionData(data) {
        this.props.firebase.deviceAction(data.id).update({
            deviceId: data.deviceId,
            name: data.name,
            type: data.type,
            apiCall: data.apiCall
        })
    }

    deleteAction(id) {
        this.props.firebase.deviceAction(id).remove()
    }

    addAction() {
        let obj = {}
        let deviceRef = this.props.firebase.deviceActions().push()
        obj[deviceRef.path.pieces_[1]] = {deviceId: this.props.match.params.id}
        this.setState(state => ({
            deviceActions: [...state.deviceActions,obj],
            loading: false
       }))
    }

    render() {
        let deviceActions = ""
        deviceActions = this.state.deviceActions.map(deviceAction => {
            if (deviceAction) {
                return Object.keys(deviceAction).map(id =>
                    <DeviceActionTable 
                        action={deviceAction[id]}
                        id={id} 
                        deleteAction={this.deleteAction} 
                        saveActionData={this.saveActionData} 
                        key={`action${id}`}
                    />
                )
            }
            else return ""
        })

        return (
            <div style={{textAlign: 'center'}}>
                <h2>Device</h2>
                {(this.state.loading !== false) ? <CircularDeterminate/> : <DeviceTable saveDeviceData={this.saveDeviceData} id={this.props.match.params.id} device={this.state.device}/>}
                <h2 style={{marginTop:50}}>Device actions</h2>
                
                {(this.state.loading !== false) ? <CircularDeterminate/> : deviceActions}

                <Fab style={{marginTop:30}} onClick={this.addAction} color="primary" aria-label="Add">
                    <AddIcon />
                </Fab> 
            </div>
        )
    }
}

export default withFirebase(Device)