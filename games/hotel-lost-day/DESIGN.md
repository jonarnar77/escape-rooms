# The Hotel That Lost a Day: design

**Tone:** eerie and melancholic, with no jump scares. It begins as a charming hotel mystery (warm lamps, rain against the windows, an empty breakfast room) and gradually becomes impossible. The unsettling part is the hotel's quiet insistence that everything is perfectly normal, even as your own handwriting tells you otherwise.

**Premise:** you come down to reception to check out of **The Halcyon**. Your bill includes a day you cannot remember. The clerk has disappeared, and the front door opens back onto the hotel. In the guest register, your signature appears on the same date every year for thirty years. A note beside the desk reads: *"If you want to leave, find out what you asked us to keep."*

The hotel lets guests surrender a day they wish to forget. Yesterday you discovered that it also takes memories they never agreed to lose. You tried to stop it, and deliberately left yourself clues before the hotel reset. **Goal:** reconstruct yesterday, recover your missing memory, and check out.

**Central mechanic: yesterday and today.** Early on you find a camera with photographs taken yesterday. At set viewpoints you can switch between the photo and the present scene, and the differences are clues: a missing painting, a moved chair, writing that has been painted over. Later you learn to temporarily restore parts of a room to their past state. The past is one authored state per room, not a freely explorable timeline. *(Engine work for this starts in room 2.)*

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

## Rooms

### 1. Reception ✅ built
*Purpose:* find your room and establish that something is wrong. *Fact:* you have lost a day.
1. **Which room is yours?** Your booking card has a swallow emblem, but the room number is smudged ("2?4"). The **room chart** matches the swallow to **204**.
2. **The key drawer.** Four bags stand by reception, each with a tag (room, guest, departure time written in mixed formats) and a clasp shape. The porter's note: *"Set tomorrow's departures first, earliest to latest. Leave the guest with no departure until last."* Your bag has no departure. Enter the clasps in that order on the brass lock in the desk: triangle, diamond, circle, square. Inside are the **room 204 key** and **half a receipt**.
3. **The extra day.** The rest of the receipt is in the wastepaper basket, along with a scrap of another guest's receipt (two on hard). Rebuild it using the torn edges and the printed column lines. It reads *"6 Nov: One day surrendered, 0.00. Consent: see original agreement."* The calendar flips 7 → 6 → 7, and the corridor door unlocks with a soft bell.

Atmosphere: the front doors lead back into the hotel, the service bell rings a little too long, and 204's cubby in the key rack is empty.
Hard mode: randomised departure times (including afternoon ones) and clasp shapes, plus a second decoy scrap.

### 2. Your Room
*Purpose:* discover that yesterday's clues were left by you.
Compare a photograph with the present room; use the differences to open your suitcase; arrange fragments of your own message to locate a hidden service-door release. *(The camera is found here.)*

### 3. Breakfast Room
*Purpose:* reconstruct a meeting you have forgotten. *Fact:* other guests are trapped too, and one helped you.
Restore the seating from reservations and meal orders; match guests to the items they left behind; use their accounts to identify who passed you a message, and recover it from a dumbwaiter.

### 4. Ballroom
*Purpose:* learn how the hotel removes a day. *Fact:* the hotel stores surrendered days rather than destroying them.
Reconstruct the order of an interrupted performance; reproduce a dance-floor pattern with clickable tiles; operate the stage apparatus to reveal a concealed memory archive.

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
