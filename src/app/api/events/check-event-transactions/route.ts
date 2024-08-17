import { NETWORK, createEventTicket, fetchEvent, fetchNullEvents, fetchTickets, updateEventTransaction } from '@/app/utils/requestsHandler';
import { TransferSol, TransferUsdc, ValidateTransfer } from '@/app/utils/web3Utils';
import { ACTIONS_CORS_HEADERS, ActionError, ActionGetResponse, ActionPostRequest, ActionPostResponse, createPostResponse } from '@solana/actions';



export const GET = async (req: Request) => {

    try {

        //fetch all events and get those whose transactions are null
        let events = await fetchNullEvents();

        let validated = [];

        for (let event of events?.data) {
            let res = await ValidateTransfer(Number(process.env.NEXT_PUBLIC_CREATE_FEE), "SOL", event.owner, process.env.WALLET_ADDRESS || "13dqNw1su2UTYPVvqP6ahV8oHtghvoe2k2czkrx9uWJZ")

            if (res?.status && res?.transactionHash) {

                //Update the transaction status as paid and send mail
                let updateTransaction = await updateEventTransaction(event.unique_id, res?.transactionHash)
                if (updateTransaction) {
                    validated.push({ owner: event.owner, name: event.event_name, })
                }
            }
        }


        let data = {
            status: "Batch Completed",
            message: JSON.stringify(validated),
        }

        return Response.json(data, { status: 200, headers: ACTIONS_CORS_HEADERS })

    } catch (er: any) {
        const error: ActionError = {
            message: `${er.response.message}`,
        }
        return Response.json(error, { status: 400, headers: ACTIONS_CORS_HEADERS })
    }
};

export const OPTIONS = GET;

