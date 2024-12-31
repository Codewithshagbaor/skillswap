'use client';

import dynamic from 'next/dynamic';

const DesktopNav = dynamic(() => import('@/components/navbar/DesktopNav'), { ssr: false });

export default function ClientOnlyDesktopNav() {
    return <DesktopNav />;
}