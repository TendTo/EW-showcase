import { screen, render } from '@testing-library/react';
import toast, { toastMetamaskError } from './Toast';


describe("toast component", () => {
    beforeEach(() => {
        render(<div id="toast_container"></div>);
    });

    test('toast component supports class params', async () => {
        toast("Test message 1", "danger");
        const element = screen.getByText(/Test message 1/);
        expect(element).toBeInTheDocument();
        expect(element.classList).toContain("text-danger");
    });

    test('renders toast component', async () => {
        toast("Test message 2");
        const element = screen.getByText(/Test message 2/);
        expect(element).toBeInTheDocument();
    });

    test('call toastMetamaskError utility function', async () => {
        const t = (s: string) => s;
        toastMetamaskError({ message: "Error1", code: 4001 }, t);
        toastMetamaskError({ message: "Error2", code: -32002 }, t);
        toastMetamaskError({ message: "Error3", code: 1 }, t);

        const element1 = screen.getByText(/^ERROR.REQUEST_REJECTED$/);
        const element2 = screen.getByText(/^ERROR.REQUEST_ALREADY_SENT$/);
        const element3 = screen.getByText(/^ERROR.GENERIC$/);

        expect(element1).toBeInTheDocument();
        expect(element2).toBeInTheDocument();
        expect(element3).toBeInTheDocument();
    });
});