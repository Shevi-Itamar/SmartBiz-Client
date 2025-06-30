import { loginUser, sendEmailVerification } from '../store/slice/authSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useState } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { GoogleUserLogin } from './googleUserLogin';
import { Link } from 'react-router-dom';
import { ResetPassword } from './resetPassword';

type LoginFormProps = {
  onSuccess?: () => void;
};

export const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const dispatch = useAppDispatch();
  const { loading, error, currentUser } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const clientId = "403016110145-93uhro864uemksssrt5tj34q269v178c.apps.googleusercontent.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(loginUser({ email, password }));
    if (res.meta.requestStatus === 'fulfilled' && onSuccess) {
      onSuccess();
    }
  };
  const handleForgotPasswordClick = (e:any) => {
    e.preventDefault();
    email
      if(email) {
        dispatch(sendEmailVerification(email));
        setShowResetPassword(true);
      }
  }

  return (
    <>
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-4">

      <h2 className="text-xl mb-4">התחברות</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="אימייל"
        className="border p-2 w-full mb-2"
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="סיסמה"
        className="border p-2 w-full mb-2"
      />
      <br />
      {email && <Link to={''}
            onClick={handleForgotPasswordClick}
            className="text-blue-500 hover:underline mb-2">שכחתי סיסמה</Link>}

      <GoogleOAuthProvider clientId={clientId}>
        <GoogleUserLogin />
      </GoogleOAuthProvider>
      <br />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 w-full"
        disabled={loading}
      >
        {loading ? 'טוען...' : 'התחבר'}
      </button>

      {error && <p className="text-red-500 mt-2">{String(error)}</p>}
      {localStorage.getItem('currentUser') && (
        <p className="text-green-500 mt-2">ברוך הבא, {currentUser?.userName}!</p>
      )}
    </form>
    {showResetPassword && <ResetPassword userEmail={email}
      isOpen={showResetPassword}
      onClose={() => setShowResetPassword(false)}></ResetPassword>}
      </>
  );
};
