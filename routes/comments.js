const express = require('express');
const { removeComments } = require('../utils/commentRemover');
const router = express.Router();

// POST endpoint untuk menghapus komentar
router.post('/remove-comments', (req, res) => {
  try {
    const { code, language, options = {} } = req.body;

    if (!code) {
      return res.status(400).json({
        error: 'Code is required'
      });
    }

    const result = removeComments(code, language, options);
    
    res.json({
      success: true,
      data: {
        cleanedCode: result.cleanedCode,
        stats: result.stats,
        detectedLanguage: result.detectedLanguage
      }
    });
  } catch (error) {
    console.error('Error removing comments:', error);
    res.status(500).json({
      error: 'Failed to remove comments',
      message: error.message
    });
  }
});

// GET endpoint untuk mendapatkan supported languages
router.get('/supported-languages', (req, res) => {
  const languages = {
    javascript: {
      name: 'JavaScript',
      lineComments: ['//'],
      blockComments: [['/*', '*/']]
    },
    python: {
      name: 'Python',
      lineComments: ['#'],
      blockComments: [['"""', '"""'], ["'''", "'''"]]
    },
    java: {
      name: 'Java',
      lineComments: ['//'],
      blockComments: [['/*', '*/']]
    },
    c: {
      name: 'C',
      lineComments: ['//'],
      blockComments: [['/*', '*/']]
    },
    cpp: {
      name: 'C++',
      lineComments: ['//'],
      blockComments: [['/*', '*/']]
    },
    csharp: {
      name: 'C#',
      lineComments: ['//'],
      blockComments: [['/*', '*/']]
    },
    php: {
      name: 'PHP',
      lineComments: ['//', '#'],
      blockComments: [['/*', '*/']]
    },
    ruby: {
      name: 'Ruby',
      lineComments: ['#'],
      blockComments: [['=begin', '=end']]
    },
    html: {
      name: 'HTML',
      blockComments: [['<!--', '-->']]
    },
    css: {
      name: 'CSS',
      lineComments: ['//'],
      blockComments: [['/*', '*/']]
    },
    sql: {
      name: 'SQL',
      lineComments: ['--'],
      blockComments: [['/*', '*/']]
    }
  };

  res.json({ languages });
});

module.exports = router;
