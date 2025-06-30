import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hooks";
import Layout from "./layout";
import { fetchMeetings } from "../store/slice/meetingSlice";
import '../App.css';

export const MeetingsForManager = () => {

    const dispatch = useAppDispatch();

    const [meetings, setMeetings] = useState<any[]>([]);

    useEffect(() => {
        dispatch(fetchMeetings()).then((response: any) => {
            setMeetings(response.payload);
        });
    }, [dispatch]);

    return (
        <Layout>
          <div className="meeting-table-container">
            <table className="meeting-table">
              <thead>
                <tr>
                  <th>תאריך פגישה</th>
                  <th>שירות</th>
                  <th>משתמש</th>
                  <th>אימייל</th>
                  <th>פלאפון</th>
                </tr>
              </thead>
              <tbody>
                {meetings.map((meeting, index) => (
                  <tr key={meeting._id} className={index % 2 === 0 ? 'even-row' : 'odd-row'}>
                    <td>
                      {new Date(meeting.meetDate).toLocaleDateString('he-IL')} בשעה{" "}
                      {new Date(meeting.meetDate).toLocaleTimeString('he-IL', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td>{meeting.serviceID?.serviceName}</td>
                    <td>{meeting.clientID?.userName}</td>
                    <td>{meeting.clientID?.userEmail}</td>
                    <td>{meeting.clientID?.userPhone}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Layout>
      );
      
      
      
}