<template>
  <div id="aside_style">
    <!--  默认选中  default-active="1"-->
    <el-menu background-color="#424f63" text-color="#fff" style="flex: 1;text-align:center;">

      <!--    循环生成菜单，将当前行的标题数据和将要跳转的组件名传递到方法中 class="is-loading" 2秒内旋转360-->
      <el-menu-item :index="item.index" class="menuItem" v-for="item in asideData" :key="item"
                    @click="changeMainView(item.targetComponent,item.name)"
                    v-on:mouseover="handleMouseOver(item.index)"
                    v-on:mouseleave="handleMouseLeave(item.index)">
<!--     根据不同index显示   -->
        <template #default="scope">
          <el-icon :class="runAround[item.index]" v-if="item.index == 1">
            <Menu/>
          </el-icon>
          <el-icon :class="runAround[item.index]" v-if="item.index == 2">
            <Orange/>
          </el-icon>
          <el-icon :class="runAround[item.index]" v-if="item.index == 3">
            <Compass/>
          </el-icon>
          <el-icon :class="runAround[item.index]" v-if="item.index == 4">
            <PieChart/>
          </el-icon>
          <el-icon :class="runAround[item.index]" v-if="item.index == 5">
            <InfoFilled/>
          </el-icon>
          <el-icon :class="runAround[item.index]" v-if="item.index == 6">
            <HelpFilled/>
          </el-icon>
          <el-icon :class="runAround[item.index]" v-if="item.index == 7">
            <QuestionFilled/>
          </el-icon>
          <el-icon :class="runAround[item.index]" v-if="item.index == 8">
            <Setting/>
          </el-icon>
          {{ item.name }}
        </template>
      </el-menu-item>

    </el-menu>
  </div>
</template>

<script>
import {ref} from 'vue';
import {useRouter, useRoute} from 'vue-router'
import {ElMessage} from 'element-plus'


export default {
  name: "Aside",
  components: {},

  //事件触发数组
  emits: [
    'changeMain'
  ],

  setup(props, ctx) {

    //侧栏数组
    const asideData = ref(
        [{
          name: '设备处理',
          targetComponent: 'DemoMain',
          index: '1'
        }, {
          name: '结构调整',
          targetComponent: 'DemoMain',
          index: '2'
        }, {
          name: '算法维护',
          targetComponent: 'DemoMain',
          index: '3'
        },
          {
            name: '计算属性',
            targetComponent: 'DemoMain',
            index: '4',
          },
          {
            name: '模板语法',
            targetComponent: 'DemoMain',
            index: '5',
          },
          {
          name: '条件渲染',
          targetComponent: 'DemoMain',
          index: '6',
        }, {
          name: '生命周期',
          targetComponent: 'DemoMain',
          index: '7',
        }, {
          name: '模板引用',
          targetComponent: 'DemoMain',
          index: '8',
        },

        ])

    //消息通知
    const elSout = (mMessage, mType) => {
      ElMessage({
        message: mMessage,
        type: mType,
        center: true,
        duration: 2500,
        showClose: false,
        grouping: true,
      })
    }


    //使用事件触发父组件homeviewde的 @changeMain="changeMainVue" 方法，再调用main的changeModol方法
    const changeMainView = (targetComponent, title) => {
      ctx.emit('changeMain', targetComponent, title);
    }

    //转圈圈类字符,共八个
    const runAround = ref(['', '', '', '', '', '', '', '',]);


    //转圈圈事件处理,鼠标悬浮
    const handleMouseOver = (index) => {
      (runAround.value)[index] = 'is-loading';

    }
    //转圈圈事件处理,鼠标离开
    const handleMouseLeave = (index) => {
      (runAround.value)[index] = '';
    }


    return {
      elSout,
      asideData,
      changeMainView,
      handleMouseOver,
      handleMouseLeave,
      runAround,

    }
  }
}
</script>

<style scoped>
#aside_style {
  padding-left: 12px;
  padding-top: 12px;
  display: flex;
  flex: 1;
  height: 100%;
  width: 250px;


}

.menuItem {
  text-align: center;
  color: white;
  margin-top: 5px;
  margin-left: 15px;
  font-size: 16px;
  letter-spacing: 7px;
  font-family: "等线";

}


</style>