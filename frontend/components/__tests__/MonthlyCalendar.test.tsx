import React from "react";
import { StyleSheet } from "react-native";
import renderer, { act } from "react-test-renderer";
import {
  default as MonthlyCalendar,
  addMonths,
  clampDayToMonth,
  getMonthLabel,
  getMonthOffsetFromGesture,
} from "@/components/MonthlyCalendar";

function getStyle(node: renderer.ReactTestInstance) {
  const { style } = node.props;

  if (typeof style === "function") {
    return StyleSheet.flatten(style({ pressed: false }));
  }

  return StyleSheet.flatten(style);
}

function findByTestId(root: renderer.ReactTestRenderer, testID: string) {
  return root.root.findByProps({ testID });
}

function findAllByTestIdPrefix(root: renderer.ReactTestRenderer, prefix: string) {
  return root.root.findAll((node) => typeof node.props.testID === "string" && node.props.testID.startsWith(prefix));
}

function getUniqueTestIds(root: renderer.ReactTestRenderer, prefix: string) {
  return [...new Set(findAllByTestIdPrefix(root, prefix).map((node) => node.props.testID))];
}

function createTree(element: React.ReactElement) {
  let tree!: renderer.ReactTestRenderer;

  act(() => {
    tree = renderer.create(element);
  });

  return tree;
}

describe("MonthlyCalendar", () => {
  it("matches the Figma month shell for January", () => {
    const tree = createTree(<MonthlyCalendar initialDate={new Date(2024, 0, 6)} />);

    expect(findByTestId(tree, "month-label").props.children).toBe("Jaanuar");

    const calendarStyle = StyleSheet.flatten(findByTestId(tree, "monthly-calendar").props.style);
    expect(calendarStyle.maxWidth).toBe(391);
    expect(calendarStyle.minHeight).toBe(401);
    expect(calendarStyle.padding).toBe(10);

    expect(getUniqueTestIds(tree, "weekday-")).toHaveLength(7);
    expect(getUniqueTestIds(tree, "calendar-day-")).toHaveLength(31);

    const saturdayStyle = StyleSheet.flatten(findByTestId(tree, "weekday-5").props.style);
    const sundayStyle = StyleSheet.flatten(findByTestId(tree, "weekday-6").props.style);
    expect(saturdayStyle.color).toBe("#ff0000");
    expect(sundayStyle.color).toBe("#ff0000");

    const firstDayStyle = getStyle(findByTestId(tree, "calendar-day-1"));
    const selectedDayStyle = getStyle(findByTestId(tree, "calendar-day-6"));

    expect(firstDayStyle.borderWidth).toBe(1);
    expect(firstDayStyle.borderColor).toBe("#FFFFFF");
    expect(selectedDayStyle.borderWidth).toBe(2);
    expect(selectedDayStyle.borderColor).toBe("#6A5AFC");
  });

  it("updates the selected day when a date is pressed", () => {
    const onDayPress = jest.fn();
    const tree = createTree(
      <MonthlyCalendar initialDate={new Date(2024, 0, 6)} onDayPress={onDayPress} />,
    );

    act(() => {
      findByTestId(tree, "calendar-day-10").props.onPress();
    });

    expect(onDayPress).toHaveBeenCalledWith(10);

    const selectedDayStyle = getStyle(findByTestId(tree, "calendar-day-10"));
    expect(selectedDayStyle.borderWidth).toBe(2);
    expect(selectedDayStyle.borderColor).toBe("#6A5AFC");
  });

  it("maps swipe thresholds to month changes and clamps overflow days", () => {
    const january = new Date(2023, 0, 1);
    const nextMonth = addMonths(january, getMonthOffsetFromGesture(-50));
    const previousMonth = addMonths(january, getMonthOffsetFromGesture(50));

    expect(getMonthOffsetFromGesture(-50)).toBe(1);
    expect(getMonthOffsetFromGesture(50)).toBe(-1);
    expect(getMonthOffsetFromGesture(15)).toBe(0);
    expect(getMonthLabel(nextMonth)).toBe("Veebruar");
    expect(getMonthLabel(previousMonth)).toBe("Detsember");
    expect(clampDayToMonth(31, nextMonth)).toBe(28);
  });
});
