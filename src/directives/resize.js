import Vue from 'vue';

// 自动注册到全局
Vue.directive('resize', {
    bind(el, binding) {
        // el为绑定的元素，binding为绑定给指令的对象
        let width = '', height = '';
        function isResize() {
            const style = document.defaultView.getComputedStyle(el);
            if (width != '' &&height !='' && (width !== style.width || height !== style.height)) {
                // 关键(这传入的是函数,所以执行此函数)
                binding.value({ swidth: style.width, sheight: style.height ,width:width,height:height});
            }
            width = style.width;
            height = style.height;
        }

        el.__vueSetInterval__ = setInterval(isResize, 600);
    },

    unbind(el) {
        clearInterval(el.__vueSetInterval__);
    }
});

