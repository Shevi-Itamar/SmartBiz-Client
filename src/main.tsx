import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { BrowserRouter } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import { UIProvider } from './context/UIContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <UIProvider>
    <App />
    </UIProvider>
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)


