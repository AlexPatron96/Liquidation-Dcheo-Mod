import React, { useState } from "react";
import * as XLSX from "xlsx";

import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import { useDispatch, useSelector } from "react-redux";
import { postVehicleClousterthunk } from "../../store/slices/vehicles.slice";

const CreateVehiclesClouster = (props) => {
	const dispatch = useDispatch();
	const userLoged = useSelector((state) => state.userLoged);

	const [vehicles, setVehicles] = useState([]);
	const CargaArchivo = (evento) => {
		const archivo = evento.target.files[0];
		const lector = new FileReader();
		lector.onload = (evento) => {
			const datos = evento.target.result;
			const libro = XLSX.read(datos, { type: "binary" });
			const hoja = libro.Sheets["Hoja1"];
			const datosJson = XLSX.utils.sheet_to_json(hoja, { header: 1 });
			const vehiclesJson = datosJson.slice(1).map((fila) => ({
				enrollment: fila[0],
				driver: fila[1],
				dni: fila[2],
				isActive: fila[3],
				id_route: fila[4],
				cod_mv: fila[5],
			}));
			//console.log(libro);
			setVehicles(vehiclesJson);
		};
		lector.readAsBinaryString(archivo);
	};
	// console.log(vehicles);

	const loaderVehiclesClouster = () => {
		dispatch(postVehicleClousterthunk(vehicles));
		setVehicles([]);
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
							Carga externa de vehiculos
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
									href="/src/document/exel/vehicles.xlsx"
									download={"formado-pdf-veh.xlsx"}
								>
									Descargar
								</a>
							</div>

							<div style={{ margin: "2rem 0" }}>
								<input type="file" onChange={CargaArchivo} />
							</div>

							<Table striped bordered hover>
								<thead>
									<tr>
										<th>#</th>
										<th>Placa</th>
										<th>Conductor</th>
										<th>Cod Mv</th>
										<th>Identificacion</th>
										<th>Activo</th>
										<th>Route</th>
									</tr>
								</thead>
								<tbody>
									{vehicles.map((vehicles, index) => (
										<tr key={index}>
											<td>{index + 1}</td>
											<td>{vehicles.enrollment}</td>
											<td>{vehicles.driver}</td>
											<td>{vehicles.cod_mv}</td>
											<td>{vehicles.dni}</td>
											<td>{vehicles.isActive}</td>
											<td>{vehicles.id_route}</td>
										</tr>
									))}
									<tr>
										<td>-</td>
										<td>-</td>
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
								!userLoged?.roll?.permissions?.create_vehicle
							}
							variant="success"
							type="submit"
							onClick={() => loaderVehiclesClouster()}
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

export default CreateVehiclesClouster;
