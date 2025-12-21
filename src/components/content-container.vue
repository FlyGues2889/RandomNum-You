<template>
    <div class="content-container">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "content-container"
}
</script>
<style scoped>
.content-container {
    width: calc(100% - 4.5rem);
    max-width: 72rem;
    margin: 1rem auto;
}
</style>