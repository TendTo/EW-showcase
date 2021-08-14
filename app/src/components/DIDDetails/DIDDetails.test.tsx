import { render, screen } from '@testing-library/react';
import { IAM } from 'iam-client-lib';
import { act } from 'react-dom/test-utils';
import DIDDetails from './DIDDetails';

test('renders DIDDetails component', async () => {
    jest.spyOn(IAM.prototype, "getUserClaims").mockImplementationOnce(async () => []);
    await act(async () => {
        render(<DIDDetails did={"didValue"} />);
    });
    const titleElement = screen.getByText(/DID.USER_DID/i);
    expect(titleElement).toBeInTheDocument();
    const didElement = screen.getByText(/didValue/);
    expect(didElement).toBeInTheDocument();
});
