import React from "react";
import renderer, { act } from "react-test-renderer";
import CalendarScreen from "@/app/(app)/calendar";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("Calendar screen", () => {
  it("renders the work calendar shell", () => {
    const { useRouter } = require("expo-router");
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn(), replace: jest.fn(), back: jest.fn() });

    let tree: any;

    act(() => {
      tree = renderer.create(<CalendarScreen />);
    });

    expect(tree.root.findByProps({ children: "Work Calendar" })).toBeTruthy();
    expect(tree.root.findByProps({ children: "TASKS" })).toBeTruthy();
    expect(tree.root.findByProps({ testID: "monthly-calendar" })).toBeTruthy();
  });
});
