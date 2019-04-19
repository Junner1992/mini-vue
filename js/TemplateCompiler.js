//创建一个模板编译工具

class TemplateCompiler{
    //接收视图线索和全局vm(this)
    constructor(el,vm){
        //缓存重要的属性
        this.el = this.isElementNode(el)? el : document.querySelector(el);
        this.vm = vm;

        //判断视图存在
        if(this.el){
            //1.把模板内容放进内存(片段)
          var fragment = this.node2fragment(this.el); 
            //2.解析模板
          this.compile(fragment);
            //3.把内存中的结果，返回到页面
          this.el.appendChild(fragment);
        }
    }

  //**********工具方法************ */
  isElementNode(node) {
    return node.nodeType === 1; //1.元素节点 2.属性节点 3.文本节点
  }
  isTextNode(node) {
    return node.nodeType === 3; //1.元素节点 2.属性节点 3.文本节点
  }
  toArray(fakeArr) {
    return [].slice.call(fakeArr) //转换为数组
  }
  isDirective(attrName) {
    return attrName.indexOf('v-')>=0; //判断属性名中是否有 'v-'开头
  }
  //************************** */

  //***********核心方法*********** */
  //把模板放入内存，等待解析
  node2fragment(node){
    //1.创建内存片段
    var fragment = document.createDocumentFragment();
    var child;
    //2.把模板内容丢到内存
    while (child = node.firstChild) {
      fragment.appendChild(child);
    }
    //3.返回
    return fragment;
  }
  compile(parent){
    //1.获取子节点
    var childNode = parent.childNodes,
        compiler = this;
    //2.遍历每一个节点
    this.toArray(childNode).forEach(node=>{
      //3.判断节点类型
      if (compiler.isElementNode(node)) {
        //1）元素节点(解析指令)
        compiler.compileElement(node);
      }else{
        //2）文本节点(解析指令)
        var textReg = /\{\{(.+)\}\}/    //{{message}}
        var expr = node.textContent;
        //按照规则校验内容
        if(textReg.test(expr)){
          expr = RegExp.$1;
          //调用方法编译
          compiler.compileText(node,expr);
        }
      }
      
      //2）文本节点(解析指令)

      //*4）如果还有子节点，继续解析
    })
    
  }
  //解析元素节点指令
  compileElement(node){
    //1.获取当前元素节点的所有属性
    var arrs = node.attributes;
    var compiler = this;
    //2.遍历当前元素的所有熟悉
    this.toArray(arrs).forEach(attr=>{
      var attrName = attr.name;
      //3.判断属性是否是指令属性
      if (compiler.isDirective(attrName)) {
        //4.收集
          //指令类型
          var type = attrName.substr(2); //v-text v-model
          //指令的值就是表达式
          var expr = attr.value
        //5.找帮手
        compilerUtils[type](node, compiler.vm, expr)
      }
      
    })
    
  }
  //解析表达式
  compileText(node,expr){
    compilerUtils.text(node,this.vm,expr)
  }
  //************************** */
}

//帮手
compilerUtils = {
  //解析text指令
  text(node,vm,expr){
    /**第一次解析模板 */
    //1.找到更新方法
    var updaterFn = this.updater['textUpdater']
    //2.执行方法
    updaterFn && updaterFn(node,vm.$data[expr]);

    /**第 n+1 次 */
     //1.node 需要使用订阅功能的节点
    //2.vm 全局对象 获取数据
    //3.发布时需要做的事情
    new Watcher(vm,expr,(newValue)=>{
      //触发订阅时，按照之前的规则，对节点进行更新
      updaterFn && updaterFn(node, newValue);
    });
  },
  model(node, vm, expr) {
    //1.找到更新方法
    var updaterFn = this.updater['modelUpdater']
    //2.执行方法
    updaterFn && updaterFn(node, vm.$data[expr]);

    //对model指令也添加一个订阅者
    new Watcher(vm,expr, (newValue) => {
      //触发订阅时，按照之前的规则，对节点进行更新
      updaterFn && updaterFn(node, newValue);
    });

    //3.视图到模型
    node.addEventListener('input',(e)=>{
      //获取输入框新值
      var newValue = e.target.value;

      //把值放入到数据
      vm.$data[expr] = newValue
    })
  },

  //更新规则对象
  updater:{
    //文本更新方法
    textUpdater(node,value){
      node.textContent = value;
    },
     //输入框更新方法
    modelUpdater(node, value) {
      node.value = value;
    }
  }
}