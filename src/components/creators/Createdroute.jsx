import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import {
	deleteRoutethunk,
	getRoutethunk,
	newRoutethunk,
	updateRoutethunk,
} from "../../store/slices/dataTemp.slice";
import { useDispatch, useSelector } from "react-redux";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { getRouteDayThunk } from "../../store/slices/routeday.slice";
import Createrouteday from "./Createrouteday";

const Createdroute = (props) => {
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	useEffect(() => {
		route[0] ? null : dispatch(getRoutethunk());
	}, []);

	const userLoged = useSelector((state) => state.userLoged);
	const route = useSelector((state) => state.temporary);

	const onSubmitRoute = (data) => {
		Swal.fire({
			title: "Creado!",
			text: `creaste una nueva ruta: ${data.name}`,
			icon: "success",
			showConfirmButton: false,
			timer: 1000,
		});
		data.name = data.name.toUpperCase();
		data.external_code = data.external_code.toUpperCase();
		dispatch(newRoutethunk(data));
		reset();
	};

	const [editingIndex, setEditingIndex] = useState(null);
	const [editedData, setEditedData] = useState([]);
	const [id, setId] = useState(0);

	const handleEdit = (index, obj) => {
		//console.log(obj);
		setEditingIndex(index);
		setEditedData(obj);
		setId(obj.id);
	};

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setEditedData({ ...editedData, [name]: value });
		//console.log(editedData);
	};

	const handleSave = (index) => {
		Swal.fire({
			title: "¿Está seguro?",
			text: `Estas editando la ruta ${editedData.name}, deseas guardar los cambios.`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#029C63",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, deseo guardar!",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: "Guardado!",
					text: `Se ah actualizado la ruta ${editedData.name}.`,
					icon: "success",
					showConfirmButton: false,
					timer: 1000,
				});
				dispatch(updateRoutethunk(id, editedData));
				setEditingIndex(null);
				setEditedData({});
			}
		});
	};

	const handleDelete = () => {
		Swal.fire({
			title: "¿Está seguro?",
			text: `Estas eliminando el item ${editedData.name}, deseas eliminarlo.`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#029C63",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, deseo Eliminar!",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire({
					title: "Eliminado!",
					text: `Se ah eliminado con exito.  ${editedData.name}.`,
					icon: "success",
					showConfirmButton: false,
					timer: 1000,
				});
				dispatch(deleteRoutethunk(id));
				setEditingIndex(null);
				setEditedData({});
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
						Zonas y rutas diarias
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<div className="mb-4">
							<h4>Crear Ruta</h4>
							<Form
								className="d-flex gap-2 form-create-route"
								onSubmit={handleSubmit(onSubmitRoute)}
								style={{ alignItems: "center" }}
							>
								<Form.Group className="mb-2 w-100">
									<Form.Label
										style={{ fontSize: "14px" }}
									>
										Nombre
									</Form.Label>
									<Form.Control
										style={{
											fontSize: "14px",
											padding: "0.5rem",
										}}
										placeholder="Nombre de la ruta"
										onChange={(e) =>
											(e.target.value =
												e.target.value.toUpperCase())
										}
										{...register(`name`, {
											required: true,
										})}
									/>
									<p
										className={`error-message ${
											errors["name"]
												? "showError"
												: ""
										}`}
									>
										Este campo es requerido
									</p>
								</Form.Group>

								<Form.Group className="mb-2 w-100">
									<Form.Label
										style={{ fontSize: "14px" }}
									>
										Codigo MV
									</Form.Label>
									<Form.Control
										style={{
											fontSize: "14px",
											padding: "0.5rem",
										}}
										placeholder="Codigo MobilVendor"
										onChange={(e) =>
											(e.target.value =
												e.target.value.toUpperCase())
										}
										{...register(`external_code`, {
											required: true,
										})}
									/>
									<p
										className={`error-message ${
											errors["external_code"]
												? "showError"
												: ""
										}`}
									>
										Este campo es requerido
									</p>
								</Form.Group>

								<Form.Group className="mb-2 w-100">
									<Form.Label
										style={{ fontSize: "14px" }}
									>
										Detalle adicional
									</Form.Label>
									<Form.Control
										style={{
											fontSize: "14px",
											padding: "0.5rem",
										}}
										placeholder="Detalle relevante"
										{...register(`detail`, {
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
										En caso de no tener un detalle
										adicional coloque " ok "
									</p>
								</Form.Group>

								<Button
									disabled={
										!userLoged?.roll?.permissions
											?.create_vehicle
									}
									variant="success"
									type="submit"
									style={{ height: "50px" }}
									onClick={handleSubmit(onSubmitRoute)}
								>
									Guardar
								</Button>
							</Form>
						</div>
						<div className="mb-4">
							<h4>Lista de Rutas</h4>
							<div className="tables-view">
								<Table
									striped
									bordered
									hover
									size="sm"
									responsive
								>
									<thead>
										<tr>
											<th>#</th>
											<th>id</th>
											<th>Nombre</th>
											<th>Cod MV</th>
											<th>Detalle Ad</th>
											<th>Accion</th>
										</tr>
									</thead>

									<tbody>
										{route.map((rou, index) => (
											<tr key={index}>
												<td
													style={{
														width: "10px",
													}}
												>
													{index + 1}
												</td>

												{editingIndex ===
												index ? (
													<td
														style={{
															textAlign:
																"center",
														}}
													>
														<input
															style={{
																width: "40px",
															}}
															className="form-control form-control-sm"
															name="id"
															disabled
															onChange={
																handleInputChange
															}
															value={
																editedData.id
															}
														/>
													</td>
												) : (
													<td
														style={{
															width: "40px",
														}}
													>
														{rou.id}
													</td>
												)}

												{editingIndex ===
												index ? (
													<td
														style={{
															textAlign:
																"center",
														}}
													>
														<input
															style={{
																width: "120px",
															}}
															className="form-control form-control-sm"
															name="name"
															onChange={
																handleInputChange
															}
															value={
																editedData.name
															}
														/>
													</td>
												) : (
													<td
														style={{
															width: "120px",
														}}
													>
														{rou.name}
													</td>
												)}

												{editingIndex ===
												index ? (
													<td
														style={{
															textAlign:
																"center",
														}}
													>
														<input
															style={{
																width: "70px",
															}}
															className="form-control form-control-sm"
															name="external_code"
															onChange={
																handleInputChange
															}
															value={
																editedData.external_code
															}
														/>
													</td>
												) : (
													<td
														style={{
															width: "70px",
														}}
													>
														{
															rou.external_code
														}
													</td>
												)}

												{editingIndex ===
												index ? (
													<td
														style={{
															textAlign:
																"center",
														}}
													>
														<input
															style={{
																width: "175px",
															}}
															className="form-control form-control-sm"
															name="detail"
															onChange={
																handleInputChange
															}
															value={
																editedData.detail
															}
														/>
													</td>
												) : (
													<td
														style={{
															width: "175px",
														}}
													>
														{rou.detail}
													</td>
												)}
												<td
													className="tdBtn"
													style={{
														maxWidth:
															"170px",
													}}
												>
													{editingIndex ===
													index ? (
														<>
															<button
																disabled={
																	!userLoged
																		?.roll
																		.permissions
																		?.create_vehicle
																}
																type="button"
																className="btn btn-success btn-actions"
																onClick={() =>
																	handleSave(
																		index
																	)
																}
															>
																<i className="fa-solid fa-floppy-disk bx-fw"></i>
															</button>
															<button
																disabled={
																	!userLoged
																		?.roll
																		.permissions
																		?.create_vehicle
																}
																type="button"
																className="btn btn-danger btn-actions"
																style={{
																	alignItems:
																		"center",
																}}
																onClick={() =>
																	handleDelete()
																}
															>
																<i className="fa-solid fa-trash-can bx-fw"></i>
															</button>
															<button
																disabled={
																	!userLoged
																		?.roll
																		.permissions
																		?.create_vehicle
																}
																type="button"
																className="btn btn-warning btn-actions"
																style={{
																	alignItems:
																		"center",
																}}
																onClick={() =>
																	setEditingIndex(
																		null
																	)
																}
															>
																<i className="fa-solid fa-xmark bx-fw"></i>
															</button>
														</>
													) : (
														<button
															disabled={
																!userLoged
																	?.roll
																	.permissions
																	?.create_vehicle
															}
															type="button"
															className="btn btn-primary  btn-actions"
															onClick={() =>
																handleEdit(
																	index,
																	rou
																)
															}
														>
															<i className="fa-solid fa-pen-to-square bx-fw"></i>
														</button>
													)}
												</td>
											</tr>
										))}
									</tbody>
								</Table>
							</div>
						</div>
					</div>

					<div>
						<h4>Dias Asignados a rutas</h4>
						<Createrouteday />
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={props.onHide}>Cerrar</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Createdroute;
