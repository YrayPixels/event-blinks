import { checkIfAnswered, fetchQuiz, fetchSingleQuestion, submitAnswer } from '@/app/utils/quizHandler';
import { NETWORK, createEvent } from '@/app/utils/requestsHandler';
import { ACTIONS_CORS_HEADERS, ActionError, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';
import { createTransferInstruction, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount } from '@solana/spl-token';
import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, TransactionInstruction, clusterApiUrl } from '@solana/web3.js';



export const GET = async (req: Request) => {
    try {
        const url = new URL(req.url);

        const params = new URLSearchParams(url.search);
        const questionId = params.get('question');

        if (!questionId) {
            const error: ActionError = {
                message: "Invalid Question ID",
            }
            return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
        }

        //work on timing here.
        // fetch Question
        // let res = await fetchQuiz();
        let res = await fetchSingleQuestion(questionId);
        let quiz = res.data;

        let options: any = []
        JSON.parse(quiz.options).forEach((option: any) => {
            options.push({
                value: option,
                label: option,
            })
        })
        //last time + new time = main time

        const payload = {
            icon: `${process.env.NEXT_PUBLIC_HOST_URL}/dscvr.png`,
            title: "Daily DSCVR Quiz",
            description: `\n Question ${questionId}: ${quiz.question}`,
            links: {
                actions: [
                    {
                        href: `/api/dscvr-quiz?question=${questionId}`,
                        label: 'Submit Answer',
                        parameters: [
                            {
                                name: "name",
                                label: 'please enter your name: pseudo names are allowed', // text input placeholder
                                type: "text",
                            },
                            {
                                name: "answer",
                                label: 'Choose from the options below', // text input placeholder
                                type: "radio",
                                options: options
                            },
                        ],

                    }
                ],
                // next: '/events/create',
            }
        };

        return new Response(JSON.stringify(payload), {
            headers: ACTIONS_CORS_HEADERS
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ message: "Error parsing request", error: error?.response?.message }), {
            headers: ACTIONS_CORS_HEADERS,
            status: 500
        });
    }
};

export const OPTIONS = GET;

export const POST = async (req: Request) => {
    try {

        const url = new URL(req.url);
        const params = new URLSearchParams(url.search);
        const questionId = params.get('question');

        if (!questionId) {
            const error: ActionError = {
                message: "Invalid Question ID",
            }
            return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
        }
        //fetch question
        let res = await fetchSingleQuestion(questionId);
        let quiz = res.data;

        const body: ActionPostRequest = await req.json();
        let data: any = body?.data;

        //Check if the user has answered.
        let check = await checkIfAnswered(body.account, questionId)
        if (check.data.status) {
            const error: ActionError = {
                message: "You have already answered this question, Kindly Wait for Tomorrow's Questions!",
            }
            return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
        }

        let payload: ActionPostResponse;
        if (data.answer === quiz.answer) {

            let submitted = await submitAnswer(questionId, data.answer, body.account)
            const connection = new Connection(NETWORK, 'confirmed');

            const transferTransaction = new Transaction();
            // Memo program ID (fixed for the memo program)
            const MEMO_PROGRAM_ID = new PublicKey("MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr");
            const memoInstruction = new TransactionInstruction({
                keys: [],
                programId: MEMO_PROGRAM_ID,
                data: Buffer.from("Congrats For Getting The Answer")
            });


            transferTransaction.add(memoInstruction);

            transferTransaction.feePayer = new PublicKey(body.account);
            transferTransaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
            payload = await createPostResponse({
                fields: {
                    transaction: transferTransaction,
                    message: "Correct Answer Horray!!",
                },
            })
        } else {
            const error: ActionError = {
                message: "InCorrect Answer Try Again!!",
            }
            return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
        }

        return Response.json(payload, { status: 200, headers: ACTIONS_CORS_HEADERS })

    } catch (e: any) {
        const error: ActionError = {
            message: `${e.response.message}`,
        }
        return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
}
