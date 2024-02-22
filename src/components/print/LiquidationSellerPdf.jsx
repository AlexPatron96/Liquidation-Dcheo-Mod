import React, { useEffect, useRef, useState } from "react";
import Table from "react-bootstrap/Table";

const LiquidationSellerPdf = () => {
	const elementoRef = useRef(null);

	const data = JSON.parse(sessionStorage.getItem("printSeller"));
	const checkMoney = data?.[11];
	const discount = data?.[1];
	const expenses = data?.[2];
	const cash = data?.[3];
	const transaction = data?.[4];
	const invoice = data?.[5];
	const codLiq = data?.[6];
	const user = data?.[7];
	const date = data?.[8];
	const seller = data?.[9];
	const principal = data?.[10];

	// console.log(checkMoney);
	// console.log(data);

	// const balanceGenCal = (parseFloat(principal?.balance_gen_sell) + parseFloat(principal?.balance));

	useEffect(() => {
		window.print();
	}, []);

	return (
		<div>
			{/* <button onClick={generatePDF}>pdf</button> */}
			<div id="component-to-pdf">
				{/* style={{ width: "8.5in", height: "11in", position: "relative" }} */}

				<h3 style={{ textAlign: "center", fontSize: "20px" }}>
					LIQUIDACION
				</h3>
				<h4 style={{ textAlign: "center", fontSize: "24px" }}>
					Distribuidora DCheo
				</h4>
				<h4 style={{ fontSize: "20px" }}>Liquidacion de Vendedores</h4>
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
							<span
								style={{
									color: "#02B875",
									fontSize: "16px",
								}}
							>
								{" "}
								{user}{" "}
							</span>{" "}
						</h5>
						<h5 style={{ fontSize: "16px" }}>
							Fecha de liquidacion:{" "}
							<span
								style={{
									color: "#02B875",
									fontSize: "16px",
								}}
							>
								{date}{" "}
							</span>{" "}
						</h5>
						<h5 style={{ fontSize: "16px" }}>
							Se esta liquidando al Vendedor:{" "}
							<span
								style={{
									color: "#02B875",
									fontSize: "16px",
								}}
							>
								{" "}
								{seller}
							</span>{" "}
						</h5>
						<h5 style={{ fontSize: "16px" }}>
							Codigo de Liquidacion:{" "}
							<span
								style={{
									color: "#02B875",
									fontSize: "16px",
								}}
							>
								{" "}
								{codLiq}
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
								fontSize: "30px",
								color: `${
									principal?.balance_gen_sell > 0
										? "#02B875"
										: principal?.balance_gen_sell < 0
										? "#C20114"
										: "#02B875"
								}`,
							}}
						>
							{principal?.balance_gen_sell > 0
								? "A FAVOR"
								: principal?.balance_gen_sell < 0
								? "EN CONTRA"
								: "OK"}
						</h5>
						<h5>
							$
							{parseFloat(principal?.balance_gen_sell).toFixed(
								2
							)}
						</h5>
					</div>
				</div>

				<div
					id="contenido-a-imprimir"
					ref={elementoRef}
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
							style={{ width: "1000px", textAlign: "center" }}
							size="sm"
						>
							<thead>
								<tr>
									<th>#</th>
									<th>Cliente</th>
									<th># Documento</th>
									<th>Total</th>
									<th>Saldo Ant</th>
									<th>Abono</th>
									<th>Saldo Nuevo</th>
								</tr>
							</thead>
							<tbody>
								{invoice?.map((inv, index) => (
									<tr key={index}>
										<td style={{ fontSize: "14px" }}>
											{index + 1}
										</td>
										<td style={{ fontSize: "16px" }}>
											{inv?.client?.fullname ||
												inv?.id_bills_bill.client
													?.fullname}
										</td>
										<td style={{ fontSize: "14px" }}>
											{inv?.num_bill ||
												inv?.id_bills_bill
													.num_bill}
										</td>
										<td style={{ fontSize: "14px" }}>
											${" "}
											{inv?.total_bill ||
												inv?.id_bills_bill
													.total_bill}
										</td>
										<td style={{ fontSize: "14px" }}>
											${" "}
											{parseFloat(inv?.balance) ||
												inv?.id_bills_bill
													.balance}
										</td>
										<td
											style={{
												fontSize: "14px",
												borderRight: `4px solid ${
													inv?.pass ||
													parseFloat(
														inv?.pago
													)
														? "#02B875"
														: "#FFCCE5"
												} `,
											}}
										>
											${" "}
											{isNaN(
												parseFloat(inv?.pago)
											) &&
											isNaN(parseFloat(inv?.pass))
												? 0
												: parseFloat(
														inv?.pago
												  ).toFixed(2)}
										</td>
										<td
											style={{
												fontSize: "14px",
												borderRight: `4px solid ${
													inv?.pass ||
													parseFloat(
														inv?.pago
													)
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
														inv
															?.id_bills_bill
															.balance
													) ||
													0;
												const pago =
													parseFloat(
														inv?.pago
													) ||
													parseFloat(
														inv?.pass
													) ||
													0;
												const result =
													balance - pago;
												const formattedResult =
													isNaN(result)
														? 0
														: result.toFixed(
																2
														  );

												return formattedResult;
											})()}
											{/* {parseFloat(inv?.pass) ||
												(
													parseFloat(
														inv?.balance
													) -
													parseFloat(
														inv?.pago
													)
												).toFixed(2) ||
												0} */}
										</td>
									</tr>
								))}
							</tbody>
						</Table>

						<div className="d-flex flex-column text-center w-25">
							<div>
								<h4
									style={{
										fontSize: "16px",
									}}
								>
									Total Cobrado
								</h4>
								<h5
									style={{
										fontSize: "16px",
									}}
								>
									$ {principal?.total_collection_bills}
								</h5>
							</div>
							<div>
								<h4
									style={{
										fontSize: "16px",
									}}
								>
									Total Recibido
								</h4>
								<h5
									style={{
										fontSize: "16px",
									}}
								>
									$ {principal?.total_received}
								</h5>
							</div>
							<div>
								<h4
									style={{
										fontSize: "16px",
									}}
								>
									Cuadre
								</h4>
								<h5
									style={{
										fontSize: "16px",
									}}
								>
									${principal?.balance}
								</h5>
								<span
									style={{
										color: `${
											principal?.balance > 0
												? "#FFAC42"
												: principal?.balance < 0
												? "#C20114"
												: "#02B875"
										}`,
										fontSize: "16px",
									}}
								>
									{principal?.balance > 0
										? `El Vendedor ${seller} tiene un saldo a Favor`
										: principal?.balance < 0
										? `El Vendedor ${seller} tiene un saldo en Contra`
										: `La liquidacion del ${seller} es Correcta`}
								</span>
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
							<h4 style={{ fontSize: "20px" }}>Dinero</h4>

							{cash?.settlement_code && (
								<div className="d-flex justify-content-between">
									<div>
										<i className="fa-solid fa-barcode bx-fw"></i>
										Cod:
									</div>
									<div style={{ fontSize: "12px" }}>
										{cash?.settlement_code}
									</div>
								</div>
							)}

							{cash?.coin && (
								<div className="d-flex justify-content-between">
									<div>
										<i className="fa-solid fa-coins bx-fw"></i>
										Monedas:
									</div>
									<div>
										${" "}
										{parseFloat(cash?.coin).toFixed(2)}
									</div>
								</div>
							)}

							{cash?.money && (
								<div className="d-flex justify-content-between">
									<div>
										<i className="fa-regular fa-money-bill-1 bx-fw"></i>
										Billetes:
									</div>
									<div>
										${" "}
										{parseFloat(cash?.money).toFixed(
											2
										)}
									</div>
								</div>
							)}

							{cash?.deposits_money && (
								<div className="d-flex justify-content-between">
									<div>
										<i className="fa-solid fa-receipt bx-fw"></i>
										Depositos:
									</div>
									<div>
										${" "}
										{parseFloat(
											cash?.deposits_money
										).toFixed(2)}
									</div>
								</div>
							)}

							{cash?.check_money && (
								<div className="d-flex justify-content-between">
									<div>
										<i className="fa-solid fa-money-check bx-fw"></i>
										Cheques:
									</div>
									<div>
										${" "}
										{parseFloat(
											cash?.check_money
										).toFixed(2)}
									</div>
								</div>
							)}

							{cash?.total && (
								<div className="d-flex justify-content-between fs-5 fw-bold">
									<div>
										<i className="fa-brands fa-stack-overflow bx-fw"></i>
										Total:
									</div>
									<div>
										${" "}
										{parseFloat(cash?.total).toFixed(
											2
										)}
									</div>
								</div>
							)}

							{/* <div style={{ display: "flex", flexDirection: "column" }}>
                     
                            Detalle:
                            <div style={{ border: "2px solid grey", height: "100px", fontSize: "11px" }}>
                                {cash?.detail}
                            </div>
                        </div> */}
						</div>

						<div
							className="gap-2 mt-3"
							style={{
								display: "flex",
								flexDirection: "column",
							}}
						>
							<h4 style={{ fontSize: "20px" }}>Gastos</h4>

							{expenses?.settlement_code && (
								<div className="d-flex justify-content-between">
									<div>
										<i className="fa-solid fa-barcode bx-fw"></i>
										Cod:
									</div>
									<div style={{ fontSize: "12px" }}>
										{expenses?.settlement_code}
									</div>
								</div>
							)}

							{expenses?.feeding && (
								<div className="d-flex justify-content-between">
									<div>
										<i className="fa-solid fa-utensils bx-fw"></i>
										Alimentos:
									</div>
									<div>
										${" "}
										{parseFloat(
											expenses?.feeding
										).toFixed(2)}
									</div>
								</div>
							)}

							{expenses?.perdiem && (
								<div className="d-flex justify-content-between">
									<div>
										<i className="fa-solid fa-car  bx-fw"></i>
										Viaticos:
									</div>
									<div>
										${" "}
										{parseFloat(
											expenses?.perdiem
										).toFixed(2)}
									</div>
								</div>
							)}

							{expenses?.fuel && (
								<div className="d-flex justify-content-between">
									<div>
										<i className="fa-solid fa-gas-pump bx-fw"></i>
										Combustible:
									</div>
									<div>
										${" "}
										{parseFloat(
											expenses?.fuel
										).toFixed(2)}
									</div>
								</div>
							)}

							{expenses?.total && (
								<div className="d-flex justify-content-between fs-5 fw-bold">
									<div>
										<i className="fa-brands fa-stack-overflow bx-fw"></i>
										Total:
									</div>
									<div>
										${" "}
										{parseFloat(
											expenses?.total
										).toFixed(2)}
									</div>
								</div>
							)}
						</div>

						<div
							className="gap-2 mt-3"
							style={{
								display: "flex",
								flexDirection: "column",
							}}
						>
							<h4 style={{ fontSize: "20px" }}>Descuentos</h4>

							{discount?.settlement_code && (
								<div className="d-flex justify-content-between">
									<div>
										<i className="fa-solid fa-barcode bx-fw"></i>
										Cod:
									</div>
									<div style={{ fontSize: "12px" }}>
										{discount?.settlement_code}
									</div>
								</div>
							)}

							{discount?.total_discount && (
								<div className="d-flex justify-content-between">
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
							)}

							{discount?.retention && (
								<div className="d-flex justify-content-between">
									<div>
										<i className="fa-solid fa-retweet bx-fw"></i>
										Retenciones:
									</div>
									<div>
										${" "}
										{parseFloat(
											discount?.retention
										).toFixed(2)}
									</div>
								</div>
							)}

							{discount?.total_other && (
								<div className="d-flex justify-content-between fs-5 fw-bold">
									<div>
										<i className="fa-brands fa-stack-overflow bx-fw"></i>
										Total:
									</div>
									<div>
										${" "}
										{parseFloat(
											discount?.total_other
										).toFixed(2)}
									</div>
								</div>
							)}
						</div>
					</div>

					<div className="mt-4 border-top">
						<h4 className="fs-5 mt-3">Depositos o Cheques</h4>
						<Table
							striped
							bordered
							hover
							size="sm"
							style={{ width: "1000px" }}
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
							<tbody style={{ fontSize: "12px" }}>
								{checkMoney?.map((check, index) => (
									<tr key={index}>
										<td>
											{check?.id_client ||
												check?.check_sell
													?.id_client_client
													?.fullname}
										</td>
										<td>
											{check?.references ||
												check?.check_sell
													?.references}
										</td>
										<td>
											{check?.number_check ||
												check?.check_sell
													?.number_check}
										</td>
										<td>
											{check?.id_bank ||
												check?.check_sell
													?.id_bank_bank
													?.name_bank}
										</td>
										<td>
											{check?.type ||
												check?.check_sell?.type}
										</td>
										<td>
											${" "}
											{check?.total ||
												check?.check_sell?.total}
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</div>
					<div>
						<span style={{ whiteSpace: "pre-wrap" }}>
							{principal?.detail}
						</span>
					</div>
				</div>
				<div>
					<button
						// style={{ background: "none" }}
						onClick={() => {
							window.close();
						}}
					>
						SALIR
					</button>
				</div>
			</div>
		</div>
	);
};

export default LiquidationSellerPdf;
