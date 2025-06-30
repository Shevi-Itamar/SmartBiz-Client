import { useState } from 'react';
import { Header } from './header';
import { Footer } from './footer';
import Modal from './modal';
import { LoginForm } from './login';
import { Signup } from './signup'; 

interface LayoutProps {
    children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
    const [modalType, setModalType] = useState<'login' | 'signup' | null>(null);

    return (
        <>
            <Header
                onLoginClick={() => setModalType('login')}
                onSignupClick={() => setModalType('signup')}
            />

            <main className="main-wrapper">
                {children}
            </main>

            <Modal isOpen={!!modalType} onClose={() => setModalType(null)}>
                {modalType === 'login' ? (
                    <LoginForm onSuccess={() => setModalType(null)} />
                ) : modalType === 'signup' ? (
                    <Signup onSuccess={() => setModalType(null)} />
                ) : null}
            </Modal>

            <Footer />
        </>
    );
}
