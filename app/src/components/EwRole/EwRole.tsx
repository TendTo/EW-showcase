import { ENSNamespaceTypes, IRole } from 'iam-client-lib';
import React from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { switchboardUrl } from '../../types/constants';


type Props = {
    role: IRole
};

function EwRole({ role }: Props) {
    const { t } = useTranslation();

    const preconditions = role.definition.enrolmentPreconditions.filter(precondition => precondition.conditions && precondition.conditions.length > 0);

    const enrlomentUrl = () => {
        if (!(role?.definition?.roleType)) return "";

        const name = role.name;
        const arr = role.namespace.split(`.${ENSNamespaceTypes.Roles}.`);
        let namespace = '';

        if (arr.length > 1) {
            namespace = arr[1];
        }

        return `${switchboardUrl}/enrol?${role.definition.roleType}=${namespace}&roleName=${name}`;
    }

    const preconditionsComponent = preconditions.map((precondition, i) =>
        <div key={`${role.id}-${i}`} className="app-row-set light">
            <div className="app-row">
                <div className="text-muted">{t('GENERAL.TYPE')}</div>
                <div>{precondition.type}</div>
            </div>
            <div className="app-row">
                <div className="text-muted">{t('GENERAL.CONDITIONS')}</div>
                <div>{precondition.conditions.join("\n")}</div>
            </div>
        </div>
    );

    const fieldsComponent = role.definition.fields.map(field =>
        <div key={`${role.id}-${field.label}`} className="app-row-set warning">
            <div className="app-row">
                <div className="text-muted">{t('GENERAL.LABEL')}</div>
                <div>{field.label}</div>
            </div>
            <div className="app-row">
                <div className="text-muted">{t('GENERAL.TYPE')}</div>
                <div>{field.fieldType}</div>
            </div>
            {field.required &&
                <div className="app-row">
                    <div>{t('GENERAL.REQUIRED')}</div>
                </div>
            }
            {field.minValue &&
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.MIN_VALUE')}</div>
                    <div>{field.minValue}</div>
                </div>
            }
            {field.maxValue &&
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.MAX_VALUE')}</div>
                    <div>{field.maxValue}</div>
                </div>
            }
            {field.minDate &&
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.MIN_DATE')}</div>
                    <div>{field.minDate}</div>
                </div>
            }
            {field.maxDate &&
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.MAX_DATE')}</div>
                    <div>{field.maxDate}</div>
                </div>
            }
            {field.minLength &&
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.MIN_LENGTH')}</div>
                    <div>{field.minLength}</div>
                </div>
            }
            {field.maxLength &&
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.MAX_LENGTH')}</div>
                    <div>{field.maxLength}</div>
                </div>
            }
            {field.pattern &&
                <div className="app-row">
                    <div className="text-muted">{t('GENERAL.PATTERN')}</div>
                    <div>{field.pattern}</div>
                </div>
            }
        </div>
    );

    return (
        <div className="app-row-set success">
            <div className="app-row">
                <div className="d-flex align-items-baseline justify-content-between">
                    <div className="text-muted">{t('GENERAL.NAME')}</div>
                    <Button variant="outline-light" href={enrlomentUrl()} target="_blank">
                        <i className="fa fa-pencil" />
                    </Button>
                </div>
                <div>{role.definition.roleName}</div>
            </div>
            <div className="app-row">
                <div className="text-muted">{t('GENERAL.NAMESPACE')}</div>
                <div>{role.namespace}</div>
            </div>
            <div className="app-row">
                <div className="text-muted">{t('GENERAL.TYPE')}</div>
                <div>{role.definition.roleType}</div>
            </div>
            <div className="app-row">
                <div className="text-muted">{t('GENERAL.VERSION')}</div>
                <div>{role.definition.version}</div>
            </div>
            <div className="app-row">
                <div className="text-muted">{t('GENERAL.ISSUER_TYPE')}</div>
                <div>{role.definition.issuer.issuerType}</div>
            </div>
            <div className="app-row">
                <div className="text-muted">{t('GENERAL.ISSUER_LIST')}</div>
                <div>{(role.definition.issuer.issuerType === "DID" ? role.definition.issuer.did?.join("\n") : role.definition.issuer.roleName)}</div>
            </div>
            {preconditions && preconditions.length > 0 &&
                <div className="app-row">
                    <details>
                        <summary>{t('GENERAL.RESTRICTIONS_ROLE_PRECONDITIONS')}</summary>
                        {preconditionsComponent}
                    </details>
                </div>
            }
            {role.definition.fields && role.definition.fields.length > 0 &&
                <div className="app-row">
                    <details>
                        <summary>{t('GENERAL.FIELDS')}</summary>
                        {fieldsComponent}
                    </details>
                </div>
            }
        </div>
    );
}

export default EwRole;
