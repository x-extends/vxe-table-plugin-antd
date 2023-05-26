# vxe-table-plugin-antd

[![gitee star](https://gitee.com/x-extends/vxe-table-plugin-antd/badge/star.svg?theme=dark)](https://gitee.com/x-extends/vxe-table-plugin-antd/stargazers)
[![npm version](https://img.shields.io/npm/v/vxe-table-plugin-antd.svg?style=flat-square)](https://www.npmjs.com/package/vxe-table-plugin-antd)
[![npm downloads](https://img.shields.io/npm/dm/vxe-table-plugin-antd.svg?style=flat-square)](http://npm-stat.com/charts.html?package=vxe-table-plugin-antd)
[![npm license](https://img.shields.io/github/license/mashape/apistatus.svg)](LICENSE)

基于 [vxe-table](https://www.npmjs.com/package/vxe-table) 表格的适配插件，用于兼容 [ant-design-vue](https://github.com/vueComponent/ant-design-vue) 组件库

## Compatibility

对应 vxe-table v4 版本  

## Installing

```shell
npm install xe-utils vxe-table@next vxe-table-plugin-antd@next ant-design-vue@next
```

```javascript
// ...
import VXETable from 'vxe-table'
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
| optionProps | 只对 name=ASelect 有效，下拉组件选项属性参数配置 | Object | — | { value: 'value', label: 'label' } |
| optionGroups | 只对 name=ASelect 有效，下拉组件分组选项列表 | Array | — | [] |
| optionGroupProps | 只对 name=ASelect 有效，下拉组件分组选项属性参数配置 | Object | — | { options: 'options', label: 'label' } |
| events | 渲染组件附加事件，参数为 ( {row,rowIndex,column,columnIndex}, ...Component arguments ) | Object | — | — |
| nativeEvents | 渲染组件附加事件，参数为 ( {row,rowIndex,column,columnIndex}, ...Component arguments ) | Object | — | — |

### edit-render 可编辑渲染器配置项说明

| 属性 | 描述 | 类型 | 可选值 | 默认值 |
|------|------|-----|-----|-----|
| name | 支持的渲染组件 | String | AInput, AAutocomplete, AInputNumber, ASelect, ACascader, ADatePicker, AMonthPicker, ARangePicker, AWeekPicker, ATimePicker, ATreeSelect, ASwitch, ARate, AButton, AButtons | — |
| props | 渲染组件附加属性，参数请查看被渲染的 Component props | Object | — | {} |
| options | 只对 name=ASelect 有效，下拉组件选项列表 | Array | — | [] |
| optionProps | 只对 name=ASelect 有效，下拉组件选项属性参数配置 | Object | — | { value: 'value', label: 'label' } |
| optionGroups | 只对 name=ASelect 有效，下拉组件分组选项列表 | Array | — | [] |
| optionGroupProps | 只对 name=ASelect 有效，下拉组件分组选项属性参数配置 | Object | — | { options: 'options', label: 'label' } |
| events | 渲染组件附加事件，参数为 ( {row,rowIndex,column,columnIndex}, ...Component arguments ) | Object | — | — |
| nativeEvents | 渲染组件附加事件，参数为 ( {row,rowIndex,column,columnIndex}, ...Component arguments ) | Object | — | — |

### filter-render 筛选渲染器配置项说明

| 属性 | 描述 | 类型 | 可选值 | 默认值 |
|------|------|-----|-----|-----|
| name | 支持的渲染组件 | String | AInput, AAutocomplete, AInputNumber, ASelect, ASwitch, ARate | — |
| props | 渲染组件附加属性，参数请查看被渲染的 Component props | Object | — | {} |
| options | 只对 name=ASelect 有效，下拉组件选项列表 | Array | — | [] |
| optionProps | 只对 name=ASelect 有效，下拉组件选项属性参数配置 | Object | — | { value: 'value', label: 'label' } |
| optionGroups | 只对 name=ASelect 有效，下拉组件分组选项列表 | Array | — | [] |
| optionGroupProps | 只对 name=ASelect 有效，下拉组件分组选项属性参数配置 | Object | — | { options: 'options', label: 'label' } |
| events | 渲染组件附加事件，参数为 ( {}, ...Component arguments ) | Object | — | — |
| nativeEvents | 渲染组件附加事件，参数为 ( {}, ...Component arguments ) | Object | — | — |

### item-render 表单-项选渲染器配置项说明

| 属性 | 描述 | 类型 | 可选值 | 默认值 |
|------|------|-----|-----|-----|
| name | 支持的渲染组件 | String | AInput, AAutocomplete, AInputNumber, ASelect, ASwitch, ARate, ARadio, ACheckbox, AButton, AButtons | — |
| props | 渲染组件附加属性，参数请查看被渲染的 Component props | Object | — | {} |
| options | 只对 name=ASelect 有效，下拉组件选项列表 | Array | — | [] |
| optionProps | 只对 name=ASelect 有效，下拉组件选项属性参数配置 | Object | — | { value: 'value', label: 'label' } |
| optionGroups | 只对 name=ASelect 有效，下拉组件分组选项列表 | Array | — | [] |
| optionGroupProps | 只对 name=ASelect 有效，下拉组件分组选项属性参数配置 | Object | — | { options: 'options', label: 'label' } |
| events | 渲染组件附加事件，参数为 ( {}, ...Component arguments ) | Object | — | — |
| nativeEvents | 渲染组件附加事件，参数为 ( {}, ...Component arguments ) | Object | — | — |

## Cell demo

```html
<vxe-table
  height="600"
  :data="tableData"
  :edit-config="{trigger: 'click', mode: 'cell'}">
  <vxe-column field="name" title="Name" :edit-render="{}">
    <template #edit="{ row }">
      <a-input v-model:value="row.name"></a-input>
    </template>
  </vxe-column>
  <vxe-column field="age" title="Age" :edit-render="{}">
    <template #edit="{ row }">
      <a-input-number v-model:value="row.age"></a-input-number>
    </template>
  </vxe-column>
  <vxe-column field="date" title="Date" width="200" :edit-render="{}">
    <template #edit="{ row }">
      <a-date-picker v-model:value="row.date" type="date"></a-date-picker>
    </template>
  </vxe-column>
</vxe-table>
```

```javascript
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    return {
      tableData: [
        { id: 100, name: 'test0', age: 28, sex: '1', date: null },
        { id: 101, name: 'test1', age: 32, sex: '0', date: null },
        { id: 102, name: 'test2', age: 36, sex: '1', date: null }
      ]
    }
  }
})
```

## Filter demo

```html
<vxe-table
  height="600"
  :data="tableData">
  <vxe-column field="name" title="Name"></vxe-column>
  <vxe-column field="age" title="Age"></vxe-column>
  <vxe-column field="date" title="Date" :filters="[{data: []}]" :filter-render="{}">
    <template #filter="{ $panel, column }">
      <a-input type="type" v-for="(option, index) in column.filters" :key="index" v-model:value="option.data" @input="$panel.changeOption($event, !!option.data, option)"></a-input>
    </template>
  </vxe-column>
</vxe-table>
```

```javascript
import { defineComponent } from 'vue'

export default defineComponent({
  setup () {
    return {
      tableData: [
        { id: 100, name: 'test0', age: 28, date: null },
        { id: 101, name: 'test1', age: 32, date: null },
        { id: 102, name: 'test2', age: 36, date: null }
      ]
    }
  }
})
```

## License

[MIT](LICENSE) © 2019-present, Xu Liangzhan
