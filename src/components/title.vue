<template>
    <h1>
        <slot>{{ title }}</slot>
    </h1>
</template>
<script>
export default {
    name: "Title",

    props: {
        title: {
            type: String,
            required: true
        }
    }
}
</script>
<style scoped>
h1 {
    margin-bottom: 2.4rem;

    color: rgb(var(--mdui-color-on-surface),0.9);
}
</style>