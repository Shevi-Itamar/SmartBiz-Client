import './App.css'
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { setCurrentUser, setToken } from '../src/store/slice/authSlice'; // פעולה שמכניסה את הטוקן לרידאקס
import { Route, Routes } from 'react-router-dom';
import { Home } from './components/home';
import { AddMeeting } from './components/selectDate';
import { MeetingsForUser } from './components/meetingsForUser';
import { MeetingsForManager } from './components/meetingsForManager';
import { UsersDetails } from './components/usersDetails';
import {CurrentUserDetails} from './components/currentUserDetails'

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(setToken(token));
    }
      const savedUser = localStorage.getItem("currentUser");
      if (savedUser) {
        dispatch(setCurrentUser(JSON.parse(savedUser)));
      }
    
  }, []);

  return (<>

    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/login" element={<div>התחברות דרך מודל בלבד</div>} /> */}
      <Route path="/services/:id" element={<AddMeeting />} />
      <Route path="/meetingsForUser/:userEmail" element={<MeetingsForUser />} />
      <Route path="/meetingsForManager" element={<MeetingsForManager />} />
      <Route path="/UsersDetails" element={<UsersDetails />} />
      <Route path="/currentUserDetails/:userEmail" element={<CurrentUserDetails />} />
    </Routes>
    </>
  );
}

export default App
