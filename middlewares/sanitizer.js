// Escape HTML special characters to prevent XSS
const escapeHtml = (str) => {
  if (typeof str !== 'string') return str;
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

export const sanitize = (req, res, next) => {
  // Escape every string value in body, query, and params
  for (const source of [req.body, req.query, req.params]) {
    if (!source) continue;
    for (const key in source) {
      source[key] = escapeHtml(source[key]);
    }
  }
  next();
};
