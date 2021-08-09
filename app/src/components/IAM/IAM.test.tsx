import { render, screen } from '@testing-library/react';
import Iam from './IAM';

test('renders IAM component', () => {
    render(<Iam account={"account"} />);
    const linkElement = screen.getByText(/IAM.TITLE/i);
    expect(linkElement).toBeInTheDocument();
});
