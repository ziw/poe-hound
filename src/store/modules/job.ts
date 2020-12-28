import { getStoreBuilder, BareActionContext } from 'vuex-typex';
import { RootState } from '../store';
import { MODULES } from '@/constants';
import { JobStatus } from '@/utils/jobQueue';

export interface JobState {
  remainingJobCount: number;
  currentJobMessage: string;
  currentJobStatus: string;

  pastJobs: JobStatus[];
}

export const initialJobState: JobState = {
  remainingJobCount: 0,
  currentJobMessage: '',
  currentJobStatus: '',
  pastJobs: [],
};

const builder = getStoreBuilder<RootState>().module(MODULES.job, initialJobState);

export const job = {
  get state() {
    return builder.state()();
  },

  setRemainingJobCount: builder.commit((state, count: number) => {
    state.remainingJobCount = count;
  }, 'setRemainingJobCount'),

  setCurrentJobMessage: builder.commit((state, message: string) => {
    state.currentJobMessage = message;
  }, 'setCurrentJobMessage'),

  setCurrentJobStatus: builder.commit((state, status: string) => {
    state.currentJobStatus = status;
  }, 'setCurrentJobStatus'),

  addPastJob: builder.commit((state, job: JobStatus) => {
    state.pastJobs.push(job);
  }, 'addPastJob'),
};
