import { useEffect, useState } from "react";
import { setIsLoggedIn } from "../../common/sessionStorage";
import { ACCESS_TOKEN } from "../../common/constants";
import { useUnit } from "effector-react";
import { $login, $selectedNote, $modalEditMode, $modalShow, getLoginFunc, setModalShow, getNotesFunc, $searchString, setSearchString, setIsTrash } from "./_model";
import Notes from "./components/Notes";
import NotesTrash from "./components/NotesTrash";
import { useNavigate } from "react-router-dom";
import NoteModal from "./components/NoteModal";

const Main = (props: { isTrash: boolean }) => {
    let navigate = useNavigate();
    const toNotes = () => {
        setSearchString('')
        navigate('/')
    }
    const toNotesTrash = () => {
        setSearchString('')
        navigate('/trash')
    }

    const login = useUnit($login)
    const modalShow = useUnit($modalShow)
    const modalData = useUnit($selectedNote)
    const modalEditMode = useUnit($modalEditMode)
    const searchString = useUnit($searchString)

    useEffect(() => {
        setIsTrash(props.isTrash)
        if (!login)
            getLoginFunc()
    }, [props.isTrash])

    const logout = () => {
        localStorage.removeItem(ACCESS_TOKEN)
        setIsLoggedIn(false)
    }

    return (
        <>
            <header className="d-flex justify-content-between align-items-center p-2 border-bottom">
                <div className="d-flex align-items-center">
                    <div style={{ minWidth: '75px' }}>Hello, {login}!</div>
                    <div className="ms-3 me-3" style={{ minWidth: '100px' }}>
                        <input value={searchString} type="text" onChange={e => setSearchString(e.target.value)} className="form-control" id="floatingInput" placeholder="Search" />
                    </div>
                </div>
                <div className="d-flex gap-2">
                    {!props.isTrash && (
                        <button onClick={() => toNotesTrash()} className="btn btn-outline-danger rounded-3 py-2">
                            <i className="fa-solid fa-trash-can"></i> <span className="spanchik">&nbsp; Trash</span>
                        </button>)}
                    {props.isTrash && (
                        <button onClick={() => toNotes()} className="btn btn-outline-primary rounded-3 py-2">
                            <i className="fa-solid fa-house"></i> <span className="spanchik">&nbsp; Home</span>
                        </button>)}
                    <button onClick={logout} className="btn btn-outline-danger py-2">
                        <i className="fas fa-sign-out-alt"></i> <span className="spanchik">&nbsp; Logout</span>
                    </button>
                </div>
            </header>
            {!props.isTrash && <Notes />}
            {props.isTrash && <NotesTrash />}
            <NoteModal show={modalShow} onClose={() => setModalShow(false)} note={modalData} editMode={modalEditMode} />
        </>
    );
};

export default Main;
