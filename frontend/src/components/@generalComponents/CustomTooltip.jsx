import React from 'react'
import InfoIcon from '@mui/icons-material/Info';
import { IconButton, Tooltip } from '@mui/material';

const CustomTooltip = ({ title }) => {
  return (
    <Tooltip disableFocusListener placement='top' title={title}>
      <InfoIcon fontSize='small' />
    </Tooltip>
  )
}

export default CustomTooltip;