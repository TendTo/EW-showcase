import { fireEvent, render, screen } from '@testing-library/react';
import DIDEdit from './DIDEdit';

describe('DIDEdit component', () => {

    test('renders DIDEdit component', () => {
        const { container } = render(<DIDEdit did="testDid" profile={undefined} setProfileClaims={(_) => { }} />);
        const element = container.getElementsByClassName('fa fa-pencil');
        const titleElement = screen.queryByText(/^DID.EDIT_TITLE$/);

        expect(element).toHaveLength(1);
        expect(titleElement).toBeNull();
    });

    test('renders DIDEdit modal', () => {
        const { container } = render(<DIDEdit did="testDid" profile={undefined} setProfileClaims={(_) => { }} />);
        const element = container.getElementsByClassName('fa fa-pencil');
        fireEvent.click(element[0]);
        const titleElement = screen.getByText(/^DID.EDIT_TITLE$/i);

        expect(titleElement).toBeInTheDocument();
    });
});