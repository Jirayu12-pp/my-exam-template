const API_URL = 'http://localhost:5000/api';

// ตัวแประบุสถานะ: null = โหมดเพิ่มใหม่, มีค่า ID = โหมดแก้ไข
let editingId = null;

// ดึงข้อมูลมาแสดงทันทีเมื่อเปิด/รีเฟรชหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    loadCategories();
    loadItems();
});

// ------------------------------------------
// 0. ดึงรายการหมวดหมู่ (ตารางที่ 1) มาใส่ Dropdown
// ------------------------------------------
async function loadCategories() {
    try {
        const res = await fetch(`${API_URL}/categories`);
        const categories = await res.json();
        const select = document.getElementById('categorySelect');
        if (!select) return;

        select.innerHTML = '<option value="">-- เลือกหมวดหมู่ --</option>';
        categories.forEach(cat => {
            select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
        });
    } catch (err) {
        console.error('Error loading categories:', err);
    }
}

// ------------------------------------------
// 1. ดึงรายการทั้งหมดมาแสดงผล (READ)
// ------------------------------------------
async function loadItems() {
    try {
        const res = await fetch(`${API_URL}/items`);
        const items = await res.json();
        
        const container = document.getElementById('displayArea');
        if (!container) return;
        
        container.innerHTML = '';

        if (items.length === 0) {
            container.innerHTML = '<p>ยังไม่มีข้อมูลในระบบ</p>';
            return;
        }

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.style.cssText = 'border: 1px solid #ccc; padding: 12px; margin-top: 10px; border-radius: 8px; background: #fff;';
            
            card.innerHTML = `
                ${item.image_url ? `<img src="http://localhost:5000${item.image_url}" width="120" style="display:block; margin-bottom:10px; border-radius:4px;">` : '<p><i>ไม่มีรูปภาพ</i></p>'}
                <h4>${item.title}</h4>
                <p>${item.detail}</p>
                <div style="margin-top: 10px;">
                    <button type="button" onclick="editItem(${item.id})" style="background:#f39c12; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer; margin-right:5px;">แก้ไข</button>
                    <button type="button" onclick="deleteItem(${item.id})" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">ลบ</button>
                </div>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error('Error loading items:', err);
    }
}

// ------------------------------------------
// 2. บันทึกข้อมูล (รองรับทั้ง CREATE และ UPDATE)
// ------------------------------------------
async function sendData(event) {
    if (event) event.preventDefault();

    const titleInput = document.getElementById('titleInput');
    const detailInput = document.getElementById('detailInput');
    const categorySelect = document.getElementById('categorySelect');
    const imageInput = document.getElementById('imageInput');

    if (!titleInput || !titleInput.value.trim()) {
        alert('กรุณากรอกหัวข้อ');
        return;
    }

    const formData = new FormData();
    formData.append('title', titleInput.value);
    formData.append('detail', detailInput ? detailInput.value : '');
    if (categorySelect) formData.append('cat_id', categorySelect.value);

    if (imageInput && imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
    }

    // กำหนด URL และ Method ตามสภาวะ (เพิ่มใหม่ = POST, แก้ไข = PUT)
    let url = `${API_URL}/items`;
    let method = 'POST';

    if (editingId !== null) {
        url = `${API_URL}/items/${editingId}`;
        method = 'PUT';
    }

    try {
        const response = await fetch(url, {
            method: method,
            body: formData // ห้ามใส่ Header Content-Type เด็ดขาด
        });

        if (response.ok) {
            resetForm();
            loadItems();
        } else {
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    } catch (err) {
        console.error('Error sending data:', err);
    }
}

// ------------------------------------------
// 3. เตรียมข้อมูลเข้าฟอร์มเมื่อกดปุ่ม "แก้ไข" (EDIT)
// ------------------------------------------
async function editItem(id) {
    try {
        const res = await fetch(`${API_URL}/items`);
        const items = await res.json();
        const item = items.find(i => i.id === id);

        if (!item) return;

        // นำค่าเดิมมาใส่ในฟอร์ม
        document.getElementById('titleInput').value = item.title;
        document.getElementById('detailInput').value = item.detail;
        if (document.getElementById('categorySelect')) {
            document.getElementById('categorySelect').value = item.cat_id || '';
        }

        // เปลี่ยนสถานะเป็นโหมดแก้ไข
        editingId = id;
        document.getElementById('submitBtn').innerText = 'อัปเดตข้อมูล';
        document.getElementById('cancelBtn').style.display = 'inline-block';
    } catch (err) {
        console.error('Error fetching item for edit:', err);
    }
}

// ------------------------------------------
// 4. ยกเลิกโหมดแก้ไข และเคลียร์ฟอร์ม
// ------------------------------------------
function resetForm() {
    editingId = null;
    document.getElementById('titleInput').value = '';
    document.getElementById('detailInput').value = '';
    if (document.getElementById('categorySelect')) {
        document.getElementById('categorySelect').value = '';
    }
    document.getElementById('imageInput').value = '';
    
    document.getElementById('submitBtn').innerText = 'บันทึกข้อมูล';
    document.getElementById('cancelBtn').style.display = 'none';
}

// ------------------------------------------
// 5. ลบข้อมูล (DELETE)
// ------------------------------------------
async function deleteItem(id) {
    if (!confirm('ยืนยันการลบรายการนี้?')) return;

    try {
        const response = await fetch(`${API_URL}/items/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadItems();
        }
    } catch (err) {
        console.error('Error deleting item:', err);
    }
}