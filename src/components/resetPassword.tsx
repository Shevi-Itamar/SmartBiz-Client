import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { resetPassword } from '../store/slice/authSlice';
import Modal from './modal';
export const ResetPassword=(props:any)=>{
    const { userEmail,onClose,isOpen } = props;
    const [code, setCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const dispatch = useAppDispatch();
    const { loading } = useAppSelector((state) => state.auth);

   return(
    <>
    <Modal isOpen={isOpen} onClose={onClose}>
    <h2 className="text-xl mb-4">איפוס סיסמה</h2>
      <input
        type="string"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="קוד אימות"
        className="border p-2 w-full mb-2"
      />
      <input
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder="סיסמה חדשה" 
        className="border p-2 w-full mb-2"
      />

      <br />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 w-full"
        disabled={loading}
        onClick={() => {
          dispatch(resetPassword({ userEmail,code, newPassword }));
          onClose();
        }}
      >
        {loading ? 'טוען...' : 'שמור'}
      </button>
      </Modal>
      </>
   );
}