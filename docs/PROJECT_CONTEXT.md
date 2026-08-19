# PetRescue experiments — project context


## What this project is

A series of interactive data-visualisation experiments exploring

PetRescue's cat population management research.

These are exploratory prototypes, not the final PetRescue product.

Detailed experiment notes and design decisions live in my Obsidian vault.

Original research and the project brief live in `docs/Sources/`.

## Core communication problem

Community cat population management is complex and difficult to communicate.

Different interventions can have very different effects on:

- the free-living cat population

- cats entering pounds, shelters and rescues

- outcomes over time

A key communication challenge is that reducing the free-living population

does not necessarily reduce cats entering care.

The experiments should help people understand WHY these outcomes differ,

not simply present the resulting numbers.

## Current experiment

### Experiment 01 — Population vs intake

Question:

Can an interactive visual help someone understand why reducing the number

of free-living cats doesn't necessarily reduce the number entering pounds,

shelters and rescues?

Current explorations:

    * 01a Split Futures
    * 01b Follow a Cat
    * 01c Learn Then Compare
    * 01d Manage the Neighbourhood
    * 01e Where Did the Cats Go
    * 01f Two Counts

## Design principles

- Explain mechanisms visually rather than relying on text.

- Prefer editorial / scrollytelling approaches over dashboard UI.

- Playful is encouraged, but the data must remain credible.

- Interaction should reveal cause and effect.

- Do not invent data.

- Keep model/data separate from illustrative visual representation.

- Prototype cheaply before polishing.

- Desktop first for current experiments.

---

## Research rules (do not invent)

### Populations

Australia has **no single cat population figure**. Cats occupy different ecological niches, counted by different methods, dates, and confidence levels.

The visualisation scope is **pet cats and urban stray / free-living community cats**, not feral cats in natural environments. Counting semi-owned cats as either owned or feral misrepresents both the number and the intervention.

The briefing states: between **3% and 10%** of Australian adults feed cats they do not consider themselves to own, at an average of **1.5 cats fed daily**. These cats sit at the owned/unowned boundary and are the population community cat programmes reach.

Urban stray point estimate **700,000**, plausible range **70,000–2.56 million** (about **29 per 1,000 residents**, range **3–104**). Feral numbers in natural environments fluctuate roughly four-fold with drought vs rain; adding ~700,000 in highly modified environments gives a total feral range of about **2.1–6.3 million**. Any percentage-reduction target must state which point in that cycle it is measured from.

Owned-cat total **5.3 million** reaches the briefing via a secondary citation of Animal Medicines Australia; household ownership **prevalence is recorded as a gap**, not a figure to quote.

### Intake (shelter / pound door)

Most complete national picture cited: Chua, Rand and Morton 2023, Councils / NFP shelters / rescues, **2018–19**.

- **179,615** unduplicated cat **admissions** nationally, or **7.2 per 1,000 residents** (a later page in the same briefing also writes **7.1** — do not silently “correct”; check the source page you are citing).
- Sum of intakes across organisation types **192,584** double-counts transfers. Use **admissions** for a population picture and **intakes** for a workload picture.
- Of admissions that concluded within the year: **5%** reclaimed, **65%** rehomed, **28%** euthanased (**50,022** cats per annum). Another page states **33%** of cats entering shelters and municipal facilities in 2018–19 were euthanased — again, cite the specific statement; do not merge them into one invented rate.
- Jurisdiction spread: **4.9 per 1,000** (NSW) to **10.9** (SA).
- About **7%** of the urban stray / free-living population is **killed** in shelters and pounds each year. That is **not** the share **admitted**. The model section derives ~**19.5%** of the urban free-living population **entering care** each year (80% stray-sourced admissions against ~735,565 urban free-living). Do not confuse killed share with admission share.
- RSPCA Australia series covers member societies only (~a quarter of national admissions): trend indicator, not a population count. Cats received **49,166** (2013–14) to **25,639** (2024–25), −48%; euthanasia **15,491** to **5,089**, −67%; euthanasia rate **31.5%** to **19.3%** (2023–24) then **19.8%** (2024–25). The briefing attributes much of the intake fall to branches pulling back from council impounding.

There is **no national companion animal data standard**. The 2018–19 national baseline has not been repeated. Coverage gaps are documented in the briefing; do not fill them.

### What changes population size

Both sterilisation and lethal removal have **high coverage thresholds** below which they do not produce sustained population reduction.

- Neutering **>70%** of cats in an area required to reverse growth in Gunther et al.’s 12-year field experiment (>7% annual reduction). Hurley & Levy: sterilisation threshold **57% to >90%** depending on conditions; lethal removal **≥50% of the population annually** (also Andersen, Martin & Roemer).
- Australian shelter/pound euthanasia removes about **7%** of the urban stray population annually — about one seventh of the lowest published lethal-control threshold. Shortfall attributed to remaining reproductive rate, immigration into vacated area, and increased juvenile survival when competition falls.
- Field evidence that **culling below threshold can increase** local numbers: Lazenby et al. (Tasmania) **+75% to +211%** at culled sites, declining after culling stopped; Palmas et al. **44%** removed in 38 days, full recovery within three months; Boone et al. simulation: episodic culling reduced final size only slightly, and cumulative adults that ever lived was slightly **higher** than doing nothing.
- Mechanism: below-threshold removal creates vacant habitat with less competition → more immigration and higher survival of kittens still being born.

**Australian sterilisation programmes cited:**

- Rosewood (Ipswich): **308** cats over **3.4** years; **27.8 per 1,000 residents/year** (94 per 1,000 cumulative). Stray admissions down **up to 78%** vs 2017–2019; euthanasia **−85%**; cat-related council calls **−39%**.
- Banyule (Victoria): **4.1 per 1,000/year** in three target suburbs over eight years (**0.8 per 1,000** city-wide). City-wide intake **−66%**; euthanasia **−82%**.

Cotterell, Rand and Scotney: plan **5–10 per 1,000/year** if **micro-targeted** to streets/households generating admissions; **30–60 per 1,000** if not. Higher intensity buys **speed**, not a different endpoint. Targeting quality is invisible to the well-mixed model.

Reproduction notes in the briefing (do not upgrade assumed figures to published ones): free-roaming queens ~**1.4 litters/year**, median **3** kittens; ~**75%** of kittens die or disappear before six months (towards **90%** at high density). Combined surviving-to-six-months figure of ~**1.2 kittens per female per year** is **worked in the briefing, not a published value**. Unmanaged urban growth **18–20%/year**; females breed from six months; adult mortality ~**5% per six-month interval**. Gunther et al. observed compensatory reproduction (kitten:queen ratio **×2.25**) during high-intensity neutering.

###  Central relationship this experiment is exploring

Trap-and-remove and sterilise-and-return can both reduce standing cat numbers on paper. They do **different things to shelter/pound intake**, for mechanical reasons:

- Under **trap-and-remove**, the breeding adult that is trapped **is** the admission. Harder trapping sends more cats to the pound even as the standing population falls.
- Under **sterilise-and-return**, neither that adult nor its future kittens enter care as a consequence of the surgery; the adult is returned. A returned sterilised cat continues to occupy territory; a removed cat vacates it and intact cats move in.

Honest headline from the briefing: removal at sufficient scale can shrink population, but **cannot reduce cats entering care, because trapping is how they get there**. Sterilisation reduces both, and holds territory while it does it.

### Indexed model results used in current prototypes

Preset scenarios are **indexed so current Australian practice = 100** for population and intake. Figures already shown in this repo:

| Scenario | Population year 10 | Cats entering care year 10 | Year 20 intake |
| --- | --- | --- | --- |
| Current practice | 100 | 100 | 100 |
| Trap and remove, doubled | **39** | **99** | 93 |
| Sterilise and return, 5 per 1,000 residents/year | **65** | **25** | 23 |

Other presets exist in the briefing (including 50% annual removal, 2 / 10 / 27.8 per 1,000 sterilisation, sterilise-then-stop). Use them only from the source table. The **50% removal** preset reduces both population and intake in the model but **must not be presented as an available Australian urban option**; current sector effort is a small fraction of that threshold.

Immigration at year 10 (per 10,000 residents) in the proposed model: doubled trapping **18.7**; highest removal setting **21.1**; sterilise-and-return **15.7**; current practice **11.6**.

### Model structure (do not simplify these away)

Two compartments, intact `I` and sterilised `S`, annual timestep, per **10,000 residents**.

Three structural features the briefing says must not be simplified away:

1. **Admissions are an output, not an input** — generated by trapping and by births.
2. **`sigma` (complaint resolution)** — a sterilised, microchipped cat with a named caregiver stops generating the complaint that would have had it trapped. Fitted (`sigma` = 0.55) to Banyule and Rosewood; two programmes is suggestive, not settled.
3. **`imm` scales with the emptied niche** — harder removal → faster intact arrivals. Density-dependent births are not enough; immigration represents the vacancy argument.

Carrying capacity is **calibrated**, not assumed: 29 free-living cats per 1,000 residents as equilibrium **under today’s trapping** → capacity **577 per 10,000**, current population at **50%** of capacity (where the published ~19% annual growth rate applies).

**Assumed, not published:** kitten share of admissions (default 0.45). Name it as a data gap if shown.

**Surviving kittens default 0.50 per intact cat per year** is already **net of kitten mortality**. It is not litter size.

### What the model does not do (say so if relevant)

- Single well-mixed population, not spatial. Real populations are patchy; micro-targeting is why lower recommended rates can work. The model **understates** well-targeted programmes.
- Owned cats are not a separate compartment.
- Wildlife outcomes are **not modelled**. Say so rather than implying the question is answered.
- No spatial/seasonal breeding variation; no disease dynamics.
- Compensatory reproduction was **left out**; omitting it is conservative for removal (makes culling look better than if included). The about-panel should say the model is **optimistic about culling**.
- Starting population range spans nearly forty-fold; exposing a range is more honest than one confident line.

---

## Repo conventions

Stack: Vite, React 19, TypeScript, React Router. Deploy as a static SPA (Vercel rewrites in `vercel.json`).

```sh
npm install
npm run dev
```

**Adding an experiment**

1. Create `src/experiments/NN-slug/index.tsx`.
2. Wrap the page in the shared `Experiment` component.
3. Register it in `src/App.tsx` and `src/data/experiments.ts`.

Shared UI: `src/components`. Shared datasets: `src/data`. Shared look: `src/index.css` (editorial serif/sans, warm paper palette). Experiment-specific CSS stays next to the experiment.

Do not change unrelated prototypes when adding a new one, unless asked.

**Current experiment inventory** (paths only; behaviour lives in code, notes in Obsidian):

| Index label | Folder | Notes |
| --- | --- | --- |
| 01a | `src/experiments/01a-split-futures` | Scroll: two neighbourhood futures. |
| 01b | `src/experiments/01b-follow-a-cat` | One cat, then 10-year indices. Routes include `/experiments/01b-follow-a-cat`. |
| 01c | `src/experiments/01c-learn-then-compare` | Teach mechanism, then compare futures. |
| 01d | `src/experiments/01d-manage-the-neighbourhood` | Interactive tool-drop neighbourhood; model figures are supplied, not computed from clicks. |
| 01e | `src/experiments/01e-where-did-the-cats-go` | Flow between neighbourhood and care; year-10 indices are supplied, not computed. |
| 01f | `src/experiments/01f-two-counts` | Street stock vs door flow; trap-and-remove paradox, then sterilise contrast. |

Do not “fix” numbering, copy, or behaviour unless asked.

---

## When implementing

- Read this file, then the relevant experiment code, then `docs/Sources/` before adding or changing numbers, labels, or causal claims.
- If the user supplies copy or a story structure, follow it. Do not replace it with a more “accurate” lecture unless asked.
- Prefer citing “indexed to current practice = 100” whenever showing 39 / 99 / 65 / 25.
- Keep research language aligned with sources: **free-living**, **admissions vs intakes**, **trap + remove**, **sterilise + return**, **micro-targeting**.
- When in doubt, show less, and point at the source document rather than rounding or combining figures.
