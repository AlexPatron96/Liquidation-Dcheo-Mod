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
import {
	delRouteDayThunk,
	getRouteDayThunk,
	newRouteDayThunk,
	upRouteDayThunk,
} from "../../store/slices/routeday.slice";

const Createrouteday = () => {
	const dispatch = useDispatch();

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm();

	const [dayList, setDayList] = useState([
		{ id: 1, day: "Lunes" },
		{ id: 2, day: "Martes" },
		{ id: 3, day: "Miercoles" },
		{ id: 4, day: "jueves" },
		{ id: 5, day: "Viernes" },
		{ id: 6, day: "Sabado" },
		{ id: 7, day: "Domingo" },
		{ id: 8, day: "Todos" },
	]);

	useEffect(() => {
		routeDay[0] ? null : dispatch(getRouteDayThunk());
	}, []);
	const route = useSelector((state) => state.temporary);
	const routeDay = useSelector((state) => state.routeDay);
	const userLoged = useSelector((state) => state.userLoged);

	const idsRouteDay = Object.values(routeDay).map((rutCol) => rutCol.id_route);
	const idsRoutes = Object.values(route).map((rutCol) => rutCol.id);
	const colorRouteDay = [
		"#FFCCE5",
		"#FFFFCC",
		"#B2FFFF",
		"#BDFCC9",
		"#DCB3FF",
		"#FFE5B4",
		"#F5F5DC",
		"#B2D8FF",
		"#F5F5DC",
		"#F7C6B3",
		"#C1B1E1",
		"#D4B2D8",
		"#FFFFCC",
		"#B2FFFF",
		"#FFE5B4",
		"#F5F5DC",
		"#B2D8FF",
		"#F5F5DC",
		"#F7C6B3",
		"#C1B1E1",
	];

	const onSubmitRouteDay = (data) => {
		if (
			data.day_id.toUpperCase() === "SELECCIONE" ||
			data.id_route.toUpperCase() === "SELECCIONE"
		) {
			Swal.fire(
				"Error",
				`No estas cargando ninguna informacion Revisa en los campos`,
				"error"
			);
		} else {
			// Swal.fire('Correcto!', `Asignaste un nuevo dia a una Ruta`, 'success')
			Swal.fire({
				title: "Creado!",
				text: `Asignaste un nuevo dia a una Ruta`,
				icon: "success",
				showConfirmButton: false,
				timer: 1000,
			});
			dispatch(newRouteDayThunk(data));
			reset();
		}
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
			text: `Estas editando el dia asignado a una ruta (${editedData.id}), deseas guardar los cambios.`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#029C63",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, deseo guardar!",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire(
					"Guardado!",
					`Se ah actualizado el dia asignado a una ruta ${editedData.id}.`,
					"success"
				);
				dispatch(upRouteDayThunk(id, editedData));
				setEditingIndex(null);
				setEditedData({});
			}
		});
	};

	const handleDelete = () => {
		Swal.fire({
			title: "¿Está seguro?",
			text: `Estas eliminando el item ${editedData.id}, deseas eliminarlo.`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#029C63",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, deseo Eliminar!",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire(
					"Eliminado!",
					`Se ah eliminado con exito.  ${editedData.id}.`,
					"success"
				);
				dispatch(delRouteDayThunk(id));
				setEditingIndex(null);
				setEditedData({});
			}
		});
	};
	return (
		<div className="tables-view gap-5">
			<div style={{ height: "400px", overflowY: "scroll" }}>
				<Table
					striped
					bordered
					hover
					responsive
					style={{ width: "440px", margin: "1rem" }}
				>
					<thead>
						<tr>
							{/* <th style={{ width: "10px" }}>#</th> */}
							<th style={{ width: "40px" }}>id</th>
							<th style={{ width: "40px" }}>Ruta asignada</th>
							<th style={{ width: "70px" }}>Dia</th>
							<th style={{ width: "40px" }}>Accion</th>
						</tr>
					</thead>

					<tbody>
						{routeDay.map((rou, index) => (
							<tr
								key={index}
								style={{
									background: `${
										rou.id_route === idsRouteDay[index]
											? colorRouteDay[
													idsRouteDay[index]
											  ]
											: null
									}`,
								}}
							>
								{/* <td style={{ width: "10px" }}>{index + 1}</td> */}
								<td style={{ width: "10px" }}>{rou.id}</td>

								{editingIndex === index ? (
									<td style={{ textAlign: "center" }}>
										<select
											name="id_route"
											className="form-select h-25"
											style={{
												padding: "3px",
												paddingRight: "40px",
												width: "100px",
											}}
											value={editedData.id_route}
											onChange={handleInputChange}
										>
											<option>
												Seleccione Zona
											</option>
											{route.map((rou, index) => (
												<option
													key={index}
													value={rou.id}
												>
													{rou.name} -{" "}
													{rou.external_code}
												</option>
											))}
										</select>
									</td>
								) : (
									<td style={{ width: "100px" }}>
										{rou.id_route_route?.name}
									</td>
								)}
								{editingIndex === index ? (
									<td style={{ textAlign: "center" }}>
										<select
											name="day_id"
											className="form-select h-25"
											style={{
												padding: "3px",
												paddingRight: "40px",
												width: "100px",
											}}
											value={editedData.day_id}
											onChange={handleInputChange}
										>
											<option>
												Seleccione Dia
											</option>
											{dayList.map(
												(rouDay, index) => (
													<option
														key={index}
														value={
															rouDay.id
														}
													>
														{rouDay.id} -{" "}
														{rouDay.day}
													</option>
												)
											)}
										</select>
									</td>
								) : (
									<td style={{ width: "40px" }}>
										{(rou.day?.day).toUpperCase()}
									</td>
								)}

								<td
									className="tdBtn"
									style={{ maxWidth: "170px" }}
								>
									{editingIndex === index ? (
										<>
											<button
												type="button"
												className="btn btn-success btn-actions"
												onClick={() =>
													handleSave(index)
												}
											>
												<i className="fa-solid fa-floppy-disk bx-fw"></i>
											</button>
											<button
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
												!userLoged?.roll
													?.permissions
													?.create_vehicle
											}
											type="button"
											className="btn btn-primary  btn-actions"
											onClick={() =>
												handleEdit(index, rou)
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

			<div style={{ display: "flex", flexDirection: "column" }}>
				<h6>Asigne Días a las Rutas</h6>
				<Form
					className="formModal"
					onSubmit={handleSubmit(onSubmitRouteDay)}
				>
					<Form.Group className="mb-3">
						<Form.Label
							style={{
								fontSize: "14px",
								padding: "0.5rem",
								width: "120px",
							}}
						>
							Dia
						</Form.Label>

						<Form.Select
							{...register(`day_id`, { required: true })}
							style={{ fontSize: "14px", padding: "0.5rem" }}
						>
							<option>Seleccione</option>
							{dayList.map((dia, index) => (
								<option key={index} value={dia.id}>
									{dia.id} - {dia.day}
								</option>
							))}
						</Form.Select>
						<p
							className={`error-message ${
								errors["day_id"] ? "showError" : ""
							}`}
						>
							Este campo es requerido
						</p>
					</Form.Group>

					<Form.Group className="mb-3">
						<Form.Label
							style={{
								fontSize: "14px",
								padding: "0.5rem",
								width: "120px",
							}}
						>
							Route
						</Form.Label>
						<Form.Select
							{...register(`id_route`, { required: true })}
							style={{ fontSize: "14px", padding: "0.5rem" }}
						>
							<option>Seleccione</option>
							{route.map((rou, index) => (
								<option
									style={{
										background: `${
											rou.id === idsRoutes[index]
												? colorRouteDay[
														idsRoutes[
															index
														]
												  ]
												: null
										}`,
									}}
									key={index}
									value={rou.id}
								>
									{rou.name} - {rou.external_code}
								</option>
							))}
						</Form.Select>
						<p
							className={`error-message ${
								errors["id_route"] ? "showError" : ""
							}`}
						>
							Este campo es requerido
						</p>
					</Form.Group>
				</Form>
				<Button
					disabled={!userLoged?.roll?.permissions?.create_vehicle}
					variant="success"
					type="submit"
					onClick={handleSubmit(onSubmitRouteDay)}
				>
					Crear
				</Button>
			</div>
		</div>
	);
};

export default Createrouteday;
