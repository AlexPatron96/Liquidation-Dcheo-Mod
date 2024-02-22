import { createSlice } from '@reduxjs/toolkit';
import { setIsLoading } from './isLoading.slice';
import axios from 'axios';
import getConfig from "../../utils/getConfig";
import resources from "../../utils/resources";
import { setErrorReceived } from './errorReceived.slice';

const URL_BASE = resources.URL_BASE;

export const liquidationSlice = createSlice({
    name: 'liquidation',
    initialState: [],
    reducers: {
        setLiquidationSlice: (state, action) => {
            return action.payload;
        }
    }
})

export const { setLiquidationSlice } = liquidationSlice.actions;

export const getSellerLiquidationThunk = () => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.get(`${URL_BASE}/api/v1/liquidation-sell/all`, getConfig())
        .then(res => {
            dispatch(setLiquidationSlice(res.data.result));
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response?.data));
        })
        .finally(() => dispatch(setIsLoading(false)))
};

export const postSellerLiquidationthunk = (data) => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.post(`${URL_BASE}/api/v1/liquidation-sell/new`, data, getConfig())
        .then(() => {
            dispatch(getSellerLiquidationThunk());
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response.data));
        })
        .finally(() => dispatch(setIsLoading(false)));
};
export default liquidationSlice.reducer;
