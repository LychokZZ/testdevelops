export type QuestionType = "BOOLEAN" | "INPUT" | "CHECKBOX";

export type Option = {
    text: string;
    isCorrect: boolean;
    order: number;
};

export type Question = {
    type: QuestionType;
    prompt: string;
    order: number;

    correctBoolean?: boolean;
    correctText?: string;

    options?: Option[];
};

export type QuizListItem = {
    id: string;
    title: string;
    questionsCount: number;
};

export type Quiz = {
    id: string;
    title: string;
    questions: (Question & { id: string; options?: (Option & { id: string })[] })[];
};
