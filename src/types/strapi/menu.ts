export interface StrapiMenu {
  id: number;
  links: Array<{
    id: number;
    label: string;
    link: string;
    target?: string;
  }>;
}
