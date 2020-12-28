import { getStoreBuilder, BareActionContext } from 'vuex-typex';
import { RootState } from '../store';
import { MODULES } from '@/constants';
import { authenticate } from '@/api/api';
import message from '@/i18n';
import { pushApiJob } from '@/utils/jobQueue';
import { remote } from 'electron';
import { promises as fs } from 'fs';
import { join } from 'path';

export interface AuthenticationState {
  sessionId: string;
  accountName: string;
  isLoading: boolean;
  errorMessage: string;
  rootCacheDir: string;
  accountCacheDir: string;
  offlineMode: boolean;
  offlineAccounts: string[];
}

export const initialAuthenticationState: AuthenticationState = {
  sessionId: '',
  isLoading: false,
  errorMessage: '',
  accountName: '',
  rootCacheDir: '',
  accountCacheDir: '',
  offlineMode: false,
  offlineAccounts: [],
};

const builder = getStoreBuilder<RootState>().module(
  MODULES.authentication,
  initialAuthenticationState,
);

//state
const stateGetter = builder.state();

//mutations
function setIsLoading(state: AuthenticationState, payload: boolean) {
  state.isLoading = payload;
}

function setSessionId(state: AuthenticationState, sessionId: string) {
  state.sessionId = sessionId;
}

function setErrorMessage(state: AuthenticationState, error: string) {
  state.errorMessage = error;
}

function setAccountName(state: AuthenticationState, accountName: string) {
  state.accountName = accountName;
}

function setRootCacheDir(state: AuthenticationState, dir: string) {
  state.rootCacheDir = dir;
}

function setAccountCacheDir(state: AuthenticationState, dir: string) {
  state.accountCacheDir = dir;
}

function setOfflineMode(state: AuthenticationState, mode: boolean) {
  state.offlineMode = mode;
}

function setofflineAccounts(state: AuthenticationState, accounts: string[]) {
  state.offlineAccounts = accounts;
}

//actions
async function login(
  context: BareActionContext<AuthenticationState, RootState>,
  payload: { sessionId: string },
) {
  authentication.setIsLoading(true);
  authentication.setErrorMessage('');

  try {
    const accountName = await pushApiJob(
      () => authenticate(payload.sessionId),
      message.jobs.authenticate_message,
    );
    authentication.setSessionId(payload.sessionId);
    authentication.setAccountName(accountName);
    await authentication.createAccountCacheDir().catch(() => {
      /* ignore; TODO */
    });
  } catch (e) {
    authentication.setErrorMessage(message.login.login_error_message);
    throw e;
  } finally {
    authentication.setIsLoading(false);
  }
}

async function offlineLogin(
  context: BareActionContext<AuthenticationState, RootState>,
  payload: { accountName: string },
) {
  authentication.setOfflineMode(true);
  authentication.setAccountName(payload.accountName);
  await authentication.createAccountCacheDir().catch(() => {
    /* ignore; TODO */
  });
}

async function createRootCacheDir(): Promise<void> {
  const appDataDir = remote.app.getPath('userData');
  const cacheDirPath = join(appDataDir, 'inventoryCache');
  return fs
    .mkdir(cacheDirPath, { recursive: true })
    .then(() => authentication.setRootCacheDir(cacheDirPath))
    .then(() => loadOfflineAccountsList(cacheDirPath));
}

async function loadOfflineAccountsList(rootCacheDir: string): Promise<void> {
  if (rootCacheDir) {
    fs.readdir(rootCacheDir)
      .then((files) =>
        files.filter(
          async (fileName) => (await fs.lstat(join(rootCacheDir, fileName))).isDirectory,
        ),
      )
      .then((directories) =>
        authentication.setofflineAccounts(directories.map(decodeURIComponent)),
      );
  }
}

async function createAccountCacheDir(): Promise<void> {
  const accountName = stateGetter().accountName;
  const rootCacheDir = stateGetter().rootCacheDir;
  if (accountName && rootCacheDir) {
    const cacheDirPath = join(rootCacheDir, encodeURIComponent(accountName));
    return fs
      .mkdir(cacheDirPath, { recursive: true })
      .then(() => authentication.setAccountCacheDir(cacheDirPath));
  }
}

export const authentication = {
  get state() {
    return stateGetter();
  },

  setIsLoading: builder.commit(setIsLoading),
  setSessionId: builder.commit(setSessionId),
  setErrorMessage: builder.commit(setErrorMessage),
  setAccountName: builder.commit(setAccountName),
  setRootCacheDir: builder.commit(setRootCacheDir),
  setAccountCacheDir: builder.commit(setAccountCacheDir),
  setOfflineMode: builder.commit(setOfflineMode),
  setofflineAccounts: builder.commit(setofflineAccounts),

  login: builder.dispatch(login),
  offlineLogin: builder.dispatch(offlineLogin),
  createRootCacheDir: builder.dispatch(createRootCacheDir),
  createAccountCacheDir: builder.dispatch(createAccountCacheDir),
};
