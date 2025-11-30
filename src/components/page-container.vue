<template>
    <div class="page-container">
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "page-container"
}
</script>
<style scoped>
.page-container {
    height: 100vh;
    width: 100%;
    padding: 1rem;

    display: flex;
    flex-direction: column;
    align-items: center;

    overflow-y: auto;

    scrollbar-width: thin;
    scrollbar-color: rgba(var(--mdui-color-primary), 0.15) #00000000;
}
</style>