<template>
    <div class="flex justify-center items-center overflow-auto">
        <div class="flex bg-gray-900 bg-opacity-80 p-4 rounded-lg"> <!-- Added padding and rounded corners for better visual -->
            <div class="flex flex-col justify-center mr-4">
				<div class="flex items-center justify-center mb-2 text-white font-bold">
                    <span>TETRIS</span>
                </div>
                <div class="flex items-center justify-center mb-2 text-white font-bold">
                    <font-awesome-icon :icon="['fas', 'angle-left']" class="text-white mr-6" />
                    <span>Left</span>
                </div>
                <div class="flex items-center justify-center mb-2 text-white font-bold">
                    <font-awesome-icon :icon="['fas', 'angle-right']" class="text-white mr-6" />
                    <span>Right</span>
                </div>
                <div class="flex items-center justify-center mb-2 text-white font-bold">
                    <font-awesome-icon :icon="['fas', 'angle-up']" class="text-white mr-5" />
                    <span>Rotation</span>
                </div>
                <div class="flex items-center justify-center mb-2 text-white font-bold">
                    <font-awesome-icon :icon="['fas', 'angle-down']" class="text-white mr-5" />
                    <span>Fall towards the pile</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';

library.add(fas);

export default {
    name: 'HowToPlay',
    components: {
        FontAwesomeIcon,
    },
}
</script>