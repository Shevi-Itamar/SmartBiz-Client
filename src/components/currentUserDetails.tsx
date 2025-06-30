import { useAppSelector } from "../store/hooks";
import Layout from "./layout";
import '../App.css';
import { EditUserModal } from "./editUser";
import { useEffect, useState } from "react";

type UserData = {
    userName: string;
    userEmail: string;
    userPhone: string;
    userAddress: string;
};

export const CurrentUserDetails = () => {
    const [showEditForm, setShowEditForm] = useState(false);

    const { currentUser } = useAppSelector((state) => state.auth);
    const [userData, setUserData] = useState<UserData>({
        userName: "",
        userEmail: "",
        userPhone: "",
        userAddress: ""
    });

    useEffect(() => {
        setUserData({
            userName: currentUser?.userName || "",
            userEmail: currentUser?.userEmail || "",
            userPhone: currentUser?.userPhone || "",
            userAddress: currentUser?.userAddress || "",
        });
    }, [currentUser]);

    const handleEditClick = () => {
        setShowEditForm(true);
    }

    const handleUserUpdate = (updatedUser: UserData) => {
        setUserData(updatedUser);
    };


    return (
        <Layout>
            <div className="meeting-table-container">
                <table className="meeting-table">
                    <thead>
                        <tr>
                            <th>שם משתמש</th>
                            <th>אימייל</th>
                            <th>פלאפון</th>
                            <th>כתובת</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUser &&
                            <tr key={currentUser.userId} className='even-row'>
                                <td>{currentUser.userName}</td>
                                <td>{currentUser.userEmail}</td>
                                <td>{currentUser.userPhone}</td>
                                <td>{currentUser.userAddress}</td>
                                <button className="edit-button" onClick={handleEditClick}>ערוך</button>
                            </tr>
                        }
                    </tbody>
                </table>
            </div>
            <EditUserModal
                isOpen={showEditForm}
                onClose={() => setShowEditForm(false)}
                user={{ ...userData }}
                onSave={handleUserUpdate}
            />
        </Layout>
    );



}