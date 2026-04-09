import React from "react";
import renderer, { act } from "react-test-renderer";
import Home from "@/app/(app)/home";
import { colors } from "@/styles/tokens";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

function createTree() {
  let tree: any;

  act(() => {
    tree = renderer.create(<Home />);
  });

  return tree;
}

function getFlattenedStyle(node: any) {
  return Array.isArray(node.props.style)
    ? node.props.style.filter(Boolean).reduce((acc: Record<string, unknown>, style: Record<string, unknown>) => {
        return { ...acc, ...style };
      }, {})
    : node.props.style;
}

describe("Home screen", () => {
  it("renders the homepage shell from the Figma overview", () => {
    const tree = createTree();

    expect(tree.root.findByProps({ children: "My calendar" })).toBeTruthy();
    expect(tree.root.findByProps({ children: "Today" })).toBeTruthy();
    expect(tree.root.findByProps({ children: "view all" })).toBeTruthy();
    expect(tree.root.findAllByProps({ children: "All" }).length).toBeGreaterThan(0);
    expect(tree.root.findAllByProps({ children: "Work" }).length).toBeGreaterThan(0);
  });

  it("updates the selected calendar card when a different card is pressed", () => {
    const tree = createTree();
    const allFrameNode = tree.root.findByProps({ testID: "dashboard-calendar-all-frame" });
    const workCalendarNode = tree.root.findByProps({ testID: "dashboard-calendar-work" });
    const workFrameNode = tree.root.findByProps({ testID: "dashboard-calendar-work-frame" });

    expect(getFlattenedStyle(allFrameNode).backgroundColor).toBe(colors.homeTile);
    expect(getFlattenedStyle(workFrameNode).backgroundColor).toBe(colors.homeCard);

    act(() => {
      workCalendarNode.props.onPress();
    });

    expect(getFlattenedStyle(tree.root.findByProps({ testID: "dashboard-calendar-all-frame" })).backgroundColor).toBe(
      colors.homeCard,
    );
    expect(getFlattenedStyle(tree.root.findByProps({ testID: "dashboard-calendar-work-frame" })).backgroundColor).toBe(
      colors.homeTile,
    );
  });
});
