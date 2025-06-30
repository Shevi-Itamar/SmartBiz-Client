import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchServicesByID } from "../store/slice/serviceSlice";
import Modal from "./modal";
import {EditUserModal} from "./editUser";
import { addMeetingAsync } from "../store/slice/meetingSlice";

type AppointmentModalContentProps = {
  isOpen: boolean;
  onClose: () => void;
  date: string;
  hour: string;
  serviceID: string;
  onAppointmentConfirmed: () => void; // ✅ חדש
};

type UserData = {
  userName: string;
  userEmail: string;
  userPhone: string;
  userAddress: string;
};

export default function AppointmentModalContent({
  isOpen,
  onClose,
  date,
  hour,
  serviceID,
  onAppointmentConfirmed, // ✅ חדש
}: AppointmentModalContentProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [serviceName, setServiceName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userData, setUserData] = useState<UserData>({
    userName: "",
    userEmail: "",
    userPhone: "",
    userAddress: "",
  });

  const [isEditOpen, setIsEditOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchService = async () => {
      setLoading(true);
      setError(null);
      try {
        const service = await dispatch(fetchServicesByID(serviceID)).unwrap();
        setServiceName(service.serviceName);
      } catch {
        setError("שגיאה בטעינת השירות");
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [dispatch, serviceID, isOpen]);

  useEffect(() => {
    setUserData({
      userName: currentUser?.userName || "",
      userEmail: currentUser?.userEmail || "",
      userPhone: currentUser?.userPhone || "",
      userAddress: currentUser?.userAddress || "",
    });
  }, [currentUser]);

  const handleSaveAppointment = async () => {
    try {
      await dispatch(
        addMeetingAsync({
          meetDate: new Date(`${date}T${hour}:00`),
          serviceID,
          clientID: currentUser?.userId || ""
        })
      ).unwrap();

      onAppointmentConfirmed(); // ✅ רענון רשימת השעות
      onClose(); // ✅ סגירת המודל
    } catch (error) {
      console.error("שגיאה בהזמנת הפגישה:", error);
    }
  };

  const handleUserUpdate = (updatedUser: UserData) => {
    setUserData(updatedUser);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <h2>אישור הזמנה</h2>

        {loading && <p>טוען שירות...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <>
            <p>
              <strong>שירות:</strong> {serviceName}
            </p>
            <p>
              <strong>תאריך:</strong> {date}
            </p>
            <p>
              <strong>שעה:</strong> {hour}
            </p>

            <p>
              <strong>שם לקוח:</strong> {userData.userName}
            </p>
            <p>
              <strong>אימייל:</strong> {userData.userEmail}
            </p>
            <p>
              <strong>טלפון:</strong> {userData.userPhone}
            </p>
            <p>
              <strong>כתובת:</strong> {userData.userAddress}
            </p>

            <button onClick={() => setIsEditOpen(true)}>
              עדכון פרטי משתמש
            </button>

            <button onClick={handleSaveAppointment}>אשר הזמנה</button>
          </>
        )}
      </Modal>
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)}>
      <EditUserModal
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        user={{ ...userData }}
        onSave={handleUserUpdate}
      />
      </Modal >
    </>
  );
}
