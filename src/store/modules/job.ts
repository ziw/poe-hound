import { getStoreBuilder, BareActionContext } from 'vuex-typex';
import { RootState } from '../store';
import { MODULES } from '@/constants';
import { JobStatus, JobSummary } from '@/models/job';
import { CurrentStatus } from '@/utils/enumPicker';

export interface JobState {
  currentJobId: number;
  allJobs: JobSummary[];
}

export const initialJobState: JobState = {
  currentJobId: -1,
  allJobs: [],
};

const builder = getStoreBuilder<RootState>().module(MODULES.job, initialJobState);

export const job = {
  get state() {
    return builder.state()();
  },

  getCurrentJob: builder.read((state) => {
    return state.allJobs.find(({ id }) => id === state.currentJobId);
  }, 'getCurrentJob'),

  getCompletedJobs: builder.read(
    (state) =>
      state.allJobs.filter((job) =>
        CurrentStatus.of(job).in(JobStatus.FAILED, JobStatus.ABORTED, JobStatus.SUCCESS),
      ),
    'getCompletedJobs',
  ),

  getPendingJobs: builder.read(
    (state) =>
      state.allJobs.filter((job) =>
        CurrentStatus.of(job).in(JobStatus.IN_PROGRESS, JobStatus.IN_QUEUE),
      ),
    'getPendingJobs',
  ),

  setCurrentJobId: builder.commit((state, id: number) => {
    state.currentJobId = id;
  }, 'setCurrentJobId'),

  addJob: builder.commit((state, newJob: JobSummary) => {
    state.allJobs.push(newJob);
  }, 'addJob'),

  updateJob: builder.commit((state, payload: { id: number; newJob: Partial<JobSummary> }) => {
    const job = state.allJobs.find((job) => job.id === payload.id);
    if (job) {
      state.allJobs.splice(state.allJobs.indexOf(job), 1, {
        ...job,
        ...payload.newJob,
      });
    }
  }, 'updateJob'),
};
