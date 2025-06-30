import { BusinessDetails } from './businessDetails';
import { ServicesSection } from './servicesSection';
import Layout from './layout';

export const Home = () => {

    return (
        <Layout >
            <div className="app-container">
                <main className="container main-content">
                    <BusinessDetails />
                    <ServicesSection />
                </main>
            </div>
        </Layout>
    );
};
