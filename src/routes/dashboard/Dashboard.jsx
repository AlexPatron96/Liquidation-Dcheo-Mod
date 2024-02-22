import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import Swal from "sweetalert2";
import NavBar from "../../components/NavBar";
import Sidebar from "../../components/Sidebar";
import { setErrorReceived } from "../../store/slices/errorReceived.slice";
import { setUserLoged } from "../../store/slices/userLoged";

const Dashboard = () => {
	const dispatch = useDispatch();
	/************ VERIFICA SI NO HAY UN ERROR EN EL SLICE DE ERROR ****************/
	const errorReceived = useSelector((state) => state.errorReceived);
	errorReceived.length === 0
		? null
		: Swal.fire({
				title: "Error",
				text: `Existe un error en esta operacion : ${
					errorReceived.error || errorReceived.message
				} `,
				icon: "error",
				confirmButtonColor: "#d33",
				confirmButtonText: "OK",
		  }).then((result) => {
				if (result.isConfirmed) {
					dispatch(setErrorReceived([]));
				}
		  });
	/**************************************************************/
	// console.log("Ingreso a la Aplication");
	const storedUser = localStorage.getItem("userLiquidation");
	const user = storedUser ? JSON.parse(storedUser) : null;

	useEffect(() => {
		dispatch(setUserLoged(user));
	}, []);

	return (
		<div>
			<NavBar />
			<Sidebar />
			<section>
				<Outlet />
			</section>
		</div>
	);
};

export default Dashboard;
