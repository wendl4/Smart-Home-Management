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
            .then(response => {
                if (action.type === "controlled") {
                    const newState =(action.state === "on") ? "off" : "on"
                    this.props.firebase.deviceAction(action.id).update({
                        state: newState
                    })
                    action.state = newState
                }
                else {
                    action.response = response.data
                }  
            })
    }


    
    render() {
        let offset = 0
        const contextButton = this.state.deviceActions.length > 0 && this.state.clicked && (
            <React.Fragment>
            <rect x={this.props.cx-58} y={this.props.cy - 30} width="120" height="20" stroke='#000' strokeWidth='2' fill='#FFF69E' />
            <text x={this.props.cx-50} y={this.props.cy - 15} fill="black">{this.props.name}</text>
            {this.state.deviceActions.map(action =>
                Object.keys(action).map(id => {
                    action[id].id = id
                    let background = 'white'
                    if (action[id].type === "controlled") {
                        background = (action[id].state === "on") ? "green" : "red"
                    }
                    const ContextMenu = (
                        <g onClick={this.handleToggleEvent(action[id])} cursor='pointer' key={id}>
                            <rect x={this.props.cx-28} y={this.props.cy + offset * 25} width="180" height="20" stroke='#000' strokeWidth='2' fill={background} />
                            <text x={this.props.cx-24} y={this.props.cy + 15 + offset * 25} fill="black">{action[id].name}:</text>
                            {(action[id].type === "sensor" && action[id].response) && <text x={this.props.cx+30} y={this.props.cy + 15 + offset * 25} fill="black">{action[id].response}</text>}
                            <text x={this.props.cx+95} y={this.props.cy + 15 + offset * 25} fill="black">Toggle</text>
                        </g>
                    )
                    offset++
                    return ContextMenu
                })    
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
        this.props.firebase.deviceActions().off()
    }
}

export default withFirebase(DeviceCircle)