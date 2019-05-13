import React from 'react'
import AuthUserContext from './context'
import { withFirebase } from '../Firebase'

const provideAuthentication = Component => {
  class provideAuthentication extends React.Component {
    constructor(props) {
      super(props);

      this.state = {
        authUser: null,
        role: null,
      }
    }

    componentDidMount() {
      this.listener = this.props.firebase.auth.onAuthStateChanged( authUser => {
          authUser ? this.setState({ authUser }) : this.setState({ authUser: null })

          if(authUser) {
            this.props.firebase.user(this.state.authUser.uid).once('value', snapshot => {

              this.setState({
                role: snapshot.val().role
              })
            })
          }
        },
      )
    }

    componentWillUnmount() {
      this.listener()
    }

    render() {
      return (
        <AuthUserContext.Provider value={this.state.authUser}>
          <Component {...this.props} />
        </AuthUserContext.Provider>
      )
    }
  }

  return withFirebase(provideAuthentication)
}

export default provideAuthentication