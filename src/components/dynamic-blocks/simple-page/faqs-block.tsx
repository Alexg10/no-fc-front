"use client";

import { BlockRendererClient } from "@/components/common/block-renderer-client";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import type { StrapiSimplePageFaqs } from "@/types/strapi";
import type { BlocksContent } from "@strapi/blocks-react-renderer";
import { useState } from "react";

interface FaqsBlockProps {
  block: StrapiSimplePageFaqs;
}

export function FaqsBlock({ block }: FaqsBlockProps) {
  const [open, setOpen] = useState<string | null>(null);

  if (!block.faqSections || block.faqSections.length === 0) {
    return null;
  }

  return (
    <section className="flex flex-col gap-10 lg:pt-10">
      {block.faqSections.map((section) => (
        <div key={section.id}>
          <h3 className="text-obviously border-b border-black pb-6">
            {section.title}
          </h3>
          {section.faqs && section.faqs.length > 0 && (
            <div className="space-y-4 mt-4">
              {section.faqs.map((faq) => (
                <Accordion
                  key={faq.id}
                  type="single"
                  collapsible
                  value={open === String(faq.id) ? String(faq.id) : ""}
                  className={cn(
                    "border border-black px-6 transition-all duration-300 ease-in-out",
                    open === String(faq.id)
                      ? "bg-black text-white [&>*>svg]:fill-white"
                      : "bg-white text-black [&>*>svg]:fill-black"
                  )}
                  onValueChange={(value) =>
                    setOpen(value ? String(faq.id) : null)
                  }
                >
                  <AccordionItem value={String(faq.id)}>
                    <AccordionTrigger className="text-xl-polymath-display! cursor-pointer">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent>
                      <BlockRendererClient
                        content={faq.answer as BlocksContent}
                      />
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              ))}
            </div>
          )}
        </div>
      ))}
    </section>
  );
}
