<template>
    <div id="homepage" class="bg-yellow-500 bg-opacity-50 min-h-screen flex items-center justify-center">
        <button v-if="!showOptions && !showHowToPlay && !showLobby"
            @click="toggleOptionsVisibility"
            class="bg-gray-800 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-full bg-opacity-80 cursor-pointer">
            Let's Play a Game
        </button>
        <div v-else-if="showOptions"
            class="flex flex-col items-center justify-center space-y-4">
            <button @click="selectOption(1)"
                class="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer bg-opacity-50">
                Solo Tetris
            </button>
            <button @click="selectOption(2)"
                class="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer bg-opacity-50">
                Multiplayer
            </button>
            <button @click="selectOption(4)"
                class="bg-orange-800 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer bg-opacity-50">
                How to Play
            </button>
            <button @click="selectOption(3)"
                class="bg-purple-800 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer bg-opacity-50">
                Back
            </button>
        </div>
        <div v-if="showHowToPlay"
            class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center"
            style="z-index: 1000;">
            <HowToPlay />
            <button @click="backToMainOptions"
                class="mt-4 bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer bg-opacity-50">
                Back
            </button>
        </div>
        <div v-else-if="showLobby"
            class="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center"
            style="z-index: 1000;">
            <TetrisLobby />
            <button @click="backToMainOptions"
                class="mt-4 bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full cursor-pointer bg-opacity-50">
                Back
            </button>
        </div>
    </div>
</template>

<script>
import { ref } from 'vue';
//import SoloTetris from './SoloTetris.vue';
import HowToPlay from '../components/HowToPlay.vue';
import TetrisLobby from './TetrisLobby.vue';

export default {
    name: 'HomePage',
    components: {
  //      SoloTetris,
        HowToPlay,
        TetrisLobby,
    },
    setup() {
        const showOptions = ref(false);
        const showLobby = ref(false);
        const showHowToPlay = ref(false);

        const toggleOptionsVisibility = () => {
            showOptions.value = !showOptions.value;
        };

        const selectOption = (optionNumber) => {
            if (optionNumber === 3) {
                showOptions.value = false;
                showLobby.value = false;
                showHowToPlay.value = false;
            } else if (optionNumber === 1 || optionNumber === 2) {
                showOptions.value = false;
                showLobby.value = true;
                showHowToPlay.value = false;
            } else if (optionNumber === 4) {
                showOptions.value = false;
                showLobby.value = false;
                showHowToPlay.value = true;
            } else {
                console.log(`Option ${optionNumber} selected`);
            }
        };

        const backToMainOptions = () => {
            showOptions.value = true;
            showLobby.value = false;
            showHowToPlay.value = false;
        };

        return {
            showOptions,
            showLobby,
            toggleOptionsVisibility,
            selectOption,
            backToMainOptions,
            showHowToPlay,
        };
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
