import React, { useEffect, useState } from "react";
import { getRoutethunk } from "../../store/slices/dataTemp.slice";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteSellerThunk,
	getSellerThunk,
	setSeller,
	updateSellerThunk,
} from "../../store/slices/seller.slice";
import Buttonatom from "../../components/atom/Buttonatom";
import TableList from "../../components/TableList";
import LoadingScreen from "../../layout/LoadingScreen";
import Paginationdesign from "../../components/Paginationdesign";
import Functionalitiesbtn from "../../components/atom/Functionalitiesbtn";
import Createdseller from "../../components/molecules/Createdseller";
import Formselectatom from "../../components/atom/Formselectatom";
import verify from "../../img/verificado.gif";
import { setPagination } from "../../store/slices/pagination.slice";
import CreateSellersClouster from "../../components/creators/CreateSellersClouster";
import CreateSeller from "../../components/creators/CreateSeller";
import TableSellers from "../../components/Show/TableSellers";
import { setErrorReceived } from "../../store/slices/errorReceived.slice";
import Swal from "sweetalert2";
import { Form } from "react-bootstrap";
import { getInvoiceThunk } from "../../store/slices/invoice.slice";

const Sellers = () => {
	const dispatch = useDispatch();

	useEffect(() => {
		sellerRedux[0] ? null : dispatch(getSellerThunk());
		dispatch(getInvoiceThunk());
	}, []);

	const sellerRedux = useSelector((state) => state.seller);
	const invoice = useSelector((state) => state.invoice);
	const loading = useSelector((state) => state.isLoading);
	const pagination = useSelector((state) => state.pagination);
	const userLoged = useSelector((state) => state.userLoged);

	const [modalShow, setModalShow] = useState(false);
	// console.log(sellerRedux);
	const updateData = (id, data) => {
		dispatch(updateSellerThunk(id, data));
	};
	const deleteData = (id) => {
		dispatch(deleteSellerThunk(id));
	};

	const createdSeller = () => {
		if (!modalShow) {
			setModalShow(true);
			// console.log("mostrar model Vendedor");
		} else {
			setModalShow(false);
		}
	};

	const [showCreateByClouster, setShowCreateByClouster] = useState(false);

	const createByClouster = () => {
		if (!showCreateByClouster) {
			setShowCreateByClouster(true);
			// console.log("mostrar model created showCreateByClouster");
		} else {
			setShowCreateByClouster(false);
		}
	};

	const btnCreated = () => {
		return (
			<>
				<Buttonatom
					isTrueOfElse={!userLoged?.roll?.permissions?.create_seller}
					created={createdSeller}
					title={"Crear Vendedor"}
					color={"success"}
					ico={"fa-circle-plus"}
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

	const orderList = (event) => {
		const { value } = event.target;
		const copiaSellerRedux = [...sellerRedux];
		let result = [];

		if (parseInt(value) === 1) {
			// Orden Asendente
			result = copiaSellerRedux.sort((a, b) => a.id - b.id);
		} else if (parseInt(value) === 2) {
			//Orden Desendente
			result = copiaSellerRedux.sort((a, b) => b.id - a.id);
		} else if (parseInt(value) === 3) {
			// Orden Por Ruta
			result = copiaSellerRedux.sort((a, b) =>
				b.code.localeCompare(a.code)
			);
		} else if (parseInt(value) === 4) {
			// Orden Por Deuda Mayor
			let arrHigherDebt = [];
			for (let index = 0; index < sellerRedux.length; index++) {
				const filterInvSeller = invoice.filter(
					(inv) =>
						parseInt(inv.seller.id) ===
						parseInt(sellerRedux[index].id)
				);

				const sumTotal = Object.values(filterInvSeller).reduce(
					(acc, cur) => acc + parseFloat(cur?.balance),
					0
				);
				arrHigherDebt.push({
					sellerID: sellerRedux[index].id,
					totalDebt: parseFloat(sumTotal).toFixed(2),
				});
			}
			const ordMaxLow = arrHigherDebt.sort(
				(a, b) => b.totalDebt - a.totalDebt
			);
			// console.log(ordMaxLow);
			result = copiaSellerRedux.sort((a, b) => {
				const indexA = ordMaxLow.findIndex(
					(item) => item.sellerID === a.id
				);
				const indexB = ordMaxLow.findIndex(
					(item) => item.sellerID === b.id
				);
				return indexA - indexB;
			});
		} else {
			return dispatch(getSellerThunk());
		}
		dispatch(setSeller(result));
	};

	const listAvailable = () => {
		return (
			<>
				<Form.Select
					size="sm"
					className="w-30"
					aria-label="Default select example"
					onChange={orderList}
				>
					<option value={0}>Ordenar</option>
					<option value={1}>Ascendente</option>
					<option value={2}>Descendente</option>
					<option value={3}>Por Ruta</option>
					<option value={4}>Mayor Deuda</option>
				</Form.Select>
			</>
		);
	};

	const search = (data) => {
		const filteredList = sellerRedux.filter(
			(item) =>
				item.name?.toLowerCase().includes(data.toLowerCase()) ||
				item.code?.toLowerCase().includes(data.toLowerCase()) ||
				(item.isActive === true ? "si" : "no") === data.toLowerCase()
		);
		dispatch(setPagination(filteredList));
	};

	const refresh = () => {
		dispatch(getSellerThunk());
	};

	return (
		<div className="sellers pages">
			<div>
				<h2>Vendedores</h2>
				<Functionalitiesbtn
					buttons={btnCreated}
					listAvailable={listAvailable}
					search={search}
				/>
			</div>
			<div>
				<TableSellers
					data={pagination}
					updateData={updateData}
					deleteData={deleteData}
				/>
				{!loading ? (
					<Paginationdesign data={"seller"} />
				) : (
					<LoadingScreen />
				)}
			</div>
			<CreateSeller show={modalShow} onHide={() => setModalShow(false)} />

			<CreateSellersClouster
				show={showCreateByClouster}
				onHide={() => setShowCreateByClouster(false)}
			/>
		</div>
	);
};

export default Sellers;
