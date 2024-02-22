import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import acceptLiqui from "../../../../img/accept.png"
import preLiqui from "../../../../img/factura.png"
import viewSelect from "../../../../img/viewSelect.png"
import imgCar from "../../../../img/carTime.png"
import { Outlet } from 'react-router-dom';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';


const Index = () => {

    const [selectItem, setSelectItem] = useState(false);

    const actionSelectItem = () => {
        selectItem ? setSelectItem(false) : setSelectItem(true);
    };


    return (
        <div>
            <div style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "center" }}>
                <h5>CAMION DE ENTREGA </h5>
                <img className='bx-fade-right' src={imgCar} alt="" style={{ width: "50px", position: "relative", }} />
            </div>
            <div className='card-btn' style={{ margin: "2em" }}>
                <Row>
                    {/* <Col>
                        <OverlayTrigger overlay={
                            <Tooltip id="tooltip-disabled">
                                Grupo de <strong>Facturas </strong> entregadas al Vehiculo, constancia de haber entregado facturas para su posterior Balance.
                            </Tooltip>}>
                            <Link style={{ border: "2px solid var(--first-color)", padding: "0.25rem", borderRadius: "5px" }}
                                onClick={() => { actionSelectItem() }}
                                className='linkStyle' to={"/dashboard/closeout/vehicle/pre-liquidation-veh"}>
                                <span>Pre Liquidaciones </span>
                                <img src={preLiqui} alt="" style={{ width: "50px" }} />
                            </Link>
                        </OverlayTrigger>
                    </Col> */}

                    <Col>
                        <OverlayTrigger overlay={
                            <Tooltip id="tooltip-disabled">
                                Grupo de <strong>Liquidaciones</strong> realizada a los Vehiculos de entrega, constancia de haber declarado los pago y haber realizado el balance de las facturas.
                            </Tooltip>}>
                            <Link style={{ border: "2px solid var(--first-color)", padding: "0.25rem", borderRadius: "5px" }}
                                onClick={() => { actionSelectItem() }}
                                className='linkStyle' to={"/dashboard/closeout/vehicle/liquidation-vehicle"}>
                                <span>Liquidaciones de Vehiculos </span>
                                <img src={acceptLiqui} alt="" style={{ width: "50px" }} />
                            </Link>
                        </OverlayTrigger>
                    </Col>
                </Row>
            </div>

            {
                selectItem ? (
                    <Outlet />
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                        <h3>SELECCIONE LO QUE DESEA VISUALIZAR</h3>
                        <img src={viewSelect} alt="" style={{ width: "49%" }} />
                    </div>
                )
            }
            {/* */}
        </div>
    );
};

export default Index;