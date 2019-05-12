import React, { Component } from 'react'
import DeviceCircle from './circle'
import Line from './line'
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
                    return <MyLine 
                            x1 = {object.x1} 
                            x2 = {object.x2} 
                            y1 = {object.y1} 
                            y2 = {object.y2}
                            index = {index}
                            key = {`object${index}`}
                            />
                }.bind(this))
            }
            {
                this.props.devices.map(function(device) {
                    let index = this.props.devices.indexOf(device)
                    return <MyDeviceCircle
                            name = {device.name}
                            cx = {device.cx} 
                            cy = {device.cy} 
                            r = {device.r}
                            index = {index}
                            id = {device.id}
                            key = {`object${index}`}
                            />
                }.bind(this))
            }
            </React.Fragment>
        );
    }

}

export default Canvas