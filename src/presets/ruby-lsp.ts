import type { Preset } from "../config/schema.ts";

/**
 * Ruby LSP adapter - Shopify's Ruby language server
 * @see https://github.com/Shopify/ruby-lsp
 */
export const rubyLspAdapter: Preset = {
  presetId: "ruby-lsp",
  name: "Ruby LSP",
  description: "Shopify's Ruby language server",
  baseLanguage: "ruby",
  binFindStrategy: {
    strategies: [
      // 1. Check global installation
      { type: "global", names: ["ruby-lsp"] },
      // 2. Check common gem installation paths
      { type: "path", path: "~/.gem/bin/ruby-lsp" },
      { type: "path", path: "/usr/bin/ruby-lsp" },
      { type: "path", path: "/usr/local/bin/ruby-lsp" },
    ],
    defaultArgs: [],
  },
  files: ["**/*.rb", "**/*.rake", "Gemfile", "Rakefile"],
  initializationOptions: {
    // Ruby LSP initialization options
    enabledFeatures: [
      "diagnostics",
      "documentSymbols",
      "documentHighlights",
      "foldingRanges",
      "selectionRanges",
      "semanticHighlighting",
      "formatting",
      "codeActions",
      "inlayHint",
      "completion",
      "hover",
      "definition",
      "workspaceSymbol",
      "signatureHelp",
    ],
  },
  serverCharacteristics: {
    documentOpenDelay: 1000,
    readinessCheckTimeout: 800,
    initialDiagnosticsTimeout: 2000,
    requiresProjectInit: false,
    sendsInitialDiagnostics: true,
    operationTimeout: 10000,
  },
};
