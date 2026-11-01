const API_URL = 'http://localhost:5000/api/items';

// ดึงข้อมูลเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', loadData);

async function loadData() {
    try {
        const response = await fetch(API_URL);
        const items = await response.json();
        
        const container = document.getElementById('displayArea');
        container.innerHTML = '';

        items.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h4>${item.title}</h4>
                <p>${item.detail}</p>
                <button onclick="deleteData(${item.id})">ลบ</button>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error('Fetch error:', err);
    }
}

async function sendData() {
    const title = document.getElementById('titleInput').value;
    const detail = document.getElementById('detailInput').value;

    if (!title) return alert('กรุณากรอกหัวข้อ');

    try {
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, detail })
        });
        
        document.getElementById('titleInput').value = '';
        document.getElementById('detailInput').value = '';
        loadData();
    } catch (err) {
        console.error('Post error:', err);
    }
}

async function deleteData(id) {
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        loadData();
    } catch (err) {
        console.error('Delete error:', err);
    }
}