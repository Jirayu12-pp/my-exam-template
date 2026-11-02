const API_URL = 'http://localhost:5000/api';

// ดึงข้อมูลมาแสดงทันทีเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', loadItems);

// 1. ดึงรายการทั้งหมดมาแสดงผล (READ)
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
            card.style.cssText = 'border: 1px solid #ccc; padding: 10px; margin-top: 10px; border-radius: 8px;';
            
            card.innerHTML = `
                ${item.image_url ? `<img src="http://localhost:5000${item.image_url}" width="150" style="display:block; margin-bottom:10px; border-radius:4px;">` : '<p><i>ไม่มีรูปภาพ</i></p>'}
                <h4>${item.title}</h4>
                <p>${item.detail}</p>
                <button type="button" onclick="deleteItem(${item.id})" style="background:#e74c3c; color:white; border:none; padding:5px 10px; border-radius:4px; cursor:pointer;">ลบ</button>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error('Error loading items:', err);
    }
}

// 2. บันทึกข้อมูลและอัปโหลดรูปภาพ (CREATE)
async function sendData(event) {
    // ป้องกันการ Refresh หน้าเว็บอัตโนมัติจากฟอร์ม
    if (event) {
        event.preventDefault();
    }

    const titleInput = document.getElementById('titleInput');
    const detailInput = document.getElementById('detailInput');
    const imageInput = document.getElementById('imageInput');

    if (!titleInput || !titleInput.value.trim()) {
        alert('กรุณากรอกหัวข้อ');
        return;
    }

    // สร้าง FormData เพื่อส่งรูปภาพและข้อความ
    const formData = new FormData();
    formData.append('title', titleInput.value);
    formData.append('detail', detailInput ? detailInput.value : '');
    
    if (imageInput && imageInput.files[0]) {
        formData.append('image', imageInput.files[0]);
    }

    try {
        const response = await fetch(`${API_URL}/items`, {
            method: 'POST',
            body: formData // ห้ามใส่ Header Content-Type!
        });

        if (response.ok) {
            // เคลียร์ค่าในฟอร์มหลังบันทึกสำเร็จ
            titleInput.value = '';
            if (detailInput) detailInput.value = '';
            if (imageInput) imageInput.value = '';

            // โหลดตารางแสดงผลใหม่
            loadItems();
        } else {
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
        }
    } catch (err) {
        console.error('Error sending data:', err);
    }
}

// 3. ลบข้อมูล (DELETE)
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