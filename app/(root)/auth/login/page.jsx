import { Card, CardContent } from '@/components/ui/card'
import React from 'react'
import Logo from '@/public/assets/images/logo-black-ecom.png'
import Image from 'next/image'
import { useForm } from 'react-hook-form'

const LoginPage = () => {

    const form = useForm({
        resolver:zodResolver(loginSchema),
        defaultValues:{
            email:'',
            password:''
        }
    })

  return (
    <Card className='w-[400px]'>
      <CardContent>
       <div className='flex justify-center'>
         <Image src={Logo} width={Logo.width} height={Logo.height} alt="Logo_store" className='max-w-[150px]' />
       </div>
       <div className='text-center'>
        <h1 className='text-2xl font-semibold'>Login into account</h1>
        <p>login into your account by filling out the form below</p>

       </div>
      </CardContent>
    </Card>
  )
}

export default LoginPage