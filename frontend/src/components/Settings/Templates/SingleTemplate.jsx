import React from 'react'
import CustomChip from '../../@generalComponents/CustomChip';

const SingleTemplate = ({ template }) => {

  const bodyText = template?.components?.find(
    comp => comp?.type === 'BODY'
  )?.text;

  return (
    <div
      className={`template-container m-2`}
    >
      <div className='d-flex justify-content-end'>
        {template?.status === 'rejected'
          ? <CustomChip type='purple' label='Rejected' />
          : template?.status === 'approved'
            ? <CustomChip type='green' label='Approved' />
            : <CustomChip type='orange' label='Pending' />
        }
      </div>
      <h4>{template?.name} ({template?.language})</h4>
      <p className='m-0'>"{bodyText}"</p>
    </div>
  )
}

export default SingleTemplate