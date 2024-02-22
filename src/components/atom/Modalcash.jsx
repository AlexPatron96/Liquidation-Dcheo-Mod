import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useForm } from 'react-hook-form';
import { Form } from 'react-bootstrap';


const Modalcash = ({ obejet, listdbCash, setCash }) => {

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


    /********* CALCULO DE LAS MONEDAS *********/
    const [totalMonedas, setTotalmonedas] = useState(0);
    const [monedasValue, setMonedasValue] = useState({
        "1dolar": 0,
        "50cent": 0,
        "25cent": 0,
        "10cent": 0,
        "5cent": 0,
        "1cent": 0,
        "total": 0
    });
    const resetMonedas = () => {
        setMonedasValue({
            "1dolar": 0,
            "50cent": 0,
            "25cent": 0,
            "10cent": 0,
            "5cent": 0,
            "1cent": 0,
            "total": 0
        });
        setTotalmonedas(0);
    }
    const calcularTotalMonedas = () => {
        const total = (monedasValue['1dolar'] * 1) + (monedasValue['50cent'] * 0.5) + (monedasValue['25cent'] * 0.25)
            + (monedasValue['10cent'] * 0.1) + (monedasValue['5cent'] * 0.05) + (monedasValue['1cent'] * 0.01);
        setTotalmonedas(total);
    }
    const handleChange = e => {
        const { name, value } = e.target;
        const newValue = parseInt(value);
        // Calcula el valor total actualizado basado en el valor previo y el nuevo valor
        const newTotal = totalMonedas - (monedasValue[name] || 0) + newValue;
        // Actualiza el estado con el nuevo valor total y el nuevo valor de la moneda correspondiente
        setTotalmonedas(newTotal);
        setMonedasValue(prevState => ({
            ...prevState,
            [name]: newValue
        }));
        calcularTotalMonedas();
    };
    /*******************************************/
    /********* CALCULO DE LOS BILLETES *********/
    const [totalBillete, setTotalBillete] = useState(0);
    const [billeteValue, setBilleteValue] = useState({
        "100Dollar": 0,
        "50Dollar": 0,
        "20Dollar": 0,
        "10Dollar": 0,
        "5Dollar": 0,
        "1Dollar": 0,
        "total": 0
    });
    const resetBilletes = () => {
        setBilleteValue({
            "100Dollar": 0,
            "50Dollar": 0,
            "20Dollar": 0,
            "10Dollar": 0,
            "5Dollar": 0,
            "1Dollar": 0,
            "total": 0
        });
        setTotalBillete(0);
    };
    const calcularTotalBilletes = () => {
        console.log("calcular billetes");
        const total = (billeteValue['1Dollar'] * 1) + (billeteValue['5Dollar'] * 5) + (billeteValue['10Dollar'] * 10)
            + (billeteValue['20Dollar'] * 20) + (billeteValue['50Dollar'] * 50) + (billeteValue['100Dollar'] * 100);
        setTotalBillete(total);
    };
    const handleChangeBillete = e => {
        const { name, value } = e.target;
        setBilleteValue(prevState => ({
            ...prevState,
            [name]: value
        }));
        calcularTotalBilletes();
    }

    /******************************************/
    /********* CAlCULO DE LOS DEPOSITOS *********/
    // const [registroDepChe, setRegistroDepChe] = useState({
    //     "totalCheque": 0,
    //     "detalleCheque": "C",
    //     "totalDepositos": 0,
    //     "detalleDepositos": "D"
    // });

    // const handleChangeDepBill = e => {
    //     console.log(e);
    //     const { name, value } = e.target;
    //     console.log(name + " " + value);
    //     setRegistroDepChe(prevState => ({
    //         ...prevState,
    //         [name]: value
    //     }));
    // };

    /*******************************************/

    const onSubmit = (data) => {
        //console.log(data);
        data.total = parseFloat(data.cheque) + parseFloat(data.depositos) + parseFloat(data.efectivo) + parseFloat(data.monedas);
        // console.log(data);
        /***************Aqui toca enviar informacion*************/
        setCash(data)

        /*======================================================*/
    }

    return (
        <>
            <Button variant="primary" onClick={handleShow}>
                Cash
            </Button>
            {/* style={{ border: " 2px solid var(--nav-color)", borderRadius: "10px", padding: "1rem" }} */}
            <Modal show={show} onHide={handleClose} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
                <Modal.Header closeButton>
                    <Modal.Title>Cash</Modal.Title>
                </Modal.Header>

                <Modal.Body>

                    <Form className='formModal' onSubmit={handleSubmit(onSubmit)}>

                        {/*Form Grup Monedas*/}
                        <Form.Group className="mb-3" controlId="Monedas" style={style1} >
                            <Form.Label>Monedas</Form.Label>
                            <h5 className='p-title'>Debe de ingresar la unidad de cada moneda.</h5>
                            <i className="fa-solid fa-coins bx-lg"></i>
                            <div style={style2}>
                                <div className="form-group">
                                    <label className="col-form-label col-form-label-sm" htmlFor="1dollar">Monedas $1.00</label>
                                    <input name='1dolar' value={monedasValue['1dolar']?.toString()} onChange={handleChange} className="form-control form-control-sm" type="number" id="1dollar" style={{ maxWidth: "75px" }} />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label col-form-label-sm" htmlFor="50cent-">Monedas $0.50</label>
                                    <input name='50cent' value={monedasValue['50cent']?.toString()} onChange={handleChange} className="form-control form-control-sm" type="number" id="50cent" style={{ maxWidth: "75px" }} />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label col-form-label-sm" htmlFor="25cent-">Monedas $0.25</label>
                                    <input name='25cent' value={monedasValue['25cent']?.toString()} onChange={handleChange} className="form-control form-control-sm" type="number" id="25cent" style={{ maxWidth: "75px" }} />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label col-form-label-sm" htmlFor="10cent-">Monedas $0.10</label>
                                    <input name='10cent' value={monedasValue['10cent']?.toString()} onChange={handleChange} className="form-control form-control-sm" type="number" id="10cent" style={{ maxWidth: "75px" }} />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label col-form-label-sm" htmlFor="5cent-">Monedas $0.05</label>
                                    <input name='5cent' value={monedasValue['5cent']?.toString()} onChange={handleChange} className="form-control form-control-sm" type="number" id="5cent" style={{ maxWidth: "75px" }} />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label col-form-label-sm" htmlFor="1cent-">Monedas $0.01</label>
                                    <input name='1cent' value={monedasValue['1cent']?.toString()} onChange={handleChange} className="form-control form-control-sm" type="number" id="1cent" style={{ maxWidth: "75px" }} />
                                </div>
                                <Form.Control
                                    value={totalMonedas}
                                    onChange={handleChange}
                                    type="number" className="form-control form-control-sm"
                                    style={{ maxWidth: "100px", textAlign: "center" }}
                                />
                            </div>

                            <div style={{ display: "flex", flexDirection: "row" }}>
                                <Button onClick={() => { resetMonedas() }}>reset</Button>
                                <Form.Control
                                    type="number" className="form-control form-control-sm"
                                    style={{ maxWidth: "100px", textAlign: "center" }}
                                    {...register(`${listdbCash[1]}`, { required: true })} />
                                <Button onClick={() => { calcularTotalMonedas() }}>Calcular</Button>
                            </div>
                            Bug por corregir
                            <p className={`error-message ${errors[listdbCash[1]] ? 'showError' : ''}`}>Este campo es requerido</p>
                        </Form.Group>
                        {/*Form Grup Billetes*/}
                        <Form.Group className="mb-3" controlId="Billetes" style={style1} >
                            <Form.Label>Billetes</Form.Label>
                            <h5 className='p-title'>Debe de ingresar la unidad de cada Billete.</h5>
                            <i className="fa-solid fa-money-bill bx-lg"></i>
                            <div style={style2}>
                                <div className="form-group">
                                    <label className="col-form-label col-form-label-sm" htmlFor="100Dollar">Billete $100</label>
                                    <input name='100Dollar' value={billeteValue['100Dollar']?.toString()} onChange={handleChangeBillete} className="form-control form-control-sm" type="number" id="100Dollar" style={{ maxWidth: "75px" }} />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label col-form-label-sm" htmlFor="50Dollar-">Billete $50</label>
                                    <input name='50Dollar' value={billeteValue['50Dollar']?.toString()} onChange={handleChangeBillete} className="form-control form-control-sm" type="number" id="50Dollar" style={{ maxWidth: "75px" }} />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label col-form-label-sm" htmlFor="20Dollar-">Billete $20</label>
                                    <input name='20Dollar' value={billeteValue['20Dollar']?.toString()} onChange={handleChangeBillete} className="form-control form-control-sm" type="number" id="20Dollar" style={{ maxWidth: "75px" }} />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label col-form-label-sm" htmlFor="10Dollar-">Billete $10</label>
                                    <input name='10Dollar' value={billeteValue['10Dollar']?.toString()} onChange={handleChangeBillete} className="form-control form-control-sm" type="number" id="10Dollar" style={{ maxWidth: "75px" }} />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label col-form-label-sm" htmlFor="5Dollar-">Billete $5</label>
                                    <input name='5Dollar' value={billeteValue['5Dollar']?.toString()} onChange={handleChangeBillete} className="form-control form-control-sm" type="number" id="5Dollar" style={{ maxWidth: "75px" }} />
                                </div>
                                <div className="form-group">
                                    <label className="col-form-label col-form-label-sm" htmlFor="1Dollar-">Billete $1</label>
                                    <input name='1Dollar' value={billeteValue['1Dollar']?.toString()} onChange={handleChangeBillete} className="form-control form-control-sm" type="number" id="1Dollar" style={{ maxWidth: "75px" }} />
                                </div>
                                <Form.Control
                                    value={totalBillete}
                                    onChange={handleChangeBillete}
                                    type="number" className="form-control form-control-sm"
                                    style={{ maxWidth: "100px", textAlign: "center" }}
                                />
                            </div>

                            <div style={{ display: "flex", flexDirection: "row" }}>

                                <Button onClick={() => { resetBilletes() }}>reset</Button>
                                <Form.Control
                                    type="number" className="form-control form-control-sm"
                                    style={{ maxWidth: "100px", textAlign: "center" }}
                                    {...register(`${listdbCash[2]}`, { required: true })} />
                                <Button onClick={() => { calcularTotalBilletes() }}>Calcular</Button>
                            </div>
                            Bug por corregir
                            <p className={`error-message ${errors[listdbCash[2]] ? 'showError' : ''}`}>Este campo es requerido</p>
                        </Form.Group>
                        <div style={{ display: "flex", gap: "1rem" }}>

                            {/*Form Grup Depositos*/}
                            <Form.Group className="mb-3" controlId="Depositos" style={style1} >
                                <Form.Label>Depositos</Form.Label>
                                <h5 className='p-title'>Escriba en la caja de texto el Total $</h5>
                                <i className="fa-solid fa-money-bill-transfer bx-lg"></i>
                                <div style={style2}>
                                    <Form.Control
                                        name="totalDepositos"
                                        type="number" className="form-control form-control-sm"
                                        style={{ maxWidth: "75px", textAlign: "center" }}
                                        {...register(`${listdbCash[3]}`, { required: true })}
                                    />
                                    <p className={`error-message ${errors[listdbCash[3]] ? 'showError' : 'showMessage'}`}>{errors[listdbCash[3]] ? "Este campo es requerido" : " Coloque el total de dinero en Depositos"}</p>
                                </div>
                            </Form.Group>
                            {/*Form Grup Cheques*/}
                            <Form.Group className="mb-3" controlId="Cheques" style={style1} >
                                <Form.Label>Cheques</Form.Label>
                                <h5 className='p-title'>Escriba en la caja de texto el Total $</h5>
                                <i className="fa-solid fa-money-check-dollar bx-lg"></i>
                                <div style={style2}>
                                    <Form.Control
                                        name="totalDepositos"
                                        type="number" className="form-control form-control-sm"
                                        style={{ maxWidth: "75px", textAlign: "center" }}
                                        {...register(`${listdbCash[4]}`, { required: true })}
                                    />
                                    <p className={`error-message ${errors[listdbCash[4]] ? 'showError' : 'showMessage'}`}>
                                        {errors[listdbCash[4]] ? "Este campo es requerido" : " Coloque el total de dinero en Cheques"}
                                    </p>
                                </div>
                            </Form.Group>
                        </div>

                        <Form.Group className="mb-3" controlId="Cheques" style={style1} >
                            <Form.Label>Detalle</Form.Label>
                            <h5 className='p-title'>Escriba los detalles de los Cheques y de los Depositos</h5>
                            <i className="fa-solid fa-circle-info bx-lg"></i>
                            <div style={style2}>
                                <textarea
                                    className="form-control" id="exampleTextarea"
                                    rows="20" cols="70" style={{ height: "81px" }}
                                    {...register(`${listdbCash[6]}`, { required: true })} >
                                </textarea>
                                <p className={`error-message ${errors[listdbCash[6]] ? 'showError' : 'showMessage'}`}>
                                    {errors[listdbCash[6]] ? "Este campo es requerido" : " Escriba detalladamente los numeros de depositos de ser necesario"}
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


export default Modalcash;