# Award Scorecard changelog · 2026-10-31

Trigger: user — 评分形同虚设 / 「获奖级一点也没用」after 旋律 vanity Pass. Distill nine-item already in `DISTILL-MULTIDIM.md`.

## Files touched
| Path | Change |
|------|--------|
| `docs/AWARD-SCORECARD.md` | Full harden (primary) |
| `tools/award_score_check.py` | Flags + caps to match |
| `docs/INFRAME-SHOW.md` | Cross-link § Award vanity harden |
| `docs/PROGRESS-LADDER.md` | Cross-link § Award harden |
| `docs/DISTILL-MULTIDIM.md` | Pre-score Gate 挂接 |
| `docs/SKILL-PATCH.md` | For parent `UpdateSkill` on vibe-knowledge-film |
| `tools/rubric.py` | **TODO unchanged** — traffic /100 only; does not implement Award. Do not merge scales. Optional later: print reminder that Award Gate ≠ rubric pass. |

## Key rule diffs (old → new)
1. **Pre-score Gate G0–G6** before any Pass claim: nine-item distill attach (type ladder + 3s motion + Mode two sentences + 知识锚易杠), crop-bottom mute, type visible, no card-swap, state-change names theory, audience swipe, vanity contact-sheet物证.
2. **Evidence cap:** C/G/T/N/X/D ≥4 requires densest frame path + what moved / type role; else cap 3.
3. **L/M soft-cap:** if L or M ≤3, N/X/H/G/K default max 4 (no inflate-to-44); frame-proof exception only.
4. **Vanity Pass ban:** ≥44 with C/G/T padded from prose / no densest stills → **Fail**.
5. **HUMAN-CHECK.md** mandatory after numeric line: 划走? / mute mechanism? / novel prop? — any No → near-pass max.
6. Keep /55; Pass still ≥44 + N/X/D≥4 + L/M/F≥4 **and** Gate + HUMAN-CHECK.
7. Hard-fails kept: flicker, page-flip, PPT list-wall, ~20s dwell, caption-only story.

## award_score_check.py flags
- `--gate-fail` → demote pass→near-pass
- `--human-fail` → demote pass→near-pass
- `--vanity` → fail
- `--no-evidence-cap` → force C/G/T/N/X/D ≥4 down to 3
- `--lm-exception` → allow N/X/H/G/K =5 when L/M≤3 (only with real frame proof)

## Parent action
- Apply `docs/SKILL-PATCH.md` via UpdateSkill on `vibe-knowledge-film` (executor cannot UpdateSkill).
- Do **not** treat script-only Pass as 获奖级 in user copy.

## 晚间 · 六层反馈 · 禁底白复读画面字
- User: 画面已展示的字，底下白字再写一遍 → 人看不过来；静音片白字只稀疏辅助。
- INFRAME §2b + Gate checklist；AWARD 硬失败 **G/T** 加「图内字+底白同义复读」。
