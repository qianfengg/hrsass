<template>
  <el-row type="flex" justify="space-between" align="middle" style="height: 40px; width: 100%">
    <el-col :span="20">
      <span>{{ nodeData.name }}</span>
    </el-col>
    <el-col :span="4">
      <el-row type="flex">
        <!-- 两个内容 -->
        <el-col :span="12">{{ nodeData.manager }}</el-col>
        <el-col :span="12">
          <!-- 下拉菜单 element -->
          <el-dropdown @command="handleCommand">
            <span>
              操作<i class="el-icon-arrow-down" />
            </span>
            <!-- 下拉菜单 -->
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="add">添加子部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="edit">编辑部门</el-dropdown-item>
              <el-dropdown-item v-if="!isRoot" command="del">删除部门</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
import { reqDeleteDept } from '@/api/departments'
export default {
  props: {
    nodeData: {
      type: Object,
      required: true
    },
    isRoot: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCommand(cmd) {
      // console.log(cmd)
      switch (cmd) {
        case 'add':
          this.$emit('add-depts', this.nodeData)
          break
        case 'del':
          this.$confirm('此操作将永久删除该部门，是否继续', '温馨提示').then(async() => {
            // 确认删除
            // console.log('del', this.nodeData.id)
            await reqDeleteDept(this.nodeData.id)
            this.$message.success('删除成功')
            this.$emit('del-depts')
          }).catch(() => {
            // 取消删除
            // console.log('cancel del')
          })
          break
        case 'edit':
          this.$emit('edit-depts', this.nodeData)
          // console.log('edit')
          break
      }
    }
  }
}
</script>

<style>

</style>
