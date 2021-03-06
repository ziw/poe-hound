import { job as jobModule } from '@/store/modules/job';
import { JobStatus, JobSummary } from '@/models/job';
import msg from '@/i18n';

/**
 * A sequential job queue to handle async jobs.
 * Mainly used to queue GGG server requests and handle server throttles & retries.
 */
class JobQueue {
  private queue: Job<any>[] = [];
  private jobId: number = 1;
  private currentJob: Job<any> | null = null;

  /**
   * Pause all pending jobs and wait for given milliseconds before resuming
   * @param time seconds to wait
   * @param message job message while waiting
   */
  pause(time: number, message: string = msg.jobs.wait_message(time)) {
    let countDownId: NodeJS.Timeout;
    let left = time;

    const { updateMessage } = this._push(
      () => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            clearInterval(countDownId);
            resolve();
          }, time * 1000);
        });
      },
      message,
      true,
    );

    countDownId = setInterval(() => {
      left--;
      updateMessage(msg.jobs.wait_message(left));
    }, 1000);
  }

  private _push<T>(
    callback: () => Promise<T>,
    jobMessage: string,
    cutInLine?: boolean,
  ): JobQueueResult<T> {
    const jobId = this.jobId++;

    const done = new Promise<T>((resolve, reject) => {
      const job = new Job<T>(callback, jobMessage, jobId, resolve, reject);
      jobModule.addJob(job.jobSummary);
      cutInLine ? this.queue.unshift(job) : this.queue.push(job);
      this.run();
    });

    const updateMessage = (message: string) =>
      jobModule.updateJob({
        id: jobId,
        newJob: { message },
      });

    return {
      done,
      updateMessage,
    };
  }

  /**
   * Queue a job. Callback will be invoked when the job is first in the job queue
   * @param callback the callback that will be invoked
   * @param message job message
   */
  pushJob<T>(callback: () => Promise<T>, message: string) {
    return this._push(callback, message);
  }

  private run() {
    if (this.currentJob) {
      console.log('another job running. your job is queued');
      return;
    }

    this.currentJob = this.queue[0];
    jobModule.setCurrentJobId(this.currentJob.id);
    if (this.currentJob) {
      this.currentJob
        .executeCallback()
        .then((value) => {
          this.currentJob!.resolveWith(value);
        })
        .catch((error) => {
          this.currentJob!.rejectWith(error);
        })
        .finally(() => {
          this.markAsDone();
          this.run();
        });
    }
  }

  private markAsDone() {
    const id = this.currentJob!.id;
    this.queue = this.queue.filter((job) => job.id !== id);
    if (this.currentJob) {
      this.currentJob = null;
      jobModule.setCurrentJobId(-1);
    }
  }
}

export type JobQueueResult<T> = {
  done: Promise<T>;
  updateMessage: (message: string) => void;
};

/**
 * Push an API call into the job queue.
 * The job will resolve with response object or throw an error.
 * In case of server throttling (status 429), this method will automatically
 * wait and retry the job until the API call is completed or failed.
 *
 * @param apiTask API call to be invoked
 * @param message job message
 */
export function pushApiJob<T>(apiTask: () => Promise<T>, message: string): Promise<T> {
  const { done } = queue.pushJob(apiTask, message);
  return done.catch((error) => {
    console.log(`error`, error);
    if (error && error.statusCode === 429) {
      queue.pause(50);
      return pushApiJob(apiTask, message);
    }
    throw error;
  });
}

class Job<T> {
  private status: JobStatus;

  constructor(
    public readonly callback: () => Promise<T>,
    public readonly message: string,
    public readonly id: number,
    private readonly resolve: (value: T) => void,
    private readonly reject: (errorObject: any) => any,
  ) {
    this.status = JobStatus.IN_QUEUE;
  }

  public executeCallback(): Promise<T> {
    this.status = JobStatus.IN_PROGRESS;
    this.syncJobStatus();
    return this.callback();
  }

  public resolveWith(value: T) {
    this.status = JobStatus.SUCCESS;
    this.syncJobStatus();
    this.resolve(value);
  }

  public rejectWith(error: any) {
    this.status = JobStatus.FAILED;
    this.syncJobStatus();
    this.reject(error);
  }

  get jobSummary(): JobSummary {
    return {
      id: this.id,
      status: this.status,
      message: this.message,
    };
  }

  private syncJobStatus() {
    jobModule.updateJob({
      id: this.id,
      newJob: this.jobSummary,
    });
  }
}

const queue = new JobQueue();
export default queue;
