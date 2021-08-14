import { screen, render } from '@testing-library/react';
import toast from './Toast';


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
});