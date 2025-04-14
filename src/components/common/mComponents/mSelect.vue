<template>
    <el-select v-model="item.value" @change="onchangeSelectValue(item)" class="select-length"
               :multiple = "item.allowCreate"
               filterable
               default-first-option
               :allow-create="item.allowCreate">
        <el-option v-for=" opt in item.paramsOption" :key="opt" :label="opt" :value="opt"></el-option>
    </el-select>
</template>

<script>
    export default {
        name: 'mSelect',
        data(){
            return{}
        },
        props:{
           item:Object,
        },
        methods:{
            onchangeSelectValue(item){
                this.$emit('changeSelectVal',{name:item.name,value:item.value})
            }
        }
    };
</script>

<style scoped lang="less">
    .select-length{
        width: 100%;
    }

</style>