'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { HeroSection } from './components/HeroSection';
import { CTASection } from './components/CTASection';



export default function Landing() {

    const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard'); 
    }
  }, [status, router]);

  if (status === 'loading') {
    return <div>Loading...</div>; 
  }
  return (
  <div>
    <HeroSection />
    <CTASection />
  </div>
  );
}
