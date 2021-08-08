import React from 'react';
import Transaction from '../../api/Transaction';
import { getTransactionListSingleResponse } from '../../api/VoltaApi';
import './EwTransaction.css';


type Props = {
    address: string
    transaction: getTransactionListSingleResponse
};

function EwTransaction({ transaction, address }: Props) {
    const tx = new Transaction(transaction);

    return (
        <div className={`transaction-container transaction-container-${transaction.isError === '1' ? "danger" : "success"}`}>
            <div className="transaction-header">
                <a className="text-truncate" href={tx.transactionUrl} target="_blank" rel="noreferrer">
                    {tx.hash}
                </a>
                <div className="transaction-method">
                    {tx.method}
                </div>
            </div>
            <div className="transaction-address-container">
                <a href={tx.fromAddressUrl} target="_blank" rel="noreferrer">
                    <span>
                        <span className="transaction-long-address">{tx.from}</span>
                        <span className="transaction-short-address">{tx.shortFrom}</span>
                    </span>
                </a>
                <span>
                    →
                </span>
                <span>
                    <span className="transaction-long-address">{tx.to || address}</span>
                    <span className="transaction-short-address">{tx.shortTo || Transaction.shortenAddress(address)}</span>
                </span>
            </div>
            <span className="tile-title">
                {tx.valueVt} VT
            </span>
            <span className="text-muted">
                {tx.gasVt} VT Fee
            </span>
            <div className="transaction-footer">
                <div>
                    {tx.to && (
                        <span className={`badge badge-${tx.isInTransaction(address) ? "success" : "warning"} tile-badge`}>
                            {tx.isInTransaction(address) ? "IN" : "OUT"}
                        </span>
                    )}
                    <span>
                        <a href={tx.blockNumberUrl} target="_blank" rel="noreferrer">Block #{tx.blockNumber}</a>
                    </span>
                </div>
                <span className="text-muted">{tx.UTCTimestamp}</span>
            </div>
        </div>
    );
}

export default EwTransaction;
