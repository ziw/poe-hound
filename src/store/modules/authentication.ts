import { getStoreBuilder, BareActionContext } from "vuex-typex";
import { RootState } from "../store"
import { MODULES } from "@/constants";
import { authenticate } from "@/api/api";

export interface AuthenticationState {
  sessionId: string | undefined;
  isLoading: boolean;
  errorMessage: string | undefined;
}

export const initialAuthenticationState: AuthenticationState = {
  sessionId: undefined,
  isLoading: false,
  errorMessage: undefined,
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

//actions
async function login(context: BareActionContext<AuthenticationState, RootState>, payload: { sessionId: string }){
  authentication.setIsLoading(true);
  const result = await authenticate(payload.sessionId);
  if(result){
    authentication.setSessionId(payload.sessionId);
  }
  authentication.setIsLoading(false);
  return result;
}

export const authentication = {
  get state() { return stateGetter() },

  setIsLoading: builder.commit(setIsLoading),
  setSessionId: builder.commit(setSessionId),

  login: builder.dispatch(login),
}
