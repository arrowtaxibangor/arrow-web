// components/DynamicPage/AdCodeSection.tsx
'use client';
import { useEffect, useRef } from 'react';

export default function AdCodeSection({ html }: { html: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || !html) return;

    container.innerHTML = '';

    // Parse the HTML string into a temp element
    const template = document.createElement('div');
    template.innerHTML = html;

    // Re-create each child so scripts actually execute
    Array.from(template.childNodes).forEach((node) => {
      if (node.nodeName === 'SCRIPT') {
        const script = document.createElement('script');
        const el = node as HTMLScriptElement;

        // Copy attributes (async, src, data-*, etc.)
        Array.from(el.attributes).forEach((attr) => {
          script.setAttribute(attr.name, attr.value);
        });

        script.textContent = el.textContent;
        container.appendChild(script);
      } else {
        container.appendChild(document.importNode(node, true));
      }
    });
  }, [html]);

  return (
    <div className="w-full flex justify-center">
      <div ref={containerRef} />
    </div>
  );
}
