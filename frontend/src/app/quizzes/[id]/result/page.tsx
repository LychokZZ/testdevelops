"use client";

import { useSearchParams } from "next/navigation";
import { Header } from "@/components/Header/Header";
import { Container } from "@/components/Container/Container";
import { Button } from "@/components/Button/Button";
import Link from "next/link";

export default function ResultPage() {
    const params = useSearchParams();
    const score = Number(params.get("score"));
    const total = Number(params.get("total"));

    return (
        <>
            <Header />
            <Container>
                <h1>Result</h1>
                <p>
                    You scored <strong>{score}</strong> out of{" "}
                    <strong>{total}</strong>
                </p>

                <div style={{ marginTop: 16 }}>
                    <Link href="/quizzes">
                        <Button>Back to quizzes</Button>
                    </Link>
                </div>
            </Container>
        </>
    );
}
