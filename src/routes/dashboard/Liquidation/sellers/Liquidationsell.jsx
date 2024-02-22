import React, { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import Buttonatom from "../../../../components/atom/Buttonatom";
import Functionalitiesbtn from "../../../../components/atom/Functionalitiesbtn";
import Cash from "../../../../components/cards/Cash";
import Discount from "../../../../components/cards/Discount";
import Expenses from "../../../../components/cards/Expenses";
import Modalagginvoice from "../../../../components/Modals/Modalagginvoice";
import ModalTransaccion from "../../../../components/Modals/ModalTransaccion";
import TableLiquidationSeller from "../../../../components/Show/TableLiquidationSeller";
import { getInvoiceThunk } from "../../../../store/slices/invoice.slice";
import { postSellerLiquidationthunk } from "../../../../store/slices/liquidation.slice";
import {
	getSellerThunk,
	updateSellerThunk,
} from "../../../../store/slices/seller.slice";
import date from "../../../../utils/date";
import genCod from "../../../../utils/genCod";
import { getVehiclesThunk } from "../../../../store/slices/vehicles.slice";
import axios from "axios";
import getConfig from "../../../../utils/getConfig";
import { setIsLoading } from "../../../../store/slices/isLoading.slice";

const Liquidationsell = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id: sellerByLiqui } = useParams();

	useEffect(() => {
		seller[0] ? null : dispatch(getSellerThunk());
		vehicles[0] ? null : dispatch(getVehiclesThunk());
		invoice[0] ? null : dispatch(getInvoiceThunk());
		loadInvoice();
	}, []);

	const userLiquidador = useSelector((state) => state.userLoged);
	const seller = useSelector((state) => state.seller);
	const invoice = useSelector((state) => state.invoice);
	const vehicles = useSelector((state) => state.vehicles);
	const invoiceDia = useSelector((state) => state.liquidation);
	const sellerLiqui = seller.filter(
		(sell) => sell.id === parseInt(sellerByLiqui)
	);

	const [codLiq, setCodLiq] = useState("");

	const filterInvoiceDia = invoice.filter((sell) => {
		return (
			sell.seller.id === parseInt(sellerByLiqui) &&
			(sell.client?.route_day.day.day).toLowerCase() ===
				date.CurrendateDay(" ").toLowerCase() &&
			sell.balance !== 0
		);
	});

	const [invoiceLiquidation, setInvoiceLiquidation] = useState(filterInvoiceDia);

	const codeGenLiq = `codGenLiq${sellerLiqui[0]?.code}-${sellerLiqui[0]?.id}`;
	const codeInvoLocalStorage = `invoLiq${sellerLiqui[0]?.code}-${sellerLiqui[0]?.id}`;
	const codeExpeLocalStorage = `expensesLiq${sellerLiqui[0]?.code}-${sellerLiqui[0]?.id}`;
	const codeDiscountLocalStorage = `discountLiq${sellerLiqui[0]?.code}-${sellerLiqui[0]?.id}`;
	const codeCashLocalStorage = `cashLiq${sellerLiqui[0]?.code}-${sellerLiqui[0]?.id}`;
	const codeCheckLocalStorage = `checkLiq${sellerLiqui[0]?.code}-${sellerLiqui[0]?.id}`;
	const codeTransacLocalStorage = `trans${sellerLiqui[0]?.code}-${sellerLiqui[0]?.id}`;
	const codePrinDetailStorage = `prinDetail${sellerLiqui?.[0]?.code}-${sellerLiqui?.[0]?.id}`;

	const loadInvoice = () => {
		const sesionLocal = JSON.parse(localStorage.getItem(codeInvoLocalStorage));
		const sesionLocalCode = localStorage.getItem(codeGenLiq);
		const sesionLocalTrans = JSON.parse(
			localStorage.getItem(codeTransacLocalStorage)
		);
		const expensesSesionStorage = JSON.parse(
			localStorage.getItem(codeExpeLocalStorage)
		);
		const discountSesionStorage = JSON.parse(
			localStorage.getItem(codeDiscountLocalStorage)
		);
		const cashSesionStorage = JSON.parse(
			localStorage.getItem(codeCashLocalStorage)
		);
		const checkSesionStorage = JSON.parse(
			localStorage.getItem(codeCheckLocalStorage)
		);

		sesionLocal?.[0]
			? setInvoiceLiquidation(sesionLocal)
			: setInvoiceLiquidation(invoiceLiquidation);

		checkSesionStorage?.[0]
			? setCheckMoney(checkSesionStorage)
			: setCheckMoney([]);
		const filteredTransac = sesionLocalTrans?.filter((trans) => {
			return sesionLocal?.[0]
				? sesionLocal?.some(
						(factura) => factura?.num_bill === trans?.num_bill
				  )
				: filterInvoiceDia?.some(
						(factura) => factura?.num_bill === trans?.num_bill
				  );
		});

		sesionLocalTrans?.[0]
			? setTransaction(filteredTransac)
			: setTransaction([]);
		sesionLocal?.[0]
			? null
			: localStorage.setItem(
					codeInvoLocalStorage,
					JSON.stringify(invoiceLiquidation)
			  );

		setCodLiq(
			sesionLocalCode
				? sesionLocalCode
				: genCod(`LIQ-${sellerLiqui[0]?.code}-`)
		);
		cashSesionStorage ? setCash(cashSesionStorage) : setCash({});
		expensesSesionStorage
			? setExpenses(expensesSesionStorage)
			: setExpenses({});
		discountSesionStorage
			? setDiscount(discountSesionStorage)
			: setDiscount({});
		localStorage.removeItem("printSeller");
	};

	const filterTrans = () => {
		const sesionLocal = JSON.parse(localStorage.getItem(codeInvoLocalStorage));
		const sesionLocalTrans = JSON.parse(
			localStorage.getItem(codeTransacLocalStorage)
		);

		const filteredTransac = sesionLocalTrans?.filter((trans) => {
			return sesionLocal?.[0]
				? sesionLocal?.some(
						(factura) => factura?.num_bill === trans?.num_bill
				  )
				: filterInvoiceDia?.some(
						(factura) => factura?.num_bill === trans?.num_bill
				  );
		});

		sesionLocalTrans?.[0]
			? setTransaction(filteredTransac)
			: setTransaction([]);
	};

	const [selectedInvoices, setSelectedInvoices] = useState([]);
	const [checkSelectedID, setCheckSelectedID] = useState([]);

	/*********** Agregar  FACTURAS  DE LA LISTA DE LIQUIDACION*****************/
	const aggInvoice = (data) => {
		const idsAdd = invoiceLiquidation.map((ids) => ids.id);
		const Verficador = data.filter((item) => {
			return !idsAdd.includes(item.id);
		});
		const concatData = invoiceLiquidation.concat(Verficador);
		localStorage.setItem(codeInvoLocalStorage, JSON.stringify(concatData));
		// dispatch(setLiquidationSlice(concatData));
		setInvoiceLiquidation(concatData);
		setSelectedInvoices([]);
		setCheckSelectedID([]);
	};
	/*********** QUITAR  FACTURAS  DE LA LISTA DE LIQUIDACION*****************/

	const handleAddInvoice = (e, item) => {
		const { checked, value, name } = e.target;
		console.log(checked + value + name);
		if (name === "vehicle_liq") {
			console.log(checked + value + name + " dentro de primer if");
			const position = invoiceLiquidation.findIndex(
				(inv) => inv.id === item.id
			);
			const updateInvoice = { ...invoiceLiquidation[position] };
			// console.log(updateInvoice);
			updateInvoice.vehicle_liq = parseInt(value);
			const newInvoiceLiquidation = [...invoiceLiquidation];
			newInvoiceLiquidation[position] = updateInvoice;
			setInvoiceLiquidation(newInvoiceLiquidation);
			localStorage.setItem(
				codeInvoLocalStorage,
				JSON.stringify(newInvoiceLiquidation)
			);
		} else if (value === "todos") {
			const ids = item.map((obj) => obj.id.toString());
			if (checked) {
				setSelectedInvoices(item);
				setCheckSelectedID(ids);
			} else {
				setSelectedInvoices([]);
				setCheckSelectedID([]);
			}
			localStorage.setItem(codeInvoLocalStorage, JSON.stringify(item));
		} else {
			console.log(checked + value + name + " dentro de primer else");
			if (checked) {
				setSelectedInvoices([...selectedInvoices, item]);
				setCheckSelectedID((prevState) => [...prevState, value]);
			} else {
				setSelectedInvoices(
					selectedInvoices.filter(
						(selectedItem) => selectedItem.id !== item.id
					)
				);
				setCheckSelectedID(
					checkSelectedID.filter(
						(selectedItem) =>
							selectedItem.toString() !== item.id.toString()
					)
				);
			}
		}
	};
	//console.log(invoiceLiquidation);
	const deleteInvoice = () => {
		Swal.fire({
			title: "¿Está seguro?",
			text: "En caso de equivocarte, puedes volver a agregar facturas desde el boton 'Agregar Facturas'.",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Eliminar!",
		}).then((result) => {
			if (result.isConfirmed) {
				const eliminador = invoiceLiquidation.filter((item) => {
					return !checkSelectedID.includes(item.id.toString());
				});
				localStorage.setItem(
					codeInvoLocalStorage,
					JSON.stringify(eliminador)
				);
				setInvoiceLiquidation(eliminador);
				setSelectedInvoices([]);
				setCheckSelectedID([]);
				filterTrans();
			}
		});
	};
	/************************************************************************/

	/*********** Pago o abonos de FACTURAS  DE LA LISTA DE LIQUIDACION*****************/
	const [transaction, setTransaction] = useState([]);

	const [modalTransaccionPay, setModalTransaccionPay] = useState(false);
	const [itemTableliqui, setItemTableliqui] = useState([]);
	// console.log(transaction);
	const sumTotalCobrado = Object.values(transaction).reduce(
		(acc, cur) => acc + parseFloat(cur?.pay),
		0
	);
	const modaltransaccionPay = (item) => {
		setModalTransaccionPay(true);
		setItemTableliqui(item);
	};

	const transactionpay = (item) => {
		const validador = transaction.filter(
			(valid) => valid?.id_bill === item?.id_bill
		);
		if (validador[0]) {
			const eliminador = transaction.filter((elim) => {
				return !item.num_bill.includes(elim.num_bill);
			});

			const validadorLiquidation = invoiceLiquidation.forEach((inv) => {
				if (inv.num_bill === item.num_bill) {
					//console.log("encontre la factura");
					const newInv = {
						...inv,
						pago: item.pay,
					};
					setInvoiceLiquidation((prevState) =>
						prevState.map((prevInv) =>
							prevInv.num_bill === item.num_bill
								? newInv
								: prevInv
						)
					);
					// Guardar en localStorage
					const sessionInvoiceLiquidation = JSON.parse(
						localStorage.getItem(codeInvoLocalStorage)
					);

					const newSessionInvoiceLiquidation =
						sessionInvoiceLiquidation?.[0]
							? sessionInvoiceLiquidation.map((sessionInv) =>
									sessionInv.num_bill === item.num_bill
										? newInv
										: sessionInv
							  )
							: invoiceLiquidation.map((sessionInv) =>
									sessionInv.num_bill === item.num_bill
										? newInv
										: sessionInv
							  );
					localStorage.setItem(
						codeInvoLocalStorage,
						JSON.stringify(newSessionInvoiceLiquidation)
					);
					// console.log(newSessionInvoiceLiquidation);
				}
			});
			setTransaction(eliminador);
			localStorage.setItem(
				codeTransacLocalStorage,
				JSON.stringify(eliminador)
			);
			setTransaction((prevState) => [...prevState, item]);
			localStorage.setItem(
				codeTransacLocalStorage,
				JSON.stringify([...eliminador, item])
			);
		} else {
			const validadorLiquidation = invoiceLiquidation.forEach((inv) => {
				if (inv.num_bill === item.num_bill) {
					//console.log("encontre la factura");
					const newInv = {
						...inv,
						pago: item.pay,
					};
					setInvoiceLiquidation((prevState) =>
						prevState.map((prevInv) =>
							prevInv.num_bill === item.num_bill
								? newInv
								: prevInv
						)
					);

					// Guardar en localStorage
					const sessionInvoiceLiquidation = JSON.parse(
						localStorage.getItem(codeInvoLocalStorage)
					);

					// const newSessionInvoiceLiquidation = sessionInvoiceLiquidation.map(sessionInv => sessionInv.num_bill === item.num_bill ? newInv : sessionInv);
					const newSessionInvoiceLiquidation =
						sessionInvoiceLiquidation?.[0]
							? sessionInvoiceLiquidation.map((sessionInv) =>
									sessionInv.num_bill === item.num_bill
										? newInv
										: sessionInv
							  )
							: invoiceLiquidation.map((sessionInv) =>
									sessionInv.num_bill === item.num_bill
										? newInv
										: sessionInv
							  );
					// console.log(newSessionInvoiceLiquidation);
					localStorage.setItem(
						codeInvoLocalStorage,
						JSON.stringify(newSessionInvoiceLiquidation)
					);
				}
			});
			//console.log(invoiceLiquidation);
			setTransaction((prevState) => [...prevState, item]);
			localStorage.setItem(
				codeTransacLocalStorage,
				JSON.stringify([...transaction, item])
			);
		}
	};

	const [showAggInvoice, setShowAggInvoice] = useState(false);
	const showSelectInvoice = () => {
		setShowAggInvoice(true);
	};
	/************************************************************************/

	/*********** EXPENSES - CASH *****************/
	const [expenses, setExpenses] = useState([]);
	const [cash, setCash] = useState([]);
	const [discount, setDiscount] = useState([]);
	const [checkMoney, setCheckMoney] = useState([]);
	const [checkMoneyView, setCheckMoneyView] = useState([]);
	const [principalDetail, setPrincipalDetail] = useState("");

	const totalExpenses = parseFloat(expenses?.total || 0);
	const totalCash = parseFloat(cash?.total || 0);
	const totalDiscount = parseFloat(discount?.total_other || 0);
	const totalVendedor = (totalExpenses + totalCash + totalDiscount).toFixed(2);
	const cuadre = (
		parseFloat(totalVendedor).toFixed(2) - (sumTotalCobrado.toFixed(2) || 0)
	).toFixed(2);
	const balanceSeller =
		parseFloat(sellerLiqui?.[0]?.balance_sell?.total) + parseFloat(cuadre);
	// const cuadre = ( ((expenses?.total) || 0) - ((discount?.total_other) || 0) - ((cash?.total) || 0) - ((sumTotalCobrado).toFixed(2) || 0)).toFixed(2);

	const receptedExpenses = (item) => {
		setExpenses(item);
	};

	const receptedDiscount = (item) => {
		setDiscount(item);
	};

	const receptedCash = (cash, check, checkView) => {
		setCash(cash);
		setCheckMoney(check);
		setCheckMoneyView(checkView);
	};

	const detailGeneral = `
    DETALLE GENERAL: ${principalDetail} 
    GASTOS: ${expenses?.detail || "Falta Guardar"}.
    DESCUENTOS: ${discount?.detail || "Falta Guardar"}.
    DINERO RECAUDADO: ${cash?.detail || "Falta Guardar"}.`;

	/************************************************************************/
	const loaderData = () => {
		let principal = {};
		principal.id_user = userLiquidador?.id;
		principal.id_seller = sellerLiqui[0]?.id;
		principal.balance_gen_sell = balanceSeller;
		principal.date_liquidation = date.Currendate();
		principal.settlement_code = codLiq;
		principal.total_collection_bills = sumTotalCobrado.toFixed(2);
		principal.total_money = parseFloat(cash?.total) || 0;
		principal.total_expense = parseFloat(expenses?.total) || 0;
		principal.total_discount = parseFloat(discount?.total_other) || 0;
		principal.total_received = totalVendedor || 0;
		principal.detail = detailGeneral;
		principal.balance = cuadre;
		principal.isLiquidated = false;

		let balance = {};
		balance.id_balance = sellerLiqui?.[0]?.balance_sell?.id;
		balance.value = cuadre;

		let arraySendLiq = [];
		arraySendLiq.push(checkMoney);
		arraySendLiq.push(discount);
		arraySendLiq.push(expenses);
		arraySendLiq.push(cash);
		arraySendLiq.push(transaction);
		arraySendLiq.push(invoiceLiquidation);
		arraySendLiq.push(codLiq);
		arraySendLiq.push(`${userLiquidador?.username}`);
		arraySendLiq.push(
			`${date.CurrendateDay().toUpperCase()} - ${date.Currendate()}`
		);
		arraySendLiq.push(`${sellerLiqui[0]?.code} - ${sellerLiqui[0]?.name}`);
		arraySendLiq.push(principal);
		arraySendLiq.push(checkMoneyView);
		arraySendLiq.push(balance);

		// console.log(invoiceLiquidation);
		return arraySendLiq;
	};

	const deleteData = () => {
		setCodLiq("");
		setInvoiceLiquidation([]);
		setTransaction([]);
		setExpenses([]);
		setDiscount([]);
		setCash([]);
		setCheckMoney([]);
		setCheckMoneyView([]);

		localStorage.removeItem(codeGenLiq);
		localStorage.removeItem(codeInvoLocalStorage);
		localStorage.removeItem(codeTransacLocalStorage);
		localStorage.removeItem(codeExpeLocalStorage);
		localStorage.removeItem(codeDiscountLocalStorage);
		localStorage.removeItem(codeCashLocalStorage);
		localStorage.removeItem(codeCheckLocalStorage);
		localStorage.removeItem(codeCheckLocalStorage + "view");
		localStorage.removeItem(codePrinDetailStorage);
	};

	const peticionVerification = async () => {
		const arraySendLiq = loaderData();
		dispatch(setIsLoading(true));
		return axios
			.post(
				"http://localhost:8000/api/v1/invoice/search-group",
				arraySendLiq[5],
				getConfig()
			)
			.then((res) => {
				return res.data;
			})
			.catch((err) => {
				// console.log(err.response);
				return false; // o cualquier otro valor que desee devolver en caso de error
			})
			.finally(() => dispatch(setIsLoading(false)));
	};

	const liquidar = async () => {
		let direccion = `/dashboard/liquidation/sellers/print/${codLiq}`;
		const arraySendLiq = loaderData();
		const idSeller = arraySendLiq[10].id_seller;

		peticionVerification()
			.then((result) => {
				// console.log(result);
				if (result.isExistError !== true) {
					Swal.fire({
						title: "¿Está seguro?",
						text: `Se realizara la liquidacion del vendedor ${sellerLiqui[0]?.name}, no se podra revertir los cambios despues de confirmar la liquidacion .`,
						icon: "question",
						showCancelButton: true,
						confirmButtonColor: "#029C63",
						cancelButtonColor: "#d33",
						confirmButtonText: "Si, Liquidar!",
						reverseButtons: true,
					}).then((result) => {
						if (result.isConfirmed) {
							if (
								!codLiq ||
								Object.keys(expenses).length === 0 ||
								Object.keys(discount).length === 0 ||
								Object.keys(cash).length === 0
							) {
								Swal.fire({
									icon: "error",
									title: "Alert!",
									text: "Debes de Generar el Codigo de liquidacion y completar los campos Necesarios. En Caso que no tengas datos completa los campos con Cero ( 0 ).",
									showConfirmButton: true,
								});
							} else {
								sessionStorage.setItem(
									"printSeller",
									JSON.stringify(arraySendLiq)
								);
								dispatch(
									postSellerLiquidationthunk(arraySendLiq)
								);
								Swal.fire({
									icon: "success",
									title: "Guardado!",
									text: `Se a generadado la liquidacion con exito`,
									showConfirmButton: false,
									timer: 1000,
								});
								setTimeout(() => {
									window.open(
										direccion,
										"",
										"height=600,width=1200,center"
									);
								}, [1000]);
								navigate(
									`/dashboard/liquidation/sellers/${idSeller}/received-inovices`
								);
								dispatch(
									updateSellerThunk(sellerByLiqui, {
										data_liquidation: null,
										liquidation_isactive: false,
									})
								);
								deleteData();
							}
						} else {
							Swal.fire({
								icon: "warning",
								title: "Cancelado!",
								text: "Se a cancelado el registro, puede realizar los cambios necesarios",
								showConfirmButton: false,
								timer: 1000,
							});
						}
					});
				} else {
					Swal.fire({
						title: "Error",
						text: `Error no puedes liquidar una factura Eliminada de la base de datos, Mensaje:  ${result.info}`,
						icon: "error",
					});
				}
			})
			.catch((err) => {
				console.log(err);
				// Manejar errores aquí
			});

		/**/
	};

	const cancelLiquidation = () => {
		deleteData();
		dispatch(
			updateSellerThunk(sellerByLiqui, {
				data_liquidation: null,
				liquidation_isactive: false,
			})
		);
		navigate("/dashboard/liquidation/sellers");
	};

	const imprimirContenido = () => {
		let direccion = `/dashboard/liquidation/sellers/print/${codLiq}`;
		const arraySendLiq = loaderData();
		// console.log(arraySendLiq);
		if (
			!codLiq ||
			Object.keys(expenses).length === 0 ||
			Object.keys(discount).length === 0 ||
			Object.keys(cash).length === 0
		) {
			Swal.fire({
				title: "Alerta",
				text: "Debes de Generar el Codigo de liquidacion y completar los campos Necesarios. En Caso que no tengas datos completa los campos con Cero ( 0 ).",
				icon: "warning",
				confirmButtonColor: "#029C63",
				confirmButtonText: "OK",
			});
		} else {
			sessionStorage.setItem("printSeller", JSON.stringify(arraySendLiq));
			window.open(direccion, "", "height=600,width=1200,center");
			// setTimeout(() => {
			//     window.open(direccion, "", "height=600,width=1200,center");
			// }, [1000]);
		}
	};
	/************************************************************************/
	const saveDataBackend = (data) => {
		if (codLiq) {
			// console.log("Informacion guardada");
			const arregloText = JSON.stringify(loaderData());
			dispatch(
				updateSellerThunk(sellerByLiqui, {
					data_liquidation: arregloText,
					liquidation_isactive: true,
				})
			);
			// console.log(arregloText.length);
			// var tamanoBytes = JSON.stringify(loaderData()).length;
			// var tamanoMB = tamanoBytes / (1024 * 1024);
			// console.log("El tamaño del dato es: " + tamanoMB.toFixed(2) + " MB");
		} else {
			Swal.fire(
				"Alert",
				"Debes de generar el codigo para poder guardar la información",
				"info"
			);
		}
	};

	const [arregloOriginal, setArregloOriginal] = useState();
	const orderList = (event) => {
		const { value } = event.target;
		const invoiceFilter = [...invoiceLiquidation];
		setArregloOriginal(invoiceLiquidation);
		let result = [];

		if (parseInt(value) === 1) {
			// Orden Vendedor
			result = invoiceFilter.sort((a, b) =>
				a.seller?.name.localeCompare(b.seller?.name)
			);
		} else if (parseInt(value) === 2) {
			//Orden saldo
			result = invoiceFilter.sort((a, b) => b.balance - a.balance);
		} else if (parseInt(value) === 3) {
			// Orden Por Orden alfa
			result = invoiceFilter.sort((a, b) =>
				a.client?.fullname.localeCompare(b.client?.fullname)
			);
		} else if (parseInt(value) === 4) {
			// Orden Por Dia
			result = invoiceFilter.sort((a, b) =>
				a.client?.route_day?.day?.day.localeCompare(
					b.client?.route_day?.day?.day
				)
			);
		} else {
			return setInvoiceLiquidation(arregloOriginal);
		}
		console.log(result);
		setInvoiceLiquidation(result);
		// dispatch(setSeller(result));
	};

	const btnCreated = () => {
		return (
			<>
				<Buttonatom
					created={showSelectInvoice}
					title={"Agregar Facturas"}
					color={"success"}
					ico={"fa-circle-plus"}
				/>
				<Buttonatom
					created={() => deleteInvoice()}
					title={"Quitar Facturas"}
					color={"danger"}
					ico={"fa-trash-can"}
				/>
				<Buttonatom
					created={loadInvoice}
					title={""}
					color={"success"}
					ico={"fa-truck-ramp-box bx-fade-up-hover"}
				/>
				<Form.Select
					size="sm"
					className="w-25"
					aria-label="Default select example"
					onChange={orderList}
				>
					<option value={0}>Ordenar</option>
					<option value={1}>Vendedor</option>
					<option value={2}>Mayor Balance</option>
					<option value={3}>Alfabetico</option>
					<option value={4}>Por dia</option>
				</Form.Select>
			</>
		);
	};

	return (
		<div>
			{/* <button onClick={imprimirContenido}>Imprimir</button> */}

			<div id="contenido-a-imprimir">
				<h4>Liquidacion de Vendedores</h4>
				<div className="d-flex flex-row justify-content-between flex-wrap">
					<div>
						<h5>
							Usuario:{" "}
							<span style={{ color: "#02B875" }}>
								{" "}
								{userLiquidador?.username}{" "}
							</span>{" "}
						</h5>
						<h5>
							Fecha de liquidacion:{" "}
							<span style={{ color: "#02B875" }}>
								{date.CurrendateDay()} {date.Currendate()}{" "}
							</span>{" "}
						</h5>
						<h5>
							Se esta liquidando al Vendedor:
							<span style={{ color: "#02B875" }}>
								{" "}
								{sellerLiqui[0]?.code} -{" "}
								{sellerLiqui[0]?.name}
							</span>
						</h5>
					</div>
					<div
						style={{
							border: "2px solid var(--first-color)",
							padding: "0.5rem",
							textAlign: "center",
						}}
					>
						<h5>Balance General:</h5>
						<h4
							style={{
								fontSize: "39px",
								color: `${
									balanceSeller > 0
										? "#FFAC42"
										: balanceSeller < 0
										? "#C20114"
										: "#02B875"
								}`,
							}}
						>
							${parseFloat(balanceSeller).toFixed(2)}
						</h4>
						<span style={{ fontSize: "10px" }}>
							Anterior: ${" "}
							{parseFloat(
								sellerLiqui?.[0]?.balance_sell?.total
							).toFixed(2)}
						</span>
					</div>
				</div>

				<div className="mt-4 mb-4 border-top border-bottom">
					<h5 className="mt-2">Lista de Clientes a liquidar</h5>
					<Functionalitiesbtn
						buttons={btnCreated}
						listAvailable={""}
						aditional={() => {
							return <h5>Liquidacion: {codLiq}</h5>;
						}}
					/>
					<div className="mb-3">
						<TableLiquidationSeller
							data={invoiceLiquidation}
							modaltransaccionPay={modaltransaccionPay}
							type={"seller"}
							handleAddInvoice={handleAddInvoice}
							checkSelectedID={checkSelectedID}
						/>
					</div>
				</div>

				<div className="d-flex flex-row justify-content-between flex-wrap m-3">
					<div>
						<h5>
							Total Descuentos: ${" "}
							{discount?.total_other
								? discount?.total_other
								: (0).toFixed(2)}
						</h5>
						<h5>
							Total Gastos: ${" "}
							{expenses?.total
								? expenses?.total
								: (0).toFixed(2)}
						</h5>
						<h5>
							Total Dinero: ${" "}
							{cash?.total ? cash?.total : (0).toFixed(2)}
						</h5>
						<h5>Total: $ {totalVendedor || "$ 0.00"}</h5>
					</div>
					<div className="vr"></div>
					<div>
						<h2>Total Cobrado: $ {sumTotalCobrado.toFixed(2)}</h2>
						<h5
							style={{
								color: `${
									cuadre > 0
										? "#FFAC42"
										: cuadre < 0
										? "#C20114"
										: "#02B875"
								}`,
							}}
						>
							Cuadre: $ {cuadre}{" "}
						</h5>
						<span
							style={{
								color: `${
									cuadre > 0
										? "#FFAC42"
										: cuadre < 0
										? "#C20114"
										: "#02B875"
								}`,
							}}
						>
							{cuadre > 0
								? `El Vendedor ${sellerLiqui[0]?.name} tiene un saldo a Favor`
								: cuadre < 0
								? `El Vendedor ${sellerLiqui[0]?.name} tiene un saldo en Contra`
								: `La liquidacion del ${sellerLiqui[0]?.name} es Correcta`}
						</span>
					</div>
				</div>

				<div className="d-flex  gap-5 overflow-auto position-relative border-bottom border-top p-3 justify-fullScream ">
					<Expenses
						codLiq={codLiq}
						typeLiquidation={"seller"}
						receptedExpenses={receptedExpenses}
						codeExpeLocalStorage={codeExpeLocalStorage}
					/>

					<Discount
						codLiq={codLiq}
						typeLiquidation={"seller"}
						receptedDiscount={receptedDiscount}
						codeDiscountLocalStorage={codeDiscountLocalStorage}
					/>

					<Cash
						codLiq={codLiq}
						typeLiquidation={"seller"}
						checkmoney={checkMoney}
						receptedCash={receptedCash}
						codeCheckLocalStorage={codeCheckLocalStorage}
						codeCashLocalStorage={codeCashLocalStorage}
					/>
				</div>

				<div className="d-flex flex-column align-items-lg-start border-bottom p-3 mb-5">
					<span style={{ whiteSpace: "pre-line" }}>
						{detailGeneral}
					</span>
					<div className="w-100 mt-2">
						Anadir a Detalle General:
						<input
							className="form-control form-control-sm"
							type="text"
							value={principalDetail}
							onChange={(e) => {
								setPrincipalDetail(e.target.value);
								localStorage.setItem(
									codePrinDetailStorage,
									JSON.stringify(e.target.value)
								);
							}}
						/>
					</div>
				</div>

				<div className="btn-group btn-liquidation ">
					<Button
						style={{
							borderBottomLeftRadius: "0",
							borderBottomRightRadius: "0",
						}}
						onClick={cancelLiquidation}
						variant="danger"
					>
						<i className="fa-regular fa-circle-xmark bx-fw"></i>
						Cancelar Liquidacion
					</Button>

					<Button
						style={{
							borderBottomLeftRadius: "0",
							borderBottomRightRadius: "0",
						}}
						onClick={saveDataBackend}
						variant="primary"
					>
						<i className="fa-solid fa-save bx-fw"></i>
						Guardar
					</Button>

					<Button
						style={{
							borderBottomLeftRadius: "0",
							borderBottomRightRadius: "0",
						}}
						onClick={imprimirContenido}
						variant="outline-info"
					>
						<i className="fa-solid fa-print bx-fw"></i>
						Imprimir
					</Button>

					<Button
						style={{
							borderBottomLeftRadius: "0",
							borderBottomRightRadius: "0",
						}}
						variant="success"
						onClick={liquidar}
					>
						<i className="fa-solid fa-circle-check bx-fw"></i>
						Liquidar e Imprimir
					</Button>
				</div>
				{/* //TODO: Revisar codigo sobre el error en transactionfun*/}

				<ModalTransaccion
					datatransac={transaction}
					data={itemTableliqui}
					user={userLiquidador.id}
					show={modalTransaccionPay}
					onHide={() => {
						setModalTransaccionPay(false);
					}}
					transactionfun={transactionpay}
				/>

				<Modalagginvoice
					data={invoice}
					type={"seller"}
					showAggInvoice={showAggInvoice}
					setShowAggInvoice={setShowAggInvoice}
					aggInvoice={aggInvoice}
				/>
			</div>
		</div>
	);
};

export default Liquidationsell;
