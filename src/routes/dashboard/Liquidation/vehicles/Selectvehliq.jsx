import React, { useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import CardBtn from "../../../../components/CardBtn";
import imgVehC from "../../../../img/conductor.png";
// import { setLiquidationSlice } from '../../../../store/slices/liquidation.slice';
import { getVehiclesThunk } from "../../../../store/slices/vehicles.slice";
import date from "../../../../utils/date";
import Swal from "sweetalert2";
import { getInvoiceThunk } from "../../../../store/slices/invoice.slice";
import currentdate from "../../../../utils/date";

const Selectliqveh = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	useEffect(() => {
		vehicles[0] ? null : dispatch(getVehiclesThunk());
		dispatch(getInvoiceThunk());
	}, []);

	const vehicles = useSelector((state) => state.vehicles);
	const invoice = useSelector((state) => state.invoice);
	const vehActive = vehicles.filter((veh) => veh?.isActive === true);
	const userLoged = useSelector((state) => state.userLoged);

	const identificarDia = date.CurrendateDay();

	const loadData = (dataRecepter) => {
		const arregloRecepter = JSON.parse(dataRecepter.data_liquidation);

		localStorage.setItem(
			`checkLiq${dataRecepter?.dni}-${dataRecepter?.id}`,
			JSON.stringify(arregloRecepter[0])
		);
		localStorage.setItem(
			`discountLiq${dataRecepter?.dni}-${dataRecepter?.id}`,
			JSON.stringify(arregloRecepter[1])
		);
		localStorage.setItem(
			`expensesLiq${dataRecepter?.dni}-${dataRecepter?.id}`,
			JSON.stringify(arregloRecepter[2])
		);
		localStorage.setItem(
			`cashLiq${dataRecepter?.dni}-${dataRecepter?.id}`,
			JSON.stringify(arregloRecepter[3])
		);
		localStorage.setItem(
			`productRetLiq${dataRecepter?.dni}-${dataRecepter?.id}`,
			JSON.stringify(arregloRecepter[4])
		);
		localStorage.setItem(
			`proInvRetLiq${dataRecepter?.dni}-${dataRecepter?.id}`,
			JSON.stringify(arregloRecepter[5])
		);
		localStorage.setItem(
			`trans${dataRecepter?.dni}-${dataRecepter?.id}`,
			JSON.stringify(arregloRecepter[6])
		);
		localStorage.setItem(
			`invoLiq${dataRecepter?.dni}-${dataRecepter?.id}`,
			JSON.stringify(arregloRecepter[7])
		);
		localStorage.setItem(
			`checkLiq${dataRecepter?.dni}-${dataRecepter?.id}view`,
			JSON.stringify(arregloRecepter[8])
		);
		localStorage.setItem(
			`creditDeliver${dataRecepter?.dni}-${dataRecepter?.id}`,
			JSON.stringify(arregloRecepter[9])
		);
		localStorage.setItem(
			`codGenLiq${dataRecepter?.dni}-${dataRecepter?.id}`,
			arregloRecepter[10]
		);
		localStorage.setItem(
			`boxSmal${dataRecepter?.dni}-${dataRecepter?.id}`,
			arregloRecepter[14].box_small
		);
	};
	const selectVeh = (data) => {
		Swal.fire({
			title: "¿Está seguro?",
			text: data?.liquidation_isactive
				? `Existe una Liquidacion Guardada, Deseas Acceder o Eliminarla.`
				: `Vas a realizar la liquidacion de el Entregador ${data?.driver}.`,
			icon: "warning",
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Si, proseguir!",
			showCancelButton: true,
		}).then((result) => {
			if (result.isConfirmed) {
				if (userLoged?.roll?.permissions?.edited_seller_maxtotal) {
					data?.liquidation_isactive ? loadData(data) : null;
					navigate(`/dashboard/liquidation/vehicles/${data?.id}`);
				} else {
					Swal.fire(
						"Error?",
						"No Tienes Permisos de accesso.",
						"error"
					);
				}
			} else {
				navigate(`/dashboard/liquidation/vehicles`);
			}
		});
	};

	return (
		<div className="pages">
			<div>
				<h3 className="m-3 fs-3">Selecciona el vehiculo a liquidar</h3>
				<div className="card-btn">
					<Row>
						{vehActive?.map((veh, index) => (
							<Col key={index}>
								<Link
									className="linkStyle"
									onClick={() => selectVeh(veh)}
								>
									<h5>{veh?.cod_mv}</h5>
									<CardBtn
										title={veh?.driver}
										img={imgVehC}
									/>
									<span>
										Balance: ${" "}
										{parseFloat(
											veh?.balance_veh?.total
										).toFixed(2)}{" "}
									</span>
									<div>
										{veh?.liquidation_isactive ? (
											<div
												className="bg-success text-bg-info p-1 rounded-3"
												style={{
													fontSize: "12px",
												}}
											>
												"Existe una Liquidacion
												Guardada"
											</div>
										) : null}
									</div>
								</Link>
							</Col>
						))}
					</Row>
				</div>
			</div>
			<div className="do-vehicle"></div>
		</div>
	);
};

export default Selectliqveh;
