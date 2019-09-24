import React from 'react'

function Credits() {
    return (
        <>
                  <div className="nav-links credits">Made by <a href="http://jeremysmith.dev" target="_blank" rel="noopener noreferrer">Jeremy Smith</a> </div>
      <div className="nav-links source"><a href="http://github.com/0str1ch/blackhole" target="_blank" rel="noopener noreferrer">View Code</a></div>
                  <style jsx>
        {`

          div.nav-links {
            position: absolute;
            z-index: 2;
            padding: 3rem;
            text-align: center;
            opacity: 0.9;
            vertical-align: baseline;
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
    )
}

export default Credits
