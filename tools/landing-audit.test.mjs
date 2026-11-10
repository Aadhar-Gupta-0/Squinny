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
 assert.equal(inspectHtml('<html lang="en"><meta name="viewport"><img src="x" alt=""><a target="_blank" rel="noopener noreferrer">a</a>').issues.length,0);
});
