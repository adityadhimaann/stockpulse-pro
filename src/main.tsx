import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider } from 'next-themes'
import App from '../App.tsx'
import '../styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem={false}
      disableTransitionOnChange
    >
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
