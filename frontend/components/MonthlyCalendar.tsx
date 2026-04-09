import { useCallback, useMemo, useRef, useState } from "react";
import { PanResponder, Pressable, Text, View } from "react-native";
import { styles } from "@/styles/monthly_calendar";

export type CalendarEvent = {
    id: string;
    label?: string;
    weekIndex: number;
    startDay: number;
    endDay: number;
    color: string;
    textColor?: string;
};

type Props = {
    initialDate?: Date;
    weekdays?: string[];
    events?: CalendarEvent[];
    onDayPress?: (day: number) => void;
    onMonthChange?: (date: Date) => void;
};

const DEFAULT_WEEKDAYS = ["Mon", "Thu", "Wed", "Thu", "Fri", "Sat", "Sun"];
const ESTONIAN_MONTHS = [
    "Jaanuar",
    "Veebruar",
    "Märts",
    "Aprill",
    "Mai",
    "Juuni",
    "Juuli",
    "August",
    "September",
    "Oktoober",
    "November",
    "Detsember",
];

const WEEKEND_DAY_LABELS = new Set(["Sat", "Sun"]);
const CALENDAR_HORIZONTAL_PADDING = 10;
const WEEK_ROW_HORIZONTAL_PADDING = 10;
const COLUMN_GAP = 10;
const FIGMA_DAY_CELL_SIZE = 41.85714340209961;

function chunkDays(days: number[], chunkSize: number) {
    const rows: number[][] = [];

    for (let index = 0; index < days.length; index += chunkSize) {
        rows.push(days.slice(index, index + chunkSize));
    }

    return rows;
}

function padWeek(week: number[], totalColumns: number) {
    const padded = [...week];

    while (padded.length < totalColumns) {
        padded.push(0);
    }

    return padded;
}

export function getDaysInMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

export function getMonthLabel(date: Date) {
    return ESTONIAN_MONTHS[date.getMonth()];
}

export function addMonths(date: Date, offset: number) {
    return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

export function clampDayToMonth(day: number, date: Date) {
    return Math.min(day, getDaysInMonth(date));
}

export function getMonthOffsetFromGesture(dx: number) {
    if (dx <= -40) {
        return 1;
    }

    if (dx >= 40) {
        return -1;
    }

    return 0;
}

export function createCalendarRows(date: Date, columnCount: number) {
    const days = Array.from({ length: getDaysInMonth(date) }, (_, index) => index + 1);
    return chunkDays(days, columnCount);
}

export default function MonthlyCalendar({
    initialDate = new Date(),
    weekdays = DEFAULT_WEEKDAYS,
    events = [],
    onDayPress,
    onMonthChange,
}: Props) {
    const [visibleMonth, setVisibleMonth] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
    const [selectedDay, setSelectedDay] = useState(() => clampDayToMonth(initialDate.getDate(), initialDate));
    const [contentWidth, setContentWidth] = useState(0);

    const visibleMonthRef = useRef(visibleMonth);
    visibleMonthRef.current = visibleMonth;

    const dayRows = useMemo(() => {
        return createCalendarRows(visibleMonth, weekdays.length);
    }, [visibleMonth, weekdays.length]);

    const cellSize = useMemo(() => {
        if (!contentWidth) {
            return FIGMA_DAY_CELL_SIZE;
        }

        const availableWidth =
            contentWidth -
            CALENDAR_HORIZONTAL_PADDING * 2 -
            WEEK_ROW_HORIZONTAL_PADDING * 2 -
            COLUMN_GAP * (weekdays.length - 1);

        return Math.max(availableWidth / weekdays.length, 24);
    }, [contentWidth, weekdays.length]);

    const navigateMonth = useCallback((offset: number) => {
        const nextMonth = addMonths(visibleMonthRef.current, offset);

        setVisibleMonth(nextMonth);
        setSelectedDay((currentDay) => clampDayToMonth(currentDay, nextMonth));
        onMonthChange?.(nextMonth);
    }, [onMonthChange]);

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, gestureState) =>
                    Math.abs(gestureState.dx) > 24 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
                onPanResponderRelease: (_, gestureState) => {
                    const monthOffset = getMonthOffsetFromGesture(gestureState.dx);

                    if (monthOffset !== 0) {
                        navigateMonth(monthOffset);
                    }
                },
            }),
        [navigateMonth],
    );

    const handleDayPress = (day: number) => {
        setSelectedDay(day);
        onDayPress?.(day);
    };

    return (
        <View
            style={styles.calendar}
            testID="monthly-calendar"
            {...panResponder.panHandlers}
            onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
        >
            <Text style={styles.monthLabel} testID="month-label">
                {getMonthLabel(visibleMonth)}
            </Text>

            <View style={styles.weekdaysRow}>
                {weekdays.map((weekday, index) => (
                    <View key={`${weekday}-${index}`} style={styles.weekdayCell}>
                        <Text
                            testID={`weekday-${index}`}
                            style={[
                                styles.weekdayText,
                                WEEKEND_DAY_LABELS.has(weekday) && styles.weekendText,
                            ]}
                        >
                            {weekday}
                        </Text>
                    </View>
                ))}
            </View>

            {dayRows.map((week, weekIndex) => (
                <View key={`week-${weekIndex}`} style={styles.weekRow}>
                    {padWeek(week, weekdays.length).map((day, dayIndex) => {
                        if (day === 0) {
                            return <View key={`empty-${weekIndex}-${dayIndex}`} style={[styles.emptyDayCell, { width: cellSize, height: cellSize }]} />;
                        }

                        const isSelected = day === selectedDay;
                        const isFirstDay = day === 1;

                        return (
                            <Pressable
                                key={day}
                                accessibilityRole="button"
                                accessibilityLabel={`Select day ${day}`}
                                accessibilityState={{ selected: isSelected }}
                                onPress={() => handleDayPress(day)}
                                testID={`calendar-day-${day}`}
                                style={({ pressed }) => [
                                    styles.dayCell,
                                    { width: cellSize, height: cellSize },
                                    isFirstDay && !isSelected && styles.firstDayCell,
                                    isSelected && styles.selectedDayCell,
                                    pressed && styles.dayCellPressed,
                                ]}
                            >
                                <Text style={styles.dayText}>{day}</Text>
                            </Pressable>
                        );
                    })}

                    {events
                        .filter((event) => event.weekIndex === weekIndex)
                        .map((event) => {
                            const startColumn = Math.max(event.startDay - 1, 0);
                            const endColumn = Math.min(event.endDay - 1, weekdays.length - 1);
                            const left =
                                WEEK_ROW_HORIZONTAL_PADDING + startColumn * (cellSize + COLUMN_GAP);
                            const width = (endColumn - startColumn + 1) * cellSize + (endColumn - startColumn) * COLUMN_GAP;

                            return (
                                <View
                                    key={event.id}
                                    pointerEvents="none"
                                    style={[
                                        styles.eventBar,
                                        {
                                            left,
                                            width,
                                            backgroundColor: event.color,
                                        },
                                    ]}
                                >
                                    {event.label ? (
                                        <Text
                                            numberOfLines={1}
                                            style={[
                                                styles.eventLabel,
                                                event.textColor ? { color: event.textColor } : null,
                                            ]}
                                        >
                                            {event.label}
                                        </Text>
                                    ) : null}
                                </View>
                            );
                        })}
                </View>
            ))}
        </View>
    );
}
