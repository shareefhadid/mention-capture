<template>
  <div id="loading-container">
    <font-awesome-icon icon="circle-notch" spin id="spinner" />
    <h2>Loading...</h2>
  </div>
</template>

<script>
export default {
  name: "Loading",
};
</script>

<style scoped>
#loading-container {
  display: flex;
  position: fixed;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: white;
}

#spinner {
  width: 100px;
  height: auto;
  margin-bottom: 16px;
}

h2 {
  font-size: 32px;
}
</style>
