import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { Toaster } from 'sonner'

import App from './App.jsx'
import { Providers } from './provider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Providers>
      <App />
    </Providers>
    <Toaster />
  </StrictMode>,
)
