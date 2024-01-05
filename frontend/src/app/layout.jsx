import './globals.css'

export const metadata = {
  title: 'HealthTech',
  description: 'Consultoria medica remota',
}

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body>
        {children}
      </body>
    </html>
  )
}
