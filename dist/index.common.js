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


function handleClearEvent(params, e) {
  var bodyElem = document.body;
  var evnt = params.$event || e;

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsImNlbGxWYWx1ZSIsInVuZGVmaW5lZCIsImdldE1vZGVsUHJvcCIsInJlbmRlck9wdHMiLCJwcm9wIiwibmFtZSIsImdldE1vZGVsRXZlbnQiLCJ0eXBlIiwiZ2V0Q2hhbmdlRXZlbnQiLCJnZXRDZWxsRWRpdEZpbHRlclByb3BzIiwicGFyYW1zIiwidmFsdWUiLCJkZWZhdWx0UHJvcHMiLCJ2U2l6ZSIsIiR0YWJsZSIsIlhFVXRpbHMiLCJhc3NpZ24iLCJzaXplIiwicHJvcHMiLCJnZXRJdGVtUHJvcHMiLCIkZm9ybSIsImdldE9ucyIsImlucHV0RnVuYyIsImNoYW5nZUZ1bmMiLCJldmVudHMiLCJtb2RlbEV2ZW50IiwiY2hhbmdlRXZlbnQiLCJpc1NhbWVFdmVudCIsIm9ucyIsIm9iamVjdEVhY2giLCJmdW5jIiwia2V5IiwiYXJncyIsImFyZ3MxIiwiZ2V0RWRpdE9ucyIsInJvdyIsImNvbHVtbiIsInNldCIsInByb3BlcnR5IiwidXBkYXRlU3RhdHVzIiwiZ2V0RmlsdGVyT25zIiwib3B0aW9uIiwiZGF0YSIsImdldEl0ZW1PbnMiLCJtYXRjaENhc2NhZGVyRGF0YSIsImluZGV4IiwibGlzdCIsInZhbHVlcyIsImxhYmVscyIsInZhbCIsImxlbmd0aCIsImVhY2giLCJpdGVtIiwicHVzaCIsImxhYmVsIiwiY2hpbGRyZW4iLCJmb3JtYXREYXRlUGlja2VyIiwiZGVmYXVsdEZvcm1hdCIsImgiLCJjZWxsVGV4dCIsImdldERhdGVQaWNrZXJDZWxsVmFsdWUiLCJnZXRTZWxlY3RDZWxsVmFsdWUiLCJvcHRpb25zIiwib3B0aW9uR3JvdXBzIiwib3B0aW9uUHJvcHMiLCJvcHRpb25Hcm91cFByb3BzIiwibGFiZWxQcm9wIiwidmFsdWVQcm9wIiwiZ3JvdXBPcHRpb25zIiwiZ2V0IiwibWFwIiwibW9kZSIsInNlbGVjdEl0ZW0iLCJmaW5kIiwiam9pbiIsImdldENhc2NhZGVyQ2VsbFZhbHVlIiwic2hvd0FsbExldmVscyIsInNsaWNlIiwic2VwYXJhdG9yIiwiZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUiLCJkYXRlIiwiZm9ybWF0IiwiZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSIsInRyZWVEYXRhIiwidHJlZUNoZWNrYWJsZSIsIm1hdGNoT2JqIiwiZmluZFRyZWUiLCJ0aXRsZSIsImNyZWF0ZUVkaXRSZW5kZXIiLCJhdHRycyIsIm9uIiwiZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIiLCJjb250ZW50IiwiZGVmYXVsdEJ1dHRvbnNFZGl0UmVuZGVyIiwiY2hpbGRSZW5kZXJPcHRzIiwiY3JlYXRlRmlsdGVyUmVuZGVyIiwiZmlsdGVycyIsIm9JbmRleCIsIm9wdGlvblZhbHVlIiwiaGFuZGxlQ29uZmlybUZpbHRlciIsImNoZWNrZWQiLCIkcGFuZWwiLCJjaGFuZ2VPcHRpb24iLCJkZWZhdWx0RmlsdGVyTWV0aG9kIiwicmVuZGVyT3B0aW9ucyIsImRpc2FibGVkUHJvcCIsImRpc2FibGVkIiwiY3JlYXRlRm9ybUl0ZW1SZW5kZXIiLCJpdGVtVmFsdWUiLCJkZWZhdWx0QnV0dG9uSXRlbVJlbmRlciIsImRlZmF1bHRCdXR0b25zSXRlbVJlbmRlciIsImNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QiLCJpc0VkaXQiLCJyZW5kZXJQcm9wZXJ0eSIsImNyZWF0ZUV4cG9ydE1ldGhvZCIsInZhbHVlTWV0aG9kIiwiY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyIiwicmVuZGVyTWFwIiwiQUF1dG9Db21wbGV0ZSIsImF1dG9mb2N1cyIsInJlbmRlckRlZmF1bHQiLCJyZW5kZXJFZGl0IiwicmVuZGVyRmlsdGVyIiwiZmlsdGVyTWV0aG9kIiwicmVuZGVySXRlbSIsIkFJbnB1dCIsIkFJbnB1dE51bWJlciIsIkFTZWxlY3QiLCJncm91cExhYmVsIiwiZ3JvdXAiLCJnSW5kZXgiLCJzbG90IiwiY29uY2F0IiwicmVuZGVyQ2VsbCIsImZpbHRlclJlbmRlciIsImlzQXJyYXkiLCJpbmNsdWRlQXJyYXlzIiwiaW5kZXhPZiIsImNlbGxFeHBvcnRNZXRob2QiLCJlZGl0Q2VsbEV4cG9ydE1ldGhvZCIsIkFDYXNjYWRlciIsIkFEYXRlUGlja2VyIiwiQU1vbnRoUGlja2VyIiwiQVJhbmdlUGlja2VyIiwiQVdlZWtQaWNrZXIiLCJBVGltZVBpY2tlciIsIkFUcmVlU2VsZWN0IiwiQVJhdGUiLCJBU3dpdGNoIiwiaXNCb29sZWFuIiwiQVJhZGlvIiwiQUNoZWNrYm94IiwiQUJ1dHRvbiIsIkFCdXR0b25zIiwiZ2V0RXZlbnRUYXJnZXROb2RlIiwiZXZudCIsImNvbnRhaW5lciIsImNsYXNzTmFtZSIsInRhcmdldEVsZW0iLCJ0YXJnZXQiLCJub2RlVHlwZSIsImRvY3VtZW50Iiwic3BsaXQiLCJmbGFnIiwicGFyZW50Tm9kZSIsImhhbmRsZUNsZWFyRXZlbnQiLCJlIiwiYm9keUVsZW0iLCJib2R5IiwiJGV2ZW50IiwiVlhFVGFibGVQbHVnaW5BbnRkIiwiaW5zdGFsbCIsImludGVyY2VwdG9yIiwicmVuZGVyZXIiLCJtaXhpbiIsImFkZCIsIndpbmRvdyIsIlZYRVRhYmxlIiwidXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7Ozs7OztBQW9CQTtBQUVBLFNBQVNBLFlBQVQsQ0FBdUJDLFNBQXZCLEVBQXFDO0FBQ25DLFNBQU9BLFNBQVMsS0FBSyxJQUFkLElBQXNCQSxTQUFTLEtBQUtDLFNBQXBDLElBQWlERCxTQUFTLEtBQUssRUFBdEU7QUFDRDs7QUFFRCxTQUFTRSxZQUFULENBQXVCQyxVQUF2QixFQUFnRDtBQUM5QyxNQUFJQyxJQUFJLEdBQUcsT0FBWDs7QUFDQSxVQUFRRCxVQUFVLENBQUNFLElBQW5CO0FBQ0UsU0FBSyxTQUFMO0FBQ0VELE1BQUFBLElBQUksR0FBRyxTQUFQO0FBQ0E7QUFISjs7QUFLQSxTQUFPQSxJQUFQO0FBQ0Q7O0FBRUQsU0FBU0UsYUFBVCxDQUF3QkgsVUFBeEIsRUFBaUQ7QUFDL0MsTUFBSUksSUFBSSxHQUFHLFFBQVg7O0FBQ0EsVUFBUUosVUFBVSxDQUFDRSxJQUFuQjtBQUNFLFNBQUssUUFBTDtBQUNFRSxNQUFBQSxJQUFJLEdBQUcsY0FBUDtBQUNBOztBQUNGLFNBQUssUUFBTDtBQUNBLFNBQUssV0FBTDtBQUNFQSxNQUFBQSxJQUFJLEdBQUcsT0FBUDtBQUNBO0FBUEo7O0FBU0EsU0FBT0EsSUFBUDtBQUNEOztBQUVELFNBQVNDLGNBQVQsQ0FBeUJMLFVBQXpCLEVBQWtEO0FBQ2hELFNBQU8sUUFBUDtBQUNEOztBQUVELFNBQVNNLHNCQUFULENBQWlDTixVQUFqQyxFQUE0RE8sTUFBNUQsRUFBdUZDLEtBQXZGLEVBQW1HQyxZQUFuRyxFQUF5STtBQUFBLE1BQy9IQyxLQUQrSCxHQUNySEgsTUFBTSxDQUFDSSxNQUQ4RyxDQUMvSEQsS0FEK0g7QUFFdkksU0FBT0Usb0JBQVFDLE1BQVIsQ0FBZUgsS0FBSyxHQUFHO0FBQUVJLElBQUFBLElBQUksRUFBRUo7QUFBUixHQUFILEdBQXFCLEVBQXpDLEVBQTZDRCxZQUE3QyxFQUEyRFQsVUFBVSxDQUFDZSxLQUF0RSxzQkFBZ0ZoQixZQUFZLENBQUNDLFVBQUQsQ0FBNUYsRUFBMkdRLEtBQTNHLEVBQVA7QUFDRDs7QUFFRCxTQUFTUSxZQUFULENBQXVCaEIsVUFBdkIsRUFBa0RPLE1BQWxELEVBQWdGQyxLQUFoRixFQUE0RkMsWUFBNUYsRUFBa0k7QUFBQSxNQUN4SEMsS0FEd0gsR0FDOUdILE1BQU0sQ0FBQ1UsS0FEdUcsQ0FDeEhQLEtBRHdIO0FBRWhJLFNBQU9FLG9CQUFRQyxNQUFSLENBQWVILEtBQUssR0FBRztBQUFFSSxJQUFBQSxJQUFJLEVBQUVKO0FBQVIsR0FBSCxHQUFxQixFQUF6QyxFQUE2Q0QsWUFBN0MsRUFBMkRULFVBQVUsQ0FBQ2UsS0FBdEUsc0JBQWdGaEIsWUFBWSxDQUFDQyxVQUFELENBQTVGLEVBQTJHUSxLQUEzRyxFQUFQO0FBQ0Q7O0FBRUQsU0FBU1UsTUFBVCxDQUFpQmxCLFVBQWpCLEVBQTRDTyxNQUE1QyxFQUFrRVksU0FBbEUsRUFBd0ZDLFVBQXhGLEVBQTZHO0FBQUEsTUFDbkdDLE1BRG1HLEdBQ3hGckIsVUFEd0YsQ0FDbkdxQixNQURtRztBQUUzRyxNQUFNQyxVQUFVLEdBQUduQixhQUFhLENBQUNILFVBQUQsQ0FBaEM7QUFDQSxNQUFNdUIsV0FBVyxHQUFHbEIsY0FBYyxDQUFDTCxVQUFELENBQWxDO0FBQ0EsTUFBTXdCLFdBQVcsR0FBR0QsV0FBVyxLQUFLRCxVQUFwQztBQUNBLE1BQU1HLEdBQUcsR0FBaUMsRUFBMUM7O0FBQ0FiLHNCQUFRYyxVQUFSLENBQW1CTCxNQUFuQixFQUEyQixVQUFDTSxJQUFELEVBQWlCQyxHQUFqQixFQUFnQztBQUN6REgsSUFBQUEsR0FBRyxDQUFDRyxHQUFELENBQUgsR0FBVyxZQUF3QjtBQUFBLHdDQUFYQyxJQUFXO0FBQVhBLFFBQUFBLElBQVc7QUFBQTs7QUFDakNGLE1BQUFBLElBQUksTUFBSixVQUFLcEIsTUFBTCxTQUFnQnNCLElBQWhCO0FBQ0QsS0FGRDtBQUdELEdBSkQ7O0FBS0EsTUFBSVYsU0FBSixFQUFlO0FBQ2JNLElBQUFBLEdBQUcsQ0FBQ0gsVUFBRCxDQUFILEdBQWtCLFVBQVVRLEtBQVYsRUFBb0I7QUFDcENYLE1BQUFBLFNBQVMsQ0FBQ1csS0FBRCxDQUFUOztBQUNBLFVBQUlULE1BQU0sSUFBSUEsTUFBTSxDQUFDQyxVQUFELENBQXBCLEVBQWtDO0FBQ2hDRCxRQUFBQSxNQUFNLENBQUNDLFVBQUQsQ0FBTixDQUFtQlEsS0FBbkI7QUFDRDs7QUFDRCxVQUFJTixXQUFXLElBQUlKLFVBQW5CLEVBQStCO0FBQzdCQSxRQUFBQSxVQUFVLENBQUNVLEtBQUQsQ0FBVjtBQUNEO0FBQ0YsS0FSRDtBQVNEOztBQUNELE1BQUksQ0FBQ04sV0FBRCxJQUFnQkosVUFBcEIsRUFBZ0M7QUFDOUJLLElBQUFBLEdBQUcsQ0FBQ0YsV0FBRCxDQUFILEdBQW1CLFlBQXdCO0FBQUEseUNBQVhNLElBQVc7QUFBWEEsUUFBQUEsSUFBVztBQUFBOztBQUN6Q1QsTUFBQUEsVUFBVSxNQUFWLFNBQWNTLElBQWQ7O0FBQ0EsVUFBSVIsTUFBTSxJQUFJQSxNQUFNLENBQUNFLFdBQUQsQ0FBcEIsRUFBbUM7QUFDakNGLFFBQUFBLE1BQU0sQ0FBQ0UsV0FBRCxDQUFOLE9BQUFGLE1BQU0sR0FBY2QsTUFBZCxTQUF5QnNCLElBQXpCLEVBQU47QUFDRDtBQUNGLEtBTEQ7QUFNRDs7QUFDRCxTQUFPSixHQUFQO0FBQ0Q7O0FBRUQsU0FBU00sVUFBVCxDQUFxQi9CLFVBQXJCLEVBQWdETyxNQUFoRCxFQUE4RTtBQUFBLE1BQ3BFSSxNQURvRSxHQUM1Q0osTUFENEMsQ0FDcEVJLE1BRG9FO0FBQUEsTUFDNURxQixHQUQ0RCxHQUM1Q3pCLE1BRDRDLENBQzVEeUIsR0FENEQ7QUFBQSxNQUN2REMsTUFEdUQsR0FDNUMxQixNQUQ0QyxDQUN2RDBCLE1BRHVEO0FBRTVFLFNBQU9mLE1BQU0sQ0FBQ2xCLFVBQUQsRUFBYU8sTUFBYixFQUFxQixVQUFDQyxLQUFELEVBQWU7QUFDL0M7QUFDQUksd0JBQVFzQixHQUFSLENBQVlGLEdBQVosRUFBaUJDLE1BQU0sQ0FBQ0UsUUFBeEIsRUFBa0MzQixLQUFsQztBQUNELEdBSFksRUFHVixZQUFLO0FBQ047QUFDQUcsSUFBQUEsTUFBTSxDQUFDeUIsWUFBUCxDQUFvQjdCLE1BQXBCO0FBQ0QsR0FOWSxDQUFiO0FBT0Q7O0FBRUQsU0FBUzhCLFlBQVQsQ0FBdUJyQyxVQUF2QixFQUFrRE8sTUFBbEQsRUFBb0YrQixNQUFwRixFQUFnSGxCLFVBQWhILEVBQW9JO0FBQ2xJLFNBQU9GLE1BQU0sQ0FBQ2xCLFVBQUQsRUFBYU8sTUFBYixFQUFxQixVQUFDQyxLQUFELEVBQWU7QUFDL0M7QUFDQThCLElBQUFBLE1BQU0sQ0FBQ0MsSUFBUCxHQUFjL0IsS0FBZDtBQUNELEdBSFksRUFHVlksVUFIVSxDQUFiO0FBSUQ7O0FBRUQsU0FBU29CLFVBQVQsQ0FBcUJ4QyxVQUFyQixFQUFnRE8sTUFBaEQsRUFBNEU7QUFBQSxNQUNsRVUsS0FEa0UsR0FDeENWLE1BRHdDLENBQ2xFVSxLQURrRTtBQUFBLE1BQzNEc0IsSUFEMkQsR0FDeENoQyxNQUR3QyxDQUMzRGdDLElBRDJEO0FBQUEsTUFDckRKLFFBRHFELEdBQ3hDNUIsTUFEd0MsQ0FDckQ0QixRQURxRDtBQUUxRSxTQUFPakIsTUFBTSxDQUFDbEIsVUFBRCxFQUFhTyxNQUFiLEVBQXFCLFVBQUNDLEtBQUQsRUFBZTtBQUMvQztBQUNBSSx3QkFBUXNCLEdBQVIsQ0FBWUssSUFBWixFQUFrQkosUUFBbEIsRUFBNEIzQixLQUE1QjtBQUNELEdBSFksRUFHVixZQUFLO0FBQ047QUFDQVMsSUFBQUEsS0FBSyxDQUFDbUIsWUFBTixDQUFtQjdCLE1BQW5CO0FBQ0QsR0FOWSxDQUFiO0FBT0Q7O0FBRUQsU0FBU2tDLGlCQUFULENBQTRCQyxLQUE1QixFQUEyQ0MsSUFBM0MsRUFBd0RDLE1BQXhELEVBQXVFQyxNQUF2RSxFQUFvRjtBQUNsRixNQUFNQyxHQUFHLEdBQUdGLE1BQU0sQ0FBQ0YsS0FBRCxDQUFsQjs7QUFDQSxNQUFJQyxJQUFJLElBQUlDLE1BQU0sQ0FBQ0csTUFBUCxHQUFnQkwsS0FBNUIsRUFBbUM7QUFDakM5Qix3QkFBUW9DLElBQVIsQ0FBYUwsSUFBYixFQUFtQixVQUFDTSxJQUFELEVBQVM7QUFDMUIsVUFBSUEsSUFBSSxDQUFDekMsS0FBTCxLQUFlc0MsR0FBbkIsRUFBd0I7QUFDdEJELFFBQUFBLE1BQU0sQ0FBQ0ssSUFBUCxDQUFZRCxJQUFJLENBQUNFLEtBQWpCO0FBQ0FWLFFBQUFBLGlCQUFpQixDQUFDLEVBQUVDLEtBQUgsRUFBVU8sSUFBSSxDQUFDRyxRQUFmLEVBQXlCUixNQUF6QixFQUFpQ0MsTUFBakMsQ0FBakI7QUFDRDtBQUNGLEtBTEQ7QUFNRDtBQUNGOztBQUVELFNBQVNRLGdCQUFULENBQTJCQyxhQUEzQixFQUFnRDtBQUM5QyxTQUFPLFVBQVVDLENBQVYsRUFBNEJ2RCxVQUE1QixFQUFpRU8sTUFBakUsRUFBK0Y7QUFDcEcsV0FBT2lELFFBQVEsQ0FBQ0QsQ0FBRCxFQUFJRSxzQkFBc0IsQ0FBQ3pELFVBQUQsRUFBYU8sTUFBYixFQUFxQitDLGFBQXJCLENBQTFCLENBQWY7QUFDRCxHQUZEO0FBR0Q7O0FBRUQsU0FBU0ksa0JBQVQsQ0FBNkIxRCxVQUE3QixFQUFrRU8sTUFBbEUsRUFBZ0c7QUFBQSw0QkFDRlAsVUFERSxDQUN0RjJELE9BRHNGO0FBQUEsTUFDdEZBLE9BRHNGLG9DQUM1RSxFQUQ0RTtBQUFBLE1BQ3hFQyxZQUR3RSxHQUNGNUQsVUFERSxDQUN4RTRELFlBRHdFO0FBQUEsMEJBQ0Y1RCxVQURFLENBQzFEZSxLQUQwRDtBQUFBLE1BQzFEQSxLQUQwRCxrQ0FDbEQsRUFEa0Q7QUFBQSw4QkFDRmYsVUFERSxDQUM5QzZELFdBRDhDO0FBQUEsTUFDOUNBLFdBRDhDLHNDQUNoQyxFQURnQztBQUFBLDhCQUNGN0QsVUFERSxDQUM1QjhELGdCQUQ0QjtBQUFBLE1BQzVCQSxnQkFENEIsc0NBQ1QsRUFEUztBQUFBLE1BRXRGOUIsR0FGc0YsR0FFdEV6QixNQUZzRSxDQUV0RnlCLEdBRnNGO0FBQUEsTUFFakZDLE1BRmlGLEdBRXRFMUIsTUFGc0UsQ0FFakYwQixNQUZpRjtBQUc5RixNQUFNOEIsU0FBUyxHQUFHRixXQUFXLENBQUNWLEtBQVosSUFBcUIsT0FBdkM7QUFDQSxNQUFNYSxTQUFTLEdBQUdILFdBQVcsQ0FBQ3JELEtBQVosSUFBcUIsT0FBdkM7QUFDQSxNQUFNeUQsWUFBWSxHQUFHSCxnQkFBZ0IsQ0FBQ0gsT0FBakIsSUFBNEIsU0FBakQ7O0FBQ0EsTUFBTTlELFNBQVMsR0FBR2Usb0JBQVFzRCxHQUFSLENBQVlsQyxHQUFaLEVBQWlCQyxNQUFNLENBQUNFLFFBQXhCLENBQWxCOztBQUNBLE1BQUksQ0FBQ3ZDLFlBQVksQ0FBQ0MsU0FBRCxDQUFqQixFQUE4QjtBQUM1QixXQUFPZSxvQkFBUXVELEdBQVIsQ0FBWXBELEtBQUssQ0FBQ3FELElBQU4sS0FBZSxVQUFmLEdBQTRCdkUsU0FBNUIsR0FBd0MsQ0FBQ0EsU0FBRCxDQUFwRCxFQUFpRStELFlBQVksR0FBRyxVQUFDcEQsS0FBRCxFQUFVO0FBQy9GLFVBQUk2RCxVQUFKOztBQUNBLFdBQUssSUFBSTNCLEtBQUssR0FBRyxDQUFqQixFQUFvQkEsS0FBSyxHQUFHa0IsWUFBWSxDQUFDYixNQUF6QyxFQUFpREwsS0FBSyxFQUF0RCxFQUEwRDtBQUN4RDJCLFFBQUFBLFVBQVUsR0FBR3pELG9CQUFRMEQsSUFBUixDQUFhVixZQUFZLENBQUNsQixLQUFELENBQVosQ0FBb0J1QixZQUFwQixDQUFiLEVBQWdELFVBQUNoQixJQUFEO0FBQUEsaUJBQVVBLElBQUksQ0FBQ2UsU0FBRCxDQUFKLEtBQW9CeEQsS0FBOUI7QUFBQSxTQUFoRCxDQUFiOztBQUNBLFlBQUk2RCxVQUFKLEVBQWdCO0FBQ2Q7QUFDRDtBQUNGOztBQUNELGFBQU9BLFVBQVUsR0FBR0EsVUFBVSxDQUFDTixTQUFELENBQWIsR0FBMkJ2RCxLQUE1QztBQUNELEtBVG1GLEdBU2hGLFVBQUNBLEtBQUQsRUFBVTtBQUNaLFVBQU02RCxVQUFVLEdBQUd6RCxvQkFBUTBELElBQVIsQ0FBYVgsT0FBYixFQUFzQixVQUFDVixJQUFEO0FBQUEsZUFBVUEsSUFBSSxDQUFDZSxTQUFELENBQUosS0FBb0J4RCxLQUE5QjtBQUFBLE9BQXRCLENBQW5COztBQUNBLGFBQU82RCxVQUFVLEdBQUdBLFVBQVUsQ0FBQ04sU0FBRCxDQUFiLEdBQTJCdkQsS0FBNUM7QUFDRCxLQVpNLEVBWUorRCxJQVpJLENBWUMsSUFaRCxDQUFQO0FBYUQ7O0FBQ0QsU0FBTyxJQUFQO0FBQ0Q7O0FBRUQsU0FBU0Msb0JBQVQsQ0FBK0J4RSxVQUEvQixFQUEwRE8sTUFBMUQsRUFBd0Y7QUFBQSwyQkFDL0RQLFVBRCtELENBQzlFZSxLQUQ4RTtBQUFBLE1BQzlFQSxLQUQ4RSxtQ0FDdEUsRUFEc0U7QUFBQSxNQUU5RWlCLEdBRjhFLEdBRTlEekIsTUFGOEQsQ0FFOUV5QixHQUY4RTtBQUFBLE1BRXpFQyxNQUZ5RSxHQUU5RDFCLE1BRjhELENBRXpFMEIsTUFGeUU7O0FBR3RGLE1BQU1wQyxTQUFTLEdBQUdlLG9CQUFRc0QsR0FBUixDQUFZbEMsR0FBWixFQUFpQkMsTUFBTSxDQUFDRSxRQUF4QixDQUFsQjs7QUFDQSxNQUFJUyxNQUFNLEdBQUcvQyxTQUFTLElBQUksRUFBMUI7QUFDQSxNQUFJZ0QsTUFBTSxHQUFlLEVBQXpCO0FBQ0FKLEVBQUFBLGlCQUFpQixDQUFDLENBQUQsRUFBSTFCLEtBQUssQ0FBQzRDLE9BQVYsRUFBbUJmLE1BQW5CLEVBQTJCQyxNQUEzQixDQUFqQjtBQUNBLFNBQU8sQ0FBQzlCLEtBQUssQ0FBQzBELGFBQU4sS0FBd0IsS0FBeEIsR0FBZ0M1QixNQUFNLENBQUM2QixLQUFQLENBQWE3QixNQUFNLENBQUNFLE1BQVAsR0FBZ0IsQ0FBN0IsRUFBZ0NGLE1BQU0sQ0FBQ0UsTUFBdkMsQ0FBaEMsR0FBaUZGLE1BQWxGLEVBQTBGMEIsSUFBMUYsWUFBbUd4RCxLQUFLLENBQUM0RCxTQUFOLElBQW1CLEdBQXRILE9BQVA7QUFDRDs7QUFFRCxTQUFTQyx1QkFBVCxDQUFrQzVFLFVBQWxDLEVBQTZETyxNQUE3RCxFQUEyRjtBQUFBLDJCQUNsRVAsVUFEa0UsQ0FDakZlLEtBRGlGO0FBQUEsTUFDakZBLEtBRGlGLG1DQUN6RSxFQUR5RTtBQUFBLE1BRWpGaUIsR0FGaUYsR0FFakV6QixNQUZpRSxDQUVqRnlCLEdBRmlGO0FBQUEsTUFFNUVDLE1BRjRFLEdBRWpFMUIsTUFGaUUsQ0FFNUUwQixNQUY0RTs7QUFHekYsTUFBSXBDLFNBQVMsR0FBR2Usb0JBQVFzRCxHQUFSLENBQVlsQyxHQUFaLEVBQWlCQyxNQUFNLENBQUNFLFFBQXhCLENBQWhCOztBQUNBLE1BQUl0QyxTQUFKLEVBQWU7QUFDYkEsSUFBQUEsU0FBUyxHQUFHZSxvQkFBUXVELEdBQVIsQ0FBWXRFLFNBQVosRUFBdUIsVUFBQ2dGLElBQUQ7QUFBQSxhQUFVQSxJQUFJLENBQUNDLE1BQUwsQ0FBWS9ELEtBQUssQ0FBQytELE1BQU4sSUFBZ0IsWUFBNUIsQ0FBVjtBQUFBLEtBQXZCLEVBQTRFUCxJQUE1RSxDQUFpRixLQUFqRixDQUFaO0FBQ0Q7O0FBQ0QsU0FBTzFFLFNBQVA7QUFDRDs7QUFFRCxTQUFTa0Ysc0JBQVQsQ0FBaUMvRSxVQUFqQyxFQUE0RE8sTUFBNUQsRUFBMEY7QUFBQSwyQkFDakVQLFVBRGlFLENBQ2hGZSxLQURnRjtBQUFBLE1BQ2hGQSxLQURnRixtQ0FDeEUsRUFEd0U7QUFBQSxNQUVoRmlFLFFBRmdGLEdBRXBEakUsS0FGb0QsQ0FFaEZpRSxRQUZnRjtBQUFBLE1BRXRFQyxhQUZzRSxHQUVwRGxFLEtBRm9ELENBRXRFa0UsYUFGc0U7QUFBQSxNQUdoRmpELEdBSGdGLEdBR2hFekIsTUFIZ0UsQ0FHaEZ5QixHQUhnRjtBQUFBLE1BRzNFQyxNQUgyRSxHQUdoRTFCLE1BSGdFLENBRzNFMEIsTUFIMkU7O0FBSXhGLE1BQUlwQyxTQUFTLEdBQUdlLG9CQUFRc0QsR0FBUixDQUFZbEMsR0FBWixFQUFpQkMsTUFBTSxDQUFDRSxRQUF4QixDQUFoQjs7QUFDQSxNQUFJLENBQUN2QyxZQUFZLENBQUNDLFNBQUQsQ0FBakIsRUFBOEI7QUFDNUIsV0FBT2Usb0JBQVF1RCxHQUFSLENBQVljLGFBQWEsR0FBR3BGLFNBQUgsR0FBZSxDQUFDQSxTQUFELENBQXhDLEVBQXFELFVBQUNXLEtBQUQsRUFBVTtBQUNwRSxVQUFNMEUsUUFBUSxHQUFHdEUsb0JBQVF1RSxRQUFSLENBQWlCSCxRQUFqQixFQUEyQixVQUFDL0IsSUFBRDtBQUFBLGVBQVVBLElBQUksQ0FBQ3pDLEtBQUwsS0FBZUEsS0FBekI7QUFBQSxPQUEzQixFQUEyRDtBQUFFNEMsUUFBQUEsUUFBUSxFQUFFO0FBQVosT0FBM0QsQ0FBakI7O0FBQ0EsYUFBTzhCLFFBQVEsR0FBR0EsUUFBUSxDQUFDakMsSUFBVCxDQUFjbUMsS0FBakIsR0FBeUI1RSxLQUF4QztBQUNELEtBSE0sRUFHSitELElBSEksQ0FHQyxJQUhELENBQVA7QUFJRDs7QUFDRCxTQUFPMUUsU0FBUDtBQUNEOztBQUVELFNBQVM0RCxzQkFBVCxDQUFpQ3pELFVBQWpDLEVBQTRETyxNQUE1RCxFQUEySCtDLGFBQTNILEVBQWdKO0FBQUEsMkJBQ3ZIdEQsVUFEdUgsQ0FDdEllLEtBRHNJO0FBQUEsTUFDdElBLEtBRHNJLG1DQUM5SCxFQUQ4SDtBQUFBLE1BRXRJaUIsR0FGc0ksR0FFdEh6QixNQUZzSCxDQUV0SXlCLEdBRnNJO0FBQUEsTUFFaklDLE1BRmlJLEdBRXRIMUIsTUFGc0gsQ0FFakkwQixNQUZpSTs7QUFHOUksTUFBSXBDLFNBQVMsR0FBR2Usb0JBQVFzRCxHQUFSLENBQVlsQyxHQUFaLEVBQWlCQyxNQUFNLENBQUNFLFFBQXhCLENBQWhCOztBQUNBLE1BQUl0QyxTQUFKLEVBQWU7QUFDYkEsSUFBQUEsU0FBUyxHQUFHQSxTQUFTLENBQUNpRixNQUFWLENBQWlCL0QsS0FBSyxDQUFDK0QsTUFBTixJQUFnQnhCLGFBQWpDLENBQVo7QUFDRDs7QUFDRCxTQUFPekQsU0FBUDtBQUNEOztBQUVELFNBQVN3RixnQkFBVCxDQUEyQjVFLFlBQTNCLEVBQWdFO0FBQzlELFNBQU8sVUFBVThDLENBQVYsRUFBNEJ2RCxVQUE1QixFQUFpRU8sTUFBakUsRUFBK0Y7QUFBQSxRQUM1RnlCLEdBRDRGLEdBQzVFekIsTUFENEUsQ0FDNUZ5QixHQUQ0RjtBQUFBLFFBQ3ZGQyxNQUR1RixHQUM1RTFCLE1BRDRFLENBQ3ZGMEIsTUFEdUY7QUFBQSxRQUU1RnFELEtBRjRGLEdBRWxGdEYsVUFGa0YsQ0FFNUZzRixLQUY0Rjs7QUFHcEcsUUFBTXpGLFNBQVMsR0FBR2Usb0JBQVFzRCxHQUFSLENBQVlsQyxHQUFaLEVBQWlCQyxNQUFNLENBQUNFLFFBQXhCLENBQWxCOztBQUNBLFdBQU8sQ0FDTG9CLENBQUMsQ0FBQ3ZELFVBQVUsQ0FBQ0UsSUFBWixFQUFrQjtBQUNqQm9GLE1BQUFBLEtBQUssRUFBTEEsS0FEaUI7QUFFakJ2RSxNQUFBQSxLQUFLLEVBQUVULHNCQUFzQixDQUFDTixVQUFELEVBQWFPLE1BQWIsRUFBcUJWLFNBQXJCLEVBQWdDWSxZQUFoQyxDQUZaO0FBR2pCOEUsTUFBQUEsRUFBRSxFQUFFeEQsVUFBVSxDQUFDL0IsVUFBRCxFQUFhTyxNQUFiO0FBSEcsS0FBbEIsQ0FESSxDQUFQO0FBT0QsR0FYRDtBQVlEOztBQUVELFNBQVNpRix1QkFBVCxDQUFrQ2pDLENBQWxDLEVBQW9EdkQsVUFBcEQsRUFBeUZPLE1BQXpGLEVBQXVIO0FBQUEsTUFDN0crRSxLQUQ2RyxHQUNuR3RGLFVBRG1HLENBQzdHc0YsS0FENkc7QUFFckgsU0FBTyxDQUNML0IsQ0FBQyxDQUFDLFVBQUQsRUFBYTtBQUNaK0IsSUFBQUEsS0FBSyxFQUFMQSxLQURZO0FBRVp2RSxJQUFBQSxLQUFLLEVBQUVULHNCQUFzQixDQUFDTixVQUFELEVBQWFPLE1BQWIsRUFBcUIsSUFBckIsQ0FGakI7QUFHWmdGLElBQUFBLEVBQUUsRUFBRXJFLE1BQU0sQ0FBQ2xCLFVBQUQsRUFBYU8sTUFBYjtBQUhFLEdBQWIsRUFJRWlELFFBQVEsQ0FBQ0QsQ0FBRCxFQUFJdkQsVUFBVSxDQUFDeUYsT0FBZixDQUpWLENBREksQ0FBUDtBQU9EOztBQUVELFNBQVNDLHdCQUFULENBQW1DbkMsQ0FBbkMsRUFBcUR2RCxVQUFyRCxFQUEwRk8sTUFBMUYsRUFBd0g7QUFDdEgsU0FBT1AsVUFBVSxDQUFDb0QsUUFBWCxDQUFvQmUsR0FBcEIsQ0FBd0IsVUFBQ3dCLGVBQUQ7QUFBQSxXQUE4Q0gsdUJBQXVCLENBQUNqQyxDQUFELEVBQUlvQyxlQUFKLEVBQXFCcEYsTUFBckIsQ0FBdkIsQ0FBb0QsQ0FBcEQsQ0FBOUM7QUFBQSxHQUF4QixDQUFQO0FBQ0Q7O0FBRUQsU0FBU3FGLGtCQUFULENBQTZCbkYsWUFBN0IsRUFBa0U7QUFDaEUsU0FBTyxVQUFVOEMsQ0FBVixFQUE0QnZELFVBQTVCLEVBQW1FTyxNQUFuRSxFQUFtRztBQUFBLFFBQ2hHMEIsTUFEZ0csR0FDckYxQixNQURxRixDQUNoRzBCLE1BRGdHO0FBQUEsUUFFaEcvQixJQUZnRyxHQUVoRkYsVUFGZ0YsQ0FFaEdFLElBRmdHO0FBQUEsUUFFMUZvRixLQUYwRixHQUVoRnRGLFVBRmdGLENBRTFGc0YsS0FGMEY7QUFHeEcsV0FBT3JELE1BQU0sQ0FBQzRELE9BQVAsQ0FBZTFCLEdBQWYsQ0FBbUIsVUFBQzdCLE1BQUQsRUFBU3dELE1BQVQsRUFBbUI7QUFDM0MsVUFBTUMsV0FBVyxHQUFHekQsTUFBTSxDQUFDQyxJQUEzQjtBQUNBLGFBQU9nQixDQUFDLENBQUNyRCxJQUFELEVBQU87QUFDYjBCLFFBQUFBLEdBQUcsRUFBRWtFLE1BRFE7QUFFYlIsUUFBQUEsS0FBSyxFQUFMQSxLQUZhO0FBR2J2RSxRQUFBQSxLQUFLLEVBQUVULHNCQUFzQixDQUFDTixVQUFELEVBQWFPLE1BQWIsRUFBcUJ3RixXQUFyQixFQUFrQ3RGLFlBQWxDLENBSGhCO0FBSWI4RSxRQUFBQSxFQUFFLEVBQUVsRCxZQUFZLENBQUNyQyxVQUFELEVBQWFPLE1BQWIsRUFBcUIrQixNQUFyQixFQUE2QixZQUFLO0FBQ2hEO0FBQ0EwRCxVQUFBQSxtQkFBbUIsQ0FBQ3pGLE1BQUQsRUFBUyxDQUFDLENBQUMrQixNQUFNLENBQUNDLElBQWxCLEVBQXdCRCxNQUF4QixDQUFuQjtBQUNELFNBSGU7QUFKSCxPQUFQLENBQVI7QUFTRCxLQVhNLENBQVA7QUFZRCxHQWZEO0FBZ0JEOztBQUVELFNBQVMwRCxtQkFBVCxDQUE4QnpGLE1BQTlCLEVBQWdFMEYsT0FBaEUsRUFBa0YzRCxNQUFsRixFQUE0RztBQUFBLE1BQ2xHNEQsTUFEa0csR0FDdkYzRixNQUR1RixDQUNsRzJGLE1BRGtHO0FBRTFHQSxFQUFBQSxNQUFNLENBQUNDLFlBQVAsQ0FBb0IsRUFBcEIsRUFBd0JGLE9BQXhCLEVBQWlDM0QsTUFBakM7QUFDRDs7QUFFRCxTQUFTOEQsbUJBQVQsQ0FBOEI3RixNQUE5QixFQUE4RDtBQUFBLE1BQ3BEK0IsTUFEb0QsR0FDNUIvQixNQUQ0QixDQUNwRCtCLE1BRG9EO0FBQUEsTUFDNUNOLEdBRDRDLEdBQzVCekIsTUFENEIsQ0FDNUN5QixHQUQ0QztBQUFBLE1BQ3ZDQyxNQUR1QyxHQUM1QjFCLE1BRDRCLENBQ3ZDMEIsTUFEdUM7QUFBQSxNQUVwRE0sSUFGb0QsR0FFM0NELE1BRjJDLENBRXBEQyxJQUZvRDs7QUFHNUQsTUFBTTFDLFNBQVMsR0FBR2Usb0JBQVFzRCxHQUFSLENBQVlsQyxHQUFaLEVBQWlCQyxNQUFNLENBQUNFLFFBQXhCLENBQWxCO0FBQ0E7OztBQUNBLFNBQU90QyxTQUFTLEtBQUswQyxJQUFyQjtBQUNEOztBQUVELFNBQVM4RCxhQUFULENBQXdCOUMsQ0FBeEIsRUFBMENJLE9BQTFDLEVBQTBERSxXQUExRCxFQUFrRjtBQUNoRixNQUFNRSxTQUFTLEdBQUdGLFdBQVcsQ0FBQ1YsS0FBWixJQUFxQixPQUF2QztBQUNBLE1BQU1hLFNBQVMsR0FBR0gsV0FBVyxDQUFDckQsS0FBWixJQUFxQixPQUF2QztBQUNBLE1BQU04RixZQUFZLEdBQUd6QyxXQUFXLENBQUMwQyxRQUFaLElBQXdCLFVBQTdDO0FBQ0EsU0FBTzNGLG9CQUFRdUQsR0FBUixDQUFZUixPQUFaLEVBQXFCLFVBQUNWLElBQUQsRUFBTzZDLE1BQVAsRUFBaUI7QUFDM0MsV0FBT3ZDLENBQUMsQ0FBQyxpQkFBRCxFQUFvQjtBQUMxQjNCLE1BQUFBLEdBQUcsRUFBRWtFLE1BRHFCO0FBRTFCL0UsTUFBQUEsS0FBSyxFQUFFO0FBQ0xQLFFBQUFBLEtBQUssRUFBRXlDLElBQUksQ0FBQ2UsU0FBRCxDQUROO0FBRUx1QyxRQUFBQSxRQUFRLEVBQUV0RCxJQUFJLENBQUNxRCxZQUFEO0FBRlQ7QUFGbUIsS0FBcEIsRUFNTHJELElBQUksQ0FBQ2MsU0FBRCxDQU5DLENBQVI7QUFPRCxHQVJNLENBQVA7QUFTRDs7QUFFRCxTQUFTUCxRQUFULENBQW1CRCxDQUFuQixFQUFxQzFELFNBQXJDLEVBQW1EO0FBQ2pELFNBQU8sQ0FBQyxNQUFNRCxZQUFZLENBQUNDLFNBQUQsQ0FBWixHQUEwQixFQUExQixHQUErQkEsU0FBckMsQ0FBRCxDQUFQO0FBQ0Q7O0FBRUQsU0FBUzJHLG9CQUFULENBQStCL0YsWUFBL0IsRUFBb0U7QUFDbEUsU0FBTyxVQUFVOEMsQ0FBVixFQUE0QnZELFVBQTVCLEVBQStETyxNQUEvRCxFQUEyRjtBQUFBLFFBQ3hGZ0MsSUFEd0YsR0FDckVoQyxNQURxRSxDQUN4RmdDLElBRHdGO0FBQUEsUUFDbEZKLFFBRGtGLEdBQ3JFNUIsTUFEcUUsQ0FDbEY0QixRQURrRjtBQUFBLFFBRXhGakMsSUFGd0YsR0FFL0VGLFVBRitFLENBRXhGRSxJQUZ3RjtBQUFBLFFBR3hGb0YsS0FId0YsR0FHOUV0RixVQUg4RSxDQUd4RnNGLEtBSHdGOztBQUloRyxRQUFNbUIsU0FBUyxHQUFHN0Ysb0JBQVFzRCxHQUFSLENBQVkzQixJQUFaLEVBQWtCSixRQUFsQixDQUFsQjs7QUFDQSxXQUFPLENBQ0xvQixDQUFDLENBQUNyRCxJQUFELEVBQU87QUFDTm9GLE1BQUFBLEtBQUssRUFBTEEsS0FETTtBQUVOdkUsTUFBQUEsS0FBSyxFQUFFQyxZQUFZLENBQUNoQixVQUFELEVBQWFPLE1BQWIsRUFBcUJrRyxTQUFyQixFQUFnQ2hHLFlBQWhDLENBRmI7QUFHTjhFLE1BQUFBLEVBQUUsRUFBRS9DLFVBQVUsQ0FBQ3hDLFVBQUQsRUFBYU8sTUFBYjtBQUhSLEtBQVAsQ0FESSxDQUFQO0FBT0QsR0FaRDtBQWFEOztBQUVELFNBQVNtRyx1QkFBVCxDQUFrQ25ELENBQWxDLEVBQW9EdkQsVUFBcEQsRUFBdUZPLE1BQXZGLEVBQW1IO0FBQUEsTUFDekcrRSxLQUR5RyxHQUMvRnRGLFVBRCtGLENBQ3pHc0YsS0FEeUc7QUFFakgsTUFBTXZFLEtBQUssR0FBR0MsWUFBWSxDQUFDaEIsVUFBRCxFQUFhTyxNQUFiLEVBQXFCLElBQXJCLENBQTFCO0FBQ0EsU0FBTyxDQUNMZ0QsQ0FBQyxDQUFDLFVBQUQsRUFBYTtBQUNaK0IsSUFBQUEsS0FBSyxFQUFMQSxLQURZO0FBRVp2RSxJQUFBQSxLQUFLLEVBQUxBLEtBRlk7QUFHWndFLElBQUFBLEVBQUUsRUFBRXJFLE1BQU0sQ0FBQ2xCLFVBQUQsRUFBYU8sTUFBYjtBQUhFLEdBQWIsRUFJRWlELFFBQVEsQ0FBQ0QsQ0FBRCxFQUFJdkQsVUFBVSxDQUFDeUYsT0FBWCxJQUFzQjFFLEtBQUssQ0FBQzBFLE9BQWhDLENBSlYsQ0FESSxDQUFQO0FBT0Q7O0FBRUQsU0FBU2tCLHdCQUFULENBQW1DcEQsQ0FBbkMsRUFBcUR2RCxVQUFyRCxFQUF3Rk8sTUFBeEYsRUFBb0g7QUFDbEgsU0FBT1AsVUFBVSxDQUFDb0QsUUFBWCxDQUFvQmUsR0FBcEIsQ0FBd0IsVUFBQ3dCLGVBQUQ7QUFBQSxXQUE0Q2UsdUJBQXVCLENBQUNuRCxDQUFELEVBQUlvQyxlQUFKLEVBQXFCcEYsTUFBckIsQ0FBdkIsQ0FBb0QsQ0FBcEQsQ0FBNUM7QUFBQSxHQUF4QixDQUFQO0FBQ0Q7O0FBRUQsU0FBU3FHLDRCQUFULENBQXVDdEQsYUFBdkMsRUFBOER1RCxNQUE5RCxFQUE4RTtBQUM1RSxNQUFNQyxjQUFjLEdBQUdELE1BQU0sR0FBRyxZQUFILEdBQWtCLFlBQS9DO0FBQ0EsU0FBTyxVQUFVdEcsTUFBVixFQUE4QztBQUNuRCxXQUFPa0Qsc0JBQXNCLENBQUNsRCxNQUFNLENBQUMwQixNQUFQLENBQWM2RSxjQUFkLENBQUQsRUFBZ0N2RyxNQUFoQyxFQUF3QytDLGFBQXhDLENBQTdCO0FBQ0QsR0FGRDtBQUdEOztBQUVELFNBQVN5RCxrQkFBVCxDQUE2QkMsV0FBN0IsRUFBb0RILE1BQXBELEVBQW9FO0FBQ2xFLE1BQU1DLGNBQWMsR0FBR0QsTUFBTSxHQUFHLFlBQUgsR0FBa0IsWUFBL0M7QUFDQSxTQUFPLFVBQVV0RyxNQUFWLEVBQThDO0FBQ25ELFdBQU95RyxXQUFXLENBQUN6RyxNQUFNLENBQUMwQixNQUFQLENBQWM2RSxjQUFkLENBQUQsRUFBZ0N2RyxNQUFoQyxDQUFsQjtBQUNELEdBRkQ7QUFHRDs7QUFFRCxTQUFTMEcsb0NBQVQsR0FBNkM7QUFDM0MsU0FBTyxVQUFVMUQsQ0FBVixFQUE0QnZELFVBQTVCLEVBQStETyxNQUEvRCxFQUEyRjtBQUFBLFFBQ3hGTCxJQUR3RixHQUMvQ0YsVUFEK0MsQ0FDeEZFLElBRHdGO0FBQUEsK0JBQy9DRixVQUQrQyxDQUNsRjJELE9BRGtGO0FBQUEsUUFDbEZBLE9BRGtGLHFDQUN4RSxFQUR3RTtBQUFBLGlDQUMvQzNELFVBRCtDLENBQ3BFNkQsV0FEb0U7QUFBQSxRQUNwRUEsV0FEb0UsdUNBQ3RELEVBRHNEO0FBQUEsUUFFeEZ0QixJQUZ3RixHQUVyRWhDLE1BRnFFLENBRXhGZ0MsSUFGd0Y7QUFBQSxRQUVsRkosUUFGa0YsR0FFckU1QixNQUZxRSxDQUVsRjRCLFFBRmtGO0FBQUEsUUFHeEZtRCxLQUh3RixHQUc5RXRGLFVBSDhFLENBR3hGc0YsS0FId0Y7QUFJaEcsUUFBTXZCLFNBQVMsR0FBR0YsV0FBVyxDQUFDVixLQUFaLElBQXFCLE9BQXZDO0FBQ0EsUUFBTWEsU0FBUyxHQUFHSCxXQUFXLENBQUNyRCxLQUFaLElBQXFCLE9BQXZDO0FBQ0EsUUFBTThGLFlBQVksR0FBR3pDLFdBQVcsQ0FBQzBDLFFBQVosSUFBd0IsVUFBN0M7O0FBQ0EsUUFBTUUsU0FBUyxHQUFHN0Ysb0JBQVFzRCxHQUFSLENBQVkzQixJQUFaLEVBQWtCSixRQUFsQixDQUFsQjs7QUFDQSxXQUFPLENBQ0xvQixDQUFDLFdBQUlyRCxJQUFKLFlBQWlCO0FBQ2hCb0YsTUFBQUEsS0FBSyxFQUFMQSxLQURnQjtBQUVoQnZFLE1BQUFBLEtBQUssRUFBRUMsWUFBWSxDQUFDaEIsVUFBRCxFQUFhTyxNQUFiLEVBQXFCa0csU0FBckIsQ0FGSDtBQUdoQmxCLE1BQUFBLEVBQUUsRUFBRS9DLFVBQVUsQ0FBQ3hDLFVBQUQsRUFBYU8sTUFBYjtBQUhFLEtBQWpCLEVBSUVvRCxPQUFPLENBQUNRLEdBQVIsQ0FBWSxVQUFDN0IsTUFBRCxFQUFTd0QsTUFBVCxFQUFtQjtBQUNoQyxhQUFPdkMsQ0FBQyxDQUFDckQsSUFBRCxFQUFPO0FBQ2IwQixRQUFBQSxHQUFHLEVBQUVrRSxNQURRO0FBRWIvRSxRQUFBQSxLQUFLLEVBQUU7QUFDTFAsVUFBQUEsS0FBSyxFQUFFOEIsTUFBTSxDQUFDMEIsU0FBRCxDQURSO0FBRUx1QyxVQUFBQSxRQUFRLEVBQUVqRSxNQUFNLENBQUNnRSxZQUFEO0FBRlg7QUFGTSxPQUFQLEVBTUxoRSxNQUFNLENBQUN5QixTQUFELENBTkQsQ0FBUjtBQU9ELEtBUkUsQ0FKRixDQURJLENBQVA7QUFlRCxHQXZCRDtBQXdCRDtBQUVEOzs7OztBQUdBLElBQU1tRCxTQUFTLEdBQUc7QUFDaEJDLEVBQUFBLGFBQWEsRUFBRTtBQUNiQyxJQUFBQSxTQUFTLEVBQUUsaUJBREU7QUFFYkMsSUFBQUEsYUFBYSxFQUFFaEMsZ0JBQWdCLEVBRmxCO0FBR2JpQyxJQUFBQSxVQUFVLEVBQUVqQyxnQkFBZ0IsRUFIZjtBQUlia0MsSUFBQUEsWUFBWSxFQUFFM0Isa0JBQWtCLEVBSm5CO0FBS2I0QixJQUFBQSxZQUFZLEVBQUVwQixtQkFMRDtBQU1icUIsSUFBQUEsVUFBVSxFQUFFakIsb0JBQW9CO0FBTm5CLEdBREM7QUFTaEJrQixFQUFBQSxNQUFNLEVBQUU7QUFDTk4sSUFBQUEsU0FBUyxFQUFFLGlCQURMO0FBRU5DLElBQUFBLGFBQWEsRUFBRWhDLGdCQUFnQixFQUZ6QjtBQUdOaUMsSUFBQUEsVUFBVSxFQUFFakMsZ0JBQWdCLEVBSHRCO0FBSU5rQyxJQUFBQSxZQUFZLEVBQUUzQixrQkFBa0IsRUFKMUI7QUFLTjRCLElBQUFBLFlBQVksRUFBRXBCLG1CQUxSO0FBTU5xQixJQUFBQSxVQUFVLEVBQUVqQixvQkFBb0I7QUFOMUIsR0FUUTtBQWlCaEJtQixFQUFBQSxZQUFZLEVBQUU7QUFDWlAsSUFBQUEsU0FBUyxFQUFFLDhCQURDO0FBRVpDLElBQUFBLGFBQWEsRUFBRWhDLGdCQUFnQixFQUZuQjtBQUdaaUMsSUFBQUEsVUFBVSxFQUFFakMsZ0JBQWdCLEVBSGhCO0FBSVprQyxJQUFBQSxZQUFZLEVBQUUzQixrQkFBa0IsRUFKcEI7QUFLWjRCLElBQUFBLFlBQVksRUFBRXBCLG1CQUxGO0FBTVpxQixJQUFBQSxVQUFVLEVBQUVqQixvQkFBb0I7QUFOcEIsR0FqQkU7QUF5QmhCb0IsRUFBQUEsT0FBTyxFQUFFO0FBQ1BOLElBQUFBLFVBRE8sc0JBQ0svRCxDQURMLEVBQ3VCdkQsVUFEdkIsRUFDNERPLE1BRDVELEVBQzBGO0FBQUEsaUNBQ2ZQLFVBRGUsQ0FDdkYyRCxPQUR1RjtBQUFBLFVBQ3ZGQSxPQUR1RixxQ0FDN0UsRUFENkU7QUFBQSxVQUN6RUMsWUFEeUUsR0FDZjVELFVBRGUsQ0FDekU0RCxZQUR5RTtBQUFBLG1DQUNmNUQsVUFEZSxDQUMzRDZELFdBRDJEO0FBQUEsVUFDM0RBLFdBRDJELHVDQUM3QyxFQUQ2QztBQUFBLG1DQUNmN0QsVUFEZSxDQUN6QzhELGdCQUR5QztBQUFBLFVBQ3pDQSxnQkFEeUMsdUNBQ3RCLEVBRHNCO0FBQUEsVUFFdkY5QixHQUZ1RixHQUV2RXpCLE1BRnVFLENBRXZGeUIsR0FGdUY7QUFBQSxVQUVsRkMsTUFGa0YsR0FFdkUxQixNQUZ1RSxDQUVsRjBCLE1BRmtGO0FBQUEsVUFHdkZxRCxLQUh1RixHQUc3RXRGLFVBSDZFLENBR3ZGc0YsS0FIdUY7O0FBSS9GLFVBQU16RixTQUFTLEdBQUdlLG9CQUFRc0QsR0FBUixDQUFZbEMsR0FBWixFQUFpQkMsTUFBTSxDQUFDRSxRQUF4QixDQUFsQjs7QUFDQSxVQUFNcEIsS0FBSyxHQUFHVCxzQkFBc0IsQ0FBQ04sVUFBRCxFQUFhTyxNQUFiLEVBQXFCVixTQUFyQixDQUFwQztBQUNBLFVBQU0wRixFQUFFLEdBQUd4RCxVQUFVLENBQUMvQixVQUFELEVBQWFPLE1BQWIsQ0FBckI7O0FBQ0EsVUFBSXFELFlBQUosRUFBa0I7QUFDaEIsWUFBTUssWUFBWSxHQUFHSCxnQkFBZ0IsQ0FBQ0gsT0FBakIsSUFBNEIsU0FBakQ7QUFDQSxZQUFNa0UsVUFBVSxHQUFHL0QsZ0JBQWdCLENBQUNYLEtBQWpCLElBQTBCLE9BQTdDO0FBQ0EsZUFBTyxDQUNMSSxDQUFDLENBQUMsVUFBRCxFQUFhO0FBQ1p4QyxVQUFBQSxLQUFLLEVBQUxBLEtBRFk7QUFFWnVFLFVBQUFBLEtBQUssRUFBTEEsS0FGWTtBQUdaQyxVQUFBQSxFQUFFLEVBQUZBO0FBSFksU0FBYixFQUlFM0Usb0JBQVF1RCxHQUFSLENBQVlQLFlBQVosRUFBMEIsVUFBQ2tFLEtBQUQsRUFBUUMsTUFBUixFQUFrQjtBQUM3QyxpQkFBT3hFLENBQUMsQ0FBQyxvQkFBRCxFQUF1QjtBQUM3QjNCLFlBQUFBLEdBQUcsRUFBRW1HO0FBRHdCLFdBQXZCLEVBRUwsQ0FDRHhFLENBQUMsQ0FBQyxNQUFELEVBQVM7QUFDUnlFLFlBQUFBLElBQUksRUFBRTtBQURFLFdBQVQsRUFFRUYsS0FBSyxDQUFDRCxVQUFELENBRlAsQ0FEQSxFQUlESSxNQUpDLENBS0Q1QixhQUFhLENBQUM5QyxDQUFELEVBQUl1RSxLQUFLLENBQUM3RCxZQUFELENBQVQsRUFBeUJKLFdBQXpCLENBTFosQ0FGSyxDQUFSO0FBU0QsU0FWRSxDQUpGLENBREksQ0FBUDtBQWlCRDs7QUFDRCxhQUFPLENBQ0xOLENBQUMsQ0FBQyxVQUFELEVBQWE7QUFDWnhDLFFBQUFBLEtBQUssRUFBTEEsS0FEWTtBQUVadUUsUUFBQUEsS0FBSyxFQUFMQSxLQUZZO0FBR1pDLFFBQUFBLEVBQUUsRUFBRkE7QUFIWSxPQUFiLEVBSUVjLGFBQWEsQ0FBQzlDLENBQUQsRUFBSUksT0FBSixFQUFhRSxXQUFiLENBSmYsQ0FESSxDQUFQO0FBT0QsS0FwQ007QUFxQ1BxRSxJQUFBQSxVQXJDTyxzQkFxQ0szRSxDQXJDTCxFQXFDdUJ2RCxVQXJDdkIsRUFxQzRETyxNQXJDNUQsRUFxQzBGO0FBQy9GLGFBQU9pRCxRQUFRLENBQUNELENBQUQsRUFBSUcsa0JBQWtCLENBQUMxRCxVQUFELEVBQWFPLE1BQWIsQ0FBdEIsQ0FBZjtBQUNELEtBdkNNO0FBd0NQZ0gsSUFBQUEsWUF4Q08sd0JBd0NPaEUsQ0F4Q1AsRUF3Q3lCdkQsVUF4Q3pCLEVBd0NnRU8sTUF4Q2hFLEVBd0NnRztBQUFBLGlDQUNyQlAsVUFEcUIsQ0FDN0YyRCxPQUQ2RjtBQUFBLFVBQzdGQSxPQUQ2RixxQ0FDbkYsRUFEbUY7QUFBQSxVQUMvRUMsWUFEK0UsR0FDckI1RCxVQURxQixDQUMvRTRELFlBRCtFO0FBQUEsbUNBQ3JCNUQsVUFEcUIsQ0FDakU2RCxXQURpRTtBQUFBLFVBQ2pFQSxXQURpRSx1Q0FDbkQsRUFEbUQ7QUFBQSxtQ0FDckI3RCxVQURxQixDQUMvQzhELGdCQUQrQztBQUFBLFVBQy9DQSxnQkFEK0MsdUNBQzVCLEVBRDRCO0FBQUEsVUFFN0Y3QixNQUY2RixHQUVsRjFCLE1BRmtGLENBRTdGMEIsTUFGNkY7QUFBQSxVQUc3RnFELEtBSDZGLEdBR25GdEYsVUFIbUYsQ0FHN0ZzRixLQUg2Rjs7QUFJckcsVUFBSTFCLFlBQUosRUFBa0I7QUFDaEIsWUFBTUssWUFBWSxHQUFHSCxnQkFBZ0IsQ0FBQ0gsT0FBakIsSUFBNEIsU0FBakQ7QUFDQSxZQUFNa0UsVUFBVSxHQUFHL0QsZ0JBQWdCLENBQUNYLEtBQWpCLElBQTBCLE9BQTdDO0FBQ0EsZUFBT2xCLE1BQU0sQ0FBQzRELE9BQVAsQ0FBZTFCLEdBQWYsQ0FBbUIsVUFBQzdCLE1BQUQsRUFBU3dELE1BQVQsRUFBbUI7QUFDM0MsY0FBTUMsV0FBVyxHQUFHekQsTUFBTSxDQUFDQyxJQUEzQjtBQUNBLGlCQUFPZ0IsQ0FBQyxDQUFDLFVBQUQsRUFBYTtBQUNuQjNCLFlBQUFBLEdBQUcsRUFBRWtFLE1BRGM7QUFFbkJSLFlBQUFBLEtBQUssRUFBTEEsS0FGbUI7QUFHbkJ2RSxZQUFBQSxLQUFLLEVBQUVULHNCQUFzQixDQUFDTixVQUFELEVBQWFPLE1BQWIsRUFBcUJ3RixXQUFyQixDQUhWO0FBSW5CUixZQUFBQSxFQUFFLEVBQUVsRCxZQUFZLENBQUNyQyxVQUFELEVBQWFPLE1BQWIsRUFBcUIrQixNQUFyQixFQUE2QixZQUFLO0FBQ2hEO0FBQ0EwRCxjQUFBQSxtQkFBbUIsQ0FBQ3pGLE1BQUQsRUFBUytCLE1BQU0sQ0FBQ0MsSUFBUCxJQUFlRCxNQUFNLENBQUNDLElBQVAsQ0FBWVEsTUFBWixHQUFxQixDQUE3QyxFQUFnRFQsTUFBaEQsQ0FBbkI7QUFDRCxhQUhlO0FBSkcsV0FBYixFQVFMMUIsb0JBQVF1RCxHQUFSLENBQVlQLFlBQVosRUFBMEIsVUFBQ2tFLEtBQUQsRUFBUUMsTUFBUixFQUFrQjtBQUM3QyxtQkFBT3hFLENBQUMsQ0FBQyxvQkFBRCxFQUF1QjtBQUM3QjNCLGNBQUFBLEdBQUcsRUFBRW1HO0FBRHdCLGFBQXZCLEVBRUwsQ0FDRHhFLENBQUMsQ0FBQyxNQUFELEVBQVM7QUFDUnlFLGNBQUFBLElBQUksRUFBRTtBQURFLGFBQVQsRUFFRUYsS0FBSyxDQUFDRCxVQUFELENBRlAsQ0FEQSxFQUlESSxNQUpDLENBS0Q1QixhQUFhLENBQUM5QyxDQUFELEVBQUl1RSxLQUFLLENBQUM3RCxZQUFELENBQVQsRUFBeUJKLFdBQXpCLENBTFosQ0FGSyxDQUFSO0FBU0QsV0FWRSxDQVJLLENBQVI7QUFtQkQsU0FyQk0sQ0FBUDtBQXNCRDs7QUFDRCxhQUFPNUIsTUFBTSxDQUFDNEQsT0FBUCxDQUFlMUIsR0FBZixDQUFtQixVQUFDN0IsTUFBRCxFQUFTd0QsTUFBVCxFQUFtQjtBQUMzQyxZQUFNQyxXQUFXLEdBQUd6RCxNQUFNLENBQUNDLElBQTNCO0FBQ0EsZUFBT2dCLENBQUMsQ0FBQyxVQUFELEVBQWE7QUFDbkIzQixVQUFBQSxHQUFHLEVBQUVrRSxNQURjO0FBRW5CUixVQUFBQSxLQUFLLEVBQUxBLEtBRm1CO0FBR25CdkUsVUFBQUEsS0FBSyxFQUFFVCxzQkFBc0IsQ0FBQ04sVUFBRCxFQUFhTyxNQUFiLEVBQXFCd0YsV0FBckIsQ0FIVjtBQUluQlIsVUFBQUEsRUFBRSxFQUFFbEQsWUFBWSxDQUFDckMsVUFBRCxFQUFhTyxNQUFiLEVBQXFCK0IsTUFBckIsRUFBNkIsWUFBSztBQUNoRDtBQUNBMEQsWUFBQUEsbUJBQW1CLENBQUN6RixNQUFELEVBQVMrQixNQUFNLENBQUNDLElBQVAsSUFBZUQsTUFBTSxDQUFDQyxJQUFQLENBQVlRLE1BQVosR0FBcUIsQ0FBN0MsRUFBZ0RULE1BQWhELENBQW5CO0FBQ0QsV0FIZTtBQUpHLFNBQWIsRUFRTCtELGFBQWEsQ0FBQzlDLENBQUQsRUFBSUksT0FBSixFQUFhRSxXQUFiLENBUlIsQ0FBUjtBQVNELE9BWE0sQ0FBUDtBQVlELEtBbEZNO0FBbUZQMkQsSUFBQUEsWUFuRk8sd0JBbUZPakgsTUFuRlAsRUFtRnVDO0FBQUEsVUFDcEMrQixNQURvQyxHQUNaL0IsTUFEWSxDQUNwQytCLE1BRG9DO0FBQUEsVUFDNUJOLEdBRDRCLEdBQ1p6QixNQURZLENBQzVCeUIsR0FENEI7QUFBQSxVQUN2QkMsTUFEdUIsR0FDWjFCLE1BRFksQ0FDdkIwQixNQUR1QjtBQUFBLFVBRXBDTSxJQUZvQyxHQUUzQkQsTUFGMkIsQ0FFcENDLElBRm9DO0FBQUEsVUFHcENKLFFBSG9DLEdBR0dGLE1BSEgsQ0FHcENFLFFBSG9DO0FBQUEsVUFHWm5DLFVBSFksR0FHR2lDLE1BSEgsQ0FHMUJrRyxZQUgwQjtBQUFBLCtCQUlyQm5JLFVBSnFCLENBSXBDZSxLQUpvQztBQUFBLFVBSXBDQSxLQUpvQyxtQ0FJNUIsRUFKNEI7O0FBSzVDLFVBQU1sQixTQUFTLEdBQUdlLG9CQUFRc0QsR0FBUixDQUFZbEMsR0FBWixFQUFpQkcsUUFBakIsQ0FBbEI7O0FBQ0EsVUFBSXBCLEtBQUssQ0FBQ3FELElBQU4sS0FBZSxVQUFuQixFQUErQjtBQUM3QixZQUFJeEQsb0JBQVF3SCxPQUFSLENBQWdCdkksU0FBaEIsQ0FBSixFQUFnQztBQUM5QixpQkFBT2Usb0JBQVF5SCxhQUFSLENBQXNCeEksU0FBdEIsRUFBaUMwQyxJQUFqQyxDQUFQO0FBQ0Q7O0FBQ0QsZUFBT0EsSUFBSSxDQUFDK0YsT0FBTCxDQUFhekksU0FBYixJQUEwQixDQUFDLENBQWxDO0FBQ0Q7QUFDRDs7O0FBQ0EsYUFBT0EsU0FBUyxJQUFJMEMsSUFBcEI7QUFDRCxLQWpHTTtBQWtHUGtGLElBQUFBLFVBbEdPLHNCQWtHS2xFLENBbEdMLEVBa0d1QnZELFVBbEd2QixFQWtHMERPLE1BbEcxRCxFQWtHc0Y7QUFBQSxpQ0FDWFAsVUFEVyxDQUNuRjJELE9BRG1GO0FBQUEsVUFDbkZBLE9BRG1GLHFDQUN6RSxFQUR5RTtBQUFBLFVBQ3JFQyxZQURxRSxHQUNYNUQsVUFEVyxDQUNyRTRELFlBRHFFO0FBQUEsbUNBQ1g1RCxVQURXLENBQ3ZENkQsV0FEdUQ7QUFBQSxVQUN2REEsV0FEdUQsdUNBQ3pDLEVBRHlDO0FBQUEsbUNBQ1g3RCxVQURXLENBQ3JDOEQsZ0JBRHFDO0FBQUEsVUFDckNBLGdCQURxQyx1Q0FDbEIsRUFEa0I7QUFBQSxVQUVuRnZCLElBRm1GLEdBRWhFaEMsTUFGZ0UsQ0FFbkZnQyxJQUZtRjtBQUFBLFVBRTdFSixRQUY2RSxHQUVoRTVCLE1BRmdFLENBRTdFNEIsUUFGNkU7QUFBQSxVQUduRm1ELEtBSG1GLEdBR3pFdEYsVUFIeUUsQ0FHbkZzRixLQUhtRjs7QUFJM0YsVUFBTW1CLFNBQVMsR0FBRzdGLG9CQUFRc0QsR0FBUixDQUFZM0IsSUFBWixFQUFrQkosUUFBbEIsQ0FBbEI7O0FBQ0EsVUFBTXBCLEtBQUssR0FBR0MsWUFBWSxDQUFDaEIsVUFBRCxFQUFhTyxNQUFiLEVBQXFCa0csU0FBckIsQ0FBMUI7QUFDQSxVQUFNbEIsRUFBRSxHQUFHL0MsVUFBVSxDQUFDeEMsVUFBRCxFQUFhTyxNQUFiLENBQXJCOztBQUNBLFVBQUlxRCxZQUFKLEVBQWtCO0FBQ2hCLFlBQU1LLFlBQVksR0FBR0gsZ0JBQWdCLENBQUNILE9BQWpCLElBQTRCLFNBQWpEO0FBQ0EsWUFBTWtFLFVBQVUsR0FBRy9ELGdCQUFnQixDQUFDWCxLQUFqQixJQUEwQixPQUE3QztBQUNBLGVBQU8sQ0FDTEksQ0FBQyxDQUFDLFVBQUQsRUFBYTtBQUNaK0IsVUFBQUEsS0FBSyxFQUFMQSxLQURZO0FBRVp2RSxVQUFBQSxLQUFLLEVBQUxBLEtBRlk7QUFHWndFLFVBQUFBLEVBQUUsRUFBRkE7QUFIWSxTQUFiLEVBSUUzRSxvQkFBUXVELEdBQVIsQ0FBWVAsWUFBWixFQUEwQixVQUFDa0UsS0FBRCxFQUFRQyxNQUFSLEVBQWtCO0FBQzdDLGlCQUFPeEUsQ0FBQyxDQUFDLG9CQUFELEVBQXVCO0FBQzdCM0IsWUFBQUEsR0FBRyxFQUFFbUc7QUFEd0IsV0FBdkIsRUFFTCxDQUNEeEUsQ0FBQyxDQUFDLE1BQUQsRUFBUztBQUNSeUUsWUFBQUEsSUFBSSxFQUFFO0FBREUsV0FBVCxFQUVFRixLQUFLLENBQUNELFVBQUQsQ0FGUCxDQURBLEVBSURJLE1BSkMsQ0FLRDVCLGFBQWEsQ0FBQzlDLENBQUQsRUFBSXVFLEtBQUssQ0FBQzdELFlBQUQsQ0FBVCxFQUF5QkosV0FBekIsQ0FMWixDQUZLLENBQVI7QUFTRCxTQVZFLENBSkYsQ0FESSxDQUFQO0FBaUJEOztBQUNELGFBQU8sQ0FDTE4sQ0FBQyxDQUFDLFVBQUQsRUFBYTtBQUNaK0IsUUFBQUEsS0FBSyxFQUFMQSxLQURZO0FBRVp2RSxRQUFBQSxLQUFLLEVBQUxBLEtBRlk7QUFHWndFLFFBQUFBLEVBQUUsRUFBRkE7QUFIWSxPQUFiLEVBSUVjLGFBQWEsQ0FBQzlDLENBQUQsRUFBSUksT0FBSixFQUFhRSxXQUFiLENBSmYsQ0FESSxDQUFQO0FBT0QsS0FySU07QUFzSVAwRSxJQUFBQSxnQkFBZ0IsRUFBRXhCLGtCQUFrQixDQUFDckQsa0JBQUQsQ0F0STdCO0FBdUlQOEUsSUFBQUEsb0JBQW9CLEVBQUV6QixrQkFBa0IsQ0FBQ3JELGtCQUFELEVBQXFCLElBQXJCO0FBdklqQyxHQXpCTztBQWtLaEIrRSxFQUFBQSxTQUFTLEVBQUU7QUFDVG5CLElBQUFBLFVBQVUsRUFBRWpDLGdCQUFnQixFQURuQjtBQUVUNkMsSUFBQUEsVUFGUyxzQkFFRzNFLENBRkgsRUFFcUJ2RCxVQUZyQixFQUUwRE8sTUFGMUQsRUFFd0Y7QUFDL0YsYUFBT2lELFFBQVEsQ0FBQ0QsQ0FBRCxFQUFJaUIsb0JBQW9CLENBQUN4RSxVQUFELEVBQWFPLE1BQWIsQ0FBeEIsQ0FBZjtBQUNELEtBSlE7QUFLVGtILElBQUFBLFVBQVUsRUFBRWpCLG9CQUFvQixFQUx2QjtBQU1UK0IsSUFBQUEsZ0JBQWdCLEVBQUV4QixrQkFBa0IsQ0FBQ3ZDLG9CQUFELENBTjNCO0FBT1RnRSxJQUFBQSxvQkFBb0IsRUFBRXpCLGtCQUFrQixDQUFDdkMsb0JBQUQsRUFBdUIsSUFBdkI7QUFQL0IsR0FsS0s7QUEyS2hCa0UsRUFBQUEsV0FBVyxFQUFFO0FBQ1hwQixJQUFBQSxVQUFVLEVBQUVqQyxnQkFBZ0IsRUFEakI7QUFFWDZDLElBQUFBLFVBQVUsRUFBRTdFLGdCQUFnQixDQUFDLFlBQUQsQ0FGakI7QUFHWG9FLElBQUFBLFVBQVUsRUFBRWpCLG9CQUFvQixFQUhyQjtBQUlYK0IsSUFBQUEsZ0JBQWdCLEVBQUUzQiw0QkFBNEIsQ0FBQyxZQUFELENBSm5DO0FBS1g0QixJQUFBQSxvQkFBb0IsRUFBRTVCLDRCQUE0QixDQUFDLFlBQUQsRUFBZSxJQUFmO0FBTHZDLEdBM0tHO0FBa0xoQitCLEVBQUFBLFlBQVksRUFBRTtBQUNackIsSUFBQUEsVUFBVSxFQUFFakMsZ0JBQWdCLEVBRGhCO0FBRVo2QyxJQUFBQSxVQUFVLEVBQUU3RSxnQkFBZ0IsQ0FBQyxTQUFELENBRmhCO0FBR1pvRSxJQUFBQSxVQUFVLEVBQUVqQixvQkFBb0IsRUFIcEI7QUFJWitCLElBQUFBLGdCQUFnQixFQUFFM0IsNEJBQTRCLENBQUMsU0FBRCxDQUpsQztBQUtaNEIsSUFBQUEsb0JBQW9CLEVBQUU1Qiw0QkFBNEIsQ0FBQyxTQUFELEVBQVksSUFBWjtBQUx0QyxHQWxMRTtBQXlMaEJnQyxFQUFBQSxZQUFZLEVBQUU7QUFDWnRCLElBQUFBLFVBQVUsRUFBRWpDLGdCQUFnQixFQURoQjtBQUVaNkMsSUFBQUEsVUFGWSxzQkFFQTNFLENBRkEsRUFFa0J2RCxVQUZsQixFQUV1RE8sTUFGdkQsRUFFcUY7QUFDL0YsYUFBT2lELFFBQVEsQ0FBQ0QsQ0FBRCxFQUFJcUIsdUJBQXVCLENBQUM1RSxVQUFELEVBQWFPLE1BQWIsQ0FBM0IsQ0FBZjtBQUNELEtBSlc7QUFLWmtILElBQUFBLFVBQVUsRUFBRWpCLG9CQUFvQixFQUxwQjtBQU1aK0IsSUFBQUEsZ0JBQWdCLEVBQUV4QixrQkFBa0IsQ0FBQ25DLHVCQUFELENBTnhCO0FBT1o0RCxJQUFBQSxvQkFBb0IsRUFBRXpCLGtCQUFrQixDQUFDbkMsdUJBQUQsRUFBMEIsSUFBMUI7QUFQNUIsR0F6TEU7QUFrTWhCaUUsRUFBQUEsV0FBVyxFQUFFO0FBQ1h2QixJQUFBQSxVQUFVLEVBQUVqQyxnQkFBZ0IsRUFEakI7QUFFWDZDLElBQUFBLFVBQVUsRUFBRTdFLGdCQUFnQixDQUFDLFVBQUQsQ0FGakI7QUFHWG9FLElBQUFBLFVBQVUsRUFBRWpCLG9CQUFvQixFQUhyQjtBQUlYK0IsSUFBQUEsZ0JBQWdCLEVBQUUzQiw0QkFBNEIsQ0FBQyxVQUFELENBSm5DO0FBS1g0QixJQUFBQSxvQkFBb0IsRUFBRTVCLDRCQUE0QixDQUFDLFVBQUQsRUFBYSxJQUFiO0FBTHZDLEdBbE1HO0FBeU1oQmtDLEVBQUFBLFdBQVcsRUFBRTtBQUNYeEIsSUFBQUEsVUFBVSxFQUFFakMsZ0JBQWdCLEVBRGpCO0FBRVg2QyxJQUFBQSxVQUFVLEVBQUU3RSxnQkFBZ0IsQ0FBQyxVQUFELENBRmpCO0FBR1hvRSxJQUFBQSxVQUFVLEVBQUVqQixvQkFBb0IsRUFIckI7QUFJWCtCLElBQUFBLGdCQUFnQixFQUFFM0IsNEJBQTRCLENBQUMsVUFBRCxDQUpuQztBQUtYNEIsSUFBQUEsb0JBQW9CLEVBQUU1Qiw0QkFBNEIsQ0FBQyxVQUFELEVBQWEsSUFBYjtBQUx2QyxHQXpNRztBQWdOaEJtQyxFQUFBQSxXQUFXLEVBQUU7QUFDWHpCLElBQUFBLFVBQVUsRUFBRWpDLGdCQUFnQixFQURqQjtBQUVYNkMsSUFBQUEsVUFGVyxzQkFFQzNFLENBRkQsRUFFbUJ2RCxVQUZuQixFQUV3RE8sTUFGeEQsRUFFc0Y7QUFDL0YsYUFBT2lELFFBQVEsQ0FBQ0QsQ0FBRCxFQUFJd0Isc0JBQXNCLENBQUMvRSxVQUFELEVBQWFPLE1BQWIsQ0FBMUIsQ0FBZjtBQUNELEtBSlU7QUFLWGtILElBQUFBLFVBQVUsRUFBRWpCLG9CQUFvQixFQUxyQjtBQU1YK0IsSUFBQUEsZ0JBQWdCLEVBQUV4QixrQkFBa0IsQ0FBQ2hDLHNCQUFELENBTnpCO0FBT1h5RCxJQUFBQSxvQkFBb0IsRUFBRXpCLGtCQUFrQixDQUFDaEMsc0JBQUQsRUFBeUIsSUFBekI7QUFQN0IsR0FoTkc7QUF5TmhCaUUsRUFBQUEsS0FBSyxFQUFFO0FBQ0wzQixJQUFBQSxhQUFhLEVBQUVoQyxnQkFBZ0IsRUFEMUI7QUFFTGlDLElBQUFBLFVBQVUsRUFBRWpDLGdCQUFnQixFQUZ2QjtBQUdMa0MsSUFBQUEsWUFBWSxFQUFFM0Isa0JBQWtCLEVBSDNCO0FBSUw0QixJQUFBQSxZQUFZLEVBQUVwQixtQkFKVDtBQUtMcUIsSUFBQUEsVUFBVSxFQUFFakIsb0JBQW9CO0FBTDNCLEdBek5TO0FBZ09oQnlDLEVBQUFBLE9BQU8sRUFBRTtBQUNQNUIsSUFBQUEsYUFBYSxFQUFFaEMsZ0JBQWdCLEVBRHhCO0FBRVBpQyxJQUFBQSxVQUFVLEVBQUVqQyxnQkFBZ0IsRUFGckI7QUFHUGtDLElBQUFBLFlBSE8sd0JBR09oRSxDQUhQLEVBR3lCdkQsVUFIekIsRUFHZ0VPLE1BSGhFLEVBR2dHO0FBQUEsVUFDN0YwQixNQUQ2RixHQUNsRjFCLE1BRGtGLENBQzdGMEIsTUFENkY7QUFBQSxVQUU3Ri9CLElBRjZGLEdBRTdFRixVQUY2RSxDQUU3RkUsSUFGNkY7QUFBQSxVQUV2Rm9GLEtBRnVGLEdBRTdFdEYsVUFGNkUsQ0FFdkZzRixLQUZ1RjtBQUdyRyxhQUFPckQsTUFBTSxDQUFDNEQsT0FBUCxDQUFlMUIsR0FBZixDQUFtQixVQUFDN0IsTUFBRCxFQUFTd0QsTUFBVCxFQUFtQjtBQUMzQyxZQUFNQyxXQUFXLEdBQUd6RCxNQUFNLENBQUNDLElBQTNCO0FBQ0EsZUFBT2dCLENBQUMsQ0FBQ3JELElBQUQsRUFBTztBQUNiMEIsVUFBQUEsR0FBRyxFQUFFa0UsTUFEUTtBQUViUixVQUFBQSxLQUFLLEVBQUxBLEtBRmE7QUFHYnZFLFVBQUFBLEtBQUssRUFBRVQsc0JBQXNCLENBQUNOLFVBQUQsRUFBYU8sTUFBYixFQUFxQndGLFdBQXJCLENBSGhCO0FBSWJSLFVBQUFBLEVBQUUsRUFBRWxELFlBQVksQ0FBQ3JDLFVBQUQsRUFBYU8sTUFBYixFQUFxQitCLE1BQXJCLEVBQTZCLFlBQUs7QUFDaEQ7QUFDQTBELFlBQUFBLG1CQUFtQixDQUFDekYsTUFBRCxFQUFTSyxvQkFBUXNJLFNBQVIsQ0FBa0I1RyxNQUFNLENBQUNDLElBQXpCLENBQVQsRUFBeUNELE1BQXpDLENBQW5CO0FBQ0QsV0FIZTtBQUpILFNBQVAsQ0FBUjtBQVNELE9BWE0sQ0FBUDtBQVlELEtBbEJNO0FBbUJQa0YsSUFBQUEsWUFBWSxFQUFFcEIsbUJBbkJQO0FBb0JQcUIsSUFBQUEsVUFBVSxFQUFFakIsb0JBQW9CO0FBcEJ6QixHQWhPTztBQXNQaEIyQyxFQUFBQSxNQUFNLEVBQUU7QUFDTjFCLElBQUFBLFVBQVUsRUFBRVIsb0NBQW9DO0FBRDFDLEdBdFBRO0FBeVBoQm1DLEVBQUFBLFNBQVMsRUFBRTtBQUNUM0IsSUFBQUEsVUFBVSxFQUFFUixvQ0FBb0M7QUFEdkMsR0F6UEs7QUE0UGhCb0MsRUFBQUEsT0FBTyxFQUFFO0FBQ1AvQixJQUFBQSxVQUFVLEVBQUU5Qix1QkFETDtBQUVQNkIsSUFBQUEsYUFBYSxFQUFFN0IsdUJBRlI7QUFHUGlDLElBQUFBLFVBQVUsRUFBRWY7QUFITCxHQTVQTztBQWlRaEI0QyxFQUFBQSxRQUFRLEVBQUU7QUFDUmhDLElBQUFBLFVBQVUsRUFBRTVCLHdCQURKO0FBRVIyQixJQUFBQSxhQUFhLEVBQUUzQix3QkFGUDtBQUdSK0IsSUFBQUEsVUFBVSxFQUFFZDtBQUhKO0FBalFNLENBQWxCO0FBd1FBOzs7O0FBR0EsU0FBUzRDLGtCQUFULENBQTZCQyxJQUE3QixFQUF3Q0MsU0FBeEMsRUFBZ0VDLFNBQWhFLEVBQWlGO0FBQy9FLE1BQUlDLFVBQUo7QUFDQSxNQUFJQyxNQUFNLEdBQUdKLElBQUksQ0FBQ0ksTUFBbEI7O0FBQ0EsU0FBT0EsTUFBTSxJQUFJQSxNQUFNLENBQUNDLFFBQWpCLElBQTZCRCxNQUFNLEtBQUtFLFFBQS9DLEVBQXlEO0FBQ3ZELFFBQUlKLFNBQVMsSUFBSUUsTUFBTSxDQUFDRixTQUFwQixJQUFpQ0UsTUFBTSxDQUFDRixTQUFQLENBQWlCSyxLQUFsRCxJQUEyREgsTUFBTSxDQUFDRixTQUFQLENBQWlCSyxLQUFqQixDQUF1QixHQUF2QixFQUE0QnpCLE9BQTVCLENBQW9Db0IsU0FBcEMsSUFBaUQsQ0FBQyxDQUFqSCxFQUFvSDtBQUNsSEMsTUFBQUEsVUFBVSxHQUFHQyxNQUFiO0FBQ0QsS0FGRCxNQUVPLElBQUlBLE1BQU0sS0FBS0gsU0FBZixFQUEwQjtBQUMvQixhQUFPO0FBQUVPLFFBQUFBLElBQUksRUFBRU4sU0FBUyxHQUFHLENBQUMsQ0FBQ0MsVUFBTCxHQUFrQixJQUFuQztBQUF5Q0YsUUFBQUEsU0FBUyxFQUFUQSxTQUF6QztBQUFvREUsUUFBQUEsVUFBVSxFQUFFQTtBQUFoRSxPQUFQO0FBQ0Q7O0FBQ0RDLElBQUFBLE1BQU0sR0FBR0EsTUFBTSxDQUFDSyxVQUFoQjtBQUNEOztBQUNELFNBQU87QUFBRUQsSUFBQUEsSUFBSSxFQUFFO0FBQVIsR0FBUDtBQUNEO0FBRUQ7Ozs7O0FBR0EsU0FBU0UsZ0JBQVQsQ0FBMkIzSixNQUEzQixFQUF3QzRKLENBQXhDLEVBQThDO0FBQzVDLE1BQU1DLFFBQVEsR0FBZ0JOLFFBQVEsQ0FBQ08sSUFBdkM7QUFDQSxNQUFNYixJQUFJLEdBQUdqSixNQUFNLENBQUMrSixNQUFQLElBQWlCSCxDQUE5Qjs7QUFDQSxPQUNFO0FBQ0FaLEVBQUFBLGtCQUFrQixDQUFDQyxJQUFELEVBQU9ZLFFBQVAsRUFBaUIscUJBQWpCLENBQWxCLENBQTBESixJQUExRCxJQUNBO0FBQ0FULEVBQUFBLGtCQUFrQixDQUFDQyxJQUFELEVBQU9ZLFFBQVAsRUFBaUIsb0JBQWpCLENBQWxCLENBQXlESixJQUZ6RCxJQUdBO0FBQ0FULEVBQUFBLGtCQUFrQixDQUFDQyxJQUFELEVBQU9ZLFFBQVAsRUFBaUIsK0JBQWpCLENBQWxCLENBQW9FSixJQUpwRSxJQUtBO0FBQ0FULEVBQUFBLGtCQUFrQixDQUFDQyxJQUFELEVBQU9ZLFFBQVAsRUFBaUIsdUJBQWpCLENBQWxCLENBQTRESixJQVI5RCxFQVNFO0FBQ0EsV0FBTyxLQUFQO0FBQ0Q7QUFDRjtBQUVEOzs7OztBQUdPLElBQU1PLGtCQUFrQixHQUFHO0FBQ2hDQyxFQUFBQSxPQURnQyx5QkFDbUI7QUFBQSxRQUF4Q0MsV0FBd0MsUUFBeENBLFdBQXdDO0FBQUEsUUFBM0JDLFFBQTJCLFFBQTNCQSxRQUEyQjtBQUNqREEsSUFBQUEsUUFBUSxDQUFDQyxLQUFULENBQWV6RCxTQUFmO0FBQ0F1RCxJQUFBQSxXQUFXLENBQUNHLEdBQVosQ0FBZ0IsbUJBQWhCLEVBQXFDVixnQkFBckM7QUFDQU8sSUFBQUEsV0FBVyxDQUFDRyxHQUFaLENBQWdCLG9CQUFoQixFQUFzQ1YsZ0JBQXRDO0FBQ0Q7QUFMK0IsQ0FBM0I7OztBQVFQLElBQUksT0FBT1csTUFBUCxLQUFrQixXQUFsQixJQUFpQ0EsTUFBTSxDQUFDQyxRQUE1QyxFQUFzRDtBQUNwREQsRUFBQUEsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxHQUFoQixDQUFvQlIsa0JBQXBCO0FBQ0Q7O2VBRWNBLGtCIiwiZmlsZSI6ImluZGV4LmNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbmltcG9ydCB7IENyZWF0ZUVsZW1lbnQgfSBmcm9tICd2dWUnXHJcbmltcG9ydCBYRVV0aWxzIGZyb20gJ3hlLXV0aWxzL21ldGhvZHMveGUtdXRpbHMnXHJcbmltcG9ydCB7XHJcbiAgVlhFVGFibGUsXHJcbiAgUmVuZGVyUGFyYW1zLFxyXG4gIE9wdGlvblByb3BzLFxyXG4gIFJlbmRlck9wdGlvbnMsXHJcbiAgSW50ZXJjZXB0b3JQYXJhbXMsXHJcbiAgVGFibGVSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRmlsdGVyUGFyYW1zLFxyXG4gIENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsXHJcbiAgQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsXHJcbiAgQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMsXHJcbiAgRm9ybUl0ZW1SZW5kZXJPcHRpb25zLFxyXG4gIENvbHVtbkNlbGxSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRWRpdFJlbmRlclBhcmFtcyxcclxuICBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRmlsdGVyTWV0aG9kUGFyYW1zLFxyXG4gIENvbHVtbkV4cG9ydENlbGxSZW5kZXJQYXJhbXMsXHJcbiAgRm9ybUl0ZW1SZW5kZXJQYXJhbXNcclxufSBmcm9tICd2eGUtdGFibGUvbGliL3Z4ZS10YWJsZSdcclxuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5cclxuZnVuY3Rpb24gaXNFbXB0eVZhbHVlIChjZWxsVmFsdWU6IGFueSkge1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPT09IG51bGwgfHwgY2VsbFZhbHVlID09PSB1bmRlZmluZWQgfHwgY2VsbFZhbHVlID09PSAnJ1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRNb2RlbFByb3AgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMpIHtcclxuICBsZXQgcHJvcCA9ICd2YWx1ZSdcclxuICBzd2l0Y2ggKHJlbmRlck9wdHMubmFtZSkge1xyXG4gICAgY2FzZSAnQVN3aXRjaCc6XHJcbiAgICAgIHByb3AgPSAnY2hlY2tlZCdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIHByb3BcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TW9kZWxFdmVudCAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucykge1xyXG4gIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICBzd2l0Y2ggKHJlbmRlck9wdHMubmFtZSkge1xyXG4gICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgdHlwZSA9ICdjaGFuZ2UudmFsdWUnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBUmFkaW8nOlxyXG4gICAgY2FzZSAnQUNoZWNrYm94JzpcclxuICAgICAgdHlwZSA9ICdpbnB1dCdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIHR5cGVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2hhbmdlRXZlbnQgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMpIHtcclxuICByZXR1cm4gJ2NoYW5nZSdcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBUYWJsZVJlbmRlclBhcmFtcywgdmFsdWU6IGFueSwgZGVmYXVsdFByb3BzPzogeyBbcHJvcDogc3RyaW5nXTogYW55IH0pIHtcclxuICBjb25zdCB7IHZTaXplIH0gPSBwYXJhbXMuJHRhYmxlXHJcbiAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKHZTaXplID8geyBzaXplOiB2U2l6ZSB9IDoge30sIGRlZmF1bHRQcm9wcywgcmVuZGVyT3B0cy5wcm9wcywgeyBbZ2V0TW9kZWxQcm9wKHJlbmRlck9wdHMpXTogdmFsdWUgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SXRlbVByb3BzIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zLCB2YWx1ZTogYW55LCBkZWZhdWx0UHJvcHM/OiB7IFtwcm9wOiBzdHJpbmddOiBhbnkgfSkge1xyXG4gIGNvbnN0IHsgdlNpemUgfSA9IHBhcmFtcy4kZm9ybVxyXG4gIHJldHVybiBYRVV0aWxzLmFzc2lnbih2U2l6ZSA/IHsgc2l6ZTogdlNpemUgfSA6IHt9LCBkZWZhdWx0UHJvcHMsIHJlbmRlck9wdHMucHJvcHMsIHsgW2dldE1vZGVsUHJvcChyZW5kZXJPcHRzKV06IHZhbHVlIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE9ucyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBSZW5kZXJQYXJhbXMsIGlucHV0RnVuYz86IEZ1bmN0aW9uLCBjaGFuZ2VGdW5jPzogRnVuY3Rpb24pIHtcclxuICBjb25zdCB7IGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IG1vZGVsRXZlbnQgPSBnZXRNb2RlbEV2ZW50KHJlbmRlck9wdHMpXHJcbiAgY29uc3QgY2hhbmdlRXZlbnQgPSBnZXRDaGFuZ2VFdmVudChyZW5kZXJPcHRzKVxyXG4gIGNvbnN0IGlzU2FtZUV2ZW50ID0gY2hhbmdlRXZlbnQgPT09IG1vZGVsRXZlbnRcclxuICBjb25zdCBvbnM6IHsgW3R5cGU6IHN0cmluZ106IEZ1bmN0aW9uIH0gPSB7fVxyXG4gIFhFVXRpbHMub2JqZWN0RWFjaChldmVudHMsIChmdW5jOiBGdW5jdGlvbiwga2V5OiBzdHJpbmcpID0+IHtcclxuICAgIG9uc1trZXldID0gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGZ1bmMocGFyYW1zLCAuLi5hcmdzKVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgaWYgKGlucHV0RnVuYykge1xyXG4gICAgb25zW21vZGVsRXZlbnRdID0gZnVuY3Rpb24gKGFyZ3MxOiBhbnkpIHtcclxuICAgICAgaW5wdXRGdW5jKGFyZ3MxKVxyXG4gICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1ttb2RlbEV2ZW50XSkge1xyXG4gICAgICAgIGV2ZW50c1ttb2RlbEV2ZW50XShhcmdzMSlcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXNTYW1lRXZlbnQgJiYgY2hhbmdlRnVuYykge1xyXG4gICAgICAgIGNoYW5nZUZ1bmMoYXJnczEpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgaWYgKCFpc1NhbWVFdmVudCAmJiBjaGFuZ2VGdW5jKSB7XHJcbiAgICBvbnNbY2hhbmdlRXZlbnRdID0gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGNoYW5nZUZ1bmMoLi4uYXJncylcclxuICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbY2hhbmdlRXZlbnRdKSB7XHJcbiAgICAgICAgZXZlbnRzW2NoYW5nZUV2ZW50XShwYXJhbXMsIC4uLmFyZ3MpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG9uc1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFZGl0T25zIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7ICR0YWJsZSwgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIHJldHVybiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zLCAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgLy8g5aSE55CGIG1vZGVsIOWAvOWPjOWQkee7keWumlxyXG4gICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIHZhbHVlKVxyXG4gIH0sICgpID0+IHtcclxuICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAkdGFibGUudXBkYXRlU3RhdHVzKHBhcmFtcylcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGaWx0ZXJPbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zLCBvcHRpb246IENvbHVtbkZpbHRlclBhcmFtcywgY2hhbmdlRnVuYzogRnVuY3Rpb24pIHtcclxuICByZXR1cm4gZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcywgKHZhbHVlOiBhbnkpID0+IHtcclxuICAgIC8vIOWkhOeQhiBtb2RlbCDlgLzlj4zlkJHnu5HlrppcclxuICAgIG9wdGlvbi5kYXRhID0gdmFsdWVcclxuICB9LCBjaGFuZ2VGdW5jKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJdGVtT25zIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyAkZm9ybSwgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xyXG4gIHJldHVybiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zLCAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgLy8g5aSE55CGIG1vZGVsIOWAvOWPjOWQkee7keWumlxyXG4gICAgWEVVdGlscy5zZXQoZGF0YSwgcHJvcGVydHksIHZhbHVlKVxyXG4gIH0sICgpID0+IHtcclxuICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAkZm9ybS51cGRhdGVTdGF0dXMocGFyYW1zKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hdGNoQ2FzY2FkZXJEYXRhIChpbmRleDogbnVtYmVyLCBsaXN0OiBhbnlbXSwgdmFsdWVzOiBhbnlbXSwgbGFiZWxzOiBhbnlbXSkge1xyXG4gIGNvbnN0IHZhbCA9IHZhbHVlc1tpbmRleF1cclxuICBpZiAobGlzdCAmJiB2YWx1ZXMubGVuZ3RoID4gaW5kZXgpIHtcclxuICAgIFhFVXRpbHMuZWFjaChsaXN0LCAoaXRlbSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS52YWx1ZSA9PT0gdmFsKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goaXRlbS5sYWJlbClcclxuICAgICAgICBtYXRjaENhc2NhZGVyRGF0YSgrK2luZGV4LCBpdGVtLmNoaWxkcmVuLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdERhdGVQaWNrZXIgKGRlZmF1bHRGb3JtYXQ6IHN0cmluZykge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zLCBkZWZhdWx0Rm9ybWF0KSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNlbGVjdENlbGxWYWx1ZSAocmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIHByb3BzID0ge30sIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGNvbnN0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICBjb25zdCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gIGNvbnN0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmICghaXNFbXB0eVZhbHVlKGNlbGxWYWx1ZSkpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLm1hcChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnID8gY2VsbFZhbHVlIDogW2NlbGxWYWx1ZV0sIG9wdGlvbkdyb3VwcyA/ICh2YWx1ZSkgPT4ge1xyXG4gICAgICBsZXQgc2VsZWN0SXRlbVxyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb3B0aW9uR3JvdXBzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgIHNlbGVjdEl0ZW0gPSBYRVV0aWxzLmZpbmQob3B0aW9uR3JvdXBzW2luZGV4XVtncm91cE9wdGlvbnNdLCAoaXRlbSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgICBpZiAoc2VsZWN0SXRlbSkge1xyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZVxyXG4gICAgfSA6ICh2YWx1ZSkgPT4ge1xyXG4gICAgICBjb25zdCBzZWxlY3RJdGVtID0gWEVVdGlscy5maW5kKG9wdGlvbnMsIChpdGVtKSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICByZXR1cm4gc2VsZWN0SXRlbSA/IHNlbGVjdEl0ZW1bbGFiZWxQcm9wXSA6IHZhbHVlXHJcbiAgICB9KS5qb2luKCcsICcpXHJcbiAgfVxyXG4gIHJldHVybiBudWxsXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhc2NhZGVyQ2VsbFZhbHVlIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICB2YXIgdmFsdWVzID0gY2VsbFZhbHVlIHx8IFtdXHJcbiAgdmFyIGxhYmVsczogQXJyYXk8YW55PiA9IFtdXHJcbiAgbWF0Y2hDYXNjYWRlckRhdGEoMCwgcHJvcHMub3B0aW9ucywgdmFsdWVzLCBsYWJlbHMpXHJcbiAgcmV0dXJuIChwcm9wcy5zaG93QWxsTGV2ZWxzID09PSBmYWxzZSA/IGxhYmVscy5zbGljZShsYWJlbHMubGVuZ3RoIC0gMSwgbGFiZWxzLmxlbmd0aCkgOiBsYWJlbHMpLmpvaW4oYCAke3Byb3BzLnNlcGFyYXRvciB8fCAnLyd9IGApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgY2VsbFZhbHVlID0gWEVVdGlscy5tYXAoY2VsbFZhbHVlLCAoZGF0ZSkgPT4gZGF0ZS5mb3JtYXQocHJvcHMuZm9ybWF0IHx8ICdZWVlZLU1NLUREJykpLmpvaW4oJyB+ICcpXHJcbiAgfVxyXG4gIHJldHVybiBjZWxsVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyB0cmVlRGF0YSwgdHJlZUNoZWNrYWJsZSB9ID0gcHJvcHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKCFpc0VtcHR5VmFsdWUoY2VsbFZhbHVlKSkge1xyXG4gICAgcmV0dXJuIFhFVXRpbHMubWFwKHRyZWVDaGVja2FibGUgPyBjZWxsVmFsdWUgOiBbY2VsbFZhbHVlXSwgKHZhbHVlKSA9PiB7XHJcbiAgICAgIGNvbnN0IG1hdGNoT2JqID0gWEVVdGlscy5maW5kVHJlZSh0cmVlRGF0YSwgKGl0ZW0pID0+IGl0ZW0udmFsdWUgPT09IHZhbHVlLCB7IGNoaWxkcmVuOiAnY2hpbGRyZW4nIH0pXHJcbiAgICAgIHJldHVybiBtYXRjaE9iaiA/IG1hdGNoT2JqLml0ZW0udGl0bGUgOiB2YWx1ZVxyXG4gICAgfSkuam9pbignLCAnKVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhdGVQaWNrZXJDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcyB8IENvbHVtbkV4cG9ydENlbGxSZW5kZXJQYXJhbXMsIGRlZmF1bHRGb3JtYXQ6IHN0cmluZykge1xyXG4gIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoY2VsbFZhbHVlKSB7XHJcbiAgICBjZWxsVmFsdWUgPSBjZWxsVmFsdWUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCBkZWZhdWx0Rm9ybWF0KVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUVkaXRSZW5kZXIgKGRlZmF1bHRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkVkaXRSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKHJlbmRlck9wdHMubmFtZSwge1xyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgY2VsbFZhbHVlLCBkZWZhdWx0UHJvcHMpLFxyXG4gICAgICAgIG9uOiBnZXRFZGl0T25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgfSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIHJldHVybiBbXHJcbiAgICBoKCdhLWJ1dHRvbicsIHtcclxuICAgICAgYXR0cnMsXHJcbiAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgbnVsbCksXHJcbiAgICAgIG9uOiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgfSwgY2VsbFRleHQoaCwgcmVuZGVyT3B0cy5jb250ZW50KSlcclxuICBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gIHJldHVybiByZW5kZXJPcHRzLmNoaWxkcmVuLm1hcCgoY2hpbGRSZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucykgPT4gZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIoaCwgY2hpbGRSZW5kZXJPcHRzLCBwYXJhbXMpWzBdKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGaWx0ZXJSZW5kZXIgKGRlZmF1bHRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IG5hbWUsIGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhXHJcbiAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICBrZXk6IG9JbmRleCxcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlLCBkZWZhdWx0UHJvcHMpLFxyXG4gICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcclxuICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKHBhcmFtcywgISFvcHRpb24uZGF0YSwgb3B0aW9uKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ29uZmlybUZpbHRlciAocGFyYW1zOiBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMsIGNoZWNrZWQ6IGJvb2xlYW4sIG9wdGlvbjogQ29sdW1uRmlsdGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyAkcGFuZWwgfSA9IHBhcmFtc1xyXG4gICRwYW5lbC5jaGFuZ2VPcHRpb24oe30sIGNoZWNrZWQsIG9wdGlvbilcclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEZpbHRlck1ldGhvZCAocGFyYW1zOiBDb2x1bW5GaWx0ZXJNZXRob2RQYXJhbXMpIHtcclxuICBjb25zdCB7IG9wdGlvbiwgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gZGF0YVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJPcHRpb25zIChoOiBDcmVhdGVFbGVtZW50LCBvcHRpb25zOiBhbnlbXSwgb3B0aW9uUHJvcHM6IE9wdGlvblByb3BzKSB7XHJcbiAgY29uc3QgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gIGNvbnN0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICBjb25zdCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgcmV0dXJuIFhFVXRpbHMubWFwKG9wdGlvbnMsIChpdGVtLCBvSW5kZXgpID0+IHtcclxuICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHRpb24nLCB7XHJcbiAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICBwcm9wczoge1xyXG4gICAgICAgIHZhbHVlOiBpdGVtW3ZhbHVlUHJvcF0sXHJcbiAgICAgICAgZGlzYWJsZWQ6IGl0ZW1bZGlzYWJsZWRQcm9wXVxyXG4gICAgICB9XHJcbiAgICB9LCBpdGVtW2xhYmVsUHJvcF0pXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2VsbFRleHQgKGg6IENyZWF0ZUVsZW1lbnQsIGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgcmV0dXJuIFsnJyArIChpc0VtcHR5VmFsdWUoY2VsbFZhbHVlKSA/ICcnIDogY2VsbFZhbHVlKV1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRm9ybUl0ZW1SZW5kZXIgKGRlZmF1bHRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IG5hbWUgfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChuYW1lLCB7XHJcbiAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgcHJvcHM6IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGl0ZW1WYWx1ZSwgZGVmYXVsdFByb3BzKSxcclxuICAgICAgICBvbjogZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0pXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHByb3BzID0gZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgbnVsbClcclxuICByZXR1cm4gW1xyXG4gICAgaCgnYS1idXR0b24nLCB7XHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBwcm9wcyxcclxuICAgICAgb246IGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICB9LCBjZWxsVGV4dChoLCByZW5kZXJPcHRzLmNvbnRlbnQgfHwgcHJvcHMuY29udGVudCkpXHJcbiAgXVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gIHJldHVybiByZW5kZXJPcHRzLmNoaWxkcmVuLm1hcCgoY2hpbGRSZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMpID0+IGRlZmF1bHRCdXR0b25JdGVtUmVuZGVyKGgsIGNoaWxkUmVuZGVyT3B0cywgcGFyYW1zKVswXSlcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCAoZGVmYXVsdEZvcm1hdDogc3RyaW5nLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogQ29sdW1uRXhwb3J0Q2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgcmV0dXJuIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocGFyYW1zLmNvbHVtbltyZW5kZXJQcm9wZXJ0eV0sIHBhcmFtcywgZGVmYXVsdEZvcm1hdClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUV4cG9ydE1ldGhvZCAodmFsdWVNZXRob2Q6IEZ1bmN0aW9uLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogQ29sdW1uRXhwb3J0Q2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgcmV0dXJuIHZhbHVlTWV0aG9kKHBhcmFtcy5jb2x1bW5bcmVuZGVyUHJvcGVydHldLCBwYXJhbXMpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIgKCkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IG5hbWUsIG9wdGlvbnMgPSBbXSwgb3B0aW9uUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICBjb25zdCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgICBjb25zdCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgICBjb25zdCBpdGVtVmFsdWUgPSBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSlcclxuICAgIHJldHVybiBbXHJcbiAgICAgIGgoYCR7bmFtZX1Hcm91cGAsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlKSxcclxuICAgICAgICBvbjogZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0sIG9wdGlvbnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgdmFsdWU6IG9wdGlvblt2YWx1ZVByb3BdLFxyXG4gICAgICAgICAgICBkaXNhYmxlZDogb3B0aW9uW2Rpc2FibGVkUHJvcF1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBvcHRpb25bbGFiZWxQcm9wXSlcclxuICAgICAgfSkpXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5riy5p+T5Ye95pWwXHJcbiAqL1xyXG5jb25zdCByZW5kZXJNYXAgPSB7XHJcbiAgQUF1dG9Db21wbGV0ZToge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBSW5wdXQ6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUlucHV0TnVtYmVyOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQtbnVtYmVyLWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0IChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgY29uc3QgcHJvcHMgPSBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgY2VsbFZhbHVlKVxyXG4gICAgICBjb25zdCBvbiA9IGdldEVkaXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGNvbnN0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgb25cclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG9uXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJGaWx0ZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBjb25zdCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcclxuICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKSxcclxuICAgICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIG9wdGlvbi5kYXRhICYmIG9wdGlvbi5kYXRhLmxlbmd0aCA+IDAsIG9wdGlvbilcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhXHJcbiAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uVmFsdWUpLFxyXG4gICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKHBhcmFtcywgb3B0aW9uLmRhdGEgJiYgb3B0aW9uLmRhdGEubGVuZ3RoID4gMCwgb3B0aW9uKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBmaWx0ZXJNZXRob2QgKHBhcmFtczogQ29sdW1uRmlsdGVyTWV0aG9kUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9uLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgICAgIGNvbnN0IHsgcHJvcGVydHksIGZpbHRlclJlbmRlcjogcmVuZGVyT3B0cyB9ID0gY29sdW1uXHJcbiAgICAgIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIHByb3BlcnR5KVxyXG4gICAgICBpZiAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJykge1xyXG4gICAgICAgIGlmIChYRVV0aWxzLmlzQXJyYXkoY2VsbFZhbHVlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIFhFVXRpbHMuaW5jbHVkZUFycmF5cyhjZWxsVmFsdWUsIGRhdGEpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhLmluZGV4T2YoY2VsbFZhbHVlKSA+IC0xXHJcbiAgICAgIH1cclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgICAgIHJldHVybiBjZWxsVmFsdWUgPT0gZGF0YVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW0gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gICAgICBjb25zdCB7IG9wdGlvbnMgPSBbXSwgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgaXRlbVZhbHVlID0gWEVVdGlscy5nZXQoZGF0YSwgcHJvcGVydHkpXHJcbiAgICAgIGNvbnN0IHByb3BzID0gZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlKVxyXG4gICAgICBjb25zdCBvbiA9IGdldEl0ZW1PbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGNvbnN0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgb25cclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIG9uXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0U2VsZWN0Q2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0U2VsZWN0Q2VsbFZhbHVlLCB0cnVlKVxyXG4gIH0sXHJcbiAgQUNhc2NhZGVyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRDYXNjYWRlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0Q2FzY2FkZXJDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRDYXNjYWRlckNlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFEYXRlUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NLUREJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTS1ERCcpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0tREQnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQU1vbnRoUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTScpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0nLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVJhbmdlUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFXZWVrUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLVdX5ZGoJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1XV+WRqCcpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktV1flkagnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVRpbWVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ0hIOm1tOnNzJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnSEg6bW06c3MnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdISDptbTpzcycsIHRydWUpXHJcbiAgfSxcclxuICBBVHJlZVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFRyZWVTZWxlY3RDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBUmF0ZToge1xyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFTd2l0Y2g6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRmlsdGVyUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgY29uc3QgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBjb25zdCB7IG5hbWUsIGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZGF0YVxyXG4gICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKSxcclxuICAgICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcclxuICAgICAgICAgICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIFhFVXRpbHMuaXNCb29sZWFuKG9wdGlvbi5kYXRhKSwgb3B0aW9uKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFSYWRpbzoge1xyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyKClcclxuICB9LFxyXG4gIEFDaGVja2JveDoge1xyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyKClcclxuICB9LFxyXG4gIEFCdXR0b246IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJJdGVtOiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlclxyXG4gIH0sXHJcbiAgQUJ1dHRvbnM6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckl0ZW06IGRlZmF1bHRCdXR0b25zSXRlbVJlbmRlclxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOajgOafpeinpuWPkea6kOaYr+WQpuWxnuS6juebruagh+iKgueCuVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0RXZlbnRUYXJnZXROb2RlIChldm50OiBhbnksIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgbGV0IHRhcmdldEVsZW1cclxuICBsZXQgdGFyZ2V0ID0gZXZudC50YXJnZXRcclxuICB3aGlsZSAodGFyZ2V0ICYmIHRhcmdldC5ub2RlVHlwZSAmJiB0YXJnZXQgIT09IGRvY3VtZW50KSB7XHJcbiAgICBpZiAoY2xhc3NOYW1lICYmIHRhcmdldC5jbGFzc05hbWUgJiYgdGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCAmJiB0YXJnZXQuY2xhc3NOYW1lLnNwbGl0KCcgJykuaW5kZXhPZihjbGFzc05hbWUpID4gLTEpIHtcclxuICAgICAgdGFyZ2V0RWxlbSA9IHRhcmdldFxyXG4gICAgfSBlbHNlIGlmICh0YXJnZXQgPT09IGNvbnRhaW5lcikge1xyXG4gICAgICByZXR1cm4geyBmbGFnOiBjbGFzc05hbWUgPyAhIXRhcmdldEVsZW0gOiB0cnVlLCBjb250YWluZXIsIHRhcmdldEVsZW06IHRhcmdldEVsZW0gfVxyXG4gICAgfVxyXG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGVcclxuICB9XHJcbiAgcmV0dXJuIHsgZmxhZzogZmFsc2UgfVxyXG59XHJcblxyXG4vKipcclxuICog5LqL5Lu25YW85a655oCn5aSE55CGXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVDbGVhckV2ZW50IChwYXJhbXM6IGFueSwgZTogYW55KSB7XHJcbiAgY29uc3QgYm9keUVsZW06IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuYm9keVxyXG4gIGNvbnN0IGV2bnQgPSBwYXJhbXMuJGV2ZW50IHx8IGVcclxuICBpZiAoXHJcbiAgICAvLyDkuIvmi4nmoYZcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1zZWxlY3QtZHJvcGRvd24nKS5mbGFnIHx8XHJcbiAgICAvLyDnuqfogZRcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYXNjYWRlci1tZW51cycpLmZsYWcgfHxcclxuICAgIC8vIOaXpeacn1xyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhbGVuZGFyLXBpY2tlci1jb250YWluZXInKS5mbGFnIHx8XHJcbiAgICAvLyDml7bpl7TpgInmi6lcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC10aW1lLXBpY2tlci1wYW5lbCcpLmZsYWdcclxuICApIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOWfuuS6jiB2eGUtdGFibGUg6KGo5qC855qE6YCC6YWN5o+S5Lu277yM55So5LqO5YW85a65IGFudC1kZXNpZ24tdnVlIOe7hOS7tuW6k1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFZYRVRhYmxlUGx1Z2luQW50ZCA9IHtcclxuICBpbnN0YWxsICh7IGludGVyY2VwdG9yLCByZW5kZXJlciB9OiB0eXBlb2YgVlhFVGFibGUpIHtcclxuICAgIHJlbmRlcmVyLm1peGluKHJlbmRlck1hcClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJGaWx0ZXInLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gICAgaW50ZXJjZXB0b3IuYWRkKCdldmVudC5jbGVhckFjdGl2ZWQnLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gIH1cclxufVxyXG5cclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5WWEVUYWJsZSkge1xyXG4gIHdpbmRvdy5WWEVUYWJsZS51c2UoVlhFVGFibGVQbHVnaW5BbnRkKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWWEVUYWJsZVBsdWdpbkFudGRcclxuIl19
