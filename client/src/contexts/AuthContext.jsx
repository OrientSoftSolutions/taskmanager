import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(false);
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([])


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true)
        const { data } = await axios.get(import.meta.env.VITE_API_URL + "/api/auth/userinfo", { withCredentials: true });
        setUser(data);
        setLoading(false)
      } catch (err) {
        console.error("User Not Login");
        setLoading(false)
      }
    };

    fetchUserData();
  }, []);


  if (loading) return <div className="h-lvh flex items-center justify-center">
    <img class="logo" src="https://orientsoftsolutions.com/assets/images/logo.png"
      alt="oss" />
  </div>;

  return (
    <AuthContext.Provider value={{
      user, setUser, loading, setLoading, tasks, setTasks
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}