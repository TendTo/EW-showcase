import { ENSNamespaceTypes, IApp, IRole } from 'iam-client-lib';
import React, { useContext, useEffect, useState } from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import solar_logo from '../../asset/icon/solar-logo.svg';
import { AppContext } from '../../context/appContext';
import EwRole from '../EwRole/EwRole';

type Props = {
    app: IApp
};

function EwApp({ app }: Props) {
    const { iam } = useContext(AppContext).state;
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
                <div className="text-muted">{t('GENERAL.NAME')}</div>
                <div>{app.definition.appName}</div>
            </div>
            <div className="app-row">
                <div className="text-muted">{t('GENERAL.NAMESPACE')}</div>
                <div>{app.namespace}</div>
            </div>
            {app.definition.websiteUrl &&
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.WEBSITE')}</div>
                    <div>{app.definition.websiteUrl}</div>
                </div>
            }
            {app.definition.description &&
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.DESCRIPTION')}</div>
                    <div>{app.definition.description}</div>
                </div>
            }
            {app.definition.others &&
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.OTHER_JSON')}</div>
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
                                <summary>{t('GENERAL.ROLES')}</summary>
                                {appRoles.map(role => <EwRole key={role.id} role={role} />)}
                            </details>
                        </div>}
                </>
            }
        </div>
    );
}

export default EwApp;
