import { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PRIORITY_COLORS, styles } from "@/styles/task_view";

type TaskViewProps = {
    taskKey?: string | number;
    title: string;
    description: string;
    priority?: number;
    priorityMax?: number;
    currentTaskIndex?: number;
    totalTasks?: number;
    isCompleted?: boolean;
    onPrevious?: () => void;
    onNext?: () => void;
    onMarkFinished?: () => void;
    onDescriptionPress?: () => void;
};

export default function TaskView({
    taskKey,
    title,
    description,
    priority = 3,
    priorityMax = PRIORITY_COLORS.length,
    currentTaskIndex = 0,
    totalTasks = 1,
    isCompleted = false,
    onPrevious,
    onNext,
    onMarkFinished,
    onDescriptionPress,
}: TaskViewProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const slideAnim = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const completedAnim = useRef(new Animated.Value(isCompleted ? 1 : 0)).current;
    const previousTaskIndexRef = useRef(currentTaskIndex);
    const isFirstRenderRef = useRef(true);

    const clampedPriority = useMemo(() => {
        return Math.max(1, Math.min(priorityMax, priority));
    }, [priority, priorityMax]);

    const safeTaskCount = useMemo(() => Math.max(1, totalTasks), [totalTasks]);
    const activeTaskIndex = useMemo(
        () => Math.max(0, Math.min(safeTaskCount - 1, currentTaskIndex)),
        [currentTaskIndex, safeTaskCount],
    );

    const accentColor = useMemo(() => {
        const paletteIndex = Math.max(0, Math.min(PRIORITY_COLORS.length - 1, clampedPriority - 1));
        return PRIORITY_COLORS[paletteIndex];
    }, [clampedPriority]);

    useEffect(() => {
        if (isFirstRenderRef.current) {
            previousTaskIndexRef.current = activeTaskIndex;
            isFirstRenderRef.current = false;
            return;
        }

        const previousTaskIndex = previousTaskIndexRef.current;
        previousTaskIndexRef.current = activeTaskIndex;

        const direction =
            activeTaskIndex > previousTaskIndex ? 1 : activeTaskIndex < previousTaskIndex ? -1 : 0;

        slideAnim.setValue(direction * 24);
        fadeAnim.setValue(0.78);

        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 260,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 260,
                useNativeDriver: true,
            }),
        ]).start();
    }, [activeTaskIndex, taskKey, slideAnim, fadeAnim]);

    useEffect(() => {
        Animated.spring(completedAnim, {
            toValue: isCompleted ? 1 : 0,
            stiffness: 220,
            damping: 18,
            mass: 0.8,
            useNativeDriver: true,
        }).start();
    }, [isCompleted, completedAnim]);

    const handleDescriptionPress = () => {
        if (onDescriptionPress) {
            onDescriptionPress();
            return;
        }

        setIsExpanded((current) => !current);
    };

    return (
        <View style={styles.card}>
            <View style={[styles.cornerAccent, { backgroundColor: accentColor }]} />

            <Animated.View
                style={{
                    opacity: fadeAnim,
                    transform: [{ translateX: slideAnim }],
                }}
            >
                <View style={styles.headerRow}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.priorityRow}>
                        {Array.from({ length: priorityMax }).map((_, index) => (
                            <View
                                key={`priority-${index}`}
                                style={[
                                    styles.priorityPill,
                                    index < clampedPriority
                                        ? { backgroundColor: PRIORITY_COLORS[index % PRIORITY_COLORS.length] }
                                        : styles.priorityPillMuted,
                                ]}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.taskPagerRow}>
                    <View style={styles.taskPagerPills}>
                        {Array.from({ length: safeTaskCount }).map((_, index) => (
                            <View
                                key={`task-pill-${index}`}
                                style={[
                                    styles.taskPagerPill,
                                    index === activeTaskIndex
                                        ? [styles.taskPagerPillActive, { backgroundColor: accentColor }]
                                        : styles.taskPagerPillMuted,
                                ]}
                            />
                        ))}
                    </View>
                    <Text style={styles.taskPagerText}>{activeTaskIndex + 1}/{safeTaskCount}</Text>
                </View>

                <View style={styles.contentRow}>
                    <Pressable
                        accessibilityLabel="Previous task"
                        disabled={!onPrevious}
                        onPress={onPrevious}
                        style={[styles.navButton, !onPrevious && styles.navButtonDisabled]}
                    >
                        <MaterialCommunityIcons name="chevron-left" size={36} color="#8790B6" />
                    </Pressable>

                    <Pressable
                        accessibilityLabel="Expand task description"
                        onPress={handleDescriptionPress}
                        style={styles.descriptionTap}
                    >
                        <Text numberOfLines={isExpanded ? undefined : 4} style={styles.description}>
                            {description}
                        </Text>
                    </Pressable>

                    <Pressable
                        accessibilityLabel="Next task"
                        disabled={!onNext}
                        onPress={onNext}
                        style={[styles.navButton, !onNext && styles.navButtonDisabled]}
                    >
                        <MaterialCommunityIcons name="chevron-right" size={36} color="#8790B6" />
                    </Pressable>
                </View>

                <View style={styles.footerRow}>
                    <View style={styles.helperRow}>
                        <MaterialCommunityIcons name="gesture-tap" size={15} color="rgba(238, 238, 238, 0.72)" />
                        <Text style={styles.helperText}>Tap description to {isExpanded ? "collapse" : "expand"}</Text>
                    </View>

                    <Animated.View
                        style={{
                            transform: [
                                {
                                    scale: completedAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [1, 1.04],
                                    }),
                                },
                            ],
                        }}
                    >
                        <Pressable
                            accessibilityLabel="Mark task as finished"
                            onPress={onMarkFinished}
                            style={[
                                styles.doneButton,
                                isCompleted && [styles.doneButtonCompleted, { backgroundColor: accentColor }],
                            ]}
                        >
                            <Text style={styles.doneButtonText}>{isCompleted ? "Completed" : "Mark Finished"}</Text>
                        </Pressable>
                    </Animated.View>
                </View>
            </Animated.View>
        </View>
    );
}
