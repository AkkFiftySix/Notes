import { useState } from "react";
import { useNavigate } from "react-router-dom";
import VerificationInput from "react-verification-input";
import { $isConfirmationNeeded, confirmEmailFunc, loginFunc, resetConfirmFunc, setIsConfirmationNeeded } from "./_model";
import { useUnit } from "effector-react";
import { ENTER, KEYUP } from "../../common/constants";
import useEventListener from "../../hooks/useEventListener";

const Login = () => {
    let navigate = useNavigate();
    const toRegistration = () => navigate('/register')

    const [login, setLogin] = useState('')
    const [password, setPassword] = useState('')
    const isConfirmationNeeded = useUnit($isConfirmationNeeded)

    const enter = () => loginFunc({ login, password })
    const confirmEmail = (value: string) => confirmEmailFunc({ login, value })
    const sendAgain = () => resetConfirmFunc(login)

    useEventListener(KEYUP, ENTER, () => enter())

    return (
        <main className="d-flex align-items-center form-signin w-100 h-100 m-auto">
            {!isConfirmationNeeded && (
                <div className="flex-grow-1">
                    <h1 className="d-flex justify-content-center h3 mb-3 fw-normal">Notes</h1>
                    <div className="form-floating">
                        <input name="first" type="text" className="form-control" id="floatingInput" placeholder="" autoFocus
                            onChange={e => setLogin(e.target.value)} />
                        <label htmlFor="floatingInput">Login</label>
                    </div>
                    <div className="form-floating">
                        <input name="last" type="password" className="form-control" id="floatingPassword" placeholder=""
                            onChange={e => setPassword(e.target.value)} />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <button onClick={enter} className="btn btn btn-outline-primary w-100 py-2">Enter</button>
                    <button onClick={toRegistration} className="btn btn-outline-secondary w-100 py-2 mt-2">Register</button>
                    <p className="d-flex justify-content-center mt-3 mb-3 text-body-secondary">&copy; Yunis Bagemskiy</p>
                </div>
            )}
            {isConfirmationNeeded && (
                <div className="flex-grow-1">
                    <h1 className="d-flex justify-content-center h3 mb-3 fw-normal">Enter confirmation code from email</h1>
                    <div className="mb-3">
                        <VerificationInput validChars='0-9' onComplete={v => confirmEmail(v)} />
                    </div>
                    <button onClick={sendAgain} className="btn btn-outline-primary w-100 py-2 mt-2">Send again</button>
                    <button onClick={() => setIsConfirmationNeeded(false)} className="btn btn-outline-secondary w-100 py-2 mt-2">Back</button>
                </div>
            )}
        </main>
    );
};

export default Login;