document.addEventListener('DOMContentLoaded', async () => {
  const blocks = document.querySelectorAll('[data-include]');
  for (const host of blocks) {
    const src = host.getAttribute('data-include');
    // Кандидаты путей: как есть, без начального слэша, и с подъемом на уровень выше для внутренних страниц
    const candidates = [src];

    if (src.startsWith('/')) candidates.push(src.slice(1));              // убрать ведущий /
    if (src.startsWith('/components/')) candidates.push('../' + src.slice(1)); // ../components/...

    let done = false;
    for (const url of candidates) {
      try {
        const res = await fetch(url, { cache: 'no-store' });
        if (res.ok) {
          host.innerHTML = await res.text();
          done = true;
          break;
        }
      } catch (e) {}
    }
    if (!done) {
      console.warn('Include not found:', src);
      host.innerHTML = `<!-- include not found: ${src} -->`;
    }
  }
});
