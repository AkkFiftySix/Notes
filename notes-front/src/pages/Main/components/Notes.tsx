import { useUnit } from "effector-react"
import { useEffect } from "react"
import { useOutsideClick } from "../../../hooks/useOutsideClick"
import { $notes, $newNote, $isFocus, setIsFocus, getNotesFunc, saveNoteFunc, setNewNote, softDeleteNoteFunc, setModalShow, setSelectedNote, setModalEditMode, resetNewNote } from "../_model"
import { Note } from "../../../interfaces/Note"

const Notes = () => {
    const notes = useUnit($notes)
    const newNote = useUnit($newNote)
    const isFocus = useUnit($isFocus)

    const focus = (e: React.FocusEvent<HTMLInputElement>) => setIsFocus(true);

    useEffect(() => {
        getNotesFunc({ isDeleted: false })
    }, [])

    const ref = useOutsideClick(() => cancelCreatingNote())

    const cancelCreatingNote = () => {
        resetNewNote()
        setIsFocus(false)
    }

    const save = () => {
        if (!!newNote.header && !!newNote.description)
            saveNoteFunc(newNote)
    }

    const onClickNote = (note: Note) => {
        setModalShow(true);
        setModalEditMode(true);
        setSelectedNote(note)
    }

    return (
        <main>
            <div ref={ref} className="d-flex align-items-center w-100 p-2 mt-2">
                <div onFocus={focus} className="m-auto w-50">
                    <div className="form-floating" style={{ minWidth: '204px' }}>
                        <input value={newNote.header} onChange={e => setNewNote({...newNote, header: e.target.value})} name="first" type="text" className="form-control" id="floatingInput" placeholder="" />
                        <label htmlFor="floatingInput">New note</label>
                    </div>
                    {isFocus && (
                        <>
                            <div className="form-floating mb-1" style={{ minWidth: '204px' }}>
                                <textarea value={newNote.description} onChange={e => setNewNote({...newNote, description: e.target.value})} name="last"
                                    className="form-control" id="floatingInput" placeholder="" style={{ resize: 'none', height: '100px' }} />
                                <label htmlFor="floatingInput">Description</label>
                            </div>
                            <div className="d-flex justify-content-between align-items-center pt-2">
                                <button onClick={save} disabled={!newNote.header || !newNote.description}
                                    className="btn btn btn-outline-primary me-1" style={{ minWidth: '100px', width: '30%' }}>Save</button>
                                <button onClick={cancelCreatingNote} className="btn btn-outline-secondary" style={{ minWidth: '100px', width: '30%' }}>Cancel</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
            <div className="d-flex flex-wrap gap-5 mx-5 mt-3">
                {notes.map((note) => (
                    <div onClick={() => onClickNote(note)} key={note.id} className="border rounded-3 note p-3">
                        <div className="d-flex justify-content-between">
                            <h1 className="h3 fw-normal mb-0">{note.header}</h1>
                            <button onClick={e => { e.stopPropagation(); softDeleteNoteFunc(note.id!) }} className="btn btn-primary-outline rounded-3 ms-5">
                                <i className="fa-solid fa-x"></i>
                            </button>
                        </div>
                        <hr />
                        <p>{note.description}</p>
                    </div>
                ))}
            </div>
        </main>
    )
}

export default Notes;