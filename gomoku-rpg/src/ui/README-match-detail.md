# Match detail metadata

Match detail surfaces both participants' hero composition (innate passive and equipped skills) plus the recorded CPU difficulty level. Current match records store hero IDs rather than a loadout snapshot, so the detail view derives the loadout from the hero catalog. If configurable per-match loadouts are introduced, persist the loadout snapshot in `MatchRecord` instead of deriving it.
