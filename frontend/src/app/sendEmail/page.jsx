'use client';
import React, { useEffect, useState } from 'react'
import { SVG } from '../../components/svg/SVG';
import { Button } from '@mui/material';
import CustomButton from '../../components/@generalComponents/CustomButton';

const SendEmail = () => {



  return (
    <div className='container'>
      <div
        style={{
          position: 'absolute',
          left: '120px',
          top: '50px',
          width: '50px',
        }}
      >
      </div>
      <div className='row d-flex justify-content-center align-items-center vh-100'>
        <div className='col-md-6 pt-4'>
          <div className='onboard-card'>
            <div className='d-flex justify-content-center'>
            <SVG/>
            </div>
            <h2 className='text-center mb-0 mt-4'>Email verification</h2>
            <div className='d-flex justify-content-center'>
            </div>
            <p className='f-reg font-inter grey text-center mt-4 font-medium' style={{ fontSize: '14px' }}>
            Please confirm that you want to use this as your account email address. Once it’s done you will be able to start account!             
            </p>
            <div className='d-flex justify-content-center mt-4'>
          {/* <Button style={{background:'#FD4F02',color:'white',fontSize:'12px',textTransform:'none'}} >Verify my email</Button> */}
          <CustomButton
          type='medium-purple'
          label='Verify my email'
          customStyle={{ marginTop: '10px',width:'130px' }}
        />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SendEmail;