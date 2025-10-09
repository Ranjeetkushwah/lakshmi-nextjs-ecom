'use client'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { showToast } from '@/lib/showToast';
import { WEBSITE_LOGIN } from '@/routes/WedsitePanelRoutes';
import { logout } from '@/store/reducer/authReducer';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import React from 'react'
import { IoMdLogOut } from "react-icons/io";
import { useDispatch } from 'react-redux';

function LogOutButton() {

    const dispatch = useDispatch()
    const router = useRouter()
    const handleLogout = async () => {
        try {
            const { data: LogoutResponse } = await axios.post('/api/auth/logout')
            if (!LogoutResponse.success) {
                throw new Error(LogoutResponse.message)
            }
            dispatch(logout())
            showToast('success', LogoutResponse.message)
            router.push(WEBSITE_LOGIN)
        } catch (error) {
            showToast('error', error.message)
        }
    }

    return (
        <DropdownMenuItem onClick={handleLogout} className='cursor-pointer'>
            <IoMdLogOut color='red' />
            Logout
        </DropdownMenuItem>
    )
}
export default LogOutButton;