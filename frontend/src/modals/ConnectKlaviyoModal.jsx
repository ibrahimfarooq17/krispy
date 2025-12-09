import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Input from '../components/@generalComponents/Input';
import CustomButton from '../components/@generalComponents/CustomButton';
import { getAllConnectors } from '../redux/actions/connector.actions';
import { Alert } from '@mui/material';
import krispyAxios from '../utilities/krispyAxios';

const ConnectKlaviyoModal = ({ isOpen, modalCloseHandler, onComplete }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({});
  const [resLoading, setResLoading] = useState(false);

  const changeHandler = async (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const connectWithKlaviyo = async () => {
    setResLoading(true);
    await krispyAxios({
      method: 'POST',
      url: `connectors/klaviyo`,
      body: {
        apiKey: formState?.apiKey,
      },
      successMessage: 'Klaviyo connected successfully!',
      onSuccess: () => {
        modalCloseHandler();
        dispatch(getAllConnectors());
      }
    });
    setResLoading(false);
  };

  return (
    <Dialog open={isOpen} onClose={modalCloseHandler} fullWidth maxWidth='sm'>
      <DialogTitle>
        <h1 className='f-2xl-medium m-0'>Klaviyo</h1>
        <DialogContentText id='alert-dialog-description'>
          <p className='f-sm-regular mb-3'>
            Connect Krispy to your Klaviyo, to sync
            your flows and contacts!
          </p>
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <Input
          name='apiKey'
          label='API Key'
          thin
          value={formState?.apiKey}
          onChange={changeHandler}
        />
        <Alert severity="info">
          Once your Klaviyo is connected with Krispy,
          we will fetch various resources from your
          account.
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
          onClick={connectWithKlaviyo}
          loading={resLoading}
          disabled={!formState?.apiKey}
        />
      </DialogActions>
    </Dialog>
  );
};

export default ConnectKlaviyoModal;
