<template>
  <aside
    class="job-banner"
    :class="{
      'job-banner__visible': this.isJobRunning,
    }"
  >
    <div class="job-banner__progress-bar">
      <a-progress :percent="jobsPercentage" :show-info="false" />
      <span class="job-banner__progress-bar-status">{{ jobsStatusDisplay }}</span>
    </div>
    <div class="job-banner__status-box">
      {{ currentJobMessage }}
    </div>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { job } from '@/store/modules/job';
import { Watch } from 'vue-property-decorator';
import { message } from 'ant-design-vue';

const AppProps = Vue.extend({});

@Component({})
export default class JobBanner extends AppProps {
  get isJobRunning() {
    return !!job.getCurrentJob();
  }

  get currentJobMessage() {
    return job.getCurrentJob()?.message;
  }

  get allJobsProgress() {
    return `${job.getCompletedJobs().length} / ${job.state.allJobs.length}`;
  }

  get jobsPercentage() {
    return (job.getCompletedJobs().length / job.state.allJobs.length) * 100;
  }

  get jobsStatusDisplay() {
    return `${job.getCompletedJobs().length} / ${job.state.allJobs.length}`;
  }

  @Watch('isJobRunning')
  onJobStartOrFinish(isJobRunning: boolean) {}
}
</script>

<style lang="scss">
.job-banner {
  position: absolute;
  bottom: 20px;
  right: 20px;
  width: 350px;
  z-index: 100;
  height: 0;
  color: black;
  background-color: white;
  border-radius: 2px;
  display: none;

  &__visible {
    height: auto;
    display: block;
  }

  &__status-box {
    padding: 4px 15px;
  }

  &__progress-bar {
    display: flex;
  }

  &__progress-bar-status {
    flex-grow: 1;
  }

  .ant-progress {
    width: 80%;
  }
}
</style>
