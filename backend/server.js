const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ข้อมูลจำลองในหน่วยความจำ (In-Memory Data)
let dataList = [
  { id: 1, title: 'Sample 1', detail: 'Detail 1' }
];

// GET: อ่านข้อมูลทั้งหมด
app.get('/api/items', (req, res) => {
  res.status(200).json(dataList);
});

// GET: อ่านข้อมูลรายตัวตาม ID
app.get('/api/items/:id', (req, res) => {
  const item = dataList.find(d => d.id === parseInt(req.params.id));
  if (!item) return res.status(404).json({ message: 'Not found' });
  res.status(200).json(item);
});

// POST: เพิ่มข้อมูล
app.post('/api/items', (req, res) => {
  const newItem = {
    id: Date.now(),
    title: req.body.title,
    detail: req.body.detail
  };
  dataList.push(newItem);
  res.status(201).json(newItem);
});

// DELETE: ลบข้อมูล
app.delete('/api/items/:id', (req, res) => {
  const id = parseInt(req.params.id);
  dataList = dataList.filter(item => item.id !== id);
  res.status(200).json({ message: 'Deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});