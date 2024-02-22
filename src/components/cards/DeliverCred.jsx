import React, { useEffect, useState } from "react";
import { Button, Form, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import Modal from "react-bootstrap/Modal";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const DeliverCred = ({
	codLiq,
	recepteddeliver,
	codeDeliveCrdStorage,
	typeLiquidation,
}) => {
	const initialValueTransaccion = {
		settlement_code: codLiq,
		id_seller: "Seleccion",
		sales: "",
		total: "",
		detail: "OK",
	};

	/************** */
	const [typeIsSelected, setTypeIsSelected] = useState("");
	/************** */
	const seller = useSelector((state) => state.seller);
	const deliveryCredLocalStorage = JSON.parse(
		localStorage.getItem(codeDeliveCrdStorage)
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
		deliveryCredLocalStorage ? setCredData(deliveryCredLocalStorage) : null;
	}, [codLiq]);

	// const [total, setTotal] = useState(0);
	const [formData, setFormData] = useState(new FormData());

	const onChange = (event) => {
		setValue("settlement_code", codLiq);
		const { name, value } = event.target;
		formData.set(name, value);
		setFormData(formData);
	};

	const resetAction = () => {
		reset();
		setCredData([]);
		localStorage.removeItem(codeDeliveCrdStorage);
	};

	const onSubmit = (data) => {
		if (data.id_seller === "Seleccion") {
			Swal.fire({
				icon: "warning",
				title: "Alerta",
				text: "DEBE DE SELECCIONAR UN VENDEDOR",
			});
		} else {
			data.settlement_code = codLiq;
			setCredData((prevState) => [...prevState, data]);
			reset();
		}
	};

	const [credData, setCredData] = useState([]);

	const handleAdd = () => {
		if (credData.length === 0) {
			Swal.fire({
				icon: "warning",
				title: "Alerta",
				text: "DEBE DE INGRESAR MINIMO UN REGISTRO DE LAS VENTAS Y LOS CREDITOS DE UN VENDEDOR",
			});
		} else {
			recepteddeliver(credData);
			localStorage.setItem(codeDeliveCrdStorage, JSON.stringify(credData));
			handleClose();
		}
	};

	const [showDelivery, setShowDelivery] = useState(false);

	const handleClose = () => setShowDelivery(false);
	const handleShow = () => setShowDelivery(true);
	return (
		<div>
			<Button
				variant="primary"
				onClick={handleShow}
				className="styleBtnModal"
				style={{ fontSize: "19px", fontWeight: "500" }}
			>
				<i className="fa-solid fa-credit-card bx-fw"></i>
				CREDITOS
			</Button>

			<Modal show={showDelivery} onHide={handleClose} size="md" centered>
				<Modal.Header closeButton>
					<Modal.Title>Creditos Entregados</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="">
						{/* <h5>Credito Entregado</h5> */}
						<div>
							<Form
								className="formModal"
								style={{ justifyContent: "space-between" }}
								onSubmit={handleSubmit(onSubmit)}
							>
								{/* Codigo de factura*/}
								<Form.Group
									className="mb-3"
									style={{ textAlign: "center" }}
								>
									<i className="fa-solid fa-file-invoice bx-fw"></i>
									<Form.Label
										style={{
											fontSize: "12px",
											margin: "0.5rem 0",
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
									{/* Vendedor */}
									<Form.Group className="mb-3 text-center w-100">
										<i className="fa-solid fa-user-tag bx-fw"></i>
										<Form.Label
											className="mb-2"
											style={{
												fontSize: "12px",
											}}
										>
											{" "}
											Vendedor
										</Form.Label>
										<Form.Select
											className="w-100"
											style={{
												fontSize: "12px",
											}}
											{...register("id_seller", {
												required: true,
												onChange: onChange,
											})}
										>
											<option>Seleccion</option>
											{seller.map((sell, index) => (
												<option
													key={index}
													value={sell?.id}
												>
													{sell?.code}{" "}
													{(sell?.name).substring(
														0,
														15
													)}
												</option>
											))}
										</Form.Select>
										<p
											className={`error-message ${
												errors["id_seller"]
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
												errors["id_seller"]
													?.type === "pattern"
													? "showError"
													: ""
											}`}
										>
											Solo se permite numeros
										</p>
									</Form.Group>

									{/* Ventas del vendedor */}
									<Form.Group className="mb-3 text-center w-100">
										<i className="fa-brands fa-stack-overflow bx-fw"></i>
										<Form.Label
											className="mb-2"
											style={{
												fontSize: "12px",
											}}
										>
											Total en VENTAS FACT
										</Form.Label>
										<Form.Control
											placeholder="$"
											className="w-100 text-center"
											style={{
												fontSize: "12px",
											}}
											{...register("sales", {
												required: true,
												onChange: onChange,
												pattern: /^[-]?\d*.?\d+$/,
											})}
										/>
										<p
											className={`error-message ${
												errors["sales"]?.type ===
												"required"
													? "showError"
													: ""
											}`}
										>
											Campo requerido
										</p>
										<p
											className={`error-message ${
												errors["sales"]?.type ===
												"pattern"
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
										Total CREDITO ENTREGADO
									</Form.Label>
									<Form.Control
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

								<div
									className="d-flex justify-content-center"
									// style={{
									// 	paddingTop: "1rem",
									// 	display: "flex",
									// 	gap: "0.5rem",
									// 	justifyContent: "center",
									// }}
								>
									<Button
										variant="primary"
										onClick={handleSubmit(onSubmit)}
									>
										<i className="fa-solid fa-floppy-disk bx-fw"></i>
									</Button>
								</div>
							</Form>
						</div>
					</div>
					<div className="border-top mt-2">
						<Table
							striped
							bordered
							hover
							size="sm"
							className="text-center mt-3"
							style={{ fontSize: "12px" }}
						>
							<thead>
								<tr>
									<th>Code</th>
									<th>Vendedor</th>
									<th>Venta</th>
									<th>Credito</th>
									<th>Detalle</th>
								</tr>
							</thead>
							<tbody>
								{credData?.map((check, index) => (
									<tr key={index}>
										<td>{check?.settlement_code}</td>
										<td>
											{
												seller.filter(
													(sell) =>
														sell.id ===
														parseInt(
															check?.id_seller
														)
												)[0]?.name
											}
										</td>
										<td>
											${" "}
											{parseFloat(
												check?.sales
											).toFixed(2)}
										</td>
										<td>
											${" "}
											{parseFloat(
												check?.total
											).toFixed(2)}
										</td>
										<td>{check?.detail}</td>
									</tr>
								))}
							</tbody>
						</Table>
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
						onClick={() => handleAdd()}
					>
						Grabar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default DeliverCred;
