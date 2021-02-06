import React, { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import Header from "./components/layout/Header";
import Home from "./components/pages/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import PosContainer from "./components/pos/PosContainer"
import UserContext from "./context/UserContext";
import { ToastProvider } from 'react-toast-notifications';
import { GuardProvider, GuardedRoute } from 'react-router-guards';
import "./style.css";

// const MyCustomToast = ({ appearance, children }) => (
//   <div style={{ marginTop: '50px' }}>
//     {children}
//   </div>
// );
const requireLogin = (to, from, next) => {
    if (to.meta.auth) {
      if (localStorage.getItem('displayName')!== '') {
        next();
      }
      next.redirect('/login');
    } else {
      next();
    }
  };


export default function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        localStorage.setItem("displayName", "");
        token = "";
      }
      const tokenRes = await Axios.post(
        "http://localhost:5000/users/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } }
      );
      if (tokenRes.data) {
        setUserData({
          token,
          user: localStorage.getItem("displayName"),
        })
        // const userRes = await Axios.get("http://localhost:5000/users/", {
        //   headers: { "x-auth-token": token },
        // });
        // console.log(userRes.data);
        // setUserData({
        //   token,
        //   user: userRes.data,
        // });
      }
    };

    checkLoggedIn();
  }, []);
  

  return (
    <>
      <BrowserRouter>
        
        <UserContext.Provider value={{ userData, setUserData }}>
          <Header />
          <ToastProvider>
          <div className="container">
            <GuardProvider guards={[requireLogin]}>
              <Switch>
                <GuardedRoute exact path="/" component={Home} />
                <GuardedRoute path="/login" component={Login} />
                <GuardedRoute path="/register" component={Register} />
                <GuardedRoute path= "/pos" component= {PosContainer} meta={{ auth: true }}/>
              </Switch>
            </GuardProvider>
          </div>
          </ToastProvider>
        </UserContext.Provider>
        
      </BrowserRouter>
    </>
  );
}
