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
import {
	postSellerLiquidationthunk,
	setLiquidationSlice,
} from "../../../../store/slices/liquidation.slice";
import { getSellerThunk } from "../../../../store/slices/seller.slice";
import date from "../../../../utils/date";
import genCod from "../../../../utils/genCod";
import {
	getVehiclesThunk,
	updateVehThunk,
} from "../../../../store/slices/vehicles.slice";
import ProductReturn from "../../../../components/cards/ProductReturn";
import DeliverCred from "../../../../components/cards/DeliverCred";
import { postVehicleLiquidationthunk } from "../../../../store/slices/liquidationVehicle.slice";
import axios from "axios";
import { setIsLoading } from "../../../../store/slices/isLoading.slice";
import getConfig from "../../../../utils/getConfig";

const Liquidationveh = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id: idVehicleByLiqui } = useParams();

	useEffect(() => {
		seller[0] ? null : dispatch(getSellerThunk());
		vehicle[0] ? null : dispatch(getVehiclesThunk());
		invoice[0] ? null : dispatch(getInvoiceThunk());
		loadInvoice();
	}, []);

	const userLiquidador = useSelector((state) => state.userLoged);
	const seller = useSelector((state) => state.seller);
	const vehicle = useSelector((state) => state.vehicles);
	const invoice = useSelector((state) => state.invoice);
	const invoiceFilter = invoice.filter((inv) => inv.balance !== 0);
	// console.log(invoice);

	const invoiceDia = useSelector((state) => state.liquidation);
	const vehicleLiqui = vehicle?.filter(
		(veh) => veh.id === parseInt(idVehicleByLiqui)
	);
	const [codLiq, setCodLiq] = useState("");

	const filterInvoiceDia = invoiceFilter.filter((veh) => {
		return parseInt(veh?.vehicle_liq) === parseInt(idVehicleByLiqui);
	});

	const [invoiceLiquidation, setInvoiceLiquidation] = useState(filterInvoiceDia);

	const codeGenLiq = `codGenLiq${vehicleLiqui[0]?.dni}-${vehicleLiqui[0]?.id}`;
	const codeInvoLocalStorage = `invoLiq${vehicleLiqui?.[0]?.dni}-${vehicleLiqui?.[0]?.id}`;
	const codeExpeLocalStorage = `expensesLiq${vehicleLiqui?.[0]?.dni}-${vehicleLiqui?.[0]?.id}`;
	const codeProductInvoLocalStorage = `proInvRetLiq${vehicleLiqui?.[0]?.dni}-${vehicleLiqui?.[0]?.id}`;
	const codeProductLocalStorage = `productRetLiq${vehicleLiqui?.[0]?.dni}-${vehicleLiqui?.[0]?.id}`;
	const codeDiscountLocalStorage = `discountLiq${vehicleLiqui?.[0]?.dni}-${vehicleLiqui?.[0]?.id}`;
	const codeCashLocalStorage = `cashLiq${vehicleLiqui?.[0]?.dni}-${vehicleLiqui?.[0]?.id}`;
	const codeCheckLocalStorage = `checkLiq${vehicleLiqui?.[0]?.dni}-${vehicleLiqui?.[0]?.id}`;
	const codeTransacLocalStorage = `trans${vehicleLiqui?.[0]?.dni}-${vehicleLiqui?.[0]?.id}`;
	const codeBoxSmalStorage = `boxSmal${vehicleLiqui?.[0]?.dni}-${vehicleLiqui?.[0]?.id}`;
	const codePrinDetailStorage = `prinDetail${vehicleLiqui?.[0]?.dni}-${vehicleLiqui?.[0]?.id}`;
	const codeDeliveCrdStorage = `creditDeliver${vehicleLiqui?.[0]?.dni}-${vehicleLiqui?.[0]?.id}`;

	const loadInvoice = () => {
		const sesionLocalCode = localStorage.getItem(codeGenLiq);
		const sesionLocal = JSON.parse(localStorage.getItem(codeInvoLocalStorage));
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
		const boxSmallSesionStorage = JSON.parse(
			localStorage.getItem(codeBoxSmalStorage)
		);
		const prinDetailSesionStorage = JSON.parse(
			localStorage.getItem(codePrinDetailStorage)
		);
		const productSesionStorage = JSON.parse(
			localStorage.getItem(codeProductLocalStorage)
		);

		sesionLocal?.[0]
			? setInvoiceLiquidation(sesionLocal)
			: setInvoiceLiquidation(filterInvoiceDia);

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
					JSON.stringify(filterInvoiceDia)
			  );

		cashSesionStorage ? setCash(cashSesionStorage) : setCash({});
		expensesSesionStorage
			? setExpenses(expensesSesionStorage)
			: setExpenses({});
		discountSesionStorage
			? setDiscount(discountSesionStorage)
			: setDiscount({});
		productSesionStorage
			? setProductReturn(productSesionStorage)
			: setProductReturn({});
		boxSmallSesionStorage ? setBoxSmall(boxSmallSesionStorage) : null;
		prinDetailSesionStorage
			? setPrincipalDetail(prinDetailSesionStorage)
			: null;
		setCodLiq(
			sesionLocalCode
				? sesionLocalCode
				: genCod(`LIQ-${vehicleLiqui[0]?.id}-`)
		);
		localStorage.removeItem("printVehicle");
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

	const handleAddInvoice = (e, item) => {
		const { checked, value, name } = e.target;

		console.log(e.target);
		if (value === "todos") {
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
							selectedItem?.toString() !== item.id?.toString()
					)
				);
			}
		}
	};
	// const handleAddInvoice = (e, item) => {
	// 	const { checked, value, name } = e.target;
	// 	// //console.log(item);
	// 	if (checked) {
	// 		setSelectedInvoices([...selectedInvoices, item]);
	// 		setCheckSelectedID((prevState) => [...prevState, value]);
	// 	} else {
	// 		setSelectedInvoices(
	// 			selectedInvoices.filter(
	// 				(selectedItem) => selectedItem.id !== item.id
	// 			)
	// 		);
	// 		setCheckSelectedID(
	// 			checkSelectedID.filter(
	// 				(selectedItem) =>
	// 					selectedItem.toString() !== item.id.toString()
	// 			)
	// 		);
	// 	}
	// };
	/****************************************************************************/

	/*********** Pago o abonos de FACTURAS  DE LA LISTA DE LIQUIDACION*****************/
	const [transaction, setTransaction] = useState([]);

	const [modalTransaccionPay, setModalTransaccionPay] = useState(false);
	const [itemTableliqui, setItemTableliqui] = useState([]);
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
					localStorage.setItem(
						codeInvoLocalStorage,
						JSON.stringify(newSessionInvoiceLiquidation)
					);
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

	/*********** EXPENSES - CASH - DISCOUNT - PRODUCT RETURND *****************/
	const [expenses, setExpenses] = useState([]);
	const [cash, setCash] = useState([]);
	const [discount, setDiscount] = useState([]);
	const [productReturn, setProductReturn] = useState([]);
	const [productReturnInvoice, setProductReturnInvoice] = useState([]);
	const [checkMoney, setCheckMoney] = useState([]);
	const [checkMoneyView, setCheckMoneyView] = useState([]);
	const [boxSmall, setBoxSmall] = useState(0);
	const [principalDetail, setPrincipalDetail] = useState("");
	const [sellerDeliverCred, setSellerDeliverCred] = useState([]);

	const totalProductRet = parseFloat(productReturn?.total || 0);
	const totalExpenses = parseFloat(expenses?.total || 0);
	const totalCash = parseFloat(cash?.total || 0);
	const totalDiscount = parseFloat(discount?.total_other || 0);
	const totalCredit = Object.values(sellerDeliverCred).reduce(
		(acc, cur) => acc + parseFloat(cur?.total),
		0
	);
	const totalSellerSales = Object.values(sellerDeliverCred).reduce(
		(acc, cur) => acc + parseFloat(cur?.sales),
		0
	);

	const totalVehicle =
		totalExpenses + totalCash + totalDiscount + totalProductRet + totalCredit;
	const totalAdmin =
		(sumTotalCobrado || 0) +
		(totalSellerSales || 0) +
		(parseFloat(boxSmall) || 0);

	const cuadre = (totalVehicle - totalAdmin).toFixed(2);
	const balanceVeh =
		parseFloat(vehicleLiqui?.[0]?.balance_veh?.total) + parseFloat(cuadre);

	const detailGeneral = `
    DETALLE GENERAL: ${principalDetail} 
    GASTOS: ${expenses?.detail || "Falta Guardar"}.
    DESCUENTOS: ${discount?.detail || "Falta Guardar"}.
    DINERO RECAUDADO: ${cash?.detail || "Falta Guardar"}.
    PRODUCTOS: ${productReturn?.detail || "Falta Guardar"}`;

	const receptedproduct = (item, invo) => {
		setProductReturn(item);
		setProductReturnInvoice(invo);
		//console.log(invo);
	};

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

	const recepteddeliver = (item) => {
		setSellerDeliverCred(item);
		//console.log(item);
	};
	/************************************************************************/
	const loaderData = () => {
		let principal = {};
		principal.id_user = userLiquidador.id;
		principal.settlement_date = date.Currendate();
		principal.id_vehicle = vehicleLiqui[0]?.id;
		principal.balance_gen_veh = balanceVeh;
		principal.settlement_code = codLiq;
		principal.box_small = boxSmall;
		principal.total_delivery_bills = totalSellerSales;
		principal.total_collection_bills = sumTotalCobrado;
		principal.total_sent = parseFloat(totalAdmin);
		principal.total_money = parseFloat(cash?.total) || 0;
		principal.total_discount = parseFloat(discount?.total_other) || 0;
		principal.total_expense = parseFloat(expenses?.total) || 0;
		principal.total_product = parseFloat(productReturn.total) || 0;
		principal.total_credit = totalCredit || 0;
		principal.total_received = totalVehicle || 0;
		principal.balance = parseFloat(cuadre);
		principal.detail = detailGeneral;
		principal.isLiquidated = false;

		let balance = {};
		balance.id_balance = vehicleLiqui?.[0]?.balance_veh?.id;
		balance.value = cuadre;

		let arraySendLiq = [];
		arraySendLiq.push(checkMoney);
		arraySendLiq.push(discount);
		arraySendLiq.push(expenses);
		arraySendLiq.push(cash);
		arraySendLiq.push(productReturn);
		arraySendLiq.push(productReturnInvoice);
		arraySendLiq.push(transaction);
		arraySendLiq.push(invoiceLiquidation);
		arraySendLiq.push(checkMoneyView);
		arraySendLiq.push(sellerDeliverCred);

		arraySendLiq.push(codLiq);
		arraySendLiq.push(`${userLiquidador.username}`);
		arraySendLiq.push(
			`${date.CurrendateDay().toUpperCase()} - ${date.Currendate()}`
		);
		arraySendLiq.push(
			`${vehicleLiqui[0]?.enrollment} - ${vehicleLiqui[0]?.driver}`
		);
		arraySendLiq.push(principal);
		arraySendLiq.push(balance);

		return arraySendLiq;
	};

	const deleteData = () => {
		setCodLiq("");
		setExpenses([]);
		setCash([]);
		setDiscount([]);
		setProductReturn([]);
		setProductReturnInvoice([]);
		setCheckMoney([]);
		setCheckMoneyView([]);
		setBoxSmall([]);
		setPrincipalDetail([]);
		setSellerDeliverCred([]);
		setInvoiceLiquidation([]);
		setTransaction([]);

		localStorage.removeItem(codeGenLiq);
		localStorage.removeItem(codeCheckLocalStorage);
		localStorage.removeItem(codeCheckLocalStorage + "view");
		localStorage.removeItem(codeDiscountLocalStorage);
		localStorage.removeItem(codeCashLocalStorage);
		localStorage.removeItem(codeExpeLocalStorage);
		localStorage.removeItem(codeInvoLocalStorage);
		localStorage.removeItem(codeBoxSmalStorage);
		localStorage.removeItem(codeProductInvoLocalStorage);
		localStorage.removeItem(codeProductInvoLocalStorage + "view");
		localStorage.removeItem(codeDeliveCrdStorage);
		localStorage.removeItem(codeProductLocalStorage);
		localStorage.removeItem(codeTransacLocalStorage);
		localStorage.removeItem(codePrinDetailStorage);
	};
	/************************************************************************/
	// const [message, setMessage] = useState({});

	const peticionVerification = async () => {
		const arraySendLiq = loaderData();
		dispatch(setIsLoading(true));
		return axios
			.post(
				"http://localhost:8000/api/v1/invoice/search-group",
				arraySendLiq[7],
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

	const liquidar = () => {
		let direccion = `/dashboard/liquidation/vehicle/print/${vehicleLiqui[0]?.id}`;
		const arraySendLiq = loaderData();

		const idSeller = arraySendLiq[10].id_seller;
		peticionVerification()
			.then((result) => {
				// console.log(result);
				if (result.isExistError !== true) {
					Swal.fire({
						title: "¿Está seguro?",
						text: `Se realizara la liquidacion del Vehiculo de entrega conducido por  ${vehicleLiqui[0]?.driver}, no se podra revertir los cambios despues de confirmar la liquidacion .`,
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
								Object.keys(cash).length === 0 ||
								Object.keys(productReturn).length === 0 ||
								Object.keys(sellerDeliverCred).length === 0
							) {
								Swal.fire({
									icon: "error",
									title: "Alert!",
									text: "Debes de Generar el Codigo de liquidacion y completar los campos Necesarios. En Caso que no tengas datos completa los campos con Cero ( 0 ).",
									showConfirmButton: true,
								});
							} else {
								sessionStorage.setItem(
									"printVehicle" + vehicleLiqui[0]?.id,
									JSON.stringify(arraySendLiq)
								);

								deleteData();

								dispatch(
									postVehicleLiquidationthunk(
										arraySendLiq
									)
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
								dispatch(
									updateVehThunk(idVehicleByLiqui, {
										data_liquidation: null,
										liquidation_isactive: false,
									})
								);
								navigate(`/dashboard/liquidation/vehicles`);
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
				// Hacer algo con el resultado aquí
			})
			.catch((err) => {
				console.log(err);
				// Manejar errores aquí
			});
	};

	const cancelLiquidation = () => {
		deleteData();
		dispatch(
			updateVehThunk(idVehicleByLiqui, {
				data_liquidation: null,
				liquidation_isactive: false,
			})
		);
		navigate("/dashboard/liquidation/vehicles");
	};

	function imprimirContenido() {
		let direccion = `/dashboard/liquidation/vehicle/print/${vehicleLiqui[0]?.id}`;
		const arraySendLiq = loaderData();
		//console.log(arraySendLiq);
		if (
			!codLiq ||
			Object.keys(expenses).length === 0 ||
			Object.keys(discount).length === 0 ||
			Object.keys(cash).length === 0 ||
			Object.keys(productReturn).length === 0 ||
			Object.keys(sellerDeliverCred).length === 0
		) {
			Swal.fire({
				title: "Alerta",
				text: "Debes de Generar el Codigo de liquidacion y completar los campos Necesarios. En Caso que no tengas datos completa los campos con Cero ( 0 ).",
				icon: "warning",
				confirmButtonColor: "#029C63",
				confirmButtonText: "OK",
			});
		} else {
			sessionStorage.setItem(
				"printVehicle" + vehicleLiqui[0]?.id,
				JSON.stringify(arraySendLiq)
			);
			window.open(direccion, "", "height=600,width=1200,center");
		}
	}
	/************************************************************************/
	const saveDataBackend = (data) => {
		if (codLiq) {
			// console.log("Informacion guardada");
			const arregloText = JSON.stringify(loaderData());
			dispatch(
				updateVehThunk(idVehicleByLiqui, {
					data_liquidation: arregloText,
					liquidation_isactive: true,
				})
			);
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
			<div id="contenido-a-imprimir" style={{ margin: "1.5rem 0" }}>
				<h4>Liquidacion de Vehiculos de Entrega</h4>
				<div className="d-flex flex-row justify-content-between flex-wrap">
					<div>
						<h5>
							Usuario:{" "}
							<span style={{ color: "#02B875" }}>
								{" "}
								{userLiquidador.username}{" "}
							</span>{" "}
						</h5>
						<h5>
							Fecha de liquidacion:{" "}
							<span style={{ color: "#02B875" }}>
								{date.CurrendateDay().toUpperCase()}{" "}
								{date.Currendate()}{" "}
							</span>{" "}
						</h5>
						<h5>
							Se esta liquidando al Vehiculo:
							<span style={{ color: "#02B875" }}>
								{" "}
								{vehicleLiqui?.[0]?.id} -{" "}
								{vehicleLiqui?.[0]?.driver}
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
									balanceVeh > 0
										? "#FFAC42"
										: balanceVeh < 0
										? "#C20114"
										: "#02B875"
								}`,
							}}
						>
							${parseFloat(balanceVeh).toFixed(2)}
						</h4>
						<span style={{ fontSize: "10px" }}>
							Anterior: ${" "}
							{parseFloat(
								vehicleLiqui?.[0]?.balance_veh?.total
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
							return <h5> Cod Liquidacion: {codLiq}</h5>;
						}}
					/>
					<div className="mb-3">
						<TableLiquidationSeller
							data={invoiceLiquidation}
							modaltransaccionPay={modaltransaccionPay}
							type={"vehicle"}
							handleAddInvoice={handleAddInvoice}
							checkSelectedID={checkSelectedID}
						/>
					</div>
				</div>

				<div className="d-flex flex-row justify-content-between flex-wrap m-3 gap-4">
					<div>
						<h5>
							Total Descuentos: ${" "}
							{discount?.total_other
								? discount?.total_other
								: (0).toFixed(2)}
						</h5>
						<h5>
							Total Productos: ${" "}
							{productReturn?.total
								? productReturn?.total
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
						<div
							style={{
								border: "1px solid var(--first-color)",
								borderRadius: "5px",
							}}
						>
							{sellerDeliverCred.map((deliver, index) => (
								<div
									key={index}
									style={{
										display: "flex",
										justifyContent: "space-between",
									}}
								>
									<h5>
										{
											seller.filter(
												(sell) =>
													sell.id ===
													parseInt(
														deliver?.id_seller
													)
											)[0]?.code
										}
										:
									</h5>
									<h5>$ {deliver?.total}</h5>
								</div>
							))}
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<h5>Total Creditos: </h5>
								<h5>$ {totalCredit.toFixed(2)}</h5>
							</div>
						</div>
						<h5>
							Total: ${" "}
							{parseFloat(totalVehicle).toFixed(2) || "0.00"}
						</h5>
					</div>

					<div className="vr"></div>

					<div>
						<div className="d-flex">
							<h3>Total Cobrado: $</h3>
							<h3>{sumTotalCobrado.toFixed(2)}</h3>
						</div>

						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<h5 style={{ margin: "0" }}>Caja Chica:</h5>
							<div style={{ display: "flex" }}>
								<h5>$</h5>
								<input
									className="form-control form-control-sm"
									style={{
										fontSize: "17px",
										width: "75px",
									}}
									type="text"
									value={boxSmall}
									onChange={(e) => {
										if (!isNaN(e.target.value)) {
											setBoxSmall(e.target.value);
											localStorage.setItem(
												codeBoxSmalStorage,
												JSON.stringify(
													e.target.value
												)
											);
										}
									}}
								/>
							</div>
						</div>

						<div
							style={{
								border: "1px solid var(--first-color)",
								borderRadius: "5px",
							}}
						>
							{sellerDeliverCred.map((deliver, index) => (
								<div
									key={index}
									style={{
										display: "flex",
										justifyContent: "space-between",
									}}
								>
									<h5>
										{
											seller.filter(
												(sell) =>
													sell.id ===
													parseInt(
														deliver?.id_seller
													)
											)[0]?.code
										}
										:
									</h5>
									<h5>$ {parseFloat(deliver?.sales)}</h5>
								</div>
							))}
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<h5 style={{ margin: "0" }}>
									Total Ventas:
								</h5>
								<h5>${totalSellerSales.toFixed(2)}</h5>
							</div>
						</div>

						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
							}}
						>
							<h5>Total:</h5>
							<h5>${totalAdmin.toFixed(2)}</h5>
						</div>
					</div>

					<div className="vr"></div>

					<div>
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
								display: "flex",
								width: "300px",
							}}
						>
							{cuadre > 0
								? `El Vehiculo de entrega conducido por ${vehicleLiqui?.[0]?.driver?.toUpperCase()} tiene un saldo a Favor`
								: cuadre < 0
								? `El Vehiculo de entrega conducido por ${vehicleLiqui?.[0]?.driver?.toUpperCase()} tiene un saldo en Contra`
								: `La liquidacion del Vehiculo de entrega conducido por ${vehicleLiqui?.[0]?.driver?.toUpperCase()} es Correcta`}
						</span>
					</div>
				</div>

				<div className="d-flex  gap-5 overflow-auto position-relative border-bottom border-top p-3 justify-fullScream ">
					<DeliverCred
						codLiq={codLiq}
						typeLiquidation={"vehicle"}
						recepteddeliver={recepteddeliver}
						codeDeliveCrdStorage={codeDeliveCrdStorage}
					/>

					<Expenses
						codLiq={codLiq}
						typeLiquidation={"vehicle"}
						receptedExpenses={receptedExpenses}
						codeExpeLocalStorage={codeExpeLocalStorage}
					/>

					<Discount
						codLiq={codLiq}
						typeLiquidation={"vehicle"}
						receptedDiscount={receptedDiscount}
						codeDiscountLocalStorage={codeDiscountLocalStorage}
					/>

					<Cash
						codLiq={codLiq}
						typeLiquidation={"vehicle"}
						checkmoney={checkMoney}
						receptedCash={receptedCash}
						codeCheckLocalStorage={codeCheckLocalStorage}
						codeCashLocalStorage={codeCashLocalStorage}
					/>
					<ProductReturn
						codLiq={codLiq}
						typeLiquidation={"vehicle"}
						receptedproduct={receptedproduct}
						vehid={idVehicleByLiqui}
						codinvo={codeProductInvoLocalStorage}
						codeproductLocalStorage={codeProductLocalStorage}
					/>
				</div>

				<div className="d-flex flex-column align-items-lg-start border-bottom p-3 mb-5">
					<span style={{ whiteSpace: "pre-line" }}>
						{detailGeneral}
					</span>
					<div className="w-100 mt-2">
						Anadir a Detalle General
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
					typeLiquidation={"vehicle"}
				/>

				<Modalagginvoice
					data={invoice}
					type={"vehicle"}
					showAggInvoice={showAggInvoice}
					setShowAggInvoice={setShowAggInvoice}
					aggInvoice={aggInvoice}
				/>
			</div>
		</div>
	);
};

export default Liquidationveh;
