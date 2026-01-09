"use client";

import { useRouter } from "next/navigation";
import { IconButton } from "../IconButton/IconButton";
import { deleteQuiz } from "@/services/quizzes";

export function DeleteQuizButton({ id }: { id: string }) {
    const router = useRouter();

    const onDelete = async () => {
        const ok = confirm("Delete this quiz?");
        if (!ok) return;

        await deleteQuiz(id);
        router.refresh();
    };

    return (
        <IconButton aria-label="Delete quiz" onClick={onDelete} title="Delete">
            🗑️
        </IconButton>
    );
}
