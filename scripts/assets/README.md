# OpenGraph font asset

`SWJeonOG.woff2` is an exact-glyph subset of Pretendard SemiBold, internal
version 1.301, used only by `scripts/generate-social-image.mjs`. Because a
subset is a modified font, its family, full, unique, and PostScript name
records are changed to `SWJeon OG` / `SWJeonOG` as required by the upstream
license's Reserved Font Name condition. Copyright, credit, trademark, and
license records remain unchanged.

- Release: <https://github.com/orioncactus/pretendard/releases/download/v1.3.1/Pretendard-1.3.1.zip>
- Source file in the release archive: `public/static/alternative/Pretendard-SemiBold.ttf`
- Copyright: © 2022 Kil Hyung-jin
- License: [SIL Open Font License 1.1](./OFL.txt)

The upstream font's embedded license metadata identifies the font software as
licensed under the SIL Open Font License, Version 1.1.

To regenerate the subset after changing visible text in the image, install
FontTools with Brotli support, extract the source file above, and run:

```sh
pyftsubset Pretendard-1.3.1/public/static/alternative/Pretendard-SemiBold.ttf \
  --output-file=scripts/assets/SWJeonOG.woff2 \
  --flavor=woff2 \
  --layout-features='*' \
  --text='전상완 Sangwan JeonENGINEER세상이 더 효율적으로 움직이고,사람들이 능숙하게 일할 수 있도록.도구와 시스템그리고 경험과 지식swjeon.kr·/' \
  --name-IDs='*' \
  --name-legacy \
  --name-languages='*' \
  --glyph-names \
  --symbol-cmap \
  --legacy-cmap \
  --notdef-glyph \
  --recommended-glyphs
python3 scripts/assets/rename-font.py scripts/assets/SWJeonOG.woff2
```

Keep the `--text` value in sync with every string rendered by the generator.
The rename step is mandatory for compliance with the OFL Reserved Font Name
condition.
