'use client'
import BreadCrumb from '@/components/Application/Admin/BreadCrumb'
import ButtonLoading from '@/components/Application/ButtonLoading'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zSchema } from '@/lib/zodSchema'
import { ADMIN_DASHBOARD, ADMIN_MEDIA_SHOW } from '@/routes/AdminPanelRoutes'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import React, { use, useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import imgPlaceHolder from '@/public/assets/images/img-placeholder.webp'
import useFetch from '@/hooks/useFetch'
import { showToast } from '@/lib/showToast'
import axios from 'axios'

const breadcrumbData = [
  {
    href: ADMIN_DASHBOARD,
    label: 'Home'

  },
  {
    href: ADMIN_MEDIA_SHOW,
    label: 'Media'

  },
  {
    href: "",
    label: 'Edit media'

  },
]

const EditMedia = ({ params }) => {
  const { id } = use(params)

  const { data: mediaData } = useFetch(`/api/media/get/${id}`)

  const [loading, setLoading] = useState(false)
  const formSchema = zSchema.pick({
    _id: true,
    alt: true,
    title: true,
  })


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      _id: "",
      alt: "",
      title: "",
    },
  });

  useEffect(() => {
    if (mediaData && mediaData.success) {
      const data = mediaData.data
      form.reset({
        _id: data._id,
        alt: data.alt,
        title: data.title
      })
    }
  }, [mediaData])

  const handleOnSubmit = async (values) => {
    try {
      setLoading(true);
      const { data: updateMediaResponse } = await axios.put('/api/media/update', values)
      if (!updateMediaResponse.success) {
        throw new Error(updateMediaResponse.message)
      }
      showToast("success", updateMediaResponse.message)
    } catch (error) {
      showToast("error", error.message)
    } finally {
      setLoading(false)
    }
  };

  return (
    <>
      <BreadCrumb breadcrumbData={breadcrumbData} />
      <Card className='py-0 rounded shadow-sm'>
        <CardHeader className=' pt-3 px-3 border-b [.border-b]:pb-2'>
          <h4 className=' text-xl font-semibold'>Edit media</h4>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(handleOnSubmit)}
              className="space-y-8"
            >
              <div className='mb-5'>
                <Image src={mediaData?.data?.secure_url || imgPlaceHolder}
                  width={150}
                  height={150}
                  alt={mediaData?.alt || "Image"}
                />
              </div>

              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="alt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Alt</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Alt"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>

              <div className="mb-5">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter title"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>

              <div className="mb-3">
                <ButtonLoading
                  type="submit"
                  text="Update media "
                  loading={loading}
                  className=" cursor-pointer"
                />
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  )
}

export default EditMedia