import React, { Component } from 'react'


class DeviceCircle extends Component {

    constructor(props) {
        super(props)
        this.state = {
            clicked: false
        }
        this.contextMenu = this.contextMenu.bind(this)
        this.handleDeleteEvent = this.handleDeleteEvent.bind(this)
    }

    contextMenu(event) {
        event.preventDefault()
        this.setState(state => ({ 
            clicked: !state.clicked
        }))
    }

    handleDeleteEvent(event) {
        event.stopPropagation()
        this.props.handleDeletion(this.props.index)
    }
    
    render() {
        const contextButton = this.state.clicked && (
            <g onClick={this.handleDeleteEvent}>
                <circle cx={this.props.cx} cy={this.props.cy} r='18' stroke='#000' strokeWidth='2' fill='red'/>
                <line x1={this.props.cx-9} x2={this.props.cx+9} y1={this.props.cy-9} y2={this.props.cy+9} strokeWidth='3' stroke="white" />
                <line x1={this.props.cx-9} x2={this.props.cx+9} y1={this.props.cy+9} y2={this.props.cy-9} strokeWidth='3' stroke="white" />
            </g>
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

export default DeviceCircle