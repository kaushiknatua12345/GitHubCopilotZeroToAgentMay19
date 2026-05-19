---
description: "ADA web accessibility compliance audit. Use when: checking website for ADA compliance, WCAG violations, accessibility issues, Section 508, screen reader compatibility, keyboard navigation problems."
name: "ADA Compliance Audit"
argument-hint: "URL or local path to analyze"
agent: "agent"
tools: [mcp_playwright_browser_navigate, mcp_playwright_browser_snapshot, mcp_playwright_browser_take_screenshot, grep_search, read_file, semantic_search, file_search, runSubagent]
---

# ADA Compliance Audit

Perform a comprehensive ADA (Americans with Disabilities Act) web accessibility audit following guidelines from the U.S. Department of Justice: https://www.ada.gov/resources/web-guidance/

## Reference Standards

This audit follows:
- **WCAG 2.1** (Web Content Accessibility Guidelines) Level AA
- **Section 508** ICT Accessibility Standards
- **ADA Title II/III** requirements for web content

## Audit Process

Execute these analyses **in parallel** for efficiency:

### 1. Static Code Analysis
Scan the codebase for accessibility violations:
- Missing `alt` attributes on `<img>` elements
- Missing `aria-label` or `aria-labelledby` on interactive elements
- Poor color contrast in CSS (check for contrast ratios < 4.5:1)
- Missing form labels (`<label>` associations with inputs)
- Missing `lang` attribute on `<html>`
- Improper heading hierarchy (skipped levels)
- Missing skip navigation links
- Inaccessible focus indicators (`:focus` styles)
- Auto-playing media without controls
- Missing captions/transcripts references

### 2. Playwright Browser Analysis
Navigate to the site and capture:
- Take accessibility snapshot using browser tools
- Check for keyboard-navigable elements
- Verify ARIA roles and landmarks
- Test focus order and tab navigation
- Check for visible focus indicators
- Validate form error messaging

## Critical Issue Categories (per ADA.gov)

Prioritize issues by impact on users with disabilities:

1. **Critical (Blocker)**: Prevents access entirely
   - No keyboard navigation
   - Missing alt text on essential images
   - No form labels

2. **Serious**: Significantly impairs use
   - Poor color contrast
   - Missing video captions
   - Inaccessible error messages

3. **Moderate**: Creates difficulty
   - Improper heading structure
   - Missing landmark regions
   - Insufficient focus indicators

## Output Requirements

**DO NOT modify any source files.** Report only.

Provide:
1. **Top 5 Critical Issues** requiring immediate fix:
   - Issue description
   - WCAG criterion violated
   - File location and line number
   - Impact on users with disabilities
   - Recommended fix (description only, no code changes)

2. **Summary Statistics**:
   - Total issues found by severity
   - Most affected file/component
   - Accessibility score estimate (0-100)

Format the output as a clear, actionable report suitable for development team review.
