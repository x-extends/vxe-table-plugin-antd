import XEUtils from 'xe-utils/methods/xe-utils'
import VXETable from 'vxe-table/lib/vxe-table'

function matchCascaderData (index: number, list: Array<any>, values: Array<any>, labels: Array<any>) {
  let val = values[index]
  if (list && values.length > index) {
    XEUtils.each(list, (item: any) => {
      if (item.value === val) {
        labels.push(item.label)
        matchCascaderData(++index, item.children, values, labels)
      }
    })
  }
}

function formatDatePicker (defaultFormat: any) {
  return function (h: Function, { props = {} }: any, params: any) {
    let { row, column } = params
    let cellValue = XEUtils.get(row, column.property)
    if (cellValue) {
      cellValue = cellValue.format(props.format || defaultFormat)
    }
    return cellText(h, cellValue)
  }
}

function getProps ({ $table }: any, { props }: any, defaultProps?: any) {
  return XEUtils.assign($table.vSize ? { size: $table.vSize } : {}, defaultProps, props)
}

function getCellEvents (renderOpts: any, params: any) {
  let { name, events } = renderOpts
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
    [type]: (evnt: any) => {
      $table.updateStatus(params)
      if (events && events[type]) {
        events[type](params, evnt)
      }
    }
  }
  if (events) {
    return XEUtils.assign({}, XEUtils.objectMap(events, (cb: Function) => function (...args: any[]) {
      cb.apply(null, [params].concat.apply(params, args))
    }), on)
  }
  return on
}

function createEditRender (defaultProps?: any) {
  return function (h: Function, renderOpts: any, params: any) {
    let { row, column } = params
    let { attrs } = renderOpts
    let props = getProps(params, renderOpts, defaultProps)
    return [
      h(renderOpts.name, {
        props,
        attrs,
        model: {
          value: XEUtils.get(row, column.property),
          callback (value: any) {
            XEUtils.set(row, column.property, value)
          }
        },
        on: getCellEvents(renderOpts, params)
      })
    ]
  }
}

function getFilterEvents (on: any, renderOpts: any, params: any, context: any) {
  let { events } = renderOpts
  if (events) {
    return XEUtils.assign({}, XEUtils.objectMap(events, (cb: Function) => function (...args: any[]) {
      params = Object.assign({ context }, params)
      cb.apply(null, [params].concat.apply(params, args))
    }), on)
  }
  return on
}

function createFilterRender (defaultProps?: any) {
  return function (h: Function, renderOpts: any, params: any, context: any) {
    let { column } = params
    let { name, attrs, events } = renderOpts
    let props = getProps(params, renderOpts)
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
    return column.filters.map((item: any) => {
      return h(name, {
        props,
        attrs,
        model: {
          value: item.data,
          callback (optionValue: any) {
            item.data = optionValue
          }
        },
        on: getFilterEvents({
          [type] (evnt: any) {
            handleConfirmFilter(context, column, !!item.data, item)
            if (events && events[type]) {
              events[type](Object.assign({ context }, params), evnt)
            }
          }
        }, renderOpts, params, context)
      })
    })
  }
}

function handleConfirmFilter (context: any, column: any, checked: any, item: any) {
  context[column.filterMultiple ? 'changeMultipleOption' : 'changeRadioOption']({}, checked, item)
}

function defaultFilterMethod ({ option, row, column }: any) {
  let { data } = option
  let cellValue = XEUtils.get(row, column.property)
  /* eslint-disable eqeqeq */
  return cellValue === data
}

function renderOptions (h: Function, options: any, optionProps: any) {
  let labelProp = optionProps.label || 'label'
  let valueProp = optionProps.value || 'value'
  let disabledProp = optionProps.disabled || 'disabled'
  return XEUtils.map(options, (item: any, index: number) => {
    return h('a-select-option', {
      props: {
        value: item[valueProp],
        disabled: item[disabledProp]
      },
      key: index
    }, item[labelProp])
  })
}

function cellText (h: Function, cellValue: any) {
  return ['' + (cellValue === null || cellValue === void 0 ? '' : cellValue)]
}

function createFormItemRender (defaultProps?: any) {
  return function (h: Function, renderOpts: any, params: any, context: any) {
    let { data, field } = params
    let { name } = renderOpts
    let { attrs }: any = renderOpts
    let props: any = getFormProps(context, renderOpts, defaultProps)
    return [
      h(name, {
        attrs,
        props,
        model: {
          value: XEUtils.get(data, field),
          callback (value: any) {
            XEUtils.set(data, field, value)
          }
        },
        on: getFormEvents(renderOpts, params, context)
      })
    ]
  }
}

function getFormProps ({ $form }: any, { props }: any, defaultProps?: any) {
  return XEUtils.assign($form.vSize ? { size: $form.vSize } : {}, defaultProps, props)
}

function getFormEvents (renderOpts: any, params: any, context: any) {
  let { events }: any = renderOpts
  let on
  if (events) {
    on = XEUtils.assign({}, XEUtils.objectMap(events, (cb: Function) => function (...args: any[]) {
      cb.apply(null, [params].concat.apply(params, args))
    }), on)
  }
  return on
}

/**
 * 渲染函数
 */
const renderMap = {
  AAutoComplete: {
    autofocus: 'input.ant-input',
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
    filterMethod: defaultFilterMethod,
    renderItem: createFormItemRender()
  },
  AInput: {
    autofocus: 'input.ant-input',
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
    filterMethod: defaultFilterMethod,
    renderItem: createFormItemRender()
  },
  AInputNumber: {
    autofocus: 'input.ant-input-number-input',
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
    filterMethod: defaultFilterMethod,
    renderItem: createFormItemRender()
  },
  ASelect: {
    renderEdit (h: Function, renderOpts: any, params: any) {
      let { options, optionGroups, optionProps = {}, optionGroupProps = {} } = renderOpts
      let { row, column } = params
      let { attrs } = renderOpts
      let props = getProps(params, renderOpts)
      if (optionGroups) {
        let groupOptions = optionGroupProps.options || 'options'
        let groupLabel = optionGroupProps.label || 'label'
        return [
          h('a-select', {
            props,
            attrs,
            model: {
              value: XEUtils.get(row, column.property),
              callback (cellValue: any) {
                XEUtils.set(row, column.property, cellValue)
              }
            },
            on: getCellEvents(renderOpts, params)
          }, XEUtils.map(optionGroups, (group: any, gIndex: number) => {
            return h('a-select-opt-group', {
              key: gIndex
            }, [
              h('span', {
                slot: 'label'
              }, group[groupLabel])
            ].concat(
              renderOptions(h, group[groupOptions], optionProps)
            ))
          }))
        ]
      }
      return [
        h('a-select', {
          props,
          attrs,
          model: {
            value: XEUtils.get(row, column.property),
            callback (cellValue: any) {
              XEUtils.set(row, column.property, cellValue)
            }
          },
          on: getCellEvents(renderOpts, params)
        }, renderOptions(h, options, optionProps))
      ]
    },
    renderCell (h: Function, renderOpts: any, params: any) {
      let { options, optionGroups, props = {}, optionProps = {}, optionGroupProps = {} } = renderOpts
      let { row, column } = params
      let labelProp = optionProps.label || 'label'
      let valueProp = optionProps.value || 'value'
      let groupOptions = optionGroupProps.options || 'options'
      let cellValue = XEUtils.get(row, column.property)
      if (!(cellValue === null || cellValue === undefined || cellValue === '')) {
        return cellText(h, XEUtils.map(props.mode === 'multiple' ? cellValue : [cellValue], optionGroups ? (value: any) => {
          let selectItem
          for (let index = 0; index < optionGroups.length; index++) {
            selectItem = XEUtils.find(optionGroups[index][groupOptions], (item: any) => item[valueProp] === value)
            if (selectItem) {
              break
            }
          }
          return selectItem ? selectItem[labelProp] : value
        } : (value: any) => {
          let selectItem = XEUtils.find(options, (item: any) => item[valueProp] === value)
          return selectItem ? selectItem[labelProp] : value
        }).join(';'))
      }
      return cellText(h, '')
    },
    renderFilter (h: Function, renderOpts: any, params: any, context: any) {
      let { options, optionGroups, optionProps = {}, optionGroupProps = {} } = renderOpts
      let { column } = params
      let { attrs, events } = renderOpts
      let props = getProps(params, renderOpts)
      let type = 'change'
      if (optionGroups) {
        let groupOptions = optionGroupProps.options || 'options'
        let groupLabel = optionGroupProps.label || 'label'
        return column.filters.map((item: any) => {
          return h('a-select', {
            props,
            attrs,
            model: {
              value: item.data,
              callback (optionValue: any) {
                item.data = optionValue
              }
            },
            on: getFilterEvents({
              [type] (value: any) {
                handleConfirmFilter(context, column, value && value.length > 0, item)
                if (events && events[type]) {
                  events[type](Object.assign({ context }, params), value)
                }
              }
            }, renderOpts, params, context)
          }, XEUtils.map(optionGroups, (group: any, gIndex: number) => {
            return h('a-select-opt-group', {
              key: gIndex
            }, [
              h('span', {
                slot: 'label'
              }, group[groupLabel])
            ].concat(
              renderOptions(h, group[groupOptions], optionProps)
            ))
          }))
        })
      }
      return column.filters.map((item: any) => {
        return h('a-select', {
          props,
          attrs,
          model: {
            value: item.data,
            callback (optionValue: any) {
              item.data = optionValue
            }
          },
          on: getFilterEvents({
            change (value: any) {
              handleConfirmFilter(context, column, value && value.length > 0, item)
              if (events && events[type]) {
                events[type](Object.assign({ context }, params), value)
              }
            }
          }, renderOpts, params, context)
        }, renderOptions(h, options, optionProps))
      })
    },
    filterMethod ({ option, row, column }: any) {
      let { data } = option
      let { property, filterRender: renderOpts } = column
      let { props = {} } = renderOpts
      let cellValue = XEUtils.get(row, property)
      if (props.mode === 'multiple') {
        if (XEUtils.isArray(cellValue)) {
          return XEUtils.includeArrays(cellValue, data)
        }
        return data.indexOf(cellValue) > -1
      }
      /* eslint-disable eqeqeq */
      return cellValue == data
    },
    renderItem (h: Function, renderOpts: any, params: any, context: any) {
      let { options, optionGroups, optionProps = {}, optionGroupProps = {} } = renderOpts
      let { data, property } = params
      let { attrs } = renderOpts
      let props: any = getFormProps(context, renderOpts)
      if (optionGroups) {
        let groupOptions: string = optionGroupProps.options || 'options'
        let groupLabel: string = optionGroupProps.label || 'label'
        return [
          h('a-select', {
            props,
            attrs,
            model: {
              value: XEUtils.get(data, property),
              callback (cellValue: any) {
                XEUtils.set(data, property, cellValue)
              }
            },
            on: getFormEvents(renderOpts, params, context)
          }, XEUtils.map(optionGroups, (group: any, gIndex: number) => {
            return h('a-select-opt-group', {
              key: gIndex
            }, [
              h('span', {
                slot: 'label'
              }, group[groupLabel])
            ].concat(
              renderOptions(h, group[groupOptions], optionProps)
            ))
          }))
        ]
      }
      return [
        h('a-select', {
          props,
          attrs,
          model: {
            value: XEUtils.get(data, property),
            callback (cellValue: any) {
              XEUtils.set(data, property, cellValue)
            }
          },
          on: getFormEvents(renderOpts, params, context)
        }, renderOptions(h, options, optionProps))
      ]
    }
  },
  ACascader: {
    renderEdit: createEditRender(),
    renderCell (h: Function, { props = {} }: any, params: any) {
      let { row, column } = params
      let cellValue = XEUtils.get(row, column.property)
      var values = cellValue || []
      var labels: Array<any> = []
      matchCascaderData(0, props.options, values, labels)
      return cellText(h, (props.showAllLevels === false ? labels.slice(labels.length - 1, labels.length) : labels).join(` ${props.separator || '/'} `))
    },
    renderItem: createFormItemRender()
  },
  ADatePicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-MM-DD'),
    renderItem: createFormItemRender()
  },
  AMonthPicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-MM'),
    renderItem: createFormItemRender()
  },
  ARangePicker: {
    renderEdit: createEditRender(),
    renderCell (h: Function, { props = {} }: any, params: any) {
      let { row, column } = params
      let cellValue = XEUtils.get(row, column.property)
      if (cellValue) {
        cellValue = XEUtils.map(cellValue, (date: any) => date.format(props.format || 'YYYY-MM-DD')).join(' ~ ')
      }
      return cellText(h, cellValue)
    },
    renderItem: createFormItemRender()
  },
  AWeekPicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-WW周'),
    renderItem: createFormItemRender()
  },
  ATimePicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('HH:mm:ss'),
    renderItem: createFormItemRender()
  },
  ATreeSelect: {
    renderEdit: createEditRender(),
    renderCell (h: Function, { props = {} }: any, params: any) {
      let { row, column } = params
      let cellValue = XEUtils.get(row, column.property)
      if (cellValue && (props.treeCheckable || props.multiple)) {
        cellValue = cellValue.join(';')
      }
      return cellText(h, cellValue)
    },
    renderItem: createFormItemRender()
  },
  ARate: {
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
    filterMethod: defaultFilterMethod,
    renderItem: createFormItemRender()
  },
  ASwitch: {
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
    filterMethod: defaultFilterMethod,
    renderItem: createFormItemRender()
  }
}

/**
 * 事件兼容性处理
 */
function handleClearEvent (params: any, evnt: any, context: any) {
  let { getEventTargetNode } = context
  let bodyElem = document.body
  if (
    // 下拉框
    getEventTargetNode(evnt, bodyElem, 'ant-select-dropdown').flag ||
    // 级联
    getEventTargetNode(evnt, bodyElem, 'ant-cascader-menus').flag ||
    // 日期
    getEventTargetNode(evnt, bodyElem, 'ant-calendar-picker-container').flag ||
    // 时间选择
    getEventTargetNode(evnt, bodyElem, 'ant-time-picker-panel').flag
  ) {
    return false
  }
}

/**
 * 基于 vxe-table 表格的适配插件，用于兼容 ant-design-vue 组件库
 */
export const VXETablePluginAntd = {
  install (xtable: typeof VXETable) {
    let { interceptor, renderer } = xtable
    renderer.mixin(renderMap)
    interceptor.add('event.clearFilter', handleClearEvent)
    interceptor.add('event.clearActived', handleClearEvent)
  }
}

function toMomentString (cellValue: any, format: string): string {
  return cellValue ? cellValue.format(format) : ''
}

declare module 'xe-utils/methods/xe-utils' {
  interface XEUtilsMethods {
    /**
     * 将 Moment 日期格式化为字符串
     * @param cellValue 值
     * @param format 格式化
     */
    toMomentString: typeof toMomentString;
  }
}

XEUtils.mixin({
  toMomentString
})

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginAntd)
}

export default VXETablePluginAntd
