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
const COLUMN_GAP = 10;

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

function getDaysInMonth(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}

function getMonthLabel(date: Date) {
    return ESTONIAN_MONTHS[date.getMonth()];
}

function addMonths(date: Date, offset: number) {
    return new Date(date.getFullYear(), date.getMonth() + offset, 1);
}

export default function MonthlyCalendar({
    initialDate = new Date(),
    weekdays = DEFAULT_WEEKDAYS,
    events = [],
    onDayPress,
    onMonthChange,
}: Props) {
    const [visibleMonth, setVisibleMonth] = useState(() => new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));
    const [selectedDay, setSelectedDay] = useState(() => initialDate.getDate());
    const [contentWidth, setContentWidth] = useState(0);

    const visibleMonthRef = useRef(visibleMonth);
    visibleMonthRef.current = visibleMonth;

    const dayRows = useMemo(() => {
        const days = Array.from({ length: getDaysInMonth(visibleMonth) }, (_, index) => index + 1);
        return chunkDays(days, weekdays.length);
    }, [visibleMonth, weekdays.length]);

    const cellSize = useMemo(() => {
        if (!contentWidth) {
            return 41.85714340209961;
        }

        return Math.max((contentWidth - 80) / 7, 24);
    }, [contentWidth]);

    const navigateMonth = useCallback((offset: number) => {
        const nextMonth = addMonths(visibleMonthRef.current, offset);
        const nextDaysInMonth = getDaysInMonth(nextMonth);

        setVisibleMonth(nextMonth);
        setSelectedDay((currentDay) => Math.min(currentDay, nextDaysInMonth));
        onMonthChange?.(nextMonth);
    }, [onMonthChange]);

    const panResponder = useMemo(
        () =>
            PanResponder.create({
                onMoveShouldSetPanResponder: (_, gestureState) =>
                    Math.abs(gestureState.dx) > 24 && Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
                onPanResponderRelease: (_, gestureState) => {
                    if (gestureState.dx <= -40) {
                        navigateMonth(1);
                    } else if (gestureState.dx >= 40) {
                        navigateMonth(-1);
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
            {...panResponder.panHandlers}
            onLayout={(event) => setContentWidth(event.nativeEvent.layout.width)}
        >
            <Text style={styles.monthLabel}>{getMonthLabel(visibleMonth)}</Text>

            <View style={styles.weekdaysRow}>
                {weekdays.map((weekday, index) => (
                    <View key={`${weekday}-${index}`} style={styles.weekdayCell}>
                        <Text
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
                                onPress={() => handleDayPress(day)}
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

                    <View pointerEvents="none" style={styles.eventLayer}>
                        {events
                            .filter((event) => event.weekIndex === weekIndex)
                            .map((event) => {
                                const left = (event.startDay - 1) * (cellSize + COLUMN_GAP);
                                const width = (event.endDay - event.startDay + 1) * cellSize + Math.max(event.endDay - event.startDay, 0) * COLUMN_GAP;

                                return (
                                    <View
                                        key={event.id}
                                        style={[
                                            styles.eventBar,
                                            {
                                                left,
                                                width,
                                                backgroundColor: event.color,
                                            },
                                        ]}
                                    >
                                        {!!event.label && (
                                            <Text
                                                style={[
                                                    styles.eventLabel,
                                                    { color: event.textColor ?? "#FFFFFF" },
                                                ]}
                                                numberOfLines={1}
                                            >
                                                {event.label}
                                            </Text>
                                        )}
                                    </View>
                                );
                            })}
                    </View>
                </View>
            ))}
        </View>
    );
}