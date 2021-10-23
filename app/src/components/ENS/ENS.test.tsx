import { render, screen } from '@testing-library/react';
import { VoidSigner } from 'ethers';
import ENS from './ENS';

test('renders ENS component', () => {
  const signer = new VoidSigner("0x0");
  render(<ENS signer={signer} />);
  const linkElement = screen.getByText(/ENS.TITLE/i);
  expect(linkElement).toBeInTheDocument();
});
