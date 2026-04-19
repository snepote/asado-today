# Asado today

A blazing fast, mobile-first responsive web app to decide whether it is a good day to make a BBQ.

### Recommendation factors
- Weather core — temp, precipitation probability, cloud cover, humidity, UV
- Wind intelligence — not just speed, but direction relative to your house and your neighbors. A 15 km/h wind blowing smoke into the patio next door is a different verdict than the same wind blowing it into an empty field.
- Golden hour math — sunset time vs. your window, so you know if you'll be flipping chorizo in the dark.
- Rain radar peek — not just the forecast number, but whether there's a cell actually drifting toward you in the next 4 hours.

## Tech stack
@TECH_STACK.md

## Specs
The complete specification is in specs/.
Begin by reading the [00_start.md](specs/00_start.md).

## Definition of done — E2E tests are mandatory

**NEVER consider a change "done" unless `pnpm test:e2e` passes with zero failures.** This is a hard gate, not a suggestion. If E2E tests fail, the task is not complete — diagnose and fix the failure before reporting success. Do not skip, disable, or mark tests as `.skip` to work around failures.

## Code quality
@CODE_QUALITY.md
