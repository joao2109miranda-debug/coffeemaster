import { useEffect, useRef } from 'react';

// Editor rich-text simples (estilo fórum) sobre contentEditable.
// value = HTML · onChange(html)
const TOOLS = [
  { cmd: 'bold', label: 'B', title: 'Negrito', style: { fontWeight: 700 } },
  { cmd: 'italic', label: 'I', title: 'Itálico', style: { fontStyle: 'italic' } },
  { cmd: 'underline', label: 'U', title: 'Sublinhado', style: { textDecoration: 'underline' } },
  { cmd: 'strikeThrough', label: 'S', title: 'Tachado', style: { textDecoration: 'line-through' } },
  { sep: true },
  { cmd: 'formatBlock', arg: 'blockquote', label: '❝', title: 'Citação' },
  { cmd: 'insertUnorderedList', label: '• Lista', title: 'Lista' },
  { cmd: 'insertOrderedList', label: '1. Lista', title: 'Lista numerada' },
  { cmd: 'insertHorizontalRule', label: '―', title: 'Divisória' },
  { sep: true },
  { cmd: 'createLink', label: '🔗', title: 'Link' },
  { cmd: 'removeFormat', label: '⨯', title: 'Limpar formatação' },
];

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const ref = useRef(null);

  // Inicializa / sincroniza quando o valor externo muda (ex.: editar outro post, reset).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (document.activeElement !== el && el.innerHTML !== (value || '')) {
      el.innerHTML = value || '';
    }
  }, [value]);

  const emit = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  const exec = (tool) => {
    if (tool.sep) return;
    ref.current?.focus();
    if (tool.cmd === 'createLink') {
      // eslint-disable-next-line no-alert
      const url = window.prompt('URL do link (https://...)');
      if (!url) return;
      document.execCommand('createLink', false, url);
    } else if (tool.cmd === 'formatBlock') {
      document.execCommand('formatBlock', false, tool.arg);
    } else {
      document.execCommand(tool.cmd, false, null);
    }
    emit();
  };

  return (
    <div className="rte">
      <div className="rte-toolbar">
        {TOOLS.map((t, i) =>
          t.sep ? (
            <span key={i} className="rte-sep" />
          ) : (
            <button
              key={i}
              type="button"
              className="rte-btn"
              title={t.title}
              style={t.style}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => exec(t)}
            >
              {t.label}
            </button>
          )
        )}
      </div>
      <div
        ref={ref}
        className="rte-area"
        contentEditable
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder || 'Escreva o conteúdo...'}
        onInput={emit}
        onBlur={emit}
        suppressContentEditableWarning
      />
    </div>
  );
};

export default RichTextEditor;
