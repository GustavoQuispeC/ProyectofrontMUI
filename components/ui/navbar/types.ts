export type DropdownId = "user" | null;

export interface MegaMenuGroup {
  title: string;
  seeAllHref?: string;
  items: string[];
}

export interface MegaMenuCategory {
  id: string;
  label: string;
  href: string;
  badge?: string;
  groups: MegaMenuGroup[];
}
