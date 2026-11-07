# The Hotel That Lost a Day: design

**Tone:** eerie and melancholic, with no jump scares. It begins as a charming hotel mystery (warm lamps, rain against the windows, an empty breakfast room) and gradually becomes impossible. The unsettling part is the hotel's quiet insistence that everything is perfectly normal, even as your own handwriting tells you otherwise.

**Premise:** you come down to reception to check out of **The Halcyon**. Your bill includes a day you cannot remember. The clerk has disappeared, and the front door opens back onto the hotel. In the guest register, your signature appears on the same date every year for thirty years. A note beside the desk reads: *"If you want to leave, find out what you asked us to keep."*

The hotel lets guests surrender a day they wish to forget. Yesterday you discovered that it also takes memories they never agreed to lose. You tried to stop it, and deliberately left yourself clues before the hotel reset. **Goal:** reconstruct yesterday, recover your missing memory, and check out.

**Central mechanic: yesterday and today.** Early on you find a camera with photographs taken yesterday. At set viewpoints you can switch between the photo and the present scene, and the differences are clues: a missing painting, a moved chair, writing that has been painted over. Later you learn to temporarily restore parts of a room to their past state. The past is one authored state per room, not a freely explorable timeline.
*Engine:* a scene can define `past` art. Once `canSeePast(g)` allows it (you have the camera), a **Yesterday / Today** button toggles the view: sepia, a photo border, and an orange date stamp. Hotspots have `era: 'present' | 'past' | 'both'`.

**Structure:** six rooms, three puzzles each. Each room has one fixed main scene plus close-ups.

## Design rules
- Each room contributes one clear fact about yesterday.
- Clues needed later are saved automatically in the **notebook** (engine: `g.note(id, text)`).
- Documents are short and purposeful; most solving happens visually.
- Important differences use shapes, text or positions as well as colour.
- No essential audio, no pixel hunting, no real-world knowledge.
- The clock creates atmosphere but never erases progress or forces a restart.

## Decisions made while building
- The hotel is called **The Halcyon** (a halcyon is a bird, like your swallow emblem; "halcyon days").
- Today is **7 November**; the lost day is **6 November**.
- **Guests and emblems** (the guests return in the breakfast room):

| Room | Emblem | Guest |
|---|---|---|
| 201 | fern | Mr & Mrs Vale |
| 202 | anchor | Capt. H. Orme |
| 203 | moon | Miss A. Ito |
| 204 | swallow | **you** (name blotted out everywhere) |
| 205 | bell | Dr. L. Brandt |
| 206 | fox | Mr K. Okonkwo |

- **Seeds planted for later:** the receipt says "Breakfast for two, table 3" (the breakfast room meeting) and "Consent: see original agreement" (the manager's office). Your booking card says you **arrived 6 November**, which contradicts the 30-year register (the room 5 reveal). The clock sits at two minutes to eleven and the minute hand never moves.
- Each room's three puzzles use different interaction types where possible: matching, ordering, reconstruction, and so on.
- Miss Ito's first name is **Aiko**. She wears a moon brooch and hums a waltz behind her door; she helped you, and is trapped herself.

## Rooms

### 1. Reception ✅ built
*Purpose:* find your room and establish that something is wrong. *Fact:* you have lost a day.
1. **Which room is yours?** Your booking card has a swallow emblem, but the room number is smudged ("2?4"). The **room chart** matches the swallow to **204**.
2. **The key drawer.** Four bags stand by reception, each with a tag (room, guest, departure time written in mixed formats) and a clasp shape. The porter's note: *"Set tomorrow's departures first, earliest to latest. Leave the guest with no departure until last."* Your bag has no departure. Enter the clasps in that order on the brass lock in the desk: triangle, diamond, circle, square. Inside are the **room 204 key** and **half a receipt**.
3. **The extra day.** The rest of the receipt is in the wastepaper basket, along with a scrap of another guest's receipt (two on hard). Rebuild it using the torn edges and the printed column lines. It reads *"6 Nov: One day surrendered, 0.00. Consent: see original agreement."* The calendar flips 7 → 6 → 7, and the corridor door unlocks with a soft bell.

Atmosphere: the front doors lead back into the hotel, the service bell rings a little too long, and 204's cubby in the key rack is empty.
Hard mode: randomised departure times (including afternoon ones) and clasp shapes, plus a second decoy scrap.

### 2. Room 204 ✅ built
*Purpose:* discover that yesterday's clues were left by you. *Fact:* you expected this, and prepared.
- **Corridor:** six doors with emblem plates (odd numbers on the left). The 204 key opens yours; the other doors have small sounds behind them.
- **The camera** lies on the bed, tagged in your own handwriting: *"LOOK AT THE PHOTOS."* Taking it unlocks the Yesterday view.
1. **Compare the photo with the room.** Four things changed: the **painting** of swallows above the bed is gone (only a pale patch is left), the **armchair** moved from the window to the wall, the **mirror** is now covered with a sheet (in the photo it shows *you*, holding the camera), and the **roses** have died. Clicking each one in the photo writes it in the notebook.
2. **The suitcase** has a picture lock and a tag: *"Only someone who saw yesterday can open this."* Press exactly the four things that changed (painting, mirror, flowers, chair); the lamp, bed, telephone and curtains are decoys. Inside is an envelope, *"For me. In order."*
3. **Your torn message.** Fragments end mid-sentence, so each piece leads into the next (5 fragments on easy, 6 on medium, 8 on hard): *"If you're reading this, it worked. The hotel took the day, but not me. Don't believe the register. The way out is behind the mirror. Lift the sheet and press the swallow."*
- **The mirror**, uncovered, shows the room **but not you**. Pressing the brass swallow on its frame releases a hidden service door in the wallpaper, but it jams against the armchair. Dragging the chair back to where it stood yesterday is the first taste of "restoring the past", and the service stairs lead down to the breakfast room.

### 3. Breakfast Room ✅ built
*Purpose:* reconstruct a meeting you have forgotten. *Fact:* other guests are trapped too, and one helped you.
You arrive down the service stairs. Four tables are laid for guests who never came down; a waltz plays behind the ballroom doors.
1. **Seating plan** (assign widget). The **reservation book** on the lectern gives tables (table 3: "room 204, for two", second name not given). The **kitchen order slips** on the spike give each room's order. **Yesterday's photo** shows what was eaten at each seat (click the plates to note them). Place the seven emblem cards on the plan: Vales (porridge ×2) at table 1; Orme (kippers) left and Brandt (black coffee) right at table 2; **you (boiled egg) and Miss Ito (tea with lemon)** at table 3; Okonkwo (full breakfast) at table 4. Restoring the seating **brings part of yesterday back**: the empty lost-property box fills.
2. **Lost property** (assign widget). Match five items to their owners: knitting with a fern-pattern scarf (Vales), a pipe with an anchor (Orme; pipe smoke behind 202 in the corridor), a moon brooch (Ito), a pen with a bell clip (Brandt; a pen scratching behind 205), a fox-head cane (Okonkwo). Each holds a note its owner wrote, because they're losing days too. Orme saw Ito send an envelope **up** in the service lift; Brandt says it has one button per room; Okonkwo says she pressed her **own room's** button.
3. **The service lift.** Call it from **203** to get Miss Ito's letter: *"The days aren't destroyed. They keep them, somewhere below the ballroom. The music opens the way. I've left you my dance card."* Wrong rooms send down small sad things. The **dance card** opens the ballroom doors.

### 4. Ballroom ✅ built
*Purpose:* learn how the hotel removes a day. *Fact:* the hotel stores surrendered days rather than destroying them.
Chandeliers, an empty dance floor, and a waltz looping its first eight bars. The steps chain strictly: music, then floor, then stage.
1. **The interrupted waltz.** The orchestrion's paper roll is cut into five pieces (order widget). A dotted melody line runs across the roll, so each piece's line ends where the next begins; the title piece ("Waltz No. 6") is first and "FINE" last. The hand-over heights were tuned to be clearly different. Restored, the waltz plays to the end for the first time and the dance floor clicks awake.
2. **The dance floor** (inert until the music plays). 5×5 tiles drawn in perspective, letters A–E along the front edge and numbers 1–5 up the side; click tiles to step on them. Miss Ito's dance card (kept after opening the door; Examine shows both sides) lists her steps: *Waltz: B2 B3 B4 C1 C5 D1 D5* (a crescent moon), plus Foxtrot and Tango decoys. Exactly the waltz tiles unlock the stage controls.
3. **The stage** (levers locked until the floor is solved). Levers for curtain (closed / half / open), backdrop (garden / sea / city / night) and lights (warm / blue+stars / red+stripes / off) change the stage live; the lights differ by pattern as well as colour, so the sepia photo stays readable. Match **yesterday's photo** (curtain open, sea in rain, blue starry lights) and the under-stage TRAP hatch opens.
- **The archive:** shelves of glass jars, each with a glowing light and a date/room label. One reads **6 NOV · 204** and is sealed: "Release on the Manager's authority only." A door marked **MANAGER** leads on.

### 5. Manager's Office
*Purpose:* discover the hotel's deception and your previous attempt. *Fact:* your thirty annual visits are fabricated; you arrived yesterday, and the hotel has been trying to convince you that you belong here.
Reconcile guest bills with surrendered-day records; decode the filing system to retrieve your original agreement; restore a mechanical calendar to yesterday, which opens the final room.

### 6. The Lost Day
*Purpose:* replay yesterday's decisive moments and escape. *Fact:* you originally came to forget something painful, but chose to keep your memories after discovering the cost.
Put recovered memories in sequence; distinguish your memories from those the hotel assigned you; use the true sequence to reverse the checkout mechanism and release the exit.

## Ending
The final mechanism restores the missing date to the hotel calendar. Morning arrives properly for the first time. Beyond reception's front door is a wet street with traffic and people. The final bill reads: *"Balance settled. Nothing forgotten."*
Optional: recover the other guests' days too, for a more hopeful completionist ending.

**Open question:** the final recovered memory (a farewell, an argument, a missed chance to say something). We'll decide once the tone is settled.
