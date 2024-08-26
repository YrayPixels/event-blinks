import { request } from "../requestsHandler/request";

export const fetchQuiz = async () => {
    let response = await request.get(`/load-quiz-item`)
    return response;
}