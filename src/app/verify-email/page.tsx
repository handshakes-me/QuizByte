"use client";

import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import React from 'react'

const page = () => {

    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    async function verifyEmail() {
        try {
            const response = await axios.post("http://localhost:3000/api/auth/verify-email", {
                token
            });
            console.log(response);
            
            if(response.data.success) {
                router.push('/login')
            }
        } catch (error) {
            console.log(error);
        }
    }

  return (
    <div>
        <button className='bg-red-500 px-4 py-1 rounded-sm m-10' onClick={verifyEmail}>Verify Email</button>
    </div>
  )
}

export default page