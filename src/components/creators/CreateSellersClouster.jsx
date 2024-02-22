import React, { useState } from "react";
import * as XLSX from "xlsx";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { postVehicleClousterthunk } from "../../store/slices/vehicles.slice";
import { postSellerClousterthunk } from "../../store/slices/seller.slice";

const CreateSellersClouster = (props) => {
	const dispatch = useDispatch();

	const [sellers, setSellers] = useState([]);
	const userLoged = useSelector((state) => state.userLoged);

	const CargaArchivo = (evento) => {
		const archivo = evento.target.files[0];
		const lector = new FileReader();
		lector.onload = (evento) => {
			const datos = evento.target.result;
			const libro = XLSX.read(datos, { type: "binary" });
			const hoja = libro.Sheets["Hoja1"];
			const datosJson = XLSX.utils.sheet_to_json(hoja, { header: 1 });
			const sellersJson = datosJson.slice(1).map((fila) => ({
				code: fila[0],
				name: fila[1],
				isActive: fila[2],
				id_route: fila[3],
			}));
			setSellers(sellersJson);
		};
		lector.readAsBinaryString(archivo);
	};

	const loaderSellerClouster = () => {
		dispatch(postSellerClousterthunk(sellers));
		setSellers([]);
	};

	return (
		<div>
			<div>
				<Modal
					{...props}
					size="lg"
					aria-labelledby="contained-modal-title-vcenter"
					centered
				>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">
							Carga externa de Vendedores
						</Modal.Title>
					</Modal.Header>
					<Modal.Body>
						<div
							style={{
								display: "flex",
								flexDirection: "column",
								alignItems: "center",
							}}
						>
							<div>
								Podra cargar documentos de formatos (.xlsx )
								con la siguiente estructura.
								<a
									href="/src/document/exel/sellers.xlsx"
									download={"formado-pdf-Seller.xlsx"}
								>
									Descargar
								</a>
							</div>

							<div style={{ margin: "2rem 0" }}>
								<input type="file" onChange={CargaArchivo} />
							</div>

							<Table
								striped
								bordered
								hover
								style={{
									maxWidth: "700px",
									height: "10px",
									overflow: "auto",
								}}
							>
								<thead>
									<tr>
										<th>#</th>
										<th>Codigo</th>
										<th>Nombre</th>
										<th>Activo</th>
										<th>Route</th>
									</tr>
								</thead>
								<tbody>
									{sellers.map((sellers, index) => (
										<tr key={index}>
											<td>{index + 1}</td>
											<td>{sellers.code}</td>
											<td>{sellers.name}</td>
											<td>{sellers.isActive}</td>
											<td>{sellers.id_route}</td>
										</tr>
									))}
									<tr>
										<td>-</td>
										<td>-</td>
										<td>-</td>
										<td>-</td>
										<td>-</td>
									</tr>
								</tbody>
							</Table>
						</div>
					</Modal.Body>
					<Modal.Footer>
						<Button
							disabled={
								!userLoged?.roll?.permissions?.create_seller
							}
							variant="success"
							type="submit"
							onClick={() => loaderSellerClouster()}
						>
							Cargar
						</Button>
						<Button onClick={props.onHide}>Cerrar</Button>
					</Modal.Footer>
				</Modal>
			</div>
		</div>
	);
};

export default CreateSellersClouster;
