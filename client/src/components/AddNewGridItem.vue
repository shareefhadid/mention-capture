<template>
  <div class="grid-item" id="add-item-container">
    <span>
      <font-awesome-icon icon="plus" />
      <h2>Add {{ item }}</h2>
    </span>
  </div>
</template>

<script>
export default {
  name: "AddNewGridItem",
  props: { item: String },
};
</script>

<style scoped>
#add-item-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: stretch;
  padding: 10px;
  cursor: pointer;
  user-select: none;
  border: 1px solid #ced4da;

  transition: all 0.5s ease;
}
#add-item-container:hover {
  font-size: 15px;
  box-shadow: 0px 0px 12px 0px rgba(0,0,0,0.15);
}
h2 {
  display: inline-block;
  margin-left: 4px;
}

font-awesome-icon {
  display: inline-block;
}
</style>
