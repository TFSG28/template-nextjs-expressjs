'use client';

import Link from 'next/link';
import Image from 'next/image';

export default function LogoLink() {
    const handleClick = async () => {
        try {
            const trackingData = {
                screenResolution: `${screen.width}x${screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                cookiesEnabled: navigator.cookieEnabled,
                platform: navigator.platform
            };
            const response = await fetch('http://template.cesar.wearemateria.com/api/track-logo-click', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trackingData)
            });
            if (response.ok) {
                console.log(':)');
            } else {
                console.error(':(');
            }
        } catch (error) {
            console.error('Error', error);
        }
    };
    return (
        <Link
            className='flex items-center space-x-2'
            href='https://www.wearemateria.com'
            target='_blank'
            onClick={handleClick}>
            <span className='text-sm'><p>Developed By:</p></span>
            <Image src={'/image.png'} alt='Materia' width={30} height={30} />
        </Link>
    );
}