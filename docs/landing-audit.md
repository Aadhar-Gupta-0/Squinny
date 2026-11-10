# Landing-page accessibility baseline

This edition includes a minimal, offline HTML inspector for \`landing/index.html\`. It scans for missing image \`alt\` attributes, external new-tab links without \`rel=noopener\`, missing language declarations and missing viewport metadata.

\`\`\`bash
node tools/landing-audit.mjs landing/index.html
node --test tools/landing-audit.test.mjs
\`\`\`

**Important:** This is static analysis, not a full accessibility certification. Test with keyboard-only navigation, screen readers, mobile viewport sizes and reduced-motion settings.

The audit module and its regression tests are newly added in this independent edition. Original MIT copyright, package identity and upstream contributor notices are retained.
