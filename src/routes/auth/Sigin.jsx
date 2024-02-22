import axios from 'axios';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import resources from '../../utils/resources';
import setErrorReceived from "../../store/slices/errorReceived.slice";
import setIsLoading from "../../store/slices/isLoading.slice";
import Form from 'react-bootstrap/Form';
import { useForm } from 'react-hook-form';

const Sigin = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const URL_BASE = resources.URL_BASE;

    const { register, handleSubmit } = useForm();

    const isLoggedUser = () => {
        const IsLogeed = localStorage.getItem("tokenLiquidation");
        if (!IsLogeed) {
            navigate("/sigin");
        } else {
            navigate("/login");
        }
    }


    const submit = (data) => {
        alert('Registro con exito')
        axios.post(`${URL_BASE}/api/v1/auth/register`, data)
            .then((res) => {
               // console.log(res);
                navigate("/dashboard");
                dispatch(setUserLoged(res.data?.data));
                localStorage.setItem('userLiquidation', JSON.stringify(res.data.data))
                localStorage.setItem('token', res.data.data.token)
            })
            .catch(err => {
               // console.log(err);
                if (err.response?.status === 404 || err.response?.status === 400) {
                    dispatch(setErrorReceived(err.response?.data))
                }
            })
            .finally(() => dispatch(setIsLoading(false)));
    }

    return (
        <div>
            <Form onSubmit={handleSubmit(submit)}>
                <label>
                    Nombre:
                    <input type="text" name="name" {...register('nombre')} />
                </label>
                <label>
                    Username:
                    <input type="text" name="username" {...register('username')} />
                </label>
                <label>
                    DNI:
                    <input type="text" name="dni" {...register('dni')} />
                </label>
                <label>

                    Email:
                    <input type="email" name="email" {...register('email')} />
                </label>
                <label>
                    Contraseña:
                    <input type="password" name="password" {...register('password')} />
                </label>
                <button type="submit">Registrarse</button>
            </Form>
        </div>
    );
};

export default Sigin;