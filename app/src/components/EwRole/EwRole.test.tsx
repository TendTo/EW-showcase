import { render, screen } from '@testing-library/react';
import { IAM } from 'iam-client-lib';
import { act } from 'react-dom/test-utils';
import EwRole from './EwRole';

test('renders EwRole component', async () => {
    const role = {
        id: "id", name: "name", namespace: "namespace", owner: "owner", isOwnedByCurrentUser: false, definition: {
            roleType: "Organization",
            roleName: "roleName",
            fields: [],
            metadata: [],
            version: 1,
            issuer: { issuerType: "DID", did: ["did1", "did2"] },
            enrolmentPreconditions: []
        }
    }
    await act(async () => {
        render(<EwRole role={role} />);
    });
    const element = screen.getByText(/roleName/);
    expect(element).toBeInTheDocument();
});
