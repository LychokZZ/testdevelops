import { Header } from "../../components/Header/Header";
import { Container } from "../../components/Container/Container";
import { QuizForm } from "../../components/QuizForm/QuizForm";

export default function CreatePage() {
    return (
        <>
            <Header />
            <Container>
                <h1>Create Quiz</h1>
                <QuizForm />
            </Container>
        </>
    );
}
