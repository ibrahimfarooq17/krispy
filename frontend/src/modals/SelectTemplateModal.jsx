import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import CustomButton from '../components/@generalComponents/CustomButton';
import Loader from '../components/@generalComponents/Loader';
import { getAllTemplates } from '../redux/actions/template.actions';

const SelectTemplateModal = ({ isOpen, modalCloseHandler, defaultTemplate, onSelect }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedTemplate, setSelectedTemplate] = useState(defaultTemplate);

  const templates = useSelector(state => state.templateReducer.allTemplates);

  useEffect(() => {
    dispatch(getAllTemplates());
  }, []);

  // useEffect(() => {
  //   if (!templates) return;
  //   setSelectedTemplate(
  //     templates?.find(temp => temp?.name === defaultTemplate?.name
  //       && temp?.language === defaultTemplate?.language
  //     )
  //   );
  // }, [templates]);

  const selectTemplate = () => {
    modalCloseHandler();
    onSelect(selectedTemplate);
  }

  return (
    <Dialog open={isOpen} onClose={modalCloseHandler} fullWidth maxWidth='sm'>
      <DialogTitle>
        <h1 className='f-2xl-medium m-0'>Template</h1>
        <DialogContentText id='alert-dialog-description'>
          <p className='f-sm-regular mb-0'>
            Select the template you would like to hook
            with your automation.
          </p>
        </DialogContentText>
      </DialogTitle>
      <DialogContent>
        <Loader renderChildren={templates}>
          {templates?.map(temp => {
            const bodyText = temp?.components?.find(
              comp => comp?.type === 'BODY'
            )?.text;
            return (
              <div
                className={`template-container m-2 
                ${selectedTemplate === temp?.templateId && 'selected'}`}
                onClick={() => setSelectedTemplate(temp?.templateId)}
              >
                <h4>{temp?.name} ({temp?.language})</h4>
                <p className='m-0'>"{bodyText}"</p>
              </div>
            );
          })}
        </Loader>
      </DialogContent>
      <DialogActions>
        <CustomButton
          label='Add'
          type='medium-purple'
          customStyle={{
            fontSize: '15px',
            fontWeight: '600',
          }}
          onClick={selectTemplate}
        />
      </DialogActions>
    </Dialog>
  );
};

export default SelectTemplateModal;
