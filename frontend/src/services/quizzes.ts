import { api } from "./api";
import { Quiz, QuizListItem } from "@/types/quiz";

export async function getQuizzes() {
    const res = await api.get<QuizListItem[]>("/quizzes");
    return res.data;
}

export async function getQuiz(id: string) {
    const res = await api.get<Quiz>(`/quizzes/${id}`);
    return res.data;
}

export async function createQuiz(payload: { title: string; questions: any[] }) {
    const res = await api.post("/quizzes", payload);
    return res.data;
}

export async function deleteQuiz(id: string) {
    const res = await api.delete(`/quizzes/${id}`);
    return res.data;
}
