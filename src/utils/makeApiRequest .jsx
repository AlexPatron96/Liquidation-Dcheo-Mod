import axios from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setIsLoading } from "../store/slices/isLoading.slice";
import getConfig from "./getConfig";

const API_BASE_URL = 'http://localhost:8000';
const makeApiRequest = async (url, method, data) => {
    const requestUrl = `${API_BASE_URL}${url}`;
    const headers = {
        'Content-Type': 'application/json',
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    };
    //console.log(headers);
    try {
        const response = await axios({
            method: method,
            url: requestUrl,
            data: data,
            headers: headers,
        });
        return response.data;
    } catch (error) {
        console.error(`Error making API request to ${requestUrl}: ${error}`);
        throw error;
    }
}

export default makeApiRequest;
// const navigate = useNavigate();
// const dispatch = useDispatch();
// dispatch(setIsLoading(true))
// axios.`${req}`(`http://localhost:8000/api/v1/seller/all`, getConfig())
//     .then((res) => {
//         console.log(res.data);
//         dispatch(setVehicles(res.data.result))
//         // alert(res.data.message);
//         // setvehicles(res.data.result);

//         //localStorage.setItem('token', res.data.data.token)
//         //navigate('/dashboard')
//     })
//     .catch(err => {
//         console.log(err);
//         if (err.response?.status === 404 || err.response?.status === 400) {
//             // dispatch(setUserLoged(err.response?.data))
//             if (err.response?.data.error === "Invalid Token") {
//                 navigate("/");
//             }
//             setData(err.response?.data)
//         } else {
//             setVehicles(err.response?.data)
//         }
//     })
//     .finally(() => dispatch(setIsLoading(false)));