import 'pixi.js';

declare module 'pixi.js' {
  interface TextStyleOptions {
    /**
     * Compatibility shim for the P2.1 region label. PixiJS applies display
     * alpha on the Text instance, not through TextStyle; this declaration is
     * temporary until the label construction is moved to instance alpha.
     */
    alpha?: number;
  }
}
