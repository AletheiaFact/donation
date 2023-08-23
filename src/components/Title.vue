<script setup lang="ts">
defineProps<{
    msg: string
}>()
</script>

<template>
    <h1>{{ msg }}</h1>
</template>

<style scoped>
h1 {
    width: 100%;
    font-size: 21px;
    padding-bottom: 10px;
    border-bottom: 1px solid #a2a9b1;
    margin-bottom: 21px;
}
</style>
