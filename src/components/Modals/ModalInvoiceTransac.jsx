import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { useForm } from "react-hook-form";
import date from "../../utils/date";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { postTransactionthunk } from "../../store/slices/transaccion.slice";
import Buttonatom from "../atom/Buttonatom";

const ModalInvoiceTransac = ({ onhide, show, itemSelect }) => {
	const dispatch = useDispatch();
	const userLiquidador = useSelector((state) => state.userLoged);
	const invoice = useSelector((state) => state.invoice);
	const invoiceNew = useSelector((state) => state.transaction);
	// console.log(itemSelect);
	const initialValueTransaccion = {
		id_bill: "id",
		num_bill: "num_bill",
		balance_date: date.Currendate(),
		pay: 0,
		id_user: "Usuario",
		detail: "",
	};
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: initialValueTransaccion,
	});

	const payIfItExists = () => {
		itemSelect?.active === true
			? setValue("id_bill", itemSelect?.item.id)
			: setValue("id_bill", invoiceNew?.id);
		itemSelect?.active === true
			? setValue("num_bill", itemSelect?.item.num_bill)
			: setValue("num_bill", invoiceNew?.num_bill);
		setValue("balance_date", date.Currendate());
		setValue("pay", 0);
		setValue("id_user", userLiquidador?.id);
		setValue("detail", "");
	};

	useEffect(() => {
		payIfItExists();
	}, [show]);

	const [editValue, setEditValue] = useState(true);
	const EditTransaction = () => {
		if (editValue) {
			setEditValue(false);
		} else {
			setEditValue(true);
		}
	};

	const onSubmit = (data) => {
		if (
			data.pay <= 0 ||
			(itemSelect?.active
				? data.pay > itemSelect?.item.balance
				: data.pay > invoice?.[0].balance)
		) {
			Swal.fire({
				icon: "warning",
				title: "Error!",
				text: "No puedes realizar pagos mayores al adeudado o en Cero",
				showConfirmButton: false,
				timer: 1500,
			});
		} else {
			Swal.fire({
				title: "¿Está seguro?",
				text: "Deseas Guardar transaccion realizada",
				icon: "question",
				showCancelButton: true,
				confirmButtonColor: "#029C63",
				cancelButtonColor: "#d33",
				confirmButtonText: "Si, Guardar!",
				reverseButtons: true,
			}).then((result) => {
				if (result.isConfirmed) {
					Swal.fire({
						icon: "success",
						title: "Guardado!",
						text: `Se a guardado el Pago de $ ${data.pay}!`,
						showConfirmButton: false,
						timer: 1000,
					});
					dispatch(postTransactionthunk(data));
					setEditValue(true);
					reset(initialValueTransaccion);
					onhide();
				} else {
					Swal.fire({
						icon: "warning",
						title: "Cancelado!",
						text: "Se a cancelado el registro",
						showConfirmButton: false,
						timer: 1000,
					});
					reset(initialValueTransaccion);
					onhide();
				}
			});
		}
	};

	return (
		<div>
			<Modal
				show={show}
				onHide={onhide}
				centered
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
			>
				<Modal.Header>
					<Modal.Title id="contained-modal-title-vcenter">
						Transaccion
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div
						className="d-flex flex-column mb-4"
						// style={{
						// 	display: "flex",
						// 	justifyContent: "space-between",
						// }}
					>
						<h5>Realize el pago total o abono</h5>
						<span style={{ fontSize: "13px" }}>
							Cliente:
							{itemSelect?.active === true
								? itemSelect.item?.client?.fullname
								: invoiceNew?.id_client}
						</span>
						<span style={{ fontSize: "14px" }}>
							Saldo Anterior: $
							{itemSelect?.active === true
								? itemSelect.item?.balance
								: invoiceNew?.balance}
						</span>
					</div>

					<Form
						className="d-flex flex-lg-wrap gap-3 flex-wrap"
						onSubmit={handleSubmit(onSubmit)}
					>
						{/* Identificador de Factura */}
						<Form.Group className="mb-3">
							<Form.Label>Id Factura</Form.Label>
							<Form.Control
								// className="w-100"
								disabled={editValue}
								style={{ width: "70px" }}
								{...register("id_bill", { required: true })}
							/>
							<p
								className={`error-message ${
									errors["id_bill"] ? "showError" : ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Numero de Factura */}
						<Form.Group className="mb-3">
							<Form.Label># Factura</Form.Label>
							<Form.Control
								disabled={editValue}
								style={{ width: "190px" }}
								{...register("num_bill", { required: true })}
							/>
							<p
								className={`error-message ${
									errors["num_bill"] ? "showError" : ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Fecha de la transaccion*/}
						<Form.Group className="mb-3">
							<Form.Label>Fecha De Transaccion</Form.Label>
							<Form.Control
								disabled={editValue}
								type="date"
								{...register("balance_date", {
									required: true,
								})}
							/>
							<p
								className={`error-message ${
									errors["balance_date"]
										? "showError"
										: ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Valor */}
						<Form.Group className="mb-3">
							<Form.Label>Valor $</Form.Label>
							<Form.Control
								style={{ width: "80px", borderColor: "red" }}
								{...register("pay", {
									required: true,
									pattern: /^[-]?\d*.?\d+$/,
								})}
							/>
							<p
								className={`error-message ${
									errors["pay"] ? "showError" : ""
								}`}
							>
								Solo se permiten números en este campo.
							</p>
						</Form.Group>

						{/* Usuario */}
						<Form.Group className="mb-3">
							<Form.Label>Liquidador</Form.Label>
							<Form.Control
								disabled={editValue}
								style={{ width: "75px" }}
								{...register("id_user", { required: true })}
							/>
							<p
								className={`error-message ${
									errors["id_user"] ? "showError" : ""
								}`}
							>
								Campo requerido
							</p>
						</Form.Group>

						{/* Detalle */}
						<Form.Group className="mb-3 w-100">
							<Form.Label>Detalle adicional</Form.Label>
							<Form.Control
								placeholder="Ingrese informacion sobre el pago."
								// style={{ width: "700px" }}
								{...register("detail", { required: false })}
							/>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					{/* <Buttonatom created={""}
                        title={"Imprimir"} color={"light"} ico={"fa-print"} /> */}

					<Buttonatom
						created={EditTransaction}
						title={"Editar"}
						color={"primary"}
						ico={"fa-pen-to-square"}
					/>

					<Buttonatom
						created={onhide}
						title={"Cerrar"}
						color={"warning"}
						ico={"fa-door-closed"}
					/>

					<Buttonatom
						isTrueOfElse={
							!userLiquidador.roll?.permissions
								?.edited_seller_maxtotal
						}
						created={handleSubmit(onSubmit)}
						title={"Pagar"}
						color={"success"}
						ico={"fa-dollar-sign"}
					/>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default ModalInvoiceTransac;
