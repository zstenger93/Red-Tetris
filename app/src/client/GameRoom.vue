
<template>
    <div>
      <h1>Game Room: {{ room }}</h1>
      <p>Player: {{ playerName }}</p>
    </div>
  </template>
  
  <script>
  import { io } from 'socket.io-client';
  export default {
    props: {
      room: {
        type: String,
        required: true
      },
      playerName: {
        type: String,
        default: 'Guest'
      }
    },
    methods: {
      initSocket() {
        this.socket = io('http://localhost:3000');
        this.socket.emit('join', { room: this.room, playerName: this.playerName });
      }
    },
  };
  </script>