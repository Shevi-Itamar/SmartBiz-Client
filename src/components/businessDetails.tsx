import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchBusiness } from '../store/slice/businessSlice';
import { EditBusinessDetails } from './editBusinessDetails';


export const BusinessDetails = () => {
    const business = useAppSelector((state) => state.business.details);
    const dispatch = useAppDispatch();
    const currentUser = useAppSelector((state) => state.auth.currentUser);
    const [showEditForm, setShowEditForm] = useState(false);

    useEffect(() => {
        if (!business) {
        dispatch(fetchBusiness());
        }
    }, [dispatch]);

    const hundleEdit = () => {
        if (currentUser?.role === 'admin') {
            setShowEditForm(true);
        }
  
    }   


    if (!business) return null;

    return (
        <div className="business-card">
            <h2 className="section-title">פרטי העסק</h2>
            <p><strong>מיקום:</strong> {business.businessLocation}</p>
            <p><strong>אימייל:</strong> {business.email}</p>
            <p><strong>קהל יעד:</strong> {business.targetAudience}</p>
            <p><strong>תיאור:</strong> {business.details}</p>
            {currentUser?.role === 'admin' && (
                <button onClick={hundleEdit}>עריכה</button>)
                }
            {showEditForm && (
                <EditBusinessDetails isOpen={showEditForm} onClose={() => setShowEditForm(false)}/>
                
               
            )} 
        </div>

    );
};
