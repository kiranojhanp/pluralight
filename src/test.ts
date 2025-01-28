import { pluralize, Pluralizer } from "./index";

// Test utilities
function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

function assertEqual(actual: any, expected: any, message: string) {
  assert(
    actual === expected,
    `${message}\nExpected: ${expected}\nActual: ${actual}`
  );
}

function runTests() {
  let passed = 0;
  let failed = 0;
  const failures: string[] = [];

  function test(name: string, fn: () => void) {
    try {
      fn();
      console.log(`✅ ${name}`);
      passed++;
    } catch (error: any) {
      console.error(`❌ ${name}`);
      console.error(`   ${error.message}`);
      failed++;
      failures.push(`${name}: ${error.message}`);
    }
  }

  // Default instance tests
  test("should pluralize regular nouns", () => {
    assertEqual(pluralize.plural("cat"), "cats", "cat → cats");
    assertEqual(pluralize.plural("dog"), "dogs", "dog → dogs");
    assertEqual(pluralize.plural("house"), "houses", "house → houses");
  });

  test("should singularize regular nouns", () => {
    assertEqual(pluralize.singular("cats"), "cat", "cats → cat");
    assertEqual(pluralize.singular("dogs"), "dog", "dogs → dog");
    assertEqual(pluralize.singular("houses"), "house", "houses → house");
  });

  test("should handle irregular nouns", () => {
    assertEqual(pluralize.plural("child"), "children", "child → children");
    assertEqual(pluralize.singular("children"), "child", "children → child");
    assertEqual(pluralize.plural("person"), "people", "person → people");
    assertEqual(pluralize.singular("people"), "person", "people → person");
  });

  test("should handle uncountable nouns", () => {
    assertEqual(pluralize.plural("rice"), "rice", "rice → rice");
    assertEqual(pluralize.singular("rice"), "rice", "rice → rice");
    assertEqual(
      pluralize.plural("information"),
      "information",
      "information → information"
    );
    assertEqual(
      pluralize.singular("information"),
      "information",
      "information → information"
    );
  });

  test("should handle word with numbers", () => {
    assertEqual(pluralize.plural("person2"), "person2s", "person2 → person2s");
    assertEqual(
      pluralize.singular("person2s"),
      "person2",
      "person2s → person2"
    );
  });

  test("should preserve case", () => {
    assertEqual(pluralize.plural("Cat"), "Cats", "Cat → Cats");
    assertEqual(pluralize.plural("CAT"), "CATS", "CAT → CATS");
    assertEqual(pluralize.singular("Cats"), "Cat", "Cats → Cat");
    assertEqual(pluralize.singular("CATS"), "CAT", "CATS → CAT");
  });

  test("should handle empty inputs", () => {
    let caught = false;
    try {
      pluralize.plural("");
    } catch (e: any) {
      caught = true;
      assert(
        e.message.includes("empty"),
        "Should throw appropriate error message"
      );
    }
    assert(caught, "Should throw error for empty string");
  });

  // Custom instance tests
  test("should allow custom rules", () => {
    const customPluralize = new Pluralizer();
    customPluralize.addPluralRule("custom$", "customs");
    customPluralize.addSingularRule(/customs$/, "custom");

    assertEqual(
      customPluralize.plural("custom"),
      "customs",
      "custom → customs"
    );
    assertEqual(
      customPluralize.singular("customs"),
      "custom",
      "customs → custom"
    );
  });

  test("should allow custom irregular nouns", () => {
    const customPluralize = new Pluralizer();
    customPluralize.addIrregular("irregular", "irregulars_custom");

    assertEqual(
      customPluralize.plural("irregular"),
      "irregulars_custom",
      "irregular → irregulars_custom"
    );
    assertEqual(
      customPluralize.singular("irregulars_custom"),
      "irregular",
      "irregulars_custom → irregular"
    );
  });

  test("should handle counts correctly", () => {
    assertEqual(pluralize.pluralize("cat", 1), "cat", "one cat");
    assertEqual(pluralize.pluralize("cat", 2), "cats", "two cats");
    assertEqual(pluralize.pluralize("cat", 0), "cats", "zero cats");
  });

  test("should handle inclusive counts", () => {
    assertEqual(
      pluralize.pluralize("cat", 1, true),
      "1 cat",
      "one cat (inclusive)"
    );
    assertEqual(
      pluralize.pluralize("cat", 2, true),
      "2 cats",
      "two cats (inclusive)"
    );
    assertEqual(
      pluralize.pluralize("cat", 0, true),
      "0 cats",
      "zero cats (inclusive)"
    );
  });

  test("should validate inputs", () => {
    let caught = false;
    try {
      pluralize.pluralize("word", "not a number" as any);
    } catch (e: any) {
      caught = true;
      assert(
        e.message.includes("number"),
        "Should throw appropriate error message"
      );
    }
    assert(caught, "Should throw error for invalid count type");
  });

  // Print summary
  console.log("\nTest Summary:");
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failures.length > 0) {
    console.log("\nFailures:");
    failures.forEach((failure) => console.log(failure));
  }

  return failed === 0;
}

// Run tests
console.log("Running Pluralizer tests...\n");
const success = runTests();
if (!success) {
  process.exit(1);
}
