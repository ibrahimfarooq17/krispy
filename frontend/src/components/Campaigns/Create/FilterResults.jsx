import React, { useEffect, useState } from 'react';
import Input from '../../@generalComponents/Input';
import Spinner from '../../@generalComponents/Spinner';
import krispyAxios from '../../../utilities/krispyAxios';
import { useSelector } from 'react-redux';

const FilterResults = ({ campaign, setCampaign, products }) => {

  const [loadingContacts, setLoadingContacts] = useState(false);

  const currentUser = useSelector((state) => state.userReducer.currentUser);

  useEffect(() => {
    if (campaign?.selectedProduct) getContacts();
  }, [campaign?.selectedProduct])

  const onFilterChange = (e) => {
    setCampaign({
      ...campaign,
      selectedFilter: e?.target?.value
    });
  };

  const onSelectProduct = (e) => {
    setCampaign({
      ...campaign,
      selectedProduct: e?.target?.value
    });
  };

  const getContacts = async () => {
    const { contact_list } = await krispyAxios({
      method: 'POST',
      url: `https://krispy-ai-dev-dot-krispy-388910.ew.r.appspot.com/segmentation/${currentUser?.entity?.entityId}`,
      body: {
        objective: 'BY_PRODUCT',
        product_id: campaign?.selectedProduct
      },
      loadingStateSetter: setLoadingContacts
    });
    setCampaign({
      ...campaign,
      potentialContacts: contact_list
    });
  }

  return (
    <div>
      <div className='row d-flex justify-content-between align-items-center'>
        <div className='col-md-4'>
          <h6 className='mb-0'>Filter contacts by</h6>
        </div>
        <div className='col-md-8'>
          <Input
            thin
            type='select'
            options={[{ label: 'Product bought', value: 'product' }]}
            onChange={onFilterChange}
            value={campaign.selectedFilter}
          />
        </div>
      </div>
      <div className='row d-flex justify-content-between align-items-center mt-4'>
        <div className='col-md-4'>
          <h6 className='mb-0'>Product bought</h6>
        </div>
        <div className='col-md-8'>
          <Input
            thin
            type='select'
            options={products?.map(product => {
              return { value: product?.id, label: product?.title }
            })}
            value={campaign.selectedProduct}
            onChange={onSelectProduct}
          />
        </div>
      </div>
      {campaign?.selectedProduct &&
        <div className='mt-4'>
          <h6 className='mb-0'>Reached Contacts</h6>
          {loadingContacts ?
            <Spinner />
            : campaign?.potentialContacts?.length == 0 ?
              <div className='empty-chat-container mt-4'>
                <p className='empty-chat-text'>
                  No contacts found.
                </p>
              </div>
              : (
                <div className='row mt-4'>
                  {campaign?.potentialContacts?.map(template => {
                    return (
                      <div className='col-md-6'>
                        <div
                          className='contact-container'
                        >
                          <h5 className='m-0'>
                            {template?.first_name + ' ' + template?.last_name}
                          </h5>
                          <p className='m-0'>{template?.email}</p>
                          <p className='m-0'>{template?.phone}</p>
                          <p className='m-0'>{template?.city} - {template?.country}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )
          }
        </div>
      }
    </div>
  )
}

export default FilterResults