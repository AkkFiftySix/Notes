import { Auth } from "../interfaces/Auth";
import { Register } from "../interfaces/Register";
import axiosInstance from "./configs/axiosConfig";

const login = ({login, password}: Auth) => {
    return axiosInstance.post('/authuser/login',
        {
            login,
            password
        })
}

const confirm = ({login, value}: {login: string, value: string}) => {
    return axiosInstance.post(`/authuser/confirm/${login}/${value}`)
}

const resetConfirm = (login: string) => {
    return axiosInstance.post(`/authuser/reset-confirm/${login}`)
}

const register = ({
    email, 
    login, 
    password, 
    confirmPassword
}: Register) => {
    return axiosInstance.post('/authuser/register',
    {
        email,
        login,
        password,
        confirmPassword
    })
}

const self = () => { 
    return axiosInstance.get('/authuser/self')
}

export const authUserApi = {login, confirm, resetConfirm, register, self};