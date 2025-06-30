import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000/api', 
  withCredentials: true, // אם את משתמשת בקוקיז/אימות
});

export default instance;
