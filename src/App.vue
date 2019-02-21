<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style lang="scss">

@font-face {
    font-family: OpenSans-Regular;
    src: url('./fonts/OpenSans-Regular.ttf');
    font-weight: Regular;
}
@font-face {
    font-family: OpenSans-Italic;
    src: url('./fonts/OpenSans-Italic.ttf');
    font-weight: Italic;
}
@font-face {
    font-family: OpenSans-Light;
    src: url('./fonts/OpenSans-Light.ttf');
    font-weight: '300';
}
@font-face {
    font-family: OpenSans-LightItalic;
    src: url('./fonts/OpenSans-LightItalic.ttf');
    font-weight: LightItalic;
}
@font-face {
    font-family: OpenSans-SemiBold;
    src: url('./fonts/OpenSans-SemiBold.ttf');
    font-weight: SemiBold;
}
@font-face {
    font-family: OpenSans-Bold;
    src: url('./fonts/OpenSans-Bold.ttf');
    font-weight: Bold;
}
@font-face {
    font-family: Fontin-SmallCaps;
    src : url('./fonts/fontin-smallcaps-webfont.woff');
    font-weight: normal;
}

html {
    height: 100%;
}
body {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    margin: auto;
    background-image:radial-gradient(100% 100%, #620909 0%, #230202 100%);
    font-family: OpenSans-Regular;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  height: 100%;
  width: 100%;
  color: #fff;
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
