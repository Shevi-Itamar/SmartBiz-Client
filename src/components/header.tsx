import { useAppDispatch, useAppSelector } from '../store/hooks';
import { Link, useNavigate } from 'react-router-dom';
import { isTokenValid, logout } from '../store/slice/authSlice';
import { fetchBusiness } from '../store/slice/businessSlice';
import { useEffect } from 'react';



type HeaderProps = {
    onLoginClick: () => void;
    onSignupClick: () => void;
};

export const Header = ({ onLoginClick, onSignupClick }: HeaderProps) => {
    const business = useAppSelector((state) => state.business.details);
    const dispatch = useAppDispatch();
    const { token } = useAppSelector((state) => state.auth);
    const { currentUser } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        dispatch(fetchBusiness());
        
    },[dispatch]);



    const showMeetingButton = isTokenValid(token);

    const handleClick = () => {
        if (currentUser?.role === 'admin') {
            navigate('/meetingsForManager');
        } else if (currentUser?.role === 'user') {
        navigate('/meetingsForUser/' + currentUser?.userEmail);
    }
  }

      const handleUsersClick = () => {
        if (currentUser?.role === 'admin') {
            navigate('/UsersDetails');
        } else if (currentUser?.role === 'user') {
        navigate('/currentUserDetails/' + currentUser?.userEmail);
    }
  }



    const handleLogout = () => {
        dispatch(logout());
        navigate('/');
    };

    return (
        <header className="header">
            <div className="header-left">
                <Link to={'/'} className="business-name">
                    {business?.businessName || 'העסק שלך'}
                </Link>
                <p className="business-subtitle">יעוץ עסקי וכלכלי - הצלחה היא עניין של תכנון</p>
            </div>
            <div className="header-right">
                {showMeetingButton &&<div> <button onClick={handleClick} className="header-meeting-button">הפגישות שלך</button> <button onClick={handleUsersClick} className="header-meeting-button">פרטי משתמש</button></div>}
                {!isTokenValid(token) ? (
                    <>
                        <button onClick={onLoginClick} className="header-button">התחבר</button>
                        <button onClick={onSignupClick} className="header-button">הרשמה</button>
                    </>
                ) : (
                    <button onClick={handleLogout} className="header-button">התנתקות</button>
                )}
            </div>
        </header>
    );

};






