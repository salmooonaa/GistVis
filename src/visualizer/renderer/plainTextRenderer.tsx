import React, { useRef, useEffect } from "react";
import { GistvisSpec } from "../types";

const PlainTextRenderer = ({ gistvisSpec }: { gistvisSpec: GistvisSpec }) => {
  const endingPunctuation =
    gistvisSpec.paragraphSpec.context[
      gistvisSpec.paragraphSpec.context.length - 1
    ] + " ";
  return (
    <span>
      {gistvisSpec.paragraphSpec.context.slice(0, -1)}
      {endingPunctuation}
    </span>
  );
};

export default PlainTextRenderer;
