# vxe-table-plugin-antd

[![npm version](https://img.shields.io/npm/v/vxe-table-plugin-antd.svg?style=flat-square)](https://www.npmjs.org/package/vxe-table-plugin-antd)
[![npm downloads](https://img.shields.io/npm/dm/vxe-table-plugin-antd.svg?style=flat-square)](http://npm-stat.com/charts.html?package=vxe-table-plugin-antd)
[![gzip size: JS](http://img.badgesize.io/https://unpkg.com/vxe-table-plugin-antd/dist/index.min.js?compression=gzip&label=gzip%20size:%20JS)](https://unpkg.com/vxe-table-plugin-antd/dist/index.min.js)
[![gzip size: CSS](http://img.badgesize.io/https://unpkg.com/vxe-table-plugin-antd/dist/style.min.css?compression=gzip&label=gzip%20size:%20CSS)](https://unpkg.com/vxe-table-plugin-antd/dist/style.min.css)
[![npm license](https://img.shields.io/github/license/mashape/apistatus.svg)](https://github.com/xuliangzhan/vxe-table-plugin-antd/blob/master/LICENSE)

该插件用于在 vxe-table 表格中适配 ant-design-vue 组件的渲染

## Installing

```shell
npm install xe-utils vxe-table vxe-table-plugin-antd
```

```javascript
import Vue from 'vue'
import VXETable from 'vxe-table'
import VXETablePluginAntd from 'vxe-table-plugin-antd'
import 'vxe-table-plugin-antd/dist/style.css'

Vue.use(VXETable)
VXETable.use(VXETablePluginAntd)
```

## API

### edit-render 配置项说明

| 属性 | 描述 | 类型 | 可选值 | 默认值 |
|------|------|-----|-----|-----|
| name | 支持的渲染组件 | String | AInput, AAutocomplete, AInputNumber, ASelect, ACascader, ADatePicker, AMonthPicker, ARangePicker, AWeekPicker, ATimePicker, ATreeSelect, ASwitch, ARate | — |
| props | 渲染组件附加属性，参数请查看被渲染的 Component props | Object | — | {} |
| options | 只对 name=ASelect 有效，下拉组件选项列表 | Array | — | [] |
| optionProps | 只对 name=ASelect 有效，下拉组件选项属性参数配置 | Object | — | { value: 'value', label: 'label' } |
| optionGroups | 只对 name=ASelect 有效，下拉组件分组选项列表 | Array | — | [] |
| optionGroupProps | 只对 name=ASelect 有效，下拉组件分组选项属性参数配置 | Object | — | { options: 'options', label: 'label' } |
| events | 渲染组件附加事件，参数为 ( {row,rowIndex,column,columnIndex}, ...Component arguments ) | Object | — | — |

## Demo

默认直接使用 class=vxe-table-antd 既可，当然你也可以不引入默认样式，自行实现样式也是可以的。

```html
<vxe-table
  border
  class="vxe-table-antd"
  height="600"
  :data.sync="tableData"
  :edit-config="{key: 'id', trigger: 'click', mode: 'cell'}">
  <vxe-table-column type="selection" width="60" fixed="left"></vxe-table-column>
  <vxe-table-column type="index" label="Number" width="80" fixed="left"></vxe-table-column>
  <vxe-table-column prop="name" label="AInput" min-width="140" :edit-render="{name: 'AInput'}"></vxe-table-column>
  <vxe-table-column prop="age" label="AInputNumber" width="160" :edit-render="{name: 'AInputNumber', props: {max: 35, min: 18}}"></vxe-table-column>
  <vxe-table-column prop="sex" label="ASelect" width="140" :edit-render="{name: 'ASelect', options: sexList}"></vxe-table-column>
  <vxe-table-column prop="region" label="ACascader" width="200" :edit-render="{name: 'ACascader', props: {options: regionList}}"></vxe-table-column>
  <vxe-table-column prop="date7" label="ADatePicker" width="200" :edit-render="{name: 'ADatePicker', props: {type: 'date', format: 'YYYY/MM/DD'}}"></vxe-table-column>
  <vxe-table-column prop="flag" label="ASwitch" width="100" :edit-render="{name: 'ASwitch', type: 'visible'}"></vxe-table-column>
  <vxe-table-column prop="rate" label="ARate" width="200" fixed="right" :edit-render="{name: 'ARate', type: 'visible'}"></vxe-table-column>
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

## License

Copyright (c) 2019-present, Xu Liangzhan
