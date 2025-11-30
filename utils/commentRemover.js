class CommentRemover {
  constructor() {
    this.languagePatterns = {
      javascript: {
        lineComments: ['//'],
        blockComments: [['/*', '*/']],
        stringDelimiters: ['"', "'", '`']
      },
      python: {
        lineComments: ['#'],
        blockComments: [['"""', '"""'], ["'''", "'''"]],
        stringDelimiters: ['"', "'"]
      },
      java: {
        lineComments: ['//'],
        blockComments: [['/*', '*/']],
        stringDelimiters: ['"', "'"]
      },
      c: {
        lineComments: ['//'],
        blockComments: [['/*', '*/']],
        stringDelimiters: ['"', "'"]
      },
      cpp: {
        lineComments: ['//'],
        blockComments: [['/*', '*/']],
        stringDelimiters: ['"', "'"]
      },
      csharp: {
        lineComments: ['//'],
        blockComments: [['/*', '*/']],
        stringDelimiters: ['"', "'"]
      },
      php: {
        lineComments: ['//', '#'],
        blockComments: [['/*', '*/']],
        stringDelimiters: ['"', "'"]
      },
      ruby: {
        lineComments: ['#'],
        blockComments: [['=begin', '=end']],
        stringDelimiters: ['"', "'"]
      },
      html: {
        blockComments: [['<!--', '-->']],
        stringDelimiters: ['"', "'"]
      },
      css: {
        lineComments: ['//'],
        blockComments: [['/*', '*/']],
        stringDelimiters: ['"', "'"]
      },
      sql: {
        lineComments: ['--'],
        blockComments: [['/*', '*/']],
        stringDelimiters: ['"', "'"]
      }
    };
  }

  detectLanguage(code) {
    const signatures = {
      javascript: [/function\s*\w*\s*\(/, /const\s|let\s|var\s/, /console\.log/],
      python: [/def\s+\w+\s*\(/, /import\s+\w+/, /print\(/],
      java: [/public\s+class/, /private\s+\w+/, /System\.out\.print/],
      c: [/#include\s+<[\w.]+>/, /int\s+main\s*\(/],
      cpp: [/#include\s+<[\w.]+>/, /using\s+namespace/],
      csharp: [/using\s+System/, /namespace\s+\w+/],
      php: [/<\?php/, /\$\w+\s*=/],
      ruby: [/def\s+\w+/, /puts\s+/],
      html: [/<!DOCTYPE html>/, /<html>/, /<head>/],
      css: [/{|}/, /\.\w+\s*{/],
      sql: [/SELECT\s+.+FROM/, /INSERT\s+INTO/]
    };

    let maxMatches = 0;
    let detectedLanguage = 'javascript'; // default

    for (const [lang, patterns] of Object.entries(signatures)) {
      let matches = 0;
      for (const pattern of patterns) {
        if (pattern.test(code)) {
          matches++;
        }
      }
      if (matches > maxMatches) {
        maxMatches = matches;
        detectedLanguage = lang;
      }
    }

    return detectedLanguage;
  }

  removeComments(code, language = 'auto', options = {}) {
    const {
      removeLineComments = true,
      removeBlockComments = true,
      preserveLicenseHeaders = true
    } = options;

    // Auto-detect language jika diperlukan
    const detectedLanguage = language === 'auto' ? 
      this.detectLanguage(code) : language;

    if (!this.languagePatterns[detectedLanguage]) {
      throw new Error(`Unsupported language: ${detectedLanguage}`);
    }

    const patterns = this.languagePatterns[detectedLanguage];
    let cleanedCode = code;
    let stats = {
      originalLength: code.length,
      removedLineComments: 0,
      removedBlockComments: 0,
      totalRemoved: 0
    };

    // Remove block comments
    if (removeBlockComments && patterns.blockComments) {
      for (const [start, end] of patterns.blockComments) {
        const blockCommentRegex = new RegExp(
          `${this.escapeRegex(start)}[\\s\\S]*?${this.escapeRegex(end)}`,
          'g'
        );
        
        const beforeLength = cleanedCode.length;
        cleanedCode = cleanedCode.replace(blockCommentRegex, '');
        stats.removedBlockComments += (beforeLength - cleanedCode.length);
      }
    }

    // Remove line comments
    if (removeLineComments && patterns.lineComments) {
      for (const lineComment of patterns.lineComments) {
        const lineCommentRegex = new RegExp(
          `${this.escapeRegex(lineComment)}.*$`,
          'gm'
        );
        
        const beforeLength = cleanedCode.length;
        cleanedCode = cleanedCode.replace(lineCommentRegex, '');
        stats.removedLineComments += (beforeLength - cleanedCode.length);
      }
    }

    // Clean up empty lines
    cleanedCode = cleanedCode.replace(/^\s*[\r\n]/gm, '');
    
    stats.totalRemoved = stats.removedLineComments + stats.removedBlockComments;
    stats.finalLength = cleanedCode.length;
    stats.reductionPercentage = ((stats.totalRemoved / stats.originalLength) * 100).toFixed(2);

    return {
      cleanedCode: cleanedCode.trim(),
      stats,
      detectedLanguage
    };
  }

  escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}

const commentRemover = new CommentRemover();

function removeComments(code, language = 'auto', options = {}) {
  return commentRemover.removeComments(code, language, options);
}

module.exports = { removeComments, CommentRemover };
