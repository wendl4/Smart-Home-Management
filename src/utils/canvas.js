import React, { Component } from 'react'
import DeviceCircle from './circle'
import { withHandleDeletion } from './blueprintEditor'

class Canvas extends Component {

    render() {
        const MyLine = withHandleDeletion(Line)
        const MyDeviceCircle = withHandleDeletion(DeviceCircle)
        return (
            <React.Fragment>
            {
                this.props.objects.map(function(object) {
                    let index = this.props.objects.indexOf(object)
                    switch(object.type) {
                        case "Line":
                        return <MyLine 
                                x1 = {object.x1} 
                                x2 = {object.x2} 
                                y1 = {object.y1} 
                                y2 = {object.y2}
                                index = {index}
                                key = {`object${index}`}
                                />
                        case "Circle":
                        return <MyDeviceCircle 
                                cx = {object.cx} 
                                cy = {object.cy} 
                                r = {object.r}
                                index = {index}
                                key = {`object${index}`}
                                />
                        default:
                        return null
                    }
                }.bind(this))
            }
            </React.Fragment>
        );
    }

}

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
        this.props.handleDeletion(this.props.index)
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

export default Canvas
