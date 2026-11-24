import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth'
import { auth } from '../lib/firebase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isDemo, setIsDemo] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedDemo = localStorage.getItem('trackflow_demo')
    if (savedDemo === 'true') {
      setIsDemo(true)
      setUser({ uid: 'demo-user', email: 'recruiter.demo@trackflow.app' })
      setLoading(false)
      return
    }

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const enterDemoMode = () => {
    localStorage.setItem('trackflow_demo', 'true')
    setIsDemo(true)
    setUser({ uid: 'demo-user', email: 'recruiter.demo@trackflow.app' })
  }

  const signOut = async () => {
    localStorage.removeItem('trackflow_demo')
    setIsDemo(false)
    setUser(null)
    await firebaseSignOut(auth)
  }

  return (
    <AuthContext.Provider value={{ user, isDemo, loading, enterDemoMode, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
