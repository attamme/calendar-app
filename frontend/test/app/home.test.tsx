import React from "react";
import renderer, { act } from "react-test-renderer";
import Home from "@/app/(app)/home";
import { colors } from "@/styles/tokens";
import { useRouter } from "expo-router";
import { useSession } from "@/services/session";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/services/session", () => ({
  useSession: jest.fn(),
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
  const push = jest.fn();
  const replace = jest.fn();
  const signOut = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push, replace });
    (useSession as jest.Mock).mockReturnValue({ signOut });
  });

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

    expect(push).toHaveBeenCalledWith("/calendar");
  });

  it("opens the reminder flow from the add button", () => {
    const tree = createTree();

    act(() => {
      tree.root.findByProps({ testID: "home-add-button" }).props.onPress();
    });

    expect(push).toHaveBeenCalledWith("/new-reminder");
  });

  it("signs out from the close button", async () => {
    signOut.mockResolvedValue(undefined);
    const tree = createTree();

    await act(async () => {
      tree.root.findByProps({ testID: "home-close-button" }).props.onPress();
    });

    expect(signOut).toHaveBeenCalled();
    expect(replace).toHaveBeenCalledWith("/landing-page");
  });
});
