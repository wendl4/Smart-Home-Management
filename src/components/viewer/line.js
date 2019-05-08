import React, {Component} from 'react'

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
                />
            </React.Fragment>
        )
    }
}

export default Line