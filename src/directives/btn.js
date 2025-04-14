export default {
    install: (app) => {
        app.directive('btn', {
            mounted(el) {
                el.addEventListener('click', () => {
                    el.blur()
                })
            },
        })
    }
}
