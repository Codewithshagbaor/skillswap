'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type TelegramAuthContextType = {
    userID: number | null;
    username: string | null;
    windowHeight: number;
};

const TelegramAuthContext = createContext<TelegramAuthContextType | undefined>(undefined);

export const TelegramAuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [windowHeight, setWindowHeight] = useState<number>(0);
    const [userID, setUserID] = useState<number | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        let WebApp: any; // Declare a variable to hold the imported module
        const initializeTelegramSDK = async () => {
            if (typeof window !== 'undefined') {
                // Dynamically import the SDK
                const sdk = await import('@twa-dev/sdk');
                WebApp = sdk.default;

                WebApp.isVerticalSwipesEnabled = false;
                setWindowHeight(WebApp.viewportStableHeight || window.innerHeight);
                WebApp.ready();

                // Set Telegram user data
                const user = WebApp.initDataUnsafe.user;
                setUserID(user?.id || null);
                setUsername(user?.username || null);
            }
        };

        initializeTelegramSDK();
    }, []);

    const contextValue = {
        userID,
        username,
        windowHeight,
    };

    return (
        <TelegramAuthContext.Provider value={contextValue}>
            {children}
        </TelegramAuthContext.Provider>
    );
};

export const useTelegramAuth = () => {
    const context = useContext(TelegramAuthContext);
    if (context === undefined) {
        throw new Error('useTelegramAuth must be used within a TelegramAuthContextProvider');
    }
    return context;
};
