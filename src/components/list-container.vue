<template>
    <slot name="title"></slot>
    <div class="container">
        <div class="content-container">
            <slot></slot>
        </div>
    </div>
</template>
<script>
export default {
    name: "list-container"
}
</script>
<style scoped>
div.container {
    width: calc(100% - 2rem);
    margin: 1rem 0;
    padding: 1rem;
    
    border-radius: var(--mdui-shape-corner-medium);
    background-color: rgb(var(--mdui-color-surface-container), 0.7);
    border: 0.1rem solid rgba(var(--mdui-color-secondary),0.1);
    /* box-shadow: var(--mdui-elevation-level2); */
}
</style>