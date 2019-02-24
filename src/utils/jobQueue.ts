import { job } from '@/store/modules/job';

export type SuccessCallBack = (next:{
  done: Function,
  retry: (mSecondsBeforeRetry?: number, waitMessage ?: string) => any,
  //abort?: Function,
}) => any;

/**
 * A sequential messaging queue to handle GGG server request.
 */
class JobQueue {
  private queue: Job[] = [];
  private jobId: number = 1;

  /**
   * Pause all pending jobs and wait for given milliseconds before resuming
   * @param time milliseconds to wait
   * @param message job message while waiting
   */
  wait(time: number, message: string){
    this.cutInLine(({ done }) => setTimeout(() => done(), time), message);
  }

  /**
   * Queue a job. Callback will be invoked when the job is first in the job queue
   * @param callback the callback that will be invoked
   * @param message job message
   */
  pushJob(callback: SuccessCallBack, message: string){
    this._pushJob(callback, message);
  }

  private cutInLine(callback: SuccessCallBack, message: string){
    this._pushJob(callback, message, true);
  }

  private _pushJob(callback: SuccessCallBack, message: string, cutInLine = false) {
    const nextId = this.jobId++;

    const nextJob = new Job(() => callback({
      done: () => this.markAsDone(nextId),
      retry: (mSecondsBeforeRetry = 0, waitMessage = '') => this.waitAndRetry(nextId, mSecondsBeforeRetry, waitMessage),
    }), message, nextId);

    cutInLine ? this.queue.unshift(nextJob)
              : this.queue.push(nextJob);
    if(this.queue.length === 1 || cutInLine){
      this.run();
    }
  }

  private run() {
    this.emitStatus();
    const nextJob = this.queue[0];
    if(nextJob){
      try{
          nextJob.callback();
      }catch{
      }
    }
  }

  private markAsDone(id: number) {
    this.queue = this.queue.filter(job => job.id !== id);
    this.run();
  }

  private waitAndRetry(id: number, mSeconds: number, waitMessage: string) {
    this.wait(mSeconds, waitMessage);
  }

  private emitStatus() {
    const currentJob = this.queue[0];
    const jobMessage = currentJob ? currentJob.message : '';
    job.setRemainingJobCount(this.queue.length);
    job.setCurrentJobMessage(jobMessage);
  }
}

class Job {
  constructor(
    public readonly callback: Function,
    public readonly message: string,
    public readonly id: number,){
  }
}

const queue = new JobQueue();
export default queue;