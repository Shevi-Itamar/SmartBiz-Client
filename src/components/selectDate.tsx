import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useEffect, useState } from 'react';
import '../App.css';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { getAvailableHours } from '../store/slice/meetingSlice';
import Layout from './layout';
import { useParams } from 'react-router-dom';
import Modal from './modal';
import AppointmentModal from './apointment';
import { useUI } from '../context/UIContext';
import { LoginForm } from './login';


export const AddMeeting = () => {
    const dispatch = useAppDispatch();
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [freeHours, setFreeHours] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedHour, setSelectedHour] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const { id } = useParams<{ id: string }>();
    const serviceID = id;


    const formatDate = (date: Date): string => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // חודשים: 0-11
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const { setShowLoginForm } = useUI();

    // מחוץ לפונקציה fetchHours
    const meetingError = useAppSelector(state => state.meetings.error);

    const fetchHours = async () => {
        if (!selectedDate) return;

        setLoading(true);
        setError(null);

        try {
            const formattedDate = formatDate(selectedDate);
            const res = await dispatch(getAvailableHours(formattedDate));

            if (getAvailableHours.rejected.match(res)) {
                setError('יש להתחבר למערכת');
                setIsLoginOpen(true);
                return;
            }
            const data = res.payload.freeHours;

            if (Array.isArray(data)) {
                let filtered = data;

                if (selectedDate.toDateString() === new Date().toDateString()) {
                    const now = new Date();
                    const currentHour = now.getHours();
                    filtered = data.filter(hour => {
                        const hourNum = parseInt(hour.split(":")[0]);
                        return hourNum > currentHour;
                    });
                }

                setFreeHours(filtered);
            } else {
                setFreeHours([]);
                setError('הפורמט שהתקבל מהשרת לא תקין');
                if (meetingError) {
                    setError(meetingError);
                }
            }
        } catch (err) {
            setError('שגיאה בטעינת שעות:');
            setShowLoginForm(true);
        } finally {
            setLoading(false);
        }
    };



    useEffect(() => {
        fetchHours();
    }, [selectedDate]);



    const tileDisabled = ({ date, view }: { date: Date; view: string }) => {
        if (view !== 'month') return false;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (date < today) return true;

        const day = date.getDay();
        if (day === 5 || day === 6) return true;

        return false;
    };

    return (
        <Layout>
            <div className="schedule-wrapper">
                <h2>בחירת תאריך</h2>

                <div className="calendar-wrapper">
                    <Calendar
                        onChange={(date) => setSelectedDate(date as Date)}
                        value={selectedDate}
                        tileDisabled={tileDisabled}
                        locale="he-IL"
                    />
                </div>

                {selectedDate && (
                    <>
                        <h3>שעות פנויות עבור {selectedDate.toLocaleDateString()}</h3>

                        {loading && <p>טוען שעות פנויות...</p>}
                        {error && <p style={{ color: 'red' }}>{error}</p>}

                        {!loading && !error && freeHours.length > 0 && (
                            <div className="hours-buttons-container">
                                {freeHours.map((hour) => {
                                    const [h, m] = hour.split(":").map(Number);
                                    const endHour = (h + 1) % 24;
                                    const displayHour = `${hour} - ${endHour.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
                                    return (
                                        <button
                                            key={hour}
                                            className="hour-button"
                                            onClick={() => {
                                                setSelectedHour(hour);
                                                setIsModalOpen(true);
                                            }}
                                        >
                                            {displayHour}
                                        </button>
                                    );
                                })}
                            </div>
                        )}

                        {!loading && !error && freeHours.length === 0 && (
                            <p>אין שעות פנויות בתאריך זה</p>
                        )}
                    </>
                )}
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                    {selectedDate && selectedHour && serviceID && (
                        <AppointmentModal
                            isOpen={isModalOpen}
                            onClose={() => setIsModalOpen(false)}
                            date={formatDate(selectedDate)}
                            hour={selectedHour}
                            serviceID={serviceID}
                            onAppointmentConfirmed={() => fetchHours()}
                        />

                    )}
                </Modal>
                <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
                    <LoginForm onSuccess={() => setIsLoginOpen(false)} />
                </Modal>
            </div>

        </Layout>
    );

};
