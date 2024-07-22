"use client"
import CustomInput from '@/components/customInput/customInput'
import { TopNav } from '@/components/navigation/TopNav'
import { ArrowForward, LockRounded, MailOutlineRounded, VisibilityOffRounded, VisibilityRounded } from '@material-ui/icons'
import { ReportGmailerrorredRounded } from '@mui/icons-material'
import React, { useState } from 'react'

export default function Login() {

    const [userDetails, setUserDetails] = useState({
        email_address: "",
        password: ""
    })
    const [showPassword, setShowPassword] = useState(false)

    const [error, setError] = useState({
        active: false,
        type: "",
        message: ""
    })
    return (
        <div className="flex flex-col justify-start items-center py-10 ">
            <TopNav />


            <div className='w-6/12  mt-20'>
                <h2 className='text-center font-bold  text-[24px]'>Sign Up</h2>
                <CustomInput
                    className=""
                    error={error.active}
                    sx={{ marginBottom: "10px" }}
                    label="Email Address"
                    placeholder="Enter email address"
                    onChange={(e) => setUserDetails({ ...userDetails, email_address: e.target.value })}
                    type="email"
                    addOnStart={<MailOutlineRounded color="inherit" />}
                />


                <CustomInput
                    className=""
                    onChange={(e) => setUserDetails({ ...userDetails, password: e.target.value })}
                    sx={{ marginBottom: "10px" }}
                    value={userDetails.password}
                    name={"password"}
                    autocomplete="new-password"
                    label="Enter Password"
                    placeholder="Enter password"
                    type={showPassword ? "text" : "password"}
                    addOnStart={<LockRounded color="inherit" />}
                    addOnEnd={
                        !showPassword ? (
                            <VisibilityRounded
                                onClick={() => {
                                    setShowPassword(!showPassword);
                                }}
                                className="text-[#E1F6B1]"
                            />
                        ) : (
                            <VisibilityOffRounded
                                onClick={() => {
                                    setShowPassword(!showPassword);
                                }}
                                className="text-[#E1F6B1]"
                            />
                        )
                    }
                />
            </div>



        </div>
    )
}
