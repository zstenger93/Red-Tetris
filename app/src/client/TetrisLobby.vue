<template>
    <div class="flex-shrink-0 flex-grow-0" style="width: 30rem; height: 80vh;">
        <div>
            <input v-model="player_name" placeholder="Enter player name" class="border-2 rounded border-white border-opacity-50 bg-gray-900 bg-opacity-80 text-white p-2"/>
            <input v-model="room_code" placeholder="Enter room code" class="border-2 rounded border-white border-opacity-50 bg-gray-900 bg-opacity-80 text-white p-2"/>
            <button @click="join_room" class="border-2 rounded border-white border-opacity-50 bg-gray-900 bg-opacity-80 text-white p-2">Join Room</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'TetrisLobby',
    data() {
        return {
            player_name: '',
            room_code: '',
        };
    },
    methods: {
        join_room() {
            console.log(this.player_name, this.room_code);
            if (this.player_name === '' || this.room_code === '') {
                console.log('Please enter a player name and room code');
                return;
            }
            // this.$socket.emit('join_room', {
            //     player_name: this.player_name,
            //     room_code: this.room_code,
            // });
            
        },
        
    },
}
</script>