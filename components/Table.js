Vue.component('k-table', {
  template: ''+
    '<el-table :data="tableData" style="width: 100%">'+
      '<el-table-column v-for="col in params.tableOptions" :prop="col.field" :label="col.title" fixed>'+
      '</el-table-column>' +
    '</el-table>',
  props: ['params'],
  created: function () {
    this.getData()
  },
  data: function() {
    return {
      tableData: []
    }
  },
  methods: {
    getData: function () {
      axios.post(this.params.apiUrl).then(res => {
        this.tableData = res.data.lists
      })
    }
  },
  watch: {
    'params.apiUrl': function () {
      this.getData()
    }
  }
})

Vue.component('k-table-dialog', {
  template: '' +
    '<el-dialog title="配置参数" :visible.sync="dialogVisible" width="40%">'+
      '<el-form style="max-height: 300px;overflow-y: auto;">'+
        '<el-row v-for="option in tableOptions">'+
          '<el-col :span="12">'+
            '<el-form-item label="表头列名" label-width="80px">'+
              '<el-input v-model="option.title"></el-input>'+
            '</el-form-item>'+
          '</el-col>'+
          '<el-col :span="12">'+
            '<el-form-item label="对应字段" label-width="80px">'+
                '<el-input v-model="option.field"></el-input>'+
            '</el-form-item>'+
          '</el-col>'+
        '</el-row>'+
        '<el-form-item>'+
          '<el-button type="primary" @click="addRow">增加列</el-button>'+
        '</el-form-item>'+
      '</el-form>'+
      '<el-form>'+
        '<el-form-item label="接口配置">'+
          '<el-input v-model="apiUrl"></el-input>'+
        '</el-form-item>'+
      '</el-form>'+
      '<el-form>'+
        '<el-form-item label="使用mock">'+
          '<el-switch v-model="useMock"></el-switch>'+
        '</el-form-item>'+
      '</el-form>'+
      '<span slot="footer" class="dialog-footer">'+
        '<el-button @click="dialogVisible = false">取 消</el-button>'+
        '<el-button type="primary" @click="add">确 定</el-button>'+
      '</span>'+
    '</el-dialog>',
  props: ['params'],
  data: function () {
    return {
      tableOptions: [{title:'设备名称',field:'name'},{title:'设备型号',field:'type'},{title:'设备价格',field:'price'}],
      apiUrl: 'http://rap2api.taobao.org/app/mock/95259/equipment/list',
      dialogVisible: false,
      useMock: false
    }
  },
  created: function () {
    this.setData()
  },
  methods: {
    setData: function () {
      if (this.params.apiUrl) {
        this.apiUrl = this.params.apiUrl
      }
      if (this.params.tableOptions) {
        this.tableOptions = this.params.tableOptions
      }
      if (this.params.dialogVisible) {
        this.dialogVisible = this.params.dialogVisible
      }
    },
    addRow: function () {
      this.tableOptions.push({
        title: '',
        field: ''
      })
    },
    add: function () {
      // 校验
      if (!this.useMock && !this.apiUrl) {
        this.$message.error('请填写接口或使用mock');
        return false
      }
      // 传递消息给父组件
      this.$emit('update', {apiUrl:this.apiUrl,tableOptions:this.tableOptions})
      this.dialogVisible = false
    }
  },
  watch: {
    params: {
      deep: true,
      handler: function () {
        this.setData()
      }
    }
  }
})
