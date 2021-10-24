import { IOrganization } from "iam-client-lib/dist/src/cacheServerClient/cacheServerClient.types";
import React, { useContext, useEffect, useState } from "react";
import { Spinner } from "react-bootstrap";
import { AppContext } from "../../context/appContext";
import EwOrg from "../EwOrg/EwOrg";

type Props = {
    did: string
};

function IAMDetails({ did }: Props) {
    const namespace = "unict.iam.ewc";
    const { iam } = useContext(AppContext).state;
    const [loading, setLoading] = useState(false);
    const [org, setOrg] = useState<(IOrganization)>();

    useEffect(() => {
        const setup = async () => {
            setLoading(true);
            try {
                const org = await iam.getOrgHierarchy({ namespace });
                setOrg(org);
            } catch (e) {
                console.error(e);
                setOrg(undefined);
            }
            setLoading(false);
        }
        if (iam.isConnected() && did)
            setup();
    }, [iam, did]);

    return (
        <>
            {loading ?
                <div className="text-center mt-2"><Spinner animation="border" /></div>
                :
                <>
                    {org &&
                        <EwOrg org={org}></EwOrg>
                    }
                </>
            }
        </>
    );
}

export default IAMDetails;