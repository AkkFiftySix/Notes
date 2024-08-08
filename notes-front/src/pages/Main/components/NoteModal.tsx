import { Modal } from "react-bootstrap"
import { Note } from "../../../interfaces/Note"
import { deleteNoteFunc, restoreNoteFunc, setSelectedNote, softDeleteNoteFunc, updateNoteFunc } from "../_model"
import { useEffect } from "react"

const NoteModal = (props: { show: boolean, onClose: () => void, note: Note, editMode: boolean }) => {

    const update = () => {
        if (!!props.note.header && !!props.note.description)
            updateNoteFunc(props.note)
    }

    return (
        <Modal
            show={props.show}
            onHide={props.onClose}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header>
                {props.editMode && (
                    <input value={props.note.header} onChange={e => setSelectedNote({ ...props.note, header: e.target.value })}
                        type="text" className="form-control" id="floatingInput" placeholder="" />
                )}
                {!props.editMode && (
                    <Modal.Title>
                        {props.note.header}
                    </Modal.Title>
                )}
            </Modal.Header>
            <Modal.Body>
                {props.editMode && (
                    <textarea value={props.note.description} onChange={e => setSelectedNote({ ...props.note, description: e.target.value })} name="last"
                        className="form-control" id="floatingInput" placeholder="" style={{ resize: 'none', height: '100px' }} />
                )}
                {!props.editMode && props.note.description}
            </Modal.Body>
            <Modal.Footer>
                {props.editMode && (
                    <>
                        <div className="d-flex align-items-center justify-content-between w-100">
                            <button onClick={update} className="btn btn btn-outline-primary me-3">Save</button>
                            <div className="infoDesktop">
                                <small>Created: {props.note.createdDate} <br /> Updated: {props.note.updatedDate}</small>
                            </div>
                            <div className="d-flex align-items-center">
                                <button onClick={() => { softDeleteNoteFunc(props.note.id!); props.onClose() }} className="btn btn-outline-danger">Delete</button>
                                <button onClick={props.onClose} className="btn btn-outline-secondary ms-2">Cancel</button>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between w-100">
                            <div className="infoMobile">
                                <small>Created: {props.note.createdDate} <br /> Updated: {props.note.updatedDate}</small>
                            </div>
                        </div>
                    </>
                )}
                {!props.editMode && (
                    <>
                        <div className="d-flex justify-content-between w-100">
                            <button onClick={() => { restoreNoteFunc(props.note.id!); props.onClose() }} className="btn btn btn-outline-primary">Restore</button>
                            <div className="infoDesktop">
                                <small>Created: {props.note.createdDate} <br /> Updated: {props.note.updatedDate}</small>
                            </div>
                            <div className="d-flex align-items-center">
                                <button onClick={() => { deleteNoteFunc(props.note.id!); props.onClose() }} className="btn btn-outline-danger">Delete forever</button>
                                <button onClick={props.onClose} className="btn btn-outline-secondary ms-2">Cancel</button>
                            </div>
                        </div>
                        <div className="d-flex justify-content-between w-100">
                            <div className="infoMobile">
                                <small>Created: {props.note.createdDate} <br /> Updated: {props.note.updatedDate}</small>
                            </div>
                        </div>
                    </>
                )}
            </Modal.Footer>
        </Modal>
    )
}

export default NoteModal