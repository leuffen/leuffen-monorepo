export function markdownToHtml(input: string): string {
  let html = input.replace(
    /\*\*\*(.+?)\*\*\*/g,
    '<strong><em>$1</em></strong>',
  );
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  html = html.replace(/---/g, '<hr>');
  return html;
}

export function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

export function domReady(): Promise<void> {
  if (document.readyState !== 'loading') return Promise.resolve();

  return new Promise((resolve) => {
    document.addEventListener('DOMContentLoaded', () => resolve(), {
      once: true,
    });
  });
}
