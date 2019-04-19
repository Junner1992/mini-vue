//声明一个订阅者
class Watcher{
    //1.node 需要使用订阅功能的节点
    //2.vm 全局对象 获取数据
    //3.发布时需要做的事情
    constructor(vm,expr,cb){
        //缓存重要属性
        this.expr = expr;
        this.vm = vm;
        this.cb = cb;

        //缓存当前值
        this.value = this.get();
    }

    //获取当前值
    get(){
        Dep.target = this; //watcher实例
        var value = this.vm.$data[this.expr];
        Dep.target = null;
        return value;
    }

    //提供一个更新方法,应对发布后要做的事情
    update(){
        //获取新值
        var newValue = this.vm.$data[this.expr];
        //获取老值
        var oldValue = this.value
        //判断后,执行回调
        if(newValue !== oldValue) {
            this.cb(newValue);
        }
    }
}