import { GetNotes } from "../interfaces/GetNotes"
import { Note } from "../interfaces/Note"
import axiosInstance from "./configs/axiosConfig"

const getNotes = ({searchString = null, isDeleted = false}: GetNotes) => {
    return axiosInstance.get('/notes', { params: {searchString: searchString, isDeleted: isDeleted } })
}

const saveNote = (note: Note) => {
    return axiosInstance.post('/notes', note)
}

const updateNote = (note: Note) => {
    return axiosInstance.put(`notes`, note)
}

const softDeleteNote = (noteId: number) => {
    return axiosInstance.delete(`notes/soft/${noteId}`)
}

const deleteNote = (noteId: number) => {
    return axiosInstance.delete(`notes/${noteId}`)
}

const restoreNote = (noteId: number) => {
    return axiosInstance.post(`notes/restore/${noteId}`)
}

const clearTrash = () => {
    return axiosInstance.delete(`notes/all`)
}

export const notesApi = {getNotes, saveNote, softDeleteNote, deleteNote, restoreNote, updateNote, clearTrash};