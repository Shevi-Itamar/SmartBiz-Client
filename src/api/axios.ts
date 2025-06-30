import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.URI || 'https://smartbiz-server.onrender.com', // כתובת ה־API שלך
  withCredentials: true, // אם את משתמשת בקוקיז/אימות
});

export default instance;
