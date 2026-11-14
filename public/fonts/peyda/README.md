# Peyda (Persian brand typeface)

Peyda is a proprietary font from Fontiran. Its files are **not** committed to this public repository.

To use it, put these files in this folder (they are ignored by git):

- `Peyda-Thin.woff2`, `Peyda-ExtraLight.woff2`, `Peyda-Light.woff2`, `Peyda-Regular.woff2`,
  `Peyda-Medium.woff2`, `Peyda-SemiBold.woff2`, `Peyda-Bold.woff2`, `Peyda-ExtraBold.woff2`,
  `Peyda-Black.woff2` (from the `PeydaWeb/woff2` folder of the licensed package, renamed)
- `FontLicense.txt` with your 6-digit licence code filled in, as the licence requires

`src/index.css` loads them with `@font-face`. Without the files, Persian text falls back to
Vazirmatn (OFL), which is bundled.
