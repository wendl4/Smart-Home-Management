import React, { Component } from 'react'
import { withFirebase } from '../Firebase'
import axios from 'axios'

class DeviceCircle extends Component {

    constructor(props) {
        super(props)
        this.state = {
            clicked: false,
            deviceActions: []
        }

        this.contextMenu = this.contextMenu.bind(this)
        this.handleToggleEvent = this.handleToggleEvent.bind(this)
    }

    contextMenu(event) {
        event.preventDefault()
        this.setState(state => ({ 
            clicked: !state.clicked
        }))
    }

    componentDidMount() {
        this.setState({ loading: true })
        this.listener = this.props.firebase.deviceActions().orderByChild("deviceId").equalTo(this.props.id).on('value', snapshot => {   
            this.setState(state => ({
                 deviceActions: [snapshot.val()],
                 loading: false
            }))
        })
    }


    handleToggleEvent = action => e => {
        this.setState(state => ({ 
            clicked: !state.clicked
        }))
        axios.post(action.apiCall,{ crossdomain: true })
            .then(response => console.log(response))
    }


    
    render() {
        const contextButton = this.state.deviceActions.length > 0 && this.state.clicked && (
            <React.Fragment>
            {(this.state.deviceActions.length > 0) || this.state.deviceActions.map(action =>
                Object.keys(action).map(id =>
                    <g onClick={this.handleToggleEvent(action[id])} key={id}>
                        <rect x={this.props.cx-28} y={this.props.cy} width="60" height="20" stroke='#000' strokeWidth='2' fill='white' />
                        <text x={this.props.cx-24} y={this.props.cy + 15}  cursor='pointer' fill="black">Toggle</text>
                    </g>
                )    
            )}
            </React.Fragment>
        )
        return (
            <React.Fragment>
                <circle
                    cx={this.props.cx} 
                    cy={this.props.cy} 
                    r={this.props.r}
                    fill='red'
                    strokeWidth='2'
                    stroke='black' 
                    onContextMenu={this.contextMenu}
                />
                {contextButton}
            </React.Fragment>
        )
    }

    componentWillUnmount() {
        this.listener()
    }
}

export default withFirebase(DeviceCircle)