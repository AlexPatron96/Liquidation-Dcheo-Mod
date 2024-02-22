import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Buttonatom from "../../components/atom/Buttonatom";
import Functionalitiesbtn from "../../components/atom/Functionalitiesbtn";
import Createdcustomer from "../../components/creators/Createdcustomer";
import Tabledinamik from "../../components/molecules/Tabledinamik";
import Paginationdesign from "../../components/Paginationdesign";
import LoadingScreen from "../../layout/LoadingScreen";
import {
	deleteInvoiceThunk,
	getInvoiceThunk,
	postInvoiceTransacthunk,
	updateInvoiceThunk,
} from "../../store/slices/invoice.slice";
import { setPagination } from "../../store/slices/pagination.slice";
import Swal from "sweetalert2";
import TableInvoice from "../../components/Show/TableInvoice";
import { getRouteDayThunk } from "../../store/slices/routeday.slice";
import ModalInvoiceTransac from "../../components/Modals/ModalInvoiceTransac";
import { getSellerThunk } from "../../store/slices/seller.slice";
import { getCustomerThunk } from "../../store/slices/customer.slice";
import Formselectatom from "../../components/atom/Formselectatom";
import Filterinvoice from "../../components/Modals/Filterinvoice";
import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import date from "../../utils/date";
import { setIsLoading } from "../../store/slices/isLoading.slice";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const Invoice = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		invoice[0] ? null : dispatch(getInvoiceThunk());
		routeDay[0] ? null : dispatch(getRouteDayThunk());
	}, []);

	const routeDay = useSelector((state) => state.routeDay);
	const invoice = useSelector((state) => state.invoice);
	const loading = useSelector((state) => state.isLoading);
	const pagination = useSelector((state) => state.pagination);
	const user = useSelector((state) => state.userLoged);

	const [modalShow, setModalShow] = useState(false);
	console.log(invoice);
	const createdCustomer = () => {
		if (!modalShow) {
			setModalShow(true);
		} else {
			setModalShow(false);
		}
	};
	// const dataIfn = [
	// 	{ name: "John Doe", age: 25, email: "john@example.com" },
	// 	{ name: "Jane Smith", age: 30, email: "jane@example.com" },
	// 	// Agrega más datos aquí...
	// ];

	const btnCreated = () => {
		return (
			<>
				<Buttonatom
					isTrueOfElse={
						!user.roll?.permissions?.edited_seller_maxtotal
					}
					created={createdCustomer}
					title={"Crear Cliente"}
					color={"success"}
					ico={"fa-circle-plus"}
				/>

				<Buttonatom
					isTrueOfElse={
						!user.roll?.permissions?.edited_seller_maxtotal
					}
					created={transaccionPay}
					title={"Pago-Abono"}
					color={"success"}
					ico={"fa-sack-dollar"}
				/>

				<Buttonatom
					created={refresh}
					title={""}
					color={"info"}
					ico={"fa-arrow-rotate-right bx-spin-hover"}
				/>
				<Buttonatom
					created={() => setModalFilter(true)}
					title={""}
					color={"primary"}
					ico={"fa-filter"}
				/>

				<Buttonatom
					created={() => generarArchivoExcel(invoice, false)}
					title={"Exel General"}
					color={"warning"}
					ico={"fa-download"}
				/>

				<Buttonatom
					created={() => generarArchivoExcel(invoice, true)}
					title={"Exel Facturas"}
					color={"warning"}
					ico={"fa-download"}
				/>
			</>
		);
	};
	/************************************************************************************** */

	const createInvo = (data) => {
		// Swal.fire({
		// 	position: "center",
		// 	icon: "success",
		// 	title: "Se a creado una Factura nueva",
		// 	showConfirmButton: false,
		// 	timer: 1500,
		// });
		dispatch(postInvoiceTransacthunk(data));
	};

	const updateInvo = (id, data) => {
		dispatch(updateInvoiceThunk(id, data));
	};

	const delInvo = (id) => {
		dispatch(deleteInvoiceThunk(id));
	};

	const search = (data) => {
		const filteredList = invoice.filter(
			(item) =>
				(item?.client?.fullname)
					.toLowerCase()
					.includes(data.toLowerCase()) ||
				(item?.client?.dni).includes(data) ||
				(item?.num_bill).includes(data) ||
				(item?.deliver_date).includes(data) ||
				(item?.seller.code).toLowerCase().includes(data) ||
				(item?.seller.name).toLowerCase().includes(data)
		);
		dispatch(setPagination(filteredList));
	};

	const [modalTransaccionPay, setModalTransaccionPay] = useState(false);
	const [itemSelect, setItemSelect] = useState("");

	const transaccionPay = (item) => {
		setModalTransaccionPay(true);
		setItemSelect(item);
	};

	const refresh = () => {
		dispatch(getInvoiceThunk());
		dispatch(getRouteDayThunk());
		dispatch(getSellerThunk());
		dispatch(getCustomerThunk());
	};

	const selecionSearch = (e) => {
		const { name, value } = e.target;
		// console.log(value);
	};
	const searchDB = [
		{ id: 1, detail: "LOCAL" },
		{ id: 2, detail: "BASE DATOS" },
	];
	const listAvailable = () => {
		return (
			<>
				<Formselectatom
					title={"Selecionar lugar de busqueda"}
					iterador={searchDB}
					dataSelect={selecionSearch}
					firstdata={"detail"}
					secunddata={"dia"}
					disabledAction={false}
				/>
			</>
		);
	};

	const [modalFilter, setModalFilter] = useState(false);
	const onHideFilter = () => {
		setModalFilter(false);
	};

	const generarArchivoExcel = (data, value) => {
		// Crear un nuevo libro de Excel
		dispatch(setIsLoading(true));
		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet("Datos");

		// const sumBalance = data.reduce(
		// 	(total, obj) => total + parseFloat(obj.balance),
		// 	0
		// );
		// const sumTotal = data.reduce(
		// 	(total, obj) => total + parseFloat(obj.total_bill),
		// 	0
		// );

		worksheet.addRow([" ", " ", `Distribuidora de CHEO`]);
		worksheet.addRow([
			" ",
			`Generado Por: ${user.fullname}`,
			`Fecha: ${date.CurrendateDay()} ${date.Currendate()}`,
			`Tipo: ${user.username}`,
		]);
		worksheet.addRow([" ", " "]);
		worksheet.addRow([
			"ID",
			"Fecha",
			"Cliente",
			"Punto de Emision",
			"Punto de Establecimiento",
			"Numero de Factura",
			"Valor de Factura",
			"Abono Pago",
			"Saldo de Factura",
			"Tipo de Pago",
			"Numero de Proceso",
		]);

		value
			? data.forEach((datum) => {
					datum.isWhite
						? ""
						: worksheet.addRow([
								datum.id,
								`(${date.DatePastPresent(
									datum.deliver_date
								)})  ${datum.deliver_date}`,
								datum.client.fullname,
								"001",
								datum.num_bill.length > 13
									? datum.num_bill
									: datum.num_bill.match(/^\d{3}/)[0],
								datum.num_bill.length > 13
									? datum.num_bill
									: datum.num_bill.match(/-(\d+)$/)[1],
								// datum.num_bill,
								//
								`${parseFloat(datum.total_bill).toFixed(2)}`,
								"",
								`${parseFloat(datum.balance).toFixed(2)}`,
								datum.detail ? data.detail : "Credito",
								// datum.seller.name,
						  ]);
					datum.isWhite
						? ""
						: datum.transactions.forEach((transc) => {
								transc.pay != 0
									? worksheet.addRow([
											datum.id,
											transc.balance_date,
											datum.client.fullname,
											"001",
											datum.num_bill.length > 13
												? datum.num_bill
												: datum.num_bill.match(
														/^\d{3}/
												  )[0],
											datum.num_bill.length > 13
												? datum.num_bill
												: datum.num_bill.match(
														/-(\d+)$/
												  )[1],
											`${parseFloat(
												datum.total_bill
											).toFixed(2)}`,
											`${parseFloat(
												transc.pay
											).toFixed(2)}`,
											`${parseFloat(
												datum.balance
											).toFixed(2)}`,
											transc.detail
												? transc.detail
												: "EF",
									  ])
									: ``;
								let newRow = worksheet.lastRow;
								transc.pay != 0
									? (newRow.fill = {
											type: "pattern",
											pattern: "solid",
											fgColor: { argb: "FFFF00" }, // Color de fondo amarillo
									  })
									: "";
						  });
			  })
			: data.forEach((datum) => {
					worksheet.addRow([
						datum.id,
						`(${date.DatePastPresent(datum.deliver_date)})  ${
							datum.deliver_date
						}`,
						datum.client.fullname,
						"001",
						datum.num_bill.length > 13
							? datum.num_bill
							: datum.num_bill.match(/^\d{3}/)[0],
						datum.num_bill.length > 13
							? datum.num_bill
							: datum.num_bill.match(/-(\d+)$/)[1],
						// datum.num_bill,
						//
						`${parseFloat(datum.total_bill).toFixed(2)}`,
						"",
						`${parseFloat(datum.balance).toFixed(2)}`,
						datum.detail ? data.detail : "Credito",
						// datum.seller.name,
					]);

					datum.transactions.forEach((transc) => {
						transc.pay != 0
							? worksheet.addRow([
									datum.id,
									transc.balance_date,
									datum.client.fullname,
									"001",
									datum.num_bill.length > 13
										? datum.num_bill
										: datum.num_bill.match(
												/^\d{3}/
										  )[0],
									datum.num_bill.length > 13
										? datum.num_bill
										: datum.num_bill.match(
												/-(\d+)$/
										  )[1],
									`${parseFloat(datum.total_bill).toFixed(
										2
									)}`,
									`${parseFloat(transc.pay).toFixed(2)}`,
									`${parseFloat(datum.balance).toFixed(
										2
									)}`,
									transc.detail ? transc.detail : "EF",
							  ])
							: ``;
						let newRow = worksheet.lastRow;
						transc.pay != 0
							? (newRow.fill = {
									type: "pattern",
									pattern: "solid",
									fgColor: { argb: "FFFF00" }, // Color de fondo amarillo
							  })
							: "";
					});
			  });

		// worksheet.addRow([
		// 	"",
		// 	"",
		// 	"",
		// 	"",
		// 	"",
		// 	"Totales:",
		// 	// `$ ${parseFloat(sumTotal).toFixed(2)}`,
		// 	// `$ ${parseFloat(sumBalance).toFixed(2)}`,
		// ]);
		// Generar el archivo Excel

		workbook.xlsx
			.writeBuffer()
			.then((buffer) => {
				const blob = new Blob([buffer], {
					type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
				});
				value
					? saveAs(blob, "datos-Facturas.xlsx")
					: saveAs(blob, "datos-general.xlsx");
			})
			.finally(dispatch(setIsLoading(false)));
	};
	// console.log(invoice);
	return (
		<div className="pages">
			<h2>Facturas</h2>
			<Functionalitiesbtn
				buttons={btnCreated}
				// listAvailable={listAvailable}
				search={search}
			/>

			<TableInvoice
				data={pagination}
				updateInvo={updateInvo}
				delInvo={delInvo}
				transaccionPay={transaccionPay}
				createInvo={createInvo}
			/>

			{!loading ? <Paginationdesign data={"invoice"} /> : <LoadingScreen />}
			<Createdcustomer
				show={modalShow}
				onHide={() => setModalShow(false)}
				title={"Created Customer"}
			/>
			{/* <ModalInvoiceTransac onHide={() => { setModalTransaccionPay(false) }} show={modalTransaccionPay} /> */}
			<ModalInvoiceTransac
				itemSelect={itemSelect}
				onhide={() => setModalTransaccionPay(false)}
				show={modalTransaccionPay}
			/>

			<Filterinvoice
				itemSelect={itemSelect}
				onhide={() => setModalFilter(false)}
				show={modalFilter}
			/>
		</div>
	);
};

export default Invoice;
