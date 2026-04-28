export const toKebabCase = (str: string): string => {
  return str
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const toPascalCase = (str: string): string => {
  return str
    .trim()
    .replace(/[^a-z0-9]+/gi, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("");
};

export const isValidKebabCase = (str: string): boolean => {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(str);
};
