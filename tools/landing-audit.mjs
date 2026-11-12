#!/usr/bin/env node
/** Read-only static landing-page audit. Complements (does not replace) axe/browser testing. */
import { readFileSync } from 'node:fs';
export function inspectHtml(html) {
  const issues=[];
  const images=[...html.matchAll(/<img\b([^>]*)>/gi)];
  for (const [_,attrs] of images) {
    if (!/\balt\s*=/i.test(attrs)) issues.push({level:'warning',rule:'image-alt',message:'Image lacks alt attribute'});
  }
  const links=[...html.matchAll(/<a\b([^>]*)>/gi)];
  for (const [_,attrs] of links) {
    if (/\btarget\s*=\s*["']?_blank/i.test(attrs) &&
        !/\brel\s*=\s*["'][^"']*\bnoopener\b/i.test(attrs)) {
      issues.push({level:'warning',rule:'external-link',message:'External target link lacks rel=noopener'});
    }
  }
  if (!/<html\b[^>]*\blang\s*=/i.test(html))
    issues.push({level:'warning',rule:'html-lang',message:'Document should declare its language'});
  if (!/<meta\b[^>]*name=["']viewport["']/i.test(html))
    issues.push({level:'warning',rule:'viewport',message:'Missing mobile viewport meta tag'});
  // Duplicate element IDs can confuse labels, anchor navigation, and screen readers.
  const ids=[...html.matchAll(/\bid\s*=\s*["']([^"']+)["']/gi)].map(match=>match[1]);
  const visited=new Set();
  for(const id of ids) {
    if(visited.has(id)) issues.push({level:'warning',rule:'duplicate-id',message:'Repeated element ID: '+id});
    visited.add(id);
  }
  const h1Count=[...html.matchAll(/<h1\b/gi)].length;
  if(h1Count===0) issues.push({level:'warning',rule:'missing-h1',message:'Document has no primary h1 heading'});
  if(h1Count>1) issues.push({level:'warning',rule:'multiple-h1',message:'Document has multiple h1 headings'});
  return {images:images.length,links:links.length,ids:ids.length,issues};
}
if (process.argv[1] && import.meta.url===new URL('file://'+process.argv[1]).href) {
  const file=process.argv[2]||'landing/index.html';
  const result=inspectHtml(readFileSync(file,'utf8'));
  console.log(JSON.stringify(result,null,2));
  process.exitCode=result.issues.length?1:0;
}
