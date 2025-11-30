# comment-removal

Struktur Project

```
comment-removal/
├── package.json
├── server.js
├── routes/
│   └── comments.js
├── utils/
│   └── commentRemover.js
└── public/
    └── index.html
```

Fitur Backend

1. RESTful API dengan endpoint untuk menghapus komentar
2. Auto-detection language berdasarkan signature kode
3. Support multiple languages: JavaScript, Python, Java, C++, C#, PHP, Ruby, HTML, CSS, SQL
4. Statistics tentang proses pembersihan
5. Error handling yang robust
6. CORS enabled untuk frontend integration

API Endpoints

- POST /api/remove-comments - Menghapus komentar dari kode
- GET /api/supported-languages - Mendapatkan daftar bahasa yang didukung
- GET /health - Health check endpoint
