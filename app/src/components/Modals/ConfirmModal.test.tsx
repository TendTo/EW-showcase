import { fireEvent, render, screen } from '@testing-library/react';
import ConfirmModal from './ConfirmModal';

describe('ConfirmModal component', () => {

    test('renders ConfirmModal component', () => {
        const { container } = render(<ConfirmModal
            icon="trash"
            variant="danger"
            loading={false}
            onSubmit={() => new Promise(() => { })}
            title="Title"
            message="Message"
            warning="Warning"
            buttonDisabled={false}
        />);
        const element = container.getElementsByClassName('fa fa-trash');
        const titleElement = screen.queryByText(/^Title$/i);

        expect(element).toHaveLength(1);
        expect(titleElement).toBeNull();
    });

    test('renders ConfirmModal modal', () => {
        const { container } = render(<ConfirmModal
            icon="trash"
            variant="danger"
            loading={false}
            onSubmit={() => new Promise(() => { })}
            title="Title"
            message="Message"
            warning="Warning"
            buttonDisabled={false}
        />);
        const element = container.getElementsByClassName('fa fa-trash');
        fireEvent.click(element[0]);
        const titleElement = screen.getByText(/^Title$/i);

        expect(titleElement).toBeInTheDocument();
    });
});