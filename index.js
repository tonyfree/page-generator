
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
        window.eventBus.$on('addTableComponent', (params) => {
          console.log(params)
          document.querySelector('#beforeCache').innerHTML = ''
          this.add(params)
        })
      },
      methods: {
        add: function (params) {
          let last = this.layout[this.layout.length-1]
          // let x = last.x + last.w
          // let y = last.y
          // if ( x + 2 > 12) {
          //   y = last.y + last.h
          // }
          // if (this.selected === 'table') {
            
            // 传递配置数据
            let JSONOptions = JSON.parse(vueOptionsToString(Table.options))
            let TableOptions = vueStringToOptions(JSONOptions, params)

            console.log(this.editing)
            if (this.editing) {
              let index = this.layout.findIndex(item => item.i === this.editID)
              let current = this.layout[index]
              current.options = TableOptions
              current.component = Vue.extend(TableOptions)
              this.editing = false
            } else {
              this.layout.push({
                x: 0,
                y: 6,
                w: 8,
                h: 7,
                i: Mock.Random.uuid(),
                options: TableOptions,
                component: Vue.extend(TableOptions),
                // props: {
                //   apiUrl: Table.apiUrl,
                //   tableOptions: Table.tableOptions
                // }
              })
            }
          // }
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
        editItem: function(i) {
          window.eventBus.$emit('tableEdit', i)
          this.editing = true
          this.editID = i
        },
        layoutUpdatedEvent: function(newLayout){
          console.log("Updated layout: ", newLayout)
        },
        addComponent: function () {
          if (this.selected === 'table') {
            let TableComponent = Table.create()
            let tableDiv = document.createElement('div')
            document.querySelector('#beforeCache').appendChild(tableDiv)
            TableComponent.$mount(tableDiv)
          }
        }
      }
	});