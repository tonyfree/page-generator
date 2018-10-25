
  let localData = JSON.parse(localStorage.getItem('layout'))
  let layout = localData ? localData : []

	new Vue({
	    el: '#app',
	    data: {
        layout: layout,
        selectOptions: [{
          value: 'table',
          label: '表格'
        },{
          value: 'line',
          label: '线图'
        }],
        selected: '',
        editing: false,
        editID: '',
        currentDialog: null,
        currentParams: {},
        showDialog: false
      },
      created: function () {

      },
      methods: {
        add: function (params) {
          let type = this.selected || this.type
          if (this.editing) {
            let index = this.layout.findIndex(item => item.i === this.editID)
            let current = this.layout[index]
            current.params = JSON.parse(JSON.stringify(params))
            this.editing = false
          } else {
            this.layout.push({
              x: 0,
              y: 6,
              w: 8,
              h: 7,
              i: Mock.Random.uuid(),
              type: type,
              params: JSON.parse(JSON.stringify(params)),
              component: 'k-'+type
            })
          }
          this.currentDialog = null
          this.currentParams = {}
        },
        savePage: function () {
          localStorage.setItem('layout', JSON.stringify(this.layout))
          this.$message({
            message: '保存页面成功！',
            type: 'success'
          });
        },
        deleteItem: function (i) {
          let index = this.layout.findIndex(item => item.i === i)
          this.layout.splice(index, 1)
        },
        editItem: function(i,type,params) {
          this.type = type
          this.currentDialog = 'k-'+type+'-dialog'
          this.showDialog = true
          this.currentParams = JSON.parse(JSON.stringify(params))
          this.editing = true
          this.editID = i
        },
        layoutUpdatedEvent: function(newLayout){
          console.log("Updated layout: ", newLayout)
        },
        addComponent: function () {
          let type = this.selected || this.type
          if (!type) {
            this.$notify.error({
              title: '提示',
              message: '请选择要添加的组件'
            })
            return false
          }
          this.currentDialog = 'k-'+type+'-dialog'
          this.showDialog = true
        }
      }
	});