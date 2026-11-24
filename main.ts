import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// Tables describe immediate width, minimum stack depth and net stack growth.
const meta = new Array(256);
for (const [op, imm, pop, push] of [
  [0,0,0,0],[1,1,0,1],[2,4,0,1],[3,0,1,0],
  [4,0,1,2],[5,0,2,2],[6,0,2,3],[7,0,3,3],
  [23,0,1,1],[27,0,1,1],
  [48,2,0,0],[49,2,1,0],[50,2,1,0],[51,2,0,0],[52,0,0,0],
  [64,0,1,1],[65,0,2,0],[80,0,1,0],[81,0,1,0],
  [82,0,0,1],[83,0,1,0]
]) meta[op] = [imm, pop, push-pop];
for (const op of [16,17,18,19,20,21,22,24,25,26,28,29,30,32,33,34])
  meta[op] = [0,2,-1];

export function run(p, input) {
  const d = new Int32Array(256), m = new Int32Array(256);
  const calls = new Int32Array(64), out = Buffer.alloc(65536);
  let pc=0, sp=0, cp=0, ip=0, len=0;
  const done = code => ({stdout: out.subarray(0,len), exit: code});
  for (let step=0; ; step++) {
    if (step === 1000000) return done(10);
    if (pc < 0 || pc >= p.length) return done(9);
    const op=p[pc], spec=meta[op];
    if (!spec) return done(5);
    const [imm, need, growth]=spec;
    if (pc+imm >= p.length) return done(9);
    if (sp < need) return done(2);
    if (sp+growth > 256) return done(3);
    const next=pc+imm+1;
    pc=next;
    const a=d[sp-2], b=d[sp-1];
    let v;
    switch (op) {
      case 0: return done(0);
      case 1: d[sp++]=(p[next-1]<<24)>>24; break;
      case 2:
        d[sp++]=p[next-4]|p[next-3]<<8|p[next-2]<<16|p[next-1]<<24;
        break;
      case 3: sp--; break;
      case 4: d[sp++]=b; break;
      case 5: d[sp-2]=b; d[sp-1]=a; break;
      case 6: d[sp++]=a; break;
      case 7:
        v=d[sp-3]; d[sp-3]=a; d[sp-2]=b; d[sp-1]=v;
        break;
      case 23: d[sp-1]=-b; break;
      case 27: d[sp-1]=~b; break;
      case 48: case 49: case 50:
        if (op===48 || (op===49 ? d[--sp]===0 : d[--sp]!==0))
          pc=next+((p[next-2]|p[next-1]<<8)<<16>>16);
        break;
      case 51:
        if (cp===64) return done(7);
        calls[cp++]=next; pc=p[next-2]|p[next-1]<<8;
        break;
      case 52:
        if (!cp) return done(8);
        pc=calls[--cp]; break;
      case 64:
        if (b<0 || b>255) return done(6);
        d[sp-1]=m[b]; break;
      case 65:
        if (b<0 || b>255) return done(6);
        m[b]=a; sp-=2; break;
      case 80: {
        const s=String(b);
        if (len+s.length>65536) return done(11);
        out.write(s,len,'ascii'); len+=s.length; sp--; break;
      }
      case 81:
        if (len===65536) return done(11);
        out[len++]=b&255; sp--; break;
      case 82: d[sp++]=ip<input.length ? input[ip++] : -1; break;
      case 83: return done(b&255);
      default:
        if (op>=19 && op<=22 && b===0) return done(4);
        switch (op) {
          case 16: v=a+b; break;
          case 17: v=a-b; break;
          case 18: v=Math.imul(a,b); break;
          case 19: v=a/b; break;
          case 20: v=a%b; break;
          case 21: v=(a>>>0)/(b>>>0); break;
          case 22: v=(a>>>0)%(b>>>0); break;
          case 24: v=a&b; break;
          case 25: v=a|b; break;
          case 26: v=a^b; break;
          case 28: v=a<<b; break;
          case 29: v=a>>b; break;
          case 30: v=a>>>b; break;
          case 32: v=+(a===b); break;
          case 33: v=+(a<b); break;
          case 34: v=+((a>>>0)<(b>>>0)); break;
        }
        d[sp-2]=v; sp--;
    }
  }
}

// Directory overrides are for local harness mounts only; VM execution is pure.
const I=process.env.MAKEFUN_INPUT_DIR ?? '/input';
const O=process.env.MAKEFUN_OUTPUT_DIR ?? '/output';
for (const id of readdirSync(I).sort()) {
  const r=run(readFileSync(join(I,id,'program.bin')),
    readFileSync(join(I,id,'input.bin')));
  const dir=join(O,id);
  mkdirSync(dir,{recursive:true});
  writeFileSync(join(dir,'stdout.bin'),r.stdout);
  writeFileSync(join(dir,'exit.txt'),`${r.exit}\n`);
}
