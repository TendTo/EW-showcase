import { ENSNamespaceTypes, IApp, IRole } from 'iam-client-lib';
import React, { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import solar_logo from '../../asset/icon/solar-logo.svg';
import IAMContext from '../../context/IAMContext';
import EwRole from '../EwRole/EwRole';

type Props = {
    app: IApp
};

function EwApp({ app }: Props) {
    const iam = useContext(IAMContext);
    const [loading, setLoading] = useState(false);
    const [appRoles, setAppRoles] = useState<IRole[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        const setup = async () => {
            setLoading(true);
            try {
                const namespace = app.namespace;
                const appRole = await iam.getRolesByNamespace({ parentType: ENSNamespaceTypes.Application, namespace });
                setAppRoles(appRole);
            } catch (e) {
                console.error(e);
                setAppRoles([]);
            }
            setLoading(false);
        }
        if (iam.isConnected() && app)
            setup();
    }, [iam, app]);

    return (
        <div className="app-row-set info">
            <div className="app-row">
                <img alt="org logo" src={app.definition.logoUrl || solar_logo} className="app-logo" />
            </div>
            <div className="app-row">
                <div className="d-flex align-items-baseline justify-content-between">
                    <div className="text-muted">Name</div>
                </div>
                <div>{app.definition.appName}</div>
            </div>
            <div className="app-row">
                <div className="d-flex align-items-baseline justify-content-between">
                    <div className="text-muted">Namespace</div>
                </div>
                <div>{app.namespace}</div>
            </div>
            {app.definition.websiteUrl &&
                <div className="app-row">
                    <div className="d-flex align-items-baseline justify-content-between">
                        <div className="text-muted">Website</div>
                    </div>
                    <div>{app.definition.websiteUrl}</div>
                </div>
            }
            {app.definition.description &&
                <div className="app-row">
                    <div className="d-flex align-items-baseline justify-content-between">
                        <div className="text-muted">Description</div>
                    </div>
                    <div>{app.definition.description}</div>
                </div>
            }
            {app.definition.others &&
                <div className="app-row">
                    <div className="d-flex align-items-baseline justify-content-between">
                        <div className="text-muted">Other (JSON)</div>
                    </div>
                    <div>{JSON.stringify(app.definition.others)}</div>
                </div>
            }
            {loading ?
                <div className="app-row"><Spinner animation="border" /></div>
                :
                <>
                    {appRoles && appRoles.length > 0 &&
                        <div className="app-row">
                            <details>
                                <summary>Roles</summary>
                                {appRoles.map(role => <EwRole key={role.id} role={role} />)}
                            </details>
                        </div>}
                </>
            }
        </div>
    );
}

export default EwApp;
