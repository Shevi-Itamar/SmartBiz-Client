import { useEffect, useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { deleteService, fetchServicesByID, updateService } from "../store/slice/serviceSlice";
import type { serviceType } from "../types/serviceType";
import Modal from "./modal";

type EditServiceModalProps = {
    isOpen: boolean;
    onClose: () => void;
    serviceID: string | null;
};

export const EditService = ({ isOpen, onClose,serviceID }: EditServiceModalProps) => {
    
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState<serviceType>({
        serviceName: "",
        serviceDescription: "",
        price: 0,
        duration: 0,
    });

    useEffect(() => {
        if (serviceID) {
            dispatch(fetchServicesByID(serviceID)).then((result) => {
                if (fetchServicesByID.fulfilled.match(result))
                    setFormData(result.payload);
            });
        }
        }, [dispatch]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: id === "price" || id === "duration" ? Number(value) : value
        }));
    };

    const handleSave = () => {
        dispatch(updateService(formData));
        onClose();
    };

    const handleDelete = () => {
        if (serviceID) {
            dispatch(deleteService(serviceID));
            onClose();
        }
    };

    if (!formData) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="edit-service-card">
                <h2 className="section-title">עריכת שירות</h2><br />

                <label htmlFor="serviceName"><strong>שם השירות:</strong></label>
                <input
                    id="serviceName"
                    value={formData.serviceName}
                    onChange={handleChange}
                /><br />

                <label htmlFor="serviceDescription"><strong>תיאור השירות:</strong></label>
                <textarea
                    id="serviceDescription"
                    rows={4}
                    value={formData.serviceDescription}
                    onChange={handleChange}
                /><br />

                <label htmlFor="price"><strong>מחיר:</strong></label>
                <input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                /><br />

                <label htmlFor="duration"><strong>משך (בדקות):</strong></label>
                <input
                    id="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleChange}
                /><br />

                <button onClick={handleSave}>שמור</button>
                <button onClick={handleDelete}>מחק שירות</button>
            </div>
        </Modal>
    );
};
