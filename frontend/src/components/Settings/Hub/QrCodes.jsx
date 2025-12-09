// import { Modal } from 'antd';
// import { DateTimeField } from '@mui/x-date-pickers/DateTimeField';
import { IconButton } from '@mui/material';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { qrCodeModal } from '../../../redux/actions/modal.actions';
import { getAllQrCodes } from '../../../redux/actions/qrCode.actions';
import krispyAxios from '../../../utilities/krispyAxios';
import Loader from '../../@generalComponents/Loader';

const QrCodes = () => {
	const dispatch = useDispatch();

	const qrCodes = useSelector((state) => state.qrCodeReducer.qrCodes);

	useEffect(() => {
		dispatch(getAllQrCodes());
	}, []);

	const openQrModal = (qrCode) => {
		dispatch(
			qrCodeModal({
				isOpen: true,
				qrCodeId: qrCode?.qrCodeId,
				qrCodeTitle: qrCode?.title,
				qrCodeMessage: qrCode?.message,
			})
		);
	};

	const deleteQrCode = async (qrCodeId) => {
		await krispyAxios({
			method: 'DELETE',
			url: `qr-codes/${qrCodeId}`,
			loadingMessage: 'Deleting QR code...',
			successMessage: 'QR code deleted successfully!',
			onSuccess: () => dispatch(getAllQrCodes()),
		});
	};

	return (
		<Loader renderChildren={qrCodes}>
			<div
				className='border-1 border-[#ECECEC] rounded-xl overflow-x-auto'
				style={{ padding: 0 }}
			>
				<div className='bg-[#F5F5F5] w-full rounded-t-xl h-12 grid grid-cols-4 items-center'>
					<span className='col-span-1 px-3 text-[#2A2A2A] font-semibold font-inter'>
						Title
					</span>
					<span className='col-span-2 px-3 text-[#2A2A2A] font-semibold font-inter'>
						Message
					</span>
					<span className='col-span-1 px-3 text-[#2A2A2A] font-semibold font-inter'>
						Action
					</span>
				</div>
				{qrCodes?.map((qrCode, i) => {
					return (
						<div
							key={qrCode?.qrCodeId}
							className='grid grid-cols-4 items-center border-t-[1px] border-[#ECECEC] pt-2 pb-2'
						>
							<span className='col-span-1 px-3 text-[#2A2A2A]'>
								{qrCode?.title}
							</span>
							<span className='col-span-2 px-3 text-[#2A2A2A]'>
								{qrCode?.message}
							</span>
							<div className='col-span-1 flex items-center px-6 gap-3 text-[#2A2A2A]'>
								<IconButton onClick={() => openQrModal(qrCode)}>
									<div className='w-8 h-8 rounded-lg flex justify-center items-center bg-[#FFEDE6]'>
										<img
											src='/images/pencil-square.svg'
											alt='Edit icon'
										/>
									</div>
								</IconButton>
								<IconButton onClick={() => deleteQrCode(qrCode?.qrCodeId)}>
									<div className='w-8 h-8 rounded-lg flex justify-center items-center bg-[#F5F5F5]'>
										<img
											src='/images/trash.svg'
											alt='Trash icon'
										/>
									</div>
								</IconButton>
							</div>
						</div>
					);
				})}
			</div>
		</Loader>
	);
};

export default QrCodes;
