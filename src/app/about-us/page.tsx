"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import pako from 'pako';
import { Close, Menu } from "@material-ui/icons";
import { TopNav } from "@/components/navigation/TopNav";
import { SectionsText } from '@/lib/jsonitems'


export default function Home() {
    const [menu, setMenu] = useState(false)
    return (
        <div>
            <TopNav />
            <div className="flex flex-col relative justify-center items-center">
                <section className="hero h-screen border flex flex-col relative justify-center items-center">
                    <div className="hero-content">
                        <h1 className="text-[48px] text-center font-bold ">About us</h1>
                        <p className="text-center">Quick Blinks is set to make solana actions/blinks accessible to everyone.</p>
                    </div>
                    <div className="hero-image">
                        {/* <img src="path/to/hero-image.png" alt="Event Management"> */}
                    </div>
                </section>

                <section className="features w-8/12" id="features">

                    <h2>{SectionsText.title}</h2>
                    <div className="grid grid-cols-2  gap-2">

                        {SectionsText.features.map(feature =>
                            <div className="feature border p-4 bg-[#15110c] border-[#60dee8] backdrop-blur-sm flex flex-col h-[200px]  justify-center items-start rounded-xl">
                                {feature.icon}
                                <h3 className="font-bold text-[24px] leading-tight mb-2">{feature.title}</h3>
                                <p className="font-light">{feature.description}</p>
                            </div>
                        )}

                    </div>


                </section>
            </div>



        </div >

    );
}
