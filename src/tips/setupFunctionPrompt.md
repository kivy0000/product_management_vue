`在vue3中,setup()方法中的reactive(),ref()都可以用来创建响应式对象`
`reactive()只能用来创建包含属性的对象,结构的属性没有响应性,在全局都可以直接访问`
`ref()则对象和值都可以,并且会使他的值具有深层响应性，注意:ref的值在外部会自动展开,在setup内部则需要使用.value来读取值`
`下面是一个简单的示例`
<h1>推荐使用ref()</h1>

```vue
<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Name: {{ person.name }}</p>
    <p>Age: {{ person.age }}</p>
    <button @click="increment">Increment</button>
    <button @click="changeName">Change Name</button>
    <button @click="changeAge">Change Age</button>
  </div>
</template>

<script>
import { ref, reactive } from 'vue';

export default {
  setup() {
    // 使用ref()创建引用式数据
    const count = ref(0);

    // 使用reactive()创建引用式对象
    const person = reactive({
      name: 'Alice',
      age: 25
    });

    const increment = () => {
      count.value++;
    };

    const changeName = () => {
      person.name = 'Bob'; // 直接修改属性
    };

    const changeAge = () => {
      person.age++; // 直接修改属性
    };

    return {
      count,
      person,
      increment,
      changeName,
      changeAge
    };
  }
};
</script>
```
`如何合理使用生命周期钩子
 合理使用生命周期钩子是Vue 3中构建可维护和高性能应用程序的关键。以下是一些最佳实践：
 
 在created钩子中进行数据获取和异步操作：created是一个很好的地方来初始化数据，以确保数据在组件渲染之前可用。
 在mounted钩子中进行DOM操作：mounted是执行DOM操作的理想时机，例如添加事件监听器或执行动画效果。
 使用beforeUpdate钩子进行数据比较：如果您需要在数据更新前执行一些逻辑，beforeUpdate是一个合适的选择。
 利用updated钩子更新UI：updated钩子可用于在数据更新后执行与UI相关的操作，例如刷新图表或更新列表。
 在beforeUnmount钩子中清理资源：使用beforeUnmount来移除事件监听器、取消定时器或释放资源，以确保在组件销毁前进行必要的清理。
 善用unmounted钩子：unmounted是执行最后的清理操作的好地方，确保您的组件在销毁后不会留下无用的资源。
 ————————————————
 
                         
 `````原文链接：https://blog.csdn.net/m0_71975585/article/details/132920193`````
