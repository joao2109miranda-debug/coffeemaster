import DOMPurify from 'dompurify';

// Tags/atributos permitidos no conteúdo rico dos posts.
const CONFIG = {
  ALLOWED_TAGS: [
    'b', 'strong', 'i', 'em', 'u', 's', 'strike',
    'p', 'br', 'hr', 'ul', 'ol', 'li', 'blockquote',
    'h3', 'h4', 'a', 'span',
  ],
  ALLOWED_ATTR: ['href', 'target', 'rel'],
  ALLOWED_URI_REGEXP: /^(?:https?:|mailto:|\/|#)/i,
};

// Garante que links abram com segurança (sem window.opener).
if (typeof window !== 'undefined' && DOMPurify.addHook) {
  DOMPurify.addHook('afterSanitizeAttributes', (node) => {
    if (node.tagName === 'A' && node.getAttribute('href')) {
      node.setAttribute('target', '_blank');
      node.setAttribute('rel', 'noopener noreferrer nofollow');
    }
  });
}

// Sanitiza HTML já formatado (usado ao salvar e ao renderizar conteúdo rico).
export const sanitizeHtml = (html) => DOMPurify.sanitize(html || '', CONFIG);

// Converte conteúdo do banco em HTML seguro para exibição.
// - Conteúdo antigo em texto puro: escapa e preserva quebras de linha.
// - Conteúdo novo em HTML: apenas sanitiza.
export const toSafeHtml = (content) => {
  const str = content || '';
  const looksHtml = /<[a-z][\s\S]*>/i.test(str);
  if (looksHtml) return sanitizeHtml(str);
  const escaped = str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
  return sanitizeHtml(escaped);
};

// Remove QUALQUER tag — para campos que devem ser texto puro (ex.: nome, resumo).
export const stripTags = (text) =>
  DOMPurify.sanitize(text || '', { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
