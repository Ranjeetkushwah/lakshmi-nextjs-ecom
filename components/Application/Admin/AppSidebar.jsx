import React from 'react'
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Image from 'next/image'
import logoBlack from '@/public/assets/images/logo-black-ecom.png'
import logoWhite from '@/public/assets/images/logo-white-ecom.png'
import { Button } from '@/components/ui/button'
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminAppSidebarMenu } from '@/lib/adminSidebarMenu'

function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className='border-b h-17 p-0' >
        <div className='flex justify-between items-center px-4 '>
            <Image src={logoBlack.src} height={50} width={logoBlack.width}  className='block dark:hidden h-[80px] w-auto' alt='logo dark' />
            <Image src={logoWhite.src} height={50} width={logoWhite.width} className='hidden dark:block h-[80px] w-auto'  alt='logo white' />
            <Button type='button' size='icon' className='bg-blue-600 hover:bg-blue-500'>
                <IoMdClose/>
            </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {/* {
            adminAppSidebarMenu.map((menu,index)=>(

            ))
          } */}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  )
}

export default AppSidebar
