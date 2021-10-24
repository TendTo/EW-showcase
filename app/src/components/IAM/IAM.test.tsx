import { render, screen } from '@testing-library/react';
import IAM from './IAM';

test('renders IAM component', () => {
    render(<IAM />);
    const element = screen.getByText(/IAM.TITLE/i);
    expect(element).toBeInTheDocument();
});
