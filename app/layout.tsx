import './globals.css';
import { AuthContextProvider } from '@/context/AuthContext';
import { TelegramAuthContextProvider } from '@/context/TelegramAuthContext';
import '../flow-config';
import DesktopNav from '@/components/navbar/DesktopNav';
import { MobileNav } from '@/components/navbar/mobileNav';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>
                <AuthContextProvider>
                    <TelegramAuthContextProvider>
                        <DesktopNav />
                            {children}
                        <MobileNav />
                    </TelegramAuthContextProvider>
                </AuthContextProvider>
            </body>
        </html>
    );
}