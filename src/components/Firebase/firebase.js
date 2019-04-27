import app from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'

const config = {
  apiKey: "AIzaSyD2EfDAI_5NUNz-Xj1aCZ3jlCe4QvY0q2s",
  authDomain: "smarthomemanagement-8ce8e.firebaseapp.com",
  databaseURL: "https://smarthomemanagement-8ce8e.firebaseio.com",
  projectId: "smarthomemanagement-8ce8e",
  storageBucket: "smarthomemanagement-8ce8e.appspot.com",
  messagingSenderId: "850157476277"
};

class Firebase {
  constructor() {
    app.initializeApp(config)

    this.auth = app.auth()
    this.db = app.database()
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
}

export default Firebase