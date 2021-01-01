<template>
  <aside
    class="job-banner"
    :class="{
      'job-banner__visible': this.isJobRunning,
    }"
  >
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
    return !!job.state.currentJobMessage;
  }

  get currentJobMessage() {
    return job.state.currentJobMessage;
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
  min-width: 250px;
  z-index: 100;
  height: 0;
  color: black;
  background-color: white;
  border-radius: 2px;

  &__visible {
    height: auto;
  }

  &__status-box {
    padding: 4px 15px;
  }
}
</style>
