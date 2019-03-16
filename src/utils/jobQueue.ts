import { job as jobModule } from '@/store/modules/job';

/**
 * A sequential job queue to handle async jobs.
 * Mainly used GGG server request.
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
  pause(time: number, message: string = `waiting for ${time} seconds`){
    this._push(() => {
      return new Promise<void>((resolve) => {
        setTimeout(() => resolve(), time * 1000);
      });
    }, message , true);
  }

  private _push<T>(callback: () => Promise<T>, jobMessage: string, cutInLine?: boolean): JobQueueResult<T> {
    const jobId = this.jobId++;
    const done = new Promise<T>((resolve, reject) => {
      const job = new Job<T>(callback, jobMessage, jobId, resolve, reject);
      cutInLine ? this.queue.unshift(job) : this.queue.push(job);
      // if(this.queue.length === 1){
        this.run();
      // }
    });
    return {
      done,
    };
  }

  /**
   * Queue a job. Callback will be invoked when the job is first in the job queue
   * @param callback the callback that will be invoked
   * @param message job message
   */
  pushJob<T>(callback: () => Promise<T>, message: string){
    return this._push(callback, message);
  }

  private run() {
    if(this.currentJob){
      console.log('another job running. your job is queued');
      return;
    }

    this.currentJob = this.queue[0];
    this.emitStatus(this.currentJob);

    if(this.currentJob){
      this.currentJob.executeCallback()
        .then(value => {
          this.currentJob!.resolveWith(value);
        })
        .catch(error => {
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
    this.queue = this.queue.filter(job => job.id !== id);
    if(this.currentJob){
      jobModule.addPastJob(this.currentJob.jobStatus);
      this.currentJob = null;
    }
  }

  private emitStatus(currentJob: Job<any>) {
    const jobMessage = currentJob ? currentJob.message : '';
    jobModule.setRemainingJobCount(this.queue.length);
    jobModule.setCurrentJobMessage(jobMessage);
  }

}

export type JobQueueResult<T> = {
  done: Promise<T>,
}

export type JobStatus = {
  id: number,
  status: string,
  name: string,
}

export function pushApiJob<T>(apiTask: () => Promise<T>, message: string): Promise<T>{
  const { done } = queue.pushJob(apiTask, message);
  return done.catch((error) => {
              if(error && error.statusCode === 429){
                queue.pause(40);
                return pushApiJob(apiTask, message);
              }
              throw(error);
            });
}

class Job<T> {

  private status: string;

  constructor(
    public readonly callback: () => Promise<T>,
    public readonly message: string,
    public readonly id: number,
    private readonly resolve: (value?: T) => void,
    private readonly reject: (errorObject: any) => any,
  ){
    this.status = 'Waiting in queue';
  }

  public executeCallback(): Promise<T> {
    this.status = 'In progress';
    return this.callback();
  }

  public resolveWith(value: T){
    this.status = 'Success';
    this.resolve(value);
  }

  public rejectWith(error: any) {
    this.status = 'Failed';
    this.reject(error);
  }

  get jobStatus(): JobStatus {
    return {
      id: this.id,
      status: this.status,
      name: this.message,
    };
  }
}

const queue = new JobQueue();
export default queue;
