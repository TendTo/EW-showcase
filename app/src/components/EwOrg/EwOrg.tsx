import { ENSNamespaceTypes, IApp, IOrganization, IRole } from 'iam-client-lib';
import React, { useContext, useEffect } from 'react';
import { Spinner } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import solar_logo from '../../asset/icon/solar-logo.svg';
import { AppContext } from '../../context/appContext';
import EwApp from '../EwApp/EwApp';
import EwRole from '../EwRole/EwRole';

type Props = {
    org: IOrganization
};

function EwOrg({ org }: Props) {
    const { iam } = useContext(AppContext).state;
    const [loading, setLoading] = React.useState(false);
    const [apps, setApps] = React.useState<IApp[]>([]);
    const [orgRoles, setOrgRoles] = React.useState<IRole[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        const setup = async () => {
            setLoading(true);
            try {
                const namespace = org.namespace;
                const apps = await iam.getAppsByOrgNamespace({ namespace });
                const orgRoles = await iam.getRolesByNamespace({ parentType: ENSNamespaceTypes.Organization, namespace });
                setApps(apps);
                setOrgRoles(orgRoles);
            } catch (e) {
                console.error(e);
                setApps([]);
                setOrgRoles([]);
            }
            setLoading(false);
        }
        if (iam.isConnected() && org)
            setup();
    }, [iam, org]);

    return (
        <div className="app-table">
            <div className="app-row">
                <img alt="org logo" src={org.definition.logoUrl || solar_logo} className="app-logo" />
            </div>
            <div className="app-row">
                <div className="text-muted">{t('GENERAL.NAME')}</div>
                <div>{org.definition.orgName}</div>
            </div>
            <div className="app-row">
                <div className="text-muted">{t('GENERAL.NAMESPACE')}</div>
                <div>{org.namespace}</div>
            </div>
            {org.definition.description &&
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.DESCRIPTION')}</div>
                    <div>{org.definition.description}</div>
                </div>
            }
            {org.subOrgs && org.subOrgs.length > 0 &&
                <div className="app-row">
                    <details>
                        <summary>{t('GENERAL.SUBORGS')}</summary>
                        {org.subOrgs.map(subOrg => <EwOrg key={subOrg.id} org={subOrg} />)}
                    </details>
                </div>}
            {loading ?
                <div className="app-row"><Spinner animation="border" /></div>
                :
                <>
                    {orgRoles && orgRoles.length > 0 &&
                        <div className="app-row">
                            <details>
                                <summary>{t('GENERAL.ROLES')}</summary>
                                {orgRoles.map(role => <EwRole key={role.id} role={role} />)}
                            </details>
                        </div>}
                    {apps && apps.length > 0 &&
                        <div className="app-row">
                            <details>
                                <summary>{t('GENERAL.APPS')}</summary>
                                {apps.map(app => <EwApp key={app.id} app={app} />)}
                            </details>
                        </div>}
                </>
            }
        </div>
    );
}

export default EwOrg;
