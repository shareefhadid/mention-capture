import { createApp } from "vue";
import App from "@/App.vue";
import router from "@/router";
import store from "@/store";

// FONT AWESOME
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faTimesCircle } from "@fortawesome/free-regular-svg-icons";
import {
  faExclamationTriangle,
  faTimes,
  faInfoCircle,
  faCircleNotch,
  faPlus,
  faAngleDown,
  faHistory,
} from "@fortawesome/free-solid-svg-icons";

// PRIMEVUE COMPONENTS
import PrimeVue from "primevue/config";
import MultiSelect from "primevue/multiselect";
import Dropdown from "primevue/dropdown";
import Calendar from "primevue/calendar";
import InputSwitch from "primevue/inputswitch";
import Slider from "primevue/slider";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import ConfirmationService from "primevue/confirmationservice";
import ConfirmDialog from "primevue/confirmdialog";
import Message from "primevue/message";
import ToastService from "primevue/toastservice";
import Toast from "primevue/toast";
import Tag from "primevue/tag";
import Checkbox from "primevue/checkbox";
import Button from "primevue/button";
import Chips from 'primevue/chips';
import Tooltip from 'primevue/tooltip';
import Password from 'primevue/password';
import TabMenu from 'primevue/tabmenu';
import AutoComplete from 'primevue/autocomplete';

// PRIMEVUE STYLE AND THEME
import "primevue/resources/primevue.min.css";
import "primeicons/primeicons.css";
import "primevue/resources/themes/saga-blue/theme.css";

// PRIMEFLEX
import 'primeflex/primeflex.css';

// FONTAWESOME ICONS
library.add(
  faExclamationTriangle,
  faTimes,
  faInfoCircle,
  faCircleNotch,
  faPlus,
  faAngleDown,
  faTimesCircle,
  faHistory
);

createApp(App)
  .use(store)
  .use(router)
  .use(PrimeVue)
  .use(ConfirmationService)
  .use(ToastService)
  .component("font-awesome-icon", FontAwesomeIcon)
  .component("MultiSelect", MultiSelect)
  .component("Dropdown", Dropdown)
  .component("Calendar", Calendar)
  .component("InputSwitch", InputSwitch)
  .component("Slider", Slider)
  .component("Dialog", Dialog)
  .component("InputText", InputText)
  .component("ConfirmDialog", ConfirmDialog)
  .component("Message", Message)
  .component("Toast", Toast)
  .component("Tag", Tag)
  .component("Checkbox", Checkbox)
  .component("Button", Button)
  .component("Chips", Chips)
  .component("Password", Password)
  .component("TabMenu", TabMenu)
  .component("AutoComplete", AutoComplete)
  .directive('tooltip', Tooltip)
  .mount("#app");
