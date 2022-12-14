<template>
  <el-dialog title="新增员工" :visible="showDialog" top="8vh" @click.native="showTree = false" @close="closeDialog">
    <!-- 表单 -->
    <el-form ref="addForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="姓名" prop="username">
        <el-input v-model="formData.username" style="width:50%" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="手机" prop="mobile">
        <el-input v-model="formData.mobile" style="width:50%" placeholder="请输入手机号" />
      </el-form-item>
      <el-form-item label="入职时间" prop="timeOfEntry">
        <el-date-picker v-model="formData.timeOfEntry" style="width:50%" placeholder="请选择入职时间" />
      </el-form-item>
      <el-form-item label="聘用形式" prop="formOfEmployment">
        <el-select v-model="formData.formOfEmployment" style="width:50%" placeholder="请选择">
          <el-option v-for="item in hireType" :key="item.id" :label="item.value" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="工号" prop="workNumber">
        <el-input v-model="formData.workNumber" style="width:50%" placeholder="请输入工号" />
      </el-form-item>
      <el-form-item label="部门" prop="departmentName">
        <el-input :value="formData.departmentName" style="width:50%" placeholder="请选择部门" @click.native.stop="handleClick" />
        <div v-show="showTree" class="tree-box">
          <el-tree v-loading="isTreeLoading" :props="{label: 'name'}" :data="treeData" @node-click="handleNodeClick" />
        </div>
      </el-form-item>
      <el-form-item label="转正时间" prop="correctionTime">
        <el-date-picker v-model="formData.correctionTime" style="width:50%" placeholder="请选择转正时间" />
      </el-form-item>
    </el-form>
    <!-- footer插槽 -->
    <template v-slot:footer>
      <el-button @click="closeDialog">取消</el-button>
      <el-button type="primary" @click="clickSubmit">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import { reqGetDepartments } from '@/api/departments'
import { transListToTreeData } from '@/utils'
import employeesConstant from '@/constant/employees'
import { reqAddEmployee } from '@/api/employees'
const { hireType } = employeesConstant
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      hireType,
      formData: {
        username: '', // 用户名
        mobile: '', // 手机号
        formOfEmployment: '', // 聘用形式
        workNumber: '', // 工号
        departmentName: '', // 部门
        timeOfEntry: '', // 入职时间
        correctionTime: '' // 转正时间
      },
      rules: {
        username: [
          { required: true, message: '用户姓名不能为空', trigger: ['blur', 'change'] },
          { min: 1, max: 4, message: '用户姓名为1-4位', trigger: ['blur', 'change'] }
        ],
        mobile: [
          { required: true, message: '手机号不能为空', trigger: ['blur', 'change'] },
          { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: ['blur', 'change'] }
        ],
        formOfEmployment: [
          { required: true, message: '聘用形式不能为空', trigger: ['blur', 'change'] }
        ],
        workNumber: [
          { required: true, message: '工号不能为空', trigger: ['blur', 'change'] }
        ],
        departmentName: [
          { required: true, message: '部门不能为空', trigger: ['blur', 'change'] }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: ['blur', 'change'] }
        ]
      },
      treeData: [],
      showTree: false,
      isTreeLoading: false
    }
  },
  methods: {
    handleNodeClick(data) {
      if (data.children && data.children.length) return
      this.formData.departmentName = data.name
      this.showTree = false
    },
    closeDialog() {
      this.$emit('update:showDialog', false)
      this.$refs.addForm.resetFields()
    },
    async handleClick() {
      this.showTree = !this.showTree
      if (!this.showTree) return
      this.isTreeLoading = true
      const { data: { depts }} = await reqGetDepartments()
      const treeData = transListToTreeData(depts)
      this.treeData = treeData
      this.isTreeLoading = false
    },
    clickSubmit() {
      this.$refs.addForm.validate(async flag => {
        if (!flag) return
        await reqAddEmployee(this.formData)
        this.$message.success('新增员工成功')
        this.closeDialog()
        this.$emit('add-employee')
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.tree-box {
  position: absolute;
  width: 50%;
  min-height: 50px;
  max-height: 150px;
  left: 0;
  top: 45px;
  z-index: 100;
  border: 1px solid #ccc;
  border-radius: 4px;
  padding-right: 5px;
  overflow: auto;
  background-color: #fff;
  ::v-deep {
    .el-tree-node__content {
      height: auto
    }
  }
}
</style>
