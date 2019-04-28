import React, { Component } from 'react'
import DeviceTable from './DeviceTable'
import CircularDeterminate from '../components/Loading'
import { withFirebase } from '../components/Firebase'

class Device extends Component {

    constructor(props) {
        super(props)

        this.state = {
            loading: true
        }
        this.saveData = this.saveData.bind(this)
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
    }

    saveData(data) {
        this.props.firebase.device(this.props.match.params.id).update({
            name: data.name,
            type: data.type,
            state: data.state
        })
    }

    render() {
        return (
            <div style={{textAlign: 'center'}}>
                {(this.state.loading !== false) ? <CircularDeterminate/> : <DeviceTable saveData={this.saveData} id={this.props.match.params.id} device={this.state.device}/>}
            </div>
        )
    }
}

export default withFirebase(Device)