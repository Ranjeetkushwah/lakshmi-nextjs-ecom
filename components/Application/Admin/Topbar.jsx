'use client'
import React from 'react'
import ThemeSwitch from './ThemeSwitch'
import UserDropdown from './UserDropdown'
import { Button } from '@/components/ui/button'
import { RiMenu4Fill } from "react-icons/ri"; // Menu bar icon.
import { useSidebar } from '@/components/ui/sidebar';

const Topbar = () => {
    const { toggleSidebar } = useSidebar()
    return (
        <div className='fixed border h-17 w-full  top-0 left-0 z-30  md:ps-72 md:pe-8 flex justify-between items-center  bg-white  dark:bg-card px-5 '>
            <div className='pl-65'>   {/* fix issue of this div hide in desktop without pl-65 */}
                Search components
            </div>
            <div className='flex items-center gap-2'>
                <ThemeSwitch />
                <UserDropdown />
                <Button onClick={toggleSidebar} type='button' size='icon' className='ms-2 md:hidden'>
                    <RiMenu4Fill />
                </Button>
            </div>
        </div>
    )
}

export default Topbar