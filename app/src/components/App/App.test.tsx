import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders App component', () => {
  render(<App />);
  const linkElement = screen.getAllByText(/Energy Web Dapp showcase/i);
  expect(linkElement.length > 0).toBe(true);
});
