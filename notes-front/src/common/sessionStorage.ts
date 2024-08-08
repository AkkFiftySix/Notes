import { createEvent, createStore, sample } from "effector";
import { ACCESS_TOKEN } from "./constants";

const isLoginInitState = localStorage.getItem(ACCESS_TOKEN);

export const $isLogin = createStore<boolean>(!!isLoginInitState ?? false)
export const setIsLoggedIn = createEvent<boolean>()

sample({
    source: setIsLoggedIn,
    target: $isLogin
})