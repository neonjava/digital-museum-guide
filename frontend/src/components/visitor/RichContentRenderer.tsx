import React from 'react';
import { RichContentBlock } from '../../types';
import { Quote, Info, CheckCircle2 } from 'lucide-react';

interface RichContentRendererProps {
  blocks: RichContentBlock[];
}

export const RichContentRenderer: React.FC<RichContentRendererProps> = ({ blocks }) => {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className="space-y-5 my-6 text-museum-text">
      {blocks.map((block) => {
        switch (block.type) {
          case 'heading':
            return (
              <h3
                key={block.id}
                className="text-xl sm:text-2xl font-serif font-bold text-museum-primary pt-2 border-b border-museum-border/40 pb-2"
              >
                {block.content}
              </h3>
            );

          case 'paragraph':
            return (
              <p
                key={block.id}
                className="text-base sm:text-lg text-museum-text/90 leading-relaxed font-normal"
              >
                {block.content}
              </p>
            );

          case 'bullet_list':
            return (
              <ul key={block.id} className="space-y-2.5 my-3 pl-1">
                {block.items?.map((item, idx) => (
                  <li key={idx} className="flex items-start space-x-3 text-base text-museum-text/90">
                    <span className="w-2 h-2 rounded-full bg-museum-primary mt-2 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            );

          case 'image':
            return (
              <div key={block.id} className="my-5 rounded-2xl overflow-hidden border border-museum-border bg-white shadow-card">
                {block.imageUrl && (
                  <img
                    src={block.imageUrl}
                    alt={block.caption || 'Exhibit illustration'}
                    className="w-full max-h-96 object-cover"
                  />
                )}
                {block.caption && (
                  <p className="p-3 text-xs sm:text-sm text-museum-muted italic bg-museum-bg">
                    {block.caption}
                  </p>
                )}
              </div>
            );

          case 'quote':
            return (
              <div
                key={block.id}
                className="relative my-4 p-5 rounded-2xl bg-linear-to-r from-museum-light/70 to-museum-bg border-l-4 border-museum-primary text-museum-dark font-serif italic text-base sm:text-lg leading-relaxed shadow-xs"
              >
                <Quote className="w-8 h-8 text-museum-primary/20 absolute -top-2 right-4 pointer-events-none" />
                <p>{block.content}</p>
              </div>
            );

          case 'callout':
            return (
              <div
                key={block.id}
                className="my-4 p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-start space-x-3"
              >
                <Info className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                <div className="text-sm sm:text-base leading-relaxed">
                  {block.content}
                </div>
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
};
