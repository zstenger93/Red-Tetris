<template>
    <div class="flex-shrink-0 flex-grow-0" style="width: 30rem; height: 80vh;">
        <div class="grid grid-cols-10 grid-rows-20 gap-0 p-0.5" style="height: 100%; width: 100%;">
            <div v-for="n in 200" :key="n"
                class="border-2 rounded border-white border-opacity-50 bg-gray-900 bg-opacity-80"></div>
        </div>
    </div>
</template>

<script>


export default {
    name: 'SoloTetris',
}
</script>