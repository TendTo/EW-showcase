import { render, screen } from '@testing-library/react';
import AppFooter from './AppFooter';

test('renders AppFooter component', () => {
  render(<AppFooter />);
  const linkElement = screen.getByText(/FOOTER.LEGAL/i);
  expect(linkElement).toBeInTheDocument();
});
