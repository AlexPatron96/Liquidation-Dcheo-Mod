import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';

const Modalprodret = ({ obejet, listdbProducRetorn, setProductReturn }) => {
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
        data.total = parseFloat(data.mal_estado) + parseFloat(data.rechazados);
       //console.log(data);
        /***************Aqui toca enviar informacion*************/
        setProductReturn(data)
        /*======================================================*/
    }
    /*******************************************/
    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Product Returned
            </Button>
            <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Product Returned</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form className='formModal' onSubmit={handleSubmit(onSubmit)}>
                        <div style={{ display: "flex", gap: "1rem" }}>

                            {/*Form Grup Mal estado*/}
                            <Form.Group className="mb-3" controlId="Malestado" style={style1} >
                                <Form.Label>Mal estado</Form.Label>
                                <h5 className='p-title'>Escriba en la caja de texto el Total en $</h5>
                                <i className="fa-solid fa-heart-crack bx-lg"></i>
                                <div style={style2}>
                                    <Form.Control
                                        name="totalMalestado"
                                        type="number" className="form-control form-control-sm"
                                        style={{ maxWidth: "75px", textAlign: "center" }}
                                        {...register(`${listdbProducRetorn[1]}`, { required: true })}
                                    />
                                    <p className={`error-message ${errors[listdbProducRetorn[1]] ? 'showError' : 'showMessage'}`}>
                                        {errors[listdbProducRetorn[1]] ? "Este campo es requerido" : " Coloque el total de dinero de productos de mal estado"}</p>
                                </div>
                            </Form.Group>

                            {/*Form Grup Rechazados*/}
                            <Form.Group className="mb-3" controlId="Rechazados" style={style1} >
                                <Form.Label>Rechazados</Form.Label>
                                <i className="fa-solid fa-recycle bx-lg"></i>
                                <h5 className='p-title'>Escriba en la caja de texto el Total en $</h5>
                                <div style={style2}>
                                    <Form.Control
                                        name="totalRechazados"
                                        type="number" className="form-control form-control-sm"
                                        style={{ maxWidth: "75px", textAlign: "center" }}
                                        {...register(`${listdbProducRetorn[2]}`, { required: true })}
                                    />
                                    <p className={`error-message ${errors[listdbProducRetorn[2]] ? 'showError' : 'showMessage'}`}>
                                        {errors[listdbProducRetorn[2]] ? "Este campo es requerido" : " Coloque el total de Productos rechazados"}
                                    </p>
                                </div>
                            </Form.Group>

                        </div>

                        <Form.Group className="mb-3" controlId="Cheques" style={style1} >
                            <Form.Label>Detalle</Form.Label>
                            <h5 className='p-title'>Escriba los detalles de los Productos Retornados</h5>
                            <i className="fa-solid fa-circle-info bx-lg"></i>
                            <div style={style2}>
                                <textarea
                                    className="form-control" id="exampleTextarea"
                                    rows="20" cols="70" style={{ height: "81px" }}
                                    {...register(`${listdbProducRetorn[4]}`, { required: true })} >
                                </textarea>
                                <p className={`error-message ${errors[listdbProducRetorn[4]] ? 'showError' : 'showMessage'}`}>
                                    {errors[listdbProducRetorn[4]] ? "Este campo es requerido" : " Escriba detalladamente los Productos que retornan "}
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

export default Modalprodret;