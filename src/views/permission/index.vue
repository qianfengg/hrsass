<template>
  <div class="permission-container">
    <div class="app-container">
      <!-- 表格 -->
      <el-card>
        <div style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" size="small" @click="clickAddPermission(1, '0')">添加权限</el-button>
        </div>
        <el-table border :data="list" row-key="id">
          <el-table-column label="名称" prop="name" />
          <el-table-column label="标识" prop="code" />
          <el-table-column label="描述" prop="description" />
          <el-table-column label="操作">
            <template #default="{row}">
              <el-button v-if="row.type === 1" size="small" type="text" @click="clickAddPermission(row.type + 1, row.id)">添加权限点</el-button>
              <el-button size="small" type="text" @click="clickEdit(row.id)">查看</el-button>
              <el-button size="small" type="text" @click="clickDel(row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 新增编辑的弹层 -->
        <el-dialog :visible="showDialog" :title="showTitle" @close="closeDialog">
          <!-- 表单内容 -->
          <el-form label-width="100px">
            <el-form-item label="权限名称">
              <el-input v-model="formData.name" />
            </el-form-item>
            <el-form-item label="权限标识">
              <el-input v-model="formData.code" />
            </el-form-item>
            <el-form-item label="权限描述">
              <el-input v-model="formData.description" />
            </el-form-item>
            <el-form-item label="权限启用">
              <el-switch
                v-model="formData.enVisible"
                active-color="#13ce66"
                inactive-color="#ff4949"
                active-value="1"
                inactive-value="0"
              />
            </el-form-item>
          </el-form>

          <template #footer>
            <div style="text-align: right;">
              <el-button @click="showDialog = false">取消</el-button>
              <el-button type="primary" @click="clickSubmit">确定</el-button>
            </div>
          </template>
        </el-dialog>
      </el-card>
    </div>
  </div>
</template>

<script>
import { reqGetPermissionList, reqAddPermission, reqDelPermission, reqGetPermissionDetail, reqUpdatePermission } from '@/api/permission'
import { transListToTreeData } from '@/utils'
export default {
  name: 'Permissions',
  data() {
    return {
      list: [],
      showDialog: false,
      formData: {
        enVisible: '0', // 启用禁用, 0禁用, 1启用
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: '' // 添加到哪个节点下
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '查看' : '新增'
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    clickAddPermission(type, pid) {
      this.showDialog = true
      this.formData.type = type
      this.formData.pid = pid
    },
    async getPermissionList() {
      const { data } = await reqGetPermissionList()
      this.list = transListToTreeData(data, '0')
    },
    closeDialog() {
      this.showDialog = false
      this.formData = {
        enVisible: '0', // 启用禁用, 0禁用, 1启用
        name: '', // 名称
        code: '', // 权限标识
        description: '', // 描述
        type: '', // 类型标记了一级(页面访问权) 二级(按钮操作权)
        pid: '' // 添加到哪个节点下
      }
    },
    async clickSubmit() {
      this.formData.id ? (await reqUpdatePermission(this.formData)) : await reqAddPermission(this.formData)
      this.$message.success(`${this.formData.id ? '修改' : '添加'}权限成功`)
      this.closeDialog()
      this.getPermissionList()
    },
    async clickEdit(id) {
      this.showDialog = true
      const { data } = await reqGetPermissionDetail(id)
      this.formData = data
    },
    clickDel(id) {
      this.$confirm('亲，确认删除吗', '温馨提示').then(async() => {
        await reqDelPermission(id)
        this.$message.success('删除成功')
        this.getPermissionList()
      })
    }
  }
}
</script>
