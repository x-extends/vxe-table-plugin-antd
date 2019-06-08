import XEUtils from 'xe-utils'

function matchCascaderData (index, list, values, labels) {
  let val = values[index]
  if (list && values.length > index) {
    XEUtils.each(list, item => {
      if (item.value === val) {
        labels.push(item.label)
        matchCascaderData(++index, item.children, values, labels)
      }
    })
  }
}

function formatDatePicker (defaultFormat) {
  return function (h, { props = {} }, params) {
    let { row, column } = params
    let cellValue = XEUtils.get(row, column.property)
    if (cellValue) {
      cellValue = cellValue.format(props.format || defaultFormat)
    }
    return cellText(h, cellValue)
  }
}

function getEvents (editRender, params) {
  let { name, events } = editRender
  let { $table } = params
  let type = 'change'
  switch (name) {
    case 'AAutoComplete':
      type = 'select'
      break
    case 'AInput':
    case 'AInputNumber':
      type = 'input'
      break
  }
  let on = {
    [type]: () => $table.updateStatus(params)
  }
  if (events) {
    Object.assign(on, XEUtils.objectMap(events, cb => function () {
      cb.apply(null, [params].concat.apply(params, arguments))
    }))
  }
  return on
}

function defaultRender (h, editRender, params) {
  let { $table, row, column } = params
  let { props } = editRender
  if ($table.size) {
    props = Object.assign({ size: $table.size }, props)
  }
  return [
    h(editRender.name, {
      props,
      model: {
        value: XEUtils.get(row, column.property),
        callback (value) {
          XEUtils.set(row, column.property, value)
        }
      },
      on: getEvents(editRender, params)
    })
  ]
}

function cellText (h, cellValue) {
  return ['' + (cellValue === null || cellValue === void 0 ? '' : cellValue)]
}

const renderMap = {
  AAutoComplete: {
    autofocus: 'input.ant-input',
    renderEdit: defaultRender
  },
  AInput: {
    autofocus: 'input.ant-input',
    renderEdit: defaultRender
  },
  AInputNumber: {
    autofocus: 'input.ant-input-number-input',
    renderEdit: defaultRender
  },
  ASelect: {
    renderEdit (h, editRender, params) {
      let { options, optionGroups, props = {}, optionProps = {}, optionGroupProps = {} } = editRender
      let { $table, row, column } = params
      let labelProp = optionProps.label || 'label'
      let valueProp = optionProps.value || 'value'
      if ($table.size) {
        props = XEUtils.assign({ size: $table.size }, props)
      }
      if (optionGroups) {
        let groupOptions = optionGroupProps.options || 'options'
        let groupLabel = optionGroupProps.label || 'label'
        return [
          h('a-select', {
            props,
            model: {
              value: XEUtils.get(row, column.property),
              callback (cellValue) {
                XEUtils.set(row, column.property, cellValue)
              }
            },
            on: getEvents(editRender, params)
          }, XEUtils.map(optionGroups, (group, gIndex) => {
            return h('a-select-opt-group', {
              key: gIndex
            }, [
              h('span', {
                slot: 'label'
              }, group[groupLabel])
            ].concat(
              XEUtils.map(group[groupOptions], (item, index) => {
                return h('a-select-option', {
                  props: {
                    value: item[valueProp]
                  },
                  key: index
                }, item[labelProp])
              })
            ))
          }))
        ]
      }
      return [
        h('a-select', {
          props,
          model: {
            value: XEUtils.get(row, column.property),
            callback (cellValue) {
              XEUtils.set(row, column.property, cellValue)
            }
          },
          on: getEvents(editRender, params)
        }, XEUtils.map(options, (item, index) => {
          return h('a-select-option', {
            props: {
              value: item[valueProp]
            },
            key: index
          }, item[labelProp])
        }))
      ]
    },
    renderCell (h, editRender, params) {
      let { options, optionGroups, props = {}, optionProps = {}, optionGroupProps = {} } = editRender
      let { row, column } = params
      let labelProp = optionProps.label || 'label'
      let valueProp = optionProps.value || 'value'
      let groupOptions = optionGroupProps.options || 'options'
      let cellValue = XEUtils.get(row, column.property)
      if (!(cellValue === null || cellValue === undefined || cellValue === '')) {
        return cellText(h, XEUtils.map(props.mode === 'multiple' ? cellValue : [cellValue], optionGroups ? value => {
          let selectItem
          for (let index = 0; index < optionGroups.length; index++) {
            selectItem = XEUtils.find(optionGroups[index][groupOptions], item => item[valueProp] === value)
            if (selectItem) {
              break
            }
          }
          return selectItem ? selectItem[labelProp] : null
        } : value => {
          let selectItem = XEUtils.find(options, item => item[valueProp] === value)
          return selectItem ? selectItem[labelProp] : null
        }).join(';'))
      }
      return cellText(h, '')
    }
  },
  ACascader: {
    renderEdit: defaultRender,
    renderCell (h, { props = {} }, params) {
      let { row, column } = params
      let cellValue = XEUtils.get(row, column.property)
      var values = cellValue || []
      var labels = []
      matchCascaderData(0, props.options, values, labels)
      return cellText(h, (props.showAllLevels === false ? labels.slice(labels.length - 1, labels.length) : labels).join(` ${props.separator || '/'} `))
    }
  },
  ADatePicker: {
    renderEdit: defaultRender,
    renderCell: formatDatePicker('YYYY-MM-DD')
  },
  AMonthPicker: {
    renderEdit: defaultRender,
    renderCell: formatDatePicker('YYYY-MM')
  },
  ARangePicker: {
    renderEdit: defaultRender,
    renderCell (h, { props = {} }, params) {
      let { row, column } = params
      let cellValue = XEUtils.get(row, column.property)
      if (cellValue) {
        cellValue = cellValue.map(date => date.format(props.format || 'YYYY-MM-DD')).join(' ~ ')
      }
      return cellText(h, cellValue)
    }
  },
  AWeekPicker: {
    renderEdit: defaultRender,
    renderCell: formatDatePicker('YYYY-WW周')
  },
  ATimePicker: {
    renderEdit: defaultRender,
    renderCell: formatDatePicker('HH:mm:ss')
  },
  ARate: {
    renderEdit: defaultRender
  },
  ASwitch: {
    renderEdit: defaultRender
  }
}

function hasClass (elem, cls) {
  return elem && elem.className && elem.className.split && elem.className.split(' ').indexOf(cls) > -1
}

function getEventTargetNode (evnt, container, queryCls) {
  let targetElem
  let target = evnt.target
  while (target && target.nodeType && target !== document) {
    if (queryCls && hasClass(target, queryCls)) {
      targetElem = target
    } else if (target === container) {
      return { flag: queryCls ? !!targetElem : true, container, targetElem: targetElem }
    }
    target = target.parentNode
  }
  return { flag: false }
}

/**
 * 事件兼容性处理
 */
function handleClearActivedEvent (params, evnt) {
  if (
    // 下拉框
    getEventTargetNode(evnt, document.body, 'ant-select-dropdown').flag ||
    // 级联
    getEventTargetNode(evnt, document.body, 'ant-cascader-menus').flag ||
    // 日期
    getEventTargetNode(evnt, document.body, 'ant-calendar-picker-container').flag ||
    // 时间选择
    getEventTargetNode(evnt, document.body, 'ant-time-picker-panel').flag
  ) {
    return false
  }
}

function VXETablePluginAntd () {}

VXETablePluginAntd.install = function ({ interceptor, renderer }) {
  // 添加到渲染器
  renderer.mixin(renderMap)
  // 处理事件冲突
  interceptor.add('event.clear_actived', handleClearActivedEvent)
}

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginAntd)
}

export default VXETablePluginAntd
