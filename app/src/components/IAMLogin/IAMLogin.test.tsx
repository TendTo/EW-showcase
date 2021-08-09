import { render, screen } from '@testing-library/react';
import IamLogin from './IAMLogin';

test('renders IAMLogin component', () => {
    render(<IamLogin setDID={(_: string) => { }} />);
    const linkElement = screen.getByText(/IAM.BUTTON_METAMASK/i);
    expect(linkElement).toBeInTheDocument();
});
