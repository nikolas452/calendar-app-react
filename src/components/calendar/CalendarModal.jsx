import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import Modal from "react-modal";
import DateTimePicker from "react-datetime-picker";
import Swal from "sweetalert2";
import { uiCloseModal } from "../../actions/ui";
import {
  eventClearActiveEvent,
  eventStartAddNew,
  eventStartUpdated,
} from "../../actions/events";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const now = moment().minutes(0).second(0).add(1, "hour");
const date = now.clone().add(1, "hour");
const initEvent = {
  title: "",
  notes: "",
  start: now.toDate(),
  end: date.toDate(),
};

export const CalendarModal = () => {
  const dispatch = useDispatch();
  // Store
  const { modalOpen } = useSelector((state) => state.ui);
  const { activeEvent } = useSelector((state) => state.calendar);
  // States
  const [titleValid, setTitleValid] = useState(true);
  const [dateStart, setDateStart] = useState(now.toDate());
  const [dateEnd, setDateEnd] = useState(date.toDate());
  const [formValues, setFormValues] = useState(initEvent);
  const { notes, title, start, end } = formValues;
  // Efectos
  useEffect(() => {
    activeEvent ? setFormValues(activeEvent) : setFormValues(initEvent);
  }, [activeEvent, setFormValues]);

  const handleInputChange = ({ target }) => {
    setFormValues({ ...formValues, [target.name]: target.value });
  };

  const closeModal = () => {
    dispatch(uiCloseModal());
    setTimeout(() => {
      dispatch(eventClearActiveEvent());
      setFormValues(initEvent);
    }, 200);
  };

  const onChangeStartDate = (e) => {
    setDateStart(e);
    setFormValues({ ...formValues, start: e });
  };
  const onChangeEndDate = (e) => {
    setFormValues({ ...formValues, end: e });
    setDateEnd(e);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    let startMoment = moment(start).millisecond(0);
    let endMoment = moment(end).millisecond(0);
    if (startMoment.isSameOrAfter(endMoment)) {
      return Swal.fire(
        "Error",
        "La fecha fin debe ser mayor a la fecha de inicio",
        "error"
      );
    }
    if (title.trim().length < 2) return setTitleValid(false);

    if (activeEvent) dispatch(eventStartUpdated(formValues));
    else dispatch(eventStartAddNew(formValues));

    setTitleValid(true);
    closeModal();
    console.log(formValues);
  };
  return (
    <Modal
      isOpen={modalOpen}
      // onAfterOpen={afterOpenModal}
      onRequestClose={closeModal}
      style={customStyles}
      closeTimeoutMS={200}
      className="modal"
      overlayClassName="modal-fondo"
    >
      {activeEvent ? <h1> Editar evento </h1> : <h1> Nuevo evento </h1>}
      <hr />
      <form className="container" onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label>Fecha y hora inicio</label>
          <DateTimePicker
            onChange={onChangeStartDate}
            value={dateStart}
            className="form-control"
          />
        </div>

        <div className="form-group my-4">
          <label>Fecha y hora fin</label>
          <DateTimePicker
            onChange={onChangeEndDate}
            value={dateEnd}
            minDate={dateStart}
            className="form-control"
          />
        </div>

        <hr />
        <div className="form-group my-4">
          <label>Titulo y notas</label>
          <input
            type="text"
            className={`form-control ${!titleValid && "is-invalid"} ${
              titleValid && "is-valid"
            }`}
            placeholder="T??tulo del evento"
            name="title"
            autoComplete="off"
            value={title}
            onChange={handleInputChange}
          />
          <small id="emailHelp" className="form-text text-muted">
            Una descripci??n corta
          </small>
        </div>

        <div className="form-group mb-4">
          <textarea
            type="text"
            className="form-control"
            placeholder="Notas"
            rows="5"
            name="notes"
            value={notes}
            onChange={handleInputChange}
          ></textarea>
          <small id="emailHelp" className="form-text text-muted">
            Informaci??n adicional
          </small>
        </div>
        <div className="d-grid gap-2">
          <button type="submit" className="btn btn-outline-primary btn-block">
            <i className="far fa-save"></i>
            <span> Guardar</span>
          </button>
        </div>
      </form>
    </Modal>
  );
};
