import { fireEvent, render, screen } from '@testing-library/react';
import FlowItem from '../../components/Flows/FlowItem';

describe('FlowItem', () => {
	const mockOnSwitchChange = jest.fn();
	const mockEditFlow = jest.fn();
	const mockDeleteFlow = jest.fn();

	const flow = {
		flowId: '1',
		name: 'Example Flow',
		isActive: true,
	};

	it('displays flow status correctly', () => {
		render(
			<FlowItem
				flow={flow}
				editFlow={mockEditFlow}
				onSwitchChange={mockOnSwitchChange}
				deleteFlow={mockDeleteFlow}
			/>
		);

		const chipLabel = screen.getByText(/Active/i);
		expect(chipLabel).toBeInTheDocument;
	});

	it('toggles the active state when switch is changed', () => {
		render(
			<FlowItem
				flow={flow}
				editFlow={mockEditFlow}
				onSwitchChange={mockOnSwitchChange}
				deleteFlow={mockDeleteFlow}
			/>
		);

		const switchElement = screen.getByRole('checkbox');
		fireEvent.click(switchElement);
		// switch it back - look for function called twice
		fireEvent.click(switchElement);

		expect(mockOnSwitchChange).toHaveBeenCalledTimes(2);
		expect(mockOnSwitchChange).toHaveBeenCalledWith(
			expect.any(Object),
			flow.flowId
		);
	});

	it('calls editFlow when edit button is clicked', () => {
		render(
			<FlowItem
				flow={flow}
				editFlow={mockEditFlow}
				onSwitchChange={mockOnSwitchChange}
				deleteFlow={mockDeleteFlow}
			/>
		);

		const editButton = screen.getByRole('button', { name: /edit flow/i });
		fireEvent.click(editButton);

		expect(mockEditFlow).toHaveBeenCalledWith(flow.flowId);
	});

	it('calls deleteFlow when delete button is clicked', () => {
		render(
			<FlowItem
				flow={flow}
				editFlow={mockEditFlow}
				onSwitchChange={mockOnSwitchChange}
				deleteFlow={mockDeleteFlow}
			/>
		);

		const deleteButton = screen.getByRole('button', { name: /delete/i });
		fireEvent.click(deleteButton);

		expect(mockDeleteFlow).toHaveBeenCalledWith(flow.flowId);
	});
});
