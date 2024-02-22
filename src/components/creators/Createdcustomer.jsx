import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { postCustomerthunk } from "../../store/slices/customer.slice";
import { getSellerThunk } from "../../store/slices/seller.slice";
import { getRouteDayThunk } from "../../store/slices/routeday.slice";
import Swal from "sweetalert2";

const Createdcustomer = (props) => {
	const dispatch = useDispatch();
	useEffect(() => {
		sellers[0] ? null : dispatch(getSellerThunk());
		routeDay[0] ? null : dispatch(getRouteDayThunk());
	}, []);
	const routeDay = useSelector((state) => state.routeDay);
	const sellers = useSelector((state) => state.seller);

	const listShow = [
		"Nombre",
		"Codigo MV",
		"Direccion",
		"Identificacion",
		"Vendedor",
		"Dia de Venta",
	];
	const listDB = [
		"fullname",
		"code_external",
		"address",
		"dni",
		"id_seller",
		"id_route_day",
	];

	const [showSuccessModal, setShowSuccessModal] = useState(false);
	const {
		register,
		handleSubmit,
		reset,
		getValues,
		formState: { errors },
	} = useForm();

	const [selectedOption, setSelectedOption] = useState("Cédula");

	const onSubmit = (data) => {
		data.fullname = data.fullname.toUpperCase();
		Swal.fire({
			title: "¿Está seguro?",
			text: "Esta creando un nuevo Cliente",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#029C63",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Crear!",
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire(
					"Creado!",
					`Se a creado con exito el cliente ${data.fullname}!`,
					"success"
				);
				dispatch(postCustomerthunk(data));
				reset();
				props.onHide();
			} else {
				Swal.fire("Cancelado!", `Se a cancelado el registro`, "info");
				reset();
				props.onHide();
			}
		});
	};

	const [selectSeller, setSelectSeller] = useState("");
	const sellerCode = (sellerRecept) => {
		//console.log(sellers);
		const result = sellers.filter(
			(sell) => sell.id === parseInt(sellerRecept)
		);
		//console.log(result);
		const datos = routeDay?.filter(
			(rouD) =>
				rouD?.id_route_route?.external_code?.toString() ===
				// result[0]?.code?.toString() ||
				result[0]?.route?.external_code
		);
		//console.log(datos);
		// return result[0]?.code
		return datos;
	};
	const onchangeSeller = (e) => {
		setSelectSeller(e.target.value);
		//console.log(e.target.value);
	};
	return (
		<div>
			<Modal
				{...props}
				size="md"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						Nuevo Cliente
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form
						className="formModal"
						onSubmit={handleSubmit(onSubmit)}
					>
						{/* Nombre completo */}
						<Form.Group className="mb-3">
							<Form.Label>{listShow[0]}</Form.Label>
							<Form.Control
								{...register(`${listDB[0]}`, {
									required: true,
								})}
							/>
							<p
								className={`error-message ${
									errors[listDB[0]] ? "showError" : ""
								}`}
							>
								Este campo es requerido
							</p>
						</Form.Group>

						{/* Codigo Externo */}
						<Form.Group className="mb-3">
							<Form.Label>{listShow[1]}</Form.Label>
							<Form.Control
								{...register(`${listDB[1]}`, {
									required: true,
								})}
							/>
							<p
								className={`error-message ${
									errors[listDB[1]] ? "showError" : ""
								}`}
							>
								Este campo es requerido
							</p>
						</Form.Group>

						{/* Direccion */}
						<Form.Group className="mb-3">
							<Form.Label>{listShow[2]}</Form.Label>
							<Form.Control
								{...register(`${listDB[2]}`, {
									required: true,
								})}
							/>
							<p
								className={`error-message ${
									errors[listDB[2]] ? "showError" : ""
								}`}
							>
								Este campo es requerido
							</p>
						</Form.Group>

						{/* Identificacion */}
						<Form.Group className="mb-3">
							<div>
								<Form.Label>{listShow[3]}</Form.Label>
								<div
									style={{
										display: "flex",
										flexDirection: "row",
									}}
								>
									<select
										className="form-select"
										style={{
											padding: "5px",
											width: "90px",
											backgroundPosition:
												"right 0.1rem center",
											fontSize: "13px",
										}}
										value={selectedOption}
										onChange={(e) =>
											setSelectedOption(
												e.target.value
											)
										}
									>
										<option value="Cédula">
											Cédula
										</option>
										<option value="RUC">RUC</option>
									</select>
									<Form.Control
										className="hide-number-arrows"
										type="number"
										style={{ fontSize: "14px" }}
										{...register(`${listDB[3]}`, {
											required: true,
											minLength:
												selectedOption ===
												"Cédula"
													? 10
													: 13,
											maxLength:
												selectedOption === "RUC"
													? 13
													: 10,
										})}
										inputMode="numeric"
									/>
								</div>
								<p
									className={`error-message ${
										errors[listDB[3]]
											? "showError"
											: ""
									}`}
								>
									{`${
										errors[listDB[3]]?.type ===
										"minLength"
											? "Alert! Hay menos digitos"
											: ""
									}`}
									{`${
										errors[listDB[3]]?.type ===
										"maxLength"
											? "Alert! Hay mas digitos"
											: ""
									}`}
								</p>
							</div>
						</Form.Group>

						{/* Vendedor */}
						<Form.Group className="mb-3">
							<Form.Label>{listShow[4]}</Form.Label>
							<Form.Select
								{...register(`${listDB[4]}`, {
									required: true,
									onChange: onchangeSeller,
								})}
								style={{ fontSize: "14px" }}
							>
								<option>Seleccione Vendedor</option>
								{sellers?.map((seller, index) => (
									<option key={index} value={seller.id}>
										{seller.code} - {seller.name}
									</option>
								))}
							</Form.Select>
							<p
								className={`error-message ${
									errors[listDB[4]] ? "showError" : ""
								}`}
							>
								Este campo es requerido
							</p>
						</Form.Group>

						{/* Routa Day */}

						<Form.Group className="mb-3">
							<Form.Label>{listShow[5]}</Form.Label>
							<Form.Select
								{...register(`${listDB[5]}`, {
									required: true,
								})}
								style={{ fontSize: "14px" }}
							>
								<option>Dia de Atencion</option>
								{sellerCode(selectSeller)?.map(
									(rou, index) => (
										<option key={index} value={rou.id}>
											{
												rou.id_route_route
													?.external_code
											}{" "}
											- {rou.id_route_route?.name} -{" "}
											{rou.day?.day}
										</option>
									)
								)}
							</Form.Select>
							<p
								className={`error-message ${
									errors[listDB[5]] ? "showError" : ""
								}`}
							>
								Este campo es requerido
							</p>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					{/* <Button onClick={() => sellerCode(selectSeller)}>CLICk</Button> */}
					<Button onClick={props.onHide}>Cerrar</Button>
					<Button
						variant="success"
						type="submit"
						onClick={handleSubmit(onSubmit)}
					>
						Crear
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Createdcustomer;
