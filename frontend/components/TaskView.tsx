import React from "react";
import { Pressable, Text, View } from "react-native";
import Button from "@/components/button";
import { styles } from "@/styles/task_view";

type TaskViewProps = {
    title?: string;
    description?: string;
    priorityColor?: string;
    statusColors?: string[];
    deleteLabel?: string;
    editLabel?: string;
    finishLabel?: string;
    onDelete?: () => void;
    onEdit?: () => void;
    onFinish?: () => void;
    onPrevious?: () => void;
    onNext?: () => void;
};

const defaultStatusColors = ["#FF7403", "#FFA100","#FD0", "#FFF600", "#BFFF00"];

export default function TaskView({
    title = "My current task name here",
    description = "The task description is written here, just write anything here. You can tap this to extend it. I repeat The task description is written here. You can tap to extend it.",
    priorityColor = "#FF373E",
    statusColors = defaultStatusColors,
    deleteLabel = "Delete",
    editLabel = "Edit",
    finishLabel = "Finished",
    onDelete,
    onEdit,
    onFinish,
    onPrevious,
    onNext,
}: TaskViewProps) {
    return (
        <View style={styles.container}>
            <View style={styles.card}>
                <View style={styles.headerRow}>
                    <View style={styles.headerLeft}>
                        <View style={[styles.priorityPill, { backgroundColor: priorityColor }]} />
                        <Text style={styles.title} numberOfLines={1}>
                            {title}
                        </Text>
                    </View>

                    <View style={styles.statusRow}>
                        {statusColors.map((color, index) => (
                            <View
                                key={`${color}-${index}`}
                                style={[
                                    styles.statusBar,
                                    index === 0 ? { marginLeft: 0 } : null,
                                    { backgroundColor: color },
                                ]}
                            />
                        ))}
                    </View>
                </View>

                <View style={styles.contentRow}>
                    <Pressable style={styles.navButton} onPress={onPrevious} hitSlop={8}>
                        <Text style={styles.navText}>‹</Text>
                    </Pressable>

                    <Text style={styles.description} numberOfLines={4}>
                        {description}
                    </Text>

                    <Pressable style={styles.navButton} onPress={onNext} hitSlop={8}>
                        <Text style={styles.navText}>›</Text>
                    </Pressable>
                </View>

                <View style={styles.handle} />
            </View>

            <View style={styles.actionsRow}>
                <Button title={deleteLabel} onPress={onDelete} style={[styles.actionButton, styles.deleteButton]} />
                <Button title={editLabel} onPress={onEdit} style={[styles.actionButton, styles.editButton]} />
                <Button title={finishLabel} onPress={onFinish} style={[styles.actionButton, styles.finishButton]} />
            </View>
        </View>
    );
}
