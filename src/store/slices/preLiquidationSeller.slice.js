import { createSlice } from '@reduxjs/toolkit';
import { setIsLoading } from './isLoading.slice';
import axios from 'axios';
import getConfig from "../../utils/getConfig";
import resources from "../../utils/resources";
import { setErrorReceived } from './errorReceived.slice';

const URL_BASE = resources.URL_BASE;

export const preLiquidationSellerSlice = createSlice({
    name: 'preLiquidationSeller',
    initialState: [],
    reducers: {
        setPreLiqSell: (state, action) => {
            return action.payload
        }
    }
})

export const { setPreLiqSell } = preLiquidationSellerSlice.actions;

export const getPreLiquiThunk = () => (dispatch) => {
    dispatch(setIsLoading(true))
    axios.get(`${URL_BASE}/api/v1/pre-liquidation/seller/all`, getConfig())
        .then(res => {
            dispatch(setPreLiqSell(res.data.result));
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response?.data));
        })
        .finally(() => dispatch(setIsLoading(false)))
};

export const postPreLiquiThunk = (data) => (dispatch) => {
    dispatch(setIsLoading(true))
    axios.post(`${URL_BASE}/api/v1/pre-liquidation/seller/new`, data, getConfig())
        .then(res => {
            // console.log(res.data);
            dispatch(getPreLiquiThunk());
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response?.data));
        })
        .finally(() => dispatch(setIsLoading(false)))
};

export default preLiquidationSellerSlice.reducer;
