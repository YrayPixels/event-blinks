import { fetchQuiz } from '@/app/utils/quizHandler'
import { NETWORK, createEvent, createEventTicket, fetchEvent } from '@/app/utils/requestsHandler'
import { TransferUsdc, ValidateTransfer } from '@/app/utils/web3Utils'
import { Close, Menu } from '@material-ui/icons'
import { PublicKey } from '@solana/web3.js'
import Image from 'next/image'
import React, { useState } from 'react'

export const TopNav = () => {
    const [menu, setMenu] = useState(false)


    const startEvent = async () => {


        try {        // fetch Question
            let res = await fetchQuiz();
            let quiz = res.data;
            console.log(quiz)
        } catch (e) {
            console.log(e);
        }
        //last time

    }
    return (

        <div className="flex flex-row justify-between bg-black/50 backdrop-blur-md items-center z-50 fixed top-0 w-full px-[30px] py-5 ">
            <div className="flex flex-row items-center gap-x-2">
                <a href='/' className="h-[50px] w-[50px] rounded-full overflow-hidden">
                    <Image src="/quick.jpg" style={{ objectFit: 'cover' }} width={200} height={200} alt="logo" />
                </a>
            </div>

            <div className="md:hidden" onClick={() => setMenu(true)}>
                <Menu />
            </div>
            <div className="hidden md:flex  w-5/12 flex-row justify-between items-center ">
                <a className="" href="/create-events">Events</a>
                <a className="" href="/developers">Developers</a>
                <a className="" href="/about-us">About Us</a>
                <a className="" href="/quick-link">Instant Links</a>
            </div>
            <div>
                <a onClick={() => startEvent()}>
                    <button className="px-10 py-2 text-white rounded-xl bg-[#ED3A4F] hover:bg-[#60DEE8]">Login</button>
                </a>
            </div>

            {
                menu &&
                <div className="flex  fixed  z-50  bg-black top-0 h-screen w-screen bg-black gap-y-8  flex-col justify-start pt-10 items-center mt-5">
                    <div>
                        <div onClick={() => setMenu(false)}>
                            <Close />
                        </div>
                    </div>
                    <a className="font-bold" href="/create-events">Events</a>

                    <a className="font-bold " href="/developers">Developers</a>
                    <a className="font-bold " href="/about-us">About Us</a>
                    <a className="font-bold " href="/quick-link">Instant Links</a>
                </div>
            }
        </div>
    )
}
