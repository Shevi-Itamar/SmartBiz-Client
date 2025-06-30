import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchBusiness, updateBusiness } from "../store/slice/businessSlice";
import type { businessType } from "../types/businessType";
import Modal from "./modal";

type EditBusinessModalProps = {
    isOpen: boolean;
    onClose: () => void;

};

export const EditBusinessDetails = ({
    isOpen,
    onClose
}:EditBusinessModalProps) => {
    const business = useAppSelector((state) => state.business.details);
    const dispatch = useAppDispatch();

    const [formData, setFormData] = useState<businessType>({
        businessLocation: "",
        email: "",
        targetAudience: "",
        details: "",
        businessName: "",
        businessPassword: ""
    });

    useEffect(() => {
        if (!business) {
            dispatch(fetchBusiness());
        } else {
            setFormData(business);
        }
    }, [dispatch, business]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { id, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [id]: value
        }));
    };

    const handleSave = () => {
        dispatch(updateBusiness(formData));
        onClose();
    };

    if (!business) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
        <div className="edit-business-card">
            <h2 className="section-title">עריכת פרטי העסק</h2><br />

            <label htmlFor="businessLocation"><strong>מיקום:</strong></label>
            <input
                id="businessLocation"
                value={formData.businessLocation}
                onChange={handleChange}
            />
            <br />

            <label htmlFor="email"><strong>אימייל:</strong></label>
            <input
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
            />
            <br />

            <label htmlFor="targetAudience"><strong>קהל יעד:</strong></label>
            <input
                id="targetAudience"
                value={formData.targetAudience}
                onChange={handleChange}
            />
            <br />
            <label htmlFor="details"><strong>תיאור:</strong></label>
            <textarea
                id="details"
                value={formData.details}
                rows={6}
                onChange={handleChange}
            ></textarea><br />

            <button onClick={handleSave}>שמור</button>
        </div>
        </Modal>
    );
};
