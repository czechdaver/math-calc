declare module 'react-katex' {
    import React from 'react';

    export interface KatexProps {
        math?: string;
        block?: boolean;
        errorColor?: string;
        renderError?: (error: Error) => React.ReactNode;
        settings?: any;
        as?: string | React.ComponentType<any>;
        children?: React.ReactNode;
    }

    export const InlineMath: React.ComponentType<KatexProps>;
    export const BlockMath: React.ComponentType<KatexProps>;
}
