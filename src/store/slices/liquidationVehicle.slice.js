import { createSlice } from '@reduxjs/toolkit';
import { setIsLoading } from './isLoading.slice';
import axios from 'axios';
import getConfig from "../../utils/getConfig";
import resources from "../../utils/resources";
import { setErrorReceived } from './errorReceived.slice';

const URL_BASE = resources.URL_BASE;

export const liquidationVehicleSlice = createSlice({
    name: 'liquidationVehicle',
    initialState: [],
    reducers: {
        setLiquidationVehSlice: (state, action) => {
            return action.payload;
        }

    }
});

export const { setLiquidationVehSlice } = liquidationVehicleSlice.actions;

export const getVehicleLiquidationThunk = () => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.get(`${URL_BASE}/api/v1/liquidation-veh/all`, getConfig())
        .then(res => {
            dispatch(setLiquidationVehSlice(res.data.result));
            // console.log("Recibe peticion Get liquidaction");
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response?.data));
            // console.log("Error en Slice");
            // alert("No se pudo actualizar la lista de Liquidaciones");
        })
        .finally(() => dispatch(setIsLoading(false)))
};

export const postVehicleLiquidationthunk = (data) => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.post(`${URL_BASE}/api/v1/liquidation-veh/new`, data, getConfig())
        .then(() => {
            dispatch(getVehicleLiquidationThunk());
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response.data));
        })
        .finally(() => dispatch(setIsLoading(false)));
};


export default liquidationVehicleSlice.reducer;
