// ========================
// REGEX CONSTANTS
// ========================
const ENDS_WITH_S = /s$/i;
const ENDS_WITH_ES = /(ss|sh|ch|x|z)$/i;
const ENDS_WITH_Y = /([^aeiou])y$/i;
const ENDS_WITH_IES = /ies$/i;
const ENDS_WITH_VOWEL_O = /([aeiou])o$/i;
const ENDS_WITH_FE = /([aeifl])fe?$/i;
const ENDS_WITH_MAN = /man$/i;
const STARTS_WITH_CAPITAL = /^[A-Z]/;

// ========================
// DEFAULT VALUES
// ========================
// Irregular nouns
const IRREGULAR_PAIRS: [string, string][] = [
  ["child", "children"],
  ["person", "people"],
  ["man", "men"],
  ["tooth", "teeth"],
  ["foot", "feet"],
  ["mouse", "mice"],
];

// Plural rules
const PLURAL_RULES: [RegExp, string][] = [
  [ENDS_WITH_S, "s"],
  [ENDS_WITH_ES, "$1es"],
  [ENDS_WITH_Y, "$1ies"],
  [ENDS_WITH_VOWEL_O, "$1oes"],
  [ENDS_WITH_FE, "$1ves"],
  [ENDS_WITH_MAN, "men"],
];

// Singular rules
const SINGULAR_RULES: [RegExp, string][] = [
  [ENDS_WITH_S, ""],
  [ENDS_WITH_ES, "$1"],
  [ENDS_WITH_IES, "y"],
  [/men$/i, "man"],
];

// Common uncountables
const UNCOUNTABLE_RULES = ["fish", "sheep", "series", "species"];

export {
  IRREGULAR_PAIRS,
  PLURAL_RULES,
  SINGULAR_RULES,
  STARTS_WITH_CAPITAL,
  UNCOUNTABLE_RULES,
};
