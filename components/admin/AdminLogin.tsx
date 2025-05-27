
import React, { useState, FormEvent } from 'react';
import { AppAction } from '../../types';
import { auth } from '../../firebaseConfig'; // Importar auth desde firebaseConfig
import { signInWithEmailAndPassword, AuthError } from 'firebase/auth';
import LoadingSpinner from '../LoadingSpinner';

interface AdminLoginProps {
  dispatch: React.Dispatch<AppAction>;
  authError: string | null;
  authLoading: boolean;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ dispatch, authError, authLoading }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'FIREBASE_LOGIN_REQUEST' });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      dispatch({ type: 'FIREBASE_LOGIN_SUCCESS', payload: userCredential.user });
    } catch (error) {
      const firebaseError = error as AuthError;
      let errorMessage = "Ocurrió un error al iniciar sesión.";
      if (firebaseError.code) {
        switch (firebaseError.code) {
          case 'auth/invalid-email':
            errorMessage = 'El formato del correo electrónico no es válido.';
            break;
          case 'auth/user-not-found':
          case 'auth/wrong-password':
          case 'auth/invalid-credential':
            errorMessage = 'Correo electrónico o contraseña incorrectos.';
            break;
          default:
            errorMessage = `Error: ${firebaseError.message}`;
        }
      }
      dispatch({ type: 'FIREBASE_LOGIN_FAILURE', payload: errorMessage });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-2xl">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Acceso de Administrador
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email-address" className="sr-only">Correo Electrónico</label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-t-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Correo Electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-3 border border-gray-300 bg-white text-gray-900 placeholder-gray-500 rounded-b-md focus:outline-none focus:ring-primary focus:border-primary focus:z-10 sm:text-sm"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {authError && (
            <p className="text-sm text-red-600 text-center bg-red-100 p-2 rounded-md">{authError}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={authLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-70"
            >
              {authLoading ? <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div> : 'Ingresar'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center">
           <button 
            onClick={() => dispatch({ type: 'SET_VIEW', payload: 'products' })}
            className="mt-4 font-medium text-gray-600 hover:text-gray-800"
          >
            Volver a la tienda
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
