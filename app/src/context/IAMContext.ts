import { createContext } from 'react';
import { IAM } from 'iam-client-lib';

export default createContext(new IAM());