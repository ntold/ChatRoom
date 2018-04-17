// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueFire from 'vuefire'
import firebase from 'firebase';


const config = {
  apiKey: "AIzaSyAvfSn6CXaYEVvm2gQ4qU3sNBaR3RSamvc",
  authDomain: "vue-chat-room-7339b.firebaseapp.com",
  databaseURL: "https://vue-chat-room-7339b.firebaseio.com",
  projectId: "vue-chat-room-7339b",
  storageBucket: "vue-chat-room-7339b.appspot.com",
  messagingSenderId: "97116648802"
}

firebase.initializeApp(config);


Vue.use(VueFire)

Vue.config.productionTip = false

let app;
firebase.auth().onAuthStateChanged(user => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      template: '<App/>',
      components: { App }
    });
  }
});
