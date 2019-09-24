import React from "react";
import dynamic from "next/dynamic";

const CanvasBackground = dynamic(import('../components/canvas-background'), {
  ssr: false
});
export default () => (
  <div className="wrapper">
    <CanvasBackground />
  </div>
);
