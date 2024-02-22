import React, { useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import acceptLiqui from "../../../../img/accept.png"
import preLiqui from "../../../../img/factura.png"
import imgVen from "../../../../img/smart.png"
import viewSelect from "../../../../img/viewSelect.png"
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
            
            <div style={{ display: "flex", flexDirection: 'row', alignItems: "center", justifyContent: "center", paddingTop:"0.5rem"}}>
                <h5>VENDEDORES  </h5>
                <img className='bx-fade-right' src={imgVen} alt="" style={{ width: "50px", position: "relative", }} />
            </div>
            <div className='card-btn' style={{ margin: "2em" }}>
                <Row>
                    <Col>
                        <OverlayTrigger overlay={
                            <Tooltip id="tooltip-disabled">
                                Grupo de <strong>Facturas </strong> entregadas al vendedor, constancia de haber entregado facturas para su posterior Balance.
                            </Tooltip>}>
                            <Link style={{ border: "2px solid var(--first-color)", padding: "0.25rem", borderRadius: "5px" }}
                                onClick={() => { actionSelectItem() }}
                                className='linkStyle' to={"/dashboard/closeout/seller/pre-liquidation-seller"}>
                                <span>Pre Liquidaciones </span>
                                <img src={preLiqui} alt="" style={{ width: "50px" }} />
                            </Link>
                        </OverlayTrigger>
                    </Col>

                    <Col>
                        <OverlayTrigger overlay={
                            <Tooltip id="tooltip-disabled">
                                Grupo de <strong>Liquidaciones</strong> realizada a los vendedores, constancia de haber declarado los pago y haber realizado el balance de las facturas.
                            </Tooltip>}>
                            <Link style={{ border: "2px solid var(--first-color)", padding: "0.25rem", borderRadius: "5px" }}
                                onClick={() => { actionSelectItem() }}
                                className='linkStyle' to={"/dashboard/closeout/seller/liquidation-seller"}>
                                <span>Liquidaciones Vendedores </span>
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