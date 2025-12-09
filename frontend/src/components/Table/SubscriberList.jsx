import { IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { importContactsModal } from '../../redux/actions/modal.actions';
import getCurrencySymbol from '../../utilities/getCurrencySymbol';
import krispyAxios from '../../utilities/krispyAxios';
import Heading from '../@generalComponents/Heading';

const SubscribersList = () => {
	const dispatch = useDispatch();

	const [contactList, setContactList] = useState();
	const [loading, setLoading] = useState(false);

	const knowledgeBase = useSelector(
		(state) => state.knowledgeBaseReducer.knowledgeBase
	);

	useEffect(() => {
		getContactList(0);
	}, []);

	const getContactList = async (page) => {
		setLoading(true);
		const res = await krispyAxios({
			method: 'GET',
			url: `contacts/${page}?consent=true`,
		});
		setContactList(res);
		setLoading(false);
	};

	const onNextPage = () => {
		getContactList(contactList?.pagination?.nextPage);
	};

	const onPrevPage = () => {
		getContactList(contactList?.pagination?.prevPage);
	};

	const openContactsImportModal = () => {
		dispatch(importContactsModal({ isOpen: true }));
	};

	return (
		<div style={loading ? { opacity: 0.5 } : null}>
			<Heading
				title={'Subscribers'}
				buttons={[
					{
						text: 'Import contacts',
						onClick: openContactsImportModal,
						image: {
							url: '/images/add-icon.svg',
							altText: 'plus icon',
						},
					},
				]}
			/>
			<TableContainer component={Paper}>
				<Table
					sx={{ minWidth: 650, tableLayout: 'fixed' }}
					aria-label='simple table'
				>
					<TableHead style={{ background: '#F5F5F5' }}>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell align='left'>Phone Number</TableCell>
							<TableCell align='left'>Revenue via Krispy</TableCell>
							<TableCell align='left'>Subscribed At</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{contactList?.contacts?.map((contact) => (
							<TableRow
								key={contact?.contactId}
								sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
							>
								<TableCell
									component='th'
									scope='row'
								>
									{contact?.name}
								</TableCell>
								<TableCell align='left'>{contact?.phoneNumber}</TableCell>
								<TableCell
									align='left'
									sx={{ color: 'green' }}
								>
									{getCurrencySymbol(knowledgeBase?.currency)}
									{contact?.totalSpent}
								</TableCell>
								<TableCell align='left'>
									{moment(contact?.createdAt).format('Do MMM, YYYY')}
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<div className='flex gap-2 justify-end items-center mt-3'>
				<p className='m-0 text-slate-400'>
					{contactList?.pagination?.totalRecords} subscribers found
				</p>
				<div className='!border border-slate-200 rounded-lg'>
					<IconButton
						disabled={contactList?.pagination?.prevPage === null}
						onClick={onPrevPage}
					>
						<FaAngleLeft />
					</IconButton>
				</div>
				<div className='!border border-slate-200 rounded-lg'>
					<IconButton
						disabled={contactList?.pagination?.nextPage === null}
						onClick={onNextPage}
					>
						<FaAngleRight />
					</IconButton>
				</div>
			</div>
		</div>
	);
};

export default SubscribersList;
