<template>
  <nav>
      <div class="nav-wrapper #424242 grey darken-3">
          <div class="container">
            <router-link to="/" class="brand-logo" style="text-decoration:none;"><i class="material-icons">chat</i> Olek</router-link>
              <ul class="right">
                <li v-if="isLoggedIn" class="nickname"> {{ currentUser }} </li>
                <li v-if="isLoggedIn"><button v-on:click="logout" class="btn black">Logout</button></li>
              </ul>
          </div>
      </div>
  </nav>
</template>

<script>
    import firebase from 'firebase';
    export default {
    name: 'navbar',
    data() {
        return {
        isLoggedIn: false,
        currentUser: false
        };
    },
    created() {
        if (firebase.auth().currentUser) {
        this.isLoggedIn = true;
        this.currentUser = firebase.auth().currentUser.email;
        }
    },
    methods: {
        logout: function() {
        firebase
            .auth()
            .signOut()
            .then(() => {
            this.$router.go({ path: this.$router.path });
            });
        }
    }
    };
</script>

<style scoped>

.nickname{
    margin-right: 20px;
}

</style>
