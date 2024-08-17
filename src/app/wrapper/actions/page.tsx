import React from 'react'

const BlinksWrapper = () => {
    return (
        <div className='bg-[url("/grid_bg.png")] h-screen flex flex-row justify-center items-center'>
            <div className=''> <button className='bg-white hover:bg-white/50 hover:text-white text-black p-2 shadow-lg rounded-xl'>
                Connect Dscvr
            </button></div>
            <div className='flex flex-col justify-center items-center space-y-6'>

                <h1 className='text-[40px]'>Import your existing blinks with a click!</h1>

                <input placeholder='paste your action get url' className='p-2 text-center border-white w-8/12  border rounded-xl  bg-black/10' />
                <button className='bg-white hover:bg-white/50 hover:text-white text-black p-2 shadow-lg rounded-xl'>
                    Generate
                </button>
            </div>

        </div>
    )
}
export default BlinksWrapper