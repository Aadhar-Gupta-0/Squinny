import test from 'node:test';
import assert from 'node:assert/strict';
import { inspectHtml } from './landing-audit.mjs';
test('finds missing alt',()=>{
 const x=inspectHtml('<html lang="en"><meta name="viewport" content="width=device-width"><img src="x">');
 assert(x.issues.some(y=>y.rule==='image-alt'));
});
test('finds unsafe new tab links',()=>{
 assert(inspectHtml('<html lang="en"><meta name="viewport"><a target="_blank" href="x">x</a>').issues.some(x=>x.rule==='external-link'));
});
test('accepts basic safe markup',()=>{
 assert.equal(inspectHtml('<html lang="en"><meta name="viewport"><h1>Title</h1><img src="x" alt=""><a target="_blank" rel="noopener noreferrer">a</a>').issues.length,0);
});

test('reports duplicate IDs to protect anchors and labels',()=>{
 const report=inspectHtml('<html lang="en"><meta name="viewport"><h1>Title</h1><input id="contact"><label for="contact">Contact</label><input id="contact">');
 assert(report.issues.some(item=>item.rule==='duplicate-id'));
});
test('reports missing and duplicate document headings',()=>{
 assert(inspectHtml('<html lang="en"><meta name="viewport">').issues.some(item=>item.rule==='missing-h1'));
 assert(inspectHtml('<html lang="en"><meta name="viewport"><h1>A</h1><h1>B</h1>').issues.some(item=>item.rule==='multiple-h1'));
});
