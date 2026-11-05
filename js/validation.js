// Input validation + XSS-safe output helpers.
const V = {
  esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  },
  clean(s, max = 120) {
    return String(s || '').replace(/[<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, max);
  },
  email(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s); },
  phone(s) { return /^(\+27|0)[0-9]{9}$/.test(String(s).replace(/[\s-]/g, '')); },
  age(n) { n = Number(n); return Number.isInteger(n) && n >= 15 && n <= 35; },
  // Upload security: type, size, allowed formats.
  file(f) {
    const ok = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!f) return 'Please choose a file.';
    if (!ok.includes(f.type)) return 'Only PDF, JPG or PNG files are allowed.';
    if (f.size > 2 * 1024 * 1024) return 'File is too large. Maximum size is 2 MB.';
    return '';
  }
};
