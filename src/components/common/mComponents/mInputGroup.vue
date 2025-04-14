<template>
    <div class="m-input-group">
        <el-input v-model="item.paramsOption[1]" @change="handleChangeInput1" class="input-item"></el-input>
        <el-input v-model="item.paramsOption[2]" @change="handleChangeInput2"></el-input>
    </div>
</template>

<script>
    export default {
        name: 'mInputGroup',
        props:{
            item:Object,
        },
        data() {
            return{}
        },
        methods:{
            //修改第一个输入框
            handleChangeInput1(val){
                this.$emit('changeInputGroup',{name:this.item.name,value:val,inputNum:0})
            },
            //修改第二个输入框
            handleChangeInput2(val){
                this.$emit('changeInputGroup',{name:this.item.name,value:val,inputNum:1})
            }
        }
    };
</script>

<style scoped lang="less">
    .m-input-group {
        display: flex;
    }
    .input-item{
        margin-right: 10px;
    }
</style>