<template>
  <div id="app">
    <HomePage />
    <h2>Welcome to the game!</h2>
    <button @click="startGame">Start Game</button>
  </div>
</template>

<script>
import io from 'socket.io-client'
import HomePage from './client/HomePage.vue'

export default {
  name: 'App',
  components: {
    HomePage,
  },
  data() {
    return {
      socket: null,
    };
  },
  created() {
    this.socket = io();

    this.socket.on('connect', () => {
      console.log('Connected to server');
      this.socket.emit('join', 'room1');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });

    this.socket.on('gameStart', (data) => {
      console.log('Game started:', data);
      alert('Game started: ' + data.message);
    });
  },
  methods: {
    startGame() {
      this.socket.emit('startGame');
    },
  },
}
</script>

<style scoped>
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
