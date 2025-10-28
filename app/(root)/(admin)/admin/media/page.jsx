"use client"
import BreadCrumb from '@/components/Application/Admin/BreadCrumb';
import Media from '@/components/Application/Admin/Media';
import UploadMedia from '@/components/Application/Admin/UploadMedia';
import ButtonLoading from '@/components/Application/ButtonLoading';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import useDeleteMutation from '@/hooks/useDeleteMutation';
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoutes';
import { useInfiniteQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import { MdDelete } from 'react-icons/md';


const breadcrumbData = [
    { href: ADMIN_DASHBOARD, label: 'Home' },
    { href: "", label: 'Media' },
]

const MediaPage = () => {

    const queryClient = useQueryClient()

    const [deleteType, setDeleteType] = useState('SD');
    const [selectedMedia, setSelectedMedia] = useState([])
    const [selectAll, setSelectedAll] = useState(false)
    const searchParams = useSearchParams()

    useEffect(() => {
        if (searchParams) {
            const trashof = searchParams.get('trashof')
            setSelectedMedia([])
            if (trashof) {
                setDeleteType('PD')
            } else {
                setDeleteType('SD')
            }
        }
    }, [searchParams])

    const fetchMedia = async (page, deleteType) => {
        const { data: MediaResponse } = await axios.get(`/api/media?page=${page}&&limit=10&&deleteType=${deleteType}`)
        return MediaResponse
    }

    const {
        data,
        error,
        fetchNextPage,
        hasNextPage,
        isFetching,
        status,
    } = useInfiniteQuery({
        queryKey: ['media-data', deleteType],
        queryFn: async ({ pageParam }) => await fetchMedia(pageParam, deleteType),
        initialPageParam: 0,
        getNextPageParam: (lastPage, pages) => {
            const nextPage = pages.length;
            return lastPage.hasMore ? nextPage : undefined
        },
    })

    const deleteMutation = useDeleteMutation('media-data', '/api/media/delete')

    const handleDelete = (ids, deleteType) => {
        let c = true;
        if (deleteType === 'PD') {
            c = confirm("Are you sure? You want to delete permanently.")
        }
        if (c) {
            deleteMutation.mutate({ ids, deleteType })

        }
        setSelectedAll(false)
        setSelectedMedia([])
    }

    const handleSelectAll = () => {
        setSelectedAll(!selectAll)
    }

    useEffect(() => {
        if (selectAll) {
            const ids = data.pages.flatMap(page => page.mediaData.map(media => media._id))
            setSelectedMedia(ids)
        } else {
            setSelectedMedia([])
        }
    }, [selectAll])
    return (
        <div>
            <BreadCrumb breadcrumbData={breadcrumbData} />
            <Card className='py-0 rounded shadow-sm'>
                <CardHeader className=' pt-3 px-3 border-b [.border-b]:pb-2'>
                    <div className='flex justify-between items-center' >
                        <h4 className='font-semibold text-xl uppercase'>
                            {deleteType === 'SD' ? 'Media' : 'Media Trash'}
                        </h4>
                        <div className='flex items-center gap-5'>
                            {deleteType === 'SD' && <UploadMedia isMultiple={true} queryClient={queryClient} />}
                            <div className="flex gap-3">
                                {
                                    deleteType === 'SD' ?
                                        <Button type='button' variant='destructive' >
                                            <MdDelete color='white' />
                                            <Link href={`${ADMIN_MEDIA_SHOW}?trashof=media`}>Trash</Link>
                                        </Button>
                                        :
                                        <Button type='button'>
                                            <Link href={`${ADMIN_MEDIA_SHOW}`}>Back to Media</Link>
                                        </Button>
                                }
                            </div>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {
                        selectedMedia.length > 0 &&
                        <div className='py-2 px-3 bg-blue-500 mb-2 rounded flex justify-between items-center'>
                            <Label>
                                <Checkbox
                                    checked={selectAll}
                                    onCheckedChange={handleSelectAll}
                                    className='border-primary'
                                />
                                Select All
                            </Label>

                            <div className='flex gap-2'>
                                {
                                    deleteType === 'SD' ?
                                        <Button type='button' variant='destructive'
                                            onClick={() => handleDelete(selectedMedia, deleteType)}
                                            className='cursor-pointer'>
                                            Move into Trash
                                        </Button>
                                        :
                                        <React.Fragment>
                                            <Button type='button' className='bg-green-500 hover:bg-green-600 cursor-pointer' onClick={() => handleDelete(selectedMedia, "RSD")}>
                                                Restore
                                            </Button>

                                            <Button type='button' className='cursor-pointer bg-red-500 hover:bg-red-600' onClick={() => handleDelete([selectedMedia], deleteType)}  >
                                                Delete Permanently
                                            </Button>
                                        </React.Fragment>
                                }
                            </div>
                        </div>
                    }

                    {
                        status === 'pending' ?
                            <div>Loading...</div> :
                            status === 'error' ?
                                <> <div className='text-red-500 text-sm'>Error: {error.message}</div> </>
                                :
                                <>
                                    {data.pages.flatMap(page => page?.mediaData?.map(media => media._id)).length === 0 && <div className='text-center'>No media found.</div>}

                                    <div className='grid lg:grid-cols-5 sm:grid-cols-3 grid-cols-2 gap-2 mb-5'>

                                        {data?.pages.map((page, index) => (
                                            <React.Fragment key={index}>
                                                {
                                                    page?.mediaData?.map((media) => (<>
                                                        <Media key={media._id}
                                                            media={media}
                                                            handleDelete={handleDelete}
                                                            deleteType={deleteType}
                                                            selectedMedia={selectedMedia}
                                                            setSelectedMedia={setSelectedMedia}
                                                        />

                                                    </>
                                                    ))
                                                }

                                            </React.Fragment>
                                        ))}
                                    </div>
                                </>
                    }

                    {
                        hasNextPage && (
                            <div className="flex justify-center mt-4">
                                <ButtonLoading
                                    type='button'
                                    onClick={() => fetchNextPage()}
                                    loading={isFetching}
                                    text='Load More'
                                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 mb-3 cursor-pointer"
                                />
                            </div>
                        )
                    }
                </CardContent>
            </Card>
        </div>
    )
}
export default MediaPage;



