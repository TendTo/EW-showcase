import { render, screen } from '@testing-library/react';
import Login from './Login';

test('renders Login component', () => {
    const setMock = (_: any) => { };
    render(<Login setAccount={setMock} setChain={setMock} setSigner={setMock} chain={""} />);
    const linkElement = screen.getByText(/LOGIN.TITLE/i);
    expect(linkElement).toBeInTheDocument();
});
