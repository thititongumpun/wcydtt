import React from 'react';
import '../styles/globals.css';
import '@algolia/autocomplete-theme-classic';
import Providers from './Providers';
import { getGlobalData } from '../lib/cosmic';
import Generator from 'next/font/local';
// import Banner from '../components/Banner';
import Script from 'next/script';
import { Partytown } from '@builder.io/partytown/react';

import dynamic from 'next/dynamic';

const Header = dynamic(() => import('../components/Header'))
const Footer = dynamic(() => import('../components/Footer'))

const sans = Generator({
  src: '../fonts/Generator-Variable.ttf',
  variable: '--font-sans',
});

export async function generateMetadata() {
  const siteData = await getGlobalData();
  return {
    title: siteData.metadata.site_title,
    description: siteData.metadata.site_tag,
    metadataBase: new URL('https://wcydtt.co'),
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteData = await getGlobalData();

  return (
    <html
      lang="en"
      className={`${sans.variable} font-sans`}
      suppressHydrationWarning
    >
      {/* <html lang="en" className={`${sans.variable} font-sans`}> */}
      <body className="bg-white dark:bg-black">
        <Providers>
          {/* <Banner /> */}
          <Header name={siteData} />
          {children}
          <Footer />
        </Providers>
        <Partytown debug={true} forward={['dataLayer.push']} />
        <Script
          async
          src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
          data-website-id="e8b564dc-9887-4414-b46d-369339dc8f6a"
          data-cache="true"
          data-umami-event="click-post-card"
        />
      </body>
    </html>
  );
}
