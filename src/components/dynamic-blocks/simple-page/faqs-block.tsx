import { BlockRendererClient } from "@/components/common/block-renderer-client";
import type { StrapiSimplePageFaqs } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";

interface FaqsBlockProps {
  block: StrapiSimplePageFaqs;
}

export function FaqsBlock({ block }: FaqsBlockProps) {
  if (!block.faqSections || block.faqSections.length === 0) {
    return null;
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        {block.faqSections.map((section) => (
          <div key={section.id}>
            <h3 className="text-2xl font-bold text-black dark:text-white">
              {section.title}
            </h3>
            {section.faqs && section.faqs.length > 0 && (
              <div className="space-y-4 mt-4">
                {section.faqs.map((faq) => (
                  <div key={faq.id}>
                    <h4 className="text-xl font-bold text-black dark:text-white">
                      {faq.question}
                    </h4>
                    <BlockRendererClient
                      content={faq.answer as BlocksContent}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
