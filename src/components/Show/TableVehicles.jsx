import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { getRoutethunk } from "../../store/slices/dataTemp.slice";
import Swal from "sweetalert2";
import { postVehicleBalancethunk } from "../../store/slices/vehicles.slice";
import date from "../../utils/date";
import Modalcuadrebalan from "../Modals/Modalcuadrebalan";

// import lodash from 'lodash';
// import { Row } from 'react-bootstrap';

const TableVehicles = ({ data, updateData, deleteData }) => {
	const dispatch = useDispatch();
	useEffect(() => {
		route[0] ? null : dispatch(getRoutethunk());
	}, []);

	const route = useSelector((state) => state.temporary);
	const userLoged = useSelector((state) => state.userLoged);

	const [editingIndex, setEditingIndex] = useState(null);
	const [editedData, setEditedData] = useState([]);
	// const [id, setId] = useState(0);

	const handleEdit = (index, obj) => {
		// console.log(obj);
		setEditingIndex(index);
		setEditedData(obj);
		// setId(obj.id);
	};

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setEditedData({ ...editedData, [name]: value });
		// console.log(editedData);
	};

	const handleSave = (item) => {
		Swal.fire({
			title: "¿Está seguro?",
			text: `Estas editando al vehiculo con Conductor ${editedData.driver}, deseas guardar los cambios.`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#029C63",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, deseo guardar!",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire(
					"Guardado!",
					`Se ah actualizado el vehiculo con Conductor ${editedData.driver}.`,
					"success"
				);
				updateData(item, editedData);
				// console.log(editedData);
				setEditingIndex(null);
				setEditedData({});
			}
		});
	};

	const handleDelete = (id) => {
		Swal.fire({
			title: "¿Está seguro?",
			text: `Estas eliminando el item ${editedData.driver}, deseas eliminarlo.`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#029C63",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, deseo Eliminar!",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire(
					"Eliminado!",
					`Se ah eliminado con exito.  ${editedData.driver}.`,
					"success"
				);
				deleteData(id);
				setEditingIndex(null);
				setEditedData({});
			}
		});
	};

	const createBalance = (item) => {
		// console.log(data);
		dispatch(postVehicleBalancethunk(item));
	};
	const [modalBalance, setModalBalance] = useState(false);
	const [itemSelected, setItemSelected] = useState({});

	return (
		<div className="tables-view">
			<Modalcuadrebalan
				show={modalBalance}
				onHide={() => {
					setModalBalance(false);
				}}
				data={itemSelected}
				tipo={"veh"}
			/>
			<Table striped bordered hover responsive>
				<thead>
					<tr>
						{/* <th style={{ width: "15px" }}>#</th> */}
						<th>Id</th>
						<th>Placa</th>
						<th>Conductor</th>
						<th>COD MV</th>
						<th>Identificacion</th>
						<th>Activo</th>
						<th>Ruta</th>
						<th>Balance</th>
						<th>Accion</th>
					</tr>
				</thead>
				<tbody>
					{data?.map((item, index) => (
						<tr key={index}>
							{/* <td style={{ width: "15px" }}>{index + 1}</td> */}

							{editingIndex === index ? (
								<td style={{ textAlign: "center" }}>
									<input
										// style={{ width: "40px" }}
										className="form-control form-control-sm"
										name="id"
										disabled
										onChange={handleInputChange}
										value={editedData.id}
									/>
								</td>
							) : (
								<td style={{ textAlign: "center" }}>
									{item?.id}
								</td>
							)}

							{editingIndex === index ? (
								<td>
									<input
										// style={{ width: "100px" }}
										className="form-control form-control-sm"
										name="enrollment"
										onChange={handleInputChange}
										value={editedData.enrollment}
									/>
								</td>
							) : (
								<td>{item?.enrollment}</td>
							)}

							{editingIndex === index ? (
								<td>
									<input
										// style={{ width: "150px" }}
										className="form-control form-control-sm"
										name="driver"
										onChange={handleInputChange}
										value={editedData.driver}
									/>
								</td>
							) : (
								<td>{item?.driver}</td>
							)}

							{editingIndex === index ? (
								<td>
									<input
										// style={{ width: "150px" }}
										className="form-control form-control-sm"
										name="cod_mv"
										onChange={handleInputChange}
										value={editedData.cod_mv}
									/>
								</td>
							) : (
								<td>{item?.cod_mv}</td>
							)}

							{editingIndex === index ? (
								<td>
									<input
										// style={{ width: "130px" }}
										className="form-control form-control-sm"
										name="dni"
										onChange={handleInputChange}
										value={editedData.dni}
									/>
								</td>
							) : (
								<td>{item?.dni}</td>
							)}

							{editingIndex === index ? (
								<td>
									<select
										name="isActive"
										className="form-select h-25"
										style={{
											padding: "3px",
											paddingRight: "40px",
											width: "100px",
										}}
										value={editedData.isActive}
										onChange={handleInputChange}
									>
										<option>Seleccione Estatus</option>
										<option value={true}>Si</option>
										<option value={false}>No</option>
									</select>
								</td>
							) : (
								<td>
									{item?.isActive === true ? "Si" : "No"}
								</td>
							)}

							{editingIndex === index ? (
								<td>
									<select
										style={{
											padding: "3px",
											paddingRight: "40px",
											width: "150px",
										}}
										name="id_route"
										className="form-select h-25"
										value={editedData.id_route}
										onChange={handleInputChange}
									>
										<option>Seleccione Ruta</option>
										{route?.map((rout, index) => (
											<option
												key={index}
												value={rout?.id}
											>
												{rout?.name} -{" "}
												{rout?.external_code}{" "}
											</option>
										))}
									</select>
								</td>
							) : (
								<td>
									{item?.route?.name} -{" "}
									{item?.route?.external_code}
								</td>
							)}

							<td>
								{item?.balance_veh === null ? (
									<a
										href="#"
										onClick={() => createBalance(item)}
									>
										Crear
									</a>
								) : (
									<div
										className={
											item.balance_veh?.total > 0
												? "dateYellowBorder"
												: item.balance_veh
														?.total < 0
												? "dateRedBorder"
												: "dateGreenBorder"
										}
									>
										<a
											href="#"
											onClick={() => {
												setModalBalance(true);
												setItemSelected(item);
											}}
										>
											{
												<h6>
													<span>
														{item
															.balance_veh
															?.total <
														0
															? "EN CONTRA  $ " +
															  parseFloat(
																	item
																		?.balance_veh
																		?.total
															  ).toFixed(
																	2
															  )
															: item
																	.balance_veh
																	?.total >
															  0
															? "A FAVOR  $ " +
															  parseFloat(
																	item
																		?.balance_veh
																		?.total
															  ).toFixed(
																	2
															  )
															: "OK $ " +
															  parseFloat(
																	item
																		?.balance_veh
																		?.total
															  ).toFixed(
																	2
															  )}
													</span>
												</h6>
											}
										</a>
									</div>
								)}
							</td>

							<td
								className="tdBtn"
								style={{ maxWidth: "145px" }}
							>
								<div className="btn-group">
									{editingIndex === index ? (
										<>
											<button
												type="button"
												className="btn btn-success btn-actions"
												onClick={() =>
													handleSave(item.id)
												}
											>
												<i className="fa-solid fa-floppy-disk bx-fw"></i>
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
										<>
											<button
												disabled={
													!userLoged?.roll
														?.permissions
														?.create_vehicle
												}
												type="button"
												className="btn btn-primary  btn-actions"
												onClick={() =>
													handleEdit(
														index,
														item
													)
												}
											>
												<i className="fa-solid fa-pen-to-square bx-fw"></i>
											</button>
											<button
												disabled={
													!userLoged?.roll
														?.permissions
														?.create_vehicle
												}
												type="button"
												className="btn btn-danger btn-actions"
												style={{
													alignItems:
														"center",
												}}
												onClick={() =>
													handleDelete(
														item.id
													)
												}
											>
												<i className="fa-solid fa-trash-can bx-fw"></i>
											</button>
										</>
									)}
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</Table>
		</div>
	);
};

export default TableVehicles;
