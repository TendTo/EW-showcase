import { Signer, VoidSigner } from "ethers";
import { IAM } from "iam-client-lib";
import createCtx from './createCtx';

/** Type of the data contained in _appContext_ */
export type appContextData = { iam: IAM, signer: Signer, address: string, chainName: string };
/** Context object and provider used throughout the app */
const [ctx, provider] = createCtx<appContextData>({
    iam: new IAM(),
    signer: new VoidSigner(""),
    address: "",
    chainName: "",
});
export const AppContext = ctx;
export const AppContextProvider = provider;
