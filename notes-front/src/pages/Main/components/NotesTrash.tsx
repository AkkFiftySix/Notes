import {useEffect} from "react"
import {
    $notes,
    deleteNoteFunc,
    getNotesFunc,
    restoreNoteFunc,
    setSelectedNote,
    setModalEditMode,
    setModalShow,
    clearTrashFunc
} from "../_model"
import {useUnit} from "effector-react"
import {Note} from "../../../interfaces/Note"

const NotesTrash = () => {
    const notes = useUnit($notes)

    useEffect(() => {
        getNotesFunc({isDeleted: true})
    }, [])

    const onClickNote = (note: Note) => {
        setModalShow(true);
        setModalEditMode(false);
        setSelectedNote(note)
    }

    return (
        <main>
            {notes?.length > 0 && (
                <div className="d-flex align-items-center w-100 p-2 mt-2">
                    <div className="d-flex justify-content-center m-auto w-50">
                        <button onClick={() => clearTrashFunc()} className="btn btn-outline-danger rounded-3 w-50"
                                style={{minWidth: '150px'}}>
                            <i className="fa-solid fa-x"></i> &nbsp; Clear trash
                        </button>
                    </div>
                </div>)
            }
            <div className="d-flex flex-wrap gap-5 mx-5 mt-3">
                {notes.map((note) => (
                    <div onClick={() => onClickNote(note)} key={note.id} className="border rounded-3 note p-3">
                        <div className="d-flex justify-content-between">
                            <h1 className="h3 fw-normal mb-0">{note.header}</h1>
                            <button onClick={e => {
                                e.stopPropagation();
                                restoreNoteFunc(note.id!)
                            }} className="btn btn-primary-outline rounded-3 ms-5">
                                <i className="fa-solid fa-rotate-right"></i>
                            </button>
                            <button onClick={e => {
                                e.stopPropagation();
                                deleteNoteFunc(note.id!)
                            }} className="btn btn-primary-outline rounded-3">
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                        <hr/>
                        <p>{note.description}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default NotesTrash
