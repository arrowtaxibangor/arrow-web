import type { CmsPage } from '@/lib/supabase/cms';
import AdCodeSection from '@/components/DynamicPage/AdCodeSection';

// TEXT/content is stored as admin-authored HTML. Since only the single admin
// account writes this content, dangerouslySetInnerHTML is acceptable.
export default function CmsPageRenderer({
  page,
  bookingUrl,
}: {
  page: CmsPage;
  bookingUrl: string;
}) {
  return (
    <div className="w-full py-20 mobile:py-14 flex flex-col gap-5">
      {page.sections?.map((section) => {
        switch (section.type) {
          case 'TEXT':
            return (
              <div
                key={section.id}
                className="prose max-w-none [&>p]:my-2 [&>p:has(br:only-child)]:hidden"
                dangerouslySetInnerHTML={{ __html: section.content ?? '' }}
              />
            );

          case 'IMAGE':
            return (
              <div key={section.id} className="w-full aspect-[16/9] overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={section.image_url ?? ''}
                  alt={section.image_alt ?? ''}
                  className="w-full h-full object-cover"
                />
              </div>
            );

          case 'BUTTON':
            return (
              <div key={section.id} className="flex justify-center items-center py-4">
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-10 py-4 bg-[#FEC601] hover:bg-yellow-400 text-black font-bold text-[20px] rounded-xl shadow-lg transition-colors"
                >
                  {section.button_text ?? 'Book Me'}
                </a>
              </div>
            );

          case 'HERO':
          case 'AD_CODE':
            return <AdCodeSection key={section.id} html={section.html ?? ''} />;

          default:
            return null;
        }
      })}
    </div>
  );
}
