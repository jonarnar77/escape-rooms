# Helix: Sublevel 5 — puzzle design

**Premise:** You wake in a quarantine cell beneath Helix Biolabs. The staff are gone. Dr. E. Voss left notes everywhere. Five rooms stand between you and the surface elevator.

**Difficulty:** Room 1 as built is the reference for **medium**: fair clues, one or two steps of reasoning per puzzle, no pixel hunting. Later rooms should stay around this level, maybe ramping slightly toward room 5.

**Difficulty modes** (chosen when starting a new game):
- **Easy:** a hint button (bottom-right of the screen) whose hints follow the player's progress through each room, and sparkles on important objects.
- **Medium:** the reference experience.
- **Hard:** fewer hand-holding clues. In R5 the safe note and the photo's back are minimal. In R4 the temperatures are randomised and the heat hint is removed. In R3 the Morse word and drawer are randomised, and the IT note and terminal hint are removed. In R1 the cabinet note is missing, and the pill counts and door code are randomised every game. In R2 the terminal has no password hint, the recipe is written in formulas, and there's no "vents" diary entry.

**Running thread:** Each room hides one **torn photo fragment** (4 total, rooms 1–4). In room 5 the assembled photo reveals the final elevator code. This rewards players who explore thoroughly.

---

## Room 1 · Quarantine Ward ✅ built (tutorial)
1. Look under the pillow to find a **small key**.
2. Use the key on the desk drawer to get a **UV torch** with no battery.
3. Read the clipboard ("blue, red, green; combo = the doses"), then count the pills in the tray (3 / 6 / 1). This opens the cabinet padlock **3-6-1**, which holds a **battery**.
4. Combine the torch with the battery, then use the UV light on the safety poster to reveal **2749**.
5. Enter the code on the keypad and the door opens.

Seeds for later: the clock is stopped at **3:15**, plus the whiteboard notes "DO NOT open Cryo B" and "H-5 → ??".
Photo piece #1 is tucked behind the safety poster (close-up view).

## Room 2 · Chemistry Lab ✅ built
1. Look through the microscope to see **5 · 88 · 49**. Matching these on the periodic table gives **B · Ra · In**, so the password is **BRAIN**.
2. Enter it on the fume hood terminal and the sash opens, giving access to the reagents.
3. Take the intact flask from the glassware shelf.
4. The lab notebook has the C-7 recipe: 2× copper sulfate, 1× potassium chromate, 1× hydrochloric acid, and **acid last**. Use the flask on the hood to open the mixer and make the **solvent**.
5. Use the solvent on the corroded vent bolts. The vent opens to reveal a **keycard** and **photo piece #2**.
6. Use the keycard on the reader and the door to the server room opens.

Foreshadowing: an empty, smashed picture frame (the torn photo), and a lab coat with "Dr. E. VOSS" on the name tag.

## Room 3 · Server Room ✅ built
The room starts in red emergency lighting because the power is out.
1. Open the toolbox (south) to find a **spare fuse**.
2. Open the breaker panel close-up (east) and replace the blown **RACKS** fuse. This brings the routing matrix online.
3. **Routing matrix** (rotate-grid): rotate the tiles to connect POWER to RACKS. The lights, racks and terminal come back on.
4. Rack C's amber status LED blinks Morse code for **COLD**. The corkboard (south) has a Morse chart and an IT sticky note explaining how to read the LED. Click the LED for a close-up. On easy and medium, amber position lamps 1–4 (in the close-up and beside rack C's drawer numbers) show which letter is being sent.
5. Enter COLD at the terminal (east). The log says the fob is in **rack B, drawer 3**, and all drawer locks release.
6. Rack B drawer 3 holds the **cryo fob** and **photo piece #3**.
7. Use the fob on the reader by door D-03 to enter Cryo Storage.

Story beats: the log reads "CRYO B CONTAINMENT ALARM" and Voss warns "do NOT open pod B". The UPS fails at **03:15**, which matches room 1's stopped clock. Frost creeps under the cryo door.
Hard mode: the Morse word and the drawer location are randomised, and the terminal hint, IT sticky note and letter-position lamps are removed.

## Room 4 · Cryo Storage ✅ built
The power cut let the four pods drift warm, so their displays blink red.
1. Each pod's base shows a specimen ID: A·HX-21, B·HX-07, C·HX-33, D·HX-14. The **manifest** by the door (south) lists storage temperatures by ID, plus two decoy entries.
2. **Console sliders** (west): set A −60, B −150, C −110, D −40. All pods go nominal and an alarm sounds: "POD B: SEAL BREACH, DOOR RELEASED".
3. **Pod B** (north): opening it triggers a flash, a screen shake and the jump scare. The pod is **empty**, cracked from the inside, with claw marks and torn restraints. Inside are the **frozen director's keycard** and **photo piece #4**.
4. The incubator (south) is "OUT OF ORDER, emergencies: use server room heat!"
5. **Backtrack to room 3** and use the ice block on the roaring server racks to free the **director's keycard**.
6. Use the keycard on the L5 reader (east) to enter the Director's Office.

Story beats: pod B held specimen **HX-07**, the same number as "Patient #07" in room 1. The keycard belongs to **Dr. A. Hale, Director**, and its photo has been scratched out.
Hard mode: the storage temperatures are randomised, and the facilities note and the incubator's "server room heat" hint are removed.

## Room 5 · Director's Office ✅ built (finale)
Warm wood panelling after all the concrete: an elevator marked SURFACE, CCTV of every room you passed through, and a leather chair that's still faintly warm.
1. **Desk drawer** (west): a roll of **tape**. Tape + torn photo makes the **taped photo**, but only with all 4 pieces. If any are missing, the game tells you where they were.
2. **Examine the taped photo** to zoom in. The front is the Sublevel 5 team: Voss, Hale, Okafor (IT), and a fourth person in a hospital gown and wristband with the face scratched out. Click to turn it over. The back reads: "Lift override: the way out is the way you came in. Start where it began."
3. **Painting** (east) swings aside to reveal a **clock-face safe**. The notepad on the desk says "it remembers the exact moment everything stopped". Room 1's clock and room 3's log both say **3:15**.
4. **Safe:** holds the **elevator key** and **Hale's journal**: "HX-07 ... remembers nothing ... believes it is one of us ... Last night it got out of the pod."
5. **Elevator key on panel** (north), then the **symbol sequence**: the rooms in escape order. Every door sign in the facility carries its area's symbol (shared in `art/symbols.js`), so the signs you walked under spell it out. **Biohazard** (quarantine sign), **flask** (chem lab), **lightning** (server room HIGH VOLTAGE), **snowflake** (cryo). Decoys: eye, radiation, skull, DNA.
6. **Ending:** in the elevator's steel you see the wristband on your own wrist: **SUBJECT HX-07**.

Hard mode: the notepad's top sheet is torn off, and the back of the photo just says "Lift override: retrace."

---

## Widget backlog (engine/puzzles/)
| widget | used in | status |
|---|---|---|
| keypad | R1 | ✅ |
| dials | R1 | ✅ |
| mixer | R2 | ✅ |
| rotate-grid | R3 | ✅ |
| password (terminal) | R2/R3 | ✅ |
| sliders | R4 | ✅ |
| clock | R5 | ✅ |
| sequence (symbols) | R5 | ✅ |
