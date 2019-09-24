import React from "react";
import dynamic from "next/dynamic";

const CanvasBackground = dynamic(import("../components/canvas-background"), {
  ssr: false
});

export default () => (
  <div>
    <CanvasBackground />
    <style jsx>{`
      div {
        height: 100vh;
        width: 100%;
        position: relative;
      }
    `}</style>
  </div>
);
