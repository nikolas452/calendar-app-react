import Swal from "sweetalert2";
import { fetchContToken, fetchSinToken } from "../helpers/fetch";
import { types } from "../types/types";
import { eventLogout } from "./events";

export const startLogin = (email, password) => {
  return async (dispatch) => {
    const resp = await fetchSinToken("auth", { email, password }, "POST");
    const body = await resp.json();
    console.log("despues de hacer el string a json", body);

    if (body.ok) {
      localStorage.setItem("token", body.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(login({ uid: body.uid, name: body.name }));
    } else Swal.fire("Error", body.msg, "error");
  };
};

export const startRegister = (email, name, password) => {
  return async (dispatch) => {
    const resp = await fetchSinToken(
      "auth/new",
      { email, name, password },
      "POST"
    );
    const body = await resp.json();
    console.log("despues de hacer el string a json", body);

    if (body.ok) {
      localStorage.setItem("token", body.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(login({ uid: body.uid, name: body.name }));
    } else Swal.fire("Error", body.msg, "error");
  };
};

export const startChecking = () => {
  return async (dispatch) => {
    const resp = await fetchContToken("auth/renew");
    const body = await resp.json();
    console.log("despues de hacer el string a json", body);
    if (body.ok) {
      localStorage.setItem("token", body.token);
      localStorage.setItem("token-init-date", new Date().getTime());
      dispatch(login({ uid: body.uid, name: body.name }));
    } else dispatch(checkingFinish());
  };
};

const checkingFinish = () => ({ type: types.authCheckingFinish });

const login = (user) => ({
  type: types.authLogin,
  payload: user,
});

export const startLogout = () => {
  return (dispatch) => {
    localStorage.clear();
    dispatch(eventLogout());
    dispatch(logout());
  };
};
const logout = () => ({ type: types.authLogout });
