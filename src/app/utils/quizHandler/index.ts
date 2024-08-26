import { request } from "../requestsHandler/request";

export const fetchQuiz = async () => {
    let response = await request.get(`/load-quiz-item`)
    return response;
}

export const fetchSingleQuestion = async (question_id: string) => {
    let response = await request.get(`/fetch-one-question/${question_id}`)
    return response;
}

export const checkIfAnswered = async (user_id: string, question_id: string) => {
    let response = await request.get(`/check-if-answer/${user_id}/${question_id}`)
    return response;
}

export const submitAnswer = async (ques_id: string, answer: string, participant: string) => {
    let bodyContent = new FormData();
    bodyContent.append("answer", answer);
    bodyContent.append("participant", participant);

    let response = await request.post({ url: `/answer-quiz/${ques_id}`, data: bodyContent })
    return response;
}