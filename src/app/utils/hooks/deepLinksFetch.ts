import { request } from "../requestsHandler/request"


export const connectSolflare = async () => {
    let response = await request.get('https://solflare.com/ul/v1/connect')
}