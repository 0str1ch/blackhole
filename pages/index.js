import React from "react";
import dynamic from "next/dynamic";
import Credits from "../components/credits";

const CanvasBackground = dynamic(import('../components/canvas-background'), {
  ssr: false
});
export default () => (
  <div className="wrapper">
    <CanvasBackground />
    <Credits/>
  </div>
);
