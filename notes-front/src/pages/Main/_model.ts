import { combine, createEffect, createEvent, createStore, sample } from "effector"
import { authUserApi } from "../../api/authuser"
import { Note } from "../../interfaces/Note"
import { GetNotes } from "../../interfaces/GetNotes"
import { notesApi } from "../../api/notes"
import toast from "react-hot-toast"
import { debounce } from "patronum/debounce"

// #region stores

export const $login = createStore<string>('')
export const setLogin = createEvent<string>()
sample({
    source: setLogin,
    target: $login
})

export const $notes = createStore<Note[]>([])
export const setNotes = createEvent<Note[]>()
sample({
    source: setNotes,
    target: $notes
})

export const resetNewNote = createEvent()
export const $newNote = createStore<Note>({ id: 0, header: '', description: '', createdDate: '', updatedDate: '' }).reset(resetNewNote)
export const setNewNote = createEvent<Note>()
sample({
    source: setNewNote,
    target: $newNote
})

export const $isFocus = createStore<boolean>(false)
export const setIsFocus = createEvent<boolean>()
sample({
    source: setIsFocus,
    target: $isFocus
})

export const $modalShow = createStore<boolean>(false)
export const setModalShow = createEvent<boolean>()
sample({
    source: setModalShow,
    target: $modalShow
})

export const $modalEditMode = createStore<boolean>(false)
export const setModalEditMode = createEvent<boolean>()
sample({
    source: setModalEditMode,
    target: $modalEditMode
})

export const $selectedNote = createStore<Note>({ id: 0, header: '', description: '', createdDate: '', updatedDate: '' })
export const setSelectedNote = createEvent<Note>()
sample({
    source: setSelectedNote,
    target: $selectedNote
})

export const $searchString = createStore<string>('')
export const setSearchString = createEvent<string>()
sample({
    source: setSearchString,
    target: $searchString
})

export const $isTrash = createStore<boolean>(false)
export const setIsTrash = createEvent<boolean>()
sample({
    source: setIsTrash,
    target: $isTrash
})

// #endregion

// #region getLogin

const getLoginFx = createEffect<void, any, any>(authUserApi.self)
export const getLoginFunc = createEvent<void>()
sample({ source: getLoginFunc, target: getLoginFx })

sample({
    source: getLoginFx.doneData,
    target: $login,
    fn: data => data.data.login
})

// #endregion

// #region getNotes

const getNotesFx = createEffect<GetNotes, any, any>(notesApi.getNotes)
export const getNotesFunc = createEvent<GetNotes>()
sample({ source: getNotesFunc, target: getNotesFx })

sample({
    source: getNotesFx.doneData,
    target: $notes,
    fn: data => data.data
})

// #endregion

// #region saveNote

const saveNoteFx = createEffect<Note, any, any>(notesApi.saveNote)
export const saveNoteFunc = createEvent<Note>()
sample({ source: saveNoteFunc, target: saveNoteFx })

sample({
    source: saveNoteFx.doneData,
    target: getNotesFx,
    fn: () => {
        toast.success('Note saved')
        return { isDeleted: false }
    }
})

$newNote.reset([saveNoteFx.doneData])
$isFocus.reset([saveNoteFx.doneData])

// #endregion

// #region updateNote

const updateNoteFx = createEffect<Note, any, any>(notesApi.updateNote)
export const updateNoteFunc = createEvent<Note>()
sample({ source: updateNoteFunc, target: updateNoteFx })

sample({
    source: updateNoteFx.doneData,
    target: getNotesFx,
    fn: () => {
        toast.success('Note updated')
        return { isDeleted: false }
    }
})

$modalShow.reset([updateNoteFx.doneData])
$selectedNote.reset([updateNoteFx.doneData])
$isFocus.reset([updateNoteFx.doneData])

// #endregion

// #region softDeleteNote

const softDeleteNoteFx = createEffect<number, any, any>(notesApi.softDeleteNote)
export const softDeleteNoteFunc = createEvent<number>()
sample({ source: softDeleteNoteFunc, target: softDeleteNoteFx })

sample({
    source: softDeleteNoteFx.doneData,
    target: getNotesFx,
    fn: () => {
        toast.success('Note moved to trash')
        return { isDeleted: false }
    }
})

// #endregion

// #region deleteNote

const deleteNoteFx = createEffect<number, any, any>(notesApi.deleteNote)
export const deleteNoteFunc = createEvent<number>()
sample({ source: deleteNoteFunc, target: deleteNoteFx })

sample({
    source: deleteNoteFx.doneData,
    target: getNotesFx,
    fn: () => {
        toast.success('Note deleted')
        return { isDeleted: true }
    }
})

// #endregion

// #region restoreNote

const restoreNoteFx = createEffect<number, any, any>(notesApi.restoreNote)
export const restoreNoteFunc = createEvent<number>()
sample({ source: restoreNoteFunc, target: restoreNoteFx })

sample({
    source: restoreNoteFx.doneData,
    target: getNotesFx,
    fn: () => {
        toast.success('Note restored')
        return { isDeleted: true }
    }
})

// #endregion

// #region clearTrash

const clearTrashFx = createEffect<void, any, any>(notesApi.clearTrash)
export const clearTrashFunc = createEvent<void>()
sample({ source: clearTrashFunc, target: clearTrashFx })

sample({
    source: clearTrashFx.doneData,
    target: getNotesFx,
    fn: () => {
        toast.success('Trash cleared')
        return { isDeleted: true }
    }
})

// #endregion

// #region search

const debounceSearch = debounce({
    source: $searchString,
    timeout: 500
})

sample({
    source: combine({searchString: $searchString, isTrash: $isTrash}),
    clock: debounceSearch,
    target: getNotesFx,
    fn: ({searchString, isTrash}) => {
        return { searchString: searchString, isDeleted: isTrash};
    }
})

// #endregion