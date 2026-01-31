const express = require('express');
const { Client } = require('pg');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;  // تحديد المنفذ

// إعداد bodyParser لاستقبال البيانات من النموذج
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// إعداد اتصال بقاعدة البيانات
const client = new Client({
    user: 'your_user',           // ضع اسم المستخدم لقاعدة البيانات
    host: 'your_host',           // ضع عنوان الخادم (يمكن أن يكون localhost أو عنوان Render)
    database: 'your_database',   // اسم قاعدة البيانات
    password: 'your_password',   // كلمة المرور
    port: 5432,                  // المنفذ الافتراضي لقاعدة PostgreSQL
});

client.connect();

// استلام البيانات عبر POST وإضافتها إلى قاعدة البيانات
app.post('/add-group', (req, res) => {
    const { groupName, groupLink } = req.body;  // استخراج البيانات من الطلب

    if (!groupName || !groupLink) {
        return res.status(400).json({ error: 'Please provide both group name and group link' });
    }

    const query = 'INSERT INTO groups(name, link) VALUES($1, $2)';
    
    client.query(query, [groupName, groupLink], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Failed to add group' });
        }
        res.json({ message: 'Group added successfully!' });
    });
});

// بدء السيرفر
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});