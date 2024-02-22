import React, { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getRouteDayThunk } from "../../store/slices/routeday.slice";
import { getSellerThunk } from "../../store/slices/seller.slice";

const TableCustomer = ({ data, updateData, deleteData }) => {
	const dispatch = useDispatch();
	useEffect(() => {
		routeDay[0] ? null : dispatch(getRouteDayThunk());
		seller[0] ? null : dispatch(getSellerThunk());
	}, []);

	const routeDay = useSelector((state) => state.routeDay);
	const seller = useSelector((state) => state.seller);
	const userLoged = useSelector((state) => state.userLoged);

	const [editingIndex, setEditingIndex] = useState(null);
	const [editedData, setEditedData] = useState([]);
	const [id, setId] = useState(0);

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
			text: `Estas editando al cliente ${editedData.fullname}, deseas guardar los cambios.`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#029C63",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, deseo guardar!",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire(
					"Guardado!",
					`Se han actualizado los cambios en ${editedData.fullname}.`,
					"success"
				);
				updateData(id, editedData);
				// console.log(editedData);
				setEditingIndex(null);
				setEditedData({});
			}
		});
	};

	const handleDelete = (id) => {
		Swal.fire({
			title: "¿Está seguro?",
			text: `Estas eliminando el item ${editedData.fullname}, deseas eliminarlo.`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#029C63",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, deseo Eliminar!",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire(
					"Eliminado!",
					`Se ah eliminado con exito.  ${editedData.fullname}.`,
					"success"
				);
				deleteData(id);
				setEditingIndex(null);
				setEditedData({});
			}
		});
	};
	return (
		<div className="tables-view">
			<Table striped bordered hover responsive style={{ width: "1280px" }}>
				<thead>
					<tr>
						<th style={{ width: "15px" }}>#</th>
						<th style={{ width: "40px" }}>Id</th>
						<th style={{ width: "200px" }}>Nombre Completo</th>
						<th style={{ width: "350px" }}>Direccion</th>
						<th style={{ width: "135px" }}>Identificacion</th>
						<th style={{ width: "100px" }}>Cod MV</th>
						<th style={{ width: "120px" }}>Vendedor</th>
						<th style={{ width: "130px" }}>Dia Atencion</th>
						<th style={{ width: "40px" }}>Accion</th>
					</tr>
				</thead>
				<tbody>
					{data?.map((item, index) => (
						<tr key={index} style={{ height: "50px" }}>
							<td style={{ width: "15px", fontSize: "10px" }}>
								{index + 1}
							</td>

							{editingIndex === index ? (
								<td style={{ textAlign: "center" }}>
									<input
										style={{
											width: "40px",
											fontSize: "14px",
										}}
										className="form-control form-control-sm"
										name="id"
										disabled
										onChange={handleInputChange}
										value={editedData.id}
									/>
								</td>
							) : (
								<td style={{ textAlign: "center" }}>
									{item.id}
								</td>
							)}

							{editingIndex === index ? (
								<td>
									<input
										style={{
											width: "150px",
											fontSize: "14px",
										}}
										className="form-control form-control-sm"
										name="fullname"
										onChange={handleInputChange}
										value={editedData.fullname}
									/>
								</td>
							) : (
								<td
									style={{
										width: "200px",
										fontSize: "13px",
									}}
								>
									{item.fullname?.substring(0, 22)}
								</td>
							)}

							{editingIndex === index ? (
								<td>
									<input
										style={{ width: "300px" }}
										className="form-control form-control-sm"
										name="address"
										onChange={handleInputChange}
										value={editedData.address}
									/>
								</td>
							) : (
								<td
									style={{
										width: "300px",
										fontSize: "13px",
									}}
								>
									{item.address?.substring(0, 43)}
								</td>
							)}

							{editingIndex === index ? (
								<td>
									<input
										style={{
											width: "125px",
											fontSize: "14px",
										}}
										className="form-control form-control-sm"
										name="dni"
										onChange={handleInputChange}
										value={editedData.dni}
									/>
								</td>
							) : (
								<td style={{ width: "135px" }}>
									{item?.dni}
								</td>
							)}

							{editingIndex === index ? (
								<td>
									<input
										style={{
											width: "80px",
											fontSize: "13px",
										}}
										className="form-control form-control-sm"
										name="code_external"
										onChange={handleInputChange}
										value={editedData.code_external}
									/>
								</td>
							) : (
								<td
									style={{
										width: "115px",
										fontSize: "11px",
									}}
								>
									{item?.code_external}
								</td>
							)}

							{editingIndex === index ? (
								<td>
									<select
										name="id_seller"
										className="form-select h-25"
										style={{
											padding: "3px",
											paddingRight: "40px",
											width: "150px",
											fontSize: "14px",
										}}
										value={editedData.id_seller}
										onChange={handleInputChange}
									>
										<option>
											Seleccione Vendedor
										</option>
										{seller.map((sell, index) => (
											<option
												key={index}
												value={sell?.id}
											>
												{sell?.id} - {sell?.name}
											</option>
										))}
									</select>
								</td>
							) : (
								<td
									style={{
										width: "120px",
										fontSize: "14px",
									}}
								>
									{item.seller?.code} -{" "}
									{item.seller?.name?.split(" ")[0]}
								</td>
							)}

							{editingIndex === index ? (
								<td>
									<select
										name="id_route_day"
										className="form-select h-25"
										style={{
											padding: "3px",
											paddingRight: "40px",
											width: "125px",
											fontSize: "13px",
										}}
										value={editedData.id_route_day}
										onChange={handleInputChange}
									>
										<option>Seleccione Ruta</option>
										{routeDay.map((rout, index) => (
											<option
												key={index}
												value={rout?.id}
											>
												{
													rout.id_route_route
														?.name
												}{" "}
												- {rout?.day.day}{" "}
											</option>
										))}
									</select>
								</td>
							) : (
								<td
									style={{
										width: "135px",
										fontSize: "12px",
									}}
								>
									{item.route_day?.id_route_route.name} -{" "}
									{item.route_day?.day.day}
								</td>
							)}

							{/* <td>
                                {item.balance_veh?.total}
                            </td> */}

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
													!userLoged.roll
														?.permissions
														?.edited_seller_maxtotal
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
													!userLoged.roll
														?.permissions
														?.edited_seller_maxtotal
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

export default TableCustomer;
