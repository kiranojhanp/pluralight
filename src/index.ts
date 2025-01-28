import {
  IRREGULAR_PAIRS,
  PLURAL_RULES,
  SINGULAR_RULES,
  UNCOUNTABLE_RULES,
} from "./rules";

const STARTS_WITH_CAPITAL = /^[A-Z]/;

export class Pluralizer {
  private readonly irregulars = new Map<string, string>();
  private readonly uncountables = new Set<string>();
  private readonly pluralRules: Array<[RegExp, string]> = [];
  private readonly singularRules: Array<[RegExp, string]> = [];

  constructor() {
    this.loadDefaultRules();
  }

  /** Convert word to plural form */
  plural(word: string): string {
    if (!word) throw new Error("Word cannot be empty");
    return this.processWord(word, this.pluralRules, this.irregulars);
  }

  /** Convert word to singular form */
  singular(word: string): string {
    if (!word) throw new Error("Word cannot be empty");

    const reversedMap = new Map(
      Array.from(this.irregulars.entries()).map(([k, v]) => [v, k])
    );

    return this.processWord(word, this.singularRules, reversedMap);
  }

  /**
   * Pluralize or singularize a word based on the count.
   */
  pluralize(word: string, count: number, inclusive = false): string {
    if (!word) throw new Error("Word cannot be empty");
    if (typeof count !== "number") throw new Error("Count must be a number");

    const result = count === 1 ? this.singular(word) : this.plural(word);
    return inclusive ? `${count} ${result}` : result;
  }

  addPluralRule(rule: string | RegExp, replacement: string): void {
    if (rule === undefined || rule === null)
      throw new Error("Rule cannot be null");
    if (replacement === undefined || replacement === null)
      throw new Error("Replacement cannot be null");
    this.pluralRules.unshift([this.sanitizeRule(rule), replacement]);
  }

  addSingularRule(rule: string | RegExp, replacement: string): void {
    if (rule === undefined || rule === null)
      throw new Error("Rule cannot be null");
    if (replacement === undefined || replacement === null)
      throw new Error("Replacement cannot be null");
    this.singularRules.unshift([this.sanitizeRule(rule), replacement]);
  }

  private sanitizeRule(rule: string | RegExp): RegExp {
    try {
      if (typeof rule === "string") {
        return new RegExp("^" + rule + "$", "i");
      }
      return new RegExp(rule, rule.flags);
    } catch (error: any) {
      throw new Error(`Invalid rule pattern: ${error.message}`);
    }
  }

  addUncountable(word: RegExp | string): void {
    if (!word) throw new Error("Word cannot be empty");

    if (typeof word !== "string") {
      this.addPluralRule(word, "$0");
      this.addSingularRule(word, "$0");
      return;
    }

    this.uncountables.add(word.toLowerCase());
  }

  addIrregular(single: string, plural: string): void {
    if (!single || !plural) throw new Error("Words cannot be empty");
    this.irregulars.set(single.toLowerCase(), plural.toLowerCase());
  }

  private processWord(
    word: string,
    rules: Array<[RegExp, string]>,
    inverseMap: Map<string, string>
  ): string {
    const lowerWord = word.toLowerCase();

    // Check uncountables first (fastest lookup)
    if (this.uncountables.has(lowerWord)) return word;

    // Check irregulars next (map lookup)
    const irregularMatch = inverseMap.get(lowerWord);
    if (irregularMatch) return this.restoreCase(word, irregularMatch);

    // Finally check regex patterns
    for (const [pattern, replacement] of rules) {
      if (pattern.test(word)) {
        const result = word.replace(pattern, replacement);
        if (result !== word) return this.restoreCase(word, result);
      }
    }

    return word;
  }

  private restoreCase(original: string, transformed: string): string {
    if (!transformed) return original;

    if (original === original.toLowerCase()) return transformed.toLowerCase();
    if (original === original.toUpperCase()) return transformed.toUpperCase();
    if (STARTS_WITH_CAPITAL.test(original)) {
      return (
        transformed.charAt(0).toUpperCase() + transformed.slice(1).toLowerCase()
      );
    }
    return transformed.toLowerCase();
  }

  private loadDefaultRules(): void {
    // Load rules in reverse priority order
    UNCOUNTABLE_RULES.forEach((w) => this.addUncountable(w));
    SINGULAR_RULES.forEach(([p, r]) => this.addSingularRule(p, r));
    PLURAL_RULES.forEach(([p, r]) => this.addPluralRule(p, r));
    IRREGULAR_PAIRS.forEach(([s, p]) => this.addIrregular(s, p));
  }
}

export const pluralize = new Pluralizer();
