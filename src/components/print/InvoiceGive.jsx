import React from "react";
import { useEffect } from "react";
import { Table } from "react-bootstrap";
import date from "../../utils/date";

const InvoiceGive = () => {
	const data = JSON.parse(sessionStorage.getItem("docInvoiceGive"));
	const principal = data?.[0];

	const { user, date: dateDoc, seller } = principal;
	const invoice = data?.[1];
	const totalEntregado = data?.[2];

	// useEffect(() => {
	// 	window.print();
	// }, []);

	return (
		<div>
			<h4 style={{ textAlign: "center", fontSize: "20px" }}>LIQUIDACION</h4>
			<h5 style={{ textAlign: "center", fontSize: "20px" }}>
				Distribuidora DCheo
			</h5>
			<h5 style={{ fontSize: "16px" }}>
				Lista de Facturas x Cobrar de Vendedores
			</h5>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					justifyContent: "space-between",
					fontSize: "16px",
				}}
			>
				<div>
					<h6 style={{ fontSize: "14px" }}>
						Usuario:{" "}
						<span style={{ color: "#02B875" }}> {user} </span>{" "}
					</h6>
					<h6 style={{ fontSize: "14px" }}>
						Fecha de liquidacion:{" "}
						<span style={{ color: "#02B875" }}>
							{dateDoc.toUpperCase()}{" "}
						</span>{" "}
					</h6>
					<h6 style={{ fontSize: "14px" }}>
						Entrega de Facturas de cobro a:{" "}
						<span style={{ color: "#02B875" }}> {seller}</span>{" "}
					</h6>
				</div>

				<div id="contenido-a-imprimir">
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
								textAlign: "center",
								width: "1000px",
								fontSize: "10px",
							}}
						>
							<thead>
								<tr>
									<th>#</th>
									<th>Cliente</th>
									<th>Direccion</th>
									<th>Identificacion</th>
									<th
										style={{
											width: "100px",
											fontSize: "9px",
										}}
									>
										# Documento
									</th>
									<th
										style={{
											width: "100px",
											fontSize: "9px",
										}}
									>
										Fecha Ent.
									</th>
									<th style={{ width: "70px" }}>Total</th>
									<th style={{ width: "70px" }}>Saldo</th>
								</tr>
							</thead>
							<tbody style={{ fontSize: "10px", padding: "0" }}>
								{invoice?.map((inv, index) => (
									<tr key={index}>
										<td
											style={{
												fontSize: "9px",
												padding: "0.25rem 0.5rem",
											}}
										>
											{index + 1}
										</td>
										<td
											style={{
												fontSize: "9px",
												padding: "0.25rem 0.5rem",
											}}
										>
											{inv?.client.fullname?.substring(
												0,
												30
											)}
										</td>
										<td
											style={{
												fontSize: "9px",
												padding: "0.25rem 0.5rem",
											}}
										>
											{inv?.client.address?.substring(
												0,
												35
											)}
										</td>
										<td
											style={{
												fontSize: "9px",
												padding: "0.25rem 0.5rem",
											}}
										>
											{inv?.client.dni}
										</td>
										<td
											style={{
												width: "100px",
												fontSize: "9px",
												padding: "0.25rem 0.5rem",
											}}
										>
											{inv?.num_bill}
										</td>
										<td
											style={{
												width: "100px",
												fontSize: "9px",
												padding: "0.25rem 0.5rem",
											}}
										>
											<h6
												style={{
													fontSize: "10px",
													color: `${
														inv?.balance ===
														0
															? "none"
															: date.DatePastPresent(
																	inv?.deliver_date
															  ) >= 30
															? "red"
															: date.DatePastPresent(
																	inv?.deliver_date
															  ) >= 15
															? "orange"
															: "green"
													}`,
												}}
											>
												{`(${date.DatePastPresent(
													inv?.deliver_date
												)})`}{" "}
												{inv?.deliver_date}
											</h6>
										</td>

										<td
											style={{
												width: "70px",
												padding: "0.25rem 0.5rem",
											}}
										>
											{" "}
											${" "}
											{parseFloat(
												inv?.total_bill
											).toFixed(2)}
										</td>
										<td
											style={{
												width: "70px",
												padding: "0.25rem 0.5rem",
											}}
										>
											${" "}
											{parseFloat(
												inv?.balance
											).toFixed(2)}
										</td>
									</tr>
								))}
							</tbody>
						</Table>
					</div>
					<span>Facturas entregadas: {invoice.length}</span>
					<h6>
						Valor Total de Facturas Entregadas: ${" "}
						{parseFloat(totalEntregado).toFixed(2)}{" "}
						<span style={{ fontSize: "9px" }}>X COBRAR</span>{" "}
					</h6>
				</div>
			</div>
		</div>
	);
};

export default InvoiceGive;
