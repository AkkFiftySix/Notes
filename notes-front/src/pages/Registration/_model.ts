import { createEffect, createEvent, createStore, sample } from "effector"
import { authUserApi } from "../../api/authuser"
import { Register } from "../../interfaces/Register"

// #region stores

export const $isRegistrationSuccess = createStore<boolean>(false)
export const setIsRegistrationSuccess = createEvent<boolean>()
sample({
    source: setIsRegistrationSuccess,
    target: $isRegistrationSuccess
})

// #endregion

// #region register

const registerFx = createEffect<Register, any, any>(authUserApi.register)
export const registerFunc = createEvent<Register>()
sample({ source: registerFunc, target: registerFx }) 

sample({
    source: registerFx.doneData,
    target: $isRegistrationSuccess,
    fn: () => true
})

// #endregion