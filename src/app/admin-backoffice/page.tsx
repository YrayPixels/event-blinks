"use client"
import React, { useEffect, useState } from 'react'
import { fetchNullEvents, getAllRegistrations, updateEventTransaction } from '../utils/requestsHandler'
import { Button, CircularProgress, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import { ValidateTransfer } from '../utils/web3Utils'

export default function BackOffice() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoader] = useState(false);

    useEffect(() => {
        (async () => {
            let response = await fetchNullEvents();
            setEvents(response.data)
        })()
    }, [])

    const VerifyTx = async (event: any) => {
        console.log(event);
        setLoader(true)
        let res = await ValidateTransfer(Number(process.env.NEXT_PUBLIC_CREATE_FEE), "SOL", event.owner, process.env.WALLET_ADDRESS || "13dqNw1su2UTYPVvqP6ahV8oHtghvoe2k2czkrx9uWJZ")
        if (res?.status && res?.transactionHash) {
            //Update the transaction status as paid and send mail
            setLoader(false);
            // let updateTransaction = await updateEventTransaction(event.unique_id, res?.transactionHash)
            // if (updateTransaction) {
            //     alert(`Transaction Paid Successfully`)
            // } else {
            //     alert('Transaction Failed')
            // }
        }

    }
    return (
        <div className='flex flex-row justify-center px-3 items-center'>
            <div className='border-white text-white'>
                <div className='text-center mb-2 font-bold'>These are Null Events</div>
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>S/N</TableCell>
                                <TableCell>UniqueId</TableCell>

                                <TableCell>Event Name</TableCell>
                                <TableCell align="right">Description</TableCell>
                                <TableCell align="right">Email Address</TableCell>
                                <TableCell align="right">Owner</TableCell>

                                <TableCell align="right">Location</TableCell>
                                <TableCell align="right">Created Date</TableCell>
                                <TableCell align="right">Action</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {events.length > 0 && events.map((event: any, index: number) => {
                                return (
                                    <TableRow
                                        key={index}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {index + 1}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {event.unique_id.slice(0, 4) + "..."}
                                        </TableCell>
                                        <TableCell component="th" scope="row">
                                            {event.event_name}
                                        </TableCell>
                                        <TableCell align="right">{event.description}</TableCell>
                                        <TableCell align="right">{event.email_address}</TableCell>
                                        <TableCell align="right">{event.owner.slice(0, 7) + "..."}</TableCell>

                                        <TableCell align="right">{event.location}</TableCell>
                                        <TableCell align="right">{new Date(event.created_at).toLocaleDateString()}</TableCell>
                                        <TableCell align="right">
                                            {loading ? <CircularProgress /> :
                                                <Button className='border' onClick={() => VerifyTx(event)}>Verify</Button>
                                            }
                                        </TableCell>
                                    </TableRow>
                                )
                            })}

                        </TableBody>
                    </Table>
                </TableContainer>
            </div>


        </div>
    )
}
