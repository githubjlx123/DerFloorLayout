/**
 * Storage二次封装
 * @author Cuijingyang
 */
export default {
    setItem(key,val){
        let storage = this.getStroage();
        storage[key] = val;
        window.localStorage.setItem('DeepOnce',JSON.stringify(storage));
    },
    getItem(key){
        return this.getStroage()[key]
    },
    getStroage(){
        return JSON.parse(window.localStorage.getItem('DeepOnce') || "{}");
    },
    clearItem(key){
        let storage = this.getStroage()
        delete storage[key]
        window.localStorage.setItem('DeepOnce',JSON.stringify(storage));
    },
    clearAll(){
        window.localStorage.clear()
    }
}