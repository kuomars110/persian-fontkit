/**
 * Type definitions for subset-font
 */

declare module "subset-font" {
  interface SubsetFontOptions {
    targetFormat?: "woff2" | "woff" | "truetype" | "sfnt";
    preserveNameIds?: number[];
  }

  function subsetFont(
    buffer: Buffer,
    text: string,
    options?: SubsetFontOptions
  ): Promise<Buffer>;

  export = subsetFont;
}
