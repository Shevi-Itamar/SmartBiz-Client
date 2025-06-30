import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deleteMeetingAsync, getMeetingsByEmail } from "../store/slice/meetingSlice";
import { useEffect, useState } from "react";
import Layout from "./layout";

export const MeetingsForUser = () => {
    const {currentUser} = useAppSelector((state) => state.auth);
    const  userEmail  =currentUser?.userEmail;
    const dispatch = useAppDispatch();

    const [meetings, setMeetings] = useState<any[]>([]);

    const handleCancelClick = (meetingId:string) => {
        if (window.confirm("האם אתה בטוח שברצונך לבטל את הפגישה?")) {
            dispatch(deleteMeetingAsync(meetingId));
            window.location.reload();
        }
    };

    useEffect(() => {
        if (!userEmail) {
            console.error("userEmail is undefined");
            return;
        }
        dispatch(getMeetingsByEmail(userEmail)).then((response: any) => {
            setMeetings(response.payload);
        });
    }, [userEmail, dispatch]);


    return (
        <Layout>
            <div className="meeting-table-container">
                <table className="meeting-table">
                    <thead>
                        <tr>
                            <th>תאריך פגישה</th>
                            <th>שירות</th>
                        </tr>
                    </thead>
                    <tbody>
                        {meetings.map((meeting, index) => (
                            <tr key={meeting._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                                <td>
                                     בתאריך: {new Date(meeting.meetDate).toLocaleDateString('he-IL')} בשעה: {" "}
                                    {new Date(meeting.meetDate).toLocaleTimeString('he-IL', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </td>
                                <td>{meeting.serviceID?.serviceName}</td>
                                <td><button
                                    className="cancel-button"
                                    onClick={() => handleCancelClick(meeting._id)}
                                >
                                    ביטול פגישה
                                </button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

/* useAppSelector is now imported from store/hooks */
