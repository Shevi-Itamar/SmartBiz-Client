import {  useEffect, useState } from "react";
import Modal from "./modal";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateUserAsync } from "../store/slice/userSlice";
import type { userType } from "../types/userType";
import { loginUser } from "../store/slice/authSlice";

type UserData = {
    userName: string;
    userPassword?: string;
    userEmail: string;
    userPhone: string;
    userAddress: string;
};

type EditUserModalProps = {
    isOpen: boolean;
    onClose: () => void;
    user: UserData;
    onSave: (updatedUser: UserData) => void;
};

export const EditUserModal=({
    isOpen,
    onClose,
    user,
    onSave,
}: EditUserModalProps) =>{
    const [userName, setUserName] = useState(user.userName);
    const [email, setEmail] = useState(user.userEmail);
    const [phone, setPhone] = useState(user.userPhone);
    const [address, setAddress] = useState(user.userAddress);
    const [userPassword, setUserPassword] = useState("");
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.auth.currentUser);

    useEffect(() => {
        setUserName(user.userName);
        setEmail(user.userEmail);
        setPhone(user.userPhone);
        setAddress(user.userAddress);
    }, [user]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        onClose();
        if (currentUser) {
            const updatedUser: userType = {
                userId: currentUser.userId,
                userPassword: userPassword,
                userName: userName,
                userEmail: email,
                userPhone: phone,
                userAddress: address,
                role: currentUser.role,
            }
            const res=await dispatch(loginUser({ email:currentUser.userEmail, password: userPassword }));
            if (loginUser.fulfilled.match(res)){
                await dispatch(updateUserAsync(updatedUser));
                const res=await dispatch(loginUser({ email, password: userPassword }));
                if(updateUserAsync.fulfilled.match(res)){
                    onSave({
                    userName,   
                    userPassword: userPassword,
                    userEmail: email,
                    userPhone: phone,
                    userAddress: address,
            })
        };
        }
    }
        
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h2>עדכון פרטי משתמש</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>סיסמה</label>
                    <input
                        type="text"
                        onChange={(e) => setUserPassword(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>שם משתמש:</label>
                    <input
                        type="text"
                        value={userName}
                        onChange={(e) => setUserName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>אימייל:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>טלפון:</label>
                    <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>כתובת:</label>
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                    />
                </div>
                <button type="submit">שמור</button>
            </form>
        </Modal>
    );
}
