import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';

const Modalexpense = ({ obejet, listdbExpense, setExpense }) => {
    const style1 = {
        border: "2px solid var(--nav-color)",
        borderRadius: "10px",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
    }

    const style2 = {
        flexDirection: "row",
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        margin: "0.5rem",
        border: " 1px solid var(--color2)",
        borderRadius: "10px",
        padding: "1rem",
        justifyContent: "center"
    }

    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);



    /*******************************************/

    const onSubmit = (data) => {
        //console.log(data);
        data.total = parseFloat(data.alimentacion) + parseFloat(data.combustible) + parseFloat(data.vehiculo) + parseFloat(data.peaje);
        //console.log(data);
        /***************Aqui toca enviar informacion*************/
        setExpense(data)
        /*======================================================*/
    }
    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Expense
            </Button>
            {/* style={{ border: " 2px solid var(--nav-color)", borderRadius: "10px", padding: "1rem" }} */}
            <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Expense</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form className='formModal' onSubmit={handleSubmit(onSubmit)}>
                        <div style={{ display: "flex", gap: "1rem" }}>

                            {/*Form Grup Alimentacion*/}
                            <Form.Group className="mb-3" controlId="Alimentacion" style={style1} >
                                <Form.Label>Alimentacion</Form.Label>
                                <h5 className='p-title'>Escriba en la caja de texto el Total en $</h5>
                                <i className="fa-solid fa-utensils bx-lg"></i>
                                <div style={style2}>
                                    <Form.Control
                                        name="totalAlimentacion"
                                        type="number" className="form-control form-control-sm"
                                        style={{ maxWidth: "75px", textAlign: "center" }}
                                        {...register(`${listdbExpense[1]}`, { required: true })}
                                    />
                                    <p className={`error-message ${errors[listdbExpense[1]] ? 'showError' : 'showMessage'}`}>
                                        {errors[listdbExpense[1]] ? "Este campo es requerido" : " Coloque el total de dinero que gasto en Alimentacion"}</p>
                                </div>
                            </Form.Group>

                            {/*Form Grup Combustible*/}
                            <Form.Group className="mb-3" controlId="Combustible" style={style1} >
                                <Form.Label>Combustible</Form.Label>
                                <i className="fa-solid fa-gas-pump bx-lg"></i>
                                <h5 className='p-title'>Escriba en la caja de texto el Total en $</h5>
                                <div style={style2}>

                                    <Form.Control
                                        name="totalCombustible"
                                        type="number" className="form-control form-control-sm"
                                        style={{ maxWidth: "75px", textAlign: "center" }}
                                        {...register(`${listdbExpense[2]}`, { required: true })}
                                    />
                                    <p className={`error-message ${errors[listdbExpense[2]] ? 'showError' : 'showMessage'}`}>
                                        {errors[listdbExpense[2]] ? "Este campo es requerido" : " Coloque el total de gastos en combustible"}
                                    </p>
                                </div>
                            </Form.Group>

                        </div>

                        <div style={{ display: "flex", gap: "1rem" }}>

                            {/*Form Grup Peajes*/}
                            <Form.Group className="mb-3" controlId="Depositos" style={style1} >
                                <Form.Label>Peajes</Form.Label>
                                <h5 className='p-title'>Escriba en la caja de texto el Total en $</h5>
                                <i className="fa-solid fa-car-tunnel bx-lg"></i>
                                <div style={style2}>
                                    <Form.Control
                                        name="totalPeajes"
                                        type="number" className="form-control form-control-sm"
                                        style={{ maxWidth: "75px", textAlign: "center" }}
                                        {...register(`${listdbExpense[3]}`, { required: true })}
                                    />
                                    <p className={`error-message ${errors[listdbExpense[3]] ? 'showError' : 'showMessage'}`}>
                                        {errors[listdbExpense[3]] ? "Este campo es requerido" : " Coloque el total de dinero que gasto de movilizacion de la mercaderia"}</p>
                                </div>
                            </Form.Group>

                            {/*Form Grup Vehiculo*/}
                            <Form.Group className="mb-3" controlId="Combustible" style={style1} >
                                <Form.Label>Vehiculo</Form.Label>
                                <h5 className='p-title'>Escriba en la caja de texto el Total en $</h5>
                                <i className="fa-solid fa-car-burst bx-lg"></i>
                                <div style={style2}>
                                    <Form.Control
                                        name="totalVehiculo"
                                        type="number" className="form-control form-control-sm"
                                        style={{ maxWidth: "75px", textAlign: "center" }}
                                        {...register(`${listdbExpense[4]}`, { required: true })}
                                    />
                                    <p className={`error-message ${errors[listdbExpense[4]] ? 'showError' : 'showMessage'}`}>
                                        {errors[listdbExpense[4]] ? "Este campo es requerido" : " Coloque el total de gastos en el Vehiculo"}
                                    </p>
                                </div>
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3" controlId="detalleExpenses" style={style1} >
                            <Form.Label>Detalle</Form.Label>
                            <h5 className='p-title'>Escriba los detalles de los gastos</h5>
                            <i className="fa-solid fa-circle-info bx-lg"></i>
                            <div style={style2}>
                                <textarea
                                    className="form-control" id="exampleTextarea"
                                    rows="20" cols="70" style={{ height: "81px" }}
                                    {...register(`${listdbExpense[6]}`, { required: true })} >
                                </textarea>
                                <p className={`error-message ${errors[listdbExpense[6]] ? 'showError' : 'showMessage'}`}>
                                    {errors[listdbExpense[6]] ? "Este campo es requerido" : " Escriba detalladamente los gastos"}
                                </p>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="success" type="submit" onClick={handleSubmit(onSubmit)}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default Modalexpense;