import { Menu } from '@material-ui/icons'
import Image from 'next/image'
import React, { useState } from 'react'

export const TopNav = () => {
    const [menu, setMenu] = useState(false)
    return (

        <div className="flex flex-row justify-between items-center fixed top-0 w-full px-[30px] py-5 ">
            <div className="flex fle-row items-center gap-x-2">
                <div className="h-[50px] w-[50px] rounded-full overflow-hidden">
                    <Image src="/quick.jpg" style={{ objectFit: 'cover' }} width={200} height={200} alt="logo" />
                </div>
            </div>

            <div className="md:hidden" onClick={() => setMenu(true)}>
                <Menu />
            </div>
            <div className="hidden md:flex  gap-x-4 text-white flex-row justify-center items-center mt-5">
                <a className="font-bold text-white" href="/developers">Developers</a>
                <a className="font-bold text-white" href="/about-us">About Us</a>
                <a className="font-bold text-white" href="/quick-link">Instant Links</a>
            </div>
        </div>
    )
}
