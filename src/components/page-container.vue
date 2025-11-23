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
    padding: 1rem;

    display: flex;
    flex-direction: column;
    align-items: center;

    .content-container {
        width: calc(100% - 4.5rem);
        max-width: 72rem;
        min-height: calc(100% - 2rem);

        margin: 1rem 2.25rem;
    }
}
</style>