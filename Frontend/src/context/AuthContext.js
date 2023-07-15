import { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth'
import { auth } from '../config/firebase'

const AuthContext = createContext({})

export const useAuth = () => useContext(AuthContext)

export const AuthContextProvider = ({
  children,
}) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  console.log(user)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          media_transcribed: user.media_transcribed
        })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      setUser({
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        media_transcribed: 0 // Initialize media_transcribed to 0
      });
      return userCredential;
    });
  }

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password)
  }

  const logout = async () => {
    setUser(null)
    await signOut(auth)
  }

  const getUid = () => {
    return user ? user.uid : null
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, getUid }}>
      {loading ? null : children}
    </AuthContext.Provider>
  )
}