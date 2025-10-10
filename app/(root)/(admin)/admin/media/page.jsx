"use client";
import BreadCrumb from '@/components/Application/Admin/BreadCrumb';
import UploadMedia from '@/components/Application/Admin/UploadMedia';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ADMIN_DASHBOARD } from '@/routes/AdminPanelRoutes';
import React from 'react'

const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: "", label: 'Media' },
]

    const fetchMedia = async ( page, deleteType)=>{
        const {data: MediaResponse }= await axios.get(`/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`)
        console.log("mediaResponse", MediaResponse) //1.16:47   
        return MediaResponse
    }

const MediaPage = () => {
    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm'>
                <CardHeader className=' pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex justify-between items-center' >
                        <h4 className='font-semibold text-xl uppercase'>Media</h4>
                        <div className='flex items-center gap-5'>
                            <UploadMedia />
                        </div>
                    </div>
                </CardHeader>

                <CardContent>

                </CardContent>
            </Card>
        </div>
    )
}
export default MediaPage;