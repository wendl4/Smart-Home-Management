import React, { Component } from 'react'
import { withAuthentication } from './session'

class Home extends Component {

    render() {
        const loggedMessage = "Continue by editing blueprints in Editor and controlling devices in viewer"
        const notLoggedMessage = "Continue by clicking side menu and Log in or Sign up."
        const text = (this.props.authUser) ? loggedMessage : notLoggedMessage
        return (
            <div style={{textAlign:'center',marginTop:200}}>
                <h1>Welcome to Smart Home Management!</h1>
                <p>
                    {text}
                </p>
            </div>
        );
    }
}

export default withAuthentication(Home)
