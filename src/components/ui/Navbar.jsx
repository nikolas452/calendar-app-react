import React from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { startLogout } from "../../actions/auth";

export const Navbar = () => {
  const { name } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(startLogout());
  };
  return (
    <nav className="navbar navbar-dark bg-dark mb-4">
      <div className="container-fluid">
        <span className="navbar-brand">{name}</span>
        <button className="btn btn-outline-danger" onClick={handleLogout}>
          <i className="fas fa-sign-out-alt mr-1"></i> <span>Salir</span>
        </button>
      </div>
    </nav>
  );
};
