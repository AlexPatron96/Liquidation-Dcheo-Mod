import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

import { useForm } from "react-hook-form";
import date from "../../utils/date";
import Swal from "sweetalert2";
import ModalInvoiceTransac from "./ModalInvoiceTransac";
import { useDispatch, useSelector } from "react-redux";
import { delUpdateTransactionThunk } from "../../store/slices/transaccion.slice";

const Modaldetailprod = ({ onHide, show, data }) => {
	// console.log(data);
	const dispatch = useDispatch();
	const itemSelect = data;
	const userLoged = useSelector((state) => state.userLoged);
	const transaccion = itemSelect?.transactions;
	const item = data;
	const newPay = { active: true, item };
	const [modalTransaccionPay, setModalTransaccionPay] = useState(false);
	const [transacItem, setTransacItem] = useState({});
	// console.log(itemSelect);

	const deleteUpdateTransaction = (id) => {
		dispatch(delUpdateTransactionThunk(id));
		onHide();
	};
	const validador = /\(LIQ-\d+-\w{3}-\d{4}-\d{2}-\d{2}\)/;

	return (
		<div>
			<Modal
				show={show}
				onHide={onHide}
				centered
				size="xl"
				aria-labelledby="contained-modal-title-vcenter"
			>
				<Modal.Header>
					<Modal.Title id="contained-modal-title-vcenter">
						Detalle de Factura
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className="d-flex flex-column p-1">
						<h5 className="p-1 fs-3">Cliente</h5>
						<div className="d-flex gap-3 flex-row flex-wrap justify-content-between">
							<div className="text-center">
								<span>Nombre:</span>
								<h6>{itemSelect?.client?.fullname}</h6>
							</div>
							<div className="text-center">
								<span>Cedula O RUC:</span>
								<h6>{itemSelect?.client?.dni}</h6>
							</div>
							<div className="text-center">
								<span>Cod MV:</span>
								<h6>{itemSelect?.client?.code_external}</h6>
							</div>
							<div className="text-center">
								<span>Direccion:</span>
								<h6>{itemSelect?.client?.address}</h6>
							</div>
							<div className="d-flex flex-column">
								<span className="text-center">
									Ruta asignada
								</span>
								<div className="d-flex gap-4 text-center">
									<div>
										<span>Ruta:</span>
										<h6>
											{
												itemSelect?.client
													?.route_day
													?.id_route_route
													?.external_code
											}
										</h6>
									</div>
									<div>
										<span>Vendedor:</span>
										<h6>{itemSelect?.seller?.name}</h6>
									</div>
									<div>
										<span>Dia de venta:</span>
										<h6>
											{itemSelect?.client?.route_day?.day?.day.toUpperCase()}
										</h6>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div
						className="d-flex flex-column m-1 p-1 border-top"
						// style={{
						// 	display: "flex",
						// 	flexDirection: "column",
						// 	margin: "1rem 0",
						// 	padding: "1rem",
						// 	borderTop: "2px solid var(--color6)",
						// 	width: "100%",
						// }}
					>
						<h5 className="mt-3 fs-3">Factura o NV</h5>
						<div className="d-flex gap-4 flex-row flex-wrap justify-content-between text-center">
							<div>
								<span>Tipo de Documento:</span>
								<h6>
									{itemSelect?.isWhite === true
										? "Nota de venta"
										: "Factura"}
								</h6>
							</div>
							<div>
								<span># Documento:</span>
								<h6>{itemSelect?.num_bill}</h6>
							</div>
							<div>
								<span>Fecha de documento:</span>
								<h6>{itemSelect?.deliver_date}</h6>
							</div>
							<div>
								<span>Dias Facturada:</span>
								<h6
									style={{ fontSize: "18px" }}
									className={
										itemSelect?.balance === 0
											? "dateSaldoCero"
											: date.DatePastPresent(
													itemSelect?.deliver_date
											  ) >= 30
											? "dateRed"
											: date.DatePastPresent(
													itemSelect?.deliver_date
											  ) >= 15
											? "dateYellow"
											: "dateGreen"
									}
								>
									{`(${date.DatePastPresent(
										itemSelect?.deliver_date
									)})`}{" "}
									DIAS
								</h6>
							</div>
							<div>
								<span>Estado de Documento:</span>
								<h6>
									{itemSelect?.id_status === 1
										? "Pendiente - Sin ningun Abono"
										: itemSelect?.id_status === 2
										? "Abonada - Se han realizado Abonos"
										: "El Documento esta pagado en su totalidad"}
								</h6>
							</div>
							<div>
								<div className="d-flex gap-3">
									<div style={{ margin: "0 1rem" }}>
										<span>Valor Total:</span>
										<h6>
											${" "}
											{parseFloat(
												itemSelect?.total_bill
											).toFixed(2)}
										</h6>
									</div>
									<div style={{ margin: "0 1rem" }}>
										<span>Saldo:</span>
										<h6>
											${" "}
											{parseFloat(
												itemSelect?.balance
											).toFixed(2)}
										</h6>
									</div>
								</div>
							</div>
							<div>
								<span>Detalle de Documento:</span>
								<h6>{itemSelect?.detail}</h6>
							</div>
							<div>
								<span>Para cobro de Veh:</span>
								<h6>
									{itemSelect?.vehicle_liq
										? "Si  - Veh id" +
										  itemSelect?.vehicle_liq
										: "No"}
								</h6>
							</div>
						</div>
					</div>

					<div className="d-flex flex-column m-1 p-1 border-top">
						<h5 className="mt-3 fs-3">Transacciones</h5>
						{transaccion?.[0] ? null : (
							<div>No existe Transacciones</div>
						)}
						<div className="d-flex gap-3 flex-row flex-wrap justify-content-around align-items-lg-stretch">
							{transaccion?.map((trans, index) => (
								<div
									key={index}
									className={`${
										trans?.isDelete
											? "bg-danger bg-opacity-50 border-danger"
											: null
									}`}
									style={{
										border: "1px solid var(--color2)",
										borderRadius: "8px",
										padding: "0.5rem",
									}}
								>
									<span>#{index + 1}</span>
									<div
										style={{
											display: "flex",
											width: "320px",
											flexFlow: "row wrap",
											justifyContent:
												"space-between",
										}}
									>
										<div>
											<span>
												Fecha de Transaccion:
											</span>
											<h6>{trans?.balance_date}</h6>
										</div>
										<div>
											<span># Interno:</span>
											<h6>{trans?.id}</h6>
										</div>
										<div>
											<span>Realizado por:</span>
											<h6>
												Usuario:{" "}
												{
													trans?.id_user_user
														?.fullname
												}
											</h6>
										</div>
										<div>
											<span>
												Pertenece a #Documento:
											</span>
											<h6>{trans?.num_bill}</h6>
										</div>
										<div>
											<span>Valor:</span>
											<h6>
												${" "}
												{parseFloat(
													trans?.pay
												).toFixed(2)}
											</h6>
										</div>
										<div
											style={{
												borderTop:
													"2px solid var(--color6)",
												width: "100%",
											}}
										>
											<h6>Detalle:</h6>
											<span>{trans?.detail}</span>
										</div>
									</div>
									<div className="d-flex justify-content-center cont-btn-sigin">
										<div className="btn-group">
											{/* {validador.test(
												trans?.detail
											) ? (
												<>Permitir</>
											) : (
												<>No permitido</>
											)} */}
											{/\(LIQ-[A-Za-z0-9-]+-\d{4}-\d{2}-\d{2}\)/.test(
												trans?.detail
											) ? (
												<Button
													disabled
													size="sm"
													variant="danger"
												>
													No puedes Eliminar -
													Pertenece a una
													liquidacion.
												</Button>
											) : (
												<Button
													size="sm"
													onClick={() =>
														deleteUpdateTransaction(
															trans.id
														)
													}
													disabled={
														!userLoged.roll
															?.permissions
															?.edited_seller_maxtotal
															? true
															: trans?.isDelete
													}
													variant="danger"
												>
													<i className="fa-solid fa-trash bx-fw"></i>
												</Button>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				</Modal.Body>
				<Modal.Footer>
					{/* <Button variant='info' onClick={editAction}>{editTransaction ? "Editar" : "Dejar de editar"}</Button>
                    <Button onClick={onHide}>Cerrar</Button>
                    <Button variant="warning" type="submit" onClick={resetPay}>
                        Cancelar Pago
                    </Button>*/}
					<Button
						variant="success"
						type="submit"
						onClick={() => {
							setModalTransaccionPay(true);
						}}
					>
						<i className="fa-solid fa-dollar-sign bx-fw"></i>
						Pago o Abono
					</Button>
					<Button onClick={onHide}>Cerrar</Button>
				</Modal.Footer>
			</Modal>
			<ModalInvoiceTransac
				itemSelect={newPay}
				onhide={() => setModalTransaccionPay(false)}
				show={modalTransaccionPay}
			/>
		</div>
	);
};

export default Modaldetailprod;
