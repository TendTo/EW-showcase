import { IAM } from 'iam-client-lib';
import { createContext } from 'react';

export const cacheUrl = "https://volta-identitycache.energyweb.org/v1";
export const switchboardUrl = "https://volta-switchboard.energyweb.org/#";

export const stakeCacheUrl = 'https://identitycache-dev.energyweb.org/';
export const stakeSwitchboardUrl = "https://stake.energyweb.org";

// setCacheClientOptions(73799, {
//     url: cacheUrl,
// });

export default createContext(new IAM());