import React, { Component } from 'react'

class Line extends Component {

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
        this.props.handleEvents.handleDeletion(this.props.index)
    }
    
    render() {
        const cx = Math.abs((this.props.x1 + this.props.x2)/2)
        const cy = Math.abs((this.props.y1 + this.props.y2)/2)
        const contextButton = this.state.clicked && (
            <g onClick={this.handleDeleteEvent}>
                <circle cx={cx} cy={cy} r='18' stroke='#000' strokeWidth='2' fill='red'/>
                <line x1={cx-9} x2={cx+9} y1={cy-9} y2={cy+9} strokeWidth='3' stroke="white" />
                <line x1={cx-9} x2={cx+9} y1={cy+9} y2={cy-9} strokeWidth='3' stroke="white" />
            </g>
        )
        return (
            <React.Fragment>
                <line 
                    x1={this.props.x1} 
                    y1={this.props.y1} 
                    x2={this.props.x2} 
                    y2={this.props.y2} 
                    strokeWidth='15'
                    stroke='black' 
                    onContextMenu={this.contextMenu}
                />
                {contextButton}
            </React.Fragment>
        )
    }
}

export default Line