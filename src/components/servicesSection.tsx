import { useAppDispatch, useAppSelector } from '../store/hooks';
import { useState } from 'react';
import { fetchServices } from '../store/slice/serviceSlice';
import { Link, useNavigate } from 'react-router-dom';
import Modal from './modal';
import { LoginForm } from './login';
import { isTokenValid } from '../store/slice/authSlice';
import { EditService } from './editService';
import { AddService } from './addService';

export const ServicesSection = () => {
  const dispatch = useAppDispatch();
  const servicesList = useAppSelector((state) => state.services.list);
  const [showServices, setShowServices] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const { token,currentUser } = useAppSelector((state) => state.auth);
  const [showEditServiceForm, setShowEditServiceForm] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState<string | null>(null);
  const [showAddServiceForm, setShowAddServiceForm] = useState(false);
  const navigate = useNavigate();

  const handleShowServices = () => {
    dispatch(fetchServices());
    setShowServices(!showServices);
  };

  const handleServiceClick = (serviceId: any, event: any) => {
    event.preventDefault();
    if (!isTokenValid(token)) {
      setIsLoginOpen(true);
    } else {
      if(currentUser?.role === 'admin') {
        setShowEditServiceForm(true);  
        setCurrentServiceId(serviceId);      
      }
      else
        navigate(`/services/${serviceId}`);
    }
  }

  const handleAddService = (event: any) => {
    event.preventDefault();
    if (!isTokenValid(token)) {
      setIsLoginOpen(true);
    } else {
      setShowAddServiceForm(true);
    }
  }

  return (
    <>
      <div className="services-button-container">
        <button onClick={handleShowServices} className="services-button">
          הצג שירותים
        </button>
      </div>

      {showServices && (
        <section className="services-section">
          <h3 className="services-title">השירותים שלנו</h3>
          <div className="services-grid">
            {servicesList.map((service) => (
              <Link
              to={
                currentUser?.role === 'admin'
                  ? `/`
                  : `/services/${service._id}`
              }
                key={service._id}
                onClick={(e) => handleServiceClick(service._id, e)}
                className="service-card"
              >
                <h4 className="service-name">{service.serviceName}</h4>
                <p className="service-description">{service.serviceDescription}</p>
                <div className="service-details">
                  <p><strong>מחיר:</strong> {service.price}₪</p>
                  <p><strong>משך:</strong> {service.duration} דקות</p>
                </div>
              </Link>
            ))}
{            currentUser?.role==="admin"&&<Link
              to="/services/add"
              className="service-card add-service-card"
              onClick={(e)=>handleAddService(e)}>
              <h1 className="service-name">+</h1>
            </Link>}

          </div>
        </section>
      )}
      {showEditServiceForm&&<EditService 
        isOpen={showEditServiceForm}
        onClose={() => setShowEditServiceForm(false)}
        serviceID={currentServiceId}
      />}
      {showAddServiceForm && 
        <AddService
          isOpen={showAddServiceForm}
          onClose={() => setShowAddServiceForm(false)}/>
      }
      <Modal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)}>
        <LoginForm onSuccess={() => setIsLoginOpen(false)} />
      </Modal>
    </>
  );
};