import { render, screen } from '@testing-library/react';
import DIDLogin from './DIDLogin';

test('renders DIDLogin component', () => {
    render(<DIDLogin setDID={(_: string) => { }} />);
    const linkElement = screen.getByText(/DID.LOGIN/i);
    expect(linkElement).toBeInTheDocument();
});
