// ========================
// CORE PLURALIZER CLASS

import {
  IRREGULAR_PAIRS,
  PLURAL_RULES,
  SINGULAR_RULES,
  STARTS_WITH_CAPITAL,
  UNCOUNTABLE_RULES,
} from "./constants";

// ========================
export class Pluralizer {
  // ========================
  // INSTANCE PROPERTIES
  // ========================
  private irregulars = new Map<string, string>();
  private uncountables = new Set<string>();
  private pluralRules: Array<[RegExp, string]> = [];
  private singularRules: Array<[RegExp, string]> = [];

  // ========================
  // PUBLIC API
  // ========================
  constructor() {
    this.loadDefaultRules();
  }

  /** Convert word to plural form */
  plural(word: string): string {
    return this.processWord(word, this.pluralRules, this.irregulars);
  }

  /** Convert word to singular form */
  singular(word: string): string {
    return this.processWord(
      word,
      this.singularRules,
      new Map([...this.irregulars].reverse())
    );
  }

  // ========================
  // RULE MANAGEMENT
  // ========================
  addPluralRule(pattern: RegExp, replacement: string): void {
    this.pluralRules.push([pattern, replacement]);
  }

  addSingularRule(pattern: RegExp, replacement: string): void {
    this.singularRules.push([pattern, replacement]);
  }

  addUncountable(word: string): void {
    this.uncountables.add(word.toLowerCase());
  }

  addIrregular(single: string, plural: string): void {
    this.irregulars.set(single.toLowerCase(), plural.toLowerCase());
  }

  // ========================
  // CORE LOGIC
  // ========================
  /**
   * Main word processing pipeline
   * @param inverseMap When checking singular, we reverse the irregulars map
   */
  private processWord(
    word: string,
    rules: Array<[RegExp, string]>,
    inverseMap: Map<string, string>
  ): string {
    const lowerWord = word.toLowerCase();

    if (this.uncountables.has(lowerWord)) return word;

    const irregularMatch = inverseMap.get(lowerWord);
    if (irregularMatch) return this.restoreCase(word, irregularMatch);

    for (const [pattern, replacement] of rules) {
      const result = this.applyRule(word, pattern, replacement);
      if (result !== word) return result;
    }

    return word;
  }

  /** Preserve original word casing in transformed word */
  private restoreCase(original: string, transformed: string): string {
    if (original === original.toLowerCase()) return transformed.toLowerCase();
    if (original === original.toUpperCase()) return transformed.toUpperCase();
    if (STARTS_WITH_CAPITAL.test(original)) {
      return transformed[0].toUpperCase() + transformed.slice(1).toLowerCase();
    }
    return transformed.toLowerCase();
  }

  /** Apply regex replacement with capture group support */
  private applyRule(
    word: string,
    pattern: RegExp,
    replacement: string
  ): string {
    const match = word.match(pattern);
    if (!match) return word;

    let result = replacement;
    for (let i = 1; i < match.length; i++) {
      result = result.replace(new RegExp(`\\$${i}`, "g"), match[i] || "");
    }

    return this.restoreCase(match[0], result);
  }

  // ========================
  // DEFAULT RULES
  // ========================
  private loadDefaultRules(): void {
    // Load all defaults
    IRREGULAR_PAIRS.forEach(([s, p]) => this.addIrregular(s, p));
    PLURAL_RULES.forEach(([p, r]) => this.addPluralRule(p, r));
    SINGULAR_RULES.forEach(([p, r]) => this.addSingularRule(p, r));

    // Common uncountables
    UNCOUNTABLE_RULES.forEach((w) => this.addUncountable(w));
  }
}

// ========================
// DEFAULT INSTANCE EXPORT
// ========================
export const pluralize = new Pluralizer();
