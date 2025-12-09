import { fireEvent, render, screen } from '@testing-library/react';
import CampaignItem from '../../components/Campaigns/CampaignItem';

describe('CampaignItem', () => {
	const mockSetTemplateVisibility = jest.fn();
	const mockHandleMouseMove = jest.fn();
	const mockConfirmCampaignDeletion = jest.fn();

	const campaign = {
		campaignId: '123',
		name: 'Test Campaign',
		scheduledFor: '2023-04-01T12:00:00Z',
		template: {
			name: 'Test Template',
			components: [
				{ type: 'HEADER', defaultUrl: '/path/to/header.jpg' },
				{ type: 'BODY', text: 'Body Content' },
				{ type: 'FOOTER', text: 'Footer Content' },
				{
					type: 'BUTTONS',
					buttons: [{ text: 'Button 1' }, { text: 'Button 2' }],
				},
			],
		},
		contactsReached: 150,
		totalContacts: 500,
	};

	it('displays campaign status correctly', () => {
		render(
			<CampaignItem
				campaign={campaign}
				templateVisibility={{ [campaign.campaignId]: false }}
				setTemplateVisibility={mockSetTemplateVisibility}
				handleMouseMove={mockHandleMouseMove}
				hoveredElementStyle={{ top: '10px', left: '10px' }}
			/>
		);

		const chipLabel = screen.getByText(/^Sent$/i);
		expect(chipLabel).toBeInTheDocument;
	});

	it('shows template view on hover', () => {
		render(
			<CampaignItem
				campaign={campaign}
				templateVisibility={{ [campaign.campaignId]: false }}
				setTemplateVisibility={mockSetTemplateVisibility}
				handleMouseMove={mockHandleMouseMove}
				hoveredElementStyle={{ top: '10px', left: '10px' }}
			/>
		);

		const templateViewSpan = screen.getByText(/View template/i);
		fireEvent.mouseEnter(templateViewSpan);
		expect(mockSetTemplateVisibility).toHaveBeenCalledWith({
			[campaign.campaignId]: true,
		});

		fireEvent.mouseLeave(templateViewSpan);

		expect(mockSetTemplateVisibility).toHaveBeenCalledWith({
			[campaign.campaignId]: false,
		});
	});

	it('confirms campaign deletion on button click', () => {
		render(
			<CampaignItem
				campaign={campaign}
				templateVisibility={{ [campaign.campaignId]: false }}
				setTemplateVisibility={mockSetTemplateVisibility}
				handleMouseMove={mockHandleMouseMove}
				hoveredElementStyle={{ top: '10px', left: '10px' }}
				confirmCampaignDeletion={mockConfirmCampaignDeletion}
			/>
		);

		const deleteButton = screen.getByRole('button');
		fireEvent.click(deleteButton);
		expect(mockConfirmCampaignDeletion).toHaveBeenCalledWith(
			campaign.campaignId
		);
	});
});
