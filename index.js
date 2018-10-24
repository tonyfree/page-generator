
  let layout = vueParsingEngine(localStorage.getItem('layout'))
 
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
        editID: ''
      },
      created: function () {
        window.eventBus.$on('createComponent', (params) => {
          document.querySelector('#beforeCache').innerHTML = ''
          this.add(params)
        })
      },
      methods: {
        add: function (params) {
          // 传递配置数据
          let JSONOptions = {}
          let type = this.selected || this.type
          if (type === 'table') {
            JSONOptions = JSON.parse(vueOptionsToString(JTable.options))
          }
          let ComponentOptions = vueStringToOptions(JSONOptions, params)

          console.log(this.editing)

          if (this.editing) {
            let index = this.layout.findIndex(item => item.i === this.editID)
            let current = this.layout[index]
            current.options = ComponentOptions
            current.component = Vue.extend(ComponentOptions)
            this.editing = false
          } else {
            this.layout.push({
              x: 0,
              y: 6,
              w: 8,
              h: 7,
              i: Mock.Random.uuid(),
              type: 'table',
              options: ComponentOptions,
              component: Vue.extend(ComponentOptions)
            })
          }
        },
        savePage: function () {
          let layout = [].concat(this.layout)
          layout.forEach(item => {
            Object.keys(item).forEach(i => {
              if (i === 'options' || i === 'props') {
                item[i] = vueOptionsToString(item[i])
              }
            })
          })
          localStorage.setItem('layout', JSON.stringify(layout))
          this.$message({
            message: '保存页面成功！',
            type: 'success'
          });
        },
        deleteItem: function (i) {
          let index = this.layout.findIndex(item => item.i === i)
          this.layout.splice(index, 1)
        },
        editItem: function(i,type) {
          this.type = type
          this.addComponent()
          window.eventBus.$emit('editComponent', i)
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
          let Dialog = ''
          if (type === 'table') {
            Dialog = new (Vue.extend(JTable.editOptions))()
          }
          Dialog.dialogVisible = true
          let tableDiv = document.createElement('div')
          document.querySelector('#beforeCache').appendChild(tableDiv)
          Dialog.$mount(tableDiv)
        }
      }
	});