import { useState } from "react";
import { useAppDispatch } from "../store/hooks";
import { createService } from "../store/slice/serviceSlice";
import type { serviceType } from "../types/serviceType";
import Modal from "./modal";

type EditServiceModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export const AddService = ({ isOpen, onClose }: EditServiceModalProps) => {

     const dispatch = useAppDispatch();
    
        const [formData, setFormData] = useState<serviceType>({
            serviceName: "",
            serviceDescription: "",
            price: 0,
            duration: 0,
            imagePath:""
        });

    
        const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            const { id, value } = e.target;
            setFormData((prev) => ({
                ...prev,
                [id]: id === "price" || id === "duration" ? Number(value) : value
            }));
        };
    
        const handleSave = () => {
            dispatch(createService(formData));
            onClose();
        };
    
        if (!formData) return null;
    
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <div className="edit-service-card">
                    <h2 className="section-title">הוספת שירות</h2><br />
    
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
                </div>
            </Modal>
        );
    };
    
