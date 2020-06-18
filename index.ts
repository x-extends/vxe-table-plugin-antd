/* eslint-disable no-unused-vars */
import { CreateElement } from 'vue'
import XEUtils from 'xe-utils/methods/xe-utils'
import {
  VXETable,
  RenderParams,
  OptionProps,
  RenderOptions,
  InterceptorParams,
  TableRenderParams,
  ColumnFilterParams,
  ColumnFilterRenderOptions,
  ColumnCellRenderOptions,
  ColumnEditRenderOptions,
  FormItemRenderOptions,
  ColumnCellRenderParams,
  ColumnEditRenderParams,
  ColumnFilterRenderParams,
  ColumnFilterMethodParams,
  ColumnExportCellRenderParams,
  FormItemRenderParams
} from 'vxe-table/lib/vxe-table'
/* eslint-enable no-unused-vars */

function isEmptyValue (cellValue: any) {
  return cellValue === null || cellValue === undefined || cellValue === ''
}

function getModelProp (renderOpts: RenderOptions) {
  let prop = 'value'
  switch (renderOpts.name) {
    case 'ASwitch':
      prop = 'checked'
      break
  }
  return prop
}

function getModelEvent (renderOpts: RenderOptions) {
  let type = 'change'
  switch (renderOpts.name) {
    case 'AInput':
      type = 'change.value'
      break
    case 'ARadio':
    case 'ACheckbox':
      type = 'input'
      break
  }
  return type
}

function getChangeEvent (renderOpts: RenderOptions) {
  return 'change'
}

function getCellEditFilterProps (renderOpts: RenderOptions, params: TableRenderParams, value: any, defaultProps?: { [prop: string]: any }) {
  const { vSize } = params.$table
  return XEUtils.assign(vSize ? { size: vSize } : {}, defaultProps, renderOpts.props, { [getModelProp(renderOpts)]: value })
}

function getItemProps (renderOpts: RenderOptions, params: FormItemRenderParams, value: any, defaultProps?: { [prop: string]: any }) {
  const { vSize } = params.$form
  return XEUtils.assign(vSize ? { size: vSize } : {}, defaultProps, renderOpts.props, { [getModelProp(renderOpts)]: value })
}

function getNativeOns (renderOpts: RenderOptions, params: RenderParams) {
  const { nativeEvents } = renderOpts
  const nativeOns: { [type: string]: Function } = {}
  XEUtils.objectEach(nativeEvents, (func: Function, key: string) => {
    nativeOns[key] = function (...args: any[]) {
      func(params, ...args)
    }
  })
  return nativeOns
}

function getOns (renderOpts: RenderOptions, params: RenderParams, inputFunc?: Function, changeFunc?: Function) {
  const { events } = renderOpts
  const modelEvent = getModelEvent(renderOpts)
  const changeEvent = getChangeEvent(renderOpts)
  const isSameEvent = changeEvent === modelEvent
  const ons: { [type: string]: Function } = {}
  XEUtils.objectEach(events, (func: Function, key: string) => {
    ons[key] = function (...args: any[]) {
      func(params, ...args)
    }
  })
  if (inputFunc) {
    ons[modelEvent] = function (targetEvnt: any) {
      inputFunc(targetEvnt)
      if (events && events[modelEvent]) {
        events[modelEvent](params, targetEvnt)
      }
      if (isSameEvent && changeFunc) {
        changeFunc(targetEvnt)
      }
    }
  }
  if (!isSameEvent && changeFunc) {
    ons[changeEvent] = function (...args: any[]) {
      changeFunc(...args)
      if (events && events[changeEvent]) {
        events[changeEvent](params, ...args)
      }
    }
  }
  return ons
}

function getEditOns (renderOpts: RenderOptions, params: ColumnEditRenderParams) {
  const { $table, row, column } = params
  return getOns(renderOpts, params, (value: any) => {
    // 处理 model 值双向绑定
    XEUtils.set(row, column.property, value)
  }, () => {
    // 处理 change 事件相关逻辑
    $table.updateStatus(params)
  })
}

function getFilterOns (renderOpts: RenderOptions, params: ColumnFilterRenderParams, option: ColumnFilterParams, changeFunc: Function) {
  return getOns(renderOpts, params, (value: any) => {
    // 处理 model 值双向绑定
    option.data = value
  }, changeFunc)
}

function getItemOns (renderOpts: RenderOptions, params: FormItemRenderParams) {
  const { $form, data, property } = params
  return getOns(renderOpts, params, (value: any) => {
    // 处理 model 值双向绑定
    XEUtils.set(data, property, value)
  }, () => {
    // 处理 change 事件相关逻辑
    $form.updateStatus(params)
  })
}

function matchCascaderData (index: number, list: any[], values: any[], labels: any[]) {
  const val = values[index]
  if (list && values.length > index) {
    XEUtils.each(list, (item) => {
      if (item.value === val) {
        labels.push(item.label)
        matchCascaderData(++index, item.children, values, labels)
      }
    })
  }
}

function formatDatePicker (defaultFormat: string) {
  return function (h: CreateElement, renderOpts: ColumnCellRenderOptions, params: ColumnCellRenderParams) {
    return cellText(h, getDatePickerCellValue(renderOpts, params, defaultFormat))
  }
}

function getSelectCellValue (renderOpts: ColumnCellRenderOptions, params: ColumnCellRenderParams) {
  const { options = [], optionGroups, props = {}, optionProps = {}, optionGroupProps = {} } = renderOpts
  const { row, column } = params
  const labelProp = optionProps.label || 'label'
  const valueProp = optionProps.value || 'value'
  const groupOptions = optionGroupProps.options || 'options'
  const cellValue = XEUtils.get(row, column.property)
  if (!isEmptyValue(cellValue)) {
    return XEUtils.map(props.mode === 'multiple' ? cellValue : [cellValue], optionGroups ? (value) => {
      let selectItem
      for (let index = 0; index < optionGroups.length; index++) {
        selectItem = XEUtils.find(optionGroups[index][groupOptions], (item) => item[valueProp] === value)
        if (selectItem) {
          break
        }
      }
      return selectItem ? selectItem[labelProp] : value
    } : (value) => {
      const selectItem = XEUtils.find(options, (item) => item[valueProp] === value)
      return selectItem ? selectItem[labelProp] : value
    }).join(', ')
  }
  return null
}

function getCascaderCellValue (renderOpts: RenderOptions, params: ColumnCellRenderParams) {
  const { props = {} } = renderOpts
  const { row, column } = params
  const cellValue = XEUtils.get(row, column.property)
  var values = cellValue || []
  var labels: Array<any> = []
  matchCascaderData(0, props.options, values, labels)
  return (props.showAllLevels === false ? labels.slice(labels.length - 1, labels.length) : labels).join(` ${props.separator || '/'} `)
}

function getRangePickerCellValue (renderOpts: RenderOptions, params: ColumnCellRenderParams) {
  const { props = {} } = renderOpts
  const { row, column } = params
  let cellValue = XEUtils.get(row, column.property)
  if (cellValue) {
    cellValue = XEUtils.map(cellValue, (date) => date.format(props.format || 'YYYY-MM-DD')).join(' ~ ')
  }
  return cellValue
}

function getTreeSelectCellValue (renderOpts: RenderOptions, params: ColumnCellRenderParams) {
  const { props = {} } = renderOpts
  const { treeData, treeCheckable } = props
  const { row, column } = params
  let cellValue = XEUtils.get(row, column.property)
  if (!isEmptyValue(cellValue)) {
    return XEUtils.map(treeCheckable ? cellValue : [cellValue], (value) => {
      const matchObj = XEUtils.findTree(treeData, (item) => item.value === value, { children: 'children' })
      return matchObj ? matchObj.item.title : value
    }).join(', ')
  }
  return cellValue
}

function getDatePickerCellValue (renderOpts: RenderOptions, params: ColumnCellRenderParams | ColumnExportCellRenderParams, defaultFormat: string) {
  const { props = {} } = renderOpts
  const { row, column } = params
  let cellValue = XEUtils.get(row, column.property)
  if (cellValue) {
    cellValue = cellValue.format(props.format || defaultFormat)
  }
  return cellValue
}

function createEditRender (defaultProps?: { [key: string]: any }) {
  return function (h: CreateElement, renderOpts: ColumnEditRenderOptions, params: ColumnEditRenderParams) {
    const { row, column } = params
    const { attrs } = renderOpts
    const cellValue = XEUtils.get(row, column.property)
    return [
      h(renderOpts.name, {
        attrs,
        props: getCellEditFilterProps(renderOpts, params, cellValue, defaultProps),
        on: getEditOns(renderOpts, params),
        nativeOn: getNativeOns(renderOpts, params)
      })
    ]
  }
}

function defaultButtonEditRender (h: CreateElement, renderOpts: ColumnEditRenderOptions, params: ColumnEditRenderParams) {
  const { attrs } = renderOpts
  return [
    h('a-button', {
      attrs,
      props: getCellEditFilterProps(renderOpts, params, null),
      on: getOns(renderOpts, params),
      nativeOn: getNativeOns(renderOpts, params)
    }, cellText(h, renderOpts.content))
  ]
}

function defaultButtonsEditRender (h: CreateElement, renderOpts: ColumnEditRenderOptions, params: ColumnEditRenderParams) {
  return renderOpts.children.map((childRenderOpts: ColumnEditRenderOptions) => defaultButtonEditRender(h, childRenderOpts, params)[0])
}

function createFilterRender (defaultProps?: { [key: string]: any }) {
  return function (h: CreateElement, renderOpts: ColumnFilterRenderOptions, params: ColumnFilterRenderParams) {
    const { column } = params
    const { name, attrs } = renderOpts
    return [
      h('div', {
        class: 'vxe-table--filter-iview-wrapper'
      }, column.filters.map((option, oIndex) => {
        const optionValue = option.data
        return h(name, {
          key: oIndex,
          attrs,
          props: getCellEditFilterProps(renderOpts, params, optionValue, defaultProps),
          on: getFilterOns(renderOpts, params, option, () => {
            // 处理 change 事件相关逻辑
            handleConfirmFilter(params, !!option.data, option)
          }),
          nativeOn: getNativeOns(renderOpts, params)
        })
      }))
    ]
  }
}

function handleConfirmFilter (params: ColumnFilterRenderParams, checked: boolean, option: ColumnFilterParams) {
  const { $panel } = params
  $panel.changeOption({}, checked, option)
}

function defaultFilterMethod (params: ColumnFilterMethodParams) {
  const { option, row, column } = params
  const { data } = option
  const cellValue = XEUtils.get(row, column.property)
  /* eslint-disable eqeqeq */
  return cellValue === data
}

function renderOptions (h: CreateElement, options: any[], optionProps: OptionProps) {
  const labelProp = optionProps.label || 'label'
  const valueProp = optionProps.value || 'value'
  const disabledProp = optionProps.disabled || 'disabled'
  return XEUtils.map(options, (item, oIndex) => {
    return h('a-select-option', {
      key: oIndex,
      props: {
        value: item[valueProp],
        disabled: item[disabledProp]
      }
    }, item[labelProp])
  })
}

function cellText (h: CreateElement, cellValue: any) {
  return ['' + (isEmptyValue(cellValue) ? '' : cellValue)]
}

function createFormItemRender (defaultProps?: { [key: string]: any }) {
  return function (h: CreateElement, renderOpts: FormItemRenderOptions, params: FormItemRenderParams) {
    const { data, property } = params
    const { name } = renderOpts
    const { attrs } = renderOpts
    const itemValue = XEUtils.get(data, property)
    return [
      h(name, {
        attrs,
        props: getItemProps(renderOpts, params, itemValue, defaultProps),
        on: getItemOns(renderOpts, params),
        nativeOn: getNativeOns(renderOpts, params)
      })
    ]
  }
}

function defaultButtonItemRender (h: CreateElement, renderOpts: FormItemRenderOptions, params: FormItemRenderParams) {
  const { attrs } = renderOpts
  const props = getItemProps(renderOpts, params, null)
  return [
    h('a-button', {
      attrs,
      props,
      on: getOns(renderOpts, params),
      nativeOn: getNativeOns(renderOpts, params)
    }, cellText(h, renderOpts.content || props.content))
  ]
}

function defaultButtonsItemRender (h: CreateElement, renderOpts: FormItemRenderOptions, params: FormItemRenderParams) {
  return renderOpts.children.map((childRenderOpts: FormItemRenderOptions) => defaultButtonItemRender(h, childRenderOpts, params)[0])
}

function createDatePickerExportMethod (defaultFormat: string, isEdit?: boolean) {
  const renderProperty = isEdit ? 'editRender' : 'cellRender'
  return function (params: ColumnExportCellRenderParams) {
    return getDatePickerCellValue(params.column[renderProperty], params, defaultFormat)
  }
}

function createExportMethod (valueMethod: Function, isEdit?: boolean) {
  const renderProperty = isEdit ? 'editRender' : 'cellRender'
  return function (params: ColumnExportCellRenderParams) {
    return valueMethod(params.column[renderProperty], params)
  }
}

function createFormItemRadioAndCheckboxRender () {
  return function (h: CreateElement, renderOpts: FormItemRenderOptions, params: FormItemRenderParams) {
    const { name, options = [], optionProps = {} } = renderOpts
    const { data, property } = params
    const { attrs } = renderOpts
    const labelProp = optionProps.label || 'label'
    const valueProp = optionProps.value || 'value'
    const disabledProp = optionProps.disabled || 'disabled'
    const itemValue = XEUtils.get(data, property)
    return [
      h(`${name}Group`, {
        attrs,
        props: getItemProps(renderOpts, params, itemValue),
        on: getItemOns(renderOpts, params),
        nativeOn: getNativeOns(renderOpts, params)
      }, options.map((option, oIndex) => {
        return h(name, {
          key: oIndex,
          props: {
            value: option[valueProp],
            disabled: option[disabledProp]
          }
        }, option[labelProp])
      }))
    ]
  }
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
    renderEdit (h: CreateElement, renderOpts: ColumnEditRenderOptions, params: ColumnEditRenderParams) {
      const { options = [], optionGroups, optionProps = {}, optionGroupProps = {} } = renderOpts
      const { row, column } = params
      const { attrs } = renderOpts
      const cellValue = XEUtils.get(row, column.property)
      const props = getCellEditFilterProps(renderOpts, params, cellValue)
      const on = getEditOns(renderOpts, params)
      const nativeOn = getNativeOns(renderOpts, params)
      if (optionGroups) {
        const groupOptions = optionGroupProps.options || 'options'
        const groupLabel = optionGroupProps.label || 'label'
        return [
          h('a-select', {
            props,
            attrs,
            on,
            nativeOn
          }, XEUtils.map(optionGroups, (group, gIndex) => {
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
          on,
          nativeOn
        }, renderOptions(h, options, optionProps))
      ]
    },
    renderCell (h: CreateElement, renderOpts: ColumnCellRenderOptions, params: ColumnCellRenderParams) {
      return cellText(h, getSelectCellValue(renderOpts, params))
    },
    renderFilter (h: CreateElement, renderOpts: ColumnFilterRenderOptions, params: ColumnFilterRenderParams) {
      const { options = [], optionGroups, optionProps = {}, optionGroupProps = {} } = renderOpts
      const groupOptions = optionGroupProps.options || 'options'
      const groupLabel = optionGroupProps.label || 'label'
      const { column } = params
      const { attrs } = renderOpts
      const nativeOn = getNativeOns(renderOpts, params)
      return [
        h('div', {
          class: 'vxe-table--filter-iview-wrapper'
        }, optionGroups
          ? column.filters.map((option, oIndex) => {
            const optionValue = option.data
            const props = getCellEditFilterProps(renderOpts, params, optionValue)
            return h('a-select', {
              key: oIndex,
              attrs,
              props,
              on: getFilterOns(renderOpts, params, option, () => {
                // 处理 change 事件相关逻辑
                handleConfirmFilter(params, props.mode === 'multiple' ? (option.data && option.data.length > 0) : !XEUtils.eqNull(option.data), option)
              }),
              nativeOn
            }, XEUtils.map(optionGroups, (group, gIndex) => {
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
          : column.filters.map((option, oIndex) => {
            const optionValue = option.data
            const props = getCellEditFilterProps(renderOpts, params, optionValue)
            return h('a-select', {
              key: oIndex,
              attrs,
              props,
              on: getFilterOns(renderOpts, params, option, () => {
                // 处理 change 事件相关逻辑
                handleConfirmFilter(params, props.mode === 'multiple' ? (option.data && option.data.length > 0) : !XEUtils.eqNull(option.data), option)
              }),
              nativeOn
            }, renderOptions(h, options, optionProps))
          }))
      ]
    },
    filterMethod (params: ColumnFilterMethodParams) {
      const { option, row, column } = params
      const { data } = option
      const { property, filterRender: renderOpts } = column
      const { props = {} } = renderOpts
      const cellValue = XEUtils.get(row, property)
      if (props.mode === 'multiple') {
        if (XEUtils.isArray(cellValue)) {
          return XEUtils.includeArrays(cellValue, data)
        }
        return data.indexOf(cellValue) > -1
      }
      /* eslint-disable eqeqeq */
      return cellValue == data
    },
    renderItem (h: CreateElement, renderOpts: FormItemRenderOptions, params: FormItemRenderParams) {
      const { options = [], optionGroups, optionProps = {}, optionGroupProps = {} } = renderOpts
      const { data, property } = params
      const { attrs } = renderOpts
      const itemValue = XEUtils.get(data, property)
      const props = getItemProps(renderOpts, params, itemValue)
      const on = getItemOns(renderOpts, params)
      const nativeOn = getNativeOns(renderOpts, params)
      if (optionGroups) {
        const groupOptions = optionGroupProps.options || 'options'
        const groupLabel = optionGroupProps.label || 'label'
        return [
          h('a-select', {
            attrs,
            props,
            on,
            nativeOn
          }, XEUtils.map(optionGroups, (group, gIndex) => {
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
          attrs,
          props,
          on,
          nativeOn
        }, renderOptions(h, options, optionProps))
      ]
    },
    cellExportMethod: createExportMethod(getSelectCellValue),
    editCellExportMethod: createExportMethod(getSelectCellValue, true)
  },
  ACascader: {
    renderEdit: createEditRender(),
    renderCell (h: CreateElement, renderOpts: ColumnCellRenderOptions, params: ColumnEditRenderParams) {
      return cellText(h, getCascaderCellValue(renderOpts, params))
    },
    renderItem: createFormItemRender(),
    cellExportMethod: createExportMethod(getCascaderCellValue),
    editCellExportMethod: createExportMethod(getCascaderCellValue, true)
  },
  ADatePicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-MM-DD'),
    renderItem: createFormItemRender(),
    cellExportMethod: createDatePickerExportMethod('YYYY-MM-DD'),
    editCellExportMethod: createDatePickerExportMethod('YYYY-MM-DD', true)
  },
  AMonthPicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-MM'),
    renderItem: createFormItemRender(),
    cellExportMethod: createDatePickerExportMethod('YYYY-MM'),
    editCellExportMethod: createDatePickerExportMethod('YYYY-MM', true)
  },
  ARangePicker: {
    renderEdit: createEditRender(),
    renderCell (h: CreateElement, renderOpts: ColumnCellRenderOptions, params: ColumnEditRenderParams) {
      return cellText(h, getRangePickerCellValue(renderOpts, params))
    },
    renderItem: createFormItemRender(),
    cellExportMethod: createExportMethod(getRangePickerCellValue),
    editCellExportMethod: createExportMethod(getRangePickerCellValue, true)
  },
  AWeekPicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-WW周'),
    renderItem: createFormItemRender(),
    cellExportMethod: createDatePickerExportMethod('YYYY-WW周'),
    editCellExportMethod: createDatePickerExportMethod('YYYY-WW周', true)
  },
  ATimePicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('HH:mm:ss'),
    renderItem: createFormItemRender(),
    cellExportMethod: createDatePickerExportMethod('HH:mm:ss'),
    editCellExportMethod: createDatePickerExportMethod('HH:mm:ss', true)
  },
  ATreeSelect: {
    renderEdit: createEditRender(),
    renderCell (h: CreateElement, renderOpts: ColumnCellRenderOptions, params: ColumnEditRenderParams) {
      return cellText(h, getTreeSelectCellValue(renderOpts, params))
    },
    renderItem: createFormItemRender(),
    cellExportMethod: createExportMethod(getTreeSelectCellValue),
    editCellExportMethod: createExportMethod(getTreeSelectCellValue, true)
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
    renderFilter (h: CreateElement, renderOpts: ColumnFilterRenderOptions, params: ColumnFilterRenderParams) {
      const { column } = params
      const { name, attrs } = renderOpts
      const nativeOn = getNativeOns(renderOpts, params)
      return [
        h('div', {
          class: 'vxe-table--filter-iview-wrapper'
        }, column.filters.map((option, oIndex) => {
          const optionValue = option.data
          return h(name, {
            key: oIndex,
            attrs,
            props: getCellEditFilterProps(renderOpts, params, optionValue),
            on: getFilterOns(renderOpts, params, option, () => {
              // 处理 change 事件相关逻辑
              handleConfirmFilter(params, XEUtils.isBoolean(option.data), option)
            }),
            nativeOn
          })
        }))
      ]
    },
    filterMethod: defaultFilterMethod,
    renderItem: createFormItemRender()
  },
  ARadio: {
    renderItem: createFormItemRadioAndCheckboxRender()
  },
  ACheckbox: {
    renderItem: createFormItemRadioAndCheckboxRender()
  },
  AButton: {
    renderEdit: defaultButtonEditRender,
    renderDefault: defaultButtonEditRender,
    renderItem: defaultButtonItemRender
  },
  AButtons: {
    renderEdit: defaultButtonsEditRender,
    renderDefault: defaultButtonsEditRender,
    renderItem: defaultButtonsItemRender
  }
}

/**
 * 检查触发源是否属于目标节点
 */
function getEventTargetNode (evnt: any, container: HTMLElement, className: string) {
  let targetElem
  let target = evnt.target
  while (target && target.nodeType && target !== document) {
    if (className && target.className && target.className.split && target.className.split(' ').indexOf(className) > -1) {
      targetElem = target
    } else if (target === container) {
      return { flag: className ? !!targetElem : true, container, targetElem: targetElem }
    }
    target = target.parentNode
  }
  return { flag: false }
}

/**
 * 事件兼容性处理
 */
function handleClearEvent (params: InterceptorParams, e: any) {
  const bodyElem: HTMLElement = document.body
  const evnt = params.$event || e
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
  install ({ interceptor, renderer }: typeof VXETable) {
    renderer.mixin(renderMap)
    interceptor.add('event.clearFilter', handleClearEvent)
    interceptor.add('event.clearActived', handleClearEvent)
  }
}

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginAntd)
}

export default VXETablePluginAntd
