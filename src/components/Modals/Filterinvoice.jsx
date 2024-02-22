import React, { useEffect, useState } from "react";
import { Form, ListGroup, Modal } from "react-bootstrap";
import Buttonatom from "../atom/Buttonatom";
import { useForm } from "react-hook-form";
import date from "../../utils/date";
import { useDispatch, useSelector } from "react-redux";
import { getSellerThunk } from "../../store/slices/seller.slice";
import { getCustomerThunk } from "../../store/slices/customer.slice";
import { getInvoiceSearchFilterThunk } from "../../store/slices/invoice.slice";

const Filterinvoice = ({ show, onhide }) => {
	const dispatch = useDispatch();

	useEffect(() => {
		seller[0] ? null : dispatch(getSellerThunk());
		customer[0] ? null : dispatch(getCustomerThunk());
	}, []);

	const seller = useSelector((state) => state.seller);
	const customer = useSelector((state) => state.customer);

	const initialValueTransaccion = {
		id_client: "",
		id_seller: "",
		balance: "",
		num_bill: "",
		date_init: "",
		date_end: "",
		day_start: "",
	};

	const [dayList, setDayList] = useState([
		{ id: 1, day: "Lunes" },
		{ id: 2, day: "Martes" },
		{ id: 3, day: "Miercoles" },
		{ id: 4, day: "jueves" },
		{ id: 5, day: "Viernes" },
		{ id: 6, day: "Sabado" },
		{ id: 7, day: "Domingo" },
	]);

	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: initialValueTransaccion,
	});

	const onSubmitFilter = (data) => {
		// alert("Hiciste CLic en Sumit")
		console.log(data);

		dispatch(getInvoiceSearchFilterThunk(data));
	};

	const [activeListSearchCustomer, setActiveListSearchCustomer] = useState(true);

	const [searchCustomer, setSearchCustomer] = useState("");
	const [searchCustomerEdit, setSearchCustomerEdit] = useState("");
	// const [error, setError] = useState({});

	const filteredList = customer.filter((item) => {
		return (
			item.fullname
				?.toLowerCase()
				.includes(searchCustomer?.toLowerCase()) ||
			item.dni.includes(searchCustomer)
		);
	});

	const handleSearchCustomerChange = (event) => {
		setSearchCustomer(event.target.value);
		// console.log(event.target.value);
	};

	const handleItemCustomerClick = (item) => {
		const { id, fullname, seller } = item;

		setValue("id_client", id);
		setSearchCustomer(`${id} - ${fullname}`);
		// }
		setActiveListSearchCustomer(false);
	};

	return (
		<div>
			<Modal
				show={show}
				onHide={onhide}
				centered
				size="md"
				aria-labelledby="contained-modal-title-vcenter"
			>
				<Modal.Header>
					<Modal.Title id="contained-modal-title-vcenter">
						Busqueda
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Form
						className="form-search"
						onSubmit={handleSubmit(onSubmitFilter)}
					>
						<div className="cont-form">
							{/* Id CLiente */}
							<Form.Group className="mb-3 w-100">
								<Form.Label>Cliente</Form.Label>
								<input
									name="id_client"
									className="form-control form-client-input"
									// style={{ fontSize: "15px", width: "300px" }}
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
							</Form.Group>

							{/* Numero de Factura */}
							<Form.Group className="mb-3 w-100">
								<Form.Label># Factura</Form.Label>
								<Form.Control
									className="form-input"
									{...register("num_bill")}
								/>
							</Form.Group>
						</div>

						<div>
							<h5>Fecha</h5>
							<div className="cont-form-date">
								{/* Fecha Inicial*/}
								<Form.Group className="mb-3 w-50">
									<Form.Label>Fecha Inicial</Form.Label>
									<Form.Control
										type="date"
										{...register("date_init")}
									/>
									<p
										className={`error-message ${
											errors["date_init"]
												? "showError"
												: ""
										}`}
									>
										Campo requerido
									</p>
								</Form.Group>
								{/* Fecha final*/}
								<Form.Group className="mb-3 w-50">
									<Form.Label>Fecha Final</Form.Label>
									<Form.Control
										type="date"
										{...register("date_end")}
									/>
									<p
										className={`error-message ${
											errors["date_end"]
												? "showError"
												: ""
										}`}
									>
										Campo requerido
									</p>
								</Form.Group>
							</div>
						</div>

						{/* Vendedor */}
						<Form.Group className="mb-3">
							<Form.Label>Vendedor</Form.Label>
							<Form.Select
								className="form-input"
								{...register(`id_seller`)}
							>
								<option>Seleccione Vendedor</option>
								{seller?.map((seller, index) => (
									<option key={index} value={seller.id}>
										{seller.code} - {seller.name}
									</option>
								))}
							</Form.Select>
							{/* <p className={`error-message ${errors["id_seller"] ? 'showError' : ''}`}>Este campo es requerido</p> */}
						</Form.Group>

						{/* Balance */}
						<Form.Group className="mb-3">
							<Form.Label>Pagadas</Form.Label>
							<Form.Select
								className="form-input"
								{...register(`balance`)}
							>
								<option>Selecione la Opcion</option>
								<option value={true}>
									Si - Mostara FAC o NV pagadas.
								</option>
								<option value={false}>
									No - Mostrara Fac y NV x Cobrar.
								</option>
							</Form.Select>
							{/* <p className={`error-message ${errors["id_seller"] ? 'showError' : ''}`}>Este campo es requerido</p> */}
						</Form.Group>

						{/* Dia De factura */}
						<Form.Group className="mb-3">
							<Form.Label>Dia de Factura</Form.Label>
							<Form.Select
								className="form-input"
								{...register(`day_start`)}
							>
								<option>Selecione la Opcion</option>
								{dayList.map((day) => (
									<option key={day.id} value={day.id}>
										{day.day.toUpperCase()}
									</option>
								))}
							</Form.Select>
							{/* <p className={`error-message ${errors["id_seller"] ? 'showError' : ''}`}>Este campo es requerido</p> */}
						</Form.Group>
					</Form>
				</Modal.Body>
				<Modal.Footer>
					<Buttonatom
						created={() => {
							reset();
							setSearchCustomer("");
						}}
						title={"Limpiar"}
						color={"secundary"}
						ico={"fa-brush"}
					/>

					<Buttonatom
						created={onhide}
						title={"Cerrar"}
						color={"primary"}
						ico={"fa-door-closed"}
					/>

					<Buttonatom
						created={handleSubmit(onSubmitFilter)}
						title={"Buscar"}
						color={"success"}
						ico={"fa-filter"}
					/>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Filterinvoice;
