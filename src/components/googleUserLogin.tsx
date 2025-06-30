import { GoogleLogin } from '@react-oauth/google';
import { useAppDispatch } from '../store/hooks';
import { loginUserWithGoogle } from '../store/slice/authSlice';

export const GoogleUserLogin = () => {
  const dispatch = useAppDispatch();

  return (
    <GoogleLogin
      onSuccess={(credentialResponse) => {
        const token = credentialResponse.credential;
        if (token) {
          dispatch(loginUserWithGoogle(token));
        }
      }}
      onError={() => {
        console.log('Login Failed');
      }}
    />
  );
};
