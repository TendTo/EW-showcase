import { render, screen } from '@testing-library/react';
import AppFooter from './AppFooter';
import Web3 from 'web3';

test('renders AppFooter component', () => {
  const web3 = new Web3("http://localhost:8545");
  render(<AppFooter />);
  const linkElement = screen.getByText(/FOOTER.LEGAL/i);
  expect(linkElement).toBeInTheDocument();
});
