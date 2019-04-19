//创建一个 MVVM 框架 类

//作用： 解析视图模板，把对应的数据，渲染到页面

class MVVM{
    //构造器（创建示例的模板代码）
    constructor(options){
     //缓存重要属性
        this.$vm = this;
        this.$el = options.el;
        this.$data = options.data;

     //判断视图是否存在
     if(this.$el){
        //添加属性观察对象，实现属性挟持
        new Observer(this.$data)

         //创建模板编译器，来解析视图
         //将视图线索和全局vm(this) 传参过去
         this.$compiler = new TemplateCompiler(this.$el,this.$vm)
     }

    }
}