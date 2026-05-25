# CUT3R Redesign Inventory

## Source

- Page: `pages/paper_reviews/CUT3R/index.html`
- Paper: `Continuous 3D Perception Model with Persistent State`
- PDF reference: `/Users/song-useog/Desktop/Portfolio/git_papers/Continuous 3D Perception Model with Persistent State.pdf`
- Active layout reference: `pages/paper_reviews/DROID-W/`

## Preserved Assets

- Figure 1: `media_c95129ba6731.png`
- Figure 2: `media_1eef893a1b25.png`
- Figure 3: `media_2545ea5630d9.png`
- Table 1: `media_971c727f943e.png`
- Table 2: `media_011d48002542.png`
- Table 3: `media_8432c9cb3359.png`
- Table 4: `media_89b0b08b5dc9.png`
- Figure 4: `media_3a836c1e2f10.png`
- Table 5: `media_d53f249e01ad.png`
- Figure 5: `media_821a2c3f3f7a.png`
- Figure 6: `media_c3c0f5c74c90.png`

## Preserved Equations

- Eq. (1): Image feature encoding, `F_t = Encoder_i(I_t)`
- Eq. (2): State interaction, `[z'_t,F'_t],s_t = Decoders([z,F_t],s_{t-1})`
- Eq. (3): Self-frame readout, `\\hat{X}^{self}_t,C^{self}_t=Head_{self}(F'_t)`
- Eq. (4): World-frame readout, `\\hat{X}^{world}_t,C^{world}_t=Head_{world}(F'_t,z'_t)`
- Eq. (5): Pose readout, `\\hat{P}_t=Head_{pose}(z'_t)`
- Eq. (6): Raymap encoding, `F_r=Encoder_r(R)`
- Unnumbered in the PDF text: raymap color readout, `\\hat{I}_r=Head_{color}(F'_r)`
- Eq. (7): Pointmap confidence loss, `\\mathcal{L}_{conf}`
- Eq. (8): Pose loss, `\\mathcal{L}_{pose}`
- Unnumbered in the PDF text: RGB consistency loss, `\\mathcal{L}_{rgb}`

## Redesign Decisions

- Reorganized the page into `핵심 요약 -> 논문 상세 정리 -> Problem -> Mechanism -> Evidence -> Usage / Limits -> 느낀점 -> 향후 계획`.
- Removed converted Notion property icons from the visible body.
- Kept all original user-provided figures and tables.
- Added KO/EN in-page language panels instead of separate pages.
- Used DROID-W CSS/JS for right bookmark, deep-dive reveal, contained supplement toggles, lightbox, theme toggle, and equation styling.
- Kept personal sections as `(진행중...)` / `(In progress...)` because this page did not have finalized personal notes.

## Verification

- `node --check pages/paper_reviews/CUT3R/script.js`
- `git diff --check -- pages/paper_reviews/CUT3R`
- Local link scan: missing refs `0`
- Browser DOM check:
  - KO and EN panels present
  - deep-dive reveal works
  - bookmark labels switch with language
  - 11 figures per language panel
  - 10 equations per language panel
  - all 20 equation instances rendered by KaTeX
  - official equation tags `(1)`-`(8)` rendered in both KO and EN panels
