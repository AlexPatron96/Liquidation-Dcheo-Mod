import React, { useEffect, useRef, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import date from "../../utils/date";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Swal from "sweetalert2";
import { useSelector } from "react-redux";

const Tabledinamik = ({
	invoice,
	seller,
	customer,
	createInvo,
	delInvo,
	updateInvo,
	refresh,
	liquidationAct,
	handleAddInvoice,
	checkSelectedID,
}) => {
	const [data, setData] = useState(invoice);
	useEffect(() => {
		setData(invoice);
		//console.log("actualizando informacion table dinamik");
	}, [refresh, invoice]);

	/********************************* Busqueda de CLiente *******************************/
	const [activeListSearchCustomer, setActiveListSearchCustomer] = useState(false);
	const [activeUpdateCustomer, setActiveUpdateCustomer] = useState(false);
	const [searchCustomer, setSearchCustomer] = useState("");
	const filteredList = customer.filter(
		(item) =>
			item.nombre.toLowerCase().includes(searchCustomer.toLowerCase()) ||
			item.dni.includes(searchCustomer)
	);
	const handleSearchCustomerChange = (event) => {
		setSearchCustomer(event.target.value);
	};
	const handleItemCustomerClick = (item) => {
		const { id, nombre } = item;
		if (editMode === true) {
			setEditData((prevState) => ({
				...prevState,
				id_client: id,
			}));
			setSearchCustomer(`${id} - ${nombre}`);
			setActiveUpdateCustomer(false);
			// alert(item.id + " " + item.nombre);
		} else {
			setFormData((prevState) => ({
				...prevState,
				id_client: id,
			}));
			setSearchCustomer(`${id} - ${nombre}`);
			setActiveListSearchCustomer(false);
			// alert(item.id + " " + item.nombre);
		}
	};
	/*************************************************************************************/

	/*************************   Totales de Saldo de facturas por cobrar **********************************/
	const userLiquidador = useSelector((state) => state.userLoged);
	const [transRealized, setTransRealized] = useState([]);

	const handleChangeTransaction = (e, item) => {
		const { name, value } = e.target;
		const num_Fact = item.num_Fact;
		const fecha_abono = date.Currendate();
		const abono = parseFloat(value);
		const id_users = userLiquidador.id;
		const id_bills = item.id;
		const id_client = item.id_client_bill.id;
		const verificador = transRealized?.findIndex(
			(verfItem) => verfItem?.num_Fact === item?.num_Fact
		);
		if (abono > item.saldo) {
			Swal.fire(
				"Error",
				`No puede Ingresar Un valor mayor al adeudado, se tomara como valor abonado 
      $${transRealized[verificador].abono}`,
				"warning"
			);
		} else {
			if (verificador != -1) {
				const newTransRealized = [...transRealized]; // crea una copia del arreglo original
				newTransRealized[verificador].abono = abono; // actualiza el valor de abono en el elemento correspondiente
				setTransRealized(newTransRealized); // actualiza el estado con la copia actualizada del arreglo
			} else {
				setTransRealized([
					...transRealized,
					{
						num_Fact,
						fecha_abono,
						abono,
						id_users,
						id_bills,
						id_client,
					},
				]);
			}
		}
		//console.log(transRealized);
	};
	const sumTotalFact = Object.values(data).reduce(
		(acc, cur) => acc + cur.saldo,
		0
	); //Total del saldo a cobrar
	const sumTotalCobrado = Object.values(transRealized).reduce(
		(acc, cur) => acc + cur.abono,
		0
	);
	const resetTotalCobrado = () => {
		//console.log("reset");
		//console.log(transRealized);
		setTransRealized([]);
	};
	/**********************************************************************************/

	/*************************   Editar - Crear Tablas **********************************/
	const inputRef = useRef(null);
	const [error, setError] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [editData, setEditData] = useState(null);
	const [editingIndex, setEditingIndex] = useState(null);
	const [formData, setFormData] = useState({
		id: "",
		id_client: "",
		num_Fact: "",
		isWhite: false,
		status: "pendiente",
		fecha_entrega: date.Currendate(),
		total_fact: "",
		saldo: 0,
		detalle_adt: "",
		id_sellers: seller[0]?.id,
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		//console.log(name);
		if (name === "id_client") {
			setSearchCustomer(value);
			//console.log(name);
		}
		if (name === "total_fact") {
			//console.log(name + " " + value);
			if (value.length !== 0) {
				setFormData((prevState) => ({
					...prevState,
					[name]: parseFloat(value),
				}));
				setError(null);
			} else {
				setError("total_fact");
			}
		}
		if (name === "num_Fact") {
			//console.log(formData);

			if (value.length === 3) {
				//console.log("es igual a 4");
				setFormData((prevState) => ({
					...prevState,
					[name]: value + "-",
				}));
			} else if (value.length > 13) {
				setError("num_Fact");
			} else {
				setFormData((prevState) => ({
					...prevState,
					[name]: value,
				}));
				setError(null);
			}
		} else {
			setFormData((prevState) => ({
				...prevState,
				[name]: value,
			}));
		}
	};

	const handleChangeUpdate = (e) => {
		const { name, value } = e.target;
		if (name === "num_Fact") {
			if (value.length > 13) {
				const message = "no puede ingresar mas de 13 digitos";
				setError(
					<p
						style={{
							fontSize: "14px",
							position: "absolute",
							padding: "5px",
							border: "2px solid red",
							borderRadius: "5px",
							backgroundColor: "#fff",
						}}
					>
						Error {message}
					</p>
				);
			} else {
				setEditData((prevState) => ({
					...prevState,
					[name]: value,
				}));
			}
		} else {
			//console.log(name + " " + value);
			setEditData((prevState) => ({
				...prevState,
				[name]: value,
			}));
		}
		//console.log(editData);
	};

	const handleAdd = () => {
		if (error === null && formData.total_fact.length !== 0) {
			delete formData.id;
			formData.saldo = formData.total_fact;
			createInvo(formData);
			//console.log(formData);
			setEditingIndex(null);
			setSearchCustomer("");
			inputRef.current.focus();
			setFormData({
				id: "",
				id_client: customer[0]?.id,
				num_Fact: "",
				isWhite: false,
				status: "pendiente",
				fecha_entrega: date.Currendate(),
				total_fact: "",
				saldo: 0,
				detalle_adt: "",
				id_sellers: seller[0]?.id,
			});
		} else {
			setError("total_fact");
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Existe un campo con error!",
			});
		}
	};

	const handleEdit = (index, item) => {
		if (item) {
			setEditingIndex(index);
			setEditMode(true);
			setEditData(item);
		}
	};

	const handleupdate = () => {
		Swal.fire({
			title: "¿Está seguro?",
			text: "¡Vas a Actualizar una Factura!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Modificar!",
		}).then((result) => {
			if (result.isConfirmed) {
				setEditMode(false);
				updateInvo(editData);
				setEditingIndex(null);
				Swal.fire({
					position: "center",
					icon: "success",
					title: "Actualizada!",
					text: "Se a Actualizado la Factura con exito.",
					showConfirmButton: false,
					timer: 1500,
				});
			}
		});
	};

	const handleDelete = (id) => {
		Swal.fire({
			title: "¿Está seguro?",
			text: "¡No podrás revertir esto!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Borralo!",
		}).then((result) => {
			if (result.isConfirmed) {
				delInvo(id);
				Swal.fire({
					position: "center",
					icon: "success",
					title: "¡Eliminado!",
					text: "Se a Eliminado la factura con exito",
					showConfirmButton: false,
					timer: 1500,
				});
			}
		});
	};

	return (
		<div>
			<Table
				striped
				bordered
				hover
				style={{
					maxWidth: "1305px",
					fontSize: "12px",
					textAlign: "center",
				}}
			>
				<thead>
					<tr>
						{liquidationAct !== true ? null : (
							<th style={{ maxWidth: "50px" }}>select</th>
						)}

						<th style={{ maxWidth: "50px" }}>item</th>
						<th style={{ maxWidth: "50px" }}>ID</th>
						<th style={{ maxWidth: "185px" }}>Cliente</th>
						<th style={{ maxWidth: "150px" }}># Factura</th>
						<th style={{ maxWidth: "100px" }}>N. Venta</th>
						<th style={{ maxWidth: "150px" }}>Estatus</th>
						<th style={{ maxWidth: "100px" }}>Fecha Entrega</th>
						<th style={{ maxWidth: "125px" }}>Total</th>
						<th style={{ maxWidth: "125px" }}>Saldo</th>
						<th style={{ maxWidth: "125px" }}>Detalle</th>
						<th style={{ maxWidth: "175px" }}>Vendedor</th>
						<th>
							{liquidationAct !== true
								? "Accion"
								: "Pago o Abono"}
						</th>
					</tr>
				</thead>
				<tbody>
					{liquidationAct !== true ? (
						<tr>
							{liquidationAct !== true ? null : (
								<td>{/*Aqui se ubica el checkBox */}</td>
							)}
							<td></td>
							<td>
								<input
									className="form-control form-control-sm"
									type="text"
									name="id"
									value={formData.id}
									disabled={true}
									onChange={handleChange}
								/>
							</td>

							<td>
								<input
									name="id_client"
									className="form-control form-control-sm"
									ref={inputRef}
									style={{
										fontSize: "13px",
										minWidth: "110px",
									}}
									type="text"
									value={editMode ? "" : searchCustomer}
									onClick={() =>
										setActiveListSearchCustomer(true)
									}
									onChange={handleSearchCustomerChange}
								/>

								<ListGroup
									multiple=""
									className={
										activeListSearchCustomer &&
										searchCustomer.length > 0
											? `listClient`
											: `none`
									}
								>
									{filteredList.map((item) => (
										<option
											className={
												activeListSearchCustomer
													? ``
													: `none`
											}
											key={item.id}
											value={item.id}
											onClick={() => {
												handleItemCustomerClick(
													item
												);
											}}
										>
											{item.id} - {item.nombre}{" "}
										</option>
									))}
								</ListGroup>
							</td>

							<td>
								<input
									style={{
										fontSize: "13px",
										minWidth: "110px",
									}}
									placeholder="001-000000001"
									className="form-control form-control-sm"
									type="text"
									name="num_Fact"
									value={formData.num_Fact}
									onChange={handleChange}
								/>
								{error === "num_Fact" ? (
									<p
										style={{
											fontSize: "10px",
											position: "absolute",
											padding: "5px",
											border: "2px solid red",
											borderRadius: "5px",
											backgroundColor: "#fff",
											fontFamily:
												"var(--paragraph-text)",
										}}
									>
										Error{" "}
										{
											"no puede ingresar mas de 13 digitos"
										}
									</p>
								) : null}
							</td>

							{/* <td>
                  <select name="isWhite"
                    className="form-select h-25"
                    style={{ padding: "3px", width: "40px", backgroundPosition: "right 0.1rem center", fontSize: "13px" }}
                    value={formData.isWhite}
                    onChange={handleChange}        >
                    <option value={(false)}>No</option>
                    <option value={(true)}>Si</option>
                  </select>
                </td> */}

							<td>
								<select
									name="status"
									className="form-select h-25"
									style={{
										padding: "5px",
										width: "90px",
										backgroundPosition:
											"right 0.1rem center",
										fontSize: "13px",
									}}
									value={formData.status}
									onChange={handleChange}
								>
									<option value="pendiente">
										Pendiente
									</option>
									<option value="abonada">Abonada</option>
									<option value="pagada">Pagada</option>
								</select>
							</td>

							<td>
								<input
									style={{
										padding: "3px",
										width: "110px",
										backgroundPosition:
											"right 0.1rem center",
										fontSize: "13px",
									}}
									className="form-control form-control-sm"
									type="date"
									name="fecha_entrega"
									value={formData.fecha_entrega}
									onChange={handleChange}
								/>
							</td>

							<td>
								<div
									className="input-group mb-3"
									style={{
										display: "flex",
										flexDirection: "row",
										flexWrap: "nowrap",
									}}
								>
									<span
										className="input-group-text"
										style={{
											padding: "3px",
											paddingRight: "5px",
											paddingLeft: "5px",
											width: "20px",
											fontSize: "13px",
										}}
									>
										$
									</span>
									<input
										aria-label="Amount (to the nearest dollar)"
										className="form-control form-control-sm"
										style={{
											padding: "3px",
											width: "60px",
											fontSize: "13px",
										}}
										type="text"
										name="total_fact"
										value={formData.total_fact}
										onChange={handleChange}
									/>
								</div>

								{error === "total_fact" ? (
									<p
										style={{
											fontSize: "10px",
											position: "absolute",
											padding: "5px",
											border: "2px solid red",
											borderRadius: "5px",
											backgroundColor: "#fff",
											fontFamily:
												"var(--paragraph-text)",
										}}
									>
										Error{" "}
										{
											"No puede guardar la factura sin llenar el campo Total"
										}
									</p>
								) : null}
							</td>

							<td>
								<div
									className="input-group mb-3w"
									style={{
										display: "flex",
										flexDirection: "row",
										flexWrap: "nowrap",
									}}
								>
									<span
										className="input-group-text"
										style={{
											padding: "3px",
											paddingRight: "5px",
											paddingLeft: "5px",
											width: "20px",
											fontSize: "13px",
										}}
									>
										$
									</span>
									<input
										aria-label="Amount (to the nearest dollar)"
										className="form-control form-control-sm"
										style={{
											padding: "3px",
											width: "40px",
											fontSize: "13px",
										}}
										type="text"
										name="saldo"
										disabled={true}
										value={formData.total_fact}
										onChange={handleChange}
									/>
								</div>
							</td>

							<td>
								<input
									style={{
										padding: "3px",
										width: "100px",
										fontSize: "13px",
									}}
									className="form-control form-control-sm"
									type="text"
									name="detalle_adt"
									value={formData.detalle_adt}
									onChange={handleChange}
								/>
							</td>

							<td>
								<select
									name="id_sellers"
									className="form-select h-25"
									style={{
										padding: "1px",
										paddingRight: "18px",
										width: "90px",
										backgroundPosition:
											"right 0.1rem center",
										fontSize: "13px",
									}}
									value={formData.id_sellers}
									onChange={handleChange}
								>
									<option>Seleccione Vendedor</option>
									{seller?.map((sell, index) => (
										<option
											key={index}
											value={parseInt(sell.id)}
										>
											{sell.id} - {sell.nombre}
										</option>
									))}
								</select>
							</td>

							<td>
								<button
									onClick={handleAdd}
									className="btn btn-primary m-1 p-1 d-flex flex-row"
								>
									<i
										className={`fa-solid ${
											editMode
												? "fa-floppy-disk"
												: "fa-circle-plus"
										}  bx-fw`}
									></i>
									{editMode ? "Guardar" : "Agregar"}
								</button>
							</td>
						</tr>
					) : (
						""
					)}

					{data?.map((item, index) => (
						<tr key={index}>
							{/* chekbox */}
							{liquidationAct !== true ? null : (
								<td>
									<input
										type="checkbox"
										name="id_select"
										value={item.id}
										checked={checkSelectedID.includes(
											item.id.toString()
										)}
										onChange={(e) =>
											handleAddInvoice(e, item)
										}
									/>
								</td>
							)}
							<td>{index + 1}</td>
							{/* id */}
							{editingIndex === index ? (
								<td>
									<input
										className="form-control form-control-sm"
										type="number"
										name="id"
										value={editData?.id}
										disabled={true}
										onChange={handleChangeUpdate}
									/>
								</td>
							) : (
								<td>{item?.id}</td>
							)}

							{/* idclient */}
							{editingIndex === index ? ( //Revisar codigo
								<td>
									<input
										name="id_client"
										tabIndex={1}
										className="form-control form-control-sm"
										type="text"
										value={searchCustomer}
										onChange={
											handleSearchCustomerChange
										}
										onClick={() => {
											activeUpdateCustomer
												? setActiveUpdateCustomer(
														false
												  )
												: setActiveUpdateCustomer(
														true
												  );
										}}
									/>

									<ListGroup
										className={
											activeUpdateCustomer
												? `listClient`
												: `none`
										}
										tabIndex={2}
									>
										{filteredList.map((item) => (
											<option
												className={
													activeUpdateCustomer
														? ``
														: `none`
												}
												tabIndex={1}
												key={item.id}
												value={item.id}
												onClick={() => {
													handleItemCustomerClick(
														item
													);
												}}
												onKeyDown={() => {
													handleItemCustomerClick(
														item
													);
												}}
											>
												{item.id} - {item.nombre}{" "}
											</option>
										))}
									</ListGroup>
								</td>
							) : (
								<td>{item?.id_client_bill?.nombre}</td>
							)}

							{/* fact */}
							{editingIndex === index ? (
								<td>
									<input
										placeholder="001-001-000000001"
										className="form-control form-control-sm"
										type="text"
										name="num_Fact"
										value={editData?.num_Fact}
										onChange={handleChangeUpdate}
									/>
									{error}
								</td>
							) : (
								<td>{item?.num_Fact}</td>
							)}

							{/* is white */}
							{editingIndex === index ? (
								<td>
									<select
										name="isWhite"
										className="form-select h-25"
										style={{
											padding: "3px",
											paddingRight: "40px",
										}}
										value={editData?.isWhite}
										onChange={handleChangeUpdate}
									>
										<option value={false}>No</option>
										<option value={true}>Si</option>
									</select>
								</td>
							) : (
								<td>
									{item?.isWhite === true ? "Si" : "No"}
								</td>
							)}

							{/* status */}
							{editingIndex === index ? (
								<td>
									<select
										name="status"
										className="form-select h-25"
										style={{
											padding: "3px",
											paddingRight: "40px",
										}}
										value={editData?.status}
										onChange={handleChangeUpdate}
									>
										<option value="pendiente">
											Pendiente
										</option>
										<option value="abonada">
											Abonada
										</option>
										<option value="pagada">
											Pagada
										</option>
									</select>
								</td>
							) : (
								<td>{item?.status}</td>
							)}

							{/* fecha */}
							{editingIndex === index ? (
								<td>
									<input
										className="form-control form-control-sm"
										type="date"
										name="fecha_entrega"
										value={editData?.fecha_entrega}
										onChange={handleChangeUpdate}
									/>
								</td>
							) : (
								<td>
									<h6
										className={
											item?.saldo === 0
												? "dateSaldoCero"
												: date.DatePastPresent(
														item?.fecha_entrega
												  ) >= 30
												? "dateRed"
												: date.DatePastPresent(
														item?.fecha_entrega
												  ) >= 15
												? "dateYellow"
												: "dateGreen"
										}
									>
										{`(${date.DatePastPresent(
											item?.fecha_entrega
										)})`}{" "}
										{item?.fecha_entrega}
									</h6>
								</td>
							)}

							{/* total */}
							{editingIndex === index ? (
								<td>
									<div
										className="input-group mb-3w"
										style={{
											display: "flex",
											flexDirection: "row",
										}}
									>
										<span
											className="input-group-text"
											style={{
												padding: "3px",
												paddingRight: "15px",
												paddingLeft: "15px",
											}}
										>
											$
										</span>
										<input
											aria-label="Amount (to the nearest dollar)"
											className="form-control form-control-sm"
											style={{ padding: "3px" }}
											type="text"
											name="total_fact"
											value={editData?.total_fact}
											onChange={handleChangeUpdate}
										/>
									</div>
								</td>
							) : (
								<td>{item?.total_fact?.toFixed(2)}</td>
							)}

							{/* saldo */}
							{editingIndex === index ? (
								<td>
									<div
										className="input-group mb-3w"
										style={{
											display: "flex",
											flexDirection: "row",
										}}
									>
										<span
											className="input-group-text"
											style={{
												padding: "3px",
												paddingRight: "15px",
												paddingLeft: "15px",
											}}
										>
											$
										</span>
										<input
											aria-label="Amount (to the nearest dollar)"
											className="form-control form-control-sm"
											style={{ padding: "3px" }}
											type="text"
											name="saldo"
											disabled={true}
											value={editData?.saldo}
											onChange={handleChangeUpdate}
										/>
									</div>
								</td>
							) : (
								<td>{item?.saldo?.toFixed(2)}</td>
							)}

							{/* detall */}
							{editingIndex === index ? (
								<td>
									<input
										className="form-control form-control-sm"
										type="text"
										name="detalle_adt"
										value={editData?.detalle_adt}
										onChange={handleChangeUpdate}
									/>
								</td>
							) : (
								<td>
									<OverlayTrigger
										overlay={
											<Tooltip id="tooltip-disabled">
												{item?.detalle_adt}
											</Tooltip>
										}
									>
										<span className="d-inline-block">
											<div
												style={{
													textAlign: "center",
													border: "2px solid var(--first-color)",
													pointerEvents:
														"none",
												}}
											>
												Ver Detalle
											</div>
										</span>
									</OverlayTrigger>
								</td>
							)}

							{/* seller */}
							{editingIndex === index ? (
								<td>
									<select
										name="id_sellers"
										className="form-select h-25"
										style={{
											padding: "3px",
											paddingRight: "40px",
										}}
										value={editData.id_sellers}
										onChange={handleChangeUpdate}
									>
										<option
											value={
												editData.id_seller_client
													.id
											}
										>
											{editData.id_seller_client.id}{" "}
											-{" "}
											{
												editData.id_seller_client
													.nombre
											}
										</option>
										{seller?.map((sell, index) => (
											<option
												key={index}
												value={parseInt(sell.id)}
											>
												{sell.id} - {sell.nombre}
											</option>
										))}
									</select>
								</td>
							) : (
								<td>{item?.id_seller_client?.nombre}</td>
							)}

							{/*Botones*/}
							<td>
								{liquidationAct !== true ? (
									editingIndex !== index ? (
										<div
											style={{
												display: "flex",
												flexDirection: "row",
											}}
										>
											<button
												className="btn btn-primary m-1 p-1 d-flex flex-row"
												onClick={() =>
													handleEdit(
														index,
														item
													)
												}
											>
												<i className="fa-solid fa-pen-to-square bx-fw"></i>
												-
											</button>
											<button
												className="btn btn-danger m-1 p-1 d-flex flex-row"
												style={{
													alignItems:
														"center",
												}}
												onClick={() => {
													handleDelete(
														item?.id
													);
												}}
											>
												<i className="fa-solid fa-trash-can bx-fw"></i>
											</button>
										</div>
									) : (
										<div
											style={{
												display: "flex",
												flexDirection: "row",
											}}
										>
											<button
												className="btn btn-success m-1 p-1 d-flex flex-row"
												onClick={() =>
													handleupdate()
												}
											>
												<i className="fa-solid fa-floppy-disk bx-fw"></i>
												{"Guardar"}
											</button>
											<button
												type="button"
												className="btn btn-warning m-1 p-1 d-flex flex-row"
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
										</div>
									) //AQui ingresamos la opcion para pagar o abonar factura
								) : (
									<div>
										<input
											className="form-control form-control-sm"
											onChange={(e) =>
												handleChangeTransaction(
													e,
													item
												)
											}
											value={transRealized.abono}
											style={{ width: "80px" }}
											type="text"
											name="abono"
											id=""
										/>
									</div>
								)}
							</td>
						</tr>
					))}

					<tr>
						<td colSpan={liquidationAct !== true ? 8 : 9}>
							<h6>TOTAL POR COBRAR:</h6>
						</td>
						<td>
							<h6>${sumTotalFact?.toFixed(2)}</h6>
						</td>
						{/* {
              liquidationAct !== true ?
                ""
                : (<td colSpan={1}>
                  <h1
                    style={{ textAlign: "center", width: "40px", justifyContent: "center" }}
                    className="btn btn-success m-1 p-1 d-flex flex-row"
                    onClick={() => resetTotalCobrado()}>
                    <i className='bx bx-brush bx-sm'></i>
                  </h1>
                </td>
                )
            } */}
						{liquidationAct !== true ? (
							<>
								<td></td>
								<td></td>
							</>
						) : (
							<>
								<td colSpan={1}>
									<h1
										style={{
											textAlign: "center",
											width: "40px",
											justifyContent: "center",
										}}
										className="btn btn-success m-1 p-1 d-flex flex-row"
										onClick={() => resetTotalCobrado()}
									>
										<i className="bx bx-brush bx-sm"></i>
									</h1>
								</td>
								<td>Total Cobrado</td>
								<td>
									<h5>
										$
										{sumTotalCobrado
											? sumTotalCobrado
											: 0}
									</h5>
								</td>
							</>
						)}
					</tr>
				</tbody>
			</Table>
		</div>
	);
};

export default Tabledinamik;
