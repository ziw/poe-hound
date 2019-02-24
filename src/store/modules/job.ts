import { getStoreBuilder, BareActionContext } from "vuex-typex";
import { RootState } from "../store"
import { MODULES } from "@/constants";
import queue, { SuccessCallBack } from '@/utils/jobQueue';

export interface JobState {
  remainingJobCount: number;
  currentJobMessage: string;
}

export const initialJobState: JobState = {
  remainingJobCount: 0,
  currentJobMessage: '',
}

const builder = getStoreBuilder<RootState>().module(MODULES.job, initialJobState);

export const job = {
  get state() { return builder.state()() },

  setRemainingJobCount: builder.commit((state, count: number) => {
    state.remainingJobCount = count;
  }, 'setRemainingJobCount'),

  setCurrentJobMessage: builder.commit((state, message: string) => {
    state.currentJobMessage = message;
  }, 'setCurrentJobMessage'),
};
