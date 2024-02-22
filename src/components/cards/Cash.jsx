import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, ListGroup, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerThunk } from "../../store/slices/customer.slice";
import { setErrorReceived } from "../../store/slices/errorReceived.slice";
import { setIsLoading } from "../../store/slices/isLoading.slice";
import getConfig from "../../utils/getConfig";
import resources from "../../utils/resources";
import Table from "react-bootstrap/Table";
import Swal from "sweetalert2";

const Cash = ({
	codLiq,
	receptedCash,
	codeCashLocalStorage,
	typeLiquidation,
	codeCheckLocalStorage,
	checkmoney,
}) => {
	const dispatch = useDispatch();

	const URL_BASE = resources.URL_BASE;
	const initialValueTransaccion = {
		settlement_code: codLiq,
		coin: "0",
		money: "0",
		deposits_money: "0",
		check_money: "0",
		total: "",
		detail: "OK",
	};

	/************** */
	const [typeIsSelected, setTypeIsSelected] = useState("");
	/************** */
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
		setValue,
		getValues,
	} = useForm({
		defaultValues: initialValueTransaccion,
	});
	// const valuesActual = getValues();
	// //console.log(valuesActual);
	const cashLocalStorage = JSON.parse(localStorage.getItem(codeCashLocalStorage));
	const checkStorage = JSON.parse(localStorage.getItem(codeCheckLocalStorage));
	const checkStorageView = JSON.parse(
		localStorage.getItem(codeCheckLocalStorage + "view")
	);
	const seller = useSelector((state) => state.seller);
	const vehicle = useSelector((state) => state.vehicles);

	useEffect(() => {
		getThunkBank();
		checkStorageView ? setCheckView(checkStorageView) : setCheckView([]);
		checkStorage ? setCheckData(checkStorage) : setCheckData([]);
		//console.log(typeLiquidation);
		typeLiquidation === "vehicle"
			? setTypeIsSelected(true)
			: setTypeIsSelected(false);
		customer[0] ? null : dispatch(getCustomerThunk());

		setValue("settlement_code", codLiq);
		cashLocalStorage ? setValue("coin", cashLocalStorage.coin) : "";
		cashLocalStorage ? setValue("money", cashLocalStorage.money) : "";
		cashLocalStorage
			? setValue("deposits_money", cashLocalStorage.deposits_money)
			: "";
		cashLocalStorage
			? setValue("check_money", cashLocalStorage.check_money)
			: "";
		cashLocalStorage ? setValue("total", cashLocalStorage.total) : "";
		cashLocalStorage ? setTotal(cashLocalStorage.total) : "";
		cashLocalStorage ? setValue("detail", cashLocalStorage.detail) : "";
		//console.log("cuantas veces ingresa");
	}, [codLiq]);

	const getThunkBank = async () => {
		dispatch(setIsLoading(true));
		return axios
			.get(`${URL_BASE}/api/v1/bank/all`, getConfig())
			.then((res) => {
				setBank(res.data.result);
			})
			.catch((err) => {
				dispatch(setErrorReceived(err.response?.data));
				alert("Error Get Bank");
			})
			.finally(() => dispatch(setIsLoading(false)));
	};

	const postThunkBank = async (data) => {
		//console.log(URL_BASE);
		//console.log(data);
		dispatch(setIsLoading(true));
		return axios
			.post(`${URL_BASE}/api/v1/bank/new`, data, getConfig())
			.then((res) => {
				//console.log("Post Bank");
				getThunkBank();
			})
			.catch((err) => {
				dispatch(setErrorReceived(err.response?.data));
				alert("Error Post Bank");
			})
			.finally(() => dispatch(setIsLoading(false)));
	};

	const customer = useSelector((state) => state.customer);
	const [total, setTotal] = useState(0);
	const [formData, setFormData] = useState(new FormData());

	const calculateTotal = () => {
		const coin = parseFloat(formData.get("coin") || 0);
		const money = parseFloat(formData.get("money") || 0);
		const deposits_money = parseFloat(formData.get("deposits_money") || 0);
		const check_money = parseFloat(formData.get("check_money") || 0);
		const newTotal = coin + money + deposits_money + check_money;
		setTotal(newTotal.toFixed(2));
		setValue("total", newTotal.toFixed(2));
	};

	const onChange = (event) => {
		setValue("settlement_code", codLiq);
		const { name, value } = event.target;
		formData.set(name, value);
		setFormData(formData);
		calculateTotal();
	};

	const onSubmit = (data) => {
		setValue("settlement_code", codLiq);
		receptedCash(data, checkData, checkView);
		localStorage.setItem(codeCashLocalStorage, JSON.stringify(data));
		localStorage.setItem(codeCheckLocalStorage, JSON.stringify(checkData));
		localStorage.setItem(
			codeCheckLocalStorage + "view",
			JSON.stringify(checkView)
		);
		handleClose();
	};

	const resetAction = () => {
		reset();
		setSearchCustomer("");
		setCheckView([]);
		setCheckData([]);
		setTotal(0);
		setFormData(new FormData());
		localStorage.removeItem(codeCashLocalStorage);
		localStorage.removeItem(codeCheckLocalStorage);
		localStorage.removeItem(codeCheckLocalStorage + "view");
	};

	/****************************************************/
	const [checkData, setCheckData] = useState([]);
	const [checkView, setCheckView] = useState([]);

	const [formChekDataView, setFormChekDataView] = useState({
		settlement_code: "",
		id_bank: "",
		id_client: "",
		references: "",
		type: "deposito",
		number_check: "",
		isEndorsed: "false",
		toName: "",
		total: "",
	});

	const [formChekData, setFormChekData] = useState({
		settlement_code: "",
		id_bank: "",
		id_client: "",
		references: "",
		type: "deposito",
		number_check: "",
		isEndorsed: "false",
		toName: "",
		total: "",
	});

	const handleAdd = () => {
		//console.log(formChekData);
		//console.log(formChekData.id_bank !== "");
		if (
			formChekData.id_client !== "" &&
			formChekData.id_bank !== "" &&
			formChekData.total !== ""
		) {
			setCheckData((prevState) => [...prevState, formChekData]);

			setCheckView((prevState) => [...prevState, formChekDataView]);

			setFormChekData({
				settlement_code: "",
				id_bank: "",
				id_client: "",
				references: "",
				type: "deposito",
				number_check: "",
				isEndorsed: "false",
				toName: "",
				total: "",
			});

			setFormChekDataView({
				settlement_code: "",
				id_bank: "",
				id_client: "",
				references: "",
				type: "deposito",
				number_check: "",
				isEndorsed: "false",
				toName: "",
				total: "",
			});

			setSearchCustomer("");
		} else {
			Swal.fire({
				icon: "warning",
				title: "Cancelado!",
				text: "No puede agregar un registro sin completar ciertos campos.",
				showConfirmButton: true,
				// timer: 1000
			});
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		//console.log(name + "  - " + value);
		setFormChekData((prevState) => ({
			...prevState,
			settlement_code: codLiq,
		}));

		if (name === "id_client") {
			const separador = value.split("-");
			const client = { id: separador[0], nombre: separador[1] };
			setFormChekData((prevState) => ({
				...prevState,
				[name]: client.id,
			}));
			setFormChekDataView((prevState) => ({
				...prevState,
				[name]: client.nombre,
			}));
		} else if (name === "id_bank") {
			//console.log(value);
			const separador = value.split("-");
			const bank = { id: separador[0], name_bank: separador[1] };
			//console.log(bank);
			setFormChekDataView((prevState) => ({
				...prevState,
				[name]: bank.name_bank,
			}));
			//console.log(value);
			setFormChekData((prevState) => ({
				...prevState,
				[name]: parseInt(bank.id),
			}));
		} else {
			setFormChekDataView((prevState) => ({
				...prevState,
				[name]: value,
			}));
			setFormChekData((prevState) => ({
				...prevState,
				[name]: value,
			}));
		}
	};

	/****************************************************/

	const [activeListSearchCustomer, setActiveListSearchCustomer] = useState(false);
	const [searchCustomer, setSearchCustomer] = useState("");

	const filteredList = customer.filter(
		(item) =>
			item.fullname
				?.toLowerCase()
				.includes(searchCustomer?.toLowerCase()) ||
			item.dni.includes(searchCustomer)
	);

	const handleSearchCustomerChange = (event) => {
		setSearchCustomer(event.target.value);
	};

	const handleItemCustomerClick = (item) => {
		const { id, fullname } = item;
		setFormChekData((prevState) => ({
			...prevState,
			id_client: id,
		}));
		setFormChekDataView((prevState) => ({
			...prevState,
			id_client: fullname,
		}));
		setSearchCustomer(`${id} - ${fullname}`);
		setActiveListSearchCustomer(false);
	};

	/****************************************************/

	/****************************************************/
	const [showNewBank, setShowNewBank] = useState(false);
	const [bank, setBank] = useState([]);
	const [dataBank, setDataBank] = useState([]);
	const handleBankClose = () => setShowNewBank(false);
	const handleBankShow = () => setShowNewBank(true);
	const newBank = (data) => {
		postThunkBank(data);
		handleBankClose();
	};

	const handleChangeBank = (e) => {
		const { name, value } = e.target;
		setDataBank((prevState) => ({
			...prevState,
			[name]: value.toString().toUpperCase(),
		}));
	};

	const [showCash, setShowCash] = useState(false);

	const handleClose = () => setShowCash(false);
	const handleShow = () => setShowCash(true);
	const [onDeposit, setOnDeposit] = useState(false);
	const viewDeposit = () => {
		onDeposit ? setOnDeposit(false) : setOnDeposit(true);
	};
	return (
		<div>
			<Button
				variant="primary"
				onClick={handleShow}
				className="styleBtnModal"
				style={{ fontSize: "19px", fontWeight: "500" }}
			>
				<i className="fa-solid fa-sack-dollar bx-fx"></i>
				<h5>DINERO</h5>
			</Button>
			<Modal show={showCash} onHide={handleClose} size="lg" centered>
				<Modal.Header closeButton>
					<Modal.Title>Dinero Recaudado</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="">
						{/* <h5>Dinero Recaudado</h5> */}
						<div>
							<Form onSubmit={handleSubmit(onSubmit)}>
								{/* Codigo de factura*/}

								<Form.Group className="mb-3 text-center w-100">
									<i className="fa-solid fa-file-invoice bx-fw"></i>
									<Form.Label
										className="mb-2"
										style={{
											fontSize: "12px",
										}}
									>
										# Liquidacion
									</Form.Label>
									<Form.Control
										readOnly
										placeholder="LIQ-SELL-M1-day"
										className="w-100 text-center"
										style={{
											fontSize: "12px",
										}}
										{...register("settlement_code")}
									/>
									<p
										className={`error-message ${
											errors["settlement_code"]
												? "showError"
												: ""
										}`}
									>
										Campo requerido
									</p>
								</Form.Group>

								<div className="d-flex gap-3">
									{/* coin */}
									<Form.Group className="mb-3 text-center w-100">
										{/* <i className="fa-solid fa-utensils bx-fw"></i> */}
										<i className="fa-solid fa-coins bx-fw"></i>
										<Form.Label
											className="mb-2"
											style={{
												fontSize: "12px",
											}}
										>
											{" "}
											Monedas
										</Form.Label>
										<Form.Control
											className="w-100 text-center"
											style={{
												fontSize: "12px",
											}}
											placeholder="$"
											{...register("coin", {
												required: true,
												onChange: onChange,
												pattern: /^[-]?\d*.?\d+$/,
											})}
										/>
										<p
											className={`error-message ${
												errors["coin"]?.type ===
												"required"
													? "showError"
													: ""
											}`}
										>
											Campo requerido
										</p>
										<p
											className={`error-message ${
												errors["coin"]?.type ===
												"pattern"
													? "showError"
													: ""
											}`}
										>
											Solo se permite numeros
										</p>
									</Form.Group>

									{/* money */}
									<Form.Group className="mb-3 text-center w-100">
										<i className="fa-regular fa-money-bill-1 bx-fw"></i>
										<Form.Label
											className="mb-2"
											style={{
												fontSize: "12px",
											}}
										>
											{" "}
											Billetes
										</Form.Label>
										<Form.Control
											className="w-100 text-center"
											style={{
												fontSize: "12px",
											}}
											placeholder="$"
											{...register("money", {
												required: true,
												onChange: onChange,
												pattern: /^[-]?\d*.?\d+$/,
											})}
										/>
										<p
											className={`error-message ${
												errors["money"]?.type ===
												"required"
													? "showError"
													: ""
											}`}
										>
											Campo requerido
										</p>
										<p
											className={`error-message ${
												errors["money"]?.type ===
												"pattern"
													? "showError"
													: ""
											}`}
										>
											Solo se permite numeros
										</p>
									</Form.Group>
								</div>

								<div className="d-flex gap-3">
									{/* deposits_money */}
									<Form.Group className="mb-3 text-center w-100">
										{/* <i className="fa-solid fa-gas-pump bx-fw"></i> */}
										<i className="fa-solid fa-receipt bx-fw"></i>
										<Form.Label
											className="mb-2"
											style={{
												fontSize: "12px",
											}}
										>
											Total en Depositos
										</Form.Label>
										<Form.Control
											className="w-100 text-center"
											style={{
												fontSize: "12px",
											}}
											placeholder="$"
											{...register(
												"deposits_money",
												{
													required: true,
													onChange: onChange,
													pattern: /^[-]?\d*.?\d+$/,
												}
											)}
										/>
										<p
											className={`error-message ${
												errors["deposits_money"]
													?.type ===
												"required"
													? "showError"
													: ""
											}`}
										>
											Campo requerido
										</p>
										<p
											className={`error-message ${
												errors["deposits_money"]
													?.type === "pattern"
													? "showError"
													: ""
											}`}
										>
											Solo se permite numeros
										</p>
									</Form.Group>

									{/* check_money */}
									<Form.Group className="mb-3 text-center w-100">
										<i className="fa-solid fa-money-check bx-fw"></i>
										<Form.Label
											className="mb-2"
											style={{
												fontSize: "12px",
											}}
										>
											Total de Cheques
										</Form.Label>
										<Form.Control
											placeholder="$"
											className="w-100 text-center"
											style={{
												fontSize: "12px",
											}}
											{...register("check_money", {
												required: true,
												onChange: onChange,
												pattern: /^[-]?\d*.?\d+$/,
											})}
										/>
										<p
											className={`error-message ${
												errors["check_money"]
													?.type ===
												"required"
													? "showError"
													: ""
											}`}
										>
											Campo requerido
										</p>
										<p
											className={`error-message ${
												errors["check_money"]
													?.type === "pattern"
													? "showError"
													: ""
											}`}
										>
											Solo se permite numeros
										</p>
									</Form.Group>
								</div>

								{/* total */}
								<Form.Group className="mb-3 text-center w-100">
									<i className="fa-brands fa-stack-overflow bx-fw"></i>
									<Form.Label
										className="mb-2"
										style={{
											fontSize: "12px",
										}}
									>
										Total de Dinero
									</Form.Label>
									<Form.Control
										value={total}
										placeholder="$"
										className="w-100 text-center border-danger"
										style={{
											fontSize: "12px",
										}}
										{...register("total", {
											required: true,
											onChange: onChange,
											pattern: /^[-]?\d*.?\d+$/,
										})}
									/>
									<p
										className={`error-message ${
											errors["total"]?.type ===
											"required"
												? "showError"
												: ""
										}`}
									>
										Campo requerido
									</p>
									<p
										className={`error-message ${
											errors["total"]?.type ===
											"pattern"
												? "showError"
												: ""
										}`}
									>
										Solo se permite numeros
									</p>
								</Form.Group>

								{/* Detalle adicional */}
								<Form.Group className="mb-3 text-center w-100">
									<i className="fa-solid fa-circle-info bx-fw"></i>
									<Form.Label
										className="mb-2"
										style={{
											fontSize: "12px",
										}}
									>
										Detalles adicionales
									</Form.Label>
									<Form.Control
										className="w-100 text-center"
										style={{
											fontSize: "12px",
										}}
										{...register("detail")}
									/>
								</Form.Group>

								{/* <div style={{ display: "flex", flexDirection: "column" }}>
                                    <Button style={{ borderBottomLeftRadius: "0", borderBottomRightRadius: "0" }} variant="outline-danger"
                                        onClick={() => { reset(); setCheckView([]); setCheckData([]); }}>
                                        Limpiar
                                    </Button>
                                    <Button style={{ borderTopLeftRadius: "0", borderTopRightRadius: "0" }}
                                        variant="outline-success" type="submit"
                                        onClick={handleSubmit(onSubmit)}>
                                        Grabar
                                    </Button>
                                </div> */}
							</Form>
							{onDeposit && (
								<div
									style={{
										border: "2px solid var(--first-color)",
										padding: "1rem",
										borderRadius: "5px",
									}}
								>
									<h5>Registre un deposito o cheque.</h5>
									<div>
										<div className="d-flex flex-row flex-wrap justify-content-between text-center">
											<div>
												<span
													style={{
														fontSize:
															"12px",
													}}
												>
													# Documento
												</span>

												<input
													style={{
														fontSize:
															"13px",
														width: "110px",
													}}
													className="form-control form-control-sm"
													type="text"
													name="number_check"
													value={
														formChekData.number_check
													}
													onChange={
														handleChange
													}
												/>
											</div>

											<div>
												<span
													style={{
														fontSize:
															"12px",
													}}
												>
													Cliente
												</span>
												<input
													name="id_client"
													className="form-control form-control-sm"
													style={{
														fontSize:
															"13px",
														minWidth:
															"110px",
													}}
													type="text"
													value={
														searchCustomer
													}
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
													multiple=""
													className={
														activeListSearchCustomer &&
														searchCustomer.length >
															1
															? `listClient`
															: `none`
													}
												>
													{filteredList
														.slice(0, 10)
														.map(
															(
																item
															) => (
																<option
																	className={
																		activeListSearchCustomer
																			? ``
																			: `none`
																	}
																	key={
																		item.id
																	}
																	value={
																		item.id
																	}
																	onClick={() => {
																		handleItemCustomerClick(
																			item
																		);
																	}}
																>
																	{
																		item.id
																	}
																	{
																		" - "
																	}
																	{
																		item.fullname
																	}
																</option>
															)
														)}
												</ListGroup>
											</div>

											{typeIsSelected ? (
												<div>
													<span
														style={{
															fontSize:
																"12px",
														}}
													>
														Receptador
														Entre.
													</span>
													<select
														name="references"
														className="form-select h-25"
														style={{
															padding: "5px",
															width: "150px",
															backgroundPosition:
																"right 0.1rem center",
															fontSize:
																"13px",
														}}
														value={
															formChekData.references
														}
														onChange={
															handleChange
														}
													>
														<option>
															Seleccione
															Recep
														</option>
														{vehicle.map(
															(
																veh,
																index
															) => (
																<option
																	key={
																		index
																	}
																	value={`${veh?.id}-${veh?.driver}`}
																>
																	{" "}
																	{
																		veh?.id
																	}{" "}
																	-{" "}
																	{
																		veh?.driver
																	}
																</option>
															)
														)}
													</select>
												</div>
											) : (
												""
											)}

											{typeIsSelected ? (
												""
											) : (
												<div>
													<span
														style={{
															fontSize:
																"12px",
														}}
													>
														Receptador
														Vend.
													</span>
													<select
														name="references"
														className="form-select h-25"
														style={{
															padding: "5px",
															width: "150px",
															backgroundPosition:
																"right 0.1rem center",
															fontSize:
																"13px",
														}}
														value={
															formChekData.references
														}
														onChange={
															handleChange
														}
													>
														<option>
															Seleccione
															Recep
														</option>
														{seller.map(
															(
																sell,
																index
															) => (
																<option
																	key={
																		index
																	}
																	value={`${sell?.id}-${sell?.name}`}
																>
																	{" "}
																	{
																		sell?.id
																	}{" "}
																	-{" "}
																	{
																		sell?.name
																	}
																</option>
															)
														)}
													</select>
												</div>
											)}

											<div>
												<span
													style={{
														fontSize:
															"12px",
													}}
												>
													Banco
												</span>
												<select
													name="id_bank"
													className="form-select h-25"
													style={{
														padding: "5px",
														width: "150px",
														backgroundPosition:
															"right 0.1rem center",
														fontSize:
															"13px",
													}}
													value={
														formChekData.id_bank
													}
													onChange={
														handleChange
													}
												>
													<option>
														{" "}
														{formChekData.id_bank
															? bank.filter(
																	(
																		bg
																	) =>
																		bg?.id ===
																		parseInt(
																			formChekData?.id_bank
																		)
															  )[0]
																	.name_bank
															: "Seleccione un Banco"}{" "}
													</option>
													{bank.map(
														(
															bg,
															index
														) => (
															// <option key={index} value={JSON.stringify(bg)} > {bg?.id} - {bg?.name_bank}</option>
															<option
																key={
																	index
																}
																value={`${bg?.id}-${bg?.name_bank}`}
															>
																{formChekData.id_bank ===
																bg?.id
																	? `${bg?.id} - ${bg?.name_bank}`
																	: `${bg?.id} - ${bg?.name_bank}`}{" "}
															</option>
														)
													)}
												</select>
											</div>

											<div>
												<span
													style={{
														fontSize:
															"12px",
													}}
												>
													Tipo
												</span>
												<select
													name="type"
													className="form-select h-25"
													style={{
														padding: "5px",
														width: "90px",
														backgroundPosition:
															"right 0.1rem center",
														fontSize:
															"13px",
													}}
													value={
														formChekData.type
													}
													onChange={
														handleChange
													}
												>
													<option
														value={
															"deposito"
														}
													>
														Deposito
													</option>
													<option
														value={
															"cheque"
														}
													>
														Cheque
													</option>
													<option
														value={
															"transferencia"
														}
													>
														Transferencia
													</option>
												</select>
											</div>

											<div>
												<span
													style={{
														fontSize:
															"12px",
													}}
												>
													Endosado
												</span>
												<select
													name="isEndorsed"
													className="form-select h-25"
													style={{
														padding: "5px",
														width: "90px",
														backgroundPosition:
															"right 0.1rem center",
														fontSize:
															"13px",
													}}
													value={
														formChekData.isEndorsed
													}
													onChange={
														handleChange
													}
												>
													<option
														value={false}
													>
														No
													</option>
													<option
														value={true}
													>
														Si
													</option>
												</select>
											</div>

											<div>
												<span
													style={{
														fontSize:
															"12px",
													}}
												>
													A Nombre De
												</span>
												<input
													style={{
														fontSize:
															"13px",
														width: "110px",
													}}
													className="form-control form-control-sm"
													type="text"
													name="toName"
													value={
														formChekData.toName
													}
													onChange={
														handleChange
													}
												/>
											</div>

											<div>
												Total
												<input
													placeholder="$"
													style={{
														fontSize:
															"13px",
														width: "110px",
													}}
													className="form-control form-control-sm"
													type="text"
													name="total"
													value={
														formChekData.total
													}
													onChange={
														handleChange
													}
												/>
											</div>

											<div
												style={{
													paddingTop: "1rem",
													display: "flex",
													gap: "0.5rem",
													justifyContent:
														"center",
												}}
											>
												<Button
													variant="info"
													onClick={
														handleBankShow
													}
												>
													<i className="fa-solid fa-building-columns bx-fw"></i>
												</Button>
												<Button
													variant="danger"
													onClick={() => {
														setFormChekData(
															{
																settlement_code:
																	"",
																id_bank: "",
																id_client:
																	"",
																references:
																	"",
																type: "deposito",
																number_check:
																	"",
																isEndorsed:
																	"false",
																toName: "",
																total: "",
															}
														);
														setCheckView(
															[]
														);
														setCheckData(
															[]
														);
													}}
												>
													<i className="fa-solid fa-brush bx-fw"></i>
												</Button>
												<Button
													variant="primary"
													onClick={handleAdd}
												>
													<i className="fa-solid fa-floppy-disk bx-fw"></i>
												</Button>
											</div>
										</div>
									</div>

									<Table
										striped
										bordered
										hover
										size="sm"
										className="mt-5 text-center"
										style={{ fontSize: "13px" }}
									>
										<thead>
											<tr>
												<th>Cliente</th>
												<th>Receptor</th>
												<th># Doc</th>
												<th>Banco</th>
												<th>Tipo Doc</th>
												<th>Total</th>
											</tr>
										</thead>
										<tbody>
											{checkView?.map(
												(check, index) => (
													<tr key={index}>
														<td>
															{
																check?.id_client
															}
														</td>
														<td>
															{
																check?.references
															}
														</td>
														<td>
															{
																check?.number_check
															}
														</td>
														<td>
															{
																check?.id_bank
															}
														</td>
														<td>
															{(check?.type).toUpperCase()}
														</td>
														<td>
															{" "}
															${" "}
															{
																check?.total
															}
														</td>
													</tr>
												)
											)}
										</tbody>
									</Table>
								</div>
							)}
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="warning" onClick={viewDeposit}>
						Registrar Depositos
					</Button>
					<Button variant="secondary" onClick={handleClose}>
						Close
					</Button>
					<Button
						variant="outline-danger"
						onClick={() => {
							resetAction();
						}}
					>
						Limpiar
					</Button>
					<Button
						variant="outline-success"
						type="submit"
						onClick={handleSubmit(onSubmit)}
					>
						Grabar
					</Button>
				</Modal.Footer>
			</Modal>

			<Modal show={showNewBank} onHide={handleBankClose} centered>
				<Modal.Header closeButton>
					<Modal.Title>Registro de Banco</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div
						style={{
							display: "flex",
							flexDirection: "row",
							gap: "2rem",
							justifyContent: "center",
						}}
					>
						<span> Nombre del Banco:</span>
						<input
							style={{ fontSize: "13px", width: "175px" }}
							className="form-control form-control-sm"
							type="text"
							name="name_bank"
							onChange={handleChangeBank}
						/>
					</div>
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleBankClose}>
						Cerrar
					</Button>
					<Button
						variant="primary"
						onClick={() => {
							newBank(dataBank);
						}}
					>
						Crear
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Cash;
