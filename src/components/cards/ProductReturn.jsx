import React, { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import TableInvoice from "../Show/TableInvoice";
import { useSelector } from "react-redux";
import genCod from "../../utils/genCod";

const ProductReturn = ({
	codLiq,
	codinvo,
	receptedproduct,
	codeproductLocalStorage,
	typeLiquidation,
	vehid,
}) => {
	const initialValueTransaccion = {
		settlement_code: codLiq,
		disrepair: "0",
		rejected: "0",
		expired: "0",
		total: "",
		detail: "OK",
	};

	/************** */
	const [typeIsSelected, setTypeIsSelected] = useState("");
	/************** */

	const productLocalStorage = JSON.parse(
		localStorage.getItem(codeproductLocalStorage)
	);
	const invoReturnLocalStorage = JSON.parse(localStorage.getItem(codinvo));
	const invoReturnViewLocalStorage = JSON.parse(
		localStorage.getItem(codinvo + "view")
	);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: initialValueTransaccion,
	});

	useEffect(() => {
		typeLiquidation === "vehicle"
			? setTypeIsSelected(false)
			: setTypeIsSelected(true);

		setValue("settlement_code", codLiq);
		productLocalStorage
			? setValue("disrepair", productLocalStorage.disrepair)
			: "";
		productLocalStorage
			? setValue("rejected", productLocalStorage.rejected)
			: "";
		productLocalStorage
			? setValue("expired", productLocalStorage.expired)
			: "";
		productLocalStorage ? setValue("total", productLocalStorage.total) : "";
		productLocalStorage ? setTotal(productLocalStorage.total) : "";
		productLocalStorage ? setValue("detail", productLocalStorage.detail) : "";

		invoReturnLocalStorage ? setListInvoiceNew(invoReturnLocalStorage) : "";
		invoReturnViewLocalStorage
			? setListInvoiceNewView(invoReturnViewLocalStorage)
			: "";
	}, [codLiq]);

	const [total, setTotal] = useState(0);
	const [formData, setFormData] = useState(new FormData());

	const calculateTotal = () => {
		let disrepair = parseFloat(formData.get("disrepair") || 0);
		let rejected = parseFloat(formData.get("rejected") || 0);
		let expired = parseFloat(formData.get("expired") || 0);

		const newTotal = disrepair + rejected + expired;
		setTotal(newTotal.toFixed(2));
		setValue("total", newTotal.toFixed(2));
	};

	const onChange = (event) => {
		setValue("settlement_code", codLiq);
		const { name, value } = event.target;
		formData.set(name, value);
		setFormData(formData);
		calculateTotal();
	};

	const onSubmit = (data) => {
		setValue("settlement_code", codLiq);
		receptedproduct(data, listInoviceNew);
		localStorage.setItem(codeproductLocalStorage, JSON.stringify(data));
		localStorage.setItem(codinvo, JSON.stringify(listInoviceNew));
		localStorage.setItem(codinvo + "view", JSON.stringify(listInoviceNewView));
		handleClose();
	};

	const resetAction = () => {
		reset();
		setFormData(new FormData());
		setListInvoiceNew([]);
		setListInvoiceNewView([]);
		localStorage.removeItem(codeproductLocalStorage);
		localStorage.removeItem(codinvo);
		localStorage.removeItem(codinvo + "view");
	};
	/* * ************* Agregar Facturas de PRoductos  ********************* */
	const [listInoviceNew, setListInvoiceNew] = useState([]);
	const [listInoviceNewView, setListInvoiceNewView] = useState([]);
	const clients = useSelector((state) => state.customer);
	const seller = useSelector((state) => state.seller);
	const user = useSelector((state) => state.userLoged);

	const newInvoice = (item) => {
		const clientFillter = clients.filter((cli) => cli.id === item.id_client);
		const sellerFillter = seller.filter(
			(sell) => sell.id === parseInt(item.id_seller)
		);

		const codeGEn = genCod(`NV-VEH${vehid}-`);
		const idGen = (listInoviceNew?.[listInoviceNew.length - 1]?.id || 0) + 1;

		//console.log(listInoviceNew);

		const DataFormat = {
			id: idGen,
			balance: parseFloat(item.balance),
			deliver_date: item.deliver_date,
			detail: item.detail,
			id_client: item.id_client,
			id_seller: item.id_seller,
			id_status: item.id_status,
			isWhite: Boolean(item.isWhite),
			num_bill: Boolean(item.isWhite) ? codeGEn : item.num_bill,
			total_bill: parseFloat(item.total_bill),
		};

		const DataFormatView = {
			id: idGen,
			balance: parseFloat(item.balance),
			deliver_date: item.deliver_date,
			detail: item.detail,
			client: clientFillter[0],
			seller: sellerFillter[0],
			id_status: item.id_status,
			isWhite: Boolean(item.isWhite),
			num_bill: Boolean(item.isWhite) ? codeGEn : item.num_bill,
			total_bill: parseFloat(item.total_bill),
		};

		item.total_bill = parseFloat(item.total_bill);
		item.balance = parseFloat(item.balance);

		setListInvoiceNew((preState) => [...preState, DataFormat]);
		setListInvoiceNewView((preState) => [...preState, DataFormatView]);
	};

	const deleteInvoice = (item) => {
		const invoiceFilterDelete = listInoviceNew.filter(
			(inv) => inv.id !== item
		);
		const invoiceFilterDeleteView = listInoviceNewView.filter(
			(inv) => inv.id !== item
		);
		//console.log(invoiceFilterDelete);

		setListInvoiceNew(invoiceFilterDelete);
		setListInvoiceNewView(invoiceFilterDeleteView);
	};

	const [showProductRt, setShowProductRt] = useState(false);

	const handleClose = () => setShowProductRt(false);
	const handleShow = () => setShowProductRt(true);
	return (
		<div>
			<Button
				variant="primary"
				onClick={handleShow}
				className="styleBtnModal"
				style={{ fontSize: "19px", fontWeight: "500" }}
			>
				<i className="fa-solid fa-basket-shopping bx-fw"></i>
				PRODUCTOS
				{/* <h5>PRODUCTOS</h5> */}
			</Button>

			<Modal show={showProductRt} onHide={handleClose} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>Productos En Camion</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="">
						{/* <h5>Productos</h5> */}
						<div>
							<Form onSubmit={handleSubmit(onSubmit)}>
								{/* Codigo de factura*/}

								<Form.Group className="mb-3 text-center w-100">
									<i className="fa-solid fa-file-invoice bx-fw"></i>
									<Form.Label
										className="mb-2"
										style={{
											fontSize: "12px",
										}}
									>
										# Liquidacion
									</Form.Label>
									<Form.Control
										readOnly
										placeholder="LIQ-SELL-M1-day"
										className="w-100 text-center"
										style={{
											fontSize: "12px",
										}}
										{...register("settlement_code")}
									/>
									<p
										className={`error-message ${
											errors["settlement_code"]
												? "showError"
												: ""
										}`}
									>
										Campo requerido
									</p>
								</Form.Group>

								<div className="d-flex gap-3">
									{/* Mal Estado */}
									<Form.Group className="mb-3 text-center w-100">
										<i className="fa-solid fa-house-crack bx-fw"></i>
										<Form.Label
											className="mb-2"
											style={{
												fontSize: "12px",
											}}
										>
											{" "}
											Mal Estado
										</Form.Label>
										<Form.Control
											className="w-100 text-center"
											style={{
												fontSize: "12px",
											}}
											placeholder="$"
											{...register("disrepair", {
												required: true,
												onChange: onChange,
												pattern: /^[-]?\d*.?\d+$/,
											})}
										/>
										<p
											className={`error-message ${
												errors["disrepair"]
													?.type ===
												"required"
													? "showError"
													: ""
											}`}
										>
											Campo requerido
										</p>
										<p
											className={`error-message ${
												errors["disrepair"]
													?.type === "pattern"
													? "showError"
													: ""
											}`}
										>
											Solo se permite numeros
										</p>
									</Form.Group>

									{/* Productos Caducados */}
									<Form.Group className="mb-3 text-center w-100">
										<i className="fa-solid fa-business-time bx-fw"></i>
										<Form.Label
											className="mb-2"
											style={{
												fontSize: "12px",
											}}
										>
											{" "}
											Caducados
										</Form.Label>
										<Form.Control
											className="w-100 text-center"
											style={{
												fontSize: "12px",
											}}
											placeholder="$"
											{...register("expired", {
												required: true,
												onChange: onChange,
												pattern: /^[-]?\d*.?\d+$/,
											})}
										/>
										<p
											className={`error-message ${
												errors["expired"]
													?.type ===
												"required"
													? "showError"
													: ""
											}`}
										>
											Campo requerido
										</p>
										<p
											className={`error-message ${
												errors["expired"]
													?.type === "pattern"
													? "showError"
													: ""
											}`}
										>
											Solo se permite numeros
										</p>
									</Form.Group>

									{/* Devueltos o retornados */}
									<Form.Group className="mb-3 text-center w-100">
										<i className="fa-solid fa-arrow-right-arrow-left bx-fw"></i>
										<Form.Label
											className="mb-2"
											style={{
												fontSize: "12px",
											}}
										>
											Devueltos
										</Form.Label>
										<Form.Control
											className="w-100 text-center"
											style={{
												fontSize: "12px",
											}}
											placeholder="$"
											{...register("rejected", {
												required: true,
												onChange: onChange,
												pattern: /^[-]?\d*.?\d+$/,
											})}
										/>
										<p
											className={`error-message ${
												errors["rejected"]
													?.type ===
												"required"
													? "showError"
													: ""
											}`}
										>
											Campo requerido
										</p>
										<p
											className={`error-message ${
												errors["rejected"]
													?.type === "pattern"
													? "showError"
													: ""
											}`}
										>
											Solo se permite numeros
										</p>
									</Form.Group>
								</div>
								{/* total */}
								<Form.Group className="mb-3 text-center w-100">
									<i className="fa-brands fa-stack-overflow bx-fw"></i>
									<Form.Label
										className="mb-2"
										style={{
											fontSize: "12px",
										}}
									>
										Total
									</Form.Label>
									<Form.Control
										value={total}
										placeholder="$"
										className="w-100 text-center border-danger"
										style={{
											fontSize: "12px",
										}}
										{...register("total", {
											required: true,
											onChange: onChange,
											pattern: /^[-]?\d*.?\d+$/,
										})}
									/>
									<p
										className={`error-message ${
											errors["total"]?.type ===
											"required"
												? "showError"
												: ""
										}`}
									>
										Campo requerido
									</p>
									<p
										className={`error-message ${
											errors["total"]?.type ===
											"pattern"
												? "showError"
												: ""
										}`}
									>
										Solo se permite numeros
									</p>
								</Form.Group>

								{/* Detalle adicional */}
								<Form.Group className="mb-3 text-center w-100">
									<i className="fa-solid fa-circle-info bx-fw"></i>
									<Form.Label
										className="mb-2"
										style={{
											fontSize: "12px",
										}}
									>
										Detalles adicionales
									</Form.Label>
									<Form.Control
										className="w-100 text-center"
										style={{
											fontSize: "12px",
										}}
										{...register("detail")}
									/>
								</Form.Group>
								{/* <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Button style={{ borderBottomLeftRadius: "0", borderBottomRightRadius: "0" }} variant="outline-danger" onClick={resetAction}>
                                        Limpiar
                                    </Button>
                                    <Button style={{ borderTopLeftRadius: "0", borderTopRightRadius: "0" }} variant="outline-success" type="submit" onClick={handleSubmit(onSubmit)}>
                                        Grabar
                                    </Button>
                                </div> */}
							</Form>
						</div>
						<div
							style={{
								border: "2px solid var(--first-color)",
								padding: "1rem",
								borderRadius: "5px",
							}}
						>
							<h5>Registro</h5>
							<span style={{ fontSize: "12px" }}>
								Registre los productos que se quedaran en el
								camion.
							</span>
							<div>
								<TableInvoice
									data={listInoviceNewView}
									delInvo={deleteInvoice}
									createInvo={newInvoice}
									transaccionPay={() => {}}
								/>
								{/* data, updateInvo, delInvo, createInvo, transaccionPay, onviewpay, setItemSelect  */}
							</div>
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>

					<Button
						variant="outline-danger"
						onClick={() => {
							resetAction();
						}}
					>
						Limpiar
					</Button>
					<Button
						variant="outline-success"
						type="submit"
						onClick={handleSubmit(onSubmit)}
					>
						Grabar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default ProductReturn;
