import { render, screen } from '@testing-library/react';
import References from './References';

test('renders References component', () => {
  render(<References />);
  const linkElement = screen.getByText(/REFERENCES.TITLE/i);
  expect(linkElement).toBeInTheDocument();
});
