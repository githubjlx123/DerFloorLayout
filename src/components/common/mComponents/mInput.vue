<template>
    <el-input v-model="item.value" @change="changeInputValue(item)"></el-input>
</template>

<script>
    export default {
        name: 'mInput',
        props:{
            item:Object,
        },
        methods:{
            changeInputValue(item){
                this.$emit('changeInput',item)
            }
        }
    };
</script>

<style scoped>

</style>