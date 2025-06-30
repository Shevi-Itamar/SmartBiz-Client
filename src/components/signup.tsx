import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { addUserAsync } from '../store/slice/userSlice';
import type { userType } from '../types/userType';

type SignupFormProps = {
  onSuccess: () => void;
};

export const Signup = ({ onSuccess }: SignupFormProps) => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => ({
    loading: state.user.loading,
    error: state.user.error,
  }));

  const [form, setForm] = useState<userType>({
    userName: '',
    userEmail: '',
    userPassword: '',
    userPhone: '',
    userAddress: '',
    role: 'user',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await dispatch(addUserAsync(form));
    if (addUserAsync.fulfilled.match(res)) {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="signup-form max-w-md mx-auto p-4">
      <h2 className="text-2xl mb-4">הרשמה</h2>

      <label className="block mb-2">
        שם מלא  
        <input
          name="userName"
          value={form.userName}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        אימייל  
        <input
          name="userEmail"
          type="email"
          value={form.userEmail}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        סיסמה  
        <input
          name="userPassword"
          type="password"
          value={form.userPassword}
          onChange={handleChange}
          required
          className="border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        טלפון  
        <input
          name="userPhone"
          type="tel"
          value={form.userPhone}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>

      <label className="block mb-2">
        כתובת  
        <input
          name="userAddress"
          value={form.userAddress}
          onChange={handleChange}
          className="border p-2 w-full"
        />
      </label>

      <label className="block mb-4">
        תפקיד  
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="border p-2 w-full"
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 w-full mb-2"
      >
        {loading ? 'טוען...' : 'הירשם'}
      </button>

      {error && <p className="text-red-500 mt-2">{String(error)}</p>}
    </form>
  );
};