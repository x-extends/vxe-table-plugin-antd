# vxe-table-plugin-antd

[![gitee star](https://gitee.com/xuliangzhan_admin/vxe-table-plugin-antd/badge/star.svg?theme=dark)](https://gitee.com/xuliangzhan_admin/vxe-table-plugin-antd/stargazers)
[![npm version](https://img.shields.io/npm/v/vxe-table-plugin-antd.svg?style=flat-square)](https://www.npmjs.org/package/vxe-table-plugin-antd)
[![npm downloads](https://img.shields.io/npm/dm/vxe-table-plugin-antd.svg?style=flat-square)](http://npm-stat.com/charts.html?package=vxe-table-plugin-antd)
[![gzip size: JS](http://img.badgesize.io/https://unpkg.com/vxe-table-plugin-antd/dist/index.min.js?compression=gzip&label=gzip%20size:%20JS)](https://unpkg.com/vxe-table-plugin-antd/dist/index.min.js)
[![gzip size: CSS](http://img.badgesize.io/https://unpkg.com/vxe-table-plugin-antd/dist/style.min.css?compression=gzip&label=gzip%20size:%20CSS)](https://unpkg.com/vxe-table-plugin-antd/dist/style.min.css)
[![npm license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/xuliangzhan/vxe-table-plugin-antd/blob/master/LICENSE)

基于 [vxe-table](https://github.com/xuliangzhan/vxe-table) 表格的适配插件，用于兼容 [ant-design-vue](https://www.npmjs.com/package/ant-design-vue) 组件库

## Installing

```shell
npm install xe-utils vxe-table vxe-table-plugin-antd ant-design-vue
```

```javascript
// ...
import VXETablePluginAntd from 'vxe-table-plugin-antd'
import 'vxe-table-plugin-antd/dist/style.css'
// ...

VXETable.use(VXETablePluginAntd)
```

## API

### cell-render 默认的渲染器配置项说明

| 属性 | 描述 | 类型 | 可选值 | 默认值 |
|------|------|-----|-----|-----|
| name | 支持的渲染组件 | String | AInput, AAutocomplete, AInputNumber, ASwitch, ARate, AButton, AButtons | — |
| props | 渲染组件附加属性，参数请查看被渲染的 Component props | Object | — | {} |
| options | 只对 name=ASelect 有效，下拉组件选项列表 | Array | — | [] |
| optionProps | 只对 name=ASelect 有效，下拉组件选项属性参数配置 | Object | — | { value: 'value', label: 'label', disabled: 'disabled' } |
| optionGroups | 只对 name=ASelect 有效，下拉组件分组选项列表 | Array | — | [] |
| optionGroupProps | 只对 name=ASelect 有效，下拉组件分组选项属性参数配置 | Object | — | { options: 'options', label: 'label' } |
| events | 渲染组件附加事件，参数为 ( {row,rowIndex,column,columnIndex}, ...Component arguments ) | Object | — | — |

### edit-render 可编辑渲染器配置项说明

| 属性 | 描述 | 类型 | 可选值 | 默认值 |
|------|------|-----|-----|-----|
| name | 支持的渲染组件 | String | AInput, AAutocomplete, AInputNumber, ASelect, ACascader, ADatePicker, AMonthPicker, ARangePicker, AWeekPicker, ATimePicker, ATreeSelect, ASwitch, ARate, AButton, AButtons | — |
| props | 渲染组件附加属性，参数请查看被渲染的 Component props | Object | — | {} |
| options | 只对 name=ASelect 有效，下拉组件选项列表 | Array | — | [] |
| optionProps | 只对 name=ASelect 有效，下拉组件选项属性参数配置 | Object | — | { value: 'value', label: 'label', disabled: 'disabled' } |
| optionGroups | 只对 name=ASelect 有效，下拉组件分组选项列表 | Array | — | [] |
| optionGroupProps | 只对 name=ASelect 有效，下拉组件分组选项属性参数配置 | Object | — | { options: 'options', label: 'label' } |
| events | 渲染组件附加事件，参数为 ( {row,rowIndex,column,columnIndex}, ...Component arguments ) | Object | — | — |

### filter-render 筛选渲染器配置项说明

| 属性 | 描述 | 类型 | 可选值 | 默认值 |
|------|------|-----|-----|-----|
| name | 支持的渲染组件 | String | AInput, AAutocomplete, AInputNumber, ASelect, ASwitch, ARate | — |
| props | 渲染组件附加属性，参数请查看被渲染的 Component props | Object | — | {} |
| options | 只对 name=ASelect 有效，下拉组件选项列表 | Array | — | [] |
| optionProps | 只对 name=ASelect 有效，下拉组件选项属性参数配置 | Object | — | { value: 'value', label: 'label', disabled: 'disabled' } |
| optionGroups | 只对 name=ASelect 有效，下拉组件分组选项列表 | Array | — | [] |
| optionGroupProps | 只对 name=ASelect 有效，下拉组件分组选项属性参数配置 | Object | — | { options: 'options', label: 'label' } |
| events | 渲染组件附加事件，参数为 ( {}, ...Component arguments ) | Object | — | — |

### item-render 表单-项选渲染器配置项说明

| 属性 | 描述 | 类型 | 可选值 | 默认值 |
|------|------|-----|-----|-----|
| name | 支持的渲染组件 | String | AInput, AAutocomplete, AInputNumber, ASelect, ASwitch, ARate, ARadio, ACheckbox, AButton, AButtons | — |
| props | 渲染组件附加属性，参数请查看被渲染的 Component props | Object | — | {} |
| options | 只对 name=ASelect 有效，下拉组件选项列表 | Array | — | [] |
| optionProps | 只对 name=ASelect 有效，下拉组件选项属性参数配置 | Object | — | { value: 'value', label: 'label', disabled: 'disabled' } |
| optionGroups | 只对 name=ASelect 有效，下拉组件分组选项列表 | Array | — | [] |
| optionGroupProps | 只对 name=ASelect 有效，下拉组件分组选项属性参数配置 | Object | — | { options: 'options', label: 'label' } |
| events | 渲染组件附加事件，参数为 ( {}, ...Component arguments ) | Object | — | — |

## Cell demo

```html
<vxe-table
  border
  height="600"
  :data="tableData"
  :edit-config="{trigger: 'click', mode: 'cell'}">
  <vxe-table-column type="selection" width="60"></vxe-table-column>
  <vxe-table-column type="index" title="Number" width="80"></vxe-table-column>
  <vxe-table-column field="name" title="AInput" min-width="140" :edit-render="{name: 'AInput'}"></vxe-table-column>
  <vxe-table-column field="age" title="AInputNumber" width="160" :edit-render="{name: 'AInputNumber', props: {max: 35, min: 18}}"></vxe-table-column>
  <vxe-table-column field="sex" title="ASelect" width="140" :edit-render="{name: 'ASelect', options: sexList}"></vxe-table-column>
  <vxe-table-column field="region" title="ACascader" width="200" :edit-render="{name: 'ACascader', props: {options: regionList}}"></vxe-table-column>
  <vxe-table-column field="date7" title="ADatePicker" width="200" :edit-render="{name: 'ADatePicker', props: {type: 'date', format: 'YYYY/MM/DD'}}"></vxe-table-column>
  <vxe-table-column field="flag" title="ASwitch" width="100" :edit-render="{name: 'ASwitch', type: 'visible'}"></vxe-table-column>
  <vxe-table-column field="rate" title="ARate" width="200" :edit-render="{name: 'ARate', type: 'visible'}"></vxe-table-column>
</vxe-table>
```

```javascript
export default {
  data () {
    return {
      tableData: [
        {
          id: 100,
          name: 'test',
          age: 26,
          sex: '1',
          region: ['shenzhen'],
          date: null,
          date1: null,
          date2: null,
          rate: 2,
          flag: true
        }
      ],
      sexList: [
        {
          'label': '男',
          'value': '1'
        },
        {
          'label': '女',
          'value': '0'
        }
      ],
      regionList: [
        {
          'label': '深圳',
          'value': 'shenzhen'
        },
        {
          'label': '广州',
          'value': 'guangzhou'
        }
      ]
    }
  }
}
```

## Filter demo

```html
<vxe-table
  border
  height="600"
  :data="tableData">
  <vxe-table-column type="index" width="60"></vxe-table-column>
  <vxe-table-column field="name" title="Name"></vxe-table-column>
  <vxe-table-column field="age" title="Age"></vxe-table-column>
  <vxe-table-column field="date" title="Date" :filters="[{data: []}]" :filter-render="{name: 'AInput'}"></vxe-table-column>
</vxe-table>
```

```javascript
export default {
  data () {
    return {
      tableData: [
        {
          id: 100,
          name: 'test',
          age: 26,
          date: null
        }
      ]
    }
  }
}
```

## License

MIT License, 2019-present, Xu Liangzhan
