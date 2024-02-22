import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Buttonatom from '../../../../components/atom/Buttonatom';
import Itemformshow from '../../../../components/atom/Itemformshow';
import Modalagginvoice from '../../../../components/Modals/Modalagginvoice';
import Tabledinamik from '../../../../components/molecules/Tabledinamik';
import { getCustomerThunk } from '../../../../store/slices/customer.slice';
import { getInvoiceThunk } from '../../../../store/slices/invoice.slice';
import { setLiquidationSlice } from '../../../../store/slices/liquidation.slice';
import { getSellerThunk } from '../../../../store/slices/seller.slice';
import { getVehiclesThunk } from '../../../../store/slices/vehicles.slice';
import currentdate from '../../../../utils/date';
import Swal from 'sweetalert2';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Liquidationveh = () => {


    const dispatch = useDispatch();
    const sesionStorageInvoice = JSON.parse(sessionStorage.getItem('invoiceLiquidation'));

    useEffect(() => {
        sesionStorageInvoice
            ? dispatch(setLiquidationSlice(JSON.parse(sessionStorage.getItem('invoiceLiquidation'))))
            : dispatch(setLiquidationSlice(filterinvoiceDia))

    }, [])

    const actionRefresh = () => {
        setRefresh(true)
        dispatch(getCustomerThunk());
        dispatch(getVehiclesThunk());
        dispatch(getInvoiceThunk());
        dispatch(getSellerThunk());
        sesionStorageInvoice
            ? dispatch(setLiquidationSlice(JSON.parse(sessionStorage.getItem('invoiceLiquidation'))))
            : dispatch(setLiquidationSlice(filterinvoiceDia))
    }

    //Delete the current last test
    const elementoRef = useRef(null);

    const { register, handleSubmit, reset, formState: { errors } } = useForm();
    const [refresh, setRefresh] = useState(false)
    const { id: userId } = useParams();
    const vehicles = useSelector(state => state.vehicles);
    const invoice = useSelector(state => state.invoice);
    const invoiceDia = useSelector(state => state.liquidation);
    const seller = useSelector(state => state.seller);
    const customer = useSelector(state => state.customer);

    const vehSelect = vehicles.find(element => (element.id === parseInt(userId)));
    const [liquidationAct, setLiquidationAct] = useState(true);

    const filterinvoiceDia = invoice.filter((veh) => {
        return ((veh.id_client_bill.id_vehicle === parseInt(userId)) &&
            (veh.id_client_bill.route.dia === currentdate.CurrendateDay("ayer")) &&
            (veh.saldo !== 0))
    });


    /*********** QUITAR  FACTURAS  DE LA LISTA DE LIQUIDACION*****************/
    const [selectedInvoices, setSelectedInvoices] = useState([]);
    const [checkSelectedID, setCheckSelectedID] = useState([]);

    const handleAddInvoice = (e, item) => {
        const { checked, value, name } = e.target;
        //console.log(item);
        if (checked) {
            setSelectedInvoices([...selectedInvoices, item]);
            setCheckSelectedID(prevState => [...prevState, value]);
        } else {
            setSelectedInvoices(
                selectedInvoices.filter((selectedItem) => selectedItem.id !== item.id)
            );
            setCheckSelectedID(
                checkSelectedID.filter((selectedItem) => (selectedItem).toString() !== (item.id).toString())
            );
        }
    };
    /************************************************************************/
    /*********** AGREGAR FACTURAS A LA LISTA DE LIQUIDACION *****************/
    const aggInvoice = (data) => {
        const idsAdd = invoiceDia.map(ids => ids.id)
        const Verficador = data.filter(item => {
            return !(idsAdd).includes((item.id))

        });
        const concatData = invoiceDia.concat(Verficador);
        sessionStorage.setItem('invoiceLiquidation', JSON.stringify(concatData));
        dispatch(setLiquidationSlice(concatData));
        setSelectedInvoices([]);
        setCheckSelectedID([]);
    }

    const deleteInvoice = () => {
        Swal.fire({
            title: '¿Está seguro?',
            text: "En caso de equivocarte, puedes volver a agregar facturas desde el boton 'Agregar Facturas'.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar!'
        }).then((result) => {
            if (result.isConfirmed) {
                const eliminador = invoiceDia.filter(item => {
                    return !(checkSelectedID).includes((item.id.toString()))
                });
                sessionStorage.setItem('invoiceLiquidation', JSON.stringify(eliminador));
                dispatch(setLiquidationSlice(eliminador));
                setSelectedInvoices([]);
                setCheckSelectedID([]);
            }
        })
        //console.log(invoiceDia);
        // //console.log(invoiceDia);
        // //console.log(checkSelectedID);
        // //console.log(eliminador);
    }
    /************************************************************************/



    /****************** EXPENSES - CASH - RETURN *****************/
    const listdbCash = [
        "id_tabla_liq",
        "monedas",
        "efectivo",
        "depositos",
        "cheque",
        "total",
        "detalle_adt"
    ]
    const listdbExpense = [
        'id_tabla_liq',
        'alimentacion',
        'combustible',
        'vehiculo',
        'peaje',
        'total',
        'detalle_adt'
    ]
    const listdbProducRetorn = [
        'id_tabla_liq',
        'mal_estado',
        'rechazados',
        'total',
        'detalle_adt'
    ]

    //MODIFICAR LAS VARIABLES DE LOS OBJETOS QUE SE ENVIAN AL BACKEND
    const [cash, setCash] = useState([]);
    const [expense, setExpense] = useState([]);
    const [productReturn, setProductReturn] = useState([]);
    const [liqVehTotal, setLiqVehTotal] = useState([]);
    const [showAggInvoice, setShowAggInvoice] = useState(false);

    const handleCash = e => {
        const { name, value } = e.target;
        setCash(prevState => ({
            ...prevState,
            [name]: value
        }));
        //console.log(cash);
    };
    const handleExpense = e => {
        const { name, value } = e.target;
        setExpense(prevState => ({
            ...prevState,
            [name]: value
        }));
        //console.log(expense);
    };
    const handleProductReturn = e => {
        const { name, value } = e.target;
        setProductReturn(prevState => ({
            ...prevState,
            [name]: value
        }));
        //console.log(productReturn);
    };
    const handleLiqVehTotal = e => {
        const { name, value } = e.target;
        setLiqVehTotal(prevState => ({
            ...prevState,
            [name]: value
        }));
        //console.log(liqVehTotal);
    };

    const cashtotal = () => {
        const sumTotalCash = parseFloat(cash.monedas) + parseFloat(cash.efectivo) + parseFloat(cash.depositos) + parseFloat(cash.cheque);
        // //console.log(sumTotalCash);
        // //console.log(cash.total);
        setCash(prevState => ({
            ...prevState,
            total: (sumTotalCash).toFixed(2)
        }));
        if (isNaN(sumTotalCash)) {
            Swal.fire('Alert', 'Debe de llenar todos los campos para poder calcular el total. Puede poner  "0" en caso de que el campo no tenga un valor ', "warning")
            //console.log("error");
        }
        //console.log(cash);
    }
    const expensetotal = () => {
        const sumTotal = parseFloat(expense.alimentacion) + parseFloat(expense.combustible) + parseFloat(expense.vehiculo) + parseFloat(expense.peaje);

        setExpense(prevState => ({
            ...prevState,
            total: (sumTotal).toFixed(2)
        }));
        if (isNaN(sumTotal)) {
            Swal.fire('Alert', 'Debe de llenar todos los campos para poder calcular el total. Puede poner "0" en caso de que el campo no tenga un valor ', "warning")
            //console.log("error");
        }
        //console.log(expense);
    }
    const productReturntotal = () => {
        const sumTotal = parseFloat(productReturn.mal_estado) + parseFloat(productReturn.rechazados) + parseFloat(productReturn.caducados);
        // //console.log(sumTotal);
        // //console.log(productReturn.total);
        // //console.log(productReturn);
        setProductReturn(prevState => ({
            ...prevState,
            total: (sumTotal).toFixed(2)
        }));
        if (isNaN(sumTotal)) {
            Swal.fire('Alert', 'Debe de llenar todos los campos para poder calcular el total. Puede poner "0" en caso de que el campo no tenga un valor ', "warning")
            //console.log("error");
        }
        //console.log(productReturn);
    }
    const liqVehTotalCal = () => {
        const sumEnviado = parseFloat(liqVehTotal.total_fact_ent) + parseFloat(liqVehTotal.total_fact_cob);
        const sumRecibido = parseFloat(cash.total) + parseFloat(expense.total) + parseFloat(productReturn.total);
        const balance = sumEnviado - sumRecibido;
        //console.log(liqVehTotal);
        //console.log(sumEnviado);
        //console.log(sumRecibido);
        //console.log(balance);
        setLiqVehTotal(prevState => ({
            ...prevState,
            total_enviado: (sumEnviado).toFixed(2)
        }));
        setLiqVehTotal(prevState => ({
            ...prevState,
            total_recibido: (sumRecibido).toFixed(2)
        }));
        setLiqVehTotal(prevState => ({
            ...prevState,
            cuadre: (balance).toFixed(2)
        }));
        if (balance === 0) {
            Swal.fire('Correcto', 'El balance a sido Correcto ', "success")
            //console.log("ok");
        } else if (balance > 0) {
            Swal.fire('Alert', 'El balance se no cuadra, existe valores excedentes', "warning")
            //console.log("ok");
        } else {
            Swal.fire('Alert', 'El balance se no cuadra, existe valores faltantes', "error")
            //console.log("ok");
        }
    }

    /*****************************************************************/


    /*********** CREAR - ACTUALIZAR - ELIMINAR FACTURAS DE LA BD*****************/
    const createInvo = (data) => {
        // alert('Creando factura')
        //console.log(data);
        // dispatch(postInvoicethunk(data));
        setRefresh(true)
    }
    const updateInvo = (data) => {
        alert('actualizando factura')
        //console.log(data);
        // dispatch(updateInvoiceThunk(data));
        setRefresh(true)
    }
    const delInvo = (id) => {
        // dispatch(deleteInvoiceThunk(id));
        setRefresh(true)
    }
    // //console.log(invoice);
    const showSelectInvoice = () => {
        setShowAggInvoice(true);
    }

    /*****************************************************************/


    return (
        <div className='LiquidationVeh' ref={elementoRef} id="elemento-a-convertir">
            <button onClick={() => {
                html2canvas(elementoRef.current).then(canvas => {
                    const pdf = new jsPDF('p', 'mm', 'a4');
                    const imgWidth = pdf.internal.pageSize.getWidth();
                    const imgHeight = canvas.height * imgWidth / canvas.width;
                    const imgData = canvas.toDataURL('image/png');
                    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
                    pdf.save("documento.pdf");
                });
            }}>Convertir a imagen y guardar en PDF</button>

            <Modalagginvoice data={invoice} showAggInvoice={showAggInvoice} setShowAggInvoice={setShowAggInvoice} aggInvoice={aggInvoice} />
            <div>
                <h6>{`${vehSelect?.placa} - ${vehSelect?.chofer} `}</h6>
            </div>
            <div>
                <h6>Fecha de liquidacion:{" "}{currentdate.CurrendateDay()}{" "}{currentdate.Currendate()}</h6>
                <h6>Lista de Facturas Asignadas</h6>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", margin: "1rem", gap: '1rem' }}>
                <Buttonatom created={showSelectInvoice}
                    title={"Agregar Facturas"}
                    color={"success"} ico={"fa-circle-plus"} />
                <Buttonatom created={(() => actionRefresh())}
                    title={"Actualizar"}
                    color={"info"} ico={"fa-sync fa-spin"} />
                <Buttonatom created={(() => deleteInvoice())}
                    title={"Eliminar Facturas"}
                    color={"danger"} ico={"fa-trash-can"} />
            </div>
            <div className='liquidationVeh-component' style={{ border: "2px solid red" }}>
                <div className='liquidationVeh-listfac'>
                    <h4>Facturas a Liquidar</h4>
                    <Tabledinamik invoice={invoiceDia}
                        seller={seller} customer={customer}
                        createInvo={createInvo} delInvo={delInvo}
                        updateInvo={updateInvo} refresh={refresh}
                        liquidationAct={liquidationAct}
                        handleAddInvoice={handleAddInvoice} checkSelectedID={checkSelectedID} />
                </div>
                <div className='liquidationVeh-liscompnent'>
                    <div className='listcomponent-cont'>
                        <div className='listcomponent-cont-item'>
                            <h6>Dinero</h6>
                            <Itemformshow title={"Monedas"} show={cash.monedas} name={"monedas"} handle={handleCash} />
                            <Itemformshow title={"Billetes"} show={cash.efectivo} name={"efectivo"} handle={handleCash} />
                            <Itemformshow title={"Depositos"} show={cash.depositos} name={"depositos"} handle={handleCash} />
                            <Itemformshow title={"Cheques"} show={cash.cheque} name={"cheque"} handle={handleCash} />
                            <Itemformshow title={"Total"} show={(cash.total)} name={"total"} handle={handleCash} ico={"fa-calculator"} btnaction={cashtotal} />
                            <div className="form-group">
                                <label style={{ fontSize: "14px" }} htmlFor="detalle" className="form-label">Escriba los detalles adicionales</label>
                                <textarea name='detalle_adt' style={{ fontSize: "14px" }} onChange={(e) => handleCash(e)} className="form-control" id="detalle" rows="3"></textarea>
                            </div>
                        </div>
                        <div className='listcomponent-cont-item'>
                            <h6>Varios</h6>
                            <Itemformshow title={"Alimentacion"} show={expense.alimentacion} name={"alimentacion"} handle={handleExpense} />
                            <Itemformshow title={"Combustible"} show={expense.combustible} name={"combustible"} handle={handleExpense} />
                            <Itemformshow title={"Vehiculo"} show={expense.vehiculo} name={"vehiculo"} handle={handleExpense} />
                            <Itemformshow title={"Peaje"} show={expense.peaje} name={"peaje"} handle={handleExpense} />
                            <Itemformshow title={"Total"} show={(expense.total)} name={"total"} handle={handleExpense} ico={"fa-calculator"} btnaction={expensetotal} />
                            <div className="form-group">
                                <label style={{ fontSize: "14px" }} htmlFor="detalle" className="form-label">Escriba los detalles adicionales</label>
                                <textarea name='detalle_adt' style={{ fontSize: "14px" }} onChange={(e) => handleExpense(e)} className="form-control" id="detalle" rows="3"></textarea>
                            </div>
                        </div>
                        <div className='listcomponent-cont-item'>
                            <h6>Productos</h6>
                            <Itemformshow title={"Mal Estado"} show={productReturn.mal_estado} name={"mal_estado"} handle={handleProductReturn} />
                            <Itemformshow title={"Rechazados"} show={productReturn.rechazados} name={"rechazados"} handle={handleProductReturn} />
                            <Itemformshow title={"Caducados"} show={productReturn.caducados} name={"caducados"} handle={handleProductReturn} />
                            <Itemformshow title={"Total"} show={(productReturn.total)} name={"total"} handle={handleProductReturn} ico={"fa-calculator"} btnaction={productReturntotal} />
                            <div className="form-group">
                                <label style={{ fontSize: "14px" }} htmlFor="detalle" className="form-label">Escriba los detalles adicionales</label>
                                <textarea name='detalle_adt' style={{ fontSize: "14px" }} onChange={(e) => handleProductReturn(e)} className="form-control" id="detalle" rows="5" ></textarea>
                            </div>
                        </div>
                        <div className='listcomponent-cont-item'>
                            <h6>Totales</h6>
                            <Itemformshow title={"Fact Entre"} show={liqVehTotal.total_fact_ent} name={"total_fact_ent"} handle={handleLiqVehTotal} />
                            <Itemformshow title={"Fact Cobro"} show={liqVehTotal.total_fact_cob} name={"total_fact_cob"} handle={handleLiqVehTotal} />
                            <Itemformshow title={"Enviado"} show={liqVehTotal.total_enviado} name={"total_enviado"} handle={handleLiqVehTotal} />
                            <Itemformshow title={"Recibido"} show={liqVehTotal.total_recibido} name={"total_recibido"} handle={handleLiqVehTotal} ico={"fa-calculator"} btnaction={liqVehTotalCal} />
                            <Itemformshow title={"Balance"} show={liqVehTotal.cuadre} name={"cuadre"} handle={handleLiqVehTotal} balance={liqVehTotal.cuadre} />
                            <div className="form-group">
                                <label style={{ fontSize: "14px" }} htmlFor="detalle" className="form-label">Escriba los detalles Generales</label>
                                <textarea name='detalle_adt' style={{ fontSize: "14px" }} onChange={(e) => handleLiqVehTotal(e)} className="form-control" id="detalle" rows="3" ></textarea>
                            </div>
                        </div>
                        <div className='listcomponent-cont-item'>
                            <h6>Totales</h6>
                            <Itemformshow title={"Fact Entre"} show={liqVehTotal.total_fact_ent} name={"total_fact_ent"} handle={handleLiqVehTotal} />
                            <Itemformshow title={"Fact Cobro"} show={liqVehTotal.total_fact_cob} name={"total_fact_cob"} handle={handleLiqVehTotal} />
                            <Itemformshow title={"Enviado"} show={liqVehTotal.total_enviado} name={"total_enviado"} handle={handleLiqVehTotal} />
                            <Itemformshow title={"Recibido"} show={liqVehTotal.total_recibido} name={"total_recibido"} handle={handleLiqVehTotal} ico={"fa-calculator"} btnaction={liqVehTotalCal} />
                            <Itemformshow title={"Balance"} show={liqVehTotal.cuadre} name={"cuadre"} handle={handleLiqVehTotal} balance={liqVehTotal.cuadre} />
                            <div className="form-group">
                                <label style={{ fontSize: "14px" }} htmlFor="detalle" className="form-label">Escriba los detalles Generales</label>
                                <textarea name='detalle_adt' style={{ fontSize: "14px" }} onChange={(e) => handleLiqVehTotal(e)} className="form-control" id="detalle" rows="3" ></textarea>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div >
    );
};

export default Liquidationveh;