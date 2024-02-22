import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import { postVehiclethunk } from "../../store/slices/vehicles.slice";
import { getRoutethunk } from "../../store/slices/dataTemp.slice";
import Swal from "sweetalert2";

const CreateVehicle = (props) => {
	const dispatch = useDispatch();

	useEffect(() => {
		route[0] ? null : dispatch(getRoutethunk());
	}, []);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const listDB = [
		"enrollment",
		"driver",
		"dni",
		"isActive",
		"id_route",
		"cod_mv",
	];
	const route = useSelector((state) => state.temporary);

	const onSubmit = (data) => {
		data.enrollment = data.enrollment.toUpperCase();
		data.driver = data.driver.toUpperCase();
		Swal.fire({
			title: "¿Está seguro?",
			text: "Vas a crear un nuevo Vehiculo de Entrega",
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
					`El Vehiculo de entrega ${data.driver} a sido Creado con Exito!`,
					"success"
				);
				dispatch(postVehiclethunk(data));
				reset();
				props.onHide();
			} else {
				Swal.fire("Cancelado!", `Se a cancelado el registro`, "info");
				reset();
				props.onHide();
			}
		});
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
						Crear un Vehiculo de entrega
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form
						className="formModal"
						onSubmit={handleSubmit(onSubmit)}
					>
						<Form.Group className="mb-3">
							<Form.Label>Placa del vehiculo</Form.Label>
							<Form.Control
								placeholder="Ejemplo: EBA-2376"
								{...register(`${listDB[0]}`, {
									required: true,
								})}
							/>
							<p
								className={`error-message ${
									errors[listDB[0]] ? "showError" : ""
								}`}
							>
								Colocar " 0 " en casa de existir el campo.
							</p>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Conductor</Form.Label>
							<Form.Control
								placeholder="Ejemplo: Edwin Munoz"
								{...register(`${listDB[1]}`, {
									required: true,
								})}
							/>
							<p
								className={`error-message ${
									errors[listDB[1]] ? "showError" : ""
								}`}
							>
								Coloque el nombre del conductor, por favor.
							</p>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Codigo MV</Form.Label>
							<Form.Control
								placeholder="Ejemplo: M1"
								{...register(`${listDB[5]}`, {
									required: true,
								})}
							/>
							<p
								className={`error-message ${
									errors[listDB[5]] ? "showError" : ""
								}`}
							>
								Codigo de Movilvendor
							</p>
						</Form.Group>

						<Form.Group className="mb-3">
							<Form.Label>Identificacion</Form.Label>
							<Form.Control
								placeholder="Ejemplo: 0817394679"
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

						<Form.Group className="mb-3">
							<Form.Label>Activo</Form.Label>
							<Form.Select
								{...register(`${listDB[3]}`, {
									required: true,
								})}
							>
								<option value={true}>Si</option>
								<option value={false}>No</option>
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
							<Form.Label>Ruta</Form.Label>
							<Form.Select
								{...register(`${listDB[4]}`, {
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
									errors[listDB[4]] ? "showError" : ""
								}`}
							>
								Asignele una Ruta de entrega, por favor.
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

export default CreateVehicle;
