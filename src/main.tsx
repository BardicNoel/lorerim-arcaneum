import App from '@/app/App'
import { ThemeProvider } from '@/shared/context/ThemeContext'
import { DataInitializer } from '@/shared/stores/DataInitializer'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './globals.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DataInitializer showLoadingIndicator={true}>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </DataInitializer>
  </StrictMode>
)
