import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import krispyAxios from '../utilities/krispyAxios';
import Input from '../components/@generalComponents/Input';
import CustomButton from '../components/@generalComponents/CustomButton';
import { getKnowledgeBase } from '../redux/actions/knowledgeBase.actions';

const EditShopifyProductModal = ({
  isOpen,
  product,
  modalCloseHandler,
}) => {
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({
    productUrl: product?.product_url
  });
  const [resLoading, setResLoading] = useState(false);

  const changeHandler = (event) => {
    const { name, value } = event?.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const saveChanges = async () => {
    await krispyAxios({
      method: 'PATCH',
      url: `knowledge-bases/shopify/products/${product?.id}`,
      body: {
        productUrl: formState.productUrl
      },
      loadingStateSetter: setResLoading,
      successMessage: 'Product details updated!',
      onSuccess: () => {
        modalCloseHandler();
        dispatch(getKnowledgeBase());
      }
    });
  };

  return (
    <Dialog open={isOpen} onClose={modalCloseHandler} fullWidth maxWidth='sm'>
      <DialogTitle>
        <h1 className='f-2xl-medium m-0'>Edit Product Details</h1>
        <DialogContentText id='alert-dialog-description'>
          <p className='f-sm-regular mb-3'>
            You can edit your product details from here.
            Please note that any edits made here do not
            reflect anything on your Shopify store.
          </p>
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <Input
          thin
          label='Product Url'
          name='productUrl'
          value={formState.productUrl}
          onChange={changeHandler}
        />
      </DialogContent>
      <DialogActions>
        <CustomButton
          label='Save'
          type='medium-purple'
          customStyle={{
            fontSize: '15px',
            fontWeight: '600',
            marginTop: '15px'
          }}
          onClick={saveChanges}
          loading={resLoading}
        />
      </DialogActions>
    </Dialog>
  );
};

export default EditShopifyProductModal;
