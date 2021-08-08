import { render, screen } from '@testing-library/react';
import EwAccount from './EwTransaction';

type status = '0' | '1';

test('renders EwTransaction component', () => {
    const address = "0xef131ed1460626e97F34243DAc544B42eb52a472";
    const tx = {"blockHash":"0x16cda1ea73f3202bcab9ff5de52e1b915d09666f3c6574a140c7ca4b272141a8","blockNumber":"12935456","confirmations":"55967","contractAddress":"","cumulativeGasUsed":"4119293","from":"0xef131ed1460626e97f34243dac544b42eb52a472","gas":"36501","gasPrice":"60","gasUsed":"36501","hash":"0x3724e60f16dfe580b1333620084e6b5ca8a247b68c812d36ff229b315fe0b3e7","input":"input","isError":"0" as status,"nonce":"41","timeStamp":"1628156755","to":"0xc15d5a57a8eb0e1dcbe5d88b8f9a82017e5cc4af","transactionIndex":"36","txreceipt_status":"1","value":"0"};
    render(<EwAccount address={address} transaction={tx} />);
    const linkElement = screen.getByText(/0x3724e60f16dfe580b1333620084e6b5ca8a247b68c812d36ff229b315fe0b3e7/i);
    expect(linkElement).toBeInTheDocument();
});