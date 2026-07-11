import { useEffect, useRef, useState } from 'react';

const FORMAT_OPTIONS = [
  { value: 'p', label: 'Texto normal' },
  { value: 'h3', label: 'Título 1' },
  { value: 'h4', label: 'Título 2' },
  { value: 'blockquote', label: 'Citação' },
];

const RichTextEditor = ({ value, onChange, placeholder, compact = false }) => {
  const ref = useRef(null);
  const [active, setActive] = useState({});
  const [menu, setMenu] = useState(null);

  useEffect(() => {
    const el = ref.current;
    if (el && document.activeElement !== el && el.innerHTML !== (value || '')) el.innerHTML = value || '';
  }, [value]);

  const emit = () => onChange(ref.current?.innerHTML || '');
  const refresh = () => setActive({
    bold: document.queryCommandState('bold'),
    italic: document.queryCommandState('italic'),
    underline: document.queryCommandState('underline'),
    strikeThrough: document.queryCommandState('strikeThrough'),
    insertUnorderedList: document.queryCommandState('insertUnorderedList'),
    insertOrderedList: document.queryCommandState('insertOrderedList'),
  });

  const execute = (command, argument = null) => {
    ref.current?.focus();
    if (command === 'createLink') {
      const url = window.prompt('URL do link (https://...)');
      if (!url) return;
      document.execCommand(command, false, url);
    } else {
      document.execCommand(command, false, argument);
    }
    emit();
    refresh();
    setMenu(null);
  };

  const Tool = ({ command, label, title, argument }) => (
    <button type="button" className={`rte-btn ${active[command] ? 'active' : ''}`} title={title} aria-pressed={Boolean(active[command])} onMouseDown={(event) => event.preventDefault()} onClick={() => execute(command, argument)}>{label}</button>
  );

  return (
    <div className={`rte ${compact ? 'compact' : ''}`}>
      <div className="rte-toolbar" onMouseDown={(event) => event.preventDefault()}>
        <div className="rte-menu-wrap">
          <button type="button" className={`rte-btn ${menu === 'format' ? 'active' : ''}`} title="Estilo do texto" onClick={() => setMenu(menu === 'format' ? null : 'format')}>T⌄</button>
          {menu === 'format' ? <div className="rte-menu"><span className="rte-menu-title">Estilo do texto</span>{FORMAT_OPTIONS.map((option) => <button key={option.value} type="button" onClick={() => execute('formatBlock', option.value)}>{option.label}</button>)}</div> : null}
        </div>
        <span className="rte-sep" />
        <Tool command="bold" label="B" title="Negrito (Ctrl+B)" />
        <Tool command="italic" label="I" title="Itálico (Ctrl+I)" />
        <Tool command="underline" label="U" title="Sublinhado (Ctrl+U)" />
        <span className="rte-sep" />
        <div className="rte-menu-wrap">
          <button type="button" className={`rte-btn ${menu === 'lists' ? 'active' : ''}`} title="Listas" onClick={() => setMenu(menu === 'lists' ? null : 'lists')}>☷⌄</button>
          {menu === 'lists' ? <div className="rte-menu"><span className="rte-menu-title">Listas</span><button type="button" onClick={() => execute('insertUnorderedList')}>Lista com marcadores</button><button type="button" onClick={() => execute('insertOrderedList')}>Lista numerada</button></div> : null}
        </div>
        <span className="rte-sep" />
        <Tool command="createLink" label="🔗" title="Inserir link" />
        <button type="button" className="rte-btn" title="Limpar formatação" onClick={() => execute('removeFormat')}>Limpar</button>
      </div>
      <div ref={ref} className="rte-area" contentEditable role="textbox" aria-multiline="true" data-placeholder={placeholder || 'Escreva o conteúdo...'} onInput={emit} onKeyUp={refresh} onMouseUp={refresh} onBlur={() => { emit(); refresh(); }} suppressContentEditableWarning />
    </div>
  );
};

export default RichTextEditor;
