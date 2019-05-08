import React, { Component } from 'react'
import DeviceCircle from './circle'
import Line from './line'

class Canvas extends Component {

    render() {
        return (
            <React.Fragment>
            {
                this.props.objects.map(function(object) {
                    let index = this.props.objects.indexOf(object)
                    switch(object.type) {
                        case "Line":
                        return <Line 
                                x1 = {object.x1} 
                                x2 = {object.x2} 
                                y1 = {object.y1} 
                                y2 = {object.y2}
                                index = {index}
                                key = {`object${index}`}
                                />
                        case "Circle":
                        return <DeviceCircle 
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

export default Canvas
