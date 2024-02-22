import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { getRoutethunk } from "../../store/slices/dataTemp.slice";
import Swal from "sweetalert2";
import { postSellerBalancethunk } from "../../store/slices/seller.slice";
import Modalcuadrebalan from "../Modals/Modalcuadrebalan";
import ProgressBar from "react-bootstrap/ProgressBar";
import { getInvoiceThunk } from "../../store/slices/invoice.slice";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import { Button } from "react-bootstrap";

const TableSellers = ({ data, updateData, deleteData }) => {
	const dispatch = useDispatch();
	useEffect(() => {
		route[0] ? null : dispatch(getRoutethunk());
		invoice[0] ? null : dispatch(getInvoiceThunk());
	}, []);

	const route = useSelector((state) => state.temporary);
	const invoice = useSelector((state) => state.invoice);
	const userLoged = useSelector((state) => state.userLoged);

	const [editingIndex, setEditingIndex] = useState(null);
	const [editedData, setEditedData] = useState([]);

	const handleEdit = (index, obj) => {
		setEditingIndex(index);
		setEditedData(obj);
	};

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setEditedData({ ...editedData, [name]: value });
	};

	const handleSave = (id) => {
		Swal.fire({
			title: "¿Está seguro?",
			text: `Estas editando un Vendedor ${editedData.name}, deseas guardar los cambios.`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#029C63",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, deseo guardar!",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire(
					"Guardado!",
					`Se ah actualizado el Vendedor ${editedData.name}.`,
					"success"
				);
				updateData(id, editedData);
				setEditingIndex(null);
				setEditedData({});
			}
		});
	};

	const handleDelete = (id) => {
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
				Swal.fire(
					"Eliminado!",
					`Se ah eliminado con exito.  ${editedData.name}.`,
					"success"
				);
				deleteData(id);
				setEditingIndex(null);
				setEditedData({});
			}
		});
	};

	const createBalance = (item) => {
		dispatch(postSellerBalancethunk(item));
	};

	const [modalBalance, setModalBalance] = useState(false);
	const [itemSelected, setItemSelected] = useState({});

	const calculatedPorcet = (sellerId, maxCredit) => {
		const filterInvSeller = invoice.filter(
			(inv) => parseInt(inv.seller.id) === parseInt(sellerId)
		);
		const sumTotal = Object.values(filterInvSeller).reduce(
			(acc, cur) => acc + parseFloat(cur?.balance),
			0
		);
		// console.log(sumTotal);
		let value = parseFloat(sumTotal).toFixed(2);
		const totalPorcent = (value * 100) / maxCredit;
		// console.log(totalPorcent + "% de  un credito maximo $" + maxCredit);
		return [parseFloat(totalPorcent).toFixed(2), value];
	};

	return (
		<div className="tables-view">
			<Modalcuadrebalan
				show={modalBalance}
				onHide={() => {
					setModalBalance(false);
				}}
				data={itemSelected}
				tipo={"ven"}
			/>

			<Table
				striped
				bordered
				hover
				size="sm"
				responsive
				style={{ width: "980px" }}
			>
				<thead>
					<tr style={{ textAlign: "center" }}>
						<th>Id</th>
						<th>Cod MV</th>
						<th>Nombre</th>
						<th>Activo</th>
						<th>Ruta</th>
						<th>Credito Max</th>
						<th>Balance</th>
						<th>Accion</th>
					</tr>
				</thead>
				<tbody>
					{data?.map((item, index) => (
						<tr
							key={index}
							className="text-center"
							style={{
								verticalAlign: "middle",
							}}
						>
							{/* <td style={{ width: "15px" }}>{index + 1}</td> */}

							{editingIndex === index ? (
								<td className="text-center">
									<input
										style={{ width: "40px" }}
										className="form-control form-control-sm"
										name="id"
										disabled
										onChange={handleInputChange}
										value={editedData.id}
									/>
								</td>
							) : (
								<td>{item.id}</td>
							)}

							{editingIndex === index ? (
								<td>
									<input
										style={{ width: "75px" }}
										className="form-control form-control-sm"
										name="code"
										onChange={handleInputChange}
										value={editedData.code}
									/>
								</td>
							) : (
								<td>{item.code}</td>
							)}

							{editingIndex === index ? (
								<td>
									<input
										style={{ width: "200px" }}
										className="form-control form-control-sm"
										name="name"
										onChange={handleInputChange}
										value={editedData.name}
									/>
								</td>
							) : (
								<td>{item.name?.substring(0, 20)}</td>
							)}

							{editingIndex === index ? (
								<td>
									<select
										name="isActive"
										className="form-select h-25"
										style={{
											padding: "5px",
											width: "75px",
											backgroundPosition:
												"right 0.1rem center",
											fontSize: "14px",
										}}
										value={editedData.isActive}
										onChange={handleInputChange}
									>
										<option value={true}>
											Estatus
										</option>
										<option value={true}>Si</option>
										<option value={false}>No</option>
									</select>
								</td>
							) : (
								<td>
									{item.isActive === true ? "Si" : "No"}
								</td>
							)}

							{editingIndex === index ? (
								<td>
									<select
										name="id_route"
										className="form-select h-25 "
										style={{
											padding: "5px",
											width: "130px",
											backgroundPosition:
												"right 0.1rem center",
											fontSize: "14px",
										}}
										value={editedData.id_route}
										onChange={handleInputChange}
									>
										<option>Seleccione Ruta</option>
										{route.map((rout, index) => (
											<option
												key={index}
												value={rout?.id}
											>
												{rout.name} -{" "}
												{rout?.external_code}
											</option>
										))}
									</select>
								</td>
							) : (
								<td>
									{item.route?.name} -{" "}
									{item.route?.external_code}
								</td>
							)}

							{/* Aparece un Error se debe al null al momento de crear un Vendedor*/}
							{/* CREDITO MAXIMO DEL VENDEDOR */}
							{editingIndex === index ? (
								<td>
									<input
										style={{ width: "150px" }}
										className="form-control form-control-sm"
										name="max_fact"
										onChange={handleInputChange}
										value={editedData.max_fact}
									/>
								</td>
							) : (
								<td style={{ background: "white " }}>
									{item.max_fact ? (
										<div>
											<OverlayTrigger
												key={"top"}
												placement={"top"}
												overlay={
													<Tooltip
														id={`tooltip-top`}
													>
														El vendedor{" "}
														{`${item?.name}`}{" "}
														tiene un total
														de Facturas por
														cobrar de{" "}
														<strong>
															{" "}
															{`$${
																calculatedPorcet(
																	item?.id,
																	item?.max_fact
																)[1]
															}`}
														</strong>{" "}
														que genera un
														porcentaje de{" "}
														{`${
															calculatedPorcet(
																item?.id,
																item?.max_fact
															)[0]
														}%`}{" "}
														de un total
														Maximo de
														credito de{" "}
														{`$${item?.max_fact}`}
														.
													</Tooltip>
												}
											>
												<div>
													<ProgressBar
														animated
														now={
															calculatedPorcet(
																item?.id,
																item?.max_fact
															)[0]
														}
													/>
													{
														calculatedPorcet(
															item?.id,
															item?.max_fact
														)[0]
													}
													%
												</div>
											</OverlayTrigger>
										</div>
									) : (
										<div>
											<OverlayTrigger
												key={"top"}
												placement={"top"}
												overlay={
													<Tooltip
														id={`tooltip-top`}
													>
														El vendedor{" "}
														{`${item?.name}`}{" "}
														no tiene defino
														un valor de
														credito Maximo.
														{"  "}
														<strong>
															Lo puedes
															hacer
															dando Clic
															en el
															boton de
															editar
														</strong>
														.
													</Tooltip>
												}
											>
												<div>
													"Agrega un Valor"
												</div>
											</OverlayTrigger>
										</div>
									)}
								</td>
							)}
							{/* <td></td> */}
							<td>
								{item?.balance_sell === null ? (
									<a
										href="#"
										onClick={() => createBalance(item)}
									>
										Crear
									</a>
								) : (
									<div
										className={
											parseFloat(
												item.balance_sell?.total
											) > 0
												? "dateYellowBorder"
												: parseFloat(
														item
															.balance_sell
															?.total
												  ) < 0
												? "dateRedBorder"
												: "dateGreenBorder"
										}
									>
										{/* {console.log(item)} */}
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
															.balance_sell
															?.total <
														0
															? "EN CONTRA  $ " +
															  parseFloat(
																	item
																		?.balance_sell
																		?.total
															  ).toFixed(
																	2
															  )
															: item
																	.balance_sell
																	?.total >
															  0
															? "A FAVOR  $ " +
															  parseFloat(
																	item
																		?.balance_sell
																		?.total
															  ).toFixed(
																	2
															  )
															: "OK $ " +
															  parseFloat(
																	item
																		?.balance_sell
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
								// className="tdBtn"
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
														?.create_seller
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
														?.create_seller
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

export default TableSellers;
