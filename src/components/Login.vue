<template>
  <div>
    <div class="container">
    <div class="row">
      <div class="col s12 m8">
        <div class="login card-panel grey white-text center">
          <h3>Login</h3>
          <form action="index.html">
            <div class="input-field">
              <i class="material-icons prefix">email</i>
              <input type="email" id="email" v-model="email" placeholder="Email Address">
            </div>
            <div class="input-field">
              <i class="material-icons prefix">lock</i>
              <input type="password" id="password" v-model="password" placeholder="Password">
            </div>
            <button v-on:click="login" class="waves-effect waves-light btn-large">Login</button>
          </form>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import Firebase from 'firebase'

export default {
  name: 'login',
  data: function(){
    return{ 
      email: '',
      password: '',
    };
  },
  methods:{
    login (e){
      firebase
        .auth()
        .signInWithEmailAndPassword(this.email, this.password)
        .then(
          user => {
            nativeToast({
              message: `You are logged in as ${user.email}`,
              type: 'success',
              position: 'top',
            });
            this.$router.go({ path: '/' });
          },
          err => {
             nativeToast({
              message: err.message,
              type: 'error'
              });
          }
        );
      e.preventDefault();
    }
  },
  created () {
      firebase.auth().onAuthStateChanged(firebaseUser => {
          if(!firebaseUser){
            this.loggedIn = false
            console.log(this.loggedIn)
          }
      })

  }
}

</script>
