#!/bin/bash
# Translation Scanner - Proof of Concept
# Demonstrates Phase 1 (Code Scanning) and Phase 2 (Gap Analysis)

echo "=== Translation Orchestrator - POC ==="
echo ""

# Phase 1: Find hardcoded text patterns
echo "📝 Phase 1: Scanning for hardcoded text..."
echo ""

# Find components without useTranslations import
echo "Components missing useTranslations():"
grep -L "useTranslations" src/components/calculators/*.tsx 2>/dev/null | wc -l

# Find hardcoded placeholder text
echo ""
echo "Hardcoded placeholders found:"
grep -rn 'placeholder="[A-Z]' src/components/calculators/*.tsx 2>/dev/null | head -5

# Find hardcoded labels
echo ""
echo "Hardcoded labels found:"
grep -rn 'label="[A-Z]' src/components/calculators/*.tsx 2>/dev/null | head -5

# Phase 2: Translation gap analysis
echo ""
echo "📊 Phase 2: Translation gap analysis..."
echo ""

# Count keys per locale (approximate by line count)
echo "Translation file sizes:"
wc -l src/messages/*.json | tail -1

echo ""
echo "Key count comparison (using jq):"
for locale in cs en sk pl hu; do
  if command -v jq &> /dev/null; then
    count=$(jq -r 'paths(scalars) | join(".")' src/messages/${locale}.json 2>/dev/null | wc -l)
    echo "  ${locale}.json: $count keys"
  else
    echo "  ${locale}.json: (jq not installed, using line count)"
  fi
done

echo ""
echo "Missing keys analysis:"
echo "(Comparing sk.json to cs.json reference)"

if command -v jq &> /dev/null; then
  # Extract all keys from cs.json (reference)
  jq -r 'paths(scalars) | join(".")' src/messages/cs.json > /tmp/cs_keys.txt

  # Extract all keys from sk.json
  jq -r 'paths(scalars) | join(".")' src/messages/sk.json > /tmp/sk_keys.txt

  # Find missing keys
  missing=$(comm -23 <(sort /tmp/cs_keys.txt) <(sort /tmp/sk_keys.txt) | head -10)

  if [ -n "$missing" ]; then
    echo "Sample missing keys in sk.json:"
    echo "$missing"
  else
    echo "✅ No missing keys found in sk.json"
  fi

  # Cleanup
  rm -f /tmp/cs_keys.txt /tmp/sk_keys.txt
else
  echo "⚠️  Install jq for detailed key analysis: brew install jq"
fi

echo ""
echo "=== POC Complete ==="
echo ""
echo "Next steps:"
echo "1. Run: chmod +x scripts/translation-scanner-poc.sh"
echo "2. Execute: ./scripts/translation-scanner-poc.sh"
echo "3. Review output to see hardcoded text and missing keys"
echo "4. Use translation-orchestrator agent to fix issues"
