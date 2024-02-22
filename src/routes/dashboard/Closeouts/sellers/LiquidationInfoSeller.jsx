import React, { useEffect, useState } from "react";
import { Button, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import date from "../../../../utils/date";
import imgView from "../../../../img/imgView.png";
import Swal from "sweetalert2";
import { getSellerLiquidationThunk } from "../../../../store/slices/liquidation.slice";

const LiquidationInfoSeller = () => {
	const dispatch = useDispatch();
	useEffect(() => {
		LiquidionSellView[0] ? null : dispatch(getSellerLiquidationThunk());
	}, []);

	const LiquidionSellView = useSelector((state) => state.liquidation);
	//console.log(LiquidionSellView);

	const [clickView, setClickView] = useState(true);
	const [dataView, setDataView] = useState({});

	const clickViewAction = (itemSelect) => {
		clickView ? setClickView(false) : setClickView(true);
		dataView ? setDataView(itemSelect) : setDataView({});
		//console.log(itemSelect);
	};

	const printAction = (dataProcess) => {
		//console.log(dataProcess);
		let direccion = `/dashboard/liquidation/sellers/print/${dataProcess?.settlement_code}`;
		let principal = {};
		principal.id_user = dataProcess?.user.id;
		principal.id_seller = dataProcess?.seller.id;
		principal.balance_gen_sell = dataProcess?.balance_gen_sell;
		principal.settlement_code = dataProcess?.settlement_code;
		principal.total_collection_bills =
			(dataProcess?.total_collection_bills).toFixed(2);
		principal.total_money = parseFloat(dataProcess?.total_money) || 0;
		principal.total_expense = parseFloat(dataProcess?.total_expense) || 0;
		principal.total_discount = parseFloat(dataProcess?.total_discount) || 0;
		principal.total_received = dataProcess?.total_received || 0;
		principal.detail = dataProcess?.detail;
		principal.balance = dataProcess?.balance;
		principal.isLiquidated = false;

		let arraySendLiq = [];
		arraySendLiq.push(dataProcess?.cash_sell?.[0]?.check_cash_sell);
		arraySendLiq.push(dataProcess?.discounts_sell?.[0]);
		arraySendLiq.push(dataProcess?.expense_sell?.[0]);
		arraySendLiq.push(dataProcess?.cash_sell?.[0]);
		arraySendLiq.push(dataProcess || {});
		arraySendLiq.push(dataProcess?.bills_liquidation_sellers);
		arraySendLiq.push(dataProcess.settlement_code);
		arraySendLiq.push(`${dataProcess?.user.fullname}`);
		arraySendLiq.push(
			`${date.CurrendateDay().toUpperCase()} - ${date.Currendate()}`
		);
		arraySendLiq.push(
			`${dataProcess?.seller.code} - ${dataProcess?.seller.name}`
		);
		arraySendLiq.push(principal);
		arraySendLiq.push(dataProcess?.cash_sell?.[0]?.check_cash_sell);
		//console.log(dataProcess?.cash_sell?.[0].check_cash_sell);

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
					"printSeller",
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
	//BUENA LOGICA PARA ENCONTRAR TEXTO DENTRO DE MUCHOS ITEM DE UN ARREGLO
	function encontrarArreglo(texto, arreglos) {
		const encontrado = arreglos.filter((arreglo) =>
			arreglo?.detail?.includes(texto)
		);
		const result = parseFloat(encontrado[0]?.pay || 0).toFixed(2);
		return result;
	}
	return (
		<div>
			<h3 style={{ textAlign: "center" }}>LIQUIDACIONES REALIZADAS</h3>
			<div
				className="d-flex gap-4 m-2 align-items-start"
				// style={{ display: "flex", gap: "1.5rem", margin: "2rem 0" }}
			>
				<div
					className="w-50"
					style={{
						overflowY: "scroll",
						height: "500px",
					}}
				>
					<Table striped bordered hover responsive size="sm">
						<thead>
							<tr>
								<th>#</th>
								<th>Usuario liquidador</th>
								<th>Fecha de Liquidacion</th>
								<th>Vendedor</th>
								<th>Cuadre</th>
								<th>Accion</th>
							</tr>
						</thead>
						<tbody>
							{LiquidionSellView.map((liq, index) => (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>
										<strong>
											{liq?.user?.fullname?.toUpperCase()}
										</strong>
									</td>
									<td>
										{date.convertirFechaUTCaLocal(
											liq?.createdAt
										)}
										{" - "}
										{date.getDayOfWeek(
											date.convertirFechaUTCaLocal(
												liq?.createdAt
											)
										)}
									</td>
									<td>
										{liq?.seller.name} -{" "}
										{liq?.seller.code}
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
						<div>
							<h3 style={{ textAlign: "center" }}>
								LIQUIDACION
							</h3>
							<h4 style={{ textAlign: "center" }}>
								Distribuidora DCheo
							</h4>
							<h4>Liquidacion de Vendedores</h4>
							<div
								style={{
									display: "flex",
									flexDirection: "row",
									justifyContent: "space-between",
									alignItems: "center",
									fontSize: "12px",
								}}
							>
								<div>
									<h5 style={{ fontSize: "16px" }}>
										Usuario:{" "}
										<span
											style={{
												fontSize: "16px",
												color: "#02B875",
											}}
										>
											{" "}
											{
												dataView?.user?.fullname
											}{" "}
										</span>{" "}
									</h5>
									<h5 style={{ fontSize: "16px" }}>
										Fecha de liquidacion:{" "}
										<span style={{ color: "#02B875" }}>
											{date.convertirFechaUTCaLocal(
												dataView?.createdAt
											)}{" "}
										</span>{" "}
									</h5>
									<h5 style={{ fontSize: "16px" }}>
										Se esta liquidando al Vendedor:{" "}
										<span style={{ color: "#02B875" }}>
											{" "}
											{dataView?.seller.code} -{" "}
											{dataView?.seller?.name}
										</span>{" "}
									</h5>
									<h5 style={{ fontSize: "16px" }}>
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
										width: "200px",
										height: "125px",
										display: "flex",
										flexDirection: "column",
										justifyContent: "center",
										alignItems: "center",
										textAlign: "center",
									}}
								>
									<h5
										style={{
											fontSize: "40px",
											color: `${
												dataView?.balance_gen_sell >
												0
													? "#02B875"
													: dataView?.balance_gen_sell <
													  0
													? "#C20114"
													: "#02B875"
											}`,
										}}
									>
										{dataView?.balance_gen_sell > 0
											? "A FAVOR"
											: dataView?.balance_gen_sell <
											  0
											? "EN CONTRA"
											: "OK"}
									</h5>
									<h5>
										${" "}
										{parseFloat(
											dataView?.balance_gen_sell
										).toFixed(2)}
									</h5>
								</div>
							</div>

							<div
								id="contenido-a-imprimir"
								style={{ margin: "1rem" }}
							>
								<div
									style={{
										display: "flex",
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
											width: "1000px",
											fontSize: "11px",
										}}
									>
										<thead>
											<tr
												style={{
													textAlign: "center",
												}}
											>
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
											{dataView?.bills_liquidation_sellers.map(
												(inv, index) => (
													<tr key={index}>
														<td>
															{index +
																1}
														</td>
														<td
															style={{
																fontSize:
																	"10px",
															}}
														>
															{
																inv
																	?.id_bills_bill
																	.client
																	?.fullname
															}
														</td>
														<td
															style={{
																fontSize:
																	"10px",
															}}
														>
															{
																inv
																	?.id_bills_bill
																	?.num_bill
															}
														</td>
														<td
															style={{
																fontSize:
																	"10px",
															}}
														>
															${" "}
															{(inv?.id_bills_bill?.total_bill).toFixed(
																2
															)}
														</td>
														<td
															style={{
																fontSize:
																	"10px",
															}}
														>
															${" "}
															{inv?.saldo?.toFixed(
																2
															)}
														</td>
														<td
															style={{
																fontSize:
																	"10px",
															}}
														>
															${" "}
															{inv?.pass ===
															null
																? "0.00"
																: inv?.pass?.toFixed(
																		2
																  )}
														</td>
														{/* <td style={{ borderRight: `4px solid ${inv?.pago ? "#02B875" : "#FFCCE5"} ` }}>$ {(parseFloat(inv?.id_bills_bill.transaction?.[0].pay)) || 0}</td> */}
														{/* <td style={{ borderRight: `4px solid ${inv?.pass ? "#02B875" : "#FFCCE5"} ` }}>
                                                                $ {
                                                                    (inv?.pass === null ? "0.00" : parseFloat(inv?.pass).toFixed(2))
                                                                    // encontrarArreglo(dataView?. settlement_code, inv?.id_bills_bill?.transactions)
                                                                }
                                                            </td> */}
														<td
															style={{
																borderRight: `4px solid ${
																	inv?.pass
																		? "#02B875"
																		: "#FFCCE5"
																} `,
															}}
														>
															${" "}
															{inv?.pass ===
															null
																? "0.00"
																: (
																		parseFloat(
																			inv?.saldo
																		) -
																		parseFloat(
																			inv?.pass
																		)
																  ).toFixed(
																		2
																  )}
														</td>
													</tr>
												)
											)}
										</tbody>
									</Table>

									<div style={{ textAlign: "center" }}>
										<div>
											<h4
												style={{
													fontSize: "18px",
												}}
											>
												Total Cobrado
											</h4>
											<h5
												style={{
													fontSize: "16px",
												}}
											>
												${" "}
												{
													dataView?.total_collection_bills
												}
											</h5>
										</div>
										<div>
											<h4
												style={{
													fontSize: "18px",
												}}
											>
												Total Recibido
											</h4>
											<h5
												style={{
													fontSize: "16px",
												}}
											>
												${" "}
												{
													dataView?.total_received
												}
											</h5>
										</div>
										<div>
											<h4
												style={{
													fontSize: "18px",
												}}
											>
												Cuadre
											</h4>
											<h5
												style={{
													fontSize: "16px",
												}}
											>
												${dataView?.balance}
											</h5>
											<span
												style={{
													fontSize: "12px",
													color: `${
														dataView?.balance >
														0
															? "#FFAC42"
															: dataView?.balance <
															  0
															? "#C20114"
															: "#02B875"
													}`,
												}}
											>
												{dataView?.balance > 0
													? `El Vendedor ${dataView.seller.name} tiene un saldo a Favor`
													: dataView?.balance <
													  0
													? `El Vendedor ${dataView.seller.name} tiene un saldo en Contra`
													: `La liquidacion del ${dataView.seller.name} es Correcta`}
											</span>
										</div>
									</div>
								</div>

								<div
									style={{
										display: "flex",
										flexDirection: "row",
										gap: "3rem",
									}}
								>
									<div
										style={{
											width: "250px",
											height: "300px",
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
											<div>
												<i className="fa-solid fa-coins bx-fw"></i>
												Cod:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												{
													dataView
														?.cash_sell?.[0]
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
											<div>
												<i className="fa-solid fa-coins bx-fw"></i>
												Monedas:
											</div>
											<div>
												${" "}
												{parseFloat(
													dataView
														?.cash_sell?.[0]
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
											<div>
												<i className="fa-regular fa-money-bill-1 bx-fw"></i>
												Billetes:
											</div>
											<div>
												${" "}
												{parseFloat(
													dataView
														?.cash_sell?.[0]
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
											<div>
												<i className="fa-solid fa-receipt bx-fw"></i>
												Depositos:
											</div>
											<div>
												${" "}
												{parseFloat(
													dataView
														?.cash_sell?.[0]
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
											<div>
												<i className="fa-solid fa-receipt bx-fw"></i>
												Cheques:
											</div>
											<div>
												${" "}
												{parseFloat(
													dataView
														?.cash_sell?.[0]
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
											<div>
												<i className="fa-brands fa-stack-overflow bx-fw"></i>
												Total:
											</div>
											<div>
												${" "}
												{parseFloat(
													dataView
														?.cash_sell?.[0]
														?.total
												).toFixed(2)}
											</div>
										</div>

										{/* <div style={{ display: "flex", flexDirection: "column" }}>
                                                
                                                Detalle:
                                                <div style={{ border: "2px solid grey", height: "100px", fontSize: "11px" }}>
                                                    {dataView?.cash_sell?.[0].detail}
                                                </div>
                                            </div> */}
									</div>

									<div
										style={{
											width: "250px",
											height: "300px",
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
											<div>
												<i className="fa-solid fa-coins bx-fw"></i>
												Cod:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												{
													dataView
														?.expense_sell?.[0]
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
											<div>
												<i className="fa-solid fa-utensils bx-fw"></i>
												Alimentos:
											</div>
											<div>
												${" "}
												{parseFloat(
													dataView
														?.expense_sell?.[0]
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
											<div>
												<i className="fa-solid fa-car  bx-fw"></i>
												Viaticos:
											</div>
											<div>
												${" "}
												{parseFloat(
													dataView
														?.expense_sell?.[0]
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
											<div>
												<i className="fa-solid fa-gas-pump bx-fw"></i>
												Combustible:
											</div>
											<div>
												${" "}
												{parseFloat(
													dataView
														?.expense_sell?.[0]
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
											<div>
												<i className="fa-brands fa-stack-overflow bx-fw"></i>
												Total:
											</div>
											<div>
												${" "}
												{parseFloat(
													dataView
														?.expense_sell?.[0]
														?.total
												).toFixed(2)}
											</div>
										</div>

										{/* <div style={{ display: "flex", flexDirection: "column" }}>
                                                
                                                Detalle:
                                                <div style={{ border: "2px solid grey", height: "100px", fontSize: "11px" }}>
                                                    {dataView?.expense_sell?.[0].detail}
                                                </div>
                                            </div> */}
									</div>

									<div
										style={{
											width: "250px",
											height: "300px",
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
											<div>
												<i className="fa-solid fa-coins bx-fw"></i>
												Cod:
											</div>
											<div
												style={{
													fontSize: "12px",
												}}
											>
												{
													dataView
														?.discounts_sell?.[0]
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
											<div>
												<i className="fa-solid fa-tags bx-fw"></i>
												Descuentos:
											</div>
											<div>
												${" "}
												{parseFloat(
													dataView
														?.discounts_sell?.[0]
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
											<div>
												<i className="fa-solid fa-retweet bx-fw"></i>
												Retenciones:
											</div>
											<div>
												${" "}
												{parseFloat(
													dataView
														?.discounts_sell?.[0]
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
											<div>
												<i className="fa-brands fa-stack-overflow bx-fw"></i>
												Total:
											</div>
											<div>
												${" "}
												{parseFloat(
													dataView
														?.discounts_sell?.[0]
														?.total_other
												).toFixed(2)}
											</div>
										</div>

										{/* <div style={{ display: "flex", flexDirection: "column" }}>
                                                Detalle:
                                                <div style={{ border: "2px solid grey", height: "100px", fontSize: "11px" }}>
                                                    {dataView?.discounts_sell?.[0].detail}
                                                </div>
                                            </div> */}
									</div>
								</div>

								<div style={{ marginTop: "1rem" }}>
									<h4>Depositos o Cheques</h4>
									<Table
										striped
										bordered
										size="sm"
										hover
										style={{ width: "100%" }}
									>
										<thead>
											<tr>
												<th
													style={{
														fontSize:
															"12px",
													}}
												>
													Cliente
												</th>
												<th
													style={{
														fontSize:
															"12px",
													}}
												>
													Receptor
												</th>
												<th
													style={{
														fontSize:
															"12px",
													}}
												>
													# Doc
												</th>
												<th
													style={{
														fontSize:
															"12px",
													}}
												>
													Banco
												</th>
												<th
													style={{
														fontSize:
															"12px",
													}}
												>
													Tipo Doc
												</th>
												<th
													style={{
														fontSize:
															"12px",
													}}
												>
													Total
												</th>
											</tr>
										</thead>
										<tbody
											style={{ fontSize: "12px" }}
										>
											{dataView?.cash_sell?.[0]?.check_cash_sell?.map(
												(check, index) => (
													<tr key={index}>
														<td
															style={{
																fontSize:
																	"10px",
															}}
														>
															{
																check
																	?.check_sell
																	?.id_client_client
																	?.fullname
															}
														</td>
														<td
															style={{
																fontSize:
																	"10px",
															}}
														>
															{
																check
																	?.check_sell
																	?.references
															}
														</td>
														<td
															style={{
																fontSize:
																	"10px",
															}}
														>
															{
																check
																	?.check_sell
																	?.number_check
															}
														</td>
														<td
															style={{
																fontSize:
																	"10px",
															}}
														>
															{
																check
																	?.check_sell
																	?.id_bank_bank
																	?.name_bank
															}
														</td>
														<td
															style={{
																fontSize:
																	"10px",
															}}
														>
															{
																check
																	?.check_sell
																	?.type
															}
														</td>
														<td
															style={{
																fontSize:
																	"10px",
															}}
														>
															${" "}
															{parseFloat(
																check
																	?.check_sell
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
								<span style={{ whiteSpace: "pre-wrap" }}>
									{dataView?.detail}
								</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default LiquidationInfoSeller;
