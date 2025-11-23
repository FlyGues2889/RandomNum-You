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
    width: 100%;
    margin: 1rem 0;
    
    border-radius: var(--mdui-shape-corner-medium);
    background-color: rgb(var(--mdui-color-surface-container), 0.8);
    box-shadow: var(--mdui-elevation-level2);
}

div.content-container {
    margin: 1rem;
}
</style>