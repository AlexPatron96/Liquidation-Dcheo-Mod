import React, { useEffect, useRef, useState } from "react";
import { Button, ListGroup } from "react-bootstrap";
import Table from "react-bootstrap/Table";
import date from "../../utils/date";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";
import Swal from "sweetalert2";
import { useDispatch, useSelector } from "react-redux";
import { getSellerThunk } from "../../store/slices/seller.slice";
import { getCustomerThunk } from "../../store/slices/customer.slice";
import { setErrorReceived } from "../../store/slices/errorReceived.slice";
import Modaldetailprod from "../Modals/Modaldetailprod";

const TableInvoice = ({
	data,
	updateInvo,
	delInvo,
	createInvo,
	transaccionPay,
	onviewpay,
	setItemSelect,
}) => {
	/**********************************************************************************/

	/*************************   Editar - Crear Tablas **********************************/

	const verifySeller = useSelector((state) => state.seller);
	const verifyCustomer = useSelector((state) => state.customer);
	const userLoged = useSelector((state) => state.userLoged);
	const inputRef = useRef(null);

	const dispatch = useDispatch();

	useEffect(() => {
		verifySeller[0] ? null : dispatch(getSellerThunk());
		verifyCustomer[0] ? null : dispatch(getCustomerThunk());
	}, []);

	const seller = useSelector((state) => state.seller);
	const customer = useSelector((state) => state.customer);

	const [editingIndex, setEditingIndex] = useState(null);
	const [editedData, setEditedData] = useState([]);
	const [error, setError] = useState({});
	const [editMode, setEditMode] = useState(false);
	const [formData, setFormData] = useState({
		id: "",
		id_client: "",
		num_bill: "",
		isWhite: false,
		id_status: 1,
		deliver_date: date.Currendate(),
		total_bill: "",
		balance: "",
		detail: "",
		id_seller: "",
	});

	/************************************* */

	const [activeListSearchCustomer, setActiveListSearchCustomer] = useState(true);
	// const [activeUpdateCustomer, setActiveUpdateCustomer] = useState(false)
	const [searchCustomer, setSearchCustomer] = useState("");
	const [searchCustomerEdit, setSearchCustomerEdit] = useState("");

	const filteredList = customer.filter((item) => {
		if (editMode === true) {
			return (
				item.fullname
					?.toLowerCase()
					.includes(searchCustomerEdit?.toLowerCase()) ||
				item.dni.includes(searchCustomerEdit)
			);
		} else {
			return (
				item.fullname
					?.toLowerCase()
					.includes(searchCustomer?.toLowerCase()) ||
				item.dni.includes(searchCustomer)
			);
		}
	});

	const handleSearchCustomerChange = (event) => {
		if (editMode === true) {
			setSearchCustomerEdit(event.target.value);
		} else {
			setSearchCustomer(event.target.value);
		}
		setError([]);
	};

	const handleItemCustomerClick = (item) => {
		//        console.log(item);
		const { id, fullname, seller } = item;
		const { id: idSeller } = seller;
		if (editMode === true) {
			setEditedData((prevState) => ({
				...prevState,
				id_client: id,
				id_seller: idSeller,
			}));
			setSearchCustomerEdit(`${id} - ${fullname}`);
		} else {
			setFormData((prevState) => ({
				...prevState,
				id_client: id,
				id_seller: idSeller,
			}));
			setSearchCustomer(`${id} - ${fullname}`);
		}
		setActiveListSearchCustomer(false);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		if (name === "id_client") {
			setSearchCustomer(value);
		}
		if (name === "total_bill") {
			if (value.length > 0 && !isNaN(value)) {
				setFormData((prevState) => ({
					...prevState,
					[name]: parseFloat(value),
				}));
				setError([]);
			} else {
				setError((prevState) => ({
					...prevState,
					total_bill: "Debe ingresar un digito",
				}));
			}
		}
		if (name === "num_bill") {
			if (value.length === 3) {
				setFormData((prevState) => ({
					...prevState,
					[name]: value + "-",
				}));
			} else if (value.length > 13) {
				setError((prevState) => ({
					...prevState,
					num_bill: "No Puede ingresar Mas de 13 Digitos",
				}));
			} else {
				setFormData((prevState) => ({
					...prevState,
					[name]: value,
				}));
				setError([]);
			}
		} else {
			setFormData((prevState) => ({
				...prevState,
				[name]: value,
			}));
			//        console.log("ignreso el else ultimo");
		}
	};

	const itemPast = (item) => {
		transaccionPay(item);
		// console.log("quien la ejecuta");
	};

	const handleAdd = () => {
		if (
			formData.total_bill?.length !== 0 &&
			formData.id_seller !== "" &&
			formData.deliver_date !== "" &&
			formData.id_client !== ""
		) {
			delete formData.id;
			formData.balance = formData.total_bill;
			createInvo(formData);
			setEditingIndex(null);
			setSearchCustomer("");
			setFormData({
				id: "",
				id_client: "",
				num_bill: "",
				isWhite: false,
				id_status: 1,
				deliver_date: date.Currendate(),
				total_bill: "",
				balance: 0,
				detail: "",
				id_seller: "",
			});
		} else {
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Existen campos sin Llenar!",
			});

			formData?.total_bill.length === 0
				? setError((prevState) => ({
						...prevState,
						total_bill: "Ingrese un Digito",
				  }))
				: "";

			formData.id_seller.length === 0
				? setError((prevState) => ({
						...prevState,
						id_seller: "Seleccione un Vendedor",
				  }))
				: "";

			formData.deliver_date.length === 0
				? setError((prevState) => ({
						...prevState,
						deliver_date: "Seleccione una Fecha",
				  }))
				: "";

			formData.id_client.length === 0
				? setError((prevState) => ({
						...prevState,
						id_client: "Seleccione un Cliente",
				  }))
				: "";

			formData.isWhite !== false
				? ""
				: formData.num_bill?.length === 0
				? setError((prevState) => ({
						...prevState,
						num_bill: "Debe de ingresar una Factura",
				  }))
				: "";
		}
		inputRef.current.focus();
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

	////************************* */

	const handleEdit = (index, obj) => {
		setEditingIndex(index);
		setEditMode(true);
		setEditedData(obj);
		setActiveListSearchCustomer(false);
		setSearchCustomerEdit(`${obj.client.id} - ${obj.client.fullname}`);
		//        console.log(obj);
	};

	const handleInputChange = (event) => {
		const { name, value } = event.target;
		setEditedData({ ...editedData, [name]: value });
	};

	const handleSave = (id) => {
		Swal.fire({
			title: "¿Está seguro?",
			text: `Estas editando al cliente ${editedData?.client.fullname}, deseas guardar los cambios.
            Debes de tomar en cuenta que al cambiar los datos modificarias la estructura de la factura.`,
			icon: "question",
			showCancelButton: true,
			confirmButtonColor: "#029C63",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, deseo guardar!",
		}).then((result) => {
			if (result.isConfirmed) {
				Swal.fire(
					"Guardado!",
					`Se han actualizado los cambios en ${editedData?.client.fullname}.`,
					"success"
				);
				delete editedData.client;
				delete editedData.seller;
				editedData.balance = editedData.total_bill;
				updateInvo(id, editedData);
				setEditingIndex(null);
				setEditedData({});
				setEditMode(false);
			}
		});
	};
	const [modalDetail, setModalDetail] = useState(false);
	const [detailItemSelect, setDetailItemSelect] = useState([]);

	const handleKeyPress = (event, itemRecept) => {
		if (event.key === "Enter") {
			handleItemCustomerClick(itemRecept);
		}
	};
	return (
		<div className="tables-view">
			<Table
				striped
				bordered
				hover
				size="sm"
				responsive
				style={{ width: "1280px" }}
			>
				<thead>
					<tr>
						<th style={{ width: "15px" }}>#</th>
						<th style={{ width: "40px" }}>Id</th>
						<th style={{ width: "550px" }}>Cliente</th>
						<th style={{ width: "200px" }}># Documento</th>
						<th style={{ width: "135px" }}>Tipo Doc.</th>
						<th style={{ width: "100px" }}>Estatus</th>
						<th style={{ width: "120px" }}>F. Entrega</th>
						<th style={{ width: "145px" }}>Total</th>
						<th style={{ width: "145px" }}>Balance</th>
						<th style={{ width: "145px" }}>Detalle</th>
						<th style={{ width: "40px" }}>Vendedor</th>
						<th style={{ width: "40px" }}>Accion</th>
					</tr>
				</thead>
				<tbody>
					{
						<tr>
							<td>-</td>

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
									autoFocus
									ref={inputRef}
									style={{
										fontSize: "13px",
										minWidth: "110px",
									}}
									type="text"
									value={searchCustomer}
									onClick={() =>
										setActiveListSearchCustomer(true)
									}
									onChange={handleSearchCustomerChange}
								/>

								<ListGroup
									tabIndex={0}
									className={
										searchCustomer.length > 1
											? `listClient`
											: `none`
									}
								>
									{filteredList
										.slice(0, 10)
										.map((item) => (
											<option
												tabIndex={0}
												onKeyDown={(e) =>
													handleKeyPress(
														e,
														item
													)
												}
												className={
													searchCustomer.length >
													1
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
												{
													item?.route_day
														?.id_route_route
														?.external_code
												}{" "}
												- {item.fullname}{" "}
											</option>
										))}
								</ListGroup>
								{error?.id_client ? (
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
										{error?.id_client}
									</p>
								) : null}
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
									name="num_bill"
									value={formData.num_bill}
									onChange={handleChange}
								/>
								{error?.num_bill ? (
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
										{error?.num_bill}
									</p>
								) : null}
							</td>

							<td>
								<select
									name="isWhite"
									className="form-select h-25"
									style={{
										padding: "5px",
										width: "90px",
										backgroundPosition:
											"right 0.1rem center",
										fontSize: "13px",
									}}
									value={formData.isWhite}
									onChange={handleChange}
								>
									<option value={"false"}>Factura</option>
									<option value={"true"}>
										N. De Venta
									</option>
								</select>
							</td>

							<td>
								<select
									name="id_status"
									className="form-select h-25"
									style={{
										padding: "5px",
										width: "90px",
										backgroundPosition:
											"right 0.1rem center",
										fontSize: "13px",
									}}
									value={formData.id_status}
									onChange={handleChange}
								>
									<option value={1}>Pendiente</option>
									<option value={2}>Abonada</option>
									<option value={3}>Pagada</option>
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
									name="deliver_date"
									value={formData.deliver_date}
									onChange={handleChange}
								/>
								{error?.deliver_date ? (
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
										{error?.deliver_date}
									</p>
								) : null}
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
										name="total_bill"
										value={formData.total_bill}
										onChange={handleChange}
									/>
								</div>

								{error?.total_bill ? (
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
										{error?.total_bill}
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
										name="balance"
										disabled={true}
										value={formData.total_bill}
										onChange={handleChange}
									/>
								</div>
							</td>

							<td>
								<input
									style={{
										padding: "3px",
										width: "70px",
										fontSize: "13px",
									}}
									className="form-control form-control-sm"
									type="text"
									name="detail"
									value={formData.detail}
									onChange={handleChange}
								/>
							</td>

							<td>
								<select
									name="id_seller"
									className="form-select h-25"
									style={{
										padding: "1px",
										paddingRight: "18px",
										width: "110px",
										backgroundPosition:
											"right 0.1rem center",
										fontSize: "13px",
									}}
									value={formData.id_seller}
									onChange={handleChange}
								>
									<option>Seleccione Vendedor</option>
									{seller?.map((sell, index) => (
										<option
											key={index}
											value={parseInt(sell.id)}
										>
											{sell.id} -{" "}
											{sell.name.substring(0, 15)}
										</option>
									))}
								</select>
								{error?.id_seller ? (
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
										{error?.id_seller}
									</p>
								) : null}
							</td>

							<td>
								<button
									onClick={handleAdd}
									disabled={
										!userLoged.roll?.permissions
											?.edited_seller_maxtotal
											? true
											: editMode
											? true
											: false
									}
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
					}

					{data?.map((item, index) => (
						<tr key={index} style={{ height: "40px" }}>
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
										name="id_client"
										className="form-control form-control-sm"
										// ref={inputRef}
										style={{
											fontSize: "13px",
											minWidth: "210px",
										}}
										type="text"
										value={searchCustomerEdit}
										onClick={() =>
											setActiveListSearchCustomer(
												true
											)
										}
										onChange={
											handleSearchCustomerChange
										}
									/>

									<ListGroup
										tabIndex={0}
										className={
											searchCustomerEdit.length > 1
												? `listClient`
												: `none`
										}
									>
										{filteredList
											.slice(0, 10)
											.map((item) => (
												<option
													tabIndex={0}
													className={
														searchCustomerEdit.length >
														1
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
													{item.id} -{" "}
													{item.fullname}
												</option>
											))}
									</ListGroup>
								</td>
							) : (
								<td
									style={{
										width: "250px",
										fontSize: "13px",
										cursor: "pointer",
									}}
								>
									<span
										onClick={() => {
											setModalDetail(true);
											setDetailItemSelect(item);
										}}
									>
										<a href="#">
											{item?.client?.fullname?.substring(
												0,
												20
											)}
										</a>
									</span>
								</td>
							)}

							{editingIndex === index ? (
								<td>
									<input
										style={{
											fontSize: "13px",
											minWidth: "110px",
										}}
										placeholder="001-000000001"
										className="form-control form-control-sm"
										type="text"
										name="num_bill"
										value={editedData.num_bill}
										onChange={handleInputChange}
									/>
								</td>
							) : (
								<td
									style={{
										width: "130px",
										fontSize: "13px",
									}}
								>
									{item?.num_bill}
								</td>
							)}

							{editingIndex === index ? (
								<td>
									<select
										name="isWhite"
										className="form-select h-25"
										style={{
											padding: "3px",
											width: "70px",
											backgroundPosition:
												"right 0.1rem center",
											fontSize: "12px",
										}}
										value={editedData.isWhite}
										onChange={handleInputChange}
									>
										<option value={false}>No</option>
										<option value={true}>Si</option>
									</select>
								</td>
							) : (
								<td style={{ fontSize: "13px" }}>
									{item?.isWhite === true
										? "Nota Venta"
										: "Factura"}
								</td>
							)}

							{editingIndex === index ? (
								<td>
									<select
										name="id_status"
										className="form-select h-25"
										style={{
											padding: "3px",
											width: "90px",
											backgroundPosition:
												"right 0.1rem center",
											fontSize: "13px",
										}}
										value={editedData?.id_status}
										onChange={handleInputChange}
									>
										<option value={1}>
											Pendiente
										</option>
										<option value={2}>Abonada</option>
										<option value={3}>Pagada</option>
									</select>
								</td>
							) : (
								<td>
									{item?.id_status === 1
										? "Pendiente"
										: item?.id_status === 2
										? "Abonada"
										: "Pagada"}
								</td>
							)}

							{editingIndex === index ? (
								<td>
									<input
										style={{
											padding: "3px",
											width: "120px",
											backgroundPosition:
												"right 0.1rem center",
											fontSize: "13px",
										}}
										className="form-control form-control-sm"
										type="date"
										name="deliver_date"
										value={editedData?.deliver_date}
										onChange={handleInputChange}
									/>
								</td>
							) : (
								<td>
									<h6
										className={
											item?.balance === 0
												? "dateSaldoCero"
												: date.DatePastPresent(
														item?.deliver_date
												  ) >= 30
												? "dateRed"
												: date.DatePastPresent(
														item?.deliver_date
												  ) >= 15
												? "dateYellow"
												: "dateGreen"
										}
									>
										{`(${date.DatePastPresent(
											item?.deliver_date
										)})`}{" "}
										{item?.deliver_date}
									</h6>
								</td>
							)}

							{editingIndex === index ? (
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
											name="total_bill"
											value={editedData.total_bill}
											onChange={handleInputChange}
										/>
									</div>
								</td>
							) : (
								<td
									style={{
										width: "115px",
										fontSize: "13px",
									}}
								>
									<h5 style={{ fontSize: "15px" }}>
										$ {item.total_bill?.toFixed(2)}
									</h5>
								</td>
							)}

							{editingIndex === index ? (
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
											name="balance"
											value={editedData.balance}
											onChange={handleInputChange}
										/>
									</div>
								</td>
							) : (
								<td>
									{/* onClick={transaccionPay(item)} */}
									<h5
										style={{
											fontSize: "15px",
											cursor: "pointer",
										}}
										onClick={() =>
											itemPast({
												item,
												active: true,
											})
										}
									>
										$ {item.balance?.toFixed(2)}
									</h5>
									{/* <a href="" >$ {(item.balance)?.toFixed(2)}</a> */}
								</td>
							)}

							{editingIndex === index ? (
								<td>
									<input
										style={{
											width: "95px",
											fontSize: "13px",
										}}
										className="form-control form-control-sm"
										name="detail"
										onChange={handleInputChange}
										value={editedData.detail}
									/>
								</td>
							) : (
								<td>
									<OverlayTrigger
										overlay={
											<Tooltip id="tooltip-disabled">
												{item?.detail}
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

							{editingIndex === index ? (
								<td>
									<select
										name="id_seller"
										className="form-select h-25"
										style={{
											padding: "3px",
											width: "110px",
											backgroundPosition:
												"right 0.1rem center",
											fontSize: "13px",
										}}
										value={editedData.id_seller}
										onChange={handleInputChange}
									>
										<option>
											{item.seller?.code} -{" "}
											{
												item.seller?.name?.split(
													" "
												)[0]
											}
										</option>
										{seller.map((sell, index) => (
											<option
												key={index}
												value={sell?.id}
											>
												({sell?.id}) -{" "}
												{sell?.code}{" "}
												{(sell?.name).substring(
													0,
													15
												)}
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

							<td style={{ maxWidth: "145px" }}>
								<div
									style={{
										display: "flex",
										gap: "0.25rem",
										justifyContent: "center",
									}}
								>
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
												onClick={() => {
													setEditingIndex(
														null
													);
													setEditMode(false);
												}}
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
														? true
														: item.balance !==
														  item.total_bill
														? true
														: false
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
														? true
														: item.balance !==
														  item.total_bill
														? true
														: false
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
			<Modaldetailprod
				show={modalDetail}
				onHide={() => {
					setModalDetail(false);
				}}
				data={detailItemSelect}
			/>
		</div>
	);
};

export default TableInvoice;
