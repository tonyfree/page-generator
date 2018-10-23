let vueOptions = ['data', 'methods', 'template', 'created']

function vueOptionsToString (options) {
  Object.keys(options).forEach(key => {
    let value = options[key]
    if (typeof value === 'object') {
      options[key] = vueOptionsToString(value)
    }
    if (typeof value === 'function') {
      options[key] = value.toString()
    }
  })
  return JSON.stringify(options)
}


function vueStringToOptions (options, params) {
  let newOptions = {}
  Object.keys(options).forEach(key => {
    let value = options[key]
    if (value.startsWith('function')) {
      if (key === 'data' && params) {
        let data = eval('('+value+')')
        let dataObj = data()
        Object.keys(params).forEach(key => {
          dataObj[key] = params[key]
        })
        value = 'function(){return'+JSON.stringify(dataObj)+'}'


        // Object.keys(newProps).forEach(propKey => {

        //   let propValue = newProps[propKey]
        //   let newPropValue = propValue
        //   console.log(newPropValue)
          
          // if (propValue.startsWith('[')) {
          //   newPropValue = []
          //   JSON.parse(propValue).forEach(npvItem => {
          //     newPropValue.push(JSON.parse(npvItem))
          //   })
          // }
          // let index = value.indexOf(propKey) + propKey.length
          // value = value.substring(0,index)+ ':' + JSON.stringify(newPropValue) + ',' + value.substring(index+1)
        // })
      }
      newOptions[key] = eval('('+value+')')
    }
    if (key === 'template') {
      newOptions[key] = value
    }
    if (key === 'methods') {
      let methods = {}
      let mehtodsParse = JSON.parse(value)
      Object.keys(mehtodsParse).forEach(key => {
        methods[key] = eval('('+mehtodsParse[key]+')')
      })
      newOptions.methods = methods
    }
  })
  return newOptions
}

function vueParsingEngine (stringSource) {
  let layout = JSON.parse(stringSource)
  if (!layout) {
    layout = []
  } else {
    layout.forEach((item,index) => {
      let newOptions = vueStringToOptions(JSON.parse(item.options))
      let omitOptions = {}
      Object.keys(newOptions).forEach(key => {
        omitOptions[key] = newOptions[key]
      })
      item.component = Vue.extend(omitOptions)
      item.options = newOptions
      // item.props = ''
    })
  }
  return layout
}



window.eventBus = new Vue()