import React from 'react';
import { Card } from 'react-bootstrap';
import ApiResult from '../../api/ApiResult';
import { getAccountInfoResponse } from '../../api/VoltaApi';
import EwTransaction from '../EwTransaction/EwTransaction';
import './EwAccount.css';

type Props = {
    address: string
    account: getAccountInfoResponse
};

function EwAccount({ account, address }: Props) {

    const getTransactionsComponent = (account: getAccountInfoResponse) => {
        return account.tx.result.slice(0, 10)
            .map((tx, i) => <tr key={i}><td><EwTransaction transaction={tx} address={address}></EwTransaction></td></tr>)
    }

    const goToAddress = (address: string) => {
        window.location.href = `https://volta-explorer.energyweb.org/address/${address}/transactions`
    }

    return (
        <Card className="text-center border-primary">
            <Card.Body>
                <Card.Title className="address-info" onClick={() => goToAddress(address)}>{address}</Card.Title>
                <p><b>Balance: </b><span>{ApiResult.convertVT(account.balance.result)} VT</span></p>
                <p><span>{account.token.result.length}</span><b> tokens</b></p>
                <hr></hr>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Transactions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getTransactionsComponent(account)}
                    </tbody>
                </table>
            </Card.Body>
        </Card>
    );
}

export default EwAccount;
