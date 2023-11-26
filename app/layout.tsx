import React from 'react';
import '../styles/globals.css';
import '@algolia/autocomplete-theme-classic';
import { getGlobalData } from '../lib/cosmic';
import Generator from 'next/font/local';
// import Banner from '../components/Banner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Script from 'next/script';
import { Partytown } from '@builder.io/partytown/react';

const sans = Generator({
  src: '../fonts/Generator-Variable.ttf',
  variable: '--font-sans',
});

export async function generateMetadata() {
  const siteData = await getGlobalData();
  return {
    title: siteData.metadata.site_title,
    description: siteData.metadata.site_tag,
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const siteData = await getGlobalData();

  return (
    <html lang="en" className={`${sans.variable} font-sans`}>
      <body className="bg-white dark:bg-zinc-950">
        {/* <Banner /> */}
        <Header name={siteData} />
        {children}
        <Footer />
        <Partytown debug={true} forward={['dataLayer.push']} />
        <Script async src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`} strategy='worker' data-website-id="4e99a06b-1bd7-4919-b712-82afc8d44a8e"></Script>
      </body>
    </html>
  );
}
