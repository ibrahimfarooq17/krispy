import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import Heading from '../../components/@generalComponents/Heading';

describe('Heading', () => {
	it('renders a heading with title', () => {
		render(<Heading title={'Big Heading'} />);

		const heading = screen.getByRole('heading', { level: 1 });
		const headingTitle = screen.getByText('Big Heading');

		expect(heading).toBeInTheDocument();
		expect(headingTitle).not.toBeNull();
	});

	it('renders a subtitle when given', () => {
		render(
			<Heading
				title='Main Title'
				subtitle='This is a subtitle'
			/>
		);
		const subtitle = screen.getByText(/This is a subtitle/i);
		expect(subtitle).toBeInTheDocument();
	});

	it('renders buttons and handles click events', () => {
		const handleClick = jest.fn();
		render(
			<Heading
				title='Main Title'
				buttons={[{ text: 'Button 1', onClick: handleClick }]}
			></Heading>
		);
		const button = screen.getByText('Button 1');
		fireEvent.click(button);
		expect(handleClick).toHaveBeenCalled();
	});

	it('renders button images', () => {
		const buttonData = {
			text: 'Button Text',
			onClick: jest.fn(),
			image: { url: '/test-image.jpg', altText: 'Test Image' },
		};
		render(
			<Heading
				title='Main Title'
				buttons={[buttonData]}
			/>
		);
		const img = screen.getByAltText('Test Image');
		expect(img).toBeInTheDocument();
	});
});
