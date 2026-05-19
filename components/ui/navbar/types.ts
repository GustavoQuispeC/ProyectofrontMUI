export type DropdownId = "products" | "resources" | "user" | null;

export interface ResourceItem {
  icon: React.ReactNode;
  label: string;
  sub: string;
  bg: string;
  color: string;
}

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  id: string;
  badge?: string;
}