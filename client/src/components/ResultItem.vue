<template>
  <div class="result-container">
    <p class="source">
      {{ source }}
    </p>
    <h3 class="title">
      {{ title }}
    </h3>
    <p class="pub-date">{{ pubDate }}</p>
    <p class="excerpt">
      {{ excerpt }}
    </p>
    <a :href="url" target="_blank">
      <Button
        label="Read More"
        class="p-button-sm p-button-primary"
      />
    </a>
  </div>
</template>

<script>
export default {
  name: "ResultItem",
  props: {
    source: String,
    title: String,
    pubDate: String,
    excerpt: String,
    url: String,
  },
};
</script>

<style></style>
