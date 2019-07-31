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

function getCellEvents (editRender, params) {
  let { name, events } = editRender
  let { $table } = params
  let type = 'change'
  switch (name) {
    case 'AAutoComplete':
      type = 'select'
      break
    case 'AInput':
      type = 'input'
      break
    case 'AInputNumber':
      type = 'change'
      break
  }
  let on = {
    [type]: () => $table.updateStatus(params)
  }
  if (events) {
    XEUtils.assign(on, XEUtils.objectMap(events, cb => function () {
      cb.apply(null, [params].concat.apply(params, arguments))
    }))
  }
  return on
}

function defaultCellRender (h, editRender, params) {
  let { $table, row, column } = params
  let { props } = editRender
  if ($table.vSize) {
    props = XEUtils.assign({ size: $table.vSize }, props)
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
      on: getCellEvents(editRender, params)
    })
  ]
}

function getFilterEvents (on, filterRender, params) {
  let { events } = filterRender
  if (events) {
    XEUtils.assign(on, XEUtils.objectMap(events, cb => function () {
      cb.apply(null, [params].concat.apply(params, arguments))
    }))
  }
  return on
}

function defaultFilterRender (h, filterRender, params, context) {
  let { $table, column } = params
  let { name, props } = filterRender
  let type = 'input'
  if ($table.vSize) {
    props = XEUtils.assign({ size: $table.vSize }, props)
  }
  switch (name) {
    case 'AAutoComplete':
      type = 'select'
      break
    case 'AInputNumber':
      type = 'change'
      break
  }
  return column.filters.map(item => {
    return h(name, {
      props,
      model: {
        value: item.data,
        callback (optionValue) {
          item.data = optionValue
        }
      },
      on: getFilterEvents({
        [type] () {
          context[column.filterMultiple ? 'changeMultipleOption' : 'changeRadioOption']({}, !!item.data, item)
        }
      }, filterRender, params)
    })
  })
}

function defaultFilterMethod ({ option, row, column }) {
  let { data } = option
  let cellValue = XEUtils.get(row, column.property)
  return cellValue === data
}

function cellText (h, cellValue) {
  return ['' + (cellValue === null || cellValue === void 0 ? '' : cellValue)]
}

/**
 * 渲染函数
 */
const renderMap = {
  AAutoComplete: {
    autofocus: 'input.ant-input',
    renderEdit: defaultCellRender,
    renderFilter: defaultFilterRender,
    filterMethod: defaultFilterMethod
  },
  AInput: {
    autofocus: 'input.ant-input',
    renderEdit: defaultCellRender,
    renderFilter: defaultFilterRender,
    filterMethod: defaultFilterMethod
  },
  AInputNumber: {
    autofocus: 'input.ant-input-number-input',
    renderEdit: defaultCellRender,
    renderFilter: defaultFilterRender,
    filterMethod: defaultFilterMethod
  },
  ASelect: {
    renderEdit (h, editRender, params) {
      let { options, optionGroups, props = {}, optionProps = {}, optionGroupProps = {} } = editRender
      let { $table, row, column } = params
      let labelProp = optionProps.label || 'label'
      let valueProp = optionProps.value || 'value'
      if ($table.vSize) {
        props = XEUtils.assign({ size: $table.vSize }, props)
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
            on: getCellEvents(editRender, params)
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
          on: getCellEvents(editRender, params)
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
    renderEdit: defaultCellRender,
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
    renderEdit: defaultCellRender,
    renderCell: formatDatePicker('YYYY-MM-DD')
  },
  AMonthPicker: {
    renderEdit: defaultCellRender,
    renderCell: formatDatePicker('YYYY-MM')
  },
  ARangePicker: {
    renderEdit: defaultCellRender,
    renderCell (h, { props = {} }, params) {
      let { row, column } = params
      let cellValue = XEUtils.get(row, column.property)
      if (cellValue) {
        cellValue = XEUtils.map(cellValue, date => date.format(props.format || 'YYYY-MM-DD')).join(' ~ ')
      }
      return cellText(h, cellValue)
    }
  },
  AWeekPicker: {
    renderEdit: defaultCellRender,
    renderCell: formatDatePicker('YYYY-WW周')
  },
  ATimePicker: {
    renderEdit: defaultCellRender,
    renderCell: formatDatePicker('HH:mm:ss')
  },
  ATreeSelect: {
    renderEdit: defaultCellRender,
    renderCell (h, { props = {} }, params) {
      let { row, column } = params
      let cellValue = XEUtils.get(row, column.property)
      if (cellValue && (props.treeCheckable || props.multiple)) {
        cellValue = cellValue.join(';')
      }
      return cellText(h, cellValue)
    }
  },
  ARate: {
    renderEdit: defaultCellRender
  },
  ASwitch: {
    renderEdit: defaultCellRender
  }
}

/**
 * 筛选兼容性处理
 */
function handleClearFilterEvent (params, evnt, context) {
  let { getEventTargetNode } = context
  if (
    // 下拉框
    getEventTargetNode(evnt, document.body, 'ant-select-dropdown').flag
  ) {
    return false
  }
}

/**
 * 单元格兼容性处理
 */
function handleClearActivedEvent (params, evnt, context) {
  let { getEventTargetNode } = context
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
  interceptor.add('event.clear_filter', handleClearFilterEvent)
  interceptor.add('event.clear_actived', handleClearActivedEvent)
}

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginAntd)
}

export default VXETablePluginAntd
