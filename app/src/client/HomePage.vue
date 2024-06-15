<template>
    <div id="homepage" class="bg-yellow-500 bg-opacity-50 min-h-screen
            flex items-center justify-center">
        <button v-if="!showOptions" @click="toggleOptionsVisibility" class="bg-gray-800 hover:bg-red-700 text-white font-bold
                    py-2 px-4 rounded-full bg-opacity-80 cursor-pointer">
            Let's Play a Game
        </button>
        <div v-if="showOptions" class="flex space-x-4">
            <button @click="selectOption(1)" class="bg-blue-800 hover:bg-blue-700 text-white
                        font-bold py-2 px-4 rounded-full cursor-pointer">
                Solo
            </button>
            <button @click="selectOption(2)" class="bg-green-800 hover:bg-green-700 text-white
                        font-bold py-2 px-4 rounded-full cursor-pointer">
                Multiplayer
            </button>
            <button @click="selectOption(3)" class="bg-purple-800 hover:bg-purple-700 text-white
                        font-bold py-2 px-4 rounded-full cursor-pointer">
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
        };
    },
    methods: {
        toggleOptionsVisibility() {
            this.showOptions = !this.showOptions;
        },
        selectOption(optionNumber) {
            if (optionNumber === 3) {
                // If "Back" is selected, hide the options and show the initial button
                this.toggleOptionsVisibility();
            } else {
                console.log(`Option ${optionNumber} selected`);
                // Implement what happens when other options are selected
            }
        },
    },
}
</script>

<style scoped>
#homepage {
    background-image: url('~@/assets/background.png');
    background-size: cover;
    /* Cover the entire page */
    background-position: center;
    /* Center the background image */
    min-height: 100vh;
    /* Make sure it covers the whole screen */
}
</style>