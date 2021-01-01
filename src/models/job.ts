export enum JobStatus {
  'IN_PROGRESS' = 1,
  'SUCCESS' = 2,
  'FAILED' = 3,
  'IN_QUEUE' = 4,
  'ABORTED' = 5,
}

export type JobSummary = {
  id: number;
  message: string;
  status: JobStatus;
};
