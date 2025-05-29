import {createContext, useState, useContext} from 'react';
import { registerUser, loginUser, verifyTokenRequest } from "../api/auth"
import { useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext()

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

export const AuthProvider = ({children}) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true)

  const signup = async(user) => {


    try{
        const res = await registerUser(user)
        console.log(res)
        
    } catch (error) {
  const resErrors = error.response?.data?.errors;

  if (Array.isArray(resErrors)) {
    const parsedErrors = resErrors.map(err => {
      if (typeof err === "string") return err;
      if (typeof err === "object" && err.message) return err.message;
      return JSON.stringify(err);
    });
    setErrors(parsedErrors);
  } else if (error.response?.data?.message) {
    setErrors([error.response.data.message]);
  } else {
    setErrors(["Ocurrió un error desconocido"]);
  }
  throw error; // Re-throw the error to handle it in the calling function
}
  }



  const signin = async(user) => {

    try{
        const res = await loginUser(user)
        console.log(res)
        setIsAuthenticated(true)
        setUser(res.data)
        
    } catch (error) {
      console.error("Error during login:", error.response?.data);
  const resErrors = error.response?.data?.errors;

  if (Array.isArray(resErrors)) {
    const parsedErrors = resErrors.map(err => {
      if (typeof err === "string") return err;
      if (typeof err === "object" && err.message) return err.message;
      return JSON.stringify(err);
    });
    setErrors(parsedErrors);
  } else if (error.response?.data?.message) {
    setErrors([error.response.data.message]);
  } else {
    setErrors(["Ocurrió un error desconocido"]);
  }
}

  }

  const logout = () => {
    Cookies.remove('token')
    setUser(null)
    setIsAuthenticated(false)
  }

    useEffect(() => {
        if (errors.length > 0 ) {
            const timer = setTimeout(() => {
            setErrors([]);
        }, 7000);
        return () => 
            clearTimeout(timer);
    }
    }, [errors])


  useEffect(() => {
    
    async function  checklogin() {

      const cookies = Cookies.get();

    if (!cookies.token) {
      setIsAuthenticated(false)
      setLoading(false)
      return setUser(null)
    }
  
      
      try {
        const res = await verifyTokenRequest(cookies.token);

        if (!res.data) {
          setIsAuthenticated(false)
          setLoading(false)
         
          return setUser(null)
        }

        setIsAuthenticated(true)
        setUser(res.data)
        setLoading(false)

      } catch (error) {
      console.log(error)
        setIsAuthenticated(false)
        setUser(null)
        setLoading(false)
      }
    }
    
    checklogin()
  }, []);

  return (
    <AuthContext.Provider value={{
      signup,
      signin,
      logout,
      loading,
      user,
      isAuthenticated,
      errors
    }}>
      {children}
    </AuthContext.Provider>
  )
}

