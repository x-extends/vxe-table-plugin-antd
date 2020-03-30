"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.VXETablePluginAntd = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils/methods/xe-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/* eslint-enable no-unused-vars */
function isEmptyValue(cellValue) {
  return cellValue === null || cellValue === undefined || cellValue === '';
}

function getModelProp(renderOpts) {
  var prop = 'value';

  switch (renderOpts.name) {
    case 'ASwitch':
      prop = 'checked';
      break;
  }

  return prop;
}

function getModelEvent(renderOpts) {
  var type = 'change';

  switch (renderOpts.name) {
    case 'AInput':
      type = 'change.value';
      break;

    case 'ARadio':
    case 'ACheckbox':
      type = 'input';
      break;
  }

  return type;
}

function getChangeEvent(renderOpts) {
  return 'change';
}

function getCellEditFilterProps(renderOpts, params, value, defaultProps) {
  var vSize = params.$table.vSize;
  return _xeUtils["default"].assign(vSize ? {
    size: vSize
  } : {}, defaultProps, renderOpts.props, _defineProperty({}, getModelProp(renderOpts), value));
}

function getItemProps(renderOpts, params, value, defaultProps) {
  var vSize = params.$form.vSize;
  return _xeUtils["default"].assign(vSize ? {
    size: vSize
  } : {}, defaultProps, renderOpts.props, _defineProperty({}, getModelProp(renderOpts), value));
}

function getOns(renderOpts, params, inputFunc, changeFunc) {
  var events = renderOpts.events;
  var modelEvent = getModelEvent(renderOpts);
  var changeEvent = getChangeEvent(renderOpts);
  var isSameEvent = changeEvent === modelEvent;
  var ons = {};

  _xeUtils["default"].objectEach(events, function (func, key) {
    ons[key] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      func.apply(void 0, [params].concat(args));
    };
  });

  if (inputFunc) {
    ons[modelEvent] = function (args1) {
      inputFunc(args1);

      if (events && events[modelEvent]) {
        events[modelEvent](args1);
      }

      if (isSameEvent && changeFunc) {
        changeFunc(args1);
      }
    };
  }

  if (!isSameEvent && changeFunc) {
    ons[changeEvent] = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      changeFunc.apply(void 0, args);

      if (events && events[changeEvent]) {
        events[changeEvent].apply(events, [params].concat(args));
      }
    };
  }

  return ons;
}

function getEditOns(renderOpts, params) {
  var $table = params.$table,
      row = params.row,
      column = params.column;
  return getOns(renderOpts, params, function (value) {
    // 处理 model 值双向绑定
    _xeUtils["default"].set(row, column.property, value);
  }, function () {
    // 处理 change 事件相关逻辑
    $table.updateStatus(params);
  });
}

function getFilterOns(renderOpts, params, option, changeFunc) {
  return getOns(renderOpts, params, function (value) {
    // 处理 model 值双向绑定
    option.data = value;
  }, changeFunc);
}

function getItemOns(renderOpts, params) {
  var $form = params.$form,
      data = params.data,
      property = params.property;
  return getOns(renderOpts, params, function (value) {
    // 处理 model 值双向绑定
    _xeUtils["default"].set(data, property, value);
  }, function () {
    // 处理 change 事件相关逻辑
    $form.updateStatus(params);
  });
}

function matchCascaderData(index, list, values, labels) {
  var val = values[index];

  if (list && values.length > index) {
    _xeUtils["default"].each(list, function (item) {
      if (item.value === val) {
        labels.push(item.label);
        matchCascaderData(++index, item.children, values, labels);
      }
    });
  }
}

function formatDatePicker(defaultFormat) {
  return function (h, renderOpts, params) {
    return cellText(h, getDatePickerCellValue(renderOpts, params, defaultFormat));
  };
}

function getSelectCellValue(renderOpts, params) {
  var _renderOpts$options = renderOpts.options,
      options = _renderOpts$options === void 0 ? [] : _renderOpts$options,
      optionGroups = renderOpts.optionGroups,
      _renderOpts$props = renderOpts.props,
      props = _renderOpts$props === void 0 ? {} : _renderOpts$props,
      _renderOpts$optionPro = renderOpts.optionProps,
      optionProps = _renderOpts$optionPro === void 0 ? {} : _renderOpts$optionPro,
      _renderOpts$optionGro = renderOpts.optionGroupProps,
      optionGroupProps = _renderOpts$optionGro === void 0 ? {} : _renderOpts$optionGro;
  var row = params.row,
      column = params.column;
  var labelProp = optionProps.label || 'label';
  var valueProp = optionProps.value || 'value';
  var groupOptions = optionGroupProps.options || 'options';

  var cellValue = _xeUtils["default"].get(row, column.property);

  if (!isEmptyValue(cellValue)) {
    return _xeUtils["default"].map(props.mode === 'multiple' ? cellValue : [cellValue], optionGroups ? function (value) {
      var selectItem;

      for (var index = 0; index < optionGroups.length; index++) {
        selectItem = _xeUtils["default"].find(optionGroups[index][groupOptions], function (item) {
          return item[valueProp] === value;
        });

        if (selectItem) {
          break;
        }
      }

      return selectItem ? selectItem[labelProp] : value;
    } : function (value) {
      var selectItem = _xeUtils["default"].find(options, function (item) {
        return item[valueProp] === value;
      });

      return selectItem ? selectItem[labelProp] : value;
    }).join(', ');
  }

  return null;
}

function getCascaderCellValue(renderOpts, params) {
  var _renderOpts$props2 = renderOpts.props,
      props = _renderOpts$props2 === void 0 ? {} : _renderOpts$props2;
  var row = params.row,
      column = params.column;

  var cellValue = _xeUtils["default"].get(row, column.property);

  var values = cellValue || [];
  var labels = [];
  matchCascaderData(0, props.options, values, labels);
  return (props.showAllLevels === false ? labels.slice(labels.length - 1, labels.length) : labels).join(" ".concat(props.separator || '/', " "));
}

function getRangePickerCellValue(renderOpts, params) {
  var _renderOpts$props3 = renderOpts.props,
      props = _renderOpts$props3 === void 0 ? {} : _renderOpts$props3;
  var row = params.row,
      column = params.column;

  var cellValue = _xeUtils["default"].get(row, column.property);

  if (cellValue) {
    cellValue = _xeUtils["default"].map(cellValue, function (date) {
      return date.format(props.format || 'YYYY-MM-DD');
    }).join(' ~ ');
  }

  return cellValue;
}

function getTreeSelectCellValue(renderOpts, params) {
  var _renderOpts$props4 = renderOpts.props,
      props = _renderOpts$props4 === void 0 ? {} : _renderOpts$props4;
  var treeData = props.treeData,
      treeCheckable = props.treeCheckable;
  var row = params.row,
      column = params.column;

  var cellValue = _xeUtils["default"].get(row, column.property);

  if (!isEmptyValue(cellValue)) {
    return _xeUtils["default"].map(treeCheckable ? cellValue : [cellValue], function (value) {
      var matchObj = _xeUtils["default"].findTree(treeData, function (item) {
        return item.value === value;
      }, {
        children: 'children'
      });

      return matchObj ? matchObj.item.title : value;
    }).join(', ');
  }

  return cellValue;
}

function getDatePickerCellValue(renderOpts, params, defaultFormat) {
  var _renderOpts$props5 = renderOpts.props,
      props = _renderOpts$props5 === void 0 ? {} : _renderOpts$props5;
  var row = params.row,
      column = params.column;

  var cellValue = _xeUtils["default"].get(row, column.property);

  if (cellValue) {
    cellValue = cellValue.format(props.format || defaultFormat);
  }

  return cellValue;
}

function createEditRender(defaultProps) {
  return function (h, renderOpts, params) {
    var row = params.row,
        column = params.column;
    var attrs = renderOpts.attrs;

    var cellValue = _xeUtils["default"].get(row, column.property);

    return [h(renderOpts.name, {
      attrs: attrs,
      props: getCellEditFilterProps(renderOpts, params, cellValue, defaultProps),
      on: getEditOns(renderOpts, params)
    })];
  };
}

function defaultButtonEditRender(h, renderOpts, params) {
  var attrs = renderOpts.attrs;
  return [h('a-button', {
    attrs: attrs,
    props: getCellEditFilterProps(renderOpts, params, null),
    on: getOns(renderOpts, params)
  }, cellText(h, renderOpts.content))];
}

function defaultButtonsEditRender(h, renderOpts, params) {
  return renderOpts.children.map(function (childRenderOpts) {
    return defaultButtonEditRender(h, childRenderOpts, params)[0];
  });
}

function createFilterRender(defaultProps) {
  return function (h, renderOpts, params) {
    var column = params.column;
    var name = renderOpts.name,
        attrs = renderOpts.attrs;
    return column.filters.map(function (option, oIndex) {
      var optionValue = option.data;
      return h(name, {
        key: oIndex,
        attrs: attrs,
        props: getCellEditFilterProps(renderOpts, params, optionValue, defaultProps),
        on: getFilterOns(renderOpts, params, option, function () {
          // 处理 change 事件相关逻辑
          handleConfirmFilter(params, !!option.data, option);
        })
      });
    });
  };
}

function handleConfirmFilter(params, checked, option) {
  var $panel = params.$panel;
  $panel.changeOption({}, checked, option);
}

function defaultFilterMethod(params) {
  var option = params.option,
      row = params.row,
      column = params.column;
  var data = option.data;

  var cellValue = _xeUtils["default"].get(row, column.property);
  /* eslint-disable eqeqeq */


  return cellValue === data;
}

function renderOptions(h, options, optionProps) {
  var labelProp = optionProps.label || 'label';
  var valueProp = optionProps.value || 'value';
  var disabledProp = optionProps.disabled || 'disabled';
  return _xeUtils["default"].map(options, function (item, oIndex) {
    return h('a-select-option', {
      key: oIndex,
      props: {
        value: item[valueProp],
        disabled: item[disabledProp]
      }
    }, item[labelProp]);
  });
}

function cellText(h, cellValue) {
  return ['' + (isEmptyValue(cellValue) ? '' : cellValue)];
}

function createFormItemRender(defaultProps) {
  return function (h, renderOpts, params) {
    var data = params.data,
        property = params.property;
    var name = renderOpts.name;
    var attrs = renderOpts.attrs;

    var itemValue = _xeUtils["default"].get(data, property);

    return [h(name, {
      attrs: attrs,
      props: getItemProps(renderOpts, params, itemValue, defaultProps),
      on: getItemOns(renderOpts, params)
    })];
  };
}

function defaultButtonItemRender(h, renderOpts, params) {
  var attrs = renderOpts.attrs;
  var props = getItemProps(renderOpts, params, null);
  return [h('a-button', {
    attrs: attrs,
    props: props,
    on: getOns(renderOpts, params)
  }, cellText(h, renderOpts.content || props.content))];
}

function defaultButtonsItemRender(h, renderOpts, params) {
  return renderOpts.children.map(function (childRenderOpts) {
    return defaultButtonItemRender(h, childRenderOpts, params)[0];
  });
}

function createDatePickerExportMethod(defaultFormat, isEdit) {
  var renderProperty = isEdit ? 'editRender' : 'cellRender';
  return function (params) {
    return getDatePickerCellValue(params.column[renderProperty], params, defaultFormat);
  };
}

function createExportMethod(valueMethod, isEdit) {
  var renderProperty = isEdit ? 'editRender' : 'cellRender';
  return function (params) {
    return valueMethod(params.column[renderProperty], params);
  };
}

function createFormItemRadioAndCheckboxRender() {
  return function (h, renderOpts, params) {
    var name = renderOpts.name,
        _renderOpts$options2 = renderOpts.options,
        options = _renderOpts$options2 === void 0 ? [] : _renderOpts$options2,
        _renderOpts$optionPro2 = renderOpts.optionProps,
        optionProps = _renderOpts$optionPro2 === void 0 ? {} : _renderOpts$optionPro2;
    var data = params.data,
        property = params.property;
    var attrs = renderOpts.attrs;
    var labelProp = optionProps.label || 'label';
    var valueProp = optionProps.value || 'value';
    var disabledProp = optionProps.disabled || 'disabled';

    var itemValue = _xeUtils["default"].get(data, property);

    return [h("".concat(name, "Group"), {
      attrs: attrs,
      props: getItemProps(renderOpts, params, itemValue),
      on: getItemOns(renderOpts, params)
    }, options.map(function (option, oIndex) {
      return h(name, {
        key: oIndex,
        props: {
          value: option[valueProp],
          disabled: option[disabledProp]
        }
      }, option[labelProp]);
    }))];
  };
}
/**
 * 渲染函数
 */


var renderMap = {
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
    renderEdit: function renderEdit(h, renderOpts, params) {
      var _renderOpts$options3 = renderOpts.options,
          options = _renderOpts$options3 === void 0 ? [] : _renderOpts$options3,
          optionGroups = renderOpts.optionGroups,
          _renderOpts$optionPro3 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro3 === void 0 ? {} : _renderOpts$optionPro3,
          _renderOpts$optionGro2 = renderOpts.optionGroupProps,
          optionGroupProps = _renderOpts$optionGro2 === void 0 ? {} : _renderOpts$optionGro2;
      var row = params.row,
          column = params.column;
      var attrs = renderOpts.attrs;

      var cellValue = _xeUtils["default"].get(row, column.property);

      var props = getCellEditFilterProps(renderOpts, params, cellValue);
      var on = getEditOns(renderOpts, params);

      if (optionGroups) {
        var groupOptions = optionGroupProps.options || 'options';
        var groupLabel = optionGroupProps.label || 'label';
        return [h('a-select', {
          props: props,
          attrs: attrs,
          on: on
        }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
          return h('a-select-opt-group', {
            key: gIndex
          }, [h('span', {
            slot: 'label'
          }, group[groupLabel])].concat(renderOptions(h, group[groupOptions], optionProps)));
        }))];
      }

      return [h('a-select', {
        props: props,
        attrs: attrs,
        on: on
      }, renderOptions(h, options, optionProps))];
    },
    renderCell: function renderCell(h, renderOpts, params) {
      return cellText(h, getSelectCellValue(renderOpts, params));
    },
    renderFilter: function renderFilter(h, renderOpts, params) {
      var _renderOpts$options4 = renderOpts.options,
          options = _renderOpts$options4 === void 0 ? [] : _renderOpts$options4,
          optionGroups = renderOpts.optionGroups,
          _renderOpts$optionPro4 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro4 === void 0 ? {} : _renderOpts$optionPro4,
          _renderOpts$optionGro3 = renderOpts.optionGroupProps,
          optionGroupProps = _renderOpts$optionGro3 === void 0 ? {} : _renderOpts$optionGro3;
      var column = params.column;
      var attrs = renderOpts.attrs;

      if (optionGroups) {
        var groupOptions = optionGroupProps.options || 'options';
        var groupLabel = optionGroupProps.label || 'label';
        return column.filters.map(function (option, oIndex) {
          var optionValue = option.data;
          return h('a-select', {
            key: oIndex,
            attrs: attrs,
            props: getCellEditFilterProps(renderOpts, params, optionValue),
            on: getFilterOns(renderOpts, params, option, function () {
              // 处理 change 事件相关逻辑
              handleConfirmFilter(params, option.data && option.data.length > 0, option);
            })
          }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
            return h('a-select-opt-group', {
              key: gIndex
            }, [h('span', {
              slot: 'label'
            }, group[groupLabel])].concat(renderOptions(h, group[groupOptions], optionProps)));
          }));
        });
      }

      return column.filters.map(function (option, oIndex) {
        var optionValue = option.data;
        return h('a-select', {
          key: oIndex,
          attrs: attrs,
          props: getCellEditFilterProps(renderOpts, params, optionValue),
          on: getFilterOns(renderOpts, params, option, function () {
            // 处理 change 事件相关逻辑
            handleConfirmFilter(params, option.data && option.data.length > 0, option);
          })
        }, renderOptions(h, options, optionProps));
      });
    },
    filterMethod: function filterMethod(params) {
      var option = params.option,
          row = params.row,
          column = params.column;
      var data = option.data;
      var property = column.property,
          renderOpts = column.filterRender;
      var _renderOpts$props6 = renderOpts.props,
          props = _renderOpts$props6 === void 0 ? {} : _renderOpts$props6;

      var cellValue = _xeUtils["default"].get(row, property);

      if (props.mode === 'multiple') {
        if (_xeUtils["default"].isArray(cellValue)) {
          return _xeUtils["default"].includeArrays(cellValue, data);
        }

        return data.indexOf(cellValue) > -1;
      }
      /* eslint-disable eqeqeq */


      return cellValue == data;
    },
    renderItem: function renderItem(h, renderOpts, params) {
      var _renderOpts$options5 = renderOpts.options,
          options = _renderOpts$options5 === void 0 ? [] : _renderOpts$options5,
          optionGroups = renderOpts.optionGroups,
          _renderOpts$optionPro5 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro5 === void 0 ? {} : _renderOpts$optionPro5,
          _renderOpts$optionGro4 = renderOpts.optionGroupProps,
          optionGroupProps = _renderOpts$optionGro4 === void 0 ? {} : _renderOpts$optionGro4;
      var data = params.data,
          property = params.property;
      var attrs = renderOpts.attrs;

      var itemValue = _xeUtils["default"].get(data, property);

      var props = getItemProps(renderOpts, params, itemValue);
      var on = getItemOns(renderOpts, params);

      if (optionGroups) {
        var groupOptions = optionGroupProps.options || 'options';
        var groupLabel = optionGroupProps.label || 'label';
        return [h('a-select', {
          attrs: attrs,
          props: props,
          on: on
        }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
          return h('a-select-opt-group', {
            key: gIndex
          }, [h('span', {
            slot: 'label'
          }, group[groupLabel])].concat(renderOptions(h, group[groupOptions], optionProps)));
        }))];
      }

      return [h('a-select', {
        attrs: attrs,
        props: props,
        on: on
      }, renderOptions(h, options, optionProps))];
    },
    cellExportMethod: createExportMethod(getSelectCellValue),
    editCellExportMethod: createExportMethod(getSelectCellValue, true)
  },
  ACascader: {
    renderEdit: createEditRender(),
    renderCell: function renderCell(h, renderOpts, params) {
      return cellText(h, getCascaderCellValue(renderOpts, params));
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
    renderCell: function renderCell(h, renderOpts, params) {
      return cellText(h, getRangePickerCellValue(renderOpts, params));
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
    renderCell: function renderCell(h, renderOpts, params) {
      return cellText(h, getTreeSelectCellValue(renderOpts, params));
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
    renderFilter: function renderFilter(h, renderOpts, params) {
      var column = params.column;
      var name = renderOpts.name,
          attrs = renderOpts.attrs;
      return column.filters.map(function (option, oIndex) {
        var optionValue = option.data;
        return h(name, {
          key: oIndex,
          attrs: attrs,
          props: getCellEditFilterProps(renderOpts, params, optionValue),
          on: getFilterOns(renderOpts, params, option, function () {
            // 处理 change 事件相关逻辑
            handleConfirmFilter(params, _xeUtils["default"].isBoolean(option.data), option);
          })
        });
      });
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
};
/**
 * 检查触发源是否属于目标节点
 */

function getEventTargetNode(evnt, container, className) {
  var targetElem;
  var target = evnt.target;

  while (target && target.nodeType && target !== document) {
    if (className && target.className && target.className.split && target.className.split(' ').indexOf(className) > -1) {
      targetElem = target;
    } else if (target === container) {
      return {
        flag: className ? !!targetElem : true,
        container: container,
        targetElem: targetElem
      };
    }

    target = target.parentNode;
  }

  return {
    flag: false
  };
}
/**
 * 事件兼容性处理
 */


function handleClearEvent(params, evnt) {
  var bodyElem = document.body;

  if ( // 下拉框
  getEventTargetNode(evnt, bodyElem, 'ant-select-dropdown').flag || // 级联
  getEventTargetNode(evnt, bodyElem, 'ant-cascader-menus').flag || // 日期
  getEventTargetNode(evnt, bodyElem, 'ant-calendar-picker-container').flag || // 时间选择
  getEventTargetNode(evnt, bodyElem, 'ant-time-picker-panel').flag) {
    return false;
  }
}
/**
 * 基于 vxe-table 表格的适配插件，用于兼容 ant-design-vue 组件库
 */


var VXETablePluginAntd = {
  install: function install(_ref) {
    var interceptor = _ref.interceptor,
        renderer = _ref.renderer;
    renderer.mixin(renderMap);
    interceptor.add('event.clearFilter', handleClearEvent);
    interceptor.add('event.clearActived', handleClearEvent);
  }
};
exports.VXETablePluginAntd = VXETablePluginAntd;

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginAntd);
}

var _default = VXETablePluginAntd;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsImNlbGxWYWx1ZSIsInVuZGVmaW5lZCIsImdldE1vZGVsUHJvcCIsInJlbmRlck9wdHMiLCJwcm9wIiwibmFtZSIsImdldE1vZGVsRXZlbnQiLCJ0eXBlIiwiZ2V0Q2hhbmdlRXZlbnQiLCJnZXRDZWxsRWRpdEZpbHRlclByb3BzIiwicGFyYW1zIiwidmFsdWUiLCJkZWZhdWx0UHJvcHMiLCJ2U2l6ZSIsIiR0YWJsZSIsIlhFVXRpbHMiLCJhc3NpZ24iLCJzaXplIiwicHJvcHMiLCJnZXRJdGVtUHJvcHMiLCIkZm9ybSIsImdldE9ucyIsImlucHV0RnVuYyIsImNoYW5nZUZ1bmMiLCJldmVudHMiLCJtb2RlbEV2ZW50IiwiY2hhbmdlRXZlbnQiLCJpc1NhbWVFdmVudCIsIm9ucyIsIm9iamVjdEVhY2giLCJmdW5jIiwia2V5IiwiYXJncyIsImFyZ3MxIiwiZ2V0RWRpdE9ucyIsInJvdyIsImNvbHVtbiIsInNldCIsInByb3BlcnR5IiwidXBkYXRlU3RhdHVzIiwiZ2V0RmlsdGVyT25zIiwib3B0aW9uIiwiZGF0YSIsImdldEl0ZW1PbnMiLCJtYXRjaENhc2NhZGVyRGF0YSIsImluZGV4IiwibGlzdCIsInZhbHVlcyIsImxhYmVscyIsInZhbCIsImxlbmd0aCIsImVhY2giLCJpdGVtIiwicHVzaCIsImxhYmVsIiwiY2hpbGRyZW4iLCJmb3JtYXREYXRlUGlja2VyIiwiZGVmYXVsdEZvcm1hdCIsImgiLCJjZWxsVGV4dCIsImdldERhdGVQaWNrZXJDZWxsVmFsdWUiLCJnZXRTZWxlY3RDZWxsVmFsdWUiLCJvcHRpb25zIiwib3B0aW9uR3JvdXBzIiwib3B0aW9uUHJvcHMiLCJvcHRpb25Hcm91cFByb3BzIiwibGFiZWxQcm9wIiwidmFsdWVQcm9wIiwiZ3JvdXBPcHRpb25zIiwiZ2V0IiwibWFwIiwibW9kZSIsInNlbGVjdEl0ZW0iLCJmaW5kIiwiam9pbiIsImdldENhc2NhZGVyQ2VsbFZhbHVlIiwic2hvd0FsbExldmVscyIsInNsaWNlIiwic2VwYXJhdG9yIiwiZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUiLCJkYXRlIiwiZm9ybWF0IiwiZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSIsInRyZWVEYXRhIiwidHJlZUNoZWNrYWJsZSIsIm1hdGNoT2JqIiwiZmluZFRyZWUiLCJ0aXRsZSIsImNyZWF0ZUVkaXRSZW5kZXIiLCJhdHRycyIsIm9uIiwiZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIiLCJjb250ZW50IiwiZGVmYXVsdEJ1dHRvbnNFZGl0UmVuZGVyIiwiY2hpbGRSZW5kZXJPcHRzIiwiY3JlYXRlRmlsdGVyUmVuZGVyIiwiZmlsdGVycyIsIm9JbmRleCIsIm9wdGlvblZhbHVlIiwiaGFuZGxlQ29uZmlybUZpbHRlciIsImNoZWNrZWQiLCIkcGFuZWwiLCJjaGFuZ2VPcHRpb24iLCJkZWZhdWx0RmlsdGVyTWV0aG9kIiwicmVuZGVyT3B0aW9ucyIsImRpc2FibGVkUHJvcCIsImRpc2FibGVkIiwiY3JlYXRlRm9ybUl0ZW1SZW5kZXIiLCJpdGVtVmFsdWUiLCJkZWZhdWx0QnV0dG9uSXRlbVJlbmRlciIsImRlZmF1bHRCdXR0b25zSXRlbVJlbmRlciIsImNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QiLCJpc0VkaXQiLCJyZW5kZXJQcm9wZXJ0eSIsImNyZWF0ZUV4cG9ydE1ldGhvZCIsInZhbHVlTWV0aG9kIiwiY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyIiwicmVuZGVyTWFwIiwiQUF1dG9Db21wbGV0ZSIsImF1dG9mb2N1cyIsInJlbmRlckRlZmF1bHQiLCJyZW5kZXJFZGl0IiwicmVuZGVyRmlsdGVyIiwiZmlsdGVyTWV0aG9kIiwicmVuZGVySXRlbSIsIkFJbnB1dCIsIkFJbnB1dE51bWJlciIsIkFTZWxlY3QiLCJncm91cExhYmVsIiwiZ3JvdXAiLCJnSW5kZXgiLCJzbG90IiwiY29uY2F0IiwicmVuZGVyQ2VsbCIsImZpbHRlclJlbmRlciIsImlzQXJyYXkiLCJpbmNsdWRlQXJyYXlzIiwiaW5kZXhPZiIsImNlbGxFeHBvcnRNZXRob2QiLCJlZGl0Q2VsbEV4cG9ydE1ldGhvZCIsIkFDYXNjYWRlciIsIkFEYXRlUGlja2VyIiwiQU1vbnRoUGlja2VyIiwiQVJhbmdlUGlja2VyIiwiQVdlZWtQaWNrZXIiLCJBVGltZVBpY2tlciIsIkFUcmVlU2VsZWN0IiwiQVJhdGUiLCJBU3dpdGNoIiwiaXNCb29sZWFuIiwiQVJhZGlvIiwiQUNoZWNrYm94IiwiQUJ1dHRvbiIsIkFCdXR0b25zIiwiZ2V0RXZlbnRUYXJnZXROb2RlIiwiZXZudCIsImNvbnRhaW5lciIsImNsYXNzTmFtZSIsInRhcmdldEVsZW0iLCJ0YXJnZXQiLCJub2RlVHlwZSIsImRvY3VtZW50Iiwic3BsaXQiLCJmbGFnIiwicGFyZW50Tm9kZSIsImhhbmRsZUNsZWFyRXZlbnQiLCJib2R5RWxlbSIsImJvZHkiLCJWWEVUYWJsZVBsdWdpbkFudGQiLCJpbnN0YWxsIiwiaW50ZXJjZXB0b3IiLCJyZW5kZXJlciIsIm1peGluIiwiYWRkIiwid2luZG93IiwiVlhFVGFibGUiLCJ1c2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7Ozs7O0FBbUJBO0FBRUEsU0FBU0EsWUFBVCxDQUF1QkMsU0FBdkIsRUFBcUM7QUFDbkMsU0FBT0EsU0FBUyxLQUFLLElBQWQsSUFBc0JBLFNBQVMsS0FBS0MsU0FBcEMsSUFBaURELFNBQVMsS0FBSyxFQUF0RTtBQUNEOztBQUVELFNBQVNFLFlBQVQsQ0FBdUJDLFVBQXZCLEVBQWdEO0FBQzlDLE1BQUlDLElBQUksR0FBRyxPQUFYOztBQUNBLFVBQVFELFVBQVUsQ0FBQ0UsSUFBbkI7QUFDRSxTQUFLLFNBQUw7QUFDRUQsTUFBQUEsSUFBSSxHQUFHLFNBQVA7QUFDQTtBQUhKOztBQUtBLFNBQU9BLElBQVA7QUFDRDs7QUFFRCxTQUFTRSxhQUFULENBQXdCSCxVQUF4QixFQUFpRDtBQUMvQyxNQUFJSSxJQUFJLEdBQUcsUUFBWDs7QUFDQSxVQUFRSixVQUFVLENBQUNFLElBQW5C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QTJCLFFBQTNCQSxRQUEyQjtBQUNqREEsSUFBQUEsUUFBUSxDQUFDQyxLQUFULENBQWV2RCxTQUFmO0FBQ0FxRCxJQUFBQSxXQUFXLENBQUNHLEdBQVosQ0FBZ0IsbUJBQWhCLEVBQXFDUixnQkFBckM7QUFDQUssSUFBQUEsV0FBVyxDQUFDRyxHQUFaLENBQWdCLG9CQUFoQixFQUFzQ1IsZ0JBQXRDO0FBQ0Q7QUFMK0IsQ0FBM0I7OztBQVFQLElBQUksT0FBT1MsTUFBUCxLQUFrQixXQUFsQixJQUFpQ0EsTUFBTSxDQUFDQyxRQUE1QyxFQUFzRDtBQUNwREQsRUFBQUEsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxHQUFoQixDQUFvQlIsa0JBQXBCO0FBQ0Q7O2VBRWNBLGtCIiwiZmlsZSI6ImluZGV4LmNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbmltcG9ydCB7IENyZWF0ZUVsZW1lbnQgfSBmcm9tICd2dWUnXHJcbmltcG9ydCBYRVV0aWxzIGZyb20gJ3hlLXV0aWxzL21ldGhvZHMveGUtdXRpbHMnXHJcbmltcG9ydCB7XHJcbiAgVlhFVGFibGUsXHJcbiAgUmVuZGVyUGFyYW1zLFxyXG4gIE9wdGlvblByb3BzLFxyXG4gIFJlbmRlck9wdGlvbnMsXHJcbiAgVGFibGVSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRmlsdGVyUGFyYW1zLFxyXG4gIENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsXHJcbiAgQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsXHJcbiAgQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMsXHJcbiAgRm9ybUl0ZW1SZW5kZXJPcHRpb25zLFxyXG4gIENvbHVtbkNlbGxSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRWRpdFJlbmRlclBhcmFtcyxcclxuICBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRmlsdGVyTWV0aG9kUGFyYW1zLFxyXG4gIENvbHVtbkV4cG9ydENlbGxSZW5kZXJQYXJhbXMsXHJcbiAgRm9ybUl0ZW1SZW5kZXJQYXJhbXNcclxufSBmcm9tICd2eGUtdGFibGUvbGliL3Z4ZS10YWJsZSdcclxuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5cclxuZnVuY3Rpb24gaXNFbXB0eVZhbHVlIChjZWxsVmFsdWU6IGFueSkge1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPT09IG51bGwgfHwgY2VsbFZhbHVlID09PSB1bmRlZmluZWQgfHwgY2VsbFZhbHVlID09PSAnJ1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRNb2RlbFByb3AgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMpIHtcclxuICBsZXQgcHJvcCA9ICd2YWx1ZSdcclxuICBzd2l0Y2ggKHJlbmRlck9wdHMubmFtZSkge1xyXG4gICAgY2FzZSAnQVN3aXRjaCc6XHJcbiAgICAgIHByb3AgPSAnY2hlY2tlZCdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIHByb3BcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TW9kZWxFdmVudCAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucykge1xyXG4gIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICBzd2l0Y2ggKHJlbmRlck9wdHMubmFtZSkge1xyXG4gICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgdHlwZSA9ICdjaGFuZ2UudmFsdWUnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBUmFkaW8nOlxyXG4gICAgY2FzZSAnQUNoZWNrYm94JzpcclxuICAgICAgdHlwZSA9ICdpbnB1dCdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIHR5cGVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2hhbmdlRXZlbnQgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMpIHtcclxuICByZXR1cm4gJ2NoYW5nZSdcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBUYWJsZVJlbmRlclBhcmFtcywgdmFsdWU6IGFueSwgZGVmYXVsdFByb3BzPzogeyBbcHJvcDogc3RyaW5nXTogYW55IH0pIHtcclxuICBjb25zdCB7IHZTaXplIH0gPSBwYXJhbXMuJHRhYmxlXHJcbiAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKHZTaXplID8geyBzaXplOiB2U2l6ZSB9IDoge30sIGRlZmF1bHRQcm9wcywgcmVuZGVyT3B0cy5wcm9wcywgeyBbZ2V0TW9kZWxQcm9wKHJlbmRlck9wdHMpXTogdmFsdWUgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SXRlbVByb3BzIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zLCB2YWx1ZTogYW55LCBkZWZhdWx0UHJvcHM/OiB7IFtwcm9wOiBzdHJpbmddOiBhbnkgfSkge1xyXG4gIGNvbnN0IHsgdlNpemUgfSA9IHBhcmFtcy4kZm9ybVxyXG4gIHJldHVybiBYRVV0aWxzLmFzc2lnbih2U2l6ZSA/IHsgc2l6ZTogdlNpemUgfSA6IHt9LCBkZWZhdWx0UHJvcHMsIHJlbmRlck9wdHMucHJvcHMsIHsgW2dldE1vZGVsUHJvcChyZW5kZXJPcHRzKV06IHZhbHVlIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE9ucyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBSZW5kZXJQYXJhbXMsIGlucHV0RnVuYz86IEZ1bmN0aW9uLCBjaGFuZ2VGdW5jPzogRnVuY3Rpb24pIHtcclxuICBjb25zdCB7IGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IG1vZGVsRXZlbnQgPSBnZXRNb2RlbEV2ZW50KHJlbmRlck9wdHMpXHJcbiAgY29uc3QgY2hhbmdlRXZlbnQgPSBnZXRDaGFuZ2VFdmVudChyZW5kZXJPcHRzKVxyXG4gIGNvbnN0IGlzU2FtZUV2ZW50ID0gY2hhbmdlRXZlbnQgPT09IG1vZGVsRXZlbnRcclxuICBjb25zdCBvbnM6IHsgW3R5cGU6IHN0cmluZ106IEZ1bmN0aW9uIH0gPSB7fVxyXG4gIFhFVXRpbHMub2JqZWN0RWFjaChldmVudHMsIChmdW5jOiBGdW5jdGlvbiwga2V5OiBzdHJpbmcpID0+IHtcclxuICAgIG9uc1trZXldID0gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGZ1bmMocGFyYW1zLCAuLi5hcmdzKVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgaWYgKGlucHV0RnVuYykge1xyXG4gICAgb25zW21vZGVsRXZlbnRdID0gZnVuY3Rpb24gKGFyZ3MxOiBhbnkpIHtcclxuICAgICAgaW5wdXRGdW5jKGFyZ3MxKVxyXG4gICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1ttb2RlbEV2ZW50XSkge1xyXG4gICAgICAgIGV2ZW50c1ttb2RlbEV2ZW50XShhcmdzMSlcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXNTYW1lRXZlbnQgJiYgY2hhbmdlRnVuYykge1xyXG4gICAgICAgIGNoYW5nZUZ1bmMoYXJnczEpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgaWYgKCFpc1NhbWVFdmVudCAmJiBjaGFuZ2VGdW5jKSB7XHJcbiAgICBvbnNbY2hhbmdlRXZlbnRdID0gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGNoYW5nZUZ1bmMoLi4uYXJncylcclxuICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbY2hhbmdlRXZlbnRdKSB7XHJcbiAgICAgICAgZXZlbnRzW2NoYW5nZUV2ZW50XShwYXJhbXMsIC4uLmFyZ3MpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG9uc1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFZGl0T25zIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7ICR0YWJsZSwgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIHJldHVybiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zLCAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgLy8g5aSE55CGIG1vZGVsIOWAvOWPjOWQkee7keWumlxyXG4gICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIHZhbHVlKVxyXG4gIH0sICgpID0+IHtcclxuICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAkdGFibGUudXBkYXRlU3RhdHVzKHBhcmFtcylcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGaWx0ZXJPbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zLCBvcHRpb246IENvbHVtbkZpbHRlclBhcmFtcywgY2hhbmdlRnVuYzogRnVuY3Rpb24pIHtcclxuICByZXR1cm4gZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcywgKHZhbHVlOiBhbnkpID0+IHtcclxuICAgIC8vIOWkhOeQhiBtb2RlbCDlgLzlj4zlkJHnu5HlrppcclxuICAgIG9wdGlvbi5kYXRhID0gdmFsdWVcclxuICB9LCBjaGFuZ2VGdW5jKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJdGVtT25zIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyAkZm9ybSwgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xyXG4gIHJldHVybiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zLCAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgLy8g5aSE55CGIG1vZGVsIOWAvOWPjOWQkee7keWumlxyXG4gICAgWEVVdGlscy5zZXQoZGF0YSwgcHJvcGVydHksIHZhbHVlKVxyXG4gIH0sICgpID0+IHtcclxuICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAkZm9ybS51cGRhdGVTdGF0dXMocGFyYW1zKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hdGNoQ2FzY2FkZXJEYXRhIChpbmRleDogbnVtYmVyLCBsaXN0OiBhbnlbXSwgdmFsdWVzOiBhbnlbXSwgbGFiZWxzOiBhbnlbXSkge1xyXG4gIGNvbnN0IHZhbCA9IHZhbHVlc1tpbmRleF1cclxuICBpZiAobGlzdCAmJiB2YWx1ZXMubGVuZ3RoID4gaW5kZXgpIHtcclxuICAgIFhFVXRpbHMuZWFjaChsaXN0LCAoaXRlbSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS52YWx1ZSA9PT0gdmFsKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goaXRlbS5sYWJlbClcclxuICAgICAgICBtYXRjaENhc2NhZGVyRGF0YSgrK2luZGV4LCBpdGVtLmNoaWxkcmVuLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdERhdGVQaWNrZXIgKGRlZmF1bHRGb3JtYXQ6IHN0cmluZykge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zLCBkZWZhdWx0Rm9ybWF0KSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNlbGVjdENlbGxWYWx1ZSAocmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIHByb3BzID0ge30sIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGNvbnN0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICBjb25zdCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gIGNvbnN0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmICghaXNFbXB0eVZhbHVlKGNlbGxWYWx1ZSkpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLm1hcChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnID8gY2VsbFZhbHVlIDogW2NlbGxWYWx1ZV0sIG9wdGlvbkdyb3VwcyA/ICh2YWx1ZSkgPT4ge1xyXG4gICAgICBsZXQgc2VsZWN0SXRlbVxyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb3B0aW9uR3JvdXBzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgIHNlbGVjdEl0ZW0gPSBYRVV0aWxzLmZpbmQob3B0aW9uR3JvdXBzW2luZGV4XVtncm91cE9wdGlvbnNdLCAoaXRlbSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgICBpZiAoc2VsZWN0SXRlbSkge1xyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZVxyXG4gICAgfSA6ICh2YWx1ZSkgPT4ge1xyXG4gICAgICBjb25zdCBzZWxlY3RJdGVtID0gWEVVdGlscy5maW5kKG9wdGlvbnMsIChpdGVtKSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICByZXR1cm4gc2VsZWN0SXRlbSA/IHNlbGVjdEl0ZW1bbGFiZWxQcm9wXSA6IHZhbHVlXHJcbiAgICB9KS5qb2luKCcsICcpXHJcbiAgfVxyXG4gIHJldHVybiBudWxsXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhc2NhZGVyQ2VsbFZhbHVlIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICB2YXIgdmFsdWVzID0gY2VsbFZhbHVlIHx8IFtdXHJcbiAgdmFyIGxhYmVsczogQXJyYXk8YW55PiA9IFtdXHJcbiAgbWF0Y2hDYXNjYWRlckRhdGEoMCwgcHJvcHMub3B0aW9ucywgdmFsdWVzLCBsYWJlbHMpXHJcbiAgcmV0dXJuIChwcm9wcy5zaG93QWxsTGV2ZWxzID09PSBmYWxzZSA/IGxhYmVscy5zbGljZShsYWJlbHMubGVuZ3RoIC0gMSwgbGFiZWxzLmxlbmd0aCkgOiBsYWJlbHMpLmpvaW4oYCAke3Byb3BzLnNlcGFyYXRvciB8fCAnLyd9IGApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgY2VsbFZhbHVlID0gWEVVdGlscy5tYXAoY2VsbFZhbHVlLCAoZGF0ZSkgPT4gZGF0ZS5mb3JtYXQocHJvcHMuZm9ybWF0IHx8ICdZWVlZLU1NLUREJykpLmpvaW4oJyB+ICcpXHJcbiAgfVxyXG4gIHJldHVybiBjZWxsVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyB0cmVlRGF0YSwgdHJlZUNoZWNrYWJsZSB9ID0gcHJvcHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKCFpc0VtcHR5VmFsdWUoY2VsbFZhbHVlKSkge1xyXG4gICAgcmV0dXJuIFhFVXRpbHMubWFwKHRyZWVDaGVja2FibGUgPyBjZWxsVmFsdWUgOiBbY2VsbFZhbHVlXSwgKHZhbHVlKSA9PiB7XHJcbiAgICAgIGNvbnN0IG1hdGNoT2JqID0gWEVVdGlscy5maW5kVHJlZSh0cmVlRGF0YSwgKGl0ZW0pID0+IGl0ZW0udmFsdWUgPT09IHZhbHVlLCB7IGNoaWxkcmVuOiAnY2hpbGRyZW4nIH0pXHJcbiAgICAgIHJldHVybiBtYXRjaE9iaiA/IG1hdGNoT2JqLml0ZW0udGl0bGUgOiB2YWx1ZVxyXG4gICAgfSkuam9pbignLCAnKVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhdGVQaWNrZXJDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcyB8IENvbHVtbkV4cG9ydENlbGxSZW5kZXJQYXJhbXMsIGRlZmF1bHRGb3JtYXQ6IHN0cmluZykge1xyXG4gIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoY2VsbFZhbHVlKSB7XHJcbiAgICBjZWxsVmFsdWUgPSBjZWxsVmFsdWUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCBkZWZhdWx0Rm9ybWF0KVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUVkaXRSZW5kZXIgKGRlZmF1bHRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkVkaXRSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKHJlbmRlck9wdHMubmFtZSwge1xyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgY2VsbFZhbHVlLCBkZWZhdWx0UHJvcHMpLFxyXG4gICAgICAgIG9uOiBnZXRFZGl0T25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgfSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIHJldHVybiBbXHJcbiAgICBoKCdhLWJ1dHRvbicsIHtcclxuICAgICAgYXR0cnMsXHJcbiAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgbnVsbCksXHJcbiAgICAgIG9uOiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgfSwgY2VsbFRleHQoaCwgcmVuZGVyT3B0cy5jb250ZW50KSlcclxuICBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gIHJldHVybiByZW5kZXJPcHRzLmNoaWxkcmVuLm1hcCgoY2hpbGRSZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucykgPT4gZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIoaCwgY2hpbGRSZW5kZXJPcHRzLCBwYXJhbXMpWzBdKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGaWx0ZXJSZW5kZXIgKGRlZmF1bHRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IG5hbWUsIGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhXHJcbiAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICBrZXk6IG9JbmRleCxcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlLCBkZWZhdWx0UHJvcHMpLFxyXG4gICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcclxuICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKHBhcmFtcywgISFvcHRpb24uZGF0YSwgb3B0aW9uKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ29uZmlybUZpbHRlciAocGFyYW1zOiBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMsIGNoZWNrZWQ6IGJvb2xlYW4sIG9wdGlvbjogQ29sdW1uRmlsdGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyAkcGFuZWwgfSA9IHBhcmFtc1xyXG4gICRwYW5lbC5jaGFuZ2VPcHRpb24oe30sIGNoZWNrZWQsIG9wdGlvbilcclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEZpbHRlck1ldGhvZCAocGFyYW1zOiBDb2x1bW5GaWx0ZXJNZXRob2RQYXJhbXMpIHtcclxuICBjb25zdCB7IG9wdGlvbiwgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gZGF0YVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJPcHRpb25zIChoOiBDcmVhdGVFbGVtZW50LCBvcHRpb25zOiBhbnlbXSwgb3B0aW9uUHJvcHM6IE9wdGlvblByb3BzKSB7XHJcbiAgY29uc3QgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gIGNvbnN0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICBjb25zdCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgcmV0dXJuIFhFVXRpbHMubWFwKG9wdGlvbnMsIChpdGVtLCBvSW5kZXgpID0+IHtcclxuICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHRpb24nLCB7XHJcbiAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICBwcm9wczoge1xyXG4gICAgICAgIHZhbHVlOiBpdGVtW3ZhbHVlUHJvcF0sXHJcbiAgICAgICAgZGlzYWJsZWQ6IGl0ZW1bZGlzYWJsZWRQcm9wXVxyXG4gICAgICB9XHJcbiAgICB9LCBpdGVtW2xhYmVsUHJvcF0pXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2VsbFRleHQgKGg6IENyZWF0ZUVsZW1lbnQsIGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgcmV0dXJuIFsnJyArIChpc0VtcHR5VmFsdWUoY2VsbFZhbHVlKSA/ICcnIDogY2VsbFZhbHVlKV1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRm9ybUl0ZW1SZW5kZXIgKGRlZmF1bHRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IG5hbWUgfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChuYW1lLCB7XHJcbiAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgcHJvcHM6IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGl0ZW1WYWx1ZSwgZGVmYXVsdFByb3BzKSxcclxuICAgICAgICBvbjogZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0pXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHByb3BzID0gZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgbnVsbClcclxuICByZXR1cm4gW1xyXG4gICAgaCgnYS1idXR0b24nLCB7XHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBwcm9wcyxcclxuICAgICAgb246IGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICB9LCBjZWxsVGV4dChoLCByZW5kZXJPcHRzLmNvbnRlbnQgfHwgcHJvcHMuY29udGVudCkpXHJcbiAgXVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gIHJldHVybiByZW5kZXJPcHRzLmNoaWxkcmVuLm1hcCgoY2hpbGRSZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMpID0+IGRlZmF1bHRCdXR0b25JdGVtUmVuZGVyKGgsIGNoaWxkUmVuZGVyT3B0cywgcGFyYW1zKVswXSlcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCAoZGVmYXVsdEZvcm1hdDogc3RyaW5nLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogQ29sdW1uRXhwb3J0Q2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgcmV0dXJuIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocGFyYW1zLmNvbHVtbltyZW5kZXJQcm9wZXJ0eV0sIHBhcmFtcywgZGVmYXVsdEZvcm1hdClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUV4cG9ydE1ldGhvZCAodmFsdWVNZXRob2Q6IEZ1bmN0aW9uLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogQ29sdW1uRXhwb3J0Q2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgcmV0dXJuIHZhbHVlTWV0aG9kKHBhcmFtcy5jb2x1bW5bcmVuZGVyUHJvcGVydHldLCBwYXJhbXMpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIgKCkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IG5hbWUsIG9wdGlvbnMgPSBbXSwgb3B0aW9uUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICBjb25zdCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgICBjb25zdCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgICBjb25zdCBpdGVtVmFsdWUgPSBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSlcclxuICAgIHJldHVybiBbXHJcbiAgICAgIGgoYCR7bmFtZX1Hcm91cGAsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlKSxcclxuICAgICAgICBvbjogZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0sIG9wdGlvbnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgdmFsdWU6IG9wdGlvblt2YWx1ZVByb3BdLFxyXG4gICAgICAgICAgICBkaXNhYmxlZDogb3B0aW9uW2Rpc2FibGVkUHJvcF1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBvcHRpb25bbGFiZWxQcm9wXSlcclxuICAgICAgfSkpXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5riy5p+T5Ye95pWwXHJcbiAqL1xyXG5jb25zdCByZW5kZXJNYXAgPSB7XHJcbiAgQUF1dG9Db21wbGV0ZToge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBSW5wdXQ6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUlucHV0TnVtYmVyOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQtbnVtYmVyLWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0IChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgY29uc3QgcHJvcHMgPSBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgY2VsbFZhbHVlKVxyXG4gICAgICBjb25zdCBvbiA9IGdldEVkaXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGNvbnN0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgb25cclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG9uXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJGaWx0ZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBjb25zdCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcclxuICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKSxcclxuICAgICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIG9wdGlvbi5kYXRhICYmIG9wdGlvbi5kYXRhLmxlbmd0aCA+IDAsIG9wdGlvbilcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhXHJcbiAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uVmFsdWUpLFxyXG4gICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKHBhcmFtcywgb3B0aW9uLmRhdGEgJiYgb3B0aW9uLmRhdGEubGVuZ3RoID4gMCwgb3B0aW9uKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBmaWx0ZXJNZXRob2QgKHBhcmFtczogQ29sdW1uRmlsdGVyTWV0aG9kUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9uLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgICAgIGNvbnN0IHsgcHJvcGVydHksIGZpbHRlclJlbmRlcjogcmVuZGVyT3B0cyB9ID0gY29sdW1uXHJcbiAgICAgIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIHByb3BlcnR5KVxyXG4gICAgICBpZiAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJykge1xyXG4gICAgICAgIGlmIChYRVV0aWxzLmlzQXJyYXkoY2VsbFZhbHVlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIFhFVXRpbHMuaW5jbHVkZUFycmF5cyhjZWxsVmFsdWUsIGRhdGEpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhLmluZGV4T2YoY2VsbFZhbHVlKSA+IC0xXHJcbiAgICAgIH1cclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgICAgIHJldHVybiBjZWxsVmFsdWUgPT0gZGF0YVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW0gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gICAgICBjb25zdCB7IG9wdGlvbnMgPSBbXSwgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgaXRlbVZhbHVlID0gWEVVdGlscy5nZXQoZGF0YSwgcHJvcGVydHkpXHJcbiAgICAgIGNvbnN0IHByb3BzID0gZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlKVxyXG4gICAgICBjb25zdCBvbiA9IGdldEl0ZW1PbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGNvbnN0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgb25cclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIG9uXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0U2VsZWN0Q2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0U2VsZWN0Q2VsbFZhbHVlLCB0cnVlKVxyXG4gIH0sXHJcbiAgQUNhc2NhZGVyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRDYXNjYWRlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0Q2FzY2FkZXJDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRDYXNjYWRlckNlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFEYXRlUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NLUREJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTS1ERCcpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0tREQnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQU1vbnRoUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTScpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0nLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVJhbmdlUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFXZWVrUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLVdX5ZGoJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1XV+WRqCcpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktV1flkagnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVRpbWVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ0hIOm1tOnNzJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnSEg6bW06c3MnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdISDptbTpzcycsIHRydWUpXHJcbiAgfSxcclxuICBBVHJlZVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFRyZWVTZWxlY3RDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBUmF0ZToge1xyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFTd2l0Y2g6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRmlsdGVyUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgY29uc3QgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBjb25zdCB7IG5hbWUsIGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZGF0YVxyXG4gICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKSxcclxuICAgICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcclxuICAgICAgICAgICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIFhFVXRpbHMuaXNCb29sZWFuKG9wdGlvbi5kYXRhKSwgb3B0aW9uKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFSYWRpbzoge1xyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyKClcclxuICB9LFxyXG4gIEFDaGVja2JveDoge1xyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyKClcclxuICB9LFxyXG4gIEFCdXR0b246IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJJdGVtOiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlclxyXG4gIH0sXHJcbiAgQUJ1dHRvbnM6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckl0ZW06IGRlZmF1bHRCdXR0b25zSXRlbVJlbmRlclxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOajgOafpeinpuWPkea6kOaYr+WQpuWxnuS6juebruagh+iKgueCuVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0RXZlbnRUYXJnZXROb2RlIChldm50OiBhbnksIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgbGV0IHRhcmdldEVsZW1cclxuICBsZXQgdGFyZ2V0ID0gZXZudC50YXJnZXRcclxuICB3aGlsZSAodGFyZ2V0ICYmIHRhcmdldC5ub2RlVHlwZSAmJiB0YXJnZXQgIT09IGRvY3VtZW50KSB7XHJcbiAgICBpZiAoY2xhc3NOYW1lICYmIHRhcmdldC5jbGFzc05hbWUgJiYgdGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCAmJiB0YXJnZXQuY2xhc3NOYW1lLnNwbGl0KCcgJykuaW5kZXhPZihjbGFzc05hbWUpID4gLTEpIHtcclxuICAgICAgdGFyZ2V0RWxlbSA9IHRhcmdldFxyXG4gICAgfSBlbHNlIGlmICh0YXJnZXQgPT09IGNvbnRhaW5lcikge1xyXG4gICAgICByZXR1cm4geyBmbGFnOiBjbGFzc05hbWUgPyAhIXRhcmdldEVsZW0gOiB0cnVlLCBjb250YWluZXIsIHRhcmdldEVsZW06IHRhcmdldEVsZW0gfVxyXG4gICAgfVxyXG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGVcclxuICB9XHJcbiAgcmV0dXJuIHsgZmxhZzogZmFsc2UgfVxyXG59XHJcblxyXG4vKipcclxuICog5LqL5Lu25YW85a655oCn5aSE55CGXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVDbGVhckV2ZW50IChwYXJhbXM6IFRhYmxlUmVuZGVyUGFyYW1zLCBldm50OiBhbnkpIHtcclxuICBjb25zdCBib2R5RWxlbTogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5ib2R5XHJcbiAgaWYgKFxyXG4gICAgLy8g5LiL5ouJ5qGGXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtc2VsZWN0LWRyb3Bkb3duJykuZmxhZyB8fFxyXG4gICAgLy8g57qn6IGUXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FzY2FkZXItbWVudXMnKS5mbGFnIHx8XHJcbiAgICAvLyDml6XmnJ9cclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYWxlbmRhci1waWNrZXItY29udGFpbmVyJykuZmxhZyB8fFxyXG4gICAgLy8g5pe26Ze06YCJ5oupXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtdGltZS1waWNrZXItcGFuZWwnKS5mbGFnXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDln7rkuo4gdnhlLXRhYmxlIOihqOagvOeahOmAgumFjeaPkuS7tu+8jOeUqOS6juWFvOWuuSBhbnQtZGVzaWduLXZ1ZSDnu4Tku7blupNcclxuICovXHJcbmV4cG9ydCBjb25zdCBWWEVUYWJsZVBsdWdpbkFudGQgPSB7XHJcbiAgaW5zdGFsbCAoeyBpbnRlcmNlcHRvciwgcmVuZGVyZXIgfTogdHlwZW9mIFZYRVRhYmxlKSB7XHJcbiAgICByZW5kZXJlci5taXhpbihyZW5kZXJNYXApXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyRmlsdGVyJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJBY3RpdmVkJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICB9XHJcbn1cclxuXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVlhFVGFibGUpIHtcclxuICB3aW5kb3cuVlhFVGFibGUudXNlKFZYRVRhYmxlUGx1Z2luQW50ZClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5BbnRkXHJcbiJdfQ==
