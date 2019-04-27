import React, { Component } from 'react'
import Canvas from './canvas'
import { withFirebase } from '../components/Firebase'
import CircularDeterminate from '../components/Loading'
import "./blueprintEditor.css"
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
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

const HandleDeletionContext = React.createContext(null)

export const withHandleDeletion = Component => props => (
    <HandleDeletionContext.Consumer>
    {handleDeletion => <Component {...props} handleDeletion={handleDeletion} />}
    </HandleDeletionContext.Consumer>
)


class Editor extends Component {

  constructor(props) {
    super(props)

    this.state = {
        drawing : false,
        shape : "line",
        topOffset : null,
        leftOffset : null,
        objects : []
    }

    this.drawing = null

    this.handleClick = this.handleClick.bind(this)
    this.handleDeletion = this.handleDeletion.bind(this)
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleSaveButton = this.handleSaveButton.bind(this)
    this.switchToCircle = this.switchToCircle.bind(this)
    this.switchToLine = this.switchToLine.bind(this)

    this.EditorRef = React.createRef();
  }

  handleDeletion(index) {
    let newObjects = [...this.state.objects]
    newObjects[index] = newObjects[newObjects.length-1]
    newObjects = newObjects.slice(0,newObjects.length-1) 
    this.setState(state => ({
        objects: newObjects
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
            this.drawing = {type:"Circle"}
            this.drawing.cx = nativeEvent.offsetX
            this.drawing.cy = nativeEvent.offsetY
            this.setState(state => ({ // to make sure we dont remove existing object while moving cursor
                objects: [...state.objects, {}]
            }))
        }

        else {
            this.drawing = {type:"Circle"}
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
                    objects: [...state.objects.slice(0,state.objects.length-1), obj]
                }))
            }
        }
    }

    handleSaveButton() {
        let currUser = this.props.firebase.auth.currentUser.uid
        if (currUser) { 
            this.props.firebase.user(currUser).update({
                blueprintObjects: this.state.objects
            })
        }
    }

    componentDidMount() {
        this.setState({ loading: true })
        this.firebaseListener = this.props.firebase.auth.onAuthStateChanged(authUser => {
            if (authUser) {
                this.props.firebase.user(authUser.uid).on('value', snapshot => {   
                    this.setState({
                        objects: snapshot.val().blueprintObjects != null ? snapshot.val().blueprintObjects : [],
                        loading: false
                    })
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

  render() {
    console.log("length: "+this.state.objects.length)
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
            {!this.state.loading && (<svg xmlns='http://www.w3.org/2000/svg'
                 width="800px" 
                 height="600px" 
                 className="editor" 
                 onClick={this.handleClick}
                 onMouseMove={this.handleMouseMove}
                 ref={this.EditorRef}
            >
                <HandleDeletionContext.Provider value={this.handleDeletion} >
                    <Canvas objects={this.state.objects}/>
                </HandleDeletionContext.Provider>
            </svg>)}
            {this.state.loading && (<CircularDeterminate/>)}
        </div>
    );
  }

}

export default withFirebase(withStyles(styles)(Editor))
