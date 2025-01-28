# Pluralight 🌟

[![npm](https://img.shields.io/npm/v/pluralight)](https://www.npmjs.com/package/pluralight)
[![Bundle Size](https://badgen.net/bundlephobia/minzip/pluralight)](https://bundlephobia.com/package/pluralight)

Ultra-lightweight pluralization library with perfect TypeScript support. Handle complex English plurals/singulars with zero dependencies.

## Features

- 🪶 Smaller than alternatives
- 🦾 Full TypeScript support
- 🧩 Modular rules system
- 🪶 Tree-shakable design
- 🤝 Works in Node + Browsers
- 🔄 Supports all English irregulars

## Installation

```bash
npm install pluralight
# or
pnpm add pluralight
# or
yarn add pluralight
# or
bun add pluralight
```

## Basic Usage

```typescript
import { pluralize } from "pluralight";

// Automatic pluralization
pluralize.plural("child"); // 'children'
pluralize.singular("mice"); // 'mouse'

// Count-aware formatting
pluralize.pluralize("apple", 3); // 'apples'
pluralize.pluralize("apple", 3, true); // '3 apples'
pluralize.pluralize("person", 1, true); // '1 person'
```

## Advanced Usage

### Add Custom Rules

```typescript
// Add irregular noun
pluralize.addIrregular("formula", "formulae");

// Add pluralization rule
pluralize.addPluralRule(/^(ax)is$/i, "$1es");

// Add uncountable noun
pluralize.addUncountable("metadata");

// Now works with custom rules
pluralize.plural("axis"); // 'axes'
pluralize.plural("formula"); // 'formulae'
pluralize.plural("metadata"); // 'metadata'
```

### Edge Cases Handling

```typescript
// Maintains original casing
pluralize.plural("Hello"); // 'Hellos'
pluralize.plural("WORLD"); // 'WORLDS'

// Handles tricky plurals
pluralize.plural("matrix"); // 'matrices'
pluralize.singular("vertices"); // 'vertex'
```
