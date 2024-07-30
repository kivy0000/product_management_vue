<h1>session提示</h1>
<h2>sessionStorage 、localStorage、cookie</h2>
<h3>注意：1. 这三个仅适用于低安全性数据交互,会储存在本地客户端，放入时，value应使用JSON.stringify转换为json字符串
            取出时，使用JSON.parse转换为json对象
         2.cookie可以设置过期时间，但只能设置4kb数据
         3. request.js 设置withCredentials: true后，后端可以读取到sessionStorage的数据，这是因为允许了cookie携带session数据
</h3>



`在Vue3中，可以通过使用sessionStorage来保存数据到会话作用域中，并设置一个过期时间来实现数据在一定时间后过期。下面是一个简单的示例代码演示如何实现：`
`1. 在一个Vue组件中设置数据到sessionStorage中并设置过期时间：`
```javascript
// 在一个Vue组件中设置数据到sessionStorage中
sessionStorage.setItem('userData', JSON.stringify({ name: 'John Doe' }));

// 设置一个过期时间为1小时后
const expireTime = new Date().getTime() + 60 * 60 * 1000;
sessionStorage.setItem('expireTime', expireTime);
```

2. 在另一个Vue组件中获取`sessionStorage`中的数据并检查是否已经过期：
    

```javascript
// 在另一个Vue组件中获取sessionStorage中的数据
const userData = JSON.parse(sessionStorage.getItem('userData'));

// 获取过期时间并检查是否已经过期
const expireTime = sessionStorage.getItem('expireTime');
if (new Date().getTime() > parseInt(expireTime)) {
  // 数据已过期
  console.log('数据已过期');
} else {
  // 数据未过期
  console.log('数据未过期',userData);
}
```

通过以上示例代码，我们可以在不同的Vue组件中保存和获取数据，并设置一个过期时间来实现数据的过期功能。
