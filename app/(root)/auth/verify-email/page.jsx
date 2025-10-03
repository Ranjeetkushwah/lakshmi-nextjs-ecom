import React,{use} from 'react'

const EmailVerification = ({params}) => {
  const {token}= use(params)
  console.log(token)
  return (
    <h1>EmailVerification</h1>
  )
}

export default EmailVerification