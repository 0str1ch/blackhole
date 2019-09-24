import React from 'react';

function Credits() {
  return (
    <>
      <div className="nav-links credits">
        Made by{' '}
        <a
          href="http://jeremysmith.dev"
          target="_blank"
          rel="noopener noreferrer"
        >
          Jeremy Smith
        </a>{' '}
      </div>
      <div className="nav-links source">
        <a
          href="http://github.com/0str1ch/blackhole"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Source
        </a>
      </div>
      <style jsx>
        {`
          div.nav-links {
            position: absolute;
            z-index: 2;
            padding: 2rem;
            text-align: center;
            opacity: 0.9;
            vertical-align: middle;
          }

          @media screen and (min-width: 800px) {
            div.nav-links {
              padding: 3rem;
            }
          }

          div.credits {
            bottom: 0;
            left: 0;
          }
          div.source {
            bottom: 0;
            right: 0;
          }
        `}
      </style>
    </>
  );
}

export default Credits;
