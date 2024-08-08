import { createEffect, createEvent, createStore, sample } from "effector";
import { authUserApi } from "../../api/authuser";
import { Auth } from "../../interfaces/Auth";
import { ACCESS_TOKEN, AUTHRIZATION_HEADER } from "../../common/constants";
import { $isLogin } from "../../common/sessionStorage";

// stores
export const $isConfirmationNeeded = createStore<boolean>(false)
export const setIsConfirmationNeeded = createEvent<boolean>()
sample({ source: setIsConfirmationNeeded, target: $isConfirmationNeeded })

// login
const loginFx = createEffect<Auth, any, any>(authUserApi.login)
export const loginFunc = createEvent<Auth>()
sample({ source: loginFunc, target: loginFx }) 

sample({
    source: loginFx.doneData,
    target: $isLogin,
    fn: data => auth(data)
})

sample({
    source: loginFx.failData,
    target: $isLogin,
    fn: () => false
})

sample({
    source: loginFx.failData,
    target: $isConfirmationNeeded,
    fn: data => data.response.status === 420
})

// confirmEmail
const confirmEmailFx = createEffect<{login: string, value: string}, any, any>(authUserApi.confirm)
export const confirmEmailFunc = createEvent<{login: string, value: string}>()
sample({ source: confirmEmailFunc, target: confirmEmailFx })

sample({
    source: confirmEmailFx.doneData,
    target: $isLogin,
    fn: data => auth(data)
})

$isConfirmationNeeded.reset([confirmEmailFx.doneData])

// resetConfirm
const resetConfirmFx = createEffect<string, any, any>(authUserApi.resetConfirm)
export const resetConfirmFunc = createEvent<string>()
sample({ source: resetConfirmFunc, target: resetConfirmFx })

// private methods
const auth = (data: any) => {
    const token = data.headers[AUTHRIZATION_HEADER]
    localStorage.setItem(ACCESS_TOKEN, token)
    return true
}