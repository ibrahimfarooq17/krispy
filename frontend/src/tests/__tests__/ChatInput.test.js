import { fireEvent, render, screen } from '@testing-library/react';
import ChatInput from '../../components/@generalComponents/ChatInput';

describe('ChatInput', () => {
	it('submits the form on button click', () => {
		const handleSubmit = jest.fn();
		render(<ChatInput onSubmit={handleSubmit} />);

		const submitButton = screen.getByRole('button');
		fireEvent.click(submitButton);
		expect(handleSubmit).toHaveBeenCalled();
	});

	it('disables the submit button when disabled prop is true', () => {
		const handleSubmit = jest.fn();
		render(
			<ChatInput
				onSubmit={handleSubmit}
				isDisabled={true}
			/>
		);

		const submitButton = screen.getByRole('button');
		expect(submitButton).toBeDisabled;
	});

	it('enables the submit button when disabled prop is false', () => {
		const handleSubmit = jest.fn();
		render(
			<ChatInput
				onSubmit={handleSubmit}
				isDisabled={false}
			/>
		);

		const submitButton = screen.getByRole('button');
		expect(submitButton).not.toBeDisabled;
	});
});
