import React, { useEffect, useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { getPreLiquiThunk } from '../../../../store/slices/preLiquidationSeller.slice';
import date from '../../../../utils/date';
import imgView from "../../../../img/imgView.png"
import Swal from 'sweetalert2';

const PreLiquidationSeller = () => {

    const dispatch = useDispatch();
    useEffect(() => {
        preLiquid[0] ? null : dispatch(getPreLiquiThunk());
    }, [])
    const preLiquid = useSelector(state => state.preLiquidationSeller);

    const [clickView, setClickView] = useState(true);
    const [dataView, setDataView] = useState({});

    const clickViewAction = (itemSelect) => {
        clickView ? setClickView(false) : setClickView(true);
        dataView ? setDataView(itemSelect) : setDataView({});
        //console.log(itemSelect);
    };

    const printAction = (dataProcess) => {

        let direccion = `/dashboard/liquidation/sellers/${dataProcess.id_seller}/print/invoice-give`;

        let principal = {};
        principal.user = dataProcess?.userliquidator;
        principal.date = `${date.getDayOfWeek(dataProcess?.pre_Date)} - ${dataProcess?.pre_Date}`;
        principal.seller = `${dataProcess?.id_seller_seller.code} - ${dataProcess?.id_seller_seller.name}`;

        const invoicePre = dataProcess?.bills_pres.map(inv => {
            let client = {}
            client.fullname = inv?.id_bill_bill.client.fullname;
            client.address = inv?.id_bill_bill.client.address;
            client.dni = inv?.id_bill_bill.client.dni;

            const num_bill = inv?.id_bill_bill.num_bill;
            const deliver_date = inv?.id_bill_bill.deliver_date;
            const total_bill = inv?.id_bill_bill.total_bill;
            const balance = inv?.pre_balance;
            return { client, num_bill, deliver_date, total_bill, balance }
        })

        let arrayPrint = []
        arrayPrint.push(principal);
        arrayPrint.push(invoicePre);
        arrayPrint.push(dataProcess?.total);
        //console.log(dataProcess);
        //console.log(arrayPrint);
        Swal.fire({
            title: '¿Está seguro?',
            text: `Desea imprimir el siguiente Registro ${principal.seller}.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#029C63',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Imprimir!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                sessionStorage.setItem("docInvoiceGive", JSON.stringify(arrayPrint));
                window.open(direccion, "", "height=600,width=1200,center");
            } else {
                Swal.fire({
                    icon: 'warning',
                    title: 'Cancelado!',
                    text: 'Se a cancelado la impresion del registro seleccionado.',
                    showConfirmButton: false,
                    timer: 1000
                })
            }
        });
    };

    return (
        <div>
            <h3 style={{ textAlign: "center" }}>
                PRE LIQUIDACION
            </h3>
            <div style={{ display: "flex", gap: "1.5rem", margin: "2rem 0" }}>

                <div style={{ width: "50%", overflowY: "scroll" }}>
                    <Table striped bordered hover responsive size='sm' >
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Usuario</th>
                                <th>Fecha de Pre-liquidacion</th>
                                <th>Vendedor</th>
                                <th>Total</th>
                                <th>Accion</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                preLiquid.map((pre, index) => (
                                    <tr key={index} >
                                        <td>{index + 1}</td>
                                        <td>Usuario liquidador: <strong>{(pre?.userliquidator).toUpperCase()}</strong></td>
                                        <td>{pre?.pre_Date} - {date.getDayOfWeek(pre?.pre_Date)}</td>
                                        <td>{pre.id_seller_seller.name} - {pre.id_seller_seller.code}</td>
                                        <td>$ {(parseFloat(pre.total)).toFixed(2)}</td>
                                        <td>
                                            <div style={{ display: "flex", flexDirection: "row", gap: "0.5rem", justifyContent: "center" }}>
                                                <div>
                                                    <Button onClick={() => { printAction(pre) }} variant='info' style={{ width: "40px", padding: "0.25rem" }}>
                                                        <i className="fa-solid fa-print bx-fw"></i>
                                                    </Button>
                                                </div>
                                                <div>
                                                    <Button onClick={() => { clickViewAction(pre) }} variant='success' style={{ width: "40px", padding: "0.25rem" }}>
                                                        <i className={`fa-solid ${(((dataView.id || `001`) === pre.id) && clickView === false) ? "fa-eye-slash" : "fa-eye"} bx-fw`}></i>
                                                    </Button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div>

                <div style={{ width: "50%", border: "1px solid var(--color2)", borderRadius: "5px", padding: "1rem" }}>

                    {
                        clickView ? (
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <img src={imgView} alt="image the view" style={{ width: "60%" }} />
                            </div>
                        ) : (
                            <div>
                                <h4 style={{ textAlign: "center" }}>LIQUIDACION</h4>
                                <h5 style={{ textAlign: "center" }}>Distribuidora DCheo</h5>
                                <h5>Pre-Liquidacion de Vendedores</h5>
                                <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                                    <div>
                                        <h6>Usuario: <span style={{ color: "#02B875" }}> {dataView?.userliquidator || "Cargando"}  </span> </h6>
                                        <h6>Fecha de liquidacion: <span style={{ color: "#02B875" }}>{dataView?.pre_Date || "Cargando"} </span> </h6>
                                        <h6>Entrega de Facturas de cobro a: <span style={{ color: "#02B875" }}> {dataView?.id_seller_seller?.name || "Cargando"} - {dataView?.id_seller_seller?.code || "Cargando"}</span>  </h6>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "row", gap: "1rem" }}>

                                    <Table striped bordered hover size='sm' style={{ width: "1000px", }}>
                                        <thead style={{ fontSize: "11px" }}>
                                            <tr>
                                                <th>#</th>
                                                <th>Cliente</th>
                                                <th>Direccion</th>
                                                <th>Identificacion</th>
                                                <th style={{ width: "100px", fontSize: "9px" }}># Documento</th>
                                                <th style={{ width: "100px", fontSize: "9px" }}>Fecha Ent.</th>
                                                <th style={{ width: "70px" }}>Total</th>
                                                <th style={{ width: "70px" }}>Saldo</th>
                                            </tr>
                                        </thead>
                                        <tbody style={{ fontSize: "11px", padding: "0" }}>
                                            {
                                                dataView?.bills_pres?.map((inv, index) => (
                                                    <tr key={index}>
                                                        <td style={{ fontSize: "9px", padding: "0.25rem 0.5rem" }}>{index + 1}</td>
                                                        <td style={{ fontSize: "9px", padding: "0.25rem 0.5rem" }}>{(inv?.id_bill_bill?.client.fullname)?.substring(0, 30)}</td>
                                                        <td style={{ fontSize: "9px", padding: "0.25rem 0.5rem" }}>{(inv?.id_bill_bill?.client.address)?.substring(0, 35)}</td>
                                                        <td style={{ fontSize: "9px", padding: "0.25rem 0.5rem" }}>{inv?.id_bill_bill?.client.dni}</td>
                                                        <td style={{ width: "100px", fontSize: "9px", padding: "0.25rem 0.5rem" }}>{inv?.id_bill_bill?.num_bill}</td>
                                                        <td style={{ width: "100px", fontSize: "9px", padding: "0.25rem 0.5rem" }}>

                                                            <h6 style={{
                                                                fontSize: "10px", color: `${inv?.balance === 0 ? "none" :
                                                                    (date.DatePastPresent(inv?.id_bill_bill?.deliver_date) >= 30 ?
                                                                        'red' : date.DatePastPresent(inv?.id_bill_bill?.deliver_date) >= 15 ?
                                                                            "`yellow" : "green")}`
                                                            }} >
                                                                {`(${date.DatePastPresent(inv?.id_bill_bill?.deliver_date)})`}  {inv?.id_bill_bill?.deliver_date}
                                                            </h6>
                                                        </td>

                                                        <td style={{ width: "70px", padding: "0.25rem 0.5rem" }}> $ {(parseFloat(inv?.id_bill_bill?.total_bill)).toFixed(2)}</td>
                                                        <td style={{ width: "70px", padding: "0.25rem 0.5rem" }}>$ {(parseFloat(inv?.pre_balance)).toFixed(2)}</td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div>
                                <span>Facturas entregadas: {((dataView?.bills_pres)?.length) || <strong>Cargando</strong>}</span>
                                <h6>Valor Total de Facturas Entregadas: $ {((parseFloat(dataView?.total)).toFixed(2) || <strong>Cargando</strong>)} <span style={{ fontSize: "9px" }}>X COBRAR</span> </h6>

                            </div>
                        )
                    }
                </div>
            </div>

        </div >
    );
};

export default PreLiquidationSeller;