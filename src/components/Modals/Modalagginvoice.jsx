import React, { useEffect, useState } from "react";
import { ListGroup, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from "react-redux";
import LoadingScreen from "../../layout/LoadingScreen";
import { setPagination } from "../../store/slices/pagination.slice";
import Paginationdesign from "../Paginationdesign";
import Buttonatom from "../atom/Buttonatom";
import Functionalitiesbtn from "../atom/Functionalitiesbtn";
import { getInvoiceThunk, setInvoice } from "../../store/slices/invoice.slice";
import { useParams } from "react-router-dom";
import { setDataTemp } from "../../store/slices/dataTemp.slice";

const Modalagginvoice = ({
	data,
	showAggInvoice,
	setShowAggInvoice,
	aggInvoice,
	type,
}) => {
	const { id: sellerByLiqui } = useParams();
	const dispatch = useDispatch();
	const invoiceSaldo = data.filter((inv) => {
		return inv.balance > 0;
	});
	const invSeller =
		type === "seller"
			? invoiceSaldo.filter(
					(inv) =>
						parseInt(inv?.seller?.id) === parseInt(sellerByLiqui)
			  )
			: invoiceSaldo;

	const [pagination, setPagination] = useState(invoiceSaldo);
	const loading = useSelector((state) => state.isLoading);
	const seller = useSelector((state) => state.seller);

	const setRefresh = () => {
		dispatch(getInvoiceThunk());
		setPagination(invSeller);
	};

	const allInv = () => {
		setPagination(invSeller);
	};

	const btnReset = () => {
		return (
			<>
				<Buttonatom
					created={() => setRefresh()}
					title={"Actualizar"}
					color={"info"}
					ico={"fa-sync bx-spin-hover"}
				/>
				<Buttonatom
					created={() => allInv()}
					title={"Todos"}
					color={"info"}
					ico={"fa-circle-check fa-beat"}
				/>
			</>
		);
	};
	const handleInv = (e) => {
		const { name, value } = e.target;
		//console.log(value);
		if (name === "id_day") {
			dayinvoSelect(value);
		} else {
			sellInvoSelect(value);
		}
	};

	const dayinvoSelect = async (day) => {
		const invDay =
			type === "seller"
				? invSeller.filter(
						(inv) =>
							(inv?.client?.route_day?.day?.day).toLowerCase() ===
							day.toLowerCase()
				  )
				: invoiceSaldo.filter(
						(inv) =>
							(inv?.client?.route_day?.day?.day).toLowerCase() ===
							day.toLowerCase()
				  );
		return setPagination(invDay);
	};

	const sellInvoSelect = async (sellID) => {
		const invSell = pagination.filter(
			(inv) => parseInt(inv?.seller?.id) === parseInt(sellID)
		);
		return setPagination(invSell);
	};

	const listDay = () => {
		return (
			<>
				<select
					name="id_day"
					className="form-select h-25"
					style={{
						padding: "1px",
						paddingRight: "18px",
						width: "110px",
						backgroundPosition: "right 0.1rem center",
						fontSize: "13px",
					}}
					onChange={(e) => handleInv(e)}
				>
					<option>Selecione</option>
					<option value={"lunes"}>LUNES</option>
					<option value={"martes"}>MARTES</option>
					<option value={"miercoles"}>MIERCOLES</option>
					<option value={"jueves"}>JUEVES</option>
					<option value={"viernes"}>VIERNES</option>
					<option value={"sabado"}>SABADO</option>
					<option value={"domingo"}>DOMINGO</option>
				</select>

				{type === "seller" ? null : (
					<select
						name="id_seller"
						className="form-select h-25"
						style={{
							padding: "1px",
							paddingRight: "18px",
							width: "110px",
							backgroundPosition: "right 0.1rem center",
							fontSize: "13px",
						}}
						onChange={(e) => handleInv(e)}
					>
						{seller.map((sell, index) => (
							<option key={index} value={sell?.id}>
								{sell?.name}
							</option>
						))}
					</select>
				)}
			</>
		);
	};

	const search = (data) => {
		const filteredList = invoiceSaldo.filter(
			(item) =>
				item?.num_bill?.toLowerCase().includes(data?.toLowerCase()) ||
				item?.client?.fullname
					?.toLowerCase()
					.includes(data?.toLowerCase()) ||
				item?.client?.route_day?.day?.day
					?.toLowerCase()
					.includes(data?.toLowerCase()) ||
				item?.client?.route_day?.id_route_route?.external_code
					?.toLowerCase()
					.includes(data?.toLowerCase()) ||
				(item?.client?.dni).includes(data) ||
				item?.num_bill?.includes(data) ||
				(item?.deliver_date).includes(data) ||
				item?.seller?.name?.toLowerCase().includes(data?.toLowerCase())
		);
		dispatch(setPagination(filteredList));
		////console.log(filteredList);
	};
	const handleClose = () => setShowAggInvoice(false);
	// const handleShow = () => setShowAggInvoice(true);
	const [selectedInvoices, setSelectedInvoices] = useState([]);
	const [checkSelectedID, setCheckSelectedID] = useState([]);

	const selectInvoice = () => {
		aggInvoice(selectedInvoices);
		setSelectedInvoices([]);
		setCheckSelectedID([]);
	};

	const handleAddInvoice = (e, item) => {
		const { checked, value, name } = e.target;
		//console.log(selectedInvoices);
		//console.log(checkSelectedID);

		if (value === "todos") {
			const ids = item.map((obj) => obj.id.toString());
			if (checked) {
				setSelectedInvoices(item);
				setCheckSelectedID(ids);
			} else {
				setSelectedInvoices([]);
				setCheckSelectedID([]);
			}
		} else {
			if (checked) {
				setSelectedInvoices([...selectedInvoices, item]);
				setCheckSelectedID((prevState) => [...prevState, value]);
			} else {
				setSelectedInvoices(
					selectedInvoices.filter(
						(selectedItem) => selectedItem.id !== item.id
					)
				);
				setCheckSelectedID(
					checkSelectedID.filter(
						(selectedItem) =>
							selectedItem?.toString() !== item.id?.toString()
					)
				);
			}
		}
	};

	return (
		<div>
			<Modal
				show={showAggInvoice}
				onHide={handleClose}
				centered
				size="xl"
				aria-labelledby="contained-modal-title-vcenter"
			>
				<Modal.Header closeButton>
					<Modal.Title>Anadir Facturas para liquidar</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div>
						<Functionalitiesbtn
							buttons={btnReset}
							search={search}
							filterList={listDay}
						/>
					</div>
					<div
						className="table-container"
						style={{ height: "350px" }}
					>
						<Table
							striped
							bordered
							hover
							size="sm"
							style={{
								width: "1024px",
								fontSize: "12px",
								textAlign: "center",
							}}
						>
							<thead>
								<tr>
									<th style={{ width: "30px" }}>
										<input
											type="checkbox"
											name="id_select"
											value={"todos"}
											// checked={(checkSelectedID.includes((item.id).toString()))}
											onChange={(e) =>
												handleAddInvoice(
													e,
													pagination
												)
											}
										/>
									</th>
									<th style={{ width: "30px" }}>#</th>
									<th style={{ width: "40px" }}>ID</th>
									<th style={{ width: "170px" }}>
										Cliente
									</th>
									<th style={{ width: "170px" }}>Dia</th>
									<th style={{ width: "210px" }}>
										# Factura
									</th>
									<th style={{ width: "50px" }}>
										Estatus
									</th>
									<th style={{ width: "70px" }}>Total</th>
									<th style={{ width: "70px" }}>Saldo</th>
									<th style={{ width: "80px" }}>
										Vendedor
									</th>
								</tr>
							</thead>
							<tbody>
								{pagination.map((item, index) => (
									<tr key={item.id}>
										<td>
											<input
												type="checkbox"
												name="id_select"
												value={item.id}
												checked={checkSelectedID.includes(
													item.id.toString()
												)}
												onChange={(e) =>
													handleAddInvoice(
														e,
														item
													)
												}
											/>
										</td>
										<td>{index + 1}</td>
										<td>{item.id}</td>
										<td>{item.client?.fullname}</td>
										<td>
											{item.client?.route_day?.day?.day?.toUpperCase()}
										</td>
										<td>{item.num_bill}</td>
										{/* <td>{item.id_status}</td> */}
										<td>
											{item?.id_status === 1
												? "Pendiente"
												: item?.id_status === 2
												? "Abonada"
												: "Pagada"}
										</td>
										<td>
											<h5
												style={{
													fontSize: "11px",
												}}
											>
												$ {item.total_bill}
											</h5>
										</td>
										<td style={{ fontSize: "11px" }}>
											$ {item.balance}
										</td>
										<td>{item.seller?.name}</td>
									</tr>
								))}
							</tbody>
						</Table>
					</div>
					{/* {!loading ? <Paginationdesign
                        data={"temporary"}
                    />
                        : <LoadingScreen />
                    } */}
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={handleClose}>
						{/* disabled={(selectedInvoices).length > 0 ? true : false} */}
						Cerrar
					</Button>
					<Button variant="primary" onClick={() => selectInvoice()}>
						Agregar
					</Button>
				</Modal.Footer>
			</Modal>
		</div>
	);
};

export default Modalagginvoice;
