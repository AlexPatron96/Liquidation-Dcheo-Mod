import React, { useEffect, useRef, useState } from "react";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getSellerThunk } from "../../store/slices/seller.slice";

const LiquidationVehiclePdf = () => {
	const { id: idVehicleByLiqui } = useParams();

	const dispatch = useDispatch();
	useEffect(() => {
		// window.print();
		dispatch(getSellerThunk());
	}, []);

	const seller = useSelector((state) => state.seller);
	const data = JSON.parse(
		sessionStorage.getItem("printVehicle" + idVehicleByLiqui)
	);
	console.log(data);
	const checkMoney = data?.[8];
	const discount = data?.[1];
	const expenses = data?.[2];
	const cash = data?.[3];
	const productReturn = data?.[4];
	const productReturnInvoice = data?.[5];
	const transaction = data?.[6];
	const invoice = data?.[7];
	const sellerDeliverCred = data?.[9];
	const codLiq = data?.[10];
	const user = data?.[11];
	const date = data?.[12];
	const vehicle = data?.[13];
	const principal = data?.[14];

	return (
		<div>
			<h3 style={{ textAlign: "center", fontSize: "20px" }}>LIQUIDACION</h3>
			<h4 style={{ textAlign: "center", fontSize: "20px" }}>
				Distribuidora DCheo
			</h4>
			<h4 style={{ fontSize: "20px" }}>
				Liquidacion de Vehiculos de entrega
			</h4>
			<div
				style={{
					display: "flex",
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<div>
					<h5 style={{ fontSize: "16px" }}>
						Usuario:{" "}
						<span style={{ color: "#02B875" }}> {user} </span>{" "}
					</h5>
					<h5 style={{ fontSize: "16px" }}>
						Fecha de liquidacion:{" "}
						<span style={{ color: "#02B875" }}>{date} </span>{" "}
					</h5>
					<h5 style={{ fontSize: "16px" }}>
						Se esta liquidando al Vehiculo:{" "}
						<span style={{ color: "#02B875" }}> {vehicle}</span>{" "}
					</h5>
					<h5 style={{ fontSize: "16px" }}>
						Codigo de Liquidacion:{" "}
						<span style={{ color: "#02B875" }}> {codLiq}</span>{" "}
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
							fontSize: "30px",
							color: `${
								principal?.balance_gen_veh > 0
									? "#02B875"
									: principal?.balance_gen_veh < 0
									? "#C20114"
									: "#02B875"
							}`,
						}}
					>
						{principal?.balance_gen_veh > 0
							? "A FAVOR"
							: principal?.balance_gen_veh < 0
							? "EN CONTRA"
							: "OK"}
					</h5>
					<h5>
						$ {parseFloat(principal?.balance_gen_veh).toFixed(2)}
					</h5>
				</div>
			</div>

			<div>
				<div className="d-flex gap-4 align-items-start mt-4 border-top pt-4">
					<Table
						striped
						bordered
						hover
						size="sm"
						className="mt-3"
						style={{
							width: "1200px",
							textAlign: "center",
							fontSize: "10px",
						}}
					>
						<thead>
							<tr>
								<th>#</th>
								<th>Cliente</th>
								<th># Documento</th>
								<th>Total</th>
								<th>Saldo Ant</th>
								<th>Abono</th>
								<th>Saldo Nuev</th>
							</tr>
						</thead>
						<tbody>
							{invoice?.map((inv, index) => (
								<tr key={index}>
									<td>{index + 1}</td>
									<td>
										{inv?.client?.fullname ||
											inv?.id_bills_bill.client
												?.fullname}
									</td>
									<td
										style={{
											fontSize: "8px",
										}}
									>
										{inv?.num_bill ||
											inv?.id_bills_bill.num_bill}
									</td>
									<td>
										${" "}
										{inv?.total_bill ||
											inv?.id_bills_bill.total_bill}
									</td>
									<td>
										${" "}
										{parseFloat(inv?.balance) ||
											inv?.id_bills_bill.balance}
									</td>
									<td
										style={{
											borderRight: `4px solid ${
												inv?.pago || inv?.pass
													? "#02B875"
													: "#FFCCE5"
											} `,
										}}
									>
										${" "}
										{isNaN(parseFloat(inv?.pago)) &&
										isNaN(parseFloat(inv?.pass))
											? 0
											: parseFloat(
													inv?.pago
											  ).toFixed(2)}
										{/* {parseFloat(inv?.pago).toFixed(
											2
										) ||
											parseFloat(inv?.pass).toFixed(
												2
											) ||
											0} */}
									</td>
									<td
										style={{
											borderRight: `4px solid ${
												inv?.pago || inv?.pass
													? "#02B875"
													: "#FFCCE5"
											} `,
										}}
									>
										${" "}
										{(() => {
											const balance =
												parseFloat(
													inv?.balance
												) ||
												parseFloat(
													inv?.id_bills_bill
														.balance
												) ||
												0;
											const pago =
												parseFloat(inv?.pago) ||
												parseFloat(inv?.pass) ||
												0;
											const result = balance - pago;
											const formattedResult = isNaN(
												result
											)
												? 0
												: result.toFixed(2);

											return formattedResult;
										})()}
										{/* {(parseFloat(inv?.balance).toFixed(
											2
										) ||
											parseFloat(
												inv?.id_bills_bill
													.balance
											).toFixed(2)) -
											(parseFloat(
												inv?.pago
											).toFixed(2) ||
												parseFloat(
													inv?.pass
												).toFixed(2)) || 0} */}
									</td>
								</tr>
							))}
						</tbody>
					</Table>

					<div
						className="d-flex flex-column"
						style={{ width: "250px" }}
					>
						<div className="d-flex flex-row flex-wrap gap-3 justify-content-center">
							<div style={{ width: "100%" }}>
								<div
									className="d-flex justify-content-between"
									style={{ fontSize: "12px" }}
								>
									<span>T. Descuento: </span>
									<span>
										${" "}
										{parseFloat(
											discount?.total_other
										).toFixed(2)}
									</span>
								</div>
								<div
									className="d-flex justify-content-between"
									style={{ fontSize: "12px" }}
								>
									<span>T. Productos: </span>
									<span>
										${" "}
										{parseFloat(
											productReturn?.total
										).toFixed(2)}
									</span>
								</div>
								<div
									className="d-flex justify-content-between"
									style={{ fontSize: "12px" }}
								>
									<span>T. Gastos: </span>
									<span>
										${" "}
										{parseFloat(
											expenses?.total
										).toFixed(2)}
									</span>
								</div>
								<div
									className="d-flex justify-content-between"
									style={{ fontSize: "12px" }}
								>
									<span>T. Dinero: </span>
									<span>
										${" "}
										{parseFloat(cash?.total).toFixed(
											2
										)}
									</span>
								</div>

								<div
									className="d-flex justify-content-between fw-bold w-100"
									style={{ fontSize: "13px" }}
								>
									<div
										style={{
											border: "1px solid var(--first-color) ",
											borderRadius: "5px",
											width: "100%",
										}}
									>
										Creditos Entregados
										{sellerDeliverCred.map(
											(sell, index) => (
												<div
													key={index}
													// className="d-flex"
													style={{
														display: "flex",
														justifyContent:
															"space-between",
														width: "100%",
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
																		sell?.id_seller
																	)
															)[0]?.code
														}{" "}
														:
													</span>
													{/* <h5>{console.log(seller)} :</h5> */}

													<span>
														{" "}
														$
														{parseFloat(
															sell?.total
														).toFixed(2)}
													</span>
												</div>
											)
										)}
									</div>
								</div>

								<div
									className="d-flex justify-content-between fw-bold"
									style={{ fontSize: "16px" }}
								>
									<span>Total: </span>
									<h6>
										${" "}
										{parseFloat(
											principal?.total_received
										).toFixed(2)}
									</h6>
								</div>
							</div>

							<div style={{ width: "100%" }}>
								<div
									className="d-flex justify-content-between"
									style={{ fontSize: "12px" }}
								>
									<span>T. Cobrado: </span>
									<span>
										${" "}
										{parseFloat(
											principal?.total_collection_bills
										).toFixed(2)}
									</span>
								</div>
								<div
									className="d-flex justify-content-between"
									style={{ fontSize: "12px" }}
								>
									<span>Caja Chica</span>
									<span>$ {principal?.box_small}</span>
								</div>
								<div
									className="d-flex justify-content-between fw-bold"
									style={{ fontSize: "13px" }}
								>
									<div
										style={{
											border: "1px solid var(--first-color) ",
											borderRadius: "5px",
											width: "100%",
										}}
									>
										Ventas
										{sellerDeliverCred.map(
											(sell, index) => (
												<div
													key={index}
													style={{
														display: "flex",
														justifyContent:
															"space-between",
														width: "100%",
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
																		sell?.id_seller
																	)
															)[0]?.code
														}{" "}
														:
													</span>
													{/* <h5>{console.log(seller)} :</h5> */}

													<span>
														{" "}
														$
														{parseFloat(
															sell?.sales
														).toFixed(2)}
													</span>
												</div>
											)
										)}
									</div>
								</div>
								<div
									style={{
										display: "flex",
										justifyContent: "space-between",
									}}
								>
									<span>Total:</span>
									<h6>
										${" "}
										{parseFloat(
											principal?.total_sent
										).toFixed(2)}
									</h6>
								</div>
							</div>
						</div>

						<div
							className="text-center"
							style={{ height: "100px" }}
						>
							<div>
								<div style={{ fontSize: "16px" }}>
									Cuadre
								</div>
								<div style={{ fontSize: "15px" }}>
									$
									{parseFloat(principal?.balance).toFixed(
										2
									)}
								</div>
							</div>
							<div
								style={{
									color: `${
										principal?.balance > 0
											? "#FFAC42"
											: principal?.balance < 0
											? "#C20114"
											: "#02B875"
									}`,
									fontSize: "11px",
								}}
							>
								{principal?.balance > 0
									? `El Vehiculo de entrega conducido por ${vehicle} tiene un saldo a Favor`
									: principal?.balance < 0
									? `El Vehiculo de entrega conducido por ${vehicle} tiene un saldo en Contra`
									: `La liquidacion de el Vehiculo de entrega conducido por ${vehicle} es Correcta`}
							</div>
						</div>
					</div>
				</div>

				<div
					className="d-flex align-items-start flex-row gap-5  mt-3 border-top"
					// style={{ display: "flex" }}
				>
					<div
						className="gap-2 mt-3"
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<h4 style={{ fontSize: "18px" }}>Dinero</h4>

						<div className="d-flex justify-content-between ">
							<div style={{ fontSize: "13px" }}>
								<i className="fa-solid fa-barcode bx-fw"></i>
								Cod:
							</div>
							<div style={{ fontSize: "12px" }}>
								{cash?.settlement_code}
							</div>
						</div>

						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							<div>
								<i className="fa-solid fa-coins bx-fw"></i>
								Monedas:
							</div>
							<div>$ {parseFloat(cash?.coin).toFixed(2)}</div>
						</div>

						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							{" "}
							<div>
								<i className="fa-regular fa-money-bill-1 bx-fw"></i>
								Billetes:
							</div>
							<div>$ {parseFloat(cash?.money).toFixed(2)}</div>
						</div>

						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							{" "}
							<div>
								<i className="fa-solid fa-receipt bx-fw"></i>
								Depositos:
							</div>
							<div>
								${" "}
								{parseFloat(cash?.deposits_money).toFixed(2)}
							</div>
						</div>

						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							{" "}
							<div>
								<i className="fa-solid fa-money-check bx-fw"></i>
								Cheques:
							</div>
							<div>
								$ {parseFloat(cash?.check_money).toFixed(2)}
							</div>
						</div>

						<div
							className="d-flex justify-content-between fw-bold"
							style={{ fontSize: "14px" }}
						>
							{" "}
							<div>
								<i className="fa-brands fa-stack-overflow bx-fw"></i>
								Total:
							</div>
							<div>$ {parseFloat(cash?.total).toFixed(2)}</div>
						</div>
					</div>

					<div
						className="gap-2 mt-3"
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<h4 style={{ fontSize: "18px" }}>Gastos</h4>
						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							{" "}
							<div>
								<i className="fa-solid fa-barcode bx-fw"></i>
								Cod:
							</div>
							<div style={{ fontSize: "12px" }}>
								{expenses?.settlement_code}
							</div>
						</div>

						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							{" "}
							<div>
								<i className="fa-solid fa-utensils bx-fw"></i>
								Alimentos:
							</div>
							<div>
								$ {parseFloat(expenses?.feeding).toFixed(2)}
							</div>
						</div>

						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							{" "}
							<div>
								<i className="fa-solid fa-car  bx-fw"></i>
								Viaticos:
							</div>
							<div>
								$ {parseFloat(expenses?.perdiem).toFixed(2)}
							</div>
						</div>

						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							{" "}
							<div>
								<i className="fa-solid fa-gas-pump bx-fw"></i>
								Combustible:
							</div>
							<div>
								$ {parseFloat(expenses?.fuel).toFixed(2)}
							</div>
						</div>

						<div
							className="d-flex justify-content-between fw-bold"
							style={{ fontSize: "14px" }}
						>
							{" "}
							<div>
								<i className="fa-brands fa-stack-overflow bx-fw"></i>
								Total:
							</div>
							<div>
								$ {parseFloat(expenses?.total).toFixed(2)}
							</div>
						</div>
					</div>

					<div
						className="gap-2 mt-3"
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<h4 style={{ fontSize: "18px" }}>Descuentos</h4>

						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							{" "}
							<div>
								<i className="fa-solid fa-barcode bx-fw"></i>
								Cod:
							</div>
							<div style={{ fontSize: "12px" }}>
								{discount?.settlement_code}
							</div>
						</div>

						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							{" "}
							<div>
								<i className="fa-solid fa-tags bx-fw"></i>
								Descuentos:
							</div>
							<div>
								${" "}
								{parseFloat(
									discount?.total_discount
								).toFixed(2)}
							</div>
						</div>

						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							{" "}
							<div>
								<i className="fa-solid fa-retweet bx-fw"></i>
								Retenciones:
							</div>
							<div>
								${" "}
								{parseFloat(discount?.retention).toFixed(2)}
							</div>
						</div>

						<div
							className="d-flex justify-content-between fw-bold"
							style={{ fontSize: "14px" }}
						>
							{" "}
							<div>
								<i className="fa-brands fa-stack-overflow bx-fw"></i>
								Total:
							</div>
							<div>
								${" "}
								{parseFloat(discount?.total_other).toFixed(
									2
								)}
							</div>
						</div>
					</div>

					<div
						className="gap-2 mt-3"
						style={{
							display: "flex",
							flexDirection: "column",
						}}
					>
						<h4 style={{ fontSize: "20px" }}>Productos</h4>

						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							{" "}
							<div>
								<i className="fa-solid fa-barcode bx-fw"></i>
								Cod:
							</div>
							<div style={{ fontSize: "12px" }}>
								{productReturn?.settlement_code}
							</div>
						</div>

						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							{" "}
							<div>
								<i className="fa-solid fa-house-crack bx-fw"></i>
								Dañados:
							</div>
							<div>
								${" "}
								{parseFloat(
									productReturn?.disrepair
								).toFixed(2)}
							</div>
						</div>
						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							{" "}
							<div>
								<i className="fa-solid fa-business-time bx-fw"></i>
								Caducados:
							</div>
							<div>
								${" "}
								{parseFloat(productReturn?.expired).toFixed(
									2
								)}
							</div>
						</div>

						<div
							className="d-flex justify-content-between "
							style={{ fontSize: "12px" }}
						>
							{" "}
							<div>
								<i className="fa-solid fa-arrow-right-arrow-left bx-fw"></i>
								Retornados:
							</div>
							<div>
								${" "}
								{parseFloat(productReturn?.rejected).toFixed(
									2
								)}
							</div>
						</div>

						<div
							className="d-flex justify-content-between fw-bold"
							style={{ fontSize: "14px" }}
						>
							<div>
								<i className="fa-brands fa-stack-overflow bx-fw"></i>
								Total:
							</div>
							<div>
								${" "}
								{parseFloat(productReturn?.total).toFixed(2)}
							</div>
						</div>
					</div>
				</div>

				<div className="mt-4 border-top">
					{productReturnInvoice[0] && (
						<div style={{ marginTop: "1rem" }}>
							<h4 className="fs-5 mt-3">
								Notas de Venta de P. R.
							</h4>
							<Table
								striped
								bordered
								hover
								size="sm"
								style={{ width: "525px", fontSize: "11px" }}
							>
								<thead>
									<tr>
										<th>#</th>
										<th>Client</th>
										<th>#Documento</th>
										<th>Total</th>
										<th>Saldo</th>
										<th>Vendedor</th>
									</tr>
								</thead>
								<tbody style={{ fontSize: "12px" }}>
									{productReturnInvoice?.map(
										(inv, index) => (
											<tr key={index}>
												<td>{index + 1}</td>
												<td>
													{inv?.id_client ||
														inv
															?.id_bills_bill
															.client
															?.fullname ||
														inv?.client
															?.fullname}
												</td>
												<td>
													{inv?.num_bill ||
														inv
															?.id_bills_bill
															.num_bill}
												</td>
												<td>
													${" "}
													{inv?.total_bill ||
														inv
															?.id_bills_bill
															.total_bill}
												</td>
												<td>
													${" "}
													{parseFloat(
														inv?.balance
													) ||
														inv
															?.id_bills_bill
															.balance}
												</td>
												<td
													style={{
														borderRight: `4px solid var(--first-color) `,
													}}
												>
													{seller.filter(
														(seller) =>
															seller.id ===
															parseInt(
																inv?.id_seller
															)
													)[0]?.name ||
														inv?.seller
															?.name}
												</td>
											</tr>
										)
									)}
								</tbody>
							</Table>
						</div>
					)}

					{checkMoney[0] && (
						<div style={{ marginTop: "1rem" }}>
							<h4 className="fs-5 mt-3">Depositos o Cheques</h4>
							<Table
								striped
								bordered
								hover
								size="sm"
								style={{ width: "500px", fontSize: "11px" }}
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
								<tbody style={{ fontSize: "12px" }}>
									{checkMoney?.map((check, index) => (
										<tr key={index}>
											<td>{check?.id_client}</td>
											<td>{check?.references}</td>
											<td>{check?.number_check}</td>
											<td>{check?.id_bank}</td>
											<td>{check?.type}</td>
											<td>
												$
												{parseFloat(
													check?.total
												).toFixed(2)}
											</td>
										</tr>
									))}
								</tbody>
							</Table>
						</div>
					)}
				</div>

				<div>
					<span style={{ whiteSpace: "pre-line", fontSize: "14px" }}>
						{principal.detail}
					</span>
				</div>
			</div>
		</div>
	);
};

export default LiquidationVehiclePdf;
