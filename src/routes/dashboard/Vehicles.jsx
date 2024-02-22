import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteVehThunk,
	getVehiclesThunk,
	updateVehThunk,
} from "../../store/slices/vehicles.slice";
import LoadingScreen from "../../layout/LoadingScreen";
import Paginationdesign from "../../components/Paginationdesign";
import Createdroute from "../../components/creators/Createdroute";
import Functionalitiesbtn from "../../components/atom/Functionalitiesbtn";
import Buttonatom from "../../components/atom/Buttonatom";
import { setPagination } from "../../store/slices/pagination.slice";
import CreateVehiclesClouster from "../../components/creators/CreateVehiclesClouster";
import CreateVehicle from "../../components/creators/CreateVehicle";
import TableVehicles from "../../components/Show/TableVehicles";
import { setErrorReceived } from "../../store/slices/errorReceived.slice";
import Swal from "sweetalert2";
import { getRoutethunk } from "../../store/slices/dataTemp.slice";
import { getRouteDayThunk } from "../../store/slices/routeday.slice";

const Vehicles = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		vehiclesRedux[0] ? null : dispatch(getVehiclesThunk());
	}, []);

	const userLoged = useSelector((state) => state.userLoged);
	const vehiclesRedux = useSelector((state) => state.vehicles);
	const loading = useSelector((state) => state.isLoading);
	const pagination = useSelector((state) => state.pagination);

	const [modalShow, setModalShow] = useState(false);
	const [modalShowRoute, setModalShowRoute] = useState(false);

	const updateData = (id, data) => {
		dispatch(updateVehThunk(id, data));
	};
	const deleteData = (id) => {
		dispatch(deleteVehThunk(id));
	};

	const createdVeh = () => {
		if (!modalShow) {
			setModalShow(true);
		} else {
			setModalShow(false);
		}
	};
	const createdRoute = () => {
		if (!modalShow) {
			setModalShowRoute(true);
			//console.log("mostrar model created Routed");
		} else {
			setModalShowRoute(false);
		}
	};

	const [showCreateByClouster, setShowCreateByClouster] = useState(false);

	const createByClouster = () => {
		if (!showCreateByClouster) {
			setShowCreateByClouster(true);
			//console.log("mostrar model created showCreateByClouster");
		} else {
			setShowCreateByClouster(false);
		}
	};

	const btnCreated = () => {
		return (
			<>
				{
					<Buttonatom
						isTrueOfElse={
							!userLoged?.roll?.permissions?.create_vehicle
						}
						created={createdVeh}
						title={"Crear Vehiculo"}
						color={"success"}
						ico={"fa-circle-plus"}
					/>
				}

				<Buttonatom
					created={createdRoute}
					title={""}
					color={"success"}
					ico={"fa-route"}
				/>
				<Buttonatom
					created={createByClouster}
					title={""}
					color={"success"}
					ico={"fa-cloud-arrow-up"}
				/>
				<Buttonatom
					created={refresh}
					title={""}
					color={"info"}
					ico={"fa-arrow-rotate-right bx-spin-hover"}
				/>
			</>
		);
	};
	const refresh = () => {
		dispatch(getVehiclesThunk());
		dispatch(getRoutethunk());
		dispatch(getRouteDayThunk());
	};

	const search = (data) => {
		const filteredList = vehiclesRedux.filter((item) =>
			item.driver.toLowerCase().includes(data.toLowerCase())
		);
		dispatch(setPagination(filteredList));
	};
	const listAvailable = () => {
		return (
			<>
				{/* <Formselectatom title={"Ver Rutas Disponibles"}
                    iterador={route}
                    firstdata={"id"}
                    secunddata={"dia"}
                    disabledAction={true} /> */}
			</>
		);
	};

	return (
		<div className="vehicles pages">
			<div>
				<h2>Vehiculos</h2>
				<Functionalitiesbtn
					buttons={btnCreated}
					listAvailable={listAvailable}
					search={search}
				/>
			</div>
			<div>
				<TableVehicles
					data={pagination}
					updateData={updateData}
					deleteData={deleteData}
				/>

				{!loading ? (
					<Paginationdesign data={"vehicles"} />
				) : (
					<LoadingScreen />
				)}
			</div>

			<Createdroute
				show={modalShowRoute}
				onHide={() => setModalShowRoute(false)}
			/>

			<CreateVehicle show={modalShow} onHide={() => setModalShow(false)} />
			<CreateVehiclesClouster
				show={showCreateByClouster}
				onHide={() => setShowCreateByClouster(false)}
			/>
		</div>
	);
};

export default Vehicles;
