<template>
    <mdui-chip variant="outlined">
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

    font-family: 'Nunito';
    font-weight: 500;
    font-size: medium;
}
</style>