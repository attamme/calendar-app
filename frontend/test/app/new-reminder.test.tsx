import React from "react";
import renderer, { act } from "react-test-renderer";
import NewReminderScreen from "@/app/(app)/new-reminder";

jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

describe("New reminder screen", () => {
  it("renders the reminder form shell", () => {
    const { useRouter } = require("expo-router");
    (useRouter as jest.Mock).mockReturnValue({ push: jest.fn(), replace: jest.fn(), back: jest.fn() });

    let tree: any;

    act(() => {
      tree = renderer.create(<NewReminderScreen />);
    });

    expect(tree.root.findByProps({ children: "New reminder" })).toBeTruthy();
    expect(tree.root.findByProps({ children: "Date & Time" })).toBeTruthy();
    expect(tree.root.findByProps({ children: "Places & People" })).toBeTruthy();
    expect(tree.root.findByProps({ children: "Priority" })).toBeTruthy();
  });
});
