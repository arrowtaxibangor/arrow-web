import type { CmsPage, ButtonVariant } from '@/lib/supabase/cms';
import AdCodeSection from '@/components/DynamicPage/AdCodeSection';

const BUTTON_DEFAULTS = {
  bg_color: '#FEC601',
  text_color: '#ffffff',
  font_size: 20,
  border_radius: 12,
  padding_x: 40,
  padding_y: 16,
  font_weight: 700,
};

// TEXT/content is stored as admin-authored HTML. Since only the single admin
// account writes this content, dangerouslySetInnerHTML is acceptable.
export default function CmsPageRenderer({
  page,
  bookingUrl,
  buttonVariants = [],
}: {
  page: CmsPage;
  bookingUrl: string;
  buttonVariants?: ButtonVariant[];
}) {
  const variantMap = new Map(buttonVariants.map((v) => [v.slug, v]));
  const defaultVariant = buttonVariants.find((v) => v.is_default) ?? null;
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

          case 'BUTTON': {
            const variant =
              (section.button_variant_slug ? variantMap.get(section.button_variant_slug) : null) ??
              defaultVariant ??
              BUTTON_DEFAULTS;
            const href =
              section.button_link && section.button_link.trim() ? section.button_link : bookingUrl;
            return (
              <div key={section.id} className="flex justify-center items-center py-4">
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    backgroundColor: variant.bg_color,
                    color: variant.text_color,
                    fontSize: variant.font_size,
                    borderRadius: variant.border_radius,
                    paddingLeft: variant.padding_x,
                    paddingRight: variant.padding_x,
                    paddingTop: variant.padding_y,
                    paddingBottom: variant.padding_y,
                    fontWeight: variant.font_weight,
                    display: 'inline-block',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  {section.button_text ?? 'Book Me'}
                </a>
              </div>
            );
          }

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
