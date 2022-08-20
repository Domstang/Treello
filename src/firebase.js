import firebase from 'firebase/compat/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore'
import 'firebase/compat/storage'

const firebaseConfig = {
  apiKey: "AIzaSyDI2WHginSzm-etePVoKiyNi3fTUqXyZao",
  authDomain: "trello-f72ad.firebaseapp.com",
  projectId: "trello-f72ad",
  storageBucket: "trello-f72ad.appspot.com",
  messagingSenderId: "501256626371",
  appId: "1:501256626371:web:1c702cad6a03ff011d0276"
}

firebase.initializeApp(firebaseConfig)

// utils
const db = firebase.firestore()
const auth = firebase.auth()
const storage = firebase.storage()

// collection ref
const usersCollection = db.collection('users')
const userSettingsCollection = db.collection('userSettings')
const tasksCollection = db.collection('tasks')
const listsCollection = db.collection('lists')

export {
  db,
  auth,
  storage,
  usersCollection,
  userSettingsCollection,
  tasksCollection,
  listsCollection
}