"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import pako from 'pako';
import { CalendarToday, Close, Lock, Menu, Settings, Timeline } from "@material-ui/icons";
import { TopNav } from "@/components/navigation/TopNav";
import { HowitWorks, SectionsText, Testimonials } from '@/lib/jsonitems'
import { Avatar } from "@mui/material";


export default function Home() {
    const [menu, setMenu] = useState(false)
    return (
        <div>
            <TopNav />
            <div className="flex flex-col relative h-full top-[120px] justify-center items-center">
                <section className="hero py-4 h-screen">
                    <div className="hero-content space-y-8">
                        <h1 className="text-[60px] text-center w-8/12 m-auto text-flicker font-bold ">Effortless Event Management with Blinks</h1>
                        <p className="text-center text-[20px]">Create, manage, and sell tickets for your events with our no-code platform, powered by Solana blockchain.</p>
                        <div className="my-2 flex flex-row justify-center items-center">
                            <a href="/login" className="px-10 py-3 text-white rounded-xl bg-[#ED3A4F] hover:bg-[#60DEE8] cta-button ">Get Started</a>
                        </div>
                    </div>
                    <div className="hero-image">
                        {/* <img src="path/to/hero-image.png" alt="Event Management"> */}
                    </div>
                </section>

                <section className="features w-full h-screen py-10 bg-cover  bg-fixed bg-[url('/automation.webp')] bg-black" id="features">

                    <div className="w-10/12 h-full flex-col flex justify-center m-auto">

                        <h2 className="text-[40px] text-center mb-5 font-bold">{SectionsText.title}</h2>
                        <div className="grid grid-cols-4 gap-2   ">

                            {SectionsText.features.map((feature, index) =>
                                <div key={index} className="feature  border p-4 bg-[#15110c]/70 hover:bg-[#60DEE8]/50 border-[#60dee8]/50 backdrop-blur-lg flex flex-col h-[300px]  justify-start items-start rounded-xl">
                                    <div className="flex flex-row justify-center items-center py-3 w-full">
                                        {feature.icon == "calendar" ? <CalendarToday style={{ fontSize: 60 }} /> : feature.icon == "lock" ? <Lock style={{ fontSize: 60 }} /> : feature.icon == "gear" ? <Settings style={{ fontSize: 60 }} /> : <Timeline style={{ fontSize: 60 }} />}
                                    </div>
                                    <h3 className="font-bold text-[24px] text-center leading-tight mb-2">{feature.title}</h3>
                                    <p className="font-light text-center">{feature.description}</p>
                                </div>
                            )}

                        </div>
                    </div>



                </section>

                <section className="how-it-works bg-[url('/grid_bg.png')] py-10">
                    <h2 className="text-[40px] text-center mb-5 font-bold">How It Works</h2>
                    {HowitWorks.map((step, index) => {
                        return <div key={index} className="step relative h-screen py-5 px-5">
                            <h3 className="text-[200px] font-bold " >{step.title}-</h3>
                            <p className="p-4 rounded-xl w-[400px] text-[#60DEE8] absolute right-[170px] bottom-[160px] text-[30px]">{step.description}</p>
                        </div>
                    })}


                </section>


                <section className="testimonials w-full h-screen flex flex-col justify-center items-center py-20">
                    <h2 className="text-[40px] text-center mb-5 px-4 font-bold">Trusted by Event Organizers Worldwide</h2>
                    <div className="grid grid-cols-3 items-center w-10/12 m-auto gap-x-4">
                        {Testimonials.map((item, index) =>
                            <div className="testimonial shadow bg-white/10 h-[200px] rounded-xl p-5 flex flex-col justify-center items-center">
                                <div className="flex flex-row gap-x-2">
                                    <Avatar style={{
                                        width: 100,
                                        height: 100,
                                    }} className="text-[50px]" />
                                    <div>
                                        <p className="text-[14px]">{item.text}</p>
                                        <h4 className="font-bold text-[#60DEE8]">{item.name}, {item.company}</h4>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                </section>

            </div>



        </div >

    );
}
