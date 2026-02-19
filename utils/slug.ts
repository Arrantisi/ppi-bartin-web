import slugify from "slugify";

export const createSlug = (word: string) => {
  return slugify(word, {
    lower: true,
    strict: true,
    remove: /[*+~.()'"!:@]/g,
  });
};
