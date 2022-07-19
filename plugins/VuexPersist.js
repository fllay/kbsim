import VuexPersistence from "vuex-persist";
import localforage from "localforage";
export default ({ store }) => {
  new VuexPersistence({
    storage: localforage,
    key: "kbai",
    asyncStorage: true,
    reducer: (state) => {
      //let cloned = Object.assign({}, state.project.project);
      //cloned = Ojbect.assign(cloned, state.project.)
      // delete cloned.initialDevice;
      // delete cloned.server;
      // delete cloned.serverUrl;
      // delete cloned.streamUrl;
      return {
        dataset: {
          dataset: Object.assign({}, state.dataset.dataset),
        },
        project: {
          project: Object.assign({}, state.project.project),
        },
      };
    },
    //reducer: (state) => ({ dataset: state.dataset, project: state.project }),
  }).plugin(store);
};
