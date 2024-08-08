import { SyntheticEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { $isRegistrationSuccess, registerFunc } from "./_model";
import { useUnit } from "effector-react";
import useEventListener from "../../hooks/useEventListener";
import { ENTER, KEYUP } from "../../common/constants";

const Registration = () => {
    const navigate = useNavigate()
    const toLogin = () => navigate('/login')

    const [email, setEmail] = useState('')
    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const isRegistrationSuccess = useUnit($isRegistrationSuccess)

    const register = () =>
        registerFunc({
            email,
            login,
            password,
            confirmPassword
        })

    useEventListener(KEYUP, ENTER, () => register())

    return (
        <main className="d-flex align-items-center form-signin w-100 h-100 m-auto">
            {!isRegistrationSuccess && (
                <div className="flex-grow-1">
                    <h1 className="d-flex justify-content-center h3 mb-3 fw-normal">Registration</h1>
                    <div className="form-floating">
                        <input name="first" type="text" className="form-control" id="floatingInput" placeholder="" autoFocus
                            onChange={e => setEmail(e.target.value)} />
                        <label htmlFor="floatingInput">Email</label>
                    </div>
                    <div className="form-floating">
                        <input name="middle" type="text" className="form-control" id="floatingInput" placeholder=""
                            onChange={e => setLogin(e.target.value)} />
                        <label htmlFor="floatingInput">Login</label>
                    </div>
                    <div className="form-floating">
                        <input name="middle" type="password" className="form-control" id="floatingPassword" placeholder=""
                            onChange={e => setPassword(e.target.value)} />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <div className="form-floating">
                        <input name="last" type="password" className="form-control" id="floatingPassword" placeholder=""
                            onChange={e => setConfirmPassword(e.target.value)} />
                        <label htmlFor="floatingPassword">Confirm password</label>
                    </div>
                    <button onClick={register} className="btn btn btn-outline-primary w-100 py-2">Register</button>
                    <button onClick={toLogin} className="btn btn-outline-secondary w-100 py-2 mt-2">Login</button>
                </div>
            )}
            {isRegistrationSuccess && (
                <div className="flex-grow-1">
                    <h1 className="d-flex justify-content-center h3 fw-normal">Registration success!</h1>
                    <p className="d-flex justify-content-center">Confirmation code was sended to {email}</p>
                    <button onClick={toLogin} className="btn btn-outline-primary w-100 py-2 mt-2">Go to login</button>
                </div>
            )}
        </main>
    );
};

export default Registration;