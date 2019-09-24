import React from 'react';
import Head from 'next/head';

function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Blackhole - Three.js, react-three-fiber, Next.js</title>
      </Head>
      <main>{children}</main>
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        html {
          font-family: sans-serif;
          -ms-text-size-adjust: 100%;
          -webkit-text-size-adjust: 100%;
        }

        html,
        body,
        #root,
        .bg,
        canvas {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
        }

        body {
          background: #000;
          color: #fff;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Helvetica,
            Arial, sans-serif, Apple Color Emoji, Segoe UI Emoji;
          font-size: 14px;
          line-height: 1.5;
        }

        a {
          color: #fff;
          transition: all 0.2s;
        }

        a:hover {
          letter-spacing: 0.5px;
        }

        div.wrapper {
          height: 100vh;
          width: 100%;
          position: relative;
        }

        .loading {
          position: absolute;
          top: 0px;
          left: 0px;
          width: 100%;
          height: 100%;
          background: #000;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .loading-bar-container {
          width: 15rem;
          height: 0.333rem;
          background: #222;
          border-radius: 0.333rem;
        }

        .loading-bar {
          height: 0.333rem;
          background: white;
          border-radius: 0.333rem;
        }
      `}</style>
    </>
  );
}

export default Layout;
