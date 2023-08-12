import React from "react";
import { useContext } from "react";
import { Context } from "../Context";

function showLoadingBackDrop(props) {
  const [userLogin, setUserLogin, isLoading, setIsLoading] =
    useContext(Context);
  setIsLoading(true);

  return <div></div>;
}

export default showLoadingBackDrop;
