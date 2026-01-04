import type { StrapiSimplePageFaqs } from "@/types/strapi";

interface FaqsBlockProps {
  block: StrapiSimplePageFaqs;
}

export function FaqsBlock({ block }: FaqsBlockProps) {
  console.log(block);
  return (
    <section className="py-12">
      <div className="container mx-auto px-4 max-w-3xl space-y-6">
        {block.faqSections?.map((faq) => {
          console.log(faq);
          return (
            <div key={faq.id}>
              <h3 className="text-2xl font-bold text-black dark:text-white">
                {faq.title}
              </h3>
              {faq.faqs?.map((faq) => {
                return (
                  <div key={faq.id}>
                    <h4 className="text-xl font-bold text-black dark:text-white">
                      {faq.question}
                    </h4>
                    <p className="text-lg text-black dark:text-white">
                      {faq.answer}
                    </p>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </section>
  );
}
