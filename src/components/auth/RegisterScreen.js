import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import validator from 'validator';

import { useForm } from '../../hooks/useForm';
import { setError, removeError} from '../../actions/ui';
import { startRegisterWithEmailPassword } from '../../actions/auth';

export const RegisterScreen = () => {
    
    //hook de react-redux para disparar la acción
    const dispatch = useDispatch();

    const { msgError } = useSelector( state => state.ui);


    const [ formValues, handleInputChange ] = useForm({
        name: '',
        email: '',
        password: '',
        password2: ''
    })

    const { name, email, password, password2 } = formValues

    const handleRegister = (e) => {
        e.preventDefault();
        if( isFormValid() ) {
            dispatch( startRegisterWithEmailPassword(email, password, name) );
        }
    }

    const isFormValid = () => {

        if( name.trim().length === 0 ) {
            dispatch( setError( 'Es nombre es obligatorio' ) );
            return false;
        } else if ( !validator.isEmail(email) ){
            dispatch( setError( 'El email no tiene un formato valido' ) );
            return false;
        } else if ( password !== password2 || password.length<5 ){
            dispatch( setError( 'La contraseña debe tener al menos 6 caracteres y deben ser iguales.' ) );
            return false;
        }
        dispatch( removeError() );
        return true;
    }
    
    return (
        <>
            <h3 className="auth__title">Crear una cuenta</h3>

            <form 
                onSubmit={ handleRegister }
                className="animate__animated animate__fadeIn animate__faster"  
            >
                
                {
                    msgError &&
                    (
                        <div className="auth__alert-error">
                            { msgError }
                        </div>
                    )
                }

                <input 
                    type="text"
                    placeholder="Nombre"
                    name="name"
                    className="auth__input"
                    autoComplete="off"
                    value={ name }
                    onChange = { handleInputChange }
                />

                <input 
                    type="text"
                    placeholder="Email"
                    name="email"
                    className="auth__input"
                    autoComplete="off"
                    value={ email }
                    onChange = { handleInputChange }
                />

                <input
                    type="password"
                    placeholder="Contraseña"
                    name="password"
                    className="auth__input"
                    autoComplete="off"
                    value={ password }
                    onChange = { handleInputChange }
                />

                <input
                    type="password"
                    placeholder="Confirmar contraseña"
                    name="password2"
                    className="auth__input"
                    autoComplete="off"
                    value={ password2 }
                    onChange = { handleInputChange }
                />

                <button
                    type="submit"
                    className="btn btn-primary btn-block"
                >
                    Crear una cuenta
                </button>

                <div className="auth__social-networks">
                    <div className="google-btn">
                    <div className="google-icon-wrapper">
                        <img className="google-icon" src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="google button" />
                    </div>
                        <p className="btn-text">
                            <b>Registrarse con Google</b>
                        </p>
                    </div>
                </div>

                <Link 
                    to="/auth/login"
                    className="link"
                    >o inicia sesión</Link>
            </form>         
        </>
    )
}
