const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// 1. ตรวจสอบและสร้างโฟลเดอร์ uploads อัตโนมัติ
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2. ตั้งค่า Multer เก็บรูปภาพ
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// 3. เปิด path ให้ดูรูปได้
app.use('/uploads', express.static(uploadDir));

// --- Data จำลอง 2 ตาราง ---
let categories = [
    { id: 1, name: 'ทั่วไป' },
    { id: 2, name: 'งานด่วน' }
];

let items = [];

// ==========================================
// 🔵 1. APIs ตารางที่ 1 (Categories)
// ==========================================
app.get('/api/categories', (req, res) => {
    res.json(categories);
});

app.post('/api/categories', (req, res) => {
    const newCat = { id: Date.now(), name: req.body.name };
    categories.push(newCat);
    res.status(201).json(newCat);
});

// ==========================================
// 🟢 2. APIs ตารางที่ 2 (Items - CRUD ครบชุด)
// ==========================================

// READ: ดึงรายการทั้งหมด
app.get('/api/items', (req, res) => {
    res.json(items);
});

// CREATE: เพิ่มข้อมูลใหม่พร้อมรูปภาพ
app.post('/api/items', upload.single('image'), (req, res) => {
    try {
        const newItem = {
            id: Date.now(),
            title: req.body.title || '',
            detail: req.body.detail || '',
            cat_id: req.body.cat_id || '',
            image_url: req.file ? `/uploads/${req.file.filename}` : ''
        };
        items.push(newItem);
        res.status(201).json(newItem);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// UPDATE: แก้ไขข้อมูลรายการตาม ID (PUT) 🟢 [แก้ไขแล้ว]
app.put('/api/items/:id', upload.single('image'), (req, res) => {
    try {
        // เปลี่ยนมาใช้ Number() เพื่อรองรับ Date.now() แน่นอน
        const targetId = Number(req.params.id);
        const index = items.findIndex(item => Number(item.id) === targetId);

        if (index !== -1) {
            items[index].title = req.body.title || items[index].title;
            items[index].detail = req.body.detail || items[index].detail;
            items[index].cat_id = req.body.cat_id || items[index].cat_id;
            
            // อัปเดตรูปใหม่เฉพาะเมื่อมีการอัปโหลดไฟล์ใหม่เข้ามา
            if (req.file) {
                items[index].image_url = `/uploads/${req.file.filename}`;
            }

            res.json(items[index]);
        } else {
            res.status(404).json({ message: 'Item not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// DELETE: ลบข้อมูลรายการตาม ID 🟢 [แก้ไขแล้ว]
app.delete('/api/items/:id', (req, res) => {
    const targetId = Number(req.params.id);
    items = items.filter(item => Number(item.id) !== targetId);
    res.json({ message: 'Deleted' });
});

app.listen(5000, () => console.log('Server running on http://localhost:5000'));