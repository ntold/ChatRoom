<template>
  <div id="chat" class="container">
  <hr />
  <!-- Messages -->
   <transition-group name="list" enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
    <div v-for="message in messages" v-bind:key="message.id" class="card mb-3">
      <div class="card-body">
        <!-- nickname  and time -->
        <h6 class="card-subtitle mb-2 text-muted" style="display:inline-block;" >{{ message.nickname }} </h6>
        <h6 class="text-muted" style="display:inline-block; float: right;"> {{ message.time }} </h6>
        <i class="material-icons" v-if="message.isEdited == true" >mode_edit</i>
        <!-- content -->
        <p v-if="message !== editingMessage" class="card-text">{{ message.text }}</p>
        <textarea v-else v-model="messageText" class="form-control"></textarea>
        <!-- actions -->
        <div v-if="message !== editingMessage">
          <a v-on:click.prevent="deleteMessage(message)" v-if="nickname == message.nickname || nickname == admin" href="#" class="card-link">delete</a>
          <a v-on:click.prevent="editMessage(message)" v-if="nickname == message.nickname" href="#" class="card-link">edit</a>
        </div>
        <div v-else>
          <a v-on:click.prevent="cancelEditing" href="#" class="card-link">cancel</a>
          <a v-on:click.prevent="updateMessage" v-on:keyup.enter="updateMessage" href="#" class="card-link">update</a>
        </div>
      </div>
    </div>
  </transition-group> 
  <div class="fixed-action-btn">
    <a v-on:click.prevent="workInProgress" to="/newChat" class="btn-floating btn-large orange darken-4"> 
      <i class ="fa fa-plus"></i>
    </a>
  </div>

  <hr>
  <!-- New Message -->
  <form v-if="!editingMessage" v-on:submit.prevent="storeMessage" v-on:keyup.enter="storeMessage">
    <div class="form-group">
      <h6>Message:</h6>
      <textarea v-model="messageText" class="form-control"></textarea>
    </div>
    <button class="btn btn-primary mb-3">Send</button>
  </form>
</div>

</template>
<script>

import Firebase from 'firebase'


const config = {
    apiKey: "AIzaSyAvfSn6CXaYEVvm2gQ4qU3sNBaR3RSamvc",
    authDomain: "vue-chat-room-7339b.firebaseapp.com",
    databaseURL: "https://vue-chat-room-7339b.firebaseio.com",
    projectId: "vue-chat-room-7339b",
    storageBucket: "vue-chat-room-7339b.appspot.com",
    messagingSenderId: "97116648802"
}
  firebase.initializeApp(config);

  const database = firebase.database()
  const messagesRef = database.ref('messages')
  const loggedRef = database.ref('loggedIn')




export default {
    name: 'chat',
    data() {
      return{       
        messages: [],
        messageText: '',
        nickname: firebase.auth().currentUser.email,
        admin: 'admin@olek.com',
        time: '',
        editingMessage: null,
        isEdited: false,
        loggedIn: false
      }
    },

    methods: {
      getTime () {
        var d = new Date();
        this.time = ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2)

        return this.time
      },
      storeMessage () {
        this.getTime()
        messagesRef.push({text: this.messageText, nickname: this.nickname, time: this.time, isEdited: this.isEdited})
        this.messageText = ''
      },
      deleteMessage (message) {
        messagesRef.child(message.id).remove()
      },
      editMessage (message) {
        this.editingMessage = message;
        this.messageText = message.text
      },
      cancelEditing () {
        this.editingMessage = null
        this.messageText = ''
      },
      updateMessage () {
        this.getTime()
        this.isEdited = true
        messagesRef.child(this.editingMessage.id).update({text: this.messageText, isEdited: this.isEdited, time: this.time})
        this.editingMessage = false
        this.isEdited = false
        this.cancelEditing()
      },
      // TODO
      workInProgress () {
        nativeToast({
              message: `Work in progress!`,
              type: 'info',
              position: 'top',
              timeout: 4000
          })
      }
    },

    created () {
      messagesRef.on('child_added', snapshot => {
        this.messages.push({...snapshot.val(), id: snapshot.key})
        if (snapshot.val().nickname !== this.nickname) {
          nativeToast({
              message: `New message by ${snapshot.val().nickname}`,
              type: 'success',
          })
        }
      })
      messagesRef.on('child_removed', snapshot => {
        const deletedMessage = this.messages.find(message => message.id === snapshot.key)
        const index = this.messages.indexOf(deletedMessage)
        this.messages.splice(index, 1)
        if (snapshot.val().nickname !== this.nickname) {
          nativeToast({
              message: `Message deleted by ${snapshot.val().nickname}`,
              type: 'warning'
          })
        }
      })
      messagesRef.on('child_changed', snapshot => {
        const updatedMessage = this.messages.find(message => message.id === snapshot.key)
        updatedMessage.text = snapshot.val().text
        const updatedIsEdited = this.messages.find(message => message.id === snapshot.key)
        updatedIsEdited.isEdited = snapshot.val().isEdited
        if (snapshot.val().nickname !== this.nickname) {
          nativeToast({
              message: `Message edited by ${snapshot.val().nickname}`,
              type: 'info'
          })
        }
      })
      //Checks if user is Online
      firebase.auth().onAuthStateChanged(firebaseUser => {
        if(firebaseUser){
          this.loggedIn = true
          console.log(this.loggedIn)
        }
      })
    }
}
</script>

<style scoped>
/* Import CSS Animatioans */
@import "https://cdn.jsdelivr.net/npm/animate.css@3.5.1";

.material-icons {
  margin-top: 8px; 
  margin-right: 5px; 
  font-size: 18px; 
  float: right;
}

</style>

