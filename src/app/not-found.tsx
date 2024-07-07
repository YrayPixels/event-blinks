"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
    const [actionCarried, setActionCarried] = useState('ReceiveSol')

    return (
        <div>
            <div className="h-screen flex flex-col justify-center items-center">

                <h1 className="text-[70px] text-center md:text-[150px] font-bold">Coming Soon!</h1>
                <div className="flex flex-row justify-center items-center w-full gap-x-4">
                    <a href="/" className="text-[15px] rounded-xl w-[200px] text-center p-4 bg-[#60DEE8] hover:bg-[#ED3A4F] ">go back</a>
                </div>

            </div>

        </div>

    );
}
