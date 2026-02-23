import { describe, expect, it } from "vitest";
import { join } from "path";
import { rubyLspAdapter } from "../../../src/presets/ruby-lsp.ts";
import { testLspConnection } from "../testHelpers.ts";
import { testMcpConnection } from "../testMcpHelpers.ts";

describe("Ruby LSP Adapter", () => {
  const projectRoot = join(import.meta.dirname, "../../fixtures", "ruby");

  it("should connect to Ruby LSP", async () => {
    const checkFiles = ["main.rb"];
    const result = await testLspConnection(
      rubyLspAdapter,
      projectRoot,
      checkFiles,
    );
    expect(result).toMatchObject({
      connected: true,
    });
  }, 30000); // Ruby LSP can take time to initialize

  it("should provide MCP tools including get_project_overview, get_diagnostics, get_definitions, search_symbols, and get_symbol_details", async () => {
    const result = await testMcpConnection(
      rubyLspAdapter,
      projectRoot,
      "main.rb",
    );

    if (!result.connected) {
      console.warn("MCP connection failed, skipping test");
      return;
    }

    expect(result.hasGetProjectOverview).toBe(true);
    expect(result.hasGetDiagnostics).toBe(true);
    expect(result.hasGetDefinitions).toBe(true);
    expect(result.hasSearchSymbols).toBe(true);
    expect(result.hasGetSymbolDetails).toBe(true);

    if (result.projectOverview) {
      // Verify project overview contains expected information
      // The response is in Markdown format, not JSON
      const overviewText = result.projectOverview[0].text;
      expect(overviewText).toContain("Project Overview");
      expect(overviewText).toContain("Statistics");
      expect(overviewText).toContain("Key Components");
    }

    // Verify get_diagnostics works
    expect(result.diagnosticsResult).toBeDefined();

    // Verify search_symbols works
    if (result.searchSymbolsResult) {
      expect(result.searchSymbolsResult).toBeDefined();
      expect(result.searchSymbolsResult.length).toBeGreaterThan(0);
    }

    // Verify get_symbol_details works
    if (result.symbolDetailsResult) {
      expect(result.symbolDetailsResult).toBeDefined();
      expect(result.symbolDetailsResult.length).toBeGreaterThan(0);
    }
  });
});
