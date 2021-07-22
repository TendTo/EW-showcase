import { timeStamp } from 'console';
import React from 'react';
import Transaction from '../../api/Transaction';
import { getTransactionListSingleResponse } from '../../api/VoltaApi';


type Props = {
    address: string
    transaction: getTransactionListSingleResponse
};

function EwTransaction({ transaction, address }: Props) {
    const tx = new Transaction(transaction);

    return (
        <div className="">
            <div className="row tile-body">
                <div className="col-md-2 d-flex flex-row flex-md-column">
                    <span className="tile-label">
                        Transaction
                    </span>
                    <span className="badge title-badge">
                        {transaction.isError == "1" ? 'Error' : 'Success'}
                    </span>
                </div>
                <div className="col-md-7 col-lg-8 d-flex flex-column pr-2 pr-sm-2 pr-md-0">
                    <span>
                        <div className="text-truncate d-flex">
                            <a className="text-truncate" href={tx.transactionUrl}>
                                {tx.hash}
                            </a>
                            <div className="ml-1">
                                {tx.method}
                            </div>
                        </div>
                    </span>
                    <span>
                        <a href={tx.fromAddressUrl}>
                            <span>
                                <span className="d-none d-md-none d-xl-inline">{tx.from}</span>
                                <span className="d-md-inline-block d-xl-none">{tx.shortFrom}</span>
                            </span>
                        </a>
                        →
                        <span>
                            <span className="d-none d-md-none d-xl-inline">{tx.to || address}</span>
                            <span className="d-md-inline-block d-xl-none">{tx.shortTo || Transaction.shortenAddress(address)}</span>
                        </span>
                    </span>
                    <span className="d-flex flex-md-row flex-column mt-3 mt-md-0">
                        <span className="tile-title">
                            {tx.valueVt} VT
                        </span>
                        <span className="ml-0 ml-md-1 text-nowrap text-muted">
                            {tx.gasVt} TX Fee
                        </span>
                    </span>
                </div>
                <div className="col-md-3 col-lg-2 d-flex flex-row flex-md-column flex-nowrap justify-content-center text-md-right mt-3 mt-md-0 tile-bottom">
                    <span className="mr-2 mr-md-0 order-1">
                        <a href={tx.blockNumberUrl}>Block #{tx.blockNumber}</a>
                    </span>
                    <span className="mr-2 mr-md-0 order-2">{tx.UTCTimestamp}</span>
                    <span className="mr-2 mr-md-0 order-0 order-md-3">
                        {tx.to && (
                            <span className={`badge badge-${tx.isInTransaction(address) ? "success" : "warning"} tile-badge`}>
                                {tx.isInTransaction(address) ? "IN" : "OUT"}
                            </span>
                        )}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default EwTransaction;
