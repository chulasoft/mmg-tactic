# Magic Maidens Rework — Work Instructions & Progress

> เอกสารนี้ใช้ควบคุมการรีเวิร์ค บันทึกสิ่งที่ตกลงแล้ว และระบุหัวข้อถัดไป
> เพื่อไม่ให้รายละเอียดจากการสนทนาสูญหายหรือถูก implement ก่อนผ่านการอนุมัติ

---

# 1. Document Responsibilities

## `STORY_BOOK.md`

เก็บเฉพาะ:

- Story Core และ theme
- World truth และ lore rules
- Protagonist/character core
- Act และ Chapter narrative
- Scenario Prelude
- เนื้อหาของ Battlefield Events ในเชิงเรื่อง
- Scenario Aftermath
- บทพูดและ tone
- รายการสิ่งที่เป็นหรือยังไม่เป็น canon

## `GAMEPLAY_BOOK.md`

เก็บเฉพาะ:

- Core gameplay requirements
- Scenario rules
- Objective และ failure condition
- Tutorial flow
- Event triggers/actions
- Board transition
- สิ่งที่ผู้เล่นทำและ UI ที่ต้องสื่อสาร
- Acceptance criteria สำหรับ implementation

## `WORK_INSTRUCTIONS.md`

เก็บเฉพาะ:

- สถานะการรีเวิร์ค
- Decisions ที่อนุมัติแล้ว
- Open questions
- หัวข้อถัดไป
- Change log ของเอกสาร

---

# 2. Working Rules

1. ทำงานทีละหัวข้อ ไม่เปิดหลายระบบพร้อมกันโดยไม่จำเป็น
2. เริ่มจาก Story Core ก่อน แล้วจึงออกแบบ Mechanics ให้รองรับ Story
3. จำนวน Chapter ทั้งเกมยังเปิดอยู่ ห้ามบังคับเรื่องให้จบในแปด Chapter
4. แต่ละ Chapter ต้องแยก Prelude, Battlefield Events และ Aftermath
5. Story Book กับ Gameplay Book ต้องไม่คัดลอกหน้าที่กัน
6. สิ่งที่ผู้สร้างระบุว่า “เอาแค่นี้ก่อน” ต้องหยุดที่ขอบเขตนั้น
7. ห้ามเติม lore สำคัญเองโดยไม่ทำเครื่องหมายว่าเป็น proposal
8. Direction ในอนาคตไม่เท่ากับ approved detail
9. เมื่อ Chapter ผ่านการอนุมัติ จึงแตกเป็น implementation tasks
10. เมื่อนำไป implement ต้องอัปเดตเอกสารว่า `Designed` หรือ `Implemented`

---

# 3. Status Vocabulary

- **Idea** — แนวคิดที่เพิ่งเสนอ ยังเปลี่ยนได้ทั้งหมด
- **Direction** — เห็นด้วยกับทิศทาง แต่ยังไม่มีรายละเอียด
- **Drafted** — เขียนรายละเอียดรอบแรกแล้ว รอแก้
- **Approved** — ผู้สร้างยืนยันรายละเอียดแล้ว
- **Implementation Ready** — มี rules, content และ acceptance criteria เพียงพอ
- **Implemented** — อยู่ใน source code และผ่านการตรวจสอบ

---

# 4. Current Progress

| Area | Status | Notes |
|---|---|---|
| Story Core | Direction | Loop + partial memory + erased sacrifices |
| Protagonist Core | Direction | Young female Arsenal Mage, team leader, initially weak |
| World Truth | Idea | สมาชิกบางคนเสียสละ existence เพื่อผนึกจอมมาร |
| Campaign Length | Open | ไม่กำหนดจำนวน Chapter ทั้งเกม |
| Act I Structure | Direction | Tutorial through story, ends with a climax before Act II |
| Prologue — The Table | Drafted | รอเลือก opening voice line และเขียนบทพูดเฉพาะฮีโร่ |
| Chapter 1 — The First Impact | Drafted | Basic combat + Objective tutorial, no Arsenal |
| Chapter 2 | Direction | ช่วยเหลือชาวบ้าน |
| Chapter 3 | Direction | พาชาวบ้านหนีขึ้นเรือ |
| Chapter 4 | Direction | เรือถูกโจมตีและ Objective เปลี่ยนเป็นทยอยหนี |
| Combat Rework | Not started | รอ Story/Tutorial requirements เพิ่มเติม |
| Card Rework | Not started | รอ Core Combat decision |

---

# 5. Approved Decisions to Preserve

## Story

- ตัวเอกเป็นหญิงสาวและเป็น Arsenal Mage
- ตัวเอกเป็นหัวหน้าทีม
- ตอนเริ่มเรื่องตัวเอกมีพลังต่ำมาก
- ความทรงจำกลับมาเพียงบางส่วนและทยอยเปิดตาม Chapter
- เรื่องใช้แกนการย้อนกลับของเวลา
- สมาชิกบางคนเสียสละร่าง จิตวิญญาณ และการรับรู้ถึงตัวตน
  เพื่อใช้เป็นส่วนหนึ่งของผนึกจอมมาร
- อาวุธของผู้ที่ไม่อยู่ถูกเก็บใน Arsenal แต่ตัวเอกยังจำและรับรู้ไม่ได้ในตอนเริ่ม
- Prologue และ Chapter 1 ยังไม่เปิดเผยข้อมูลอาวุธเหล่านั้น

## Act I

- Act I เน้น Tutorial ผ่านการเล่าเรื่อง
- Act I จบด้วยไคลแมกซ์หนึ่งเหตุการณ์ก่อน Act II
- ยังไม่ล็อกจำนวน Chapter ทั้งเกม

## Prologue

- เปิดด้วยเสียงเรียกให้ตัวเอกกลับไปยังสถานที่ที่จากมา
- ห้ามใช้ “They’re waiting for you.”
- การเลือกสมาชิกทีมต้องกลืนไปกับฉากประชุมบนโต๊ะ
- ไม่อธิบายสถานะภายใน Arsenal ในบทเปิด
- เมื่อพยายามเรียก Arsenal ตัวเอกปวดศีรษะและไม่สามารถดึงอาวุธออกมาได้
- ทีมสี่คนจึงออกไปต่อสู้ก่อนโดยไม่มีตัวเอกเป็น playable unit

## Chapter 1

- ชื่อ `The First Impact`
- ไม่มีการเปิด Arsenal
- ปีศาจกลุ่มเล็กอยู่บนถนนหน้าโรงเตี๊ยม
- ปีศาจปิดเส้นทางไปลานกลางหมู่บ้าน
- ตัวเอกสั่งให้ทีมเคลียร์พื้นที่
- Tutorial ต้องสอนการทำความเข้าใจ Objective เพิ่มจาก basic combat flow
- ไม่มี Arsenal event
- ไม่มี reinforcement/“More Are Coming” event
- Aftermath สรุปว่าเคลียร์พื้นที่หน้าโรงเตี๊ยมสำเร็จ
- ชาวบ้านเข้ามาบอกว่า “ยังมีคนติดอยู่ที่ลานตะวันออก”
- สมาชิกทั้งสี่เดินออกทางขวาของกระดานจริงก่อนจบ Chapter

---

# 6. Open Decisions

## ทำต่อทันทีในรอบ Chapter 1 ได้

- เลือกประโยคเสียงเรียกฉบับสุดท้าย
- กำหนดรูปแบบภาพของฉากโต๊ะ
- เขียน party-selection dialogue สำหรับฮีโร่ทั้งแปด
- กำหนดจำนวนและชนิดของศัตรูใน Chapter 1
- ร่างแผนที่ Chapter 1 ให้รองรับ Tutorial และ exit sequence
- ตัดสิน Tutorial strictness ว่าบังคับเป้าหมายแรกมากเพียงใด

## รอการคุย Chapter 2

- จำนวนชาวบ้านที่ต้องช่วย
- civilian movement rules
- fire/hazard rules
- ผลของการช่วยไม่ครบ
- การเชื่อมแผนที่จาก Chapter 1 ไป Chapter 2

## รอภายหลัง

- จำนวน Chapter ทั้งหมด
- รายละเอียด Act II
- Arsenal combat kit
- Weapon Formation system
- การ์ดแบบใหม่
- กฎของ loop และราคาของการย้อนเวลาแบบสมบูรณ์
- รายชื่อและตัวตนของสมาชิกที่ถูกลบ

---

# 7. Recommended Next Review

ทำ **Chapter 1 Pass 2** ก่อนเริ่ม Chapter 2 โดยไล่ตามลำดับ:

1. Final opening voice line
2. รายชื่อฮีโร่ที่สามารถปรากฏรอบโต๊ะและบทพูดแนะนำ
3. Full Prologue dialogue
4. Chapter 1 map sketch
5. Tutorial prompts
6. Chapter 1 enemy composition
7. Full Prelude/Event/Aftermath script

เมื่อทั้งเจ็ดข้อผ่านการอนุมัติ จึงเปลี่ยน Chapter 1 เป็น `Implementation Ready`

---

# 8. Change Log

## 2026-08-19 — Initial Rework Documents

- สร้าง Rework Hub
- แยก Story Book และ Gameplay Book
- บันทึก Story/Protagonist Core ที่คุยไว้
- เปิดจำนวน Chapter ให้ยืดหยุ่นแบบ scenario campaign
- ร่าง Prologue — The Table ใหม่
- เปลี่ยน opening voice ให้สื่อถึงการกลับไปยังจุดเริ่มต้น
- ผสาน party selection เข้ากับการประชุม
- ปิดข้อมูล Arsenal ใน Prologue และ Chapter 1
- ร่าง Chapter 1 — The First Impact แบบละเอียด
- เพิ่ม Objective tutorial และ scripted exit ทางขวาของกระดาน
