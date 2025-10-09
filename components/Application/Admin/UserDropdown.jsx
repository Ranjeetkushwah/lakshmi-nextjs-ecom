'use client'
import React from 'react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useSelector } from 'react-redux'
import Link from 'next/link'
import { IoShirtOutline } from "react-icons/io5"; // User dropdown icon.
import { MdOutlineShoppingBag } from "react-icons/md";
import LogOutButton from './LogOutButton'

function UserDropdown() {
    const auth = useSelector((store) => store.authStore.auth)
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='me-5 w-44'>
                <DropdownMenuLabel>
                    <p className='font-semibold'>{auth?.name}</p>
                    {/* <span className='font-normal text-sm line-clamp-1'>{auth?.email}</span> */}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                    <Link href='#' className='cursor-pointer'>
                    <IoShirtOutline/>
                    New Product
                     </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href='#' className='cursor-pointer'>
                    <MdOutlineShoppingBag/>
                    Orders
                     </Link>
                </DropdownMenuItem>
                <LogOutButton/>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserDropdown