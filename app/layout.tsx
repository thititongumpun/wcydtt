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
import { Metadata } from 'next';

const Header = dynamic(() => import('../components/Header'));
const Footer = dynamic(() => import('../components/Footer'));
const ScrollToTopButton = dynamic(
  () => import('../components/ScrollToTopButton')
);

const sans = Generator({
  src: '../fonts/Generator-Variable.ttf',
  variable: '--font-sans',
});

export async function generateMetadata(): Promise<Metadata> {
  const siteData = await getGlobalData();
  return {
    title: siteData.metadata.site_title,
    description: siteData.metadata.site_tag,
    metadataBase: new URL('https://wcydtt.co'),
    keywords: ['Next.js', 'Blog', 'wcydtt', 'Thiti Tongumpun'],
    authors: [{ name: 'Thiti Tongumpun', url: 'https://thiti.wcydtt.co' }],
    robots: {
      index: true,
      follow: true,
      nocache: true,
      googleBot: {
        index: true,
        follow: false,
        noimageindex: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    openGraph: {
      title: siteData.metadata.site_title,
      description: siteData.metadata.site_tag,
      url: 'https://wcydtt.co',
      siteName: siteData.metadata.site_title,
      images: [
        {
          url: 'https://www.wcydtt.co/blog.png',
          width: 192,
          height: 192,
        },
      ],
      locale: 'en_US,th_TH',
      type: 'website',
    },
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
          <ScrollToTopButton />
        </Providers>
        <Partytown debug={true} forward={['dataLayer.push']} />
        <Script
          async
          src={`${process.env.NEXT_PUBLIC_UMAMI_URL}/script.js`}
          data-website-id="e8b564dc-9887-4414-b46d-369339dc8f6a"
          data-cache="true"
          data-umami-event="click-post-card"
        />
        <Script
          async
          src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${process.env.NEXT_PUBLIC_CA_PUB}`}
          crossOrigin="anonymous"
        />
      </body>
    </html>
  );
}
