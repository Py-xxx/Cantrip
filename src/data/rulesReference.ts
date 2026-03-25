// Derived from D&D 5e Player's Handbook mechanics.
// Injected into every prompt so the DM AI knows exactly which check to call,
// when to call it, and what the correct DC range is.

export const RULES_REFERENCE = `
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
D&D 5E RULES REFERENCE — DM USE ONLY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

── CORE MECHANIC ─────────────────────────────────────────
Roll d20 + ability modifier (+ proficiency bonus if proficient).
Meet or beat the DC = success. Below DC = failure.
Failure means no progress toward the goal, or progress combined with a setback.

── DIFFICULTY CLASSES ────────────────────────────────────
Very Easy    DC  5  — Almost anyone can do this
Easy         DC 10  — Requires some competence
Medium       DC 15  — Requires meaningful skill or effort
Hard         DC 20  — Difficult even for trained characters
Very Hard    DC 25  — Near the limits of mortal ability
Nearly Impossible DC 30 — Reserved for legendary feats

── ADVANTAGE & DISADVANTAGE ──────────────────────────────
Advantage: roll 2d20, use higher. Granted by favorable circumstances, spells, or help from an ally.
Disadvantage: roll 2d20, use lower. Imposed by difficult conditions, injuries, or being caught off-guard.
They cancel each other out — multiple sources of each don't stack.

── PASSIVE PERCEPTION ────────────────────────────────────
= 10 + Wisdom modifier (+ proficiency if proficient in Perception)
Used when a character is not actively searching — for noticing hidden creatures, traps, ambushes.
The DM compares a hidden creature's Stealth check against this score without the player rolling.

── CONTESTS ──────────────────────────────────────────────
When two parties directly oppose each other, both roll and compare totals.
Higher total wins. On a tie, the status quo holds — neither side gains ground.
Examples: Stealth vs. Perception, Grapple vs. Athletics, Deception vs. Insight.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SKILLS — WHEN TO CALL FOR EACH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

── STRENGTH ──────────────────────────────────────────────
Athletics (STR): Climbing difficult surfaces, jumping unusual distances, swimming in rough water,
  grappling, breaking free of restraints, forcing open stuck or barred doors, pushing heavy objects.
  Call for Athletics when physical exertion has a meaningful chance of failure.

── DEXTERITY ─────────────────────────────────────────────
Acrobatics (DEX): Staying on your feet on ice or uneven ground, flips, dives, rolls,
  balancing on a narrow ledge, escaping from bonds.

Sleight of Hand (DEX): Pickpocketing a coin purse, palming an object, planting an item on someone,
  concealing an object on your person, card tricks, lifting a key from a belt.
  USE THIS for theft when the target is unaware. Use Athletics if it's a grab against resistance.

Stealth (DEX): Sneaking past guards, hiding from enemies, slipping away unnoticed, creeping up on someone.
  ALWAYS contested against the target's passive Perception (or active Wisdom (Perception) if searching).
  Can't hide from a creature that can already see you. Noise ends hiding.

── INTELLIGENCE ──────────────────────────────────────────
Arcana (INT): Recalling lore about spells, magic items, eldritch symbols, magical traditions, planes.
History (INT): Recalling historical events, legendary people, ancient kingdoms, wars, lost civilizations.
Investigation (INT): Searching for clues and making deductions — finding hidden objects, analyzing wounds,
  spotting weak points in structures, poring through documents for hidden information.
Nature (INT): Recalling terrain, plants, animals, weather, natural cycles.
Religion (INT): Recalling lore about deities, rites, religious hierarchies, holy symbols, secret cults.

── WISDOM ────────────────────────────────────────────────
Animal Handling (WIS): Calming animals, controlling a spooked mount, reading animal intentions.
Insight (WIS): Reading someone's true intentions, detecting a lie, predicting someone's next move —
  gleaned from body language, speech patterns, and mannerisms.
  USE THIS when the player wants to know if an NPC is being honest or has ulterior motives.
Medicine (WIS): Stabilizing a dying creature, diagnosing an illness or poison.
Perception (WIS): Spotting, hearing, or detecting the presence of something —
  noticing an ambush, hearing a whisper through a door, spotting a hidden trap or figure.
  This is the most commonly called check. Default to this for general awareness.
Survival (WIS): Tracking, hunting, navigating wilderness, reading weather, avoiding natural hazards.

── CHARISMA ──────────────────────────────────────────────
Deception (CHA): Convincingly hiding the truth — outright lying, misleading through ambiguity,
  passing off a disguise, fast-talking a guard, maintaining a straight face under pressure.
  USE THIS when the player is lying, pretending to be someone they're not, or misleading an NPC.
  NOT for honest requests. If the player is lying → Deception. If honest → Persuasion.

Intimidation (CHA): Influencing through overt threats, hostile actions, or implied violence —
  prying information from a captive, backing down thugs, threatening a merchant into compliance.
  USE THIS when the approach involves fear, menace, or the threat of harm.
  Robbery by threat → Intimidation. Robbery by stealth → Sleight of Hand.

Performance (CHA): Delighting an audience through music, acting, storytelling, or dance.
Persuasion (CHA): Influencing others with tact, social grace, or reasoned argument —
  making cordial requests, negotiating, fostering goodwill, appealing to someone's interests.
  USE THIS for honest, non-threatening social influence. NOT for lies (use Deception) or threats (use Intimidation).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHOOSING THE RIGHT CHECK — DECISION GUIDE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"I steal her coin purse without her noticing"  → Sleight of Hand (DEX) contested by her Perception
"I threaten her into giving me her money"       → Intimidation (CHA), DC based on how scared she'd be
"I try to convince her to give me money"        → Persuasion (CHA), high DC — she has no reason to comply
"I lie and say I'm collecting for the temple"   → Deception (CHA), contested by her Insight
"I grab her purse and run"                      → Athletics (STR) if she resists, Sleight of Hand if fast and light
"I attack her"                                  → Combat begins. Roll Initiative (DEX). No skill check.

"I sneak past the guard"                        → Stealth (DEX) contested by guard's passive Perception
"I hide in the shadows"                         → Stealth (DEX) — only if the guard can't currently see them
"I pick the lock"                               → Dexterity check (thieves' tools), DC based on lock quality
"I climb the wall"                              → Athletics (STR), DC based on surface difficulty
"I search the room for clues"                   → Investigation (INT) or Perception (WIS), depending on method
"I try to sense if he's lying"                  → Insight (WIS), contested by his Deception (CHA)
"I recall if I know anything about this symbol" → Arcana, History, Religion, or Nature (INT), based on symbol type

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WHEN A CHECK IS NOT NEEDED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Do NOT call for a check when:
- The task is trivially easy (opening an unlocked door, walking down a path)
- Failure has no meaningful consequence
- The character has all the time in the world and no pressure
- The action is impossible regardless of the roll (you can't persuade a mindless creature)

DO call for a check when:
- There is a meaningful chance of failure
- Failure has consequences that change the scene or story
- Time, opposition, or difficulty is a factor

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DC GUIDELINES FOR COMMON SITUATIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Pickpocket a distracted target in a crowd           → Sleight of Hand DC 12
Pickpocket an alert or suspicious target            → Sleight of Hand DC 18
Intimidate a lone commoner with a drawn weapon      → Intimidation DC 10
Intimidate a hardened criminal or soldier           → Intimidation DC 16–20
Persuade a friendly NPC for a reasonable request    → Persuasion DC 10
Persuade a neutral NPC for an unusual request       → Persuasion DC 15
Persuade an unfriendly NPC for anything             → Persuasion DC 20
Convince someone of an obvious lie                  → Deception DC 18–22
Pass a convincing but plausible lie                 → Deception DC 13–15
Sneak past an inattentive guard                     → Stealth DC 12
Sneak past an alert guard in poor cover             → Stealth DC 18
Climb a rough stone wall                            → Athletics DC 10
Climb a sheer or slippery surface                   → Athletics DC 20
Pick a simple lock                                  → Dexterity (tools) DC 10
Pick a complex lock                                 → Dexterity (tools) DC 20
Notice something obviously hidden                   → Perception DC 10
Notice something carefully concealed               → Perception DC 18–22
`;
