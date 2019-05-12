import React, { Component } from 'react'
import Canvas from './canvas'
import { withFirebase } from '../Firebase'
import CircularDeterminate from '../Loading'
import { withStyles } from '@material-ui/core/styles'
import { withAutorization } from '../session'

const styles = theme => ({
    button: {
      margin: theme.spacing.unit,
    },
    leftIcon: {
      marginRight: theme.spacing.unit,
    },
    rightIcon: {
      marginLeft: theme.spacing.unit,
    },
    iconSmall: {
      fontSize: 20,
    },
  })

const HandleDeletionContext = React.createContext(null)

// make save and delete accessible for descentants
export const withHandleEvents = Component => props => (
    <HandleDeletionContext.Consumer>
    {handleEvents => <Component {...props} handleEvents={handleEvents} />}
    </HandleDeletionContext.Consumer>
)


class Viewer extends Component {

  constructor(props) {
    super(props)

    this.state = {
        drawing : false,
        shape : "line",
        topOffset : null,
        leftOffset : null,
        objects : [],
        devices : [],
        deletedDevices: []
    }
    this.drawing = null

  }

    componentDidMount() {
        this.setState({ loading: true })
        this.firebaseListener = this.props.firebase.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.props.firebase.user(authUser.uid).once('value', snapshot => {   
                    this.setState({
                        objects: snapshot.val().blueprintObjects != null ? snapshot.val().blueprintObjects : [],
                        loading: false
                    })
                })
            }
        })
    }

  render() {
    return (
        <div className="editorwindow">
            <h1> Blueprint viewer </h1>
            {!this.state.loading && (<svg xmlns='http://www.w3.org/2000/svg'
                 width="800px" 
                 height="600px" 
                 className="editor" 
            >
                <HandleDeletionContext.Provider value={{}} >
                    <Canvas objects={this.state.objects}/>
                </HandleDeletionContext.Provider>
            </svg>)}
            {this.state.loading && (<CircularDeterminate/>)}
        </div>
    );
  }

}

const condition = authUser => !!authUser

export default withAutorization(condition)(withFirebase(withStyles(styles)(Viewer)))