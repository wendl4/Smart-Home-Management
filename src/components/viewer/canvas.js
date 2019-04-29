import React, { Component } from 'react'
import DeviceCircle from './circle'
import { withHandleEvents } from './blueprintViewer'

class Canvas extends Component {

    render() {
        const MyLine = withHandleEvents(Line)
        const MyDeviceCircle = withHandleEvents(DeviceCircle)
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
                                id = {object.device_id}
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
    }
    
    render() {
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
            </React.Fragment>
        )
    }
}

export default Canvas
