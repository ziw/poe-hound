<template>
  <aside class="job-banner"
    :class="{
      'job-banner__visible': this.isJobRunning
    }">
    <div class="job-banner__status-box">
      {{ currentJobMessage }}
    </div>
  </aside>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import { job } from '@/store/modules/job';

const AppProps = Vue.extend({});

@Component({})
export default class JobBanner extends AppProps {

  get isJobRunning(){
    return !!job.state.currentJobMessage;
  }

  get currentJobMessage() {
    return job.state.currentJobMessage;
  }
}
</script>

<style lang="scss">
  .job-banner {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 100;
    height: 0;

    &__visible {
      height: auto;
    }

    &__status-box {
      padding: 4px 15px;
    }
  }
</style>
