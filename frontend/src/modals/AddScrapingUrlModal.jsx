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

const AddScrapingUrlModal = ({
  isOpen,
  modalCloseHandler,
}) => {
  const dispatch = useDispatch();

  const [url, setUrl] = useState();
  const [resLoading, setResLoading] = useState(false);

  const addUrl = async () => {
    const { error } = await krispyAxios({
      method: 'PATCH',
      url: `knowledge-bases`,
      body: {
        scrapingUrl: url
      },
      loadingStateSetter: setResLoading,
      successMessage: 'URL successfully scraped.',
    });
    if (error) return;
    modalCloseHandler();
    dispatch(getKnowledgeBase());
  }

  return (
    <Dialog open={isOpen} onClose={modalCloseHandler} fullWidth maxWidth='sm'>
      <DialogTitle>
        <h1 className='f-2xl-medium m-0'>Scraping Urls</h1>
        <DialogContentText id='alert-dialog-description'>
          <p className='f-sm-regular mb-3'>
            Add a link to your product, privacy policy, term and conditions
            or any other page that contains information about your business.
            We will scrape the data on that page to train your
            AI agent.
          </p>
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <Input
          thin
          label='URL'
          name='url'
          value={url}
          onChange={(e) => setUrl(e?.target?.value)}
        />
      </DialogContent>
      <DialogActions>
        <CustomButton
          label='Add'
          type='medium-purple'
          customStyle={{
            fontSize: '15px',
            fontWeight: '600',
            marginTop: '15px'
          }}
          onClick={addUrl}
          loading={resLoading}
          disabled={!url}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddScrapingUrlModal;
