const API_URL = 'http://localhost:5000/api';

document.addEventListener('DOMContentLoaded', loadItems);
// 1. ดึง Dropdown ตารางหลัก
async function loadCategories() {
    const res = await fetch(`${API_URL}/categories`);
    const data = await res.json();
    const select = document.getElementById('categorySelect');
    if (!select) return;
    select.innerHTML = '';
    data.forEach(cat => {
        select.innerHTML += `<option value="${cat.id}">${cat.name}</option>`;
    });
}

// 2. ดึงข้อมูลตารางย่อยมาแสดง
async function loadItems() {
    const res = await fetch(`${API_URL}/items`);
    const data = await res.json();
    const container = document.getElementById('displayArea');
    if (!container) return;
    container.innerHTML = '';
    data.forEach(item => {
        container.innerHTML += `
            <div class="card">
                ${item.image_url ? `<img src="http://localhost:5000${item.image_url}" width="100">` : ''}
                <h4>${item.title}</h4>
                <p>${item.detail}</p>
                <button onclick="deleteItem(${item.id})">ลบ</button>
            </div>
        `;
    });
}

// 3. ส่งข้อมูลแบบมีไฟล์แนบ (FormData)
async function sendData() {
    const title = document.getElementById('titleInput').value;
    const detail = document.getElementById('detailInput').value;
    const cat_id = document.getElementById('categorySelect') ? document.getElementById('categorySelect').value : '';
    const imageFile = document.getElementById('imageInput').files[0];

    const formData = new FormData();
    formData.append('title', title);
    formData.append('detail', detail);
    formData.append('cat_id', cat_id);
    if (imageFile) formData.append('image', imageFile);

    await fetch(`${API_URL}/items`, {
        method: 'POST',
        body: formData // ห้ามใส่ Header Content-Type!
    });
    
    loadItems();
}

// 4. ลบข้อมูล
async function deleteItem(id) {
    await fetch(`${API_URL}/items/${id}`, { method: 'DELETE' });
    loadItems();
}
