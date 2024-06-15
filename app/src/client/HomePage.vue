<template>
    <div id="homepage" class="bg-yellow-500 bg-opacity-50 min-h-screen flex items-center justify-center">
        <button v-if="!showOptions && !showMultiplayerOptions" @click="toggleOptionsVisibility"
            class="bg-gray-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full bg-opacity-80 cursor-pointer">
            Let's Play a Game
        </button>
        <div v-if="showOptions && !showMultiplayerOptions" class="flex flex-col items-center justify-center space-y-4">
            <button @click="selectOption(1)"
                class="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer bg-opacity-50">
                Solo Tetris
            </button>
            <button @click="selectOption(2)"
                class="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer bg-opacity-50">
                Multiplayer
            </button>
            <button @click="selectOption(3)"
                class="bg-purple-800 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer bg-opacity-50">
                Back
            </button>
        </div>
        <div v-if="showMultiplayerOptions" class="flex flex-col items-center justify-center space-y-4">
            <button
                class="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer bg-opacity-50">
                Tetris
            </button>
            <button
                class="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer bg-opacity-50">
                Tic-Tac-Toe
            </button>
            <button @click="backToMainOptions"
                class="bg-purple-800 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer bg-opacity-50">
                Back
            </button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'HomePage',
    data() {
        return {
            showOptions: false,
            showMultiplayerOptions: false,
        };
    },
    methods: {
        toggleOptionsVisibility() {
            this.showOptions = !this.showOptions;
        },
        selectOption(optionNumber) {
            if (optionNumber === 3) {
                this.toggleOptionsVisibility();
            } else if (optionNumber === 2) {
                // Show multiplayer options
                this.showOptions = false;
                this.showMultiplayerOptions = true;
            } else {
                console.log(`Option ${optionNumber} selected`);
                // solo mode here i guess
            }
        },
        backToMainOptions() {
            this.showMultiplayerOptions = false;
            this.showOptions = true;
        },
    },
}
</script>

<style scoped>
#homepage {
    background-image: url('~@/assets/background.png');
    background-size: cover;
    background-position: center;
    min-height: 100vh;
}
</style>