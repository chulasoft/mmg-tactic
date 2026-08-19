# Magic Maidens — Gameplay Book

> **สถานะ:** Living gameplay document
> เอกสารนี้เก็บกติกาการเล่น Tutorial และการแปลง Story ให้เป็นสิ่งที่เกิดจริงบนกระดาน
> เนื้อเรื่องและ canon อยู่ใน [`STORY_BOOK.md`](STORY_BOOK.md)

---

# 1. Gameplay Rework Topics

หัวข้อที่จะรีเวิร์คตามลำดับโดยรวม:

1. Story Core
2. World Truth
3. Protagonist Core
4. ปริศนาของสมาชิกที่หายไป
5. บทบาทของฮีโร่ทั้งแปด
6. Main Story Arc
7. Chapter Structure
8. Story–Battle Integration
9. Core Combat
10. Card และ Action Economy
11. Hero Gameplay Identity
12. Enemies และ Objectives
13. Progression และผลของการแพ้
14. Loop / Memory Systems
15. UI, Presentation และ Game Feel

ตอนนี้กำลังทำข้อ 1–7 ในระดับ Act I และยังไม่ควรล็อก combat system ใหม่
ก่อนที่ Story และ Tutorial requirements จะชัดเจน

---

# 2. Scenario Framework

ทุก Chapter ที่มีการเล่นบนกระดานใช้โครงสร้างต่อไปนี้:

## 2.1 Scenario Prelude

- แนะนำสถานที่และสถานการณ์
- แสดงบทสนทนาก่อนเริ่ม
- ระบุ Initial Objective
- วางยูนิต จุดเริ่ม และองค์ประกอบแผนที่
- สอนข้อมูลใหม่เท่าที่จำเป็นสำหรับ Chapter นั้น

## 2.2 Battlefield Events

เหตุการณ์ระหว่างเล่นต้องมี trigger ที่ระบุชัด เช่น:

- `scenarioStart`
- `roundStart`
- `firstHeroSelected`
- `firstCardPlayed`
- `firstMove`
- `firstAttack`
- `objectiveProgress`
- `unitEnteredArea`
- `enemyDefeated`
- `allEnemiesDefeated`

Event สามารถ:

- แสดง narration หรือ dialogue
- หยุดและปลดล็อก input
- เปลี่ยน Objective
- spawn หรือถอนยูนิต
- เปลี่ยน terrain
- เปิด exit tile
- สอนระบบใหม่

## 2.3 Scenario Aftermath

- สรุปผลลัพธ์บนกระดาน
- เล่น exit หรือ transition sequence หากจำเป็น
- แสดงบทพูดหลังจบภารกิจ
- บันทึกผลลัพธ์และ optional objective
- ส่งผู้เล่นไป Chapter ต่อไป

---

# 3. Tutorial Principles

Act I สอนเกมผ่านสถานการณ์จริง ไม่ใช้ห้องฝึกแยกต่างหาก

## 3.1 กฎการสอน

1. สอนครั้งละหนึ่ง concept
2. อธิบาย Objective ก่อนสอน action
3. ให้ผู้เล่นทำ action จริง ไม่ใช้ข้อความอธิบายอย่างเดียว
4. Tutorial copy ต้องมาจากคำสั่งหรือการสังเกตของตัวละคร
5. หากต้องบังคับ action ต้องอธิบายเหตุผลในสถานการณ์
6. หลังทำสำเร็จให้ปล่อยผู้เล่นใช้ระบบนั้นอย่างอิสระ
7. หลีกเลี่ยงศัพท์ UI ใน narration แต่สามารถใช้ใน tutorial panel
8. Tutorial ต้องไม่เปิดเผยความจริงเกี่ยวกับ Arsenal หรือ timeline ก่อนเวลา

## 3.2 Layers ของ Objective

ทุก Scenario ควรสื่อ Objective สามระดับ:

1. **Narrative Objective** — เหตุผลในเรื่อง เช่น “เปิดทางไปยังลานกลางหมู่บ้าน”
2. **Rules Objective** — เงื่อนไขชนะ เช่น “Defeat all demons blocking the street”
3. **Board Communication** — สิ่งที่ผู้เล่นเห็น เช่น objective panel, enemy counter,
   exit highlight และพื้นที่เป้าหมาย

ผู้เล่นต้องสามารถตอบได้เสมอว่า:

- ตอนนี้ต้องทำอะไร
- ทำไมต้องทำ
- เหลืออีกเท่าไรจึงสำเร็จ
- มีเงื่อนไขแพ้หรือไม่

---

# 4. Prologue Gameplay — Party Selection at the Table

## 4.1 เป้าหมาย

เปลี่ยน party-selection screen ให้เป็น interactive story scene
ผู้เล่นเลือกสมาชิกสี่คนผ่านการมองและสนทนากับคนรอบโต๊ะ

## 4.2 Interaction Flow

1. เปิดด้วย narration และเสียงเรียก
2. แสดงโต๊ะประชุมโดยยังไม่แสดง roster เป็น grid เต็มรูปแบบ
3. เปิดจุดสนใจของตัวละครทีละตำแหน่ง
4. เมื่อผู้เล่นเลือกตัวละคร:
   - แสดง portrait
   - แสดงชื่อและ role แบบสั้น
   - เล่น introduction line เฉพาะตัว
   - เพิ่มตัวละครเข้าสู่ฉากประชุม
5. อนุญาตให้ยกเลิกและเลือกใหม่ก่อนยืนยัน
6. เมื่อครบสี่คน ให้บทสนทนาการประชุมดำเนินต่อโดยใช้สมาชิกที่เลือกจริง

## 4.3 Information Budget

ระหว่างเลือกควรแสดงเพียงข้อมูลที่จำเป็น:

- ชื่อ
- role
- จุดเด่นสั้น ๆ หนึ่งประโยค
- portrait
- น้ำเสียงผ่านบทพูด

ไม่ควรแสดง card list, growth table หรือ biography เต็ม เพราะจะทำลายจังหวะของฉาก
ข้อมูลเชิงลึกสามารถเปิดผ่าน Inspect หรือ Knowledge Base ภายหลัง

## 4.4 Protagonist Availability

ตัวเอกไม่เป็น playable unit ใน Chapter 1
เมื่อพยายามเรียก Arsenal จะเกิด scripted failure ก่อนเข้าสู่กระดาน
ความล้มเหลวนี้เป็น story state ไม่ใช่ mechanic ที่ผู้เล่นสามารถแก้ได้ใน Chapter 1

---

# 5. Chapter 1 — The First Impact

## 5.1 Scenario Role

Chapter 1 เป็น basic combat tutorial และต้องมีระบบน้อยที่สุดเท่าที่จำเป็น
ไม่เปิด Arsenal ไม่เปลี่ยน Objective กลางฉาก และไม่มี reinforcement event

## 5.2 Initial Setup

### Playable Units

- สมาชิกทีมสี่คนที่ผู้เล่นเลือกใน Prologue
- ตัวเอกไม่อยู่ในรายชื่อยูนิตที่เลือกบนกระดาน
- ตัวเอกปรากฏผ่าน portrait, commander dialogue หรือ narration เท่านั้น

### Battlefield

- พื้นที่ถนนหน้าโรงเตี๊ยม
- โรงเตี๊ยมอยู่ฝั่งซ้ายหรือเป็นฉากหลังของจุดเริ่มต้น
- เส้นทางออกไปลานกลางหมู่บ้านอยู่ขอบขวา
- ปีศาจกลุ่มเล็กยืนขวางถนน
- จำนวนกำแพงและสิ่งกีดขวางต้องไม่มากจนรบกวน Tutorial
- ต้องมองเห็นทิศทางของ exit ตั้งแต่เริ่ม Scenario แม้ยังใช้งานไม่ได้

### Initial Objective

> **CLEAR THE STREET**
> Defeat all demons blocking the road to the eastern square.

### Victory Condition

- ปีศาจที่กำหนดทั้งหมดถูกกำจัด

### Failure Condition

- สมาชิกทีมทั้งสี่ถูกกำจัด

### ไม่มีใน Chapter นี้

- ไม่มี playable Arsenal Mage
- ไม่มี Arsenal ability
- ไม่มี civilian units
- ไม่มี reinforcement
- ไม่มี objective change ระหว่างต่อสู้
- ไม่มี complex terrain hazard
- ไม่มี optional objective ที่ทำให้ผู้เล่นเสียสมาธิจาก Tutorial

## 5.3 Tutorial Sequence

### Step 1 — Understand the Objective

**เป้าหมาย:** ให้ผู้เล่นอ่านและเข้าใจ Objective ก่อนเริ่ม action

สิ่งที่ UI ต้องแสดง:

- Objective banner ตอนเปิด Scenario
- Objective panel ที่ยังดูซ้ำได้ตลอด
- จำนวนศัตรูที่เหลือ เช่น `Demons remaining: 4`
- การเน้นเส้นทางออกด้านขวาชั่วคราว
- ข้อความอธิบายว่าทางออกจะเปิดหลังเคลียร์ถนน

Tutorial completion condition:

- ผู้เล่นกดรับทราบ Objective หรือเปิด Objective panel ตาม flow ที่กำหนด

### Step 2 — Select a Hero

**เป้าหมาย:** สอนว่าต้องเลือกสมาชิกทีมก่อนออกคำสั่ง

- spotlight ฮีโร่ที่เหมาะกับการเริ่ม action
- อนุญาตให้เลือกยูนิตตามที่ Tutorial กำหนดในครั้งแรก
- หลังเลือก แสดง move/attack/card information ที่เกี่ยวข้อง

### Step 3 — Play a Card

**เป้าหมาย:** สอนว่าการ์ดเป็นส่วนหนึ่งของเทิร์น

- เน้นการ์ดที่เข้าใจง่าย
- อธิบายผลก่อนยืนยัน
- ให้ผู้เล่นเห็นการเปลี่ยนแปลงของ stat หรือ action ที่เกิดขึ้น

รายละเอียด card/action economy ใหม่ยังไม่ล็อก เอกสารนี้บันทึกเพียง requirement
ว่าผู้เล่นต้องเรียนรู้การใช้การ์ดใน Chapter 1

### Step 4 — Move

**เป้าหมาย:** สอน reachable tiles และสิ่งกีดขวาง

- แสดงช่องที่เดินได้
- ให้ผู้เล่นเลือก destination ที่กำหนดหรือหนึ่งในพื้นที่ที่ปลอดภัย
- อธิบายว่าศัตรูและกำแพงขวางการเคลื่อนที่

### Step 5 — Attack

**เป้าหมาย:** สอน attack range และ target selection

- แสดงเป้าหมายในระยะ
- ให้ผู้เล่นโจมตีศัตรูหนึ่งตัว
- แสดง damage, HP และผลของการกำจัดยูนิต

### Step 6 — End Turn

**เป้าหมาย:** สอนการส่งลำดับให้สมาชิกคนถัดไป

- เน้นปุ่ม End Turn
- แสดงว่าสมาชิกคนแรกทำ action จบแล้ว
- เลือกหรือแนะนำสมาชิกคนถัดไป

### Step 7 — Enemy Phase

**เป้าหมาย:** ให้ผู้เล่นเข้าใจว่าศัตรูเคลื่อนที่และโจมตีหลังทีมจบรอบ

- แสดง Enemy Phase banner
- เล่นศัตรูทีละตัว
- อธิบาย threat จาก movement และ range อย่างสั้น
- เริ่มรอบใหม่และคืน control ให้ผู้เล่น

หลัง Step 7 จบ Tutorial แบบบังคับจะสิ้นสุด ผู้เล่นจัดการศัตรูที่เหลือได้อย่างอิสระ

## 5.4 Battlefield Events

### C1-E1 — First Command

- **Trigger:** `scenarioStart`
- **Action:** Objective narration + tutorial spotlight
- **Content:** ตัวเอกสั่งให้ทีมเคลียร์ถนนและเปิดทางไปยังลานกลางหมู่บ้าน
- **Gameplay effect:** ล็อก board จนผู้เล่นรับทราบ Objective

### C1-E2 — Instinctive Coordination

- **Trigger:** ผู้เล่นทำ Card → Move → Attack sequence แรกสำเร็จ
- **Action:** บทพูดสั้นจากฮีโร่ที่ถูกเลือกและ internal narration ของตัวเอก
- **Gameplay effect:** ไม่มีการเปลี่ยนกติกา ไม่มี spawn และไม่หยุดเกมนาน
- **Purpose:** เชื่อม Tutorial กับความรู้สึกว่าทีมเคยฝึกร่วมกันมาก่อน

### C1-E3 — Street Cleared

- **Trigger:** `allEnemiesDefeated`
- **Action:** ปิด combat input, แสดง Objective Complete และเปิด exit sequence
- **Gameplay effect:** เปลี่ยน state จาก battle เป็น aftermath-on-board

## 5.5 Objective Communication

Objective panel ต้องมี:

- ชื่อ: `CLEAR THE STREET`
- คำอธิบาย: `Defeat all demons blocking the road to the eastern square.`
- progress: `0 / N defeated` หรือ `N remaining`
- exit indicator ทางขวา
- สถานะ `Road blocked` ระหว่างต่อสู้
- สถานะ `Road open` หลังชนะ

Objective panel ต้องเปิดดูซ้ำได้โดยไม่เสีย action

## 5.6 On-board Aftermath

หลังศัตรูตัวสุดท้ายถูกกำจัด เกมยังคงอยู่บนกระดาน:

1. แสดง `OBJECTIVE COMPLETE`
2. ล้าง threat และ combat highlight
3. ปลดล็อก exit tiles ทางขวา
4. แสดงชาวบ้านผู้ส่งข่าวเข้ามาทางขวาหรือแสดง portrait dialogue
5. เล่นข้อความว่า “ยังมีคนติดอยู่ที่ลานตะวันออก”
6. เริ่ม scripted team exit

## 5.7 Scripted Team Exit

ตัวละครทั้งสี่ออกทางด้านขวาทีละคน:

- ใช้ movement animation ปกติเพื่อรักษาความต่อเนื่อง
- หา path ไป exit โดยไม่ให้ผู้เล่นต้องสั่งทีละช่อง
- stagger การเริ่มเดินเพื่อไม่ให้ token ซ้อนกัน
- เมื่อถึง exit ให้ token fade หรือเดินพ้นขอบกระดาน
- กล้องหรือ board framing ควรเน้นทางออกเล็กน้อย
- ตัวเอกยังคงอยู่ใน commander layer ไม่ต้องสร้าง token
- เมื่อคนสุดท้ายออกจึง transition ไป Chapter Result

ถ้า path ถูกตำแหน่งยูนิตหรือซากกีดขวาง ระบบ exit ต้องสามารถจัดเส้นทางใหม่
หรือใช้ scripted path ที่รับประกันว่าไม่ติด

## 5.8 Chapter Result

หน้าสรุป Chapter 1 ควรแสดงเพียง:

- `The First Impact — Complete`
- สรุปว่าพื้นที่รอบโรงเตี๊ยมถูกเคลียร์
- จำนวนสมาชิกที่รอด
- ปุ่มดำเนินเรื่องต่อ

ยังไม่ควรมี:

- Arsenal unlock
- Weapon reveal
- Memory recovered banner
- Deck building
- ข้อมูลเรื่องผนึกหรือ timeline

เมื่อ Chapter 2 ยังไม่พร้อม ปุ่มดำเนินเรื่องต่อสามารถพาไปยังข้อความ
`Chapter 2 — In Development` หรือกลับ Campaign screen โดยไม่แต่งเนื้อเรื่องเพิ่มเติม

---

# 6. Future Act I Gameplay Direction

ข้อมูลส่วนนี้เป็น direction เท่านั้น ยังไม่ใช่รายละเอียดที่อนุมัติแล้ว:

- **Chapter 2:** ช่วยเหลือชาวบ้าน
- **Chapter 3:** คุ้มกันชาวบ้านไปยังเรือและอพยพขึ้นเรือ
- **Chapter 4:** ป้องกันเรือ ก่อนถูกบังคับเปลี่ยน Objective
  และให้สมาชิกทีมทยอยหลบหนีออกจากกระดาน
- **Act I climax:** เหตุการณ์ใหญ่หนึ่งครั้งก่อนเข้าสู่ Act II

ห้ามนำ direction เหล่านี้ไป implement เป็นรายละเอียดสมบูรณ์ก่อน Story review ราย Chapter
