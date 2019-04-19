//创建观察对象
class Observer{
    constructor(data){
        //提供一个解析方法，完成属性的分析，和挟持
        this.observer(data)
    }
    //解析数据
    observer(data){
        //判断数据的有效性(必须是对象)
        if(!data || typeof data !== 'object'){
            return 
        }
        //对当前对象属性重新定义(挟持)
        var keys = Object.keys(data);
        //遍历
        keys.forEach(key =>{
            this.defineReactive(data,key,data[key])
        })
    }
    defineReactive(obj,key,val){
        var dep = new Dep();
        //重新定义
        //1)重新定义目标对象
        //2)属性名
        //3)属性配置
        Object.defineProperty(obj,key,{
            
            enumerable: true, //是否可遍历
            configable: false, //是否可重新配置
            
            //特权方法getter 取值
            get(){
                //针对watcher创建时，直接完成发布订阅的添加
                Dep.target && dep.addsub(Dep.target)
                return val;
            },
            //特权方法setter 设值
            set(newValue) {
                val = newValue;
                dep.notify();
            }

        })
    }
}
//创建发布者
//1.管理订阅者
//2.通知
class Dep{
    constructor(){
        this.subs = [];
    }
    //添加订阅
    addsub(sub){ //其实就是watcher实例
        this.subs.push(sub)
    }
    //集体通知
    notify(){
        this.subs.forEach(sub =>{
            sub.update();
        })
    }
}
