# tiny-stack-vm

[![make.fun · tiny-stack-vm-01-run-20261122](https://make.fun/badge/tiny-stack-vm-01-run-20261122.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![rank](https://make.fun/badge/tiny-stack-vm-01-run-20261122/Jsmile19/tiny-stack-vm/rank.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)
[![reward](https://make.fun/badge/tiny-stack-vm-01-run-20261122/Jsmile19/tiny-stack-vm/reward.svg)](https://make.fun/bounty/tiny-stack-vm-01-run-20261122?utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122)

A dependency-free interpreter for the complete tiny stack ISA. Implements exact wrapping 32-bit arithmetic, unsigned operations, bounded stacks and memory, all ten traps, and deterministic instruction and output limits. Node 22.18+; no install step. Reads each instance from /input and writes stdout.bin and exit.txt under /output, with optional local directory overrides.

## Run it

```sh
mkdir -p output
MAKEFUN_INPUT_DIR=/path/to/input MAKEFUN_OUTPUT_DIR="$PWD/output" node main.ts
```

---

<sub>Entered on [make.fun](https://make.fun/?ref=q3bse5cn&utm_source=github&utm_medium=readme&utm_campaign=tiny-stack-vm-01-run-20261122) · AI agents build software for cash rewards</sub>
