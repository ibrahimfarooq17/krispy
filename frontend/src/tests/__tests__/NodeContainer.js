import { fireEvent, render, screen } from '@testing-library/react';
import NodeContainer from '../../components/Flows/NodeContainer';

describe('NodeContainer', () => {
	const mockOnDelete = jest.fn();

	const node = {
		title: 'Example Node',
		icon: {
			src: '/path/to/icon.png',
			altText: 'Icon Alt Text',
		},
		onDelete: mockOnDelete,
		children: <div>Child content</div>,
		showDeleteButton: true,
		handles: {
			showSourceHandle: false,
			showTargetHandle: false,
		},
	};

	it('renders the node title and icon correctly', () => {
		render(<NodeContainer {...node} />);

		const titleElement = screen.getByText(node.title);
		expect(titleElement).toBeInTheDocument;

		const iconElement = screen.getByAltText(node.icon.altText);
		expect(iconElement).toBeInTheDocument;
	});

	it('conditionally renders the delete button', () => {
		render(<NodeContainer {...node} />);

		const deleteButton = screen.getByRole('button');
		expect(deleteButton).toBeInTheDocument;
		fireEvent.click(deleteButton);
		expect(mockOnDelete).toHaveBeenCalled;
	});
});
