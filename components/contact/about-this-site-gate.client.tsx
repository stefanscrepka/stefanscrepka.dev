'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// W-perf #4: AboutThisSiteModal carrega via dynamic import APENAS quando hash
// `#about-this-site` é detectado. Antes o modal montava no layout root sempre
// (5-10 KB gz desnecessários em /privacidade, /_not-found, etc).

const AboutThisSiteModalLazy = dynamic(
  () => import('@/components/contact/about-this-site-modal').then((m) => m.AboutThisSiteModal),
  { ssr: false, loading: () => null }
);

export function AboutThisSiteGate() {
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const check = () => {
      if (window.location.hash === '#about-this-site') setShouldLoad(true);
    };
    check();
    window.addEventListener('hashchange', check);
    return () => window.removeEventListener('hashchange', check);
  }, []);

  if (!shouldLoad) return null;
  return <AboutThisSiteModalLazy />;
}
