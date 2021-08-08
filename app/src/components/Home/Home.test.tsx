import { render, screen } from '@testing-library/react';
import Home from './Home';

test('renders Home component', () => {
  render(<Home />);
  const linkElement = screen.getByText(/HOME.TITLE/i);
  expect(linkElement).toBeInTheDocument();
});
