import { render } from '@testing-library/react';
import DIDEdit from './DIDEdit';

test('renders DIDEdit component', () => {
    const { container } = render(<DIDEdit did="testDid" profile={undefined} setProfileClaims={(_) => {}}/>);
    const elemnt = container.getElementsByClassName('fa fa-pencil');
    expect(elemnt).toHaveLength(1);
});
