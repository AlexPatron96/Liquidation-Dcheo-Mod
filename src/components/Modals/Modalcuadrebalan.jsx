import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { useForm } from "react-hook-form";
import date from "../../utils/date";
import Swal from "sweetalert2";
import ModalInvoiceTransac from "./ModalInvoiceTransac";
import { useDispatch, useSelector } from "react-redux";
import { postVehicleCuadrethunk } from "../../store/slices/vehicles.slice";
import { postSellCuadrethunk } from "../../store/slices/seller.slice";

const Modalcuadrebalan = ({ onHide, show, data, tipo }) => {
	const dispatch = useDispatch();

	const itemSelect = data;
	//console.log(itemSelect);
	const userLoged = useSelector((state) => state.userLoged);

	const cuadres =
		tipo === "veh"
			? itemSelect?.balance_veh?.cuadre_balance_vehs
			: itemSelect?.balance_sell?.cuadre_balance_sellers;

	const initialValueTransaccion = {
		id_balance: "",
		value: "",
		detail: "",
	};

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		setValue,
		getValues,
	} = useForm({
		defaultValues: initialValueTransaccion,
	});

	const [viewActualizarBal, setViewActualizarBal] = useState(false);
	const newCuadreBalance = () => {
		setValue(
			"id_balance",
			tipo === "veh"
				? itemSelect?.balance_veh?.id
				: itemSelect?.balance_sell?.id
		);
		setViewActualizarBal(true);
	};

	const onSubmit = (item) => {
		item.value = parseFloat(item.value).toFixed(2);
		Swal.fire({
			title: "¿Está seguro?",
			text: "¡No podrás revertir, ni eliminar esto!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Generar cuadre",
		}).then((result) => {
			if (result.isConfirmed) {
				if (item.id_balance === "" && item.value === "") {
					Swal.fire({
						icon: "warning",
						title: "Error!",
						text: "DEBE LLENAR LOS CAMPOS NECESARIOS PARA GENERAR EL CUADRE",
						showConfirmButton: false,
						timer: 1500,
					});
				} else {
					tipo === "veh"
						? dispatch(postVehicleCuadrethunk(item))
						: dispatch(postSellCuadrethunk(item));
					reset(initialValueTransaccion);
					setViewActualizarBal(false);
					Swal.fire({
						icon: "success",
						title: "Guardado!",
						text: `Se a Generado el Cuadre de balance por el valor de  $ ${item.value}.  
                        Para ver los cambios se cerrara la ventana.`,
						showConfirmButton: true,
						confirmButtonText: "OK",
						confirmButtonColor: "#3085d6",
					}).then((result) => {
						if (result.isConfirmed) {
							onHide();
						}
					});
				}
			}
		});
	};

	return (
		<div>
			<Modal
				show={show}
				onHide={onHide}
				centered
				size="xl"
				aria-labelledby="contained-modal-title-vcenter"
			>
				<Modal.Header>
					<Modal.Title id="contained-modal-title-vcenter">
						CUADRE DE BALANCE
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="modalBodySecSuperior">
						<h5 className="modalTextTitle">
							{tipo === "veh" ? "Vehiculo" : "Vendedor"}
							<span>
								{" Cod Interno: "}
								{itemSelect?.id}
							</span>
						</h5>
						{tipo === "veh" ? (
							<div className="modalViewOrder">
								<div>
									<span className="modalTextTitle">
										Conductor:
									</span>
									<h6 className="modalTextSubtitle">
										{itemSelect?.driver}
									</h6>
								</div>
								<div>
									<span className="modalTextTitle">
										Cedula O RUC:
									</span>
									<h6 className="modalTextSubtitle">
										{itemSelect?.dni}
									</h6>
								</div>
								<div>
									<span className="modalTextTitle">
										Placa de Vehiculo:
									</span>
									<h6 className="modalTextSubtitle">
										{itemSelect?.enrollment}
									</h6>
								</div>
								<div>
									<span className="modalTextTitle">
										Estado:
									</span>
									<h6 className="modalTextSubtitle">
										{itemSelect?.isActive === true
											? "ACTIVO"
											: "INACTIVO"}
									</h6>
								</div>
								<div>
									<span>BALANCE:</span>
									<h6
										style={{
											fontSize: "25px",
											borderRadius: "8px",
											padding: "0.25rem",
										}}
										className={
											parseFloat(
												itemSelect?.balance_veh
													?.total
											) > 0
												? "dateYellow"
												: parseFloat(
														itemSelect
															?.balance_veh
															?.total
												  ) < 0
												? "dateRed"
												: "dateGreen"
										}
									>
										${" "}
										{parseFloat(
											itemSelect?.balance_veh?.total
										).toFixed(2)}
									</h6>
								</div>
							</div>
						) : (
							<div className="modalViewOrder">
								<div>
									<span className="modalTextTitle">
										Cod MovilVendor:
									</span>
									<h6 className="modalTextSubtitle">
										{itemSelect?.code}
									</h6>
								</div>
								<div>
									<span className="modalTextTitle">
										Nombre:
									</span>
									<h6 className="modalTextSubtitle">
										{itemSelect?.name}
									</h6>
								</div>
								<div>
									<span className="modalTextTitle">
										Ruta:
									</span>
									<h6 className="modalTextSubtitle">
										{itemSelect?.route?.name}
									</h6>
								</div>
								<div>
									<span className="modalTextTitle">
										Estado:
									</span>
									<h6 className="modalTextSubtitle">
										{itemSelect?.isActive === true
											? "ACTIVO"
											: "INACTIVO"}
									</h6>
								</div>
								<div>
									<span className="modalTextTitle">
										BALANCE:
									</span>
									<h6
										className={
											itemSelect?.balance_sell
												?.total > 0
												? "dateYellow modalTexTitleGrd"
												: itemSelect
														?.balance_sell
														?.total < 0
												? "dateRed modalTexTitleGrd"
												: "dateGreen modalTexTitleGrd"
										}
									>
										${" "}
										{parseFloat(
											itemSelect?.balance_sell
												?.total
										).toFixed(2)}
									</h6>
								</div>
							</div>
						)}
					</div>

					<div className="modalBalanCardExt">
						<h5>Actualizacion de Balances Realizados</h5>

						<div className="modalBalanCardCont">
							{cuadres?.length > 0
								? null
								: "Aun No hay Registros"}
							{cuadres?.map((trans, index) => (
								<div
									key={index}
									className="modalBalanCardBorder"
									style={{
										border: `2px solid var(--${
											parseFloat(
												trans?.value
											).toFixed(2) < 0
												? "color3"
												: "color2"
										})`,
									}}
								>
									<span>#{index + 1}</span>
									<div className="modalBalanCardInter">
										<div>
											<span className="modalTextTitle">
												Codigo
											</span>
											<h6>{trans?.id}</h6>
										</div>
										<div>
											<span className="modalTextTitle">
												Fecha:
											</span>
											<h6>
												{date.convertirFechaUTCaLocal(
													trans?.createdAt
												)}
											</h6>
										</div>
										<div>
											<span className="modalTextTitle">
												Valor:
											</span>
											<h6>
												${" "}
												{parseFloat(
													trans?.value
												).toFixed(2)}
											</h6>
										</div>
										<div
											style={{
												borderTop:
													"2px solid var(--color6)",
												width: "100%",
											}}
										>
											<h6 className="modalTextTitle">
												Detalle:
											</h6>
											<span>{trans?.detail}</span>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
					{viewActualizarBal ? (
						<div className="modalBalanActSup">
							<h5>Actualizar Balance</h5>
							<div className="modalBalanActBod">
								<Form
									className="formModal"
									onSubmit={handleSubmit(onSubmit)}
								>
									{/* ID Balance */}
									<Form.Group className="mb-3 modalBalanActBodFormOrd">
										<Form.Label>
											Cod. Int Balance
										</Form.Label>
										<Form.Control
											style={{ width: "70px" }}
											{...register("id_balance", {
												required: true,
											})}
											readOnly
										/>
										<p
											className={`error-message ${
												errors["id_balance"]
													? "showError"
													: ""
											}`}
										>
											Campo requerido
										</p>
									</Form.Group>

									{/* Valor */}
									<Form.Group className="mb-3 modalBalanActBodFormOrd">
										<Form.Label>Valor $</Form.Label>
										<Form.Control
											style={{
												width: "100px",
												borderColor: "red",
											}}
											{...register("value", {
												required: true,
												pattern: /^[-]?\d*.?\d+$/,
											})}
										/>
										<p
											className={`error-message ${
												errors["value"]?.type ===
												"required"
													? "showError"
													: ""
											}`}
										>
											Campo requerido
										</p>
										<p
											className={`error-message ${
												errors["value"]?.type ===
												"pattern"
													? "showError"
													: ""
											}`}
										>
											Solo se permite numeros
										</p>
									</Form.Group>

									{/* Detalle */}
									<Form.Group className="mb-3 modalBalanActBodFormOrd">
										<Form.Label>
											Detalle de la Actualizacion
										</Form.Label>
										<Form.Control
											placeholder="Por que actualiza el Balance"
											style={{ width: "300px" }}
											{...register("detail", {
												required: true,
											})}
										/>
										<p
											className={`error-message ${
												errors["detail"]
													? "showError"
													: ""
											}`}
										>
											Campo requerido
										</p>
									</Form.Group>

									<Button
										variant="success"
										type="submit"
										onClick={handleSubmit(onSubmit)}
									>
										Generar
									</Button>
								</Form>
							</div>
							<div style={{ textAlign: "center" }}>
								<h6>
									Nota:{" "}
									<span style={{ fontWeight: "100" }}>
										Despues de creado no se puede
										eliminar.
									</span>
								</h6>
							</div>
						</div>
					) : null}
				</Modal.Body>
				<Modal.Footer>
					<Button
						disabled={
							!userLoged?.roll?.permissions
								?.edited_seller_maxtotal
						}
						variant="success"
						type="submit"
						onClick={() => {
							newCuadreBalance();
						}}
					>
						<i className="fa-solid fa-dollar-sign bx-fw"></i>
						Cuadre
					</Button>
					<Button
						onClick={() => {
							onHide();
							setViewActualizarBal(false);
						}}
					>
						Cerrar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Modalcuadrebalan;
