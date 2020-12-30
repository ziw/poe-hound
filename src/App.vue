<template>
  <main id="app">
    <router-view />
    <job-banner />
  </main>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import JobBanner from '@/components/shared/JobBanner.vue';

@Component({
  components: {
    JobBanner,
  },
})
export default class App extends Vue {}
</script>

<style lang="scss">
@font-face {
  font-family: OpenSans-Regular;
  src: url('./assets/fonts/OpenSans-Regular.ttf');
  font-weight: Regular;
}
@font-face {
  font-family: OpenSans-Italic;
  src: url('./assets/fonts/OpenSans-Italic.ttf');
  font-weight: Italic;
}
@font-face {
  font-family: OpenSans-Light;
  src: url('./assets/fonts/OpenSans-Light.ttf');
  font-weight: '300';
}
@font-face {
  font-family: OpenSans-LightItalic;
  src: url('./assets/fonts/OpenSans-LightItalic.ttf');
  font-weight: LightItalic;
}
@font-face {
  font-family: OpenSans-SemiBold;
  src: url('./assets/fonts/OpenSans-SemiBold.ttf');
  font-weight: SemiBold;
}
@font-face {
  font-family: OpenSans-Bold;
  src: url('./assets/fonts/OpenSans-Bold.ttf');
  font-weight: Bold;
}
@font-face {
  font-family: FontinSmallCaps;
  src: url('./assets/fonts/fontin-smallcaps-webfont.woff');
  font-weight: normal;
}

body {
  display: flex;
  background-image: radial-gradient(100% 100%, #620909 0%, #230202 100%);
  overflow-y: hidden;
  font-family: OpenSans-Regular;

  .ant-tooltip {
    max-width: 450px;
  }

  .ant-tooltip-inner {
    border-radius: 0;
    padding: 0;
    background: none;
  }
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  flex-grow: 1;
  color: #fff;
  margin: 0 auto;
  height: 100%;

  .vs__dropdown-toggle {
    border: none;
    border-bottom: 1px solid white;
    border-radius: 0;

    .form-control,
    .vs__selected-tag,
    .vs__selected {
      color: white;
      opacity: 1;
    }

    svg.vs__open-indicator {
      fill: white;
    }

    .vs__clear svg {
      fill: white;
    }
  }
}

#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
