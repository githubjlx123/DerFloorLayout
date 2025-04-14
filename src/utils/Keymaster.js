import Keymaster from 'keymaster'

const bindKeyHandler = fn => {
    return () => {
        fn()
        return false
    }
}


export const shortcut = {
    bind: (seed, func,config) =>  Keymaster(seed, bindKeyHandler(func),config), //绑定
    unBind:(seed)=> Keymaster.unbind(seed), //解除绑定
    getPressedKeyCodes:()=>Keymaster.getPressedKeyCodes(), //查看当前按下键的键码
    isPressed:(key)=>Keymaster.isPressed(key) //是否按下了指定键
}


