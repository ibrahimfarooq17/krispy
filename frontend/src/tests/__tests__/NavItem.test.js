import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import NavItem from '../../components/@generalComponents/NavItem';
import { AppRouterContextProviderMock } from '../utils/AppRouterContextProviderMock';

describe('NavItem', () => {
	it('renders a nav item with default props', () => {
		render(
			<NavItem
				link={{ name: 'Home', link: '/', icon: '/icon.svg' }}
				index={0}
				active={false}
			/>
		);

		const navItem = screen.getByRole('button');
		expect(navItem).toBeInTheDocument();
	});

	it('renders a nav item with active prop', () => {
		render(
			<NavItem
				active={true}
				link={{ name: 'Home', link: '/', iconActive: '/icon-active.svg' }}
			/>
		);
		const navItem = screen.getByRole('button');
		expect(navItem).toHaveClass('bg-orange-100');
	});

	it('handles click event and navigates to link', () => {
		const push = jest.fn();

		render(
			<AppRouterContextProviderMock>
				<NavItem
					active={false}
					link={{ name: 'Home', link: '/', icon: '/icon.svg' }}
					router={{ push }}
				/>
			</AppRouterContextProviderMock>
		);
		const navItem = screen.getByRole('button');
		fireEvent.click(navItem);
		expect(push).toHaveBeenCalledWith('/');
	});

	it('calls onClick prop when clicked', () => {
		const mockOnClick = jest.fn();

		render(
			<NavItem
				active={false}
				link={{ name: 'Home', link: '/', icon: '/icon.svg' }}
				onClick={mockOnClick}
			/>
		);
		const navItem = screen.getByRole('button');
		fireEvent.click(navItem);
		expect(mockOnClick).toHaveBeenCalled();
	});
});
