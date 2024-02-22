import { configureStore } from "@reduxjs/toolkit";
import isLoadingSlice from "./slices/isLoading.slice";
import userLogedSlice from "./slices/userLoged";
import vehiclesSlice from "./slices/vehicles.slice";
import paginationSlices from "./slices/pagination.slice";
import sellersSlice from "./slices/seller.slice";
import invoiceSlice from "./slices/invoice.slice";
import closeoutsSlice from "./slices/closeouts.slice";
import customerSlice from "./slices/customer.slice";
import errorReceivedSlice from "./slices/errorReceived.slice";
import dataTempSlice from "./slices/dataTemp.slice";
import liquidationSlice from "./slices/liquidation.slice";
import routeDaySlice from "./slices/routeday.slice";
import transaccionSlice from "./slices/transaccion.slice";
import checkMoneySlice from "./slices/checkMoney.slice";
import preLiquidationSellerSlice from "./slices/preLiquidationSeller.slice";
import liquidationVehicleSlice from "./slices/liquidationVehicle.slice";
import listUserSlice from "./slices/listUser.slice";

export default configureStore({
	reducer: {
		isLoading: isLoadingSlice,
		userLoged: userLogedSlice,
		vehicles: vehiclesSlice,
		invoice: invoiceSlice,
		pagination: paginationSlices,
		seller: sellersSlice,
		customer: customerSlice,
		closeouts: closeoutsSlice,
		errorReceived: errorReceivedSlice,
		temporary: dataTempSlice,
		routeDay: routeDaySlice,
		liquidation: liquidationSlice,
		transaction: transaccionSlice,
		checkMoney: checkMoneySlice,
		preLiquidationSeller: preLiquidationSellerSlice,
		liquidationVehicle: liquidationVehicleSlice,
		listUser: listUserSlice,
	},
});
