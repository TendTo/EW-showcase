import { render, screen } from '@testing-library/react';
import { IAM } from 'iam-client-lib';
import { act } from 'react-dom/test-utils';
import EwApp from './EwApp';

test('renders EwApp component', async () => {
    const app = {
        id: "id", name: "name", namespace: "namespace", owner: "owner", isOwnedByCurrentUser: false, definition: {
            appName: "appName",
            logoUrl: "logoUrl",
            websiteUrl: "websiteUrl",
            description: "description"
        }
    }
    jest.spyOn(IAM.prototype, "isConnected").mockImplementationOnce(() => true);
    jest.spyOn(IAM.prototype, "getRolesByNamespace").mockImplementationOnce(async () => []);
    await act(async () => {
        render(<EwApp app={app} />);
    });
    const element = screen.getByText(/appName/);
    expect(element).toBeInTheDocument();
});
