# My Exam Template

โปรเจกต์แม่แบบสำหรับการสอบ Full-stack Web Development
 การโคลน
# git clone <URL_GITHUB_ของคุณ>
# cd my-exam-template

## 🚀 วิธีการรัน Backend

1. เข้าไปยังโฟลเดอร์ backend:
   `cd backend`

2. ติดตั้ง Dependencies:
   `npm install`

3. สั่งรัน Server:
   `node server.js`

## 🌐 วิธีการรัน Frontend

เปิดไฟล์ `frontend/index.html` บน Web Browser
เชื่อมไฟล์ script.js เข้ากับ HTML
# <script src="script.js"></script>
# <link rel="stylesheet" href="style.css">


📋 4 จุดหลักที่ต้องปรับแก้ใน HTML 
1. เชื่อมไฟล์ JavaScript (script.js)
ไปที่บรรทัดล่างสุดของไฟล์ index.html  ก่อนปิดแท็ก </body> ให้เติมบรรทัดนี้ลงไป:

HTML
    <script src="script.js"></script>
</body>

2. ใส่ id ให้ตรงกับฟอร์มรับข้อมูล (<form>)
ไล่ดูช่องกรอกข้อมูลใน index.html  แล้วเติม id ให้ตรงกับที่ script.js ของเราใช้ดึงค่า:

Dropdown หมวดหมู่: ใส่ id="categorySelect"

HTML
<select id="categorySelect"> ... </select>
ช่องกรอกหัวข้อ/ชื่อ: ใส่ id="titleInput"

HTML
<input type="text" id="titleInput">
ช่องกรอกรายละเอียด: ใส่ id="detailInput"

HTML
<input type="text" id="detailInput">
ช่องเลือกรูปภาพ: ใส่ id="imageInput"

HTML
<input type="file" id="imageInput">
3. ปรับแต่งปุ่มกด (Button) และป้องกันหน้าเว็บรีเฟรช
ตรงฟอร์มบันทึกข้อมูลของอาจารย์ ให้ปรับแต่งปุ่มดังนี้:

ปุ่มบันทึก/อัปเดต: เปลี่ยนเป็น type="button", ใส่ id="submitBtn", และเรียก onclick="sendData(event)"

HTML
<button type="button" id="submitBtn" onclick="sendData(event)">บันทึกข้อมูล</button>
ปุ่มยกเลิกแก้ไข (สร้างเพิ่มถ้าของอาจารย์ไม่มี):

HTML
<button type="button" id="cancelBtn" onclick="resetForm()" style="display: none;">ยกเลิกแก้ไข</button>
4. กำหนดจุดแสดงรายการข้อมูล (Display Area)
มองหาพื้นที่หรือกล่องที่อาจารย์เตรียมไว้สำหรับโชว์รายการ/การ์ดสินค้า แล้วใส่ id="displayArea" ครอบไว้:

HTML
<!-- เอา id="displayArea" ไปใส่ตรงกล่องที่ต้องการให้รายการมาโชว์ -->
<div id="displayArea"></div>
🎨 เรื่องไฟล์ style.css ของอาจารย์
ถ้าอาจารย์ให้ไฟล์ style.css มาด้วย ให้เช็กดูที่ <head> ด้านบนสุดของ index.html ว่ามีบรรทัดนี้แล้วหรือยัง:

HTML
<link rel="stylesheet" href="style.css">
คุณไม่ต้องแก้ไขไฟล์ style.css เลยครับ ปล่อยให้มันแต่งหน้าเว็บตามดีไซน์ของอาจารย์ได้เลย
