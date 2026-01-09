"use client";

import styles from "./QuizForm.module.scss";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../Button/Button";
import { createQuiz } from "@/services/quizzes";
import { useRouter } from "next/navigation";

const optionSchema = z.object({
    text: z.string().min(1, "Required"),
    isCorrect: z.boolean(),
    order: z.number().int().min(0),
});

const questionSchema = z
    .object({
        type: z.enum(["BOOLEAN", "INPUT", "CHECKBOX"]),
        prompt: z.string().min(1, "Required"),
        order: z.number().int().min(0),
        correctBoolean: z.boolean().optional(),
        correctText: z.string().optional(),
        options: z.array(optionSchema).optional(),
    })
    .superRefine((q, ctx) => {
        if (q.type === "BOOLEAN" && typeof q.correctBoolean !== "boolean") {
            ctx.addIssue({ code: "custom", message: "Select correct True/False", path: ["correctBoolean"] });
        }
        if (q.type === "INPUT" && (!q.correctText || !q.correctText.trim())) {
            ctx.addIssue({ code: "custom", message: "Provide correct text", path: ["correctText"] });
        }
        if (q.type === "CHECKBOX") {
            if (!q.options?.length) {
                ctx.addIssue({ code: "custom", message: "Add options", path: ["options"] });
            } else {
                const correct = q.options.filter((o) => o.isCorrect).length;
                if (correct < 1) {
                    ctx.addIssue({ code: "custom", message: "Mark at least 1 correct option", path: ["options"] });
                }
            }
        }
    });

const formSchema = z.object({
    title: z.string().min(1, "Title is required"),
    questions: z.array(questionSchema).min(1, "Add at least 1 question"),
});

type FormValues = z.infer<typeof formSchema>;

export function QuizForm() {
    const router = useRouter();

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
            questions: [
                { type: "BOOLEAN", prompt: "", order: 0, correctBoolean: true, options: [] },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({ control, name: "questions" });
    const questions = watch("questions");

    const addQuestion = (type: "BOOLEAN" | "INPUT" | "CHECKBOX") => {
        const order = questions.length;
        append({
            type,
            prompt: "",
            order,
            correctBoolean: type === "BOOLEAN" ? true : undefined,
            correctText: type === "INPUT" ? "" : undefined,
            options:
                type === "CHECKBOX"
                    ? [
                        { text: "", isCorrect: true, order: 0 },
                        { text: "", isCorrect: false, order: 1 },
                    ]
                    : [],
        });
    };

    const removeQuestion = (idx: number) => {
        remove(idx);
        const after = watch("questions") || [];
        after.forEach((_, i) => setValue(`questions.${i}.order`, i));
    };

    const onSubmit = async (values: FormValues) => {
        const payload = {
            title: values.title,
            questions: values.questions.map((q, qi) => ({
                ...q,
                order: qi,
                options:
                    q.type === "CHECKBOX"
                        ? (q.options ?? []).map((o, oi) => ({ ...o, order: oi }))
                        : undefined,
            })),
        };

        const created = await createQuiz(payload);
        router.push(`/quizzes/${created.id}`);
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
            <div className={styles.field}>
                <label>Quiz title</label>
                <input className={styles.input} placeholder="e.g. JS Basics" {...register("title")} />
                {errors.title && <small className={styles.error}>{errors.title.message}</small>}
            </div>

            <div className={styles.toolbar}>
                <Button type="button" variant="ghost" onClick={() => addQuestion("BOOLEAN")}>
                    + Boolean
                </Button>
                <Button type="button" variant="ghost" onClick={() => addQuestion("INPUT")}>
                    + Input
                </Button>
                <Button type="button" variant="ghost" onClick={() => addQuestion("CHECKBOX")}>
                    + Checkbox
                </Button>
            </div>

            <div className={styles.list}>
                {fields.map((f, idx) => {
                    const type = questions[idx]?.type;

                    return (
                        <div key={f.id} className={styles.card}>
                            <div className={styles.cardTop}>
                                <strong>Q{idx + 1} — {type}</strong>
                                <Button type="button" variant="danger" onClick={() => removeQuestion(idx)}>
                                    Remove
                                </Button>
                            </div>

                            <div className={styles.field}>
                                <label>Prompt</label>
                                <input className={styles.input} {...register(`questions.${idx}.prompt`)} />
                                {errors.questions?.[idx]?.prompt && (
                                    <small className={styles.error}>{errors.questions[idx]?.prompt?.message}</small>
                                )}
                            </div>

                            {type === "BOOLEAN" && (
                                <div className={styles.row}>
                                    <label className={styles.radio}>
                                        <input
                                            type="radio"
                                            checked={watch(`questions.${idx}.correctBoolean`) === true}
                                            onChange={() => setValue(`questions.${idx}.correctBoolean`, true)}
                                        />
                                        True
                                    </label>
                                    <label className={styles.radio}>
                                        <input
                                            type="radio"
                                            checked={watch(`questions.${idx}.correctBoolean`) === false}
                                            onChange={() => setValue(`questions.${idx}.correctBoolean`, false)}
                                        />
                                        False
                                    </label>
                                    {errors.questions?.[idx]?.correctBoolean && (
                                        <small className={styles.error}>
                                            {errors.questions[idx]?.correctBoolean?.message as any}
                                        </small>
                                    )}
                                </div>
                            )}

                            {type === "INPUT" && (
                                <div className={styles.field}>
                                    <label>Correct answer</label>
                                    <input className={styles.input} {...register(`questions.${idx}.correctText`)} />
                                    {errors.questions?.[idx]?.correctText && (
                                        <small className={styles.error}>{errors.questions[idx]?.correctText?.message}</small>
                                    )}
                                </div>
                            )}

                            {type === "CHECKBOX" && (
                                <CheckboxEditor qIndex={idx} control={control} register={register} />
                            )}
                        </div>
                    );
                })}
            </div>

            <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Create quiz"}
            </Button>
        </form>
    );
}

function CheckboxEditor({ qIndex, control, register }: any) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `questions.${qIndex}.options`,
    });

    return (
        <div className={styles.checkbox}>
            <div className={styles.checkboxTop}>
                <strong>Options</strong>
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => append({ text: "", isCorrect: false, order: fields.length })}
                >
                    + Add option
                </Button>
            </div>

            <div className={styles.options}>
                {fields.map((f: any, i: number) => (
                    <div key={f.id} className={styles.optionRow}>
                        <input type="checkbox" {...register(`questions.${qIndex}.options.${i}.isCorrect`)} />
                        <input className={styles.input} {...register(`questions.${qIndex}.options.${i}.text`)} placeholder={`Option ${i + 1}`} />
                        <Button type="button" variant="danger" onClick={() => remove(i)}>
                            X
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
