import { CircularProgress } from '@mui/material'
import React from 'react'

const Spinner = () => {
  return (
    <div className='d-flex justify-content-center mt-3 mb-3'>
      <CircularProgress
        thickness={5}
        sx={{
          color: 'rgba(253, 79, 2, 0.9)',
          width: '120px'
        }}
      />
    </div>
  );
}

export default Spinner;