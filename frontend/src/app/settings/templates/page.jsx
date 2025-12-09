'use client';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { IconButton } from '@mui/material';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import { styled } from '@mui/material/styles';
import moment from 'moment';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CustomChip from '../../../components/@generalComponents/CustomChip';
import Heading from '../../../components/@generalComponents/Heading';
import Loader from '../../../components/@generalComponents/Loader';
import SettingsLayout from '../../../layout/SettingsLayout';
import {
	getAllTemplates,
	removeSingleTemplate,
} from '../../../redux/actions/template.actions';
import krispyAxios from '../../../utilities/krispyAxios';

const Accordion = styled((props) => (
	<MuiAccordion
		disableGutters
		elevation={0}
		square
		{...props}
	/>
))(({ theme }) => ({
	border: `1px solid ${theme.palette.divider}`,
	'&:before': {
		display: 'none',
	},
	marginBottom: 20,
	borderRadius: 8,
}));

const AccordionSummary = styled((props) => (
	<MuiAccordionSummary
		expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
		{...props}
	/>
))(({ theme }) => ({
	backgroundColor:
		theme.palette.mode === 'dark'
			? 'rgba(255, 255, 255, .05)'
			: 'rgba(0, 0, 0, .03)',
	flexDirection: 'row-reverse',
	'& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
		transform: 'rotate(90deg)',
	},
	'& .MuiAccordionSummary-content': {
		marginLeft: theme.spacing(1),
	},
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
	padding: theme.spacing(2),
	borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const Templates = () => {
	const router = useRouter();
	const dispatch = useDispatch();

	const templates = useSelector((state) => state.templateReducer.allTemplates);

	useEffect(() => {
		if (!templates) dispatch(getAllTemplates());
	}, [templates]);

	const createNewTemplate = () => {
		router.push('/settings/templates/new');
	};

	const deleteTemplate = async (templateId) => {
		await krispyAxios({
			method: 'DELETE',
			url: `templates/${templateId}`,
			loadingMessage: 'Deleting template...',
			successMessage: 'Templated deleted.',
			onSuccess: () => dispatch(removeSingleTemplate(templateId)),
		});
	};

	return (
		<SettingsLayout>
			<Loader renderChildren={templates}>
				<div className='row d-flex justify-content-center'>
					<div className='col-md-12'>
						<Heading
							title={'Templates'}
							subtitle={
								'Templates can be used to reach out to customers. (You can also manage your messaging templates on Meta)'
							}
							buttons={[
								{
									text: 'Create new template',
									onClick: createNewTemplate,
									image: {
										url: '/images/add-icon.svg',
										altText: 'plus icon',
									},
								},
							]}
						/>
						{templates?.map((template) => {
							const templateBodyText = template?.components?.find(
								(comp) => comp?.type === 'BODY'
							)?.text;
							const templateButtons = template?.components?.find(
								(comp) => comp?.type === 'BUTTONS'
							)?.buttons;
							return (
								<Accordion>
									<AccordionSummary
										aria-controls='panel2d-content'
										id='panel2d-header'
									>
										<div className='w-100 d-flex justify-content-between align-items-center'>
											<h6 className='mb-0'>{template?.name}</h6>
											<div>
												<CustomChip
													type='purple'
													label={template?.language}
													sx={{ marginRight: '15px' }}
												/>
												{template?.status === 'rejected' ? (
													<CustomChip
														type='purple'
														label='Rejected'
													/>
												) : template?.status === 'approved' ? (
													<CustomChip
														type='green'
														label='Approved'
													/>
												) : (
													<CustomChip
														type='orange'
														label='Pending'
													/>
												)}
												<IconButton
													style={{ marginLeft: '30px' }}
													onClick={(e) => {
														deleteTemplate(template?.templateId);
														e.stopPropagation();
													}}
												>
													<img
														src='/images/bin-icon.svg'
														width={20}
														alt='Bin icon'
													/>
												</IconButton>
											</div>
										</div>
									</AccordionSummary>
									<AccordionDetails>
										<label className='input-label'>Flow</label>
										<p className='templates-accordion-body'>{template?.flow}</p>
										<label className='input-label mt-2'>Body</label>
										<p className='templates-accordion-body'>
											{templateBodyText}
										</p>
										<label className='input-label mt-2'>Buttons</label>
										{!templateButtons || templateButtons?.length == 0 ? (
											<p className='templates-accordion-body'>None</p>
										) : (
											<React.Fragment>
												<div className='row mb-1'>
													<div className='col-1 text-[13px] font-[400]'>#</div>
													<div className='col-2 text-[13px] font-[400]'>
														Type
													</div>
													<div className='col-3 text-[13px] font-[400]'>
														Display Text
													</div>
													<div className='col-6 text-[13px] font-[400]'>
														URL
													</div>
												</div>
												{templateButtons?.map((button, index) => {
													return (
														<div className='row'>
															<div className='col-1 text-[12px] font-[300]'>
																{index + 1}
															</div>
															<div className='col-2 text-[12px] font-[300]'>
																{button?.type}
															</div>
															<div className='col-3 text-[12px] font-[300]'>
																{button?.text}
															</div>
															<div className='col-6 text-[12px] font-[300]'>
																{button?.url}
															</div>
														</div>
													);
												})}
											</React.Fragment>
										)}
										<p className='templates-accordion-body text-right'>
											{moment(template?.createdAt).format('Do MMM, YYYY')}
										</p>
									</AccordionDetails>
								</Accordion>
							);
						})}
					</div>
				</div>
			</Loader>
		</SettingsLayout>
	);
};

export default Templates;
