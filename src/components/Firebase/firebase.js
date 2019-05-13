import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'
import { config } from '../../config/firebaseConfig';


class Firebase {
  constructor() {
    app.initializeApp(config)

    this.auth = app.auth()
    this.db = app.database()
    this.storage = app.storage()
  }

  // *** Auth API ***

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password)

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password)

  doSignOut = () => this.auth.signOut()

  doPasswordReset = email => this.auth.sendPasswordResetEmail(email)

  doPasswordUpdate = password =>
    this.auth.currentUser.updatePassword(password)

  // *** User API ***

  user = uid => this.db.ref(`users/${uid}`)

  users = () => this.db.ref('users')

  // *** Device API ***

  device = did => this.db.ref(`devices/${did}`)

  devices = () => this.db.ref(`devices`)

  // *** Device Actions API ***

  deviceAction = did => this.db.ref(`device_actions/${did}`)

  deviceActions = () => this.db.ref(`device_actions`)

  // *** Device Owners API ***

  deviceOwner = did => this.db.ref(`device_owners/${did}`)

  deviceOwners = () => this.db.ref(`device_owners`)

  // *** Farm sensor data API ***

  farmSensorDatas = () => this.db.ref(`farm_sensor_data`)
}

export default Firebase