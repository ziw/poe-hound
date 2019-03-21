import { getStoreBuilder, BareActionContext } from "vuex-typex";
import { RootState } from "../store"
import { MODULES } from "@/constants";
import { authenticate } from "@/api/api";
import message from '@/i18n';
import { pushApiJob } from '@/utils/jobQueue';

export interface AuthenticationState {
  sessionId: string;
  accountName: string;
  isLoading: boolean;
  errorMessage: string;
}

export const initialAuthenticationState: AuthenticationState = {
  sessionId: '',
  isLoading: false,
  errorMessage: '',
  accountName: '',
}

const builder = getStoreBuilder<RootState>().module(MODULES.authentication, initialAuthenticationState);

//state
const stateGetter = builder.state();

//mutations
function setIsLoading(state: AuthenticationState, payload: boolean){
  state.isLoading = payload;
}

function setSessionId(state: AuthenticationState, sessionId: string){
  state.sessionId = sessionId;
}

function setErrorMessage(state: AuthenticationState, error: string){
  state.errorMessage = error;
}

function setAccountName(state: AuthenticationState, accountName: string){
  state.accountName = accountName
}

//actions
async function login(context: BareActionContext<AuthenticationState, RootState>, payload: { sessionId: string }){
  authentication.setIsLoading(true);
  authentication.setErrorMessage('');

  try{
    const accountName = await pushApiJob(
      () => authenticate(payload.sessionId),
      message.jobs.authenticate_message,
    );
    authentication.setSessionId(payload.sessionId);
    authentication.setAccountName(accountName);
  }catch(e){
    authentication.setErrorMessage(message.login.login_error_message);
    throw(e);
  }finally{
    authentication.setIsLoading(false);
  }
}

export const authentication = {
  get state() { return stateGetter() },

  setIsLoading: builder.commit(setIsLoading),
  setSessionId: builder.commit(setSessionId),
  setErrorMessage: builder.commit(setErrorMessage),
  setAccountName: builder.commit(setAccountName),

  login: builder.dispatch(login),
}
