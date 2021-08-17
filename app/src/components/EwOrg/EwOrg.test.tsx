import { render, screen } from '@testing-library/react';
import { IAM } from 'iam-client-lib';
import { act } from 'react-dom/test-utils';
import EwOrg from './EwOrg';

test('renders EwOrg component', async () => {
    const org = {
        id: "id", name: "name", namespace: "namespace", owner: "owner", isOwnedByCurrentUser: false, definition: {
            orgName: "orgName",
            logoUrl: "logoUrl",
            websiteUrl: "websiteUrl",
            description: "description",
        }
    }
    jest.spyOn(IAM.prototype, "isConnected").mockImplementationOnce(() => true);
    jest.spyOn(IAM.prototype, "getRolesByNamespace").mockImplementationOnce(async () => []);
    jest.spyOn(IAM.prototype, "getAppsByOrgNamespace").mockImplementationOnce(async () => []);
    await act(async () => {
        render(<EwOrg org={org} />);
    });
    const element = screen.getByText(/orgName/);
    expect(element).toBeInTheDocument();
});
