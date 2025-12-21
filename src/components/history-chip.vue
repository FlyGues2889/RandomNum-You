<template>
    <mdui-chip selectable variant="outlined">
        <span slot="selected-icon" class="material-symbols-rounded">done</span>
        <slot></slot>
    </mdui-chip>
</template>
<script>
export default {
    name: "history-chip"
}
</script>
<style scoped>
mdui-chip {
    box-shadow: none;
    background-color: unset;

    color: rgb(var(--mdui-color-secondary));
    font-family: 'Nunito';
    font-weight: 500;
    font-size: medium;
}

mdui-chip[selected] {
    background-color: rgba(var(--mdui-color-secondary-container));
}
</style>