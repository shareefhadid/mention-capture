<template>
  <div id="page">
    <ConfirmDialog></ConfirmDialog>
    <Toast position="top-right" />
    <Loading v-if="loading" />
    <TheHeader v-if="showHeader" />
    <router-view />
  </div>
</template>

<script>
import TheHeader from "@/components/TheHeader";
import Loading from "@/components/Loading";
export default {
  components: { TheHeader, Loading },
  computed: {
    loading() {
      return this.$store.state.loading;
    },
    showHeader() {
      return this.$store.state.showHeader;
    },
  },
};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Raleway:wght@400;700;900&display=swap");

/* RESET */
* {
  padding: 0;
  margin: 0;
  line-height: 1;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
  box-sizing: border-box;
  font-family: "Raleway", sans-serif;
}

h1,
h2,
h3,
p,
label,
input {
  color: hsl(210, 30%, 20%);
}

/* GENERAL */
#page {
  padding-bottom: 100px;
}

#page-title {
  font-size: 48px;
  font-weight: 900;
  margin-top: 16px;
  margin-bottom: 8px;
}

#page {
  position: relative;
}

.section {
  display: flex;
  justify-content: center;
}

.title-section {
  background-color: #f4f4f4;
  padding-bottom: 32px;
  margin-bottom: -32px;
}

.container {
  width: 1140px;
  padding: 10px;
}

/* NAV MENU */
.p-tabmenu,
.p-tabmenu * {
  background-color: transparent !important;
  box-shadow: none !important;
  border: none !important;
}

.p-tabmenuitem:first-of-type .p-menuitem-link {
  padding-left: 0px !important;
}

/* GRID FILTER INPUT */
.grid-filter .p-inputgroup {
  border: 1px solid rgb(206, 212, 218);
  border-radius: 3px;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
}

.grid-filter .p-inputgroup:hover {
  border: 1px solid #2196f3;
  border-radius: 3px;
}

.grid-filter .p-inputgroup-addon {
  padding: 0px;
  border: none;
  background: none;
}

.grid-filter .p-dropdown-label {
  color: #aaa !important;
}

.grid-filter .p-dropdown,
.grid-filter .p-dropdown:not(.p-disabled).p-focus,
.grid-filter .p-inputtext {
  border: none !important;
  box-shadow: none !important;
}

.grid-filter .p-inputtext {
  border-right: none;
}

/* INPUT */
.input-header h2 {
  display: inline-block;
  margin-bottom: 8px;
  margin-top: 8px;
  font-weight: 700;
  font-size: 20px;
}

.input-header h3 {
  display: inline-block;
  margin-bottom: 8px;
}

.info-icon {
  color: #333;
}

.p-autocomplete-input {
  box-shadow: none !important;
}

.p-autocomplete .p-button {
  background-color: transparent;
  border-left: none;
  border-color: #ced4da;
  color: #aaa;
}

/* GRID */
.grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
  align-content: flex-start;
  width: 100%;
  padding-bottom: 100px;
}

.grid-item {
  display: inline-block;
  margin: 0 16px 16px 0;
  border-radius: 8px;
  flex-basis: 250px;
  max-width: 250px;
  align-self: stretch;
  align-items: stretch;
  box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.08);
  transition: all 0.5s ease;
}

.grid-item:hover {
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.15);
}

.item-top-container {
  cursor: pointer;
  border: 1px solid #ced4da;
  border-radius: 4px 4px 0 0;
  padding: 0 10px 10px 0;
  border-collapse: collapse;
  align-self: stretch;
}

.item-bottom-container {
  display: flex;
  align-items: center;
  border-left: 1px solid #ced4da;
  border-right: 1px solid #ced4da;
  border-bottom: 1px solid #ced4da;
  border-collapse: collapse;
  border-radius: 0 0 4px 4px;
}

.item-bottom-container a {
  text-decoration: none;
  display: block;
  width: 100%;
}

.item-bottom-container .item-button {
  display: flex;
  justify-content: center;
  padding: 8px 12px;
  font-size: 14px;
  color: #999999;
  background-color: transparent;
  border-left: 1px solid rgba(0,0,0,0.1);

}

.item-bottom-container .item-button:hover {
  background-color: #2196f3;
  border-color: transparent;
}

.item-bottom-container .item-button {
  font-size: 14px;
  color: #999999;
  transition: background-color 0.2s ease-out, border 0.2s ease-out;
}

.item-bottom-container .item-button p {
  color: #999999;
}

.item-bottom-container .item-button:hover * {
  color: #ffffff;
}

.item-bottom-container .item-button i {
  margin-right: 4px;
}

/* FOOTER */
#footer-section .p-button {
  margin-left: 16px;
}

#footer-section {
  display: flex;
  justify-content: center;
  width: 100%;
  position: fixed;
  bottom: 0;
  background-color: #ffffff;
  border-top: 1px solid rgba(0, 0, 0, 0.08);
  padding: 10px;
  z-index: 998;
}

#footer-container {
  display: flex;
  align-items: center;
  width: 1140px;
}

#footer-container p {
  display: inline-block;
  margin-right: 12px;
}

/* RESULTS PAGE */
.result-container {
  max-width: 600px;
  margin-top: 20px;
}

.result-container .source,
.result-container .pub-date {
  font-size: 12px;
  color: #888;
  margin-bottom: 4px;
}

.result-container .source {
  text-transform: uppercase;
}

.result-container .title {
  font-size: 20px;
  color: hsl(210, 30%, 20%);
  margin-bottom: 8px;
}

.result-container .excerpt {
  font-size: 16px;
  color: #777;
  margin-bottom: 16px;
  margin-top: 8px;
}

.search-title {
  font-size: 24px;
  font-weight: 700;
  margin-top: 32px;
  color: hsl(210, 30%, 20%);
}

.result-subheading {
  font-size: 44px;
  font-weight: 700;
  color: hsl(210, 30%, 20%);
}

.result-page-title {
  margin-top: 24px;
  font-size: 16px;
  font-weight: 900;
  color: hsl(210, 30%, 20%);
  text-transform: uppercase;
}

/* TOOLTIP */
.tooltip {
  position: relative;
  display: inline-block;
  padding: 0 4px;
}

.p-tooltip-text {
  text-align: center;
  display: block;
  line-height: 1.4;
  width: 320px;
}

/* ERROR VALIDATION */
.error-message {
  color: red;
  margin-top: 4px;
}
</style>
