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
import { clearSingleChat, getSingleChat } from '../redux/actions/conversation.actions';

const AddFeedbackModal = ({
  isOpen,
  modalCloseHandler,
  messageId,
  messageContent,
  chatId
}) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [formState, setFormState] = useState({
    feedback: messageContent
  });
  const [resLoading, setResLoading] = useState(false);

  const changeHandler = async (event) => {
    const { name, value } = event.target;
    setFormState({
      ...formState,
      [name]: value,
    });
  };

  const addFeedback = async () => {
    const { error } = await krispyAxios({
      method: 'POST',
      url: `messages/add-feedback/${messageId}`,
      body: {
        feedback: formState?.feedback
      },
      loadingStateSetter: setResLoading,
      successMessage: 'Feedback added.'
    });
    if (error) return;
    modalCloseHandler();
    dispatch(clearSingleChat());
    dispatch(getSingleChat(chatId));
  }

  return (
    <Dialog open={isOpen} onClose={modalCloseHandler} fullWidth maxWidth='sm'>
      <DialogTitle>
        <h1 className='f-2xl-medium m-0'>Feedback</h1>
        <DialogContentText id='alert-dialog-description'>
          <p className='f-sm-regular mb-3'>
            Add a suggested message to train your AI agent better!
          </p>
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <Input
          thin
          label='What would you rather reply here?'
          type='textarea'
          name='feedback'
          value={formState?.feedback}
          onChange={changeHandler}
          rows={3}
          maxRows={3}
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
          onClick={addFeedback}
          loading={resLoading}
          disabled={!formState?.feedback}
        />
      </DialogActions>
    </Dialog>
  );
};

export default AddFeedbackModal;
