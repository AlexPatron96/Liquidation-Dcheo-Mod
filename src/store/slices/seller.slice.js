import { createSlice } from '@reduxjs/toolkit';
import { setIsLoading } from './isLoading.slice';
import axios from 'axios';
import getConfig from "../../utils/getConfig";
import resources from "../../utils/resources";
import { setErrorReceived } from './errorReceived.slice';

const URL_BASE = resources.URL_BASE;


export const sellerSlice = createSlice({
    name: 'seller',
    initialState: [],
    reducers: {
        setSeller: (state, action) => {
            return action.payload
        }
    }
})

export const { setSeller } = sellerSlice.actions;

export const getSellerThunk = () => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.get(`${URL_BASE}/api/v1/seller/all`, getConfig())
        .then(res => {
            dispatch(setSeller(res.data.result));
            //console.log("Recibe peticion Get");
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response?.data));
            //console.log("Error en Slice");
            alert("No se pudo actualizar la lista de clientes");
        })
        .finally(() => dispatch(setIsLoading(false)))
};

export const postSellerthunk = (data) => (dispatch) => {
    dispatch(setIsLoading(true));
    //console.log(data);
    return axios.post(`${URL_BASE}/api/v1/seller/new`, data, getConfig())
        .then(() => {
            dispatch(getSellerThunk());
        })
        .catch(err => {
            //console.log("Error en Slice");
            alert("No se pudo actualizar el Vendedor");
            dispatch(setErrorReceived(err.response.data));
        })
        .finally(() => dispatch(setIsLoading(false)));
};

export const postSellerBalancethunk = (data) => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.post(`${URL_BASE}/api/v1/seller/new-balance`, data, getConfig())
        .then((res) => {
            dispatch(getSellerThunk());
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response?.data));
        })
        .finally(() => dispatch(setIsLoading(false)));
};

export const postSellCuadrethunk = (data) => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.post(`${URL_BASE}/api/v1/cuadre-sell/new`, data, getConfig())
        .then((res) => {
            dispatch(getSellerThunk());
        })
        .catch(err => {
            dispatch(setErrorReceived(err.response?.data));
        })
        .finally(() => dispatch(setIsLoading(false)));
};

export const postSellerClousterthunk = (data) => (dispatch) => {
    dispatch(setIsLoading(true));
    //console.log(data);
    return axios.post(`${URL_BASE}/api/v1/seller/newClouster`, data, getConfig())
        .then(() => {
            dispatch(getSellerThunk());
        })
        .catch(err => {
            //console.log("Error en Slice");
            alert("No se pudo actualizar el Vendedor");
            dispatch(setErrorReceived(err.response.data));
        })
        .finally(() => dispatch(setIsLoading(false)));
};

export const updateSellerThunk = (id, data) => (dispatch) => {
    //console.log(data);
    dispatch(setIsLoading(true));
    return axios.put(`${URL_BASE}/api/v1/seller/${id}/update`, data, getConfig())
        .then(() => {
            dispatch(getSellerThunk());
        })
        .catch(err => {
            alert(`No Se pudo actualizar el vendedor`);
            dispatch(setErrorReceived(err.response.data));
        })
        .finally(() => dispatch(setIsLoading(false)));
};

export const deleteSellerThunk = (id) => (dispatch) => {
    dispatch(setIsLoading(true));
    return axios.delete(`${URL_BASE}/api/v1/seller/${id}/del`, getConfig())
        .then(() => {
            dispatch(getSellerThunk());
        })
        .catch(err => {
            alert(`No Se pudo elimino el Vendedor`);
            dispatch(setErrorReceived(err.response.data));
        })
        .finally(() => dispatch(setIsLoading(false)));
};
export default sellerSlice.reducer;
