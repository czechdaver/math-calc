// src/components/utils/LatexRenderer.tsx
import React from 'react';
import 'katex/dist/katex.min.css'; // Import KaTeX styly
import { InlineMath, BlockMath } from 'react-katex';

interface LatexRendererProps {
  formula: string;
  displayMode?: boolean; // True pro BlockMath (samostatný blok), False pro InlineMath
}

const LatexRenderer: React.FC<LatexRendererProps> = ({ formula, displayMode = false }) => {
  if (!formula) {
    return null;
  }

  if (displayMode) {
    return <BlockMath>{formula}</BlockMath>;
  } else {
    return <InlineMath>{formula}</InlineMath>;
  }
};

export default LatexRenderer;
