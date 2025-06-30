import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hooks";
import Layout from "./layout";
import '../App.css';
import { fetchUsers } from "../store/slice/userSlice";

export const UsersDetails = () => {

    const dispatch = useAppDispatch();
    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        dispatch(fetchUsers()).then((response: any) => {
            setUsers(response.payload);
        });

    }, [dispatch]);


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
                        {users.map((currentUser, index) => (
                            <tr key={currentUser._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                <td>{currentUser.userName}</td>
                                <td>{currentUser.userEmail}</td>
                                <td>{currentUser.userPhone}</td>
                                <td>{currentUser.userAddress}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </Layout>
    );



}