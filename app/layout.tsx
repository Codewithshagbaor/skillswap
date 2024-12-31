import './globals.css';
import { Web3Provider } from '@/context/AuthContext';
import { TelegramAuthContextProvider } from '@/context/TelegramAuthContext';
import { MobileNav } from '@/components/navbar/mobileNav';
import ClientOnlyDesktopNav from '@/components/navbar/ClientOnlyDesktopNav';

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body suppressHydrationWarning={true}>
                <Web3Provider>
                    <TelegramAuthContextProvider>
                        <ClientOnlyDesktopNav />
                        {children}
                        <MobileNav />
                    </TelegramAuthContextProvider>
                </Web3Provider>
            </body>
        </html>
    );
}