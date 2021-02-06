import React, { useContext } from "react";
import UserContext from "../../context/UserContext";
import { useHistory } from "react-router-dom";

// import { Link } from "react-router-dom";


export default function Home() {
  const history = useHistory();

  const { userData } = useContext(UserContext);
  if (userData.user){
    history.push("/pos");
  }
  return (
    <></>
  )
}
