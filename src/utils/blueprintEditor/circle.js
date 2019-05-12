import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class DeviceCircle extends Component {

    constructor(props) {
        super(props)
        this.state = {
            clicked: false
        }
        this.contextMenu = this.contextMenu.bind(this)
        this.handleDeleteEvent = this.handleDeleteEvent.bind(this)
        this.handleConfigEvent = this.handleConfigEvent.bind(this)
    }

    contextMenu(event) {
        event.preventDefault()
        this.setState(state => ({ 
            clicked: !state.clicked
        }))
    }

    handleDeleteEvent(event) {
        event.stopPropagation()
        this.props.handleEvents.handleDeviceDeletion(this.props.index)
    }

    handleConfigEvent(event) {
        event.stopPropagation()
        this.props.handleEvents.handleSave()
        this.props.history.push(`device/${this.props.id}`)
    }
    
    render() {
        const contextButton = this.state.clicked && (
            <React.Fragment>
            <g onClick={this.handleDeleteEvent}>
                <circle cx={this.props.cx} cy={this.props.cy} r='13' stroke='#000' strokeWidth='2' fill='red'/>
                <line x1={this.props.cx-9} x2={this.props.cx+9} y1={this.props.cy-9} y2={this.props.cy+9} strokeWidth='3' stroke="white" />
                <line x1={this.props.cx-9} x2={this.props.cx+9} y1={this.props.cy+9} y2={this.props.cy-9} strokeWidth='3' stroke="white" />
            </g>
            <g onClick={this.handleConfigEvent}>
                <rect x={this.props.cx-21} y={this.props.cy + 25} width="80" height="20" stroke='#000' strokeWidth='2' fill='white' />
                <text x={this.props.cx-17} y={this.props.cy + 40}  cursor='pointer' fill="black">Configure</text>
            </g>
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

}

export default withRouter(DeviceCircle)