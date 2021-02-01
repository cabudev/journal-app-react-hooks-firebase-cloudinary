import Swal from 'sweetalert2';

import { firebase, googleAuthProvider } from '../firebase/firebase-config';
import { types } from '../types/types';
import { startLoading, finisLoading} from '../actions/ui';
import { cleaningNotesLogOut } from './notes'

export const startLoginEmailPassword = (email, password) => {
    return (dispatch) => {
        dispatch( startLoading( ));
        firebase.auth().signInWithEmailAndPassword( email, password )
            .then( ({ user }) => {
                dispatch( login( user.uid, user.displayName ) )
                dispatch( finisLoading() );
            })
            .catch( e  => {
                console.log( e )
                dispatch( finisLoading() );
                Swal.fire("Error", e.message, 'error');
            })
    }
}

export const startRegisterWithEmailPassword = ( email, password, name ) => {
    //al ser una funcion asincrona vamos a retornar un callback
    return ( dispatch ) => {
        firebase.auth().createUserWithEmailAndPassword(email, password)
            .then( async({ user }) => {
                //si el usuario se crea le actualiza el displayName
                await user.updateProfile({ displayName: name });
                
                dispatch(
                    login( user.uid, user.displayName )
                )

            })
            .catch( e  => {
                console.log( e )
                Swal.fire("Error", e.message, 'error');
            })
    }
}

export const startGoogleLogin = () => {
    return(dispatch) => {
        firebase.auth().signInWithPopup( googleAuthProvider )
            .then( ({ user }) => {
                dispatch(
                    login( user.uid, user.displayName)
                )
            });
    }
}

export const login =  (uid, displayName) => (
    {
        type: types.login,
        payload: {
            uid,
            displayName
        }
    }
)

export const startLogout = () => {
    return async( dispatch ) => {
        await firebase.auth().signOut();
        dispatch( logout() );
        dispatch( cleaningNotesLogOut() );
    }
}

export const logout = () => ({
    type: types.logout
})