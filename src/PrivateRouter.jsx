import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import React from "react";

function PrivateRouter({ comp: Component }) {
  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!userInfo) {
    return <Navigate to="/" />;
  }

  return <Component />;
}

export default PrivateRouter;
