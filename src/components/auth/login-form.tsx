import React from 'react'
import AuthCard from './auth-card'

const LoginForm = () => {
  return (
    <AuthCard cardTitle='Welcome Back!'
    backButtonHref='/auth/register'
    backButtonLabel='Create a new account'
    showSocials
    >
      <div>
        <h1>hii</h1>
      </div>

    </AuthCard>
  )
}

export default LoginForm