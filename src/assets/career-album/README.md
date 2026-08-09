# Career album

Add the original photos for the homepage career album to this folder. The production build automatically creates optimized WebP copies in `optimized/` and uses only those copies on the website.

- Supported source formats: `.jpg`, `.jpeg`, `.png`, `.webp`, `.avif`, `.gif`, `.heic`, and `.heif`.
- Generated images have a maximum side length of `1400px`, use WebP compression, and have camera metadata removed.
- Do not add or edit files inside `optimized/`; it is regenerated before every production build.
- There is no default fallback album. Add a supported photo here, then rebuild the site to include it.

Images appear in filename order and rotate automatically on the homepage.
