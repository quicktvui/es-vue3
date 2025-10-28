import Container from "./index.vue";

Container.install = (Vue) => {
  Vue.component(Container.name, Container);
};

export default Container;
