//
import routes from "./routes";
import {ESApp} from '@extscreen/es3-vue';
import application from './App.vue';

import {createESApp} from "@extscreen/es3-core";

const routerOptions = {
  main: 'index',
  error: 'error',
  limit: 10,
  routes: routes,
}

const app: ESApp = createESApp(application, routerOptions);

import {ESComponent} from "@extscreen/es3-component";

app.use(ESComponent);








