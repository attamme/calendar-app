import { useMemo, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { PRIORITY_COLORS, styles } from "@/styles/task_view";

type TaskViewProps = {
    title: string;
    description: string;
    priority?: number;
    isCompleted?: boolean;
    onPrevious?: () => void;
    onNext?: () => void;
    onMarkFinished?: () => void;
    onDescriptionPress?: () => void;
};

export default function TaskView({
    title,
    description,
    priority = 3,
    isCompleted = false,
    onPrevious,
    onNext,
    onMarkFinished,
    onDescriptionPress,
}: TaskViewProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const clampedPriority = useMemo(() => {
        return Math.max(1, Math.min(5, priority));
    }, [priority]);

    const handleDescriptionPress = () => {
        if (onDescriptionPress) {
            onDescriptionPress();
            return;
        }

        setIsExpanded((current) => !current);
    };

    return (
        <View style={styles.card}>
            <View style={styles.cornerAccent} />

            <View style={styles.headerRow}>
                <Text style={styles.title}>{title}</Text>
                <View style={styles.priorityRow}>
                    {PRIORITY_COLORS.map((color, index) => (
                        <View
                            key={`priority-${index}`}
                            style={[
                                styles.priorityPill,
                                index < clampedPriority ? { backgroundColor: color } : styles.priorityPillMuted,
                            ]}
                        />
                    ))}
                </View>
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

                <Pressable
                    accessibilityLabel="Mark task as finished"
                    onPress={onMarkFinished}
                    style={[styles.doneButton, isCompleted && styles.doneButtonCompleted]}
                >
                    <Text style={styles.doneButtonText}>{isCompleted ? "Completed" : "Mark Finished"}</Text>
                </Pressable>
            </View>
        </View>
    );
}
