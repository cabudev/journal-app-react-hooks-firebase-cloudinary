import Swal from 'sweetalert2'

import { db } from "../firebase/firebase-config";
import { types } from "../types/types";

import { loadNotes } from '../helpers/loadNotes';
import { fileUpload } from '../helpers/fileUpload';

export const startNewNote = () => {
    return async ( dispatch, getState ) => {
        const { uid } = getState().auth;

        const newNote = {
            title: '',
            body: '',
            date: new Date().getTime()
        }
        const doc = await db.collection(`${ uid }/journal/notes`).add( newNote );
        
        dispatch( activeNote( doc.id, newNote ) );
        dispatch( addNewNote( doc.id, newNote ) );
    }
}

export const activeNote = ( id, note ) => ({
    type: types.notesActive,
    payload: {
        id,
        ...note
    }
});

export const addNewNote = (id, note) => ({
    type: types.notesAddNew,
    payload: {
        id, ...note
    }
});

export const startLoadingNotes = ( uid ) => {
    return async( dispatch ) => {
        //recupera las notas de la base de datos
        const notes = await loadNotes( uid );
        //las añade a la store
        dispatch( setNotes(notes) );
    }
}

export const setNotes = ( notes ) => ({
    type: types.notesLoad,
    payload: notes
});

export const startSaveNote = ( note ) => {
    return async( dispatch, getState ) => {
        const { uid } = getState().auth;

        const noteToFirestore = { ...note };
        delete noteToFirestore.id;

        await db.doc(`${ uid }/journal/notes/${note.id}`).update( noteToFirestore );

        dispatch( refreshNote( note.id, noteToFirestore) );
        Swal.fire('Guardado', note.title, 'success');
    }
}

export const refreshNote = ( id, note ) => ({
    type: types.notesUpdated,
    payload: {
        id, 
        note: {
            id,
            ...note
        }
    }
})

export const startUploading = ( file ) => {
    return async( dispatch, getState ) => {
        const { active:activeNote } = getState().notes;

        Swal.fire({
            title: 'Subiendo Imagen...',
            text: 'Espera',
            allowOutsideClick: false,
            onBeforeOpen: () => {
                Swal.showLoading();
            }
        })

        const fileUrl = await fileUpload( file );
        activeNote.url = fileUrl;

        dispatch( startSaveNote( activeNote ) )

        Swal.close();
    }
}

export const startDeleting = ( id ) => {
    return async( dispatch, getState ) => {

        const { uid } = getState().auth;
        await db.doc(`${uid}/journal/notes/${ id }`).delete();

        dispatch( deleteNote(id) );
    }
}

export const deleteNote = (id) => ({
    type: types.notesDelete,
    payload: id
});

export const cleaningNotesLogOut = () => ({
    type: types.notesLogOutCleaning
})
