import { getStoreBuilder, BareActionContext } from "vuex-typex";
import { RootState } from "../store"
import { MODULES } from "@/constants";
import { authenticate } from "@/api/api";
import message from '@/i18n';

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

  let accountName = undefined;
  try{
    accountName = await authenticate(payload.sessionId);
  }catch{}
  finally{
    if(accountName){
      authentication.setSessionId(payload.sessionId);
      authentication.setAccountName(accountName);
    }else{
      authentication.setErrorMessage(message.login.login_error_message);
    }
    authentication.setIsLoading(false);
  }
  return accountName;
}

export const authentication = {
  get state() { return stateGetter() },

  setIsLoading: builder.commit(setIsLoading),
  setSessionId: builder.commit(setSessionId),
  setErrorMessage: builder.commit(setErrorMessage),
  setAccountName: builder.commit(setAccountName),

  login: builder.dispatch(login),
}
