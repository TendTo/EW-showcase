import React, { ReactElement, SyntheticEvent, useLayoutEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './Toast.css';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

type contentType = 'normal' | 'muted' | 'primary' | 'secondary' | 'warning' | 'danger' | 'success' | 'info';
type toastComponentListEntry = {
    id: number
    component: ReactElement
};

export interface ToastOptions {
    time?: number;
    className?: string;
    clickable?: boolean;
    contentClassName?: string;
    onClick?: (e: SyntheticEvent<HTMLDivElement>) => void | Promise<void>;
}

export interface ConfigArgs extends Pick<ToastOptions, 'time' | 'className'> {
    position?: 'left' | 'center' | 'right';
}

export interface ToastProps extends Pick<ToastOptions, 'className' | 'clickable' | 'onClick' | 'contentClassName'> {
    message: string;
}

let toastComponentList: toastComponentListEntry[] = [];
const init = () => {
    const toastContainer = document.getElementById('toast_container');
    if (!toastContainer) {
        console.error("No toast_container element")
    }
    if (!toastComponentList || !Array.isArray(toastComponentList)) {
        toastComponentList = [];
    }
};

const defaultOptions: Required<ConfigArgs> = {
    time: 3000,
    className: '',
    position: 'center',
};

export const toastConfig = (options: ConfigArgs) => {
    if (options.time) defaultOptions.time = options.time;
    if (options.className) defaultOptions.className = options.className;
    if (options.position) defaultOptions.position = options.position;
};

const renderDOM = () => {
    const container = document.getElementById('toast_container');
    const position = defaultOptions.position || 'center';

    ReactDOM.render(
        <div className={`toast-list ${position}`}>
            <TransitionGroup classnames="list">
                {toastComponentList.map(t => (
                    <CSSTransition key={t.id} timeout={300} classNames="toast">
                        {t.component}
                    </CSSTransition>
                ))}
            </TransitionGroup>
        </div>,
        container,
    );
};

const Toast = ({
    message,
    className,
    contentClassName,
    clickable,
    onClick,
}: ToastProps): ReactElement => {
    const messageDOM: any = useRef();

    useLayoutEffect(() => {
        if (messageDOM.current && messageDOM.current.clientHeight) {
            const height = messageDOM.current.clientHeight;
            messageDOM.current.style.height = '0px';
            setTimeout(() => {
                if (messageDOM && messageDOM.current)
                    messageDOM.current.style.height = `${height}px`;
            }, 0);
        }
    });

    const contentClassNames = [
        'toast-content',
        clickable ? 'clickable' : '',
        contentClassName
    ].filter(Boolean).join(' ');

    const clickableProps = {
        onClick,
        tabIndex: 0,
        role: 'button',
    };

    return (
        <div ref={messageDOM} className={`toast-message ${className}`}>
            <div
                className={contentClassNames}
                {...clickable && clickableProps}
            >
                {message}
            </div>
        </div>
    );
};

function toast(message: string, time?: number): void;
function toast(message: string, contentType?: contentType): void;
function toast(message: string, options?: ToastOptions): void;
function toast(message: string, timeOrOptions?: number | ToastOptions | contentType): void {
    let config: ToastOptions;
    switch (typeof timeOrOptions) {
        case 'string':
            config = { contentClassName: `text-${timeOrOptions}` }
            break;
        case 'number':
            config = { time: timeOrOptions }
            break;
        default:
            config = timeOrOptions || {};
    }
    const {
        time = defaultOptions.time,
        clickable = false,
        className = defaultOptions.className,
        contentClassName = "",
        onClick = undefined,
    } = config;

    init();
    renderDOM();

    const id = Date.now();
    toastComponentList.push({
        id,
        component: (
            <Toast
                message={message}
                className={className}
                clickable={clickable}
                onClick={onClick}
                contentClassName={contentClassName}
            />
        ),
    });

    renderDOM();
    setTimeout(() => {
        const index = toastComponentList.findIndex(t => t.id === id);
        toastComponentList.splice(index, 1);
        renderDOM();
    }, time);
}

export function toastMetamaskError(err: { message: string, code: number }, t: (str: string) => string): void {
    switch (err.code) {
        case 4001:
            return toast(t("ERROR.REQUEST_REJECTED"), 'danger');
        case -32002:
            return toast(t("ERROR.REQUEST_ALREADY_SENT"), 'warning');
        default:
            return toast(t("ERROR.GENERIC"), 'danger');
    }
}

export default toast;