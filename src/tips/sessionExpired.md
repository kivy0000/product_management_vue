<h1>session提示</h1>
<h2>注意：sessionStorage只有在前端组件中可以获取，后端无法获取，仅适用于低安全性数据交互</h2>
<h3>数据的验证流程：前端首先将withCredentials: true，后端使用sessionId+redis统一保存/获取数据，与前端url携带的参数进行校验</h3>



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
  console.log('Data has expired');
} else {
  // 数据未过期
  console.log(userData);
}
```

通过以上示例代码，我们可以在不同的Vue组件中保存和获取数据，并设置一个过期时间来实现数据的过期功能。
