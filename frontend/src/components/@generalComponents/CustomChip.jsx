import { Chip } from '@mui/material';
import React from 'react';

const CustomChip = ({ label, type, sx, onClick }) => {
  if (type === 'purple')
    return (
      <Chip
        label={label}
        onClick={onClick}
        sx={{
          color: '#000000',
          backgroundColor: '#EAE9FE',
          borderRadius: '6px',
          height: '20px',
          '& .MuiChip-label': {
            paddingLeft: '7px',
            paddingRight: '7px',
          },
          ...sx,
        }}
      />
    );
  else if (type === 'orange')
    return (
      <Chip
        label={label}
        onClick={onClick}
        sx={{
          color: '#F07006',
          backgroundColor: '#FFF0DB',
          borderRadius: '6px',
          height: '20px',
          '& .MuiChip-label': {
            paddingLeft: '7px',
            paddingRight: '7px',
          },
          ...sx,
        }}
      />
    );
  else if (type === 'green')
    return (
      <Chip
        label={label}
        onClick={onClick}
        sx={{
          color: '#629C28',
          backgroundColor: '#E6F6D1',
          borderRadius: '6px',
          height: '20px',
          '& .MuiChip-label': {
            paddingLeft: '7px',
            paddingRight: '7px',
          },
          ...sx,
        }}
      />
    );
  else if (type === 'green')
    return (
      <Chip
        label={label}
        onClick={onClick}
        sx={{
          color: '#629C28',
          backgroundColor: '#E6F6D1',
          borderRadius: '6px',
          height: '20px',
          '& .MuiChip-label': {
            paddingLeft: '7px',
            paddingRight: '7px',
          },
          ...sx,
        }}
      />
    );
  else if (type === 'blue')
    return (
      <Chip
        label={label}
        onClick={onClick}
        sx={{
          color: '#629C28',
          backgroundColor: '#5c78ff',
          borderRadius: '6px',
          height: '20px',
          '& .MuiChip-label': {
            paddingLeft: '7px',
            paddingRight: '7px',
          },
          ...sx,
        }}
      />
    );
  else if (type === 'red')
    return (
      <Chip
        label={label}
        onClick={onClick}
        sx={{
          color: '#c91212',
          backgroundColor: '#ffd6d6',
          borderRadius: '6px',
          height: '20px',
          '& .MuiChip-label': {
            paddingLeft: '7px',
            paddingRight: '7px',
          },
          ...sx,
        }}
      />
    );
  else return <Chip label={label} sx={sx} onClick={onClick} />;
};

export default CustomChip;
