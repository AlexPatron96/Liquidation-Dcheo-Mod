import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { postSellerthunk } from "../../store/slices/seller.slice";
import { getRoutethunk } from "../../store/slices/dataTemp.slice";
import Swal from "sweetalert2";

const CreateSeller = (props) => {
	const dispatch = useDispatch();

	useEffect(() => {
		routeDay[0] ? null : dispatch(getRoutethunk());
	}, []);

	const routeDay = useSelector((state) => state.routeDay);
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const listDB = ["code", "name", "isActive", "id_route", "max_fact"];
	const route = useSelector((state) => state.temporary);

	const onSubmit = (data) => {
		data.name = data.name.toUpperCase();
		data.code = data.code.toUpperCase();

		Swal.fire({
			title: "¿Está seguro?",
			text: "Vas a crear un nuevo Vendedor",
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Crear!",
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire(
					"Creado!",
					`El Vendedor ${data.name} a sido Creado con Exito!`,
					"success"
				);
				dispatch(postSellerthunk(data));
				reset();
				props.onHide();
				setShowSuccessModal(true);
			} else {
				Swal.fire("Cancelado!", `Se a cancelado el registro`, "info");
				reset();
				props.onHide();
				setShowSuccessModal(true);
			}
		});
	};
	return (
		<div>
			<Modal
				{...props}
				size="lg"
				aria-labelledby="contained-modal-title-vcenter"
				centered
			>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">
						Crear un Vendedor
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form
						className="formModal"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Form.Group className="mb-3">
							<Form.Label>Codigo MV</Form.Label>
							<Form.Control
								placeholder="Ejemplo: M0"
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

						<Form.Group className="mb-3">
							<Form.Label>Nombre</Form.Label>
							<Form.Control
								placeholder="Ejemplo: Edwin"
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

						<Form.Group className="mb-3">
							<Form.Label>Activo</Form.Label>
							<Form.Select
								{...register(`${listDB[2]}`, {
									required: true,
								})}
							>
								<option value={true}>Si</option>
								<option value={false}>No</option>
							</Form.Select>
							<p
								className={`error-message ${
									errors[listDB[2]] ? "showError" : ""
								}`}
							>
								Este campo es requerido
							</p>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Ruta</Form.Label>
							<Form.Select
								{...register(`${listDB[3]}`, {
									required: true,
								})}
							>
								{route.map((rou, index) => (
									<option
										key={index}
										value={parseInt(rou.id)}
									>
										{rou.external_code} - {rou.name}
									</option>
								))}
							</Form.Select>
							<p
								className={`error-message ${
									errors[listDB[3]] ? "showError" : ""
								}`}
							>
								Este campo es requerido
							</p>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>
								Total Maximo de Credito Permitido
							</Form.Label>
							<Form.Control
								placeholder="Ejemplo: 20000"
								{...register(`${listDB[4]}`, {
									required: true,
									pattern: /^[-]?\d*.?\d+$/,
								})}
							/>
							<p
								className={`error-message ${
									errors[listDB[4]] ? "showError" : ""
								}`}
							>
								En este campo solo se pueden ingresar
								numeros.
							</p>
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={props.onHide}>Cerrar</Button>

					<Button
						variant="success"
						type="submit"
						onClick={handleSubmit(onSubmit)}
					>
						Guardar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default CreateSeller;
