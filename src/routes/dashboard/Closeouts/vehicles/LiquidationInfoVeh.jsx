import React, { useEffect, useRef, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import date from "../../../../utils/date";
import imgView from "../../../../img/imgView.png";
import Swal from "sweetalert2";
import { getVehicleLiquidationThunk } from "../../../../store/slices/liquidationVehicle.slice";
import { getSellerThunk } from "../../../../store/slices/seller.slice";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";

const LiquidationInfoVeh = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		LiquidionVehView[0] ? null : dispatch(getVehicleLiquidationThunk());
		dispatch(getSellerThunk());
	}, []);

	const LiquidionVehView = useSelector((state) => state.liquidationVehicle);
	const seller = useSelector((state) => state.seller);
	// console.log(LiquidionVehView);

	// console.log(LiquidionVehView);

	const [clickView, setClickView] = useState(true);
	const [dataView, setDataView] = useState({});

	const clickViewAction = (itemSelect) => {
		clickView ? setClickView(false) : setClickView(true);
		dataView ? setDataView(itemSelect) : setDataView({});
		// console.log(itemSelect);
	};

	const printAction = (dataProcess) => {
		// console.log(dataProcess);
		let direccion = `/dashboard/liquidation/vehicle/print/${dataProcess?.settlement_code}`;
		let principal = {};
		principal.id_user = dataProcess?.user.id;
		principal.settlement_date = dataProcess?.settlement_date;
		principal.id_vehicle = dataProcess?.vehicle?.id;
		principal.balance_gen_veh = dataProcess?.balance_gen_veh;
		principal.settlement_code = dataProcess?.settlement_code;
		principal.box_small = dataProcess?.boxSmall;
		principal.total_delivery_bills = parseFloat(
			dataProcess?.total_delivery_bills
		);
		principal.total_collection_bills = parseFloat(
			dataProcess?.total_collection_bills
		);
		principal.total_sent = parseFloat(dataProcess?.total_sent);
		principal.total_money = parseFloat(dataProcess?.total_money) || 0;
		principal.total_discount = parseFloat(dataProcess?.total_discount) || 0;
		principal.total_expense = parseFloat(dataProcess?.total_expense) || 0;
		principal.total_product = parseFloat(dataProcess?.total_product) || 0;
		principal.total_credit = parseFloat(dataProcess?.total_credit) || 0;
		principal.total_received = parseFloat(dataProcess?.total_received) || 0;
		principal.balance = parseFloat(dataProcess?.balance);
		principal.detail = dataProcess?.detail;
		principal.isLiquidated = dataProcess?.isLiquidated;

		let arraySendLiq = [];
		arraySendLiq.push(dataProcess?.cash_veh?.[0]?.check_cash_veh || []);
		arraySendLiq.push(dataProcess?.discounts_veh || {});
		arraySendLiq.push(dataProcess?.expense_veh || {});
		arraySendLiq.push(dataProcess?.cash_veh || {});
		arraySendLiq.push(dataProcess?.products_returned || {});
		arraySendLiq.push(
			dataProcess?.products_returned?.bill_product_return || []
		);
		arraySendLiq.push(dataProcess || {});
		arraySendLiq.push(dataProcess?.bills_liquidation_vehs);
		arraySendLiq.push(dataProcess?.cash_veh?.[0]?.check_cash_veh || []);
		arraySendLiq.push(dataProcess?.delivered_credits || []);

		arraySendLiq.push(`${dataProcess?.settlement_code}`);
		arraySendLiq.push(`${dataProcess?.user?.username}`);
		arraySendLiq.push(`${dataProcess?.settlement_date}`);
		arraySendLiq.push(
			`${dataProcess?.vehicle.enrollment} - ${dataProcess?.vehicle.driver}`
		);
		arraySendLiq.push(principal);
		arraySendLiq.push(dataProcess?.balance);

		Swal.fire({
			title: "Informacion!",
			text: `Va a imprimir el siguiente Registro ${dataProcess?.settlement_code}, 
            OJO  puede que los abonos no se carguen de manera correcta, como en la Hoja de liquidacion original.`,
			icon: "question",
			showCancelButton: true,
			showConfirmButton: true,
			confirmButtonColor: "#029C63",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, Imprimir!",
			reverseButtons: true,
		}).then((result) => {
			if (result.isConfirmed) {
				sessionStorage.setItem(
					"printVehicle" + dataProcess?.settlement_code,
					JSON.stringify(arraySendLiq)
				);
				window.open(direccion, "", "height=600,width=1200,center");
			} else {
				Swal.fire({
					icon: "warning",
					title: "Cancelado!",
					text: "Se a cancelado la impresion del registro seleccionado.",
					showConfirmButton: false,
					timer: 1500,
				});
			}
		});
	};

	const sectionRef = useRef(null);

	const handleDownload = () => {
		html2canvas(sectionRef.current, { scale: 2, useCORS: true })
			.then((canvas) => {
				const imgData = canvas.toDataURL("image/png");
				const pdf = new jsPDF("p", "mm", "a4");
				const pdfWidth = pdf.internal.pageSize.getWidth();
				const pdfHeight = pdf.internal.pageSize.getHeight();
				const imgProps = pdf.getImageProperties(imgData);
				const pdfImageHeight =
					(imgProps.height * pdfWidth) / imgProps.width;
				pdf.addImage(
					imgData,
					"PNG",
					0,
					0,
					pdfWidth,
					pdfImageHeight,
					undefined,
					"FAST"
				);
				pdf.save("download.pdf");
			})
			.catch((error) => console.log(error));
	};

	return (
		<div>
			<h3 style={{ textAlign: "center" }}>LIQUIDACIONES REALIZADAS</h3>
			<div style={{ display: "flex", gap: "1.5rem", margin: "2rem 0" }}>
				<div
					style={{
						width: "50%",
						overflowY: "scroll",
						height: "500px",
						fontSize: "11px",
					}}
				>
					<Table striped bordered hover responsive size="sm">
						<thead>
							<tr>
								<th>#</th>
								<th>Usuario liquidador</th>
								<th>Fecha de Liquidacion</th>
								<th>Camion</th>
								<th>Cuadre</th>
								<th>Accion</th>
							</tr>
						</thead>
						<tbody>
							{LiquidionVehView.map((liq, index) => (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>
										<strong>
											{liq?.user?.fullname?.toUpperCase()}
										</strong>
									</td>[]
									<td>
										{date.convertirFechaUTCaLocal(
											liq?.createdAt
										)}{" "}
										-{" "}
										{/* {date.CurrendateDay(
											date.convertirFechaUTCaLocal(
												liq?.createdAt
											)
										)} */}
										{date.getDayOfWeek(
											date.convertirFechaUTCaLocal(
												liq?.createdAt
											)
										)}
									</td>
									<td>
										{liq?.vehicle?.driver} -{" "}
										{liq?.vehicle?.enrollment}
									</td>
									<td>
										${" "}
										{parseFloat(liq.balance).toFixed(
											2
										)}
									</td>
									<td>
										<div
											style={{
												display: "flex",
												flexDirection: "row",
												gap: "0.5rem",
												justifyContent: "center",
											}}
										>
											<div>
												<Button
													onClick={() => {
														printAction(
															liq
														);
													}}
													variant="info"
													style={{
														width: "40px",
														padding: "0.25rem",
													}}
												>
													<i className="fa-solid fa-print bx-fw"></i>
												</Button>
											</div>
											<div>
												<Button
													onClick={() => {
														clickViewAction(
															liq
														);
													}}
													variant="success"
													style={{
														width: "40px",
														padding: "0.25rem",
													}}
												>
													<i
														className={`fa-solid ${
															(dataView.settlement_code ||
																`001`) ===
																liq.settlement_code &&
															clickView ===
																false
																? "fa-eye-slash"
																: "fa-eye"
														} bx-fw`}
													></i>
												</Button>
											</div>
											{/* <div>
                                                    <button onClick={handleDownload}>Download PDF</button>

                                                </div> */}
										</div>
									</td>
								</tr>
							))}
						</tbody>
					</Table>
				</div>

				<div
					style={{
						width: "50%",
						border: "1px solid var(--color2)",
						borderRadius: "5px",
						padding: "1rem",
					}}
				>
					{clickView ? (
						<div
							style={{
								display: "flex",
								justifyContent: "center",
							}}
						>
							<img
								src={imgView}
								alt="image the view"
								style={{ width: "60%" }}
							/>
						</div>
					) : (
						<div ref={sectionRef}>
							<h3 style={{ textAlign: "center" }}>
								LIQUIDACION
							</h3>
							<h4 style={{ textAlign: "center" }}>
								Distribuidora DCheo
							</h4>
							<h4>Liquidacion de Vehiculos de entrega</h4>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
								}}
							>
								<div>
									<h5>
										Usuario:{" "}
										<span style={{ color: "#02B875" }}>
											{" "}
											{
												dataView?.user?.fullname
											}{" "}
										</span>{" "}
									</h5>
									<h5>
										Fecha de liquidacion:{" "}
										<span style={{ color: "#02B875" }}>
											{date.convertirFechaUTCaLocal(
												dataView?.createdAt
											)}{" "}
										</span>{" "}
									</h5>
									<h5>
										Se esta liquidando al Vehiculo:{" "}
										<span style={{ color: "#02B875" }}>
											{" "}
											{dataView?.vehicle.driver}
										</span>{" "}
									</h5>
									<h5>
										Codigo de Liquidacion:{" "}
										<span style={{ color: "#02B875" }}>
											{" "}
											{dataView?.settlement_code}
										</span>{" "}
									</h5>
								</div>

								<div
									style={{
										border: "2px solid grey",
										width: "225px",
										height: "150px",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										textAlign: "center",
									}}
								>
									<h5
										style={{
											fontSize: "50px",
											color: `${
												dataView?.balance_gen_veh >
												0
													? "#02B875"
													: dataView?.balance_gen_veh <
													  0
													? "#C20114"
													: "#02B875"
											}`,
										}}
									>
										{dataView?.balance_gen_veh > 0
											? "A FAVOR"
											: dataView?.balance_gen_veh <
											  0
											? "EN CONTRA"
											: "OK"}
									</h5>
									<h5>
										${" "}
										{parseFloat(
											dataView?.balance_gen_veh
										).toFixed(2)}
									</h5>
								</div>
							</div>
							<div style={{ margin: "1rem" }}>
								<div
									style={{
										display: "flex",
										flexWrap: "wrap",
										flexDirection: "row",
										gap: "1rem",
									}}
								>
									<Table
										striped
										bordered
										hover
										size="sm"
										style={{
											width: "700px",
											fontSize: "11px",
										}}
									>
										<thead>
											<tr>
												<th>#</th>
												<th>Cliente</th>
												<th># Documento</th>
												<th>Total</th>
												<th>Saldo Anterior</th>
												<th>Abono</th>
												<th>Saldo Nuevo</th>
											</tr>
										</thead>
										<tbody
											style={{ fontSize: "12px" }}
										>
											{dataView?.bills_liquidation_vehs?.map(
												(inv, index) => (
													<tr key={index}>
														<td>
															{index +
																1}
														</td>
														<td>
															{inv
																?.client
																?.fullname ||
																inv
																	?.id_bills_bill
																	?.client
																	?.fullname}
														</td>
														<td>
															{inv?.num_bill ||
																inv
																	?.id_bills_bill
																	?.num_bill}
														</td>
														<td>
															${" "}
															{inv?.total_bill ||
																inv
																	?.id_bills_bill
																	?.total_bill}
														</td>
														<td
															style={{
																textAlign:
																	"center",
															}}
														>
															${" "}
															{parseFloat(
																inv?.saldo
															).toFixed(
																2
															)}
														</td>
														<td
															style={{
																textAlign:
																	"center",
																borderRight: `4px solid ${
																	inv?.pass
																		? "#02B875"
																		: "#FFCCE5"
																} `,
															}}
														>
															${" "}
															{parseFloat(
																inv?.pass
															) || 0}
														</td>
														<td
															style={{
																textAlign:
																	"center",
																borderRight: `4px solid ${
																	inv?.pass
																		? "#02B875"
																		: "#FFCCE5"
																} `,
															}}
														>
															${" "}
															{parseFloat(
																inv?.pass
															) || 0}
														</td>
													</tr>
												)
											)}
										</tbody>
									</Table>
									<div
										style={{
											display: "flex",
											gap: "1rem",
											flexDirection: "row",
											width: "800px",
										}}
									>
										<div style={{ width: "180px" }}>
											<div
												style={{
													display: "flex",
													justifyContent:
														"space-between",
												}}
											>
												<span>
													T. Descuento:{" "}
												</span>
												<span>
													${" "}
													{parseFloat(
														dataView
															?.discounts_veh
															?.total_other
													).toFixed(2)}
												</span>
											</div>
											<div
												style={{
													display: "flex",
													justifyContent:
														"space-between",
												}}
											>
												<span>
													T. Productos:{" "}
												</span>
												<span>
													${" "}
													{parseFloat(
														dataView
															?.products_returned
															?.total
													).toFixed(2)}
												</span>
											</div>
											<div
												style={{
													display: "flex",
													justifyContent:
														"space-between",
												}}
											>
												<span>T. Gastos: </span>
												<span>
													${" "}
													{parseFloat(
														dataView
															?.expense_veh
															?.total
													).toFixed(2)}
												</span>
											</div>
											<div
												style={{
													display: "flex",
													justifyContent:
														"space-between",
												}}
											>
												<span>T. Dinero: </span>
												<span>
													${" "}
													{parseFloat(
														dataView
															?.cash_veh
															?.total
													).toFixed(2)}
												</span>
											</div>

											<div>
												<div
													style={{
														border: "1px solid var(--first-color) ",
														borderRadius:
															"5px",
													}}
												>
													Creditos Entregados
													{dataView?.delivered_credits?.map(
														(
															sell,
															index
														) => (
															<div
																key={
																	index
																}
																style={{
																	display: "flex",
																	justifyContent:
																		"space-between",
																}}
															>
																<span>
																	{
																		seller.filter(
																			(
																				seller
																			) =>
																				seller.id ===
																				parseInt(
																					sell
																						?.seller
																						?.id
																				)
																		)[0]
																			?.code
																	}{" "}
																	:
																</span>

																<span>
																	{" "}
																	$
																	{parseFloat(
																		sell?.total
																	).toFixed(
																		2
																	)}
																</span>
															</div>
														)
													)}
												</div>
											</div>
											<div
												style={{
													display: "flex",
													justifyContent:
														"space-between",
												}}
											>
												<span>Total: </span>
												<h5>
													${" "}
													{parseFloat(
														dataView?.total_received
													).toFixed(2)}
												</h5>
											</div>
										</div>

										<div style={{ width: "180px" }}>
											<div
												style={{
													display: "flex",
													justifyContent:
														"space-between",
												}}
											>
												<span>T. Cobrado: </span>
												<span>
													${" "}
													{parseFloat(
														dataView?.total_collection_bills
													).toFixed(2)}
												</span>
											</div>
											<div
												style={{
													display: "flex",
													justifyContent:
														"space-between",
												}}
											>
												<span>Caja Chica</span>
												<span>
													${" "}
													{
														dataView?.box_small
													}
												</span>
											</div>

											<div>
												<div
													style={{
														border: "1px solid var(--first-color) ",
														borderRadius:
															"5px",
													}}
												>
													Ventas
													{dataView?.delivered_credits?.map(
														(
															sell,
															index
														) => (
															<div
																key={
																	index
																}
																style={{
																	display: "flex",
																	justifyContent:
																		"space-between",
																}}
															>
																<span>
																	{
																		seller.filter(
																			(
																				seller
																			) =>
																				seller.id ===
																				parseInt(
																					sell
																						?.seller
																						?.id
																				)
																		)[0]
																			?.code
																	}{" "}
																	:
																</span>

																<span>
																	{" "}
																	$
																	{parseFloat(
																		sell?.sales
																	).toFixed(
																		2
																	)}
																</span>
															</div>
														)
													)}
												</div>
											</div>
											<div
												style={{
													display: "flex",
													justifyContent:
														"space-between",
												}}
											>
												<span>Total:</span>
												<h5>
													${" "}
													{parseFloat(
														dataView?.total_sent
													).toFixed(2)}
												</h5>
											</div>
										</div>

										<div
											style={{
												width: "180px",
												textAlign: "center",
											}}
										>
											<h4>Cuadre</h4>
											<h5>${dataView?.balance}</h5>
											<span
												style={{
													color: `${
														dataView?.balance >
														0
															? "#FFAC42"
															: dataView?.balance <
															  0
															? "#C20114"
															: "#02B875"
													}`,
													fontSize: "12px",
												}}
											>
												{dataView?.balance > 0
													? `El Vehiculo de entrega conducido por ${dataView?.vehicle?.driver} tiene un saldo a Favor`
													: dataView?.balance <
													  0
													? `El Vehiculo de entrega conducido por ${dataView?.vehicle?.driver} tiene un saldo en Contra`
													: `La liquidacion de el Vehiculo de entrega conducido por ${dataView?.vehicle?.driver} es Correcta`}
											</span>
										</div>
									</div>
								</div>

								<div
									style={{
										display: "flex",
										flexDirection: "row",
										gap: "1.75rem",
									}}
								>
									<div
										style={{
											width: "250px",
											height: "250px",
											display: "flex",
											flexDirection: "column",
											justifyContent:
												"space-between",
										}}
									>
										<h4 style={{ fontSize: "20px" }}>
											Dinero
										</h4>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-barcode bx-fw"></i>
												Cod:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												{
													dataView?.cash_veh
														?.settlement_code
												}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-coins bx-fw"></i>
												Monedas:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView?.cash_veh
														?.coin
												).toFixed(2)}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-regular fa-money-bill-1 bx-fw"></i>
												Billetes:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView?.cash_veh
														?.money
												).toFixed(2)}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-receipt bx-fw"></i>
												Depositos:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView?.cash_veh
														?.deposits_money
												).toFixed(2)}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-money-check bx-fw"></i>
												Cheques:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView?.cash_veh
														?.check_money
												).toFixed(2)}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-brands fa-stack-overflow bx-fw"></i>
												Total:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView?.cash_veh
														?.total
												).toFixed(2)}
											</div>
										</div>
									</div>

									<div
										style={{
											width: "250px",
											height: "250px",
											display: "flex",
											flexDirection: "column",
											justifyContent:
												"space-between",
										}}
									>
										<h4 style={{ fontSize: "20px" }}>
											Gastos
										</h4>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-barcode bx-fw"></i>
												Cod:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												{
													dataView
														?.expense_veh
														?.settlement_code
												}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-utensils bx-fw"></i>
												Alimentos:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView
														?.expense_veh
														?.feeding
												).toFixed(2)}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-car  bx-fw"></i>
												Viaticos:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView
														?.expense_veh
														?.perdiem
												).toFixed(2)}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-gas-pump bx-fw"></i>
												Combustible:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView
														?.expense_veh
														?.fuel
												).toFixed(2)}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-brands fa-stack-overflow bx-fw"></i>
												Total:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView
														?.expense_veh
														?.total
												).toFixed(2)}
											</div>
										</div>

										{/* <div style={{ display: "flex", flexDirection: "column" }}>
                                            
                                            Detalle:
                                            <div style={{ border: "2px solid grey", height: "100px", fontSize: "11px" }}>
                                                {expenses?.detail}
                                            </div>
                                        </div> */}
									</div>

									<div
										style={{
											width: "250px",
											height: "250px",
											display: "flex",
											flexDirection: "column",
											justifyContent:
												"space-between",
										}}
									>
										<h4 style={{ fontSize: "20px" }}>
											Descuentos
										</h4>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-barcode bx-fw"></i>
												Cod:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												{
													dataView
														?.discounts_veh
														?.settlement_code
												}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-tags bx-fw"></i>
												Descuentos:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView
														?.discounts_veh
														?.total_discount
												).toFixed(2)}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-retweet bx-fw"></i>
												Retenciones:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView
														?.discounts_veh
														?.retention
												).toFixed(2)}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-brands fa-stack-overflow bx-fw"></i>
												Total:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView
														?.discounts_veh
														?.total_other
												).toFixed(2)}
											</div>
										</div>

										{/* <div style={{ display: "flex", flexDirection: "column" }}>
                                            
                                            Detalle:
                                            <div style={{ border: "2px solid grey", height: "100px", fontSize: "11px" }}>
                                                {discount?.detail}
                                            </div>
                                        </div> */}
									</div>

									<div
										style={{
											width: "250px",
											height: "250px",
											display: "flex",
											flexDirection: "column",
											justifyContent:
												"space-between",
										}}
									>
										<h4 style={{ fontSize: "20px" }}>
											Productos
										</h4>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-barcode bx-fw"></i>
												Cod:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												{
													dataView
														?.products_returned
														?.settlement_code
												}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-house-crack bx-fw"></i>
												Dañados:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView
														?.products_returned
														?.disrepair
												).toFixed(2)}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-business-time bx-fw"></i>
												Caducados:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView
														?.products_returned
														?.expired
												).toFixed(2)}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
											}}
										>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												<i className="fa-solid fa-arrow-right-arrow-left bx-fw"></i>
												Retornados:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												${" "}
												{parseFloat(
													dataView
														?.products_returned
														?.rejected
												).toFixed(2)}
											</div>
										</div>

										<div
											style={{
												display: "flex",
												justifyContent:
													"space-between",
												fontSize: "14px",
											}}
										>
											{/********************** ojo revisar*/}
											<div>
												<i className="fa-brands fa-stack-overflow bx-fw"></i>
												Total:
											</div>
											<div>
												${" "}
												{parseFloat(
													dataView
														?.products_returned
														?.total
												).toFixed(2)}
											</div>
										</div>

										{/* <div style={{ display: "flex", flexDirection: "column" }}>
                                            
                                            Detalle:
                                            <div style={{ border: "2px solid grey", height: "100px", fontSize: "11px" }}>
                                                {discount?.detail}
                                            </div>
                                        </div> */}
									</div>
								</div>

								<div
									style={{
										display: "flex",
										gap: "1.5rem",
									}}
								>
									<div style={{ marginTop: "1rem" }}>
										<h4 style={{ fontSize: "16px" }}>
											Notas de Venta de P. R.
										</h4>
										<Table
											striped
											bordered
											hover
											size="sm"
											style={{
												width: "400px",
												fontSize: "10px",
											}}
										>
											<thead>
												<tr>
													<th>#</th>
													<th>Client</th>
													<th>#Documento</th>
													<th>Total</th>
													<th>Vendedor</th>
												</tr>
											</thead>
											<tbody
												style={{
													fontSize: "10px",
												}}
											>
												{dataView?.products_returned?.bill_product_return?.map(
													(inv, index) => (
														<tr
															key={
																index
															}
														>
															<td>
																{index +
																	1}
															</td>
															<td>
																{(
																	inv?.id_client ||
																	inv
																		?.id_bills_bill
																		?.client
																		?.full ||
																	inv
																		?.client
																		?.fullname
																)?.substring(
																	0,
																	15
																)}
															</td>
															<td>
																{inv?.num_bill ||
																	inv
																		?.id_bills_bill
																		?.num_bill}
															</td>
															<td>
																${" "}
																{inv?.total_bill ||
																	inv
																		?.id_bills_bill
																		?.total_bill}
															</td>
															<td
																style={{
																	borderRight: `4px solid var(--first-color) `,
																}}
															>
																{seller.filter(
																	(
																		seller
																	) =>
																		seller.id ===
																		parseInt(
																			inv?.id_seller
																		)
																)[0]
																	?.name ||
																	inv
																		?.id_bills_bill
																		?.seller
																		?.name}
															</td>
														</tr>
													)
												)}
											</tbody>
										</Table>
									</div>

									<div style={{ marginTop: "1rem" }}>
										<h4 style={{ fontSize: "16px" }}>
											Depositos o Cheques
										</h4>
										<Table
											striped
											bordered
											hover
											size="sm"
											style={{
												width: "400px",
												fontSize: "9px",
											}}
										>
											<thead>
												<tr>
													<th>Cliente</th>
													<th>Receptor</th>
													<th>#Doc</th>
													<th>Banco</th>
													<th>Tipo Doc</th>
													<th>Total</th>
												</tr>
											</thead>
											<tbody
												style={{
													fontSize: "10px",
												}}
											>
												{dataView?.cash_veh?.check_cash_veh?.map(
													(check, index) => (
														<tr
															key={
																index
															}
														>
															<td>
																{(check?.check_veh?.id_client_client?.fullname).substring(
																	0,
																	15
																)}
															</td>
															<td>
																{
																	check
																		?.check_veh
																		?.references
																}
															</td>
															<td>
																{
																	check
																		?.check_veh
																		?.number_check
																}
															</td>
															<td>
																{
																	check
																		?.check_veh
																		?.id_bank_bank
																		?.name_bank
																}
															</td>
															<td>
																{
																	check
																		?.check_veh
																		?.type
																}
															</td>
															<td>
																$
																{parseFloat(
																	check
																		?.check_veh
																		?.total
																).toFixed(
																	2
																)}
															</td>
														</tr>
													)
												)}
											</tbody>
										</Table>
									</div>
								</div>

								<div>
									<span
										style={{
											whiteSpace: "pre-wrap",
											fontSize: "12px",
										}}
									>
										{dataView?.detail}
									</span>
								</div>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default LiquidationInfoVeh;
