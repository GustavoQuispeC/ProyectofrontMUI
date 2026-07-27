const avatarPalette = [
  { bg: "#2458da", color: "#ffffff" },
  { bg: "#15a167", color: "#ffffff" },
  { bg: "#621cb1", color: "#ffffff" },
  { bg: "#842910", color: "#ffffff" },
  { bg: "#125393", color: "#ffffff" },
  { bg: "#7e6014", color: "#ffffff" },
  { bg: "#136413", color: "#ffffff" },
  { bg: "#6a0c3b", color: "#ffffff" },
];

export const avatarStyle = (id: number) => avatarPalette[id % avatarPalette.length];

export const getInitials = (name: string) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();
