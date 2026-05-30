import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import CollapsibleSection from "../components/CollapsibleSection";

describe("CollapsibleSection Component", () => {
  it("renders collapsed by default and displays title and badge", () => {
    render(
      <CollapsibleSection id="test-sec" title="Test Section" badge="New Badge">
        <div>Test Content</div>
      </CollapsibleSection>
    );

    // Verify title and badge are visible
    expect(screen.getByText("Test Section")).toBeInTheDocument();
    expect(screen.getByText("New Badge")).toBeInTheDocument();
    expect(screen.getByText("Tap to open")).toBeInTheDocument();

    // The content is inside a collapsed grid (gridTemplateRows: 0fr)
    const contentContainer = document.getElementById("test-sec-content");
    expect(contentContainer).toHaveStyle("grid-template-rows: 0fr");
  });

  it("toggles open and closed state when header button is clicked", async () => {
    render(
      <CollapsibleSection id="test-sec" title="Test Section">
        <div>Test Content</div>
      </CollapsibleSection>
    );

    const button = screen.getByRole("button");
    const contentContainer = document.getElementById("test-sec-content");

    // Click to open
    await act(async () => {
      fireEvent.click(button);
    });
    expect(contentContainer).toHaveStyle("grid-template-rows: 1fr");
    expect(screen.getByText("Tap to close")).toBeInTheDocument();

    // Click to close
    await act(async () => {
      fireEvent.click(button);
    });
    expect(contentContainer).toHaveStyle("grid-template-rows: 0fr");
    expect(screen.getByText("Tap to open")).toBeInTheDocument();
  });

  it("expands programmatically when open-section event is received", async () => {
    // Mock scrollIntoView since it's not implemented in jsdom
    const scrollIntoViewMock = vi.fn();
    window.HTMLElement.prototype.scrollIntoView = scrollIntoViewMock;

    render(
      <CollapsibleSection id="test-sec" title="Test Section">
        <div>Test Content</div>
      </CollapsibleSection>
    );

    const contentContainer = document.getElementById("test-sec-content");
    expect(contentContainer).toHaveStyle("grid-template-rows: 0fr");

    // Dispatch the custom event to open this section
    await act(async () => {
      window.dispatchEvent(
        new CustomEvent("open-section", { detail: { sectionId: "test-sec" } })
      );
    });

    // It should expand
    expect(contentContainer).toHaveStyle("grid-template-rows: 1fr");
  });
});
