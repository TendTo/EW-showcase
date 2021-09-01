import { createContext } from 'react';
import { IAM, setCacheClientOptions } from 'iam-client-lib';

export const cacheUrl = "https://volta-identitycache.energyweb.org/";
export const switchboardUrl = "https://volta-switchboard.energyweb.org/#";

export const stakeCacheUrl = 'https://identitycache-dev.energyweb.org/';
export const stakeSwitchboardUrl = "https://stake.energyweb.org";

setCacheClientOptions(73799, {
    url: cacheUrl,
});

export default createContext(new IAM());