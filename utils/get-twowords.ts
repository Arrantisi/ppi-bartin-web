export const getTwoWords = (name: string) => {
  if (!name) return "";
  return name.split(" ").slice(0, 2).join(" ");
};
