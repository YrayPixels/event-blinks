import { createEvent } from '@/app/utils/requestsHandler'
import { Close, Menu } from '@material-ui/icons'
import Image from 'next/image'
import React, { useState } from 'react'

export const TopNav = () => {
    const [menu, setMenu] = useState(false)

    const startEvent = async () => {
        let headersList = {
            "Accept": "*/*",
            "User-Agent": "Thunder Client (https://www.thunderclient.com)"
        }

        let dataItems = {
            "event_name": "Moses",
            "description": "kdgkjg",
            "date": "2024-08-28T04:00",
            "location": "kadkfd",
            "flyer_uri": "https://dial.to/devnet?action=solana-action:http://localhost:3000/api/events/create",
            "time": "04:00",
            "fee": "20",
            "payment_method": "USDC",
            "payment_address": "7onFqyJuCtSzSARS4C1gMpitvdSVyowpCuEdSgVvZH97",
            "owner": "7onFqyJuCtSzSARS4C1gMpitvdSVyowpCuEdSgVvZH97"
        }


        let response = await createEvent(
            dataItems.event_name,
            dataItems.description,
            dataItems.date,
            dataItems.location,
            dataItems.flyer_uri,
            dataItems.time,
            dataItems.payment_method,
            dataItems.payment_address,
            dataItems.owner,
            dataItems.fee,
        )

        console.log(response);
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
                <a href="">
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
