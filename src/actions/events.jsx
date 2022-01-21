import Swal from "sweetalert2";
import { fetchContToken } from "../helpers/fetch";
import { prepareEvents } from "../helpers/prepareEvents";
import { types } from "../types/types";

export const eventStartAddNew = (event) => {
  return async (dispacth, getState) => {
    const { uid, name } = getState().auth;
    try {
      const resp = await fetchContToken("events", event, "POST");
      const body = await resp.json();
      if (body.ok) {
        event.id = body.evento.id;
        event.user = { _id: uid, name };
        dispacth(eventAddNew(event));
      }
    } catch (error) {
      console.log(error);
    }
  };
};

const eventAddNew = (event) => ({
  type: types.eventAddNew,
  payload: event,
});
export const eventSetActive = (event) => ({
  type: types.eventSetActive,
  payload: event,
});
export const eventClearActiveEvent = () => ({
  type: types.eventClearActiveEvent,
});

export const eventStartUpdated = (event) => {
  return async (dispatch) => {
    try {
      const resp = await fetchContToken(`events/${event.id}`, event, "PUT");
      const body = await resp.json();

      if (body.ok) dispatch(eventUpdated(event));
      else Swal.fire("Error", body.msg, "error");
    } catch (error) {
      console.log(error);
    }
  };
};
const eventUpdated = (event) => ({
  type: types.eventUpdated,
  payload: event,
});

export const eventStartDelete = () => {
  return async (dispatch, getState) => {
    const { id } = getState().calendar.activeEvent;
    try {
      const resp = await fetchContToken(`events/${id}`, {}, "DELETE");
      const body = await resp.json();

      if (body.ok) dispatch(eventDeleted());
      else Swal.fire("Error", body.msg, "error");
    } catch (error) {
      console.log(error);
    }
  };
};

const eventDeleted = () => ({ type: types.eventDeleted });

export const eventStartLoading = () => {
  return async (dispacth) => {
    try {
      const resp = await fetchContToken("events");
      const body = await resp.json();
      const eventos = prepareEvents(body.eventos);
      dispacth(eventLoaded(eventos));
    } catch (error) {
      console.log(error);
    }
  };
};

const eventLoaded = (events) => ({
  type: types.eventLoaded,
  payload: events,
});

export const eventLogout = () => ({ type: types.eventLogout });
