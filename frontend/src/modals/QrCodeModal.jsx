import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import krispyAxios from '../utilities/krispyAxios';
import Input from '../components/@generalComponents/Input';
import CustomButton from '../components/@generalComponents/CustomButton';
import html2canvas from 'html2canvas';
import { QRCode } from 'react-qrcode-logo';
import { getAllQrCodes } from '../redux/actions/qrCode.actions';
import CloseIcon from '@mui/icons-material/Close';
import { IconButton } from '@mui/material';
import toast from 'react-hot-toast';

const QrCodeModal = ({
  isOpen,
  modalCloseHandler,
  qrCodeId,
  qrCodeTitle,
  qrCodeMessage
}) => {
  const downloadQrRef = useRef();
  const dispatch = useDispatch();

  const [title, setTitle] = useState(qrCodeTitle || '');
  const [whatsAppMessage, setWhatsappMessage] = useState(qrCodeMessage || '');
  const [whatsAppLink, setWhatsAppLink] = useState('');
  const [qrCodeLink, setQrCodeLink] = useState('');
  const [resLoading, setResLoading] = useState(false);

  const preferences = useSelector(
    (state) => state.preferenceReducer.entityPreferences
  );

  console.log('whatsAppMessage', whatsAppMessage);
  console.log('whatsAppLink', whatsAppLink);
  console.log('qrCodeLink', qrCodeLink);

  useEffect(() => {
    if (!preferences) return;
    const foundPhoneBinding = preferences?.phoneBindings?.find(binding => binding?.type === 'whatsapp')
    if (!foundPhoneBinding) return;
    let defaultText = qrCodeMessage ? qrCodeMessage?.replace(/ /g, '+') : '';
    setWhatsAppLink(`https://wa.me/${foundPhoneBinding?.phone_number}?text=`)
    setQrCodeLink(`https://wa.me/${foundPhoneBinding?.phone_number}?text=${defaultText}`)
  }, [preferences]);

  const generateQr = () => {
    const link = `${whatsAppLink}${whatsAppMessage}`.replace(/ /g, '+');
    setQrCodeLink(link)
  }

  const onWhatsAppMessageChange = (e) => {
    setWhatsappMessage(e?.target?.value);
  }
  const onTitleChange = (e) => {
    setTitle(e?.target?.value);
  }

  const copyLink = () => {
    navigator.clipboard.writeText(qrCodeLink);
    toast.success('Link copied to clipboard.');
  }

  const handleDownloadQR = async () => {
    generateQr();
    const element = downloadQrRef.current;
    const canvas = await html2canvas(element);
    const data = canvas.toDataURL('image/jpg');
    const link = document.createElement('a');
    if (typeof link.download === 'string') {
      link.href = data;
      link.download = `${title}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  const saveChanges = async () => {
    if (qrCodeId)
      await krispyAxios({
        method: 'PATCH',
        url: `qr-codes/${qrCodeId}`,
        body: {
          title: title,
          message: whatsAppMessage
        },
        loadingStateSetter: setResLoading,
        successMessage: 'QR code updated successfully.'
      });
    else
      await krispyAxios({
        method: 'POST',
        url: 'qr-codes',
        body: {
          title: title,
          message: whatsAppMessage
        },
        loadingStateSetter: setResLoading,
        successMessage: 'QR code created successfully.'
      });
    dispatch(getAllQrCodes());
  };

  return (
    <Dialog open={isOpen} onClose={modalCloseHandler} fullWidth maxWidth='md'>
      <DialogTitle>
        <div className='d-flex justify-content-between mb-3'>
          <h1 className='f-2xl-medium mb-0'>WhatsApp QR Code</h1>
          <IconButton onClick={modalCloseHandler}>
            <CloseIcon fontSize='medium' />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div className='container'>
          <div className='row'>
            <div className='col-md-6'>
              <Input
                thin
                label='Title'
                type='text'
                name='title'
                value={title}
                onChange={onTitleChange}
              />
              <Input
                label='Message'
                type='textarea'
                name='message'
                onBlur={generateQr}
                rows={3}
                maxRows={3}
                value={whatsAppMessage}
                onChange={onWhatsAppMessageChange}
              />
              <CustomButton
                type='medium-purple'
                label='Save'
                onClick={saveChanges}
                loading={resLoading}
              />
            </div>
            <div className='col-md-6'>
              <div className='slider-container'>
                {/* <p className='font-medium text-[20px] font-inter text-center'>
                  The QR encodes&nbsp;
                  <a target='__blank' href={qrCodeLink}>
                    this
                  </a>
                  &nbsp;link.
                </p> */}
                <div className='d-flex justify-content-center mt-2'>
                  <div
                    ref={downloadQrRef}
                    style={{
                      border: '1px solid #DBDBDB',
                      borderRadius: '8px',
                    }}
                  >
                    <QRCode
                      ref={downloadQrRef}
                      value={qrCodeLink}
                      size={250}
                      removeQrCodeBehindLogo={true}
                      logoHeight={70}
                      logoWidth={70}
                      logoImage='/images/whatsapp-logo.png'
                      qrStyle='dots'
                      eyeColor='#10324f'
                    />
                  </div>
                </div>
                <p
                  className='font-inter mt-4 text-[#5E5E5E] font-normal text-[12px]'
                  style={{ fontWeight: 300 }}
                >
                  Download the QR to share it with your customers on your platform.
                  Your customers can then scan it to converse with your AI agent.
                </p>
                <CustomButton
                  type='medium-purple'
                  label='Download'
                  onClick={handleDownloadQR}
                />
                <div className='mb-2' />
                <CustomButton
                  type='medium-purple'
                  label='Copy Link'
                  onClick={copyLink}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QrCodeModal;
