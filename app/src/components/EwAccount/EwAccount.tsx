import React from 'react';
import { Card } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import ApiResult from '../../api/ApiResult';
import { getAccountInfoResponse } from '../../api/VoltaApi';
import EwTransaction from '../EwTransaction/EwTransaction';
import './EwAccount.css';

type Props = {
    address: string
    account: getAccountInfoResponse
};

function EwAccount({ account, address }: Props) {
    const { t } = useTranslation();

    const getTransactionsComponent = (account: getAccountInfoResponse) => {
        return account.tx.result.slice(0, 5)
            .map((tx, i) => <EwTransaction key={tx.hash} transaction={tx} address={address}></EwTransaction>)
    }

    return (
        <Card className="text-center border-primary">
            <Card.Body>
                <Card.Title className="address-info">
                    <a href={`https://volta-explorer.energyweb.org/address/${address}/transactions`} target="_blank" rel="noreferrer">{address}</a>
                </Card.Title>
                <p><b>{t("EW_ACCOUNT.BALANCE")} </b><span>{ApiResult.convertVT(account.balance.result.slice(0, 10))} VT</span></p>
                <p><span>{account.token.result.length}</span><b> token</b></p>
                <hr />
                <h5>{t('EW_ACCOUNT.TRANSACTION')}</h5>
                {getTransactionsComponent(account)}
            </Card.Body>
        </Card>
    );
}

export default EwAccount;
