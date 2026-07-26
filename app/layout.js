import './globals.css';
import { AuthProvider } from '../components/AuthProvider';
import CustomerServiceButton from '../components/CustomerServiceButton';

export const metadata = {
  title: 'The Docket — Moot Training',
  description: 'Prototype moot training platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-docket-navy text-gray-100">
        <AuthProvider>
          {children}
          <CustomerServiceButton />
        </AuthProvider>
      </body>
    </html>
  );
}
