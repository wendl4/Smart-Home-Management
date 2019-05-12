import React, { Component } from 'react'
import { withAutorization } from '../../components/session'
import Canvas from './canvas'
import { withFirebase } from '../../components/Firebase'
import CircularDeterminate from '../../components/Loading'
import "./blueprintEditor.css"
import classNames from 'classnames'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import SaveIcon from '@material-ui/icons/Save'

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


class Editor extends Component {

  constructor(props) {
    super(props)

    this.state = {
        drawing : false,
        shape : "line",
        topOffset : null,
        leftOffset : null,
        objects : [],
        devices : [],
        newDevices : [],
        deletedDevices: [],
        backgroundImageUrl: null
    }

    this.drawing = null

    this.handleClick = this.handleClick.bind(this)
    this.handleObjectDeletion = this.handleObjectDeletion.bind(this)
    this.handleDeviceDeletion = this.handleDeviceDeletion.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleSaveButton = this.handleSaveButton.bind(this)
    this.switchToCircle = this.switchToCircle.bind(this)
    this.switchToLine = this.switchToLine.bind(this)
    this.handleUpload = this.handleUpload.bind(this)

    this.EditorRef = React.createRef();
  }

    handleUpload() {
        const file = this.file.files[0]
        const storageRef = this.props.firebase.storage.ref()
        const mainImage = storageRef.child("blueprint")
        mainImage.put(file).then((snapshot) => {
            mainImage.getDownloadURL().then((url) =>
                this.setState({
                    backgroundImageUrl: url
                })
            )
        })
    }

    handleObjectDeletion(index) {
        let newObjects = [...this.state.objects]
        newObjects[index] = newObjects[newObjects.length-1]
        newObjects = newObjects.slice(0,newObjects.length-1) 
        this.setState(state => ({
            objects: newObjects,
        }))
    }

    handleDeviceDeletion(index) {
        let newDevices = [...this.state.devices]
        
        // delete device from db
        let deletedDevices = this.state.deletedDevices
        deletedDevices = deletedDevices.concat(newDevices[index])

        newDevices[index] = newDevices[newDevices.length-1]
        newDevices = newDevices.slice(0,newDevices.length-1) 
        this.setState(state => ({
            devices: newDevices,
            deletedDevices: deletedDevices
        }))
    }


    handleClick({nativeEvent}) {
        if (this.state.shape === "line") {
            if (!this.state.drawing) {
                this.drawing = {type:"Line"}
                this.drawing.x1 = nativeEvent.offsetX
                this.drawing.y1 = nativeEvent.offsetY
                this.setState(state => ({ // to make sure we dont remove existing object while moving cursor
                    objects: [...state.objects, {}]
                }))
            }

            else {
                this.drawing.x2 = nativeEvent.offsetX
                this.drawing.y2 = nativeEvent.offsetY
                this.drawing = {type:"Line"}
            }
        }

        else if (this.state.shape === "circle") {
            if (!this.state.drawing) {
                this.drawing = {}
                this.drawing.cx = nativeEvent.offsetX
                this.drawing.cy = nativeEvent.offsetY
                this.setState(state => ({ // to make sure we dont remove existing object while moving cursor
                    devices: [...state.devices, {}]
                }))
            }

            else {
                this.drawing.r = Math.sqrt(Math.abs(nativeEvent.offsetX-this.drawing.cx) ** 2 + Math.abs(nativeEvent.offsetY-this.drawing.cy) ** 2)
                let obj = Object.assign({}, this.drawing)

                //create device object and add its index to blueprint object
                let deviceRef = this.props.firebase.devices().push()
                obj.ref = deviceRef

                this.setState(state => ({
                    devices: [...state.devices.slice(0,state.devices.length-1), obj]
                }))
                this.drawing = {}
            }
        }   

        this.setState(state => ({
            drawing: !state.drawing,
        }))
    }

    handleMouseMove({nativeEvent}) {
        if (this.state.drawing) {
            if (this.state.shape === "line") {
                this.drawing.x2 = nativeEvent.offsetX
                this.drawing.y2 = nativeEvent.offsetY
                let obj = Object.assign({}, this.drawing)
                this.setState(state => ({
                    objects: [...state.objects.slice(0,state.objects.length-1), obj]
                }))
            }
            else if (this.state.shape === "circle") {
                this.drawing.r = Math.sqrt(Math.abs(nativeEvent.offsetX-this.drawing.cx) ** 2 + Math.abs(nativeEvent.offsetY-this.drawing.cy) ** 2)
                let obj = Object.assign({}, this.drawing)
                this.setState(state => ({
                    devices: [...state.devices.slice(0,state.devices.length-1), obj]
                }))
            }
        }
    }

    handleSaveButton() {
        let currUser = this.props.firebase.auth.currentUser.uid
        //add blueprint objects to user
        if (currUser) { 
            this.props.firebase.user(currUser).update({
                blueprintObjects: this.state.objects
            })
        }
        // create device
        this.state.devices.forEach(device => {
            const deviceRef = device.ref
            if (deviceRef) {
                // save device to database
                deviceRef.set({
                    name: "defaultName",
                    cx: device.cx,
                    cy: device.cy,
                    r: device.r
                })
                device.id = device.ref.path.pieces_[1]

                // save connection user <-> device
                const deviceOwnerRef = this.props.firebase.deviceOwners().push()
                deviceOwnerRef.set({
                    userId: currUser,
                    deviceId: device.ref.path.pieces_[1]
                })
                device.ownerTableId = deviceOwnerRef.path.pieces_[1]

                delete device.ref
            }
        })

        this.state.deletedDevices.forEach(device => {
            if (device.id) {
                this.props.firebase.device(device.id).remove()  
                this.props.firebase.deviceOwner(device.ownerTableId).remove()
                this.props.firebase.deviceActions().orderByChild("deviceId").equalTo(device.id).once('value', snapshot => {
                    snapshot.ref.remove()
                })
            }
        })
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

    switchToCircle() {
        this.setState(state => ({
            shape: 'circle'
        }))
    }

    switchToLine() {
        this.setState(state => ({
            shape: 'line'
        }))
    }

    setRef = ref => {
        this.file = ref 
    }

    render() {
        let backgroundImage = (this.state.backgroundImageUrl) ? <image xlinkHref={this.state.backgroundImageUrl} style={{margin:'auto'}} width='800px' height='600px' /> : ""
        return (
            <div className="editorwindow">
                <h1> Blueprint editor </h1>
                <p>
                    <Button 
                        variant="contained"
                        size="small"
                        onClick={this.switchToCircle} 
                        className={this.props.classes.button}>
                        Add Device
                    </Button>

                    <Button 
                        variant="contained"
                        size="small"
                        onClick={this.switchToLine} 
                        className={this.props.classes.button}>
                        Add Wall
                    </Button>

                    <Button variant="contained" size="small" onClick={this.handleSaveButton} className={this.props.classes.button}>
                        <SaveIcon className={classNames(this.props.classes.leftIcon, this.props.classes.iconSmall)} />
                            Save
                    </Button>
                </p>
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
                <br/>
                <div>
                    <p>If you want to upload custom PNG blueprint background</p>
                    <input type="file" ref={this.setRef}/>
                    <br/>
                    <Button variant="contained" component="span" onClick={this.handleUpload} className={this.props.classes.button}>
                        Upload
                    </Button>
                </div>
            </div>
        )
    }

}

const condition = authUser => !!authUser

export default withAutorization(condition)(withFirebase(withStyles(styles)(Editor)))
