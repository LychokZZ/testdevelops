import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateQuizDto, QuestionTypeDto } from './dto/create-quiz.dto';

@Injectable()
export class QuizzesService {
    constructor(private prisma: PrismaService) { }

    async create(dto: CreateQuizDto) {
        for (const q of dto.questions) {
            if (q.type === QuestionTypeDto.BOOLEAN && typeof q.correctBoolean !== 'boolean') {
                throw new BadRequestException('BOOLEAN question requires correctBoolean');
            }
            if (q.type === QuestionTypeDto.INPUT && (!q.correctText || !q.correctText.trim())) {
                throw new BadRequestException('INPUT question requires correctText');
            }
            if (q.type === QuestionTypeDto.CHECKBOX) {
                if (!q.options?.length) throw new BadRequestException('CHECKBOX question requires options');
                const correctCount = q.options.filter((o) => o.isCorrect).length;
                if (correctCount < 1) throw new BadRequestException('CHECKBOX needs at least 1 correct option');
            }
        }

        return this.prisma.$transaction(async (tx) => {
            const quiz = await tx.quiz.create({
                data: {
                    title: dto.title,
                },
            });

            for (const q of dto.questions) {
                await tx.question.create({
                    data: {
                        quizId: quiz.id,
                        type: q.type,
                        prompt: q.prompt,
                        order: q.order,
                        correctBoolean: q.type === QuestionTypeDto.BOOLEAN ? q.correctBoolean : null,
                        correctText: q.type === QuestionTypeDto.INPUT ? q.correctText : null,
                        options:
                            q.type === QuestionTypeDto.CHECKBOX
                                ? {
                                    create: (q.options ?? []).map((o) => ({
                                        text: o.text,
                                        isCorrect: o.isCorrect,
                                        order: o.order,
                                    })),
                                }
                                : undefined,
                    },
                });
            }

            return tx.quiz.findUnique({
                where: { id: quiz.id },
                include: { questions: { include: { options: true }, orderBy: { order: 'asc' } } },
            });
        });
    }

    async findAll() {
        const quizzes = await this.prisma.quiz.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { questions: true } } },
        });

        return quizzes.map((q) => ({
            id: q.id,
            title: q.title,
            questionsCount: q._count.questions,
        }));
    }

    async findOne(id: string) {
        const quiz = await this.prisma.quiz.findUnique({
            where: { id },
            include: { questions: { include: { options: true }, orderBy: { order: 'asc' } } },
        });
        if (!quiz) throw new NotFoundException('Quiz not found');
        return quiz;
    }

    async remove(id: string) {
        await this.findOne(id);
        await this.prisma.quiz.delete({ where: { id } });
        return { ok: true };
    }
}
