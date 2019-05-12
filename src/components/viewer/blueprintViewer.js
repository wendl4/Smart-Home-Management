import React, { Component } from 'react'
import { withAutorization } from '../../components/session'
import Canvas from './canvas'
import { withFirebase } from '../../components/Firebase'
import CircularDeterminate from '../../components/Loading'
import { withStyles } from '@material-ui/core/styles'

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

const HandleEventsContext = React.createContext(null)

// make save and delete accessible for descentants
export const withHandleEvents = Component => props => (
    <HandleEventsContext.Consumer>
    {handleEvents => <Component {...props} handleEvents={handleEvents} />}
    </HandleEventsContext.Consumer>
)


class Viewer extends Component {

  constructor(props) {
    super(props)

    this.state = {
        topOffset : null,
        leftOffset : null,
        objects : [],
        devices : [],
        backgroundImageUrl: null
    }

    this.EditorRef = React.createRef();
  }

    componentDidMount() {
        this.setState({ loading: true })
        this.firebaseListener = this.props.firebase.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.props.firebase.deviceOwners().orderByChild("userId").equalTo(authUser.uid).once('value', snapshot => {
                    const deviceOwners = snapshot.val()
                    if (deviceOwners) {
                        Object.keys(deviceOwners).forEach(id => { 
                            this.props.firebase.device(deviceOwners[id].deviceId).once('value', snapshot => {
                                let device = snapshot.val()
                                if (device) {
                                    device.id = deviceOwners[id].deviceId
                                    device.ownerTableId = id
                                    this.setState( state => ({
                                        devices: [...state.devices,device],
                                    }))
                                }
                            })
                        })
                    }
                })
                this.props.firebase.user(authUser.uid).once('value', snapshot => {
                    this.setState({
                        objects: snapshot.val().blueprintObjects != null ? snapshot.val().blueprintObjects : [],
                        loading: false
                    })
                })

                var pathReference = this.props.firebase.storage.ref('blueprint')
                pathReference.getDownloadURL().then(function(url) {
                    this.setState({
                        backgroundImageUrl: url
                    })
                }.bind(this)).catch(function(error) {
                    console.log(error.message)
                  })
            }
        })
    }

    componentWillUnmount() {
        this.props.firebase.users().off()
        this.firebaseListener()
    }

    setRef = ref => {
        this.file = ref 
    }

    render() {
        let backgroundImage = (this.state.backgroundImageUrl) ? <image xlinkHref={this.state.backgroundImageUrl} style={{margin:'auto'}} width='800px' height='600px' /> : ""
        return (
            <div className="editorwindow">
                <h1> Blueprint viewer </h1>
                {!this.state.loading && (
                <svg xmlns='http://www.w3.org/2000/svg'
                    xmlnsXlink='http://www.w3.org/1999/xlink'
                    width="800px" 
                    height="600px" 
                    className="editor" 
                    onClick={this.handleClick}
                    onMouseMove={this.handleMouseMove}
                    ref={this.EditorRef}
                >
                    <HandleEventsContext.Provider value={{handleObjectDeletion: this.handleObjectDeletion, handleDeviceDeletion: this.handleDeviceDeletion, handleSave:this.handleSaveButton}} >
                        {backgroundImage}
                        <Canvas objects={this.state.objects} devices={this.state.devices}/>
                    </HandleEventsContext.Provider>
                </svg>)}
                {this.state.loading && (<CircularDeterminate/>)}
            </div>
        )
    }

}

const condition = authUser => !!authUser

export default withAutorization(condition)(withFirebase(withStyles(styles)(Viewer)))
