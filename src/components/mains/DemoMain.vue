<template>
  <el-container>
    <!--     顶部互动区   -->
    <el-header style="height: 30px;">
      <div>
        <!--搜索删除新增导出区        -->
        <div class="mt-4 text-sm font-bold">
          <keep-alive>
            <el-input
                v-model="select_text" class="select_text_style" maxlength="10"
                placeholder="请输入搜索条件：名称/番号" show-word-limit type="text"/>
          </keep-alive>

          <el-button style="height: 35px;height: 35px;width: 78px" @click="selectByText">
            <el-icon style="margin-right: 2px" size="15px" class="is-loading" v-if="selectLoading">
              <Loading/>
            </el-icon>
            <el-icon style="margin-right: 2px" size="15px">
              <Search/>
            </el-icon>
            查找
          </el-button>
          <!--   更改弹窗标题,清空校验规则(未写入)drawerFormRef.resetFields();       -->
          <el-button @click="drawer = true;drawerFormTitles.title = '添加数据';drawerFormTitles.msg = '添加';"
                     style="margin-left: 30px;height: 35px;width: 78px">
            新增
          </el-button>
          <el-button @click="exportMoreRow" style="margin-left: 10px;height: 35px;width: 78px">批量导出</el-button>
          <el-button @click="deleteMoreRow" style="margin-left: 10px;height: 35px;width: 78px;" type="danger" plain>
            批量删除
          </el-button>
        </div>
        <!--     右弹窗   -->
        <el-drawer v-model="drawer" :before-close="handleClose">
          <!--     右弹窗标题   -->
          <template #header>
            <p style="font-size: large;font-family: 黑体;font-weight: bolder;letter-spacing: 2px;">
              {{ drawerFormTitles.title }}</p>
          </template>
          <!--     右弹窗表单   -->
          <!--     :model="drawerForm" 代表表单数据   -->
          <!--     ref="drawerFormRef" 代表整个表单,包括验证方法和api等   -->
          <template #default>
            <el-form :model="drawerForm" ref="drawerFormRef" label-width="auto" style="max-width: 600px" :rules="rules">
              <el-form-item label="名称" prop="name">
                <el-input v-model="drawerForm.name"/>
              </el-form-item>
              <el-form-item label="番号" prop="productId">
                <el-input v-model="drawerForm.productId"/>
              </el-form-item>
              <el-form-item label="制作时间" prop="productionTime">
                <el-date-picker v-model="drawerForm.productionTime" value-format="YYYY-MM-DD HH:mm:ss" type="datetime"
                                placeholder="Select date and time"/>
              </el-form-item>
              <el-form-item label="入库数量" prop="inventory">
                <el-input v-model="drawerForm.inventory"/>
              </el-form-item>
              <el-form-item label="销量" prop="sales">
                <el-input v-model="drawerForm.sales"/>
              </el-form-item>
              <el-form-item label="部门" prop="parts">
                <el-select placeholder="选择你的部门" v-model="drawerForm.parts">
                  <el-option label="技术部" value="技术部"/>
                  <el-option label="测试部" value="测试部"/>
                  <el-option label="开发部" value="开发部"/>
                  <el-option label="保洁部" value="保洁部"/>
                  <el-option label="测试组" value="测试组"/>
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button v-if=" drawerFormTitles.msg == '添加'" type="primary" :loading="loading" @click="addProduct()">
                  {{ drawerFormTitles.msg }}
                </el-button>
                <el-button v-else=" drawerFormTitles.msg == '添加'" type="primary" :loading="loading"
                           @click="doHandleEdit()">{{
                    drawerFormTitles.msg
                  }}
                </el-button>
                <el-button @click="handleClose">返回</el-button>
              </el-form-item>
            </el-form>
          </template>
          <!--     右弹窗底部  -->
          <!--          <template #footer>-->
          <!--            <div style="flex: auto">-->
          <!--              <el-button type="primary" @click="drawer = false;loading = true" :loading="loading">提交</el-button>-->
          <!--              <el-button type="info" @click="drawer = false">退出</el-button>-->
          <!--            </div>-->
          <!--          </template>-->

        </el-drawer>
      </div>
    </el-header>
    <!--  主内容区  -->
    <el-main>
      <div>
        <!--   没有数据时，会显示为加载中动画-->
        <el-table :data="tableData" border class="table_style" height="620px" min-wdith="1560px"
                  @selection-change="handleSelectionChange" v-loading="tableData.length<=0"
                  element-loading-text="数据加载中，请稍候..." stripe :row-style="{ height: '58px' }">
          <el-table-column type="selection" width="35px"/>
          <el-table-column prop="id" label="ID" align="center" width="58px"/>
          <el-table-column prop="name" label="名称" align="center" width="200px"/>
          <el-table-column prop="productId" label="产品番号" align="center" width="360px"/>
          <el-table-column prop="productionTime" label="制作时间" align="center" width="260px"/>
          <el-table-column prop="initTime" label="入库时间" align="center" width="240px"/>
          <el-table-column prop="inventory" label="库存" align="center" width="60px"/>
          <el-table-column prop="sales" label="销量" align="center" width="60px"/>
          <el-table-column prop="parts" label="部门" align="center" width="90px"/>
          <el-table-column label="操作" align="center">
            <template #default="scope">

              <el-button @click="handleEdit(scope.row);drawerFormTitles.title = '修改数据';drawerFormTitles.msg = '提交修改'"
                         link>
                编辑
              </el-button>
              <!--        TODO excel表格操作      -->
              <el-button @click="exportRow(scope.row)" link>导出</el-button>

              <el-popconfirm title="确认删除？" @confirm="deleteRow(scope.row)">
                <template #reference>
                  <el-button style="margin-left: 5px" link type="danger">删除</el-button>
                </template>
              </el-popconfirm>

            </template>
          </el-table-column>
        </el-table>
        <el-pagination
            style="margin-top: 8px"
            :current-page="paginationItems.pageNum"
            :page-size="paginationItems.pageSize"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :page-sizes="[10,15,20,30]"
            layout="total, sizes, prev, pager, next"
            :total="paginationItems.total"
        />
      </div>
    </el-main>
  </el-container>

</template>

<script>
import {ref, inject} from 'vue';
import {useRouter, useRoute} from 'vue-router'
import {ElMessage, ElNotification} from 'element-plus'
import {ElDrawer, ElMessageBox} from 'element-plus'
//引入axios对象
import request from "@/utils/request";
//生成uuid
import {v4 as uuidv4} from 'uuid';

export default {
  name: "DemoMain",
  components: [],
  created() {
    //初始化表单数据
    try {
      this.flashTableData();
    } catch (e) {
      console.log("初始化失败", 'warning');
    }
  },
  setup(props, ctx) {

    //读取其他组件传的值
    // const mynum = inject('mynum');

    //路由
    var router = useRouter();

    //用于接收动态选中的行
    const selectionTableData = ref([]);

    //搜索关键字
    const select_text = ref('');

    //临时搜索关键字,用于重置页码
    const select_text_demo = ref('');

    //搜索画面
    const selectLoading = ref(false);

    //弹窗表单数据
    const drawerForm = ref({
      // //测试数据，用完删除
      // //  id: '13',
      name: 'ikun' + Math.ceil(Math.random() * 10) + Math.ceil(Math.random() * 10) + Math.ceil(Math.random() * 10),
      productId: uuidv4(4),
      inventory: '20',
      sales: '16',
      parts: '技术部',
      productionTime: '',
      // // init_time: '',
    });

    //整个弹窗表单
    const drawerFormRef = ref();

    //弹窗表单验证规则
    const rules = ref({
      name: [
        {required: true, message: 'Please input Activity name', trigger: 'blur'},
        {min: 3, max: 16, message: 'Length should be 3 to 16', trigger: 'blur'},
      ],
      productId: [
        {required: true, message: '请输入产品代码', trigger: 'blur'},
        {min: 3, max: 60, message: '产品代码不能过长/过短', trigger: 'blur'},
      ],
      //  使用正则表达式
      inventory: [
        {required: true, message: '请输入产品库存', trigger: 'blur'},
        {pattern: /^(([1-9]\d*)|(0))$/, message: '请输入大于0的整数', trigger: 'blur'},
      ],
      sales: [
        {required: true, message: '请输入销量', trigger: 'blur'},
        {pattern: /^(([1-9]\d*)|(0))$/, message: '请输入大于0的整数', trigger: 'blur'},
      ],
      parts: [
        {required: true, message: '请选择部门', trigger: 'blur'},

      ],
      productionTime: [
        {type: 'date', required: true, message: '选择入库时间', trigger: 'blur'},
      ],
    });

    //弹窗表单标题
    const drawerFormTitles = ref({
      title: '',
      msg: '',
    });

    //分页组件所需的属性
    const paginationItems = ref({
      pageSize: 10,
      pageNum: 1,
      total: 30
    });


    //以下是方法------------------------------------------

    //接收分页组件每页大小变更
    const handleSizeChange = (newPageSize) => {
      paginationItems.value.pageSize = newPageSize;
      flashTableData();
    }

    //接收分页组件页码变更
    const handleCurrentChange = (newPageNum) => {
      paginationItems.value.pageNum = newPageNum;
      flashTableData();
    }

    //提交弹窗表单
    const addProduct = () => {
      //表单正在提交动画
      loading.value = true;
      //校验表单数据
      drawerFormRef.value.validate(valid => {
        //前端校验通过,正常提交
        if (valid) {
          console.log('提交信息为', drawerForm.value);
          //发送给后端数据
          request.post("/api/addProduct/", drawerForm.value).then(res => {
            console.log('返回信息为', res);
            //后端校验
            if (res.code === '400') {
              //后端校验失败,提示
              elSout("校验失败,请检查信息", 'warning');
              console.log(res.data);
            } else {
              //后端校验成功
              elSout(res.code === '200' ? "添加成功" : "添加失败", res.msg);
            }
            //刷新数据
            flashTableData();
            //无论数据是否提交成功，都设置loading为false，否则会导致弹窗始终无法关闭
            loading.value = false;
            drawer.value = false;
            //重置弹窗表单
            drawerForm.value = ref({});
          }).catch(reason => {
            elSout("添加失败，原因是" + reason, 'error');
            loading.value = false;
          });
        } else {
          //校验不通过,不能提交

          elSout("表单校验失败，请检查", 'warning');
          loading.value = false;
          return false;

        }

      })


    }

    //按关键字搜索
    const selectByText = () => {
      flashTableData();
    };

    //当前行数据提交到表单
    const handleEdit = (row) => {
      //传递值到右侧弹窗
      drawerForm.value = row;
      drawer.value = true;
    }

    //真正修改当前行的方法
    const doHandleEdit = () => {
      //表单正在提交动画
      loading.value = true;
      //校验表单数据
      drawerFormRef.value.validate(valid => {
        //校验通过,正常提交
        if (valid) {
          //提交修改
          request.put("api/editProduct", drawerForm.value)
              .then(res => {
                console.log(res);
                elSout(res.code == '200' ? "修改成功" : "无修改，请检查" + res.data, res.msg);
                flashTableData();
                drawer.value = !(res.code == '200');
                loading.value = false;
              })
              .catch(reason => {
                elSout("异常导致修改失败", "error");
                console.log(reason);
                loading.value = false;

              });
        } else {
          elSout("表单校验失败,请检查", 'warning');
          loading.value = false;
          return false;//不提交
        }
      });

    }

    //新增/编辑弹窗是否显示
    const drawer = ref(false);

    //弹窗按钮加载画面是否显示
    const loading = ref(false);

    //刷新数据表数组tableData,flashTableData()带方法括号
    const flashTableData = () => {
      //如果有搜索关键字，进入关键字搜索分页/selectByTextAndPage
      if (select_text.value != null && select_text.value !== '') {
        //关键词和临时搜索关键词判断
        if (select_text_demo.value != null  && select_text_demo.value !== select_text.value) {
          //第一次搜索,页码置为1,保存关键字
          paginationItems.value.pageNum = 1;
          select_text_demo.value = select_text.value;
        }
        //不是第一次搜索
        selectLoading.value = true;
        request.get("api/selectByTextAndPage/" + select_text.value, {
          params: {
            pageNum: paginationItems.value.pageNum,
            pageSize: paginationItems.value.pageSize,
          }
        })
            .then(res => {
              console.log(res);
              elSout(res.code == '200' ? "查询成功" : "未查询到", res.msg);
              if (res.code == '200') {
                //更新数据
                tableData.value = res.data.records;
                //获取总页数
                paginationItems.value.total = res.data.total;
                console.log(tableData.value);
              }
              selectLoading.value = false;
            })
            .catch(reason => {
              console.log(reason);
              selectLoading.value = false;
              elSout("异常导致查询失败", 'error');
            });

      } else {
        //没有有搜索关键字，进入全部数据分页/getAllByPage
        request.get("/api/getAllByPage", {
          params: {
            pageNum: paginationItems.value.pageNum,
            pageSize: paginationItems.value.pageSize,
          }
        })
            .then(res => {
              //更新数据
              tableData.value = res.data.records;
              //获取总页数
              paginationItems.value.total = res.data.total;
            })
            .catch(reason => {
              console.log('刷新失败，原因是', reason);
            })
      }

    };

    //数据表数组，使用循环/索引提取
    const tableData = ref([]);

    //单项删除
    const deleteRow = (row) => {
      // console.log(row);
      request.delete("/api/deleteProduct", {data: row})
          .then(res => {
            console.log('删除响应信息为', res);
            elSout(res.code == '200' ? "删除成功" : "删除失败", res.msg);
            flashTableData();
          })
          .catch(reason => {
            console.log('异常导致删除失败响应信息为', reason);
            elSout("异常导致删除失败", 'warning');
          });
    };

    /**
     *     批量删除
     */
    const deleteMoreRow = () => {
      //没有多选，直接返回并提示
      if (selectionTableData.value.length == 0) {
        elSout('请选择要删除的项', 'warning');
        return;
      }
      //多选后
      ElMessageBox.confirm
      ('确定要删除选中项吗?',
          '警告',
          {
            confirmButtonText: '删除',
            cancelButtonText: '取消',
            type: 'warning',
          })

          //确认要删除，生成ids集合
          .then(() => {
            let ids = [];
            for (let i = 0; i < selectionTableData.value.length; i++) {
              ids.push(selectionTableData.value[i].id);
            }
            //发送请求，携带ids集合
            request.delete("api/deleteMoreProduct", {data: ids})
                .then(res => {
                  elSout(res.code == '200' ? "批量删除成功" : "批量删除失败", res.msg);
                  flashTableData();
                })
                .catch(reason => {
                  elSout('批量删除失败', 'warning');
                  console.log("批量删除失败reason=", reason);
                })
          })
          .catch(() => {
            //误触，取消批量删除
            ElMessage({
              type: 'info',
              message: '取消删除',
            });
          })


    };

    /**
     * 单行导出
     * */
    const exportRow = (row) => {
      elSout("导出数据完成", 'success');
      // console.log("导出数据：", row);
    }

    /**
     *     批量导出
     */
    const exportMoreRow = () => {
      if (selectionTableData.value.length == 0) {
        elSout('请选择要导出的项', 'warning');
        return;
      }
      elSout("批量导出数据完成", 'success');
    };

    /**
     * 动态获取选中的行
     * @param selection el-table自动获取选中行
     */
    const handleSelectionChange = (selection) => {
      selectionTableData.value = selection;
      // console.log("当前选中的行", selectionTableData.value);
    }

    //退出弹窗的提示
    const handleClose = () => {
      //如果正在提交信息，不关闭弹窗
      if (loading.value == true) {
        elSout('数据正在提交，请耐心等待', 'warning');
        return;
      }
      //如果没有任何信息且没有在提交，允许直接关闭
      if (Object.keys(drawerForm.value).length == 0 && loading.value == false) {
        drawer.value = false;
        return;
      }
      //如果有信息且没有在提交，询问
      ElMessageBox.confirm(
          '要退出编辑吗? 所有未储存的数据都会被清除',
          '警告',
          {
            confirmButtonText: '退出编辑',
            cancelButtonText: '继续编辑',
            type: 'warning',
          }
      )
          .then(() => {
            ElMessage({
              type: 'info',
              message: '退出编辑',
            });
            drawer.value = false;
            drawerForm.value = ref();

          })
          .catch(() => {
            //  继续编辑
          })
    }

    //消息通知
    const elSout = (mMessage, mType) => {
      ElMessage({
        message: mMessage,
        type: mType,
        center: true,
        duration: 2500,
        showClose: false,
        grouping: false,
      })
    }

    //右侧提示消息通知
    const elOpen = (mTitle, mMessage, mType) => {
      ElNotification({
        title: mTitle,
        message: mMessage,
        type: mType,
        offset: 100,
        duration: 3000
      })
    }


    return {
      tableData,
      selectionTableData,
      drawerForm,
      select_text,
      select_text_demo,
      selectLoading,
      drawer,
      rules,
      drawerFormRef,
      loading,
      drawerFormTitles,
      paginationItems,
      deleteRow,
      deleteMoreRow,
      exportMoreRow,
      exportRow,
      handleSelectionChange,
      handleSizeChange,
      handleCurrentChange,
      flashTableData,
      addProduct,
      handleClose,
      handleEdit,
      doHandleEdit,
      selectByText,
      elSout,
      elOpen,
    };
  }
}
</script>

<style scoped>

.table_style {
  display: flex;
  flex: 1;
  font-size: small;

}

.select_text_style {
  width: 280px;
  height: 35px;
  margin-right: 10px
}

* el-icon {
  size: "18";
  margin-right: 2px;
}


</style>