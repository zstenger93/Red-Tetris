
<template>
    <div>
      <h1>Game Room: {{ room }}</h1>
      <p>Player: {{ playerName }}</p>
    </div>
  </template>
  
  <script>
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
    }
  };
  </script>