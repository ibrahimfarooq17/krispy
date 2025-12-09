import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import krispyAxios from '../utilities/krispyAxios';
import Input from '../components/@generalComponents/Input';
import CustomButton from '../components/@generalComponents/CustomButton';
import { getAllConnectors } from '../redux/actions/connector.actions';
import { Alert, AlertTitle } from '@mui/material';
import { getKnowledgeBase } from '../redux/actions/knowledgeBase.actions';
import { TagsInput } from "react-tag-input-component";

const ConnectShopifyModal = ({ isOpen, modalCloseHandler, onComplete }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({
    allowScraping: true
  });
  const [resLoading, setResLoading] = useState(false);

  const changeHandler = async (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const connectWithShopify = async () => {
    setResLoading(true);
    const connectorResponse = await krispyAxios({
      method: 'POST',
      url: `connectors/shopify/connect-private`,
      body: {
        storeUri: formState?.storeUri,
        accessToken: formState?.accessToken,
      },
    });
    if (connectorResponse?.error) {
      setResLoading(false);
      return;
    }
    const embeddingResponse = await krispyAxios({
      method: 'POST',
      url: `connectors/shopify/embed`,
      body: {
        allowScraping: formState?.allowScraping,
        baseProductUrl: formState?.baseProductUrl,
        skus: formState?.skus
      },
    });
    if (embeddingResponse?.error) {
      setResLoading(false);
      return;
    }
    const knowledgeBaseRes = await krispyAxios({
      method: 'PATCH',
      url: `knowledge-bases`,
      body: {
        aboutUs: formState?.aboutUs,
      },
      successMessage: 'Embedding successful!',
    });
    if (knowledgeBaseRes?.error) {
      setResLoading(false);
      return;
    }
    modalCloseHandler();
    dispatch(getAllConnectors());
    dispatch(getKnowledgeBase());
  };

  return (
    <Dialog open={isOpen} onClose={modalCloseHandler} fullWidth maxWidth='sm'>
      <DialogTitle>
        <h1 className='f-2xl-medium m-0'>Shopify</h1>
        <DialogContentText id='alert-dialog-description'>
          <p className='f-sm-regular mb-3'>
            Connect Krispy to your Shopify, to import products and customers!
          </p>
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <Input
          name='storeUri'
          label='Store Uri'
          thin
          value={formState?.storeUri}
          onChange={changeHandler}
        />
        <Input
          name='accessToken'
          label='Access Token'
          thin
          value={formState?.accessToken}
          onChange={changeHandler}
        />
        <Input
          thin
          label='Tell us more about your store'
          type='textarea'
          name='aboutUs'
          value={formState?.aboutUs}
          onChange={changeHandler}
          rows={3}
          maxRows={3}
        />
        <h6>Filter by:</h6>
        <div className='mb-3'>
          <label className='input-label'>
            Product SKUs
          </label>
          <TagsInput
            value={formState?.skus}
            onChange={(newArr) => setFormState({
              ...formState,
              skus: newArr
            })}
            name="phoneNumbers"
            placeHolder="Type a SKU and hit enter!"
          />
        </div>
        <Input
          name='baseProductUrl'
          label='Base Product Url'
          thin
          value={formState?.baseProductUrl}
          onChange={changeHandler}
        />
        <div className='d-flex mb-3 mt-1'>
          <Input
            label='Allow scraping'
            type='checkbox'
            name='allowScraping'
            value={formState?.allowScraping}
            onChange={(e) => setFormState({
              ...formState,
              allowScraping: e?.target?.checked
            })}
          />
          <p
            style={{
              fontSize: '14px',
              fontWeight: '400',
              lineHeight: '20px',
              letterSpacing: '0em',
              marginBottom: 0,
              marginLeft: '5px',
            }}
          >
            Allow scraping
          </p>
        </div>
        <Alert severity="info">
          Once your Shopify is connected with Krispy,
          we will fetch various resources from your store
          to train your AI agent.
        </Alert>
      </DialogContent>
      <DialogActions>
        <CustomButton
          label='Connect'
          type='medium-purple'
          customStyle={{
            fontSize: '15px',
            fontWeight: '600',
            marginTop: '15px'
          }}
          onClick={connectWithShopify}
          loading={resLoading}
          disabled={!formState?.storeUri || !formState?.accessToken || !formState?.aboutUs}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ConnectShopifyModal;
