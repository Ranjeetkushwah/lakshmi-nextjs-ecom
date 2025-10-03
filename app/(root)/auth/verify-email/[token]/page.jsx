"use client"
import { Card, CardContent } from '@/components/ui/card'
import axios from 'axios'
import React, { use } from 'react'
import verifiedImg from '@/public/assets/images/verified.gif'
import verifiedFailedImg from '@/public/assets/images/verification-failed.gif'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { WEBSITE_HOME } from '@/routes/WedsitePanelRoutes'
import Image from 'next/image'

const EmailVerification = ({ params }) => {

  const { token } = use(params)
  const [isVerified, setIsVerified] = React.useState(false)

  const verify = async () => {
    const { data: verifyResponse } = await axios.post('/api/auth/verify-email', { token })
    if (verifyResponse.success) {
      setIsVerified(true)
    }
  }

  React.useEffect(() => {
    verify()
  }, [token])
  return (
    <>
      <Card className='w-[400px]'>
        <CardContent>
          {
            isVerified ?
              <div>
                <div className='flex justify-center items-center'>
                  <Image src={verifiedImg.src} height={verifiedImg.height} width={verifiedImg.width} className='h-[100px] w-auto' alt="Verified successfully" />
                </div>
                <div className='text-center'>
                  <h2 className='text-2xl text-green-500 text-center font-bold my-5'>Email verified successfully !</h2>
                  <Button asChild>
                    <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                  </Button>
                </div>
              </div>
              : <div>
                <div className='flex justify-center items-center'>
                  <Image src={verifiedFailedImg.src} height={verifiedFailedImg.height} width={verifiedFailedImg.width} className='h-[100px] w-auto' alt="Verified failed" />
                </div>
                <div className='text-center'>
                  <h2 className='text-2xl text-red-500 text-center font-bold my-5'>Email verification failed !!</h2>
                  <Button asChild>
                    <Link href={WEBSITE_HOME}>Continue Shopping</Link>
                  </Button>
                </div>
              </div>
          }

        </CardContent>
      </Card>

    </>
  )
}

export default EmailVerification