"use client";

import { useDrag } from "@/contexts/drag-context";
import { StrapiContact } from "@/services/strapi/contactService";
import { ContactForm } from "./contact-form";

interface ContactMainProps {
  contact: StrapiContact;
}

export function ContactMain({ contact }: ContactMainProps) {
  const { isDragging } = useDrag();

  return (
    <main
      className={`relative z-10 col-span-full pt-40 pb-0 lg:py-16 lg:pb-0 lg:col-start-4 lg:col-end-10 ${
        isDragging ? "pointer-events-none" : ""
      }`}
    >
      <ContactForm contact={contact} />
    </main>
  );
}
