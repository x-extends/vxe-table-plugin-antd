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
    ons[modelEvent] = function (value) {
      inputFunc(value);

      if (events && events[modelEvent]) {
        events[modelEvent](value);
      }

      if (isSameEvent && changeFunc) {
        changeFunc();
      }
    };
  }

  if (!isSameEvent && changeFunc) {
    ons[changeEvent] = function () {
      changeFunc();

      if (events && events[changeEvent]) {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

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
  var row = params.row,
      column = params.column;

  var cellValue = _xeUtils["default"].get(row, column.property);

  if (cellValue && (props.treeCheckable || props.multiple)) {
    cellValue = cellValue.join(';');
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
    if (className && target.className && target.className.split(' ').indexOf(className) > -1) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsImNlbGxWYWx1ZSIsInVuZGVmaW5lZCIsImdldE1vZGVsUHJvcCIsInJlbmRlck9wdHMiLCJwcm9wIiwibmFtZSIsImdldE1vZGVsRXZlbnQiLCJ0eXBlIiwiZ2V0Q2hhbmdlRXZlbnQiLCJnZXRDZWxsRWRpdEZpbHRlclByb3BzIiwicGFyYW1zIiwidmFsdWUiLCJkZWZhdWx0UHJvcHMiLCJ2U2l6ZSIsIiR0YWJsZSIsIlhFVXRpbHMiLCJhc3NpZ24iLCJzaXplIiwicHJvcHMiLCJnZXRJdGVtUHJvcHMiLCIkZm9ybSIsImdldE9ucyIsImlucHV0RnVuYyIsImNoYW5nZUZ1bmMiLCJldmVudHMiLCJtb2RlbEV2ZW50IiwiY2hhbmdlRXZlbnQiLCJpc1NhbWVFdmVudCIsIm9ucyIsIm9iamVjdEVhY2giLCJmdW5jIiwia2V5IiwiYXJncyIsImdldEVkaXRPbnMiLCJyb3ciLCJjb2x1bW4iLCJzZXQiLCJwcm9wZXJ0eSIsInVwZGF0ZVN0YXR1cyIsImdldEZpbHRlck9ucyIsIm9wdGlvbiIsImRhdGEiLCJnZXRJdGVtT25zIiwibWF0Y2hDYXNjYWRlckRhdGEiLCJpbmRleCIsImxpc3QiLCJ2YWx1ZXMiLCJsYWJlbHMiLCJ2YWwiLCJsZW5ndGgiLCJlYWNoIiwiaXRlbSIsInB1c2giLCJsYWJlbCIsImNoaWxkcmVuIiwiZm9ybWF0RGF0ZVBpY2tlciIsImRlZmF1bHRGb3JtYXQiLCJoIiwiY2VsbFRleHQiLCJnZXREYXRlUGlja2VyQ2VsbFZhbHVlIiwiZ2V0U2VsZWN0Q2VsbFZhbHVlIiwib3B0aW9ucyIsIm9wdGlvbkdyb3VwcyIsIm9wdGlvblByb3BzIiwib3B0aW9uR3JvdXBQcm9wcyIsImxhYmVsUHJvcCIsInZhbHVlUHJvcCIsImdyb3VwT3B0aW9ucyIsImdldCIsIm1hcCIsIm1vZGUiLCJzZWxlY3RJdGVtIiwiZmluZCIsImpvaW4iLCJnZXRDYXNjYWRlckNlbGxWYWx1ZSIsInNob3dBbGxMZXZlbHMiLCJzbGljZSIsInNlcGFyYXRvciIsImdldFJhbmdlUGlja2VyQ2VsbFZhbHVlIiwiZGF0ZSIsImZvcm1hdCIsImdldFRyZWVTZWxlY3RDZWxsVmFsdWUiLCJ0cmVlQ2hlY2thYmxlIiwibXVsdGlwbGUiLCJjcmVhdGVFZGl0UmVuZGVyIiwiYXR0cnMiLCJvbiIsImRlZmF1bHRCdXR0b25FZGl0UmVuZGVyIiwiY29udGVudCIsImRlZmF1bHRCdXR0b25zRWRpdFJlbmRlciIsImNoaWxkUmVuZGVyT3B0cyIsImNyZWF0ZUZpbHRlclJlbmRlciIsImZpbHRlcnMiLCJvSW5kZXgiLCJvcHRpb25WYWx1ZSIsImhhbmRsZUNvbmZpcm1GaWx0ZXIiLCJjaGVja2VkIiwiJHBhbmVsIiwiY2hhbmdlT3B0aW9uIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsInJlbmRlck9wdGlvbnMiLCJkaXNhYmxlZFByb3AiLCJkaXNhYmxlZCIsImNyZWF0ZUZvcm1JdGVtUmVuZGVyIiwiaXRlbVZhbHVlIiwiZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXIiLCJkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXIiLCJjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kIiwiaXNFZGl0IiwicmVuZGVyUHJvcGVydHkiLCJjcmVhdGVFeHBvcnRNZXRob2QiLCJ2YWx1ZU1ldGhvZCIsImNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlciIsInJlbmRlck1hcCIsIkFBdXRvQ29tcGxldGUiLCJhdXRvZm9jdXMiLCJyZW5kZXJEZWZhdWx0IiwicmVuZGVyRWRpdCIsInJlbmRlckZpbHRlciIsImZpbHRlck1ldGhvZCIsInJlbmRlckl0ZW0iLCJBSW5wdXQiLCJBSW5wdXROdW1iZXIiLCJBU2VsZWN0IiwiZ3JvdXBMYWJlbCIsImdyb3VwIiwiZ0luZGV4Iiwic2xvdCIsImNvbmNhdCIsInJlbmRlckNlbGwiLCJmaWx0ZXJSZW5kZXIiLCJpc0FycmF5IiwiaW5jbHVkZUFycmF5cyIsImluZGV4T2YiLCJjZWxsRXhwb3J0TWV0aG9kIiwiZWRpdENlbGxFeHBvcnRNZXRob2QiLCJBQ2FzY2FkZXIiLCJBRGF0ZVBpY2tlciIsIkFNb250aFBpY2tlciIsIkFSYW5nZVBpY2tlciIsIkFXZWVrUGlja2VyIiwiQVRpbWVQaWNrZXIiLCJBVHJlZVNlbGVjdCIsIkFSYXRlIiwiQVN3aXRjaCIsImlzQm9vbGVhbiIsIkFSYWRpbyIsIkFDaGVja2JveCIsIkFCdXR0b24iLCJBQnV0dG9ucyIsImdldEV2ZW50VGFyZ2V0Tm9kZSIsImV2bnQiLCJjb250YWluZXIiLCJjbGFzc05hbWUiLCJ0YXJnZXRFbGVtIiwidGFyZ2V0Iiwibm9kZVR5cGUiLCJkb2N1bWVudCIsInNwbGl0IiwiZmxhZyIsInBhcmVudE5vZGUiLCJoYW5kbGVDbGVhckV2ZW50IiwiYm9keUVsZW0iLCJib2R5IiwiVlhFVGFibGVQbHVnaW5BbnRkIiwiaW5zdGFsbCIsImludGVyY2VwdG9yIiwicmVuZGVyZXIiLCJtaXhpbiIsImFkZCIsIndpbmRvdyIsIlZYRVRhYmxlIiwidXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7Ozs7OztBQWtCQTtBQUVBLFNBQVNBLFlBQVQsQ0FBdUJDLFNBQXZCLEVBQXFDO0FBQ25DLFNBQU9BLFNBQVMsS0FBSyxJQUFkLElBQXNCQSxTQUFTLEtBQUtDLFNBQXBDLElBQWlERCxTQUFTLEtBQUssRUFBdEU7QUFDRDs7QUFFRCxTQUFTRSxZQUFULENBQXVCQyxVQUF2QixFQUFnRDtBQUM5QyxNQUFJQyxJQUFJLEdBQUcsT0FBWDs7QUFDQSxVQUFRRCxVQUFVLENBQUNFLElBQW5CO0FBQ0UsU0FBSyxTQUFMO0FBQ0VELE1BQUFBLElBQUksR0FBRyxTQUFQO0FBQ0E7QUFISjs7QUFLQSxTQUFPQSxJQUFQO0FBQ0Q7O0FBRUQsU0FBU0UsYUFBVCxDQUF3QkgsVUFBeEIsRUFBaUQ7QUFDL0MsTUFBSUksSUFBSSxHQUFHLFFBQVg7O0FBQ0EsVUFBUUosVUFBVSxDQUFDRSxJQUFuQjtBQUNFLFNBQUssUUFBTDtBQUNFRSxNQUFBQSxJQUFJLEdBQUcs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QTFELElBQ0E7QUFDQVQsRUFBQUEsa0JBQWtCLENBQUNDLElBQUQsRUFBT1csUUFBUCxFQUFpQixvQkFBakIsQ0FBbEIsQ0FBeURILElBRnpELElBR0E7QUFDQVQsRUFBQUEsa0JBQWtCLENBQUNDLElBQUQsRUFBT1csUUFBUCxFQUFpQiwrQkFBakIsQ0FBbEIsQ0FBb0VILElBSnBFLElBS0E7QUFDQVQsRUFBQUEsa0JBQWtCLENBQUNDLElBQUQsRUFBT1csUUFBUCxFQUFpQix1QkFBakIsQ0FBbEIsQ0FBNERILElBUjlELEVBU0U7QUFDQSxXQUFPLEtBQVA7QUFDRDtBQUNGO0FBRUQ7Ozs7O0FBR08sSUFBTUssa0JBQWtCLEdBQUc7QUFDaENDLEVBQUFBLE9BRGdDLHlCQUNtQjtBQUFBLFFBQXhDQyxXQUF3QyxRQUF4Q0EsV0FBd0M7QUFBQSxRQUEzQkMsUUFBMkIsUUFBM0JBLFFBQTJCO0FBQ2pEQSxJQUFBQSxRQUFRLENBQUNDLEtBQVQsQ0FBZXZELFNBQWY7QUFDQXFELElBQUFBLFdBQVcsQ0FBQ0csR0FBWixDQUFnQixtQkFBaEIsRUFBcUNSLGdCQUFyQztBQUNBSyxJQUFBQSxXQUFXLENBQUNHLEdBQVosQ0FBZ0Isb0JBQWhCLEVBQXNDUixnQkFBdEM7QUFDRDtBQUwrQixDQUEzQjs7O0FBUVAsSUFBSSxPQUFPUyxNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxNQUFNLENBQUNDLFFBQTVDLEVBQXNEO0FBQ3BERCxFQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CUixrQkFBcEI7QUFDRDs7ZUFFY0Esa0IiLCJmaWxlIjoiaW5kZXguY29tbW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuaW1wb3J0IHsgQ3JlYXRlRWxlbWVudCB9IGZyb20gJ3Z1ZSdcclxuaW1wb3J0IFhFVXRpbHMgZnJvbSAneGUtdXRpbHMvbWV0aG9kcy94ZS11dGlscydcclxuaW1wb3J0IHtcclxuICBWWEVUYWJsZSxcclxuICBSZW5kZXJQYXJhbXMsXHJcbiAgT3B0aW9uUHJvcHMsXHJcbiAgUmVuZGVyT3B0aW9ucyxcclxuICBUYWJsZVJlbmRlclBhcmFtcyxcclxuICBDb2x1bW5GaWx0ZXJSZW5kZXJPcHRpb25zLFxyXG4gIENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLFxyXG4gIENvbHVtbkVkaXRSZW5kZXJPcHRpb25zLFxyXG4gIEZvcm1JdGVtUmVuZGVyT3B0aW9ucyxcclxuICBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zLFxyXG4gIENvbHVtbkVkaXRSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zLFxyXG4gIENvbHVtbkZpbHRlck1ldGhvZFBhcmFtcyxcclxuICBDb2x1bW5FeHBvcnRDZWxsUmVuZGVyUGFyYW1zLFxyXG4gIEZvcm1JdGVtUmVuZGVyUGFyYW1zXHJcbn0gZnJvbSAndnhlLXRhYmxlL2xpYi92eGUtdGFibGUnXHJcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuXHJcbmZ1bmN0aW9uIGlzRW1wdHlWYWx1ZSAoY2VsbFZhbHVlOiBhbnkpIHtcclxuICByZXR1cm4gY2VsbFZhbHVlID09PSBudWxsIHx8IGNlbGxWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGNlbGxWYWx1ZSA9PT0gJydcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TW9kZWxQcm9wIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zKSB7XHJcbiAgbGV0IHByb3AgPSAndmFsdWUnXHJcbiAgc3dpdGNoIChyZW5kZXJPcHRzLm5hbWUpIHtcclxuICAgIGNhc2UgJ0FTd2l0Y2gnOlxyXG4gICAgICBwcm9wID0gJ2NoZWNrZWQnXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIHJldHVybiBwcm9wXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE1vZGVsRXZlbnQgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMpIHtcclxuICBsZXQgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgc3dpdGNoIChyZW5kZXJPcHRzLm5hbWUpIHtcclxuICAgIGNhc2UgJ0FJbnB1dCc6XHJcbiAgICAgIHR5cGUgPSAnY2hhbmdlLnZhbHVlJ1xyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gdHlwZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDaGFuZ2VFdmVudCAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucykge1xyXG4gIHJldHVybiAnY2hhbmdlJ1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDZWxsRWRpdEZpbHRlclByb3BzIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IFRhYmxlUmVuZGVyUGFyYW1zLCB2YWx1ZTogYW55LCBkZWZhdWx0UHJvcHM/OiB7IFtwcm9wOiBzdHJpbmddOiBhbnkgfSkge1xyXG4gIGNvbnN0IHsgdlNpemUgfSA9IHBhcmFtcy4kdGFibGVcclxuICByZXR1cm4gWEVVdGlscy5hc3NpZ24odlNpemUgPyB7IHNpemU6IHZTaXplIH0gOiB7fSwgZGVmYXVsdFByb3BzLCByZW5kZXJPcHRzLnByb3BzLCB7IFtnZXRNb2RlbFByb3AocmVuZGVyT3B0cyldOiB2YWx1ZSB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJdGVtUHJvcHMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMsIHZhbHVlOiBhbnksIGRlZmF1bHRQcm9wcz86IHsgW3Byb3A6IHN0cmluZ106IGFueSB9KSB7XHJcbiAgY29uc3QgeyB2U2l6ZSB9ID0gcGFyYW1zLiRmb3JtXHJcbiAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKHZTaXplID8geyBzaXplOiB2U2l6ZSB9IDoge30sIGRlZmF1bHRQcm9wcywgcmVuZGVyT3B0cy5wcm9wcywgeyBbZ2V0TW9kZWxQcm9wKHJlbmRlck9wdHMpXTogdmFsdWUgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0T25zIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IFJlbmRlclBhcmFtcywgaW5wdXRGdW5jPzogRnVuY3Rpb24sIGNoYW5nZUZ1bmM/OiBGdW5jdGlvbikge1xyXG4gIGNvbnN0IHsgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgbW9kZWxFdmVudCA9IGdldE1vZGVsRXZlbnQocmVuZGVyT3B0cylcclxuICBjb25zdCBjaGFuZ2VFdmVudCA9IGdldENoYW5nZUV2ZW50KHJlbmRlck9wdHMpXHJcbiAgY29uc3QgaXNTYW1lRXZlbnQgPSBjaGFuZ2VFdmVudCA9PT0gbW9kZWxFdmVudFxyXG4gIGNvbnN0IG9uczogeyBbdHlwZTogc3RyaW5nXTogRnVuY3Rpb24gfSA9IHt9XHJcbiAgWEVVdGlscy5vYmplY3RFYWNoKGV2ZW50cywgKGZ1bmM6IEZ1bmN0aW9uLCBrZXk6IHN0cmluZykgPT4ge1xyXG4gICAgb25zW2tleV0gPSBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgZnVuYyhwYXJhbXMsIC4uLmFyZ3MpXHJcbiAgICB9XHJcbiAgfSlcclxuICBpZiAoaW5wdXRGdW5jKSB7XHJcbiAgICBvbnNbbW9kZWxFdmVudF0gPSBmdW5jdGlvbiAodmFsdWU6IGFueSkge1xyXG4gICAgICBpbnB1dEZ1bmModmFsdWUpXHJcbiAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW21vZGVsRXZlbnRdKSB7XHJcbiAgICAgICAgZXZlbnRzW21vZGVsRXZlbnRdKHZhbHVlKVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChpc1NhbWVFdmVudCAmJiBjaGFuZ2VGdW5jKSB7XHJcbiAgICAgICAgY2hhbmdlRnVuYygpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgaWYgKCFpc1NhbWVFdmVudCAmJiBjaGFuZ2VGdW5jKSB7XHJcbiAgICBvbnNbY2hhbmdlRXZlbnRdID0gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGNoYW5nZUZ1bmMoKVxyXG4gICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1tjaGFuZ2VFdmVudF0pIHtcclxuICAgICAgICBldmVudHNbY2hhbmdlRXZlbnRdKHBhcmFtcywgLi4uYXJncylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gb25zXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEVkaXRPbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgJHRhYmxlLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgcmV0dXJuIGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAvLyDlpITnkIYgbW9kZWwg5YC85Y+M5ZCR57uR5a6aXHJcbiAgICBYRVV0aWxzLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgdmFsdWUpXHJcbiAgfSwgKCkgPT4ge1xyXG4gICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICR0YWJsZS51cGRhdGVTdGF0dXMocGFyYW1zKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZpbHRlck9ucyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMsIG9wdGlvbjogYW55LCBjaGFuZ2VGdW5jOiBGdW5jdGlvbikge1xyXG4gIHJldHVybiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zLCAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgLy8g5aSE55CGIG1vZGVsIOWAvOWPjOWQkee7keWumlxyXG4gICAgb3B0aW9uLmRhdGEgPSB2YWx1ZVxyXG4gIH0sIGNoYW5nZUZ1bmMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEl0ZW1PbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7ICRmb3JtLCBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgcmV0dXJuIGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAvLyDlpITnkIYgbW9kZWwg5YC85Y+M5ZCR57uR5a6aXHJcbiAgICBYRVV0aWxzLnNldChkYXRhLCBwcm9wZXJ0eSwgdmFsdWUpXHJcbiAgfSwgKCkgPT4ge1xyXG4gICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICRmb3JtLnVwZGF0ZVN0YXR1cyhwYXJhbXMpXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gbWF0Y2hDYXNjYWRlckRhdGEgKGluZGV4OiBudW1iZXIsIGxpc3Q6IEFycmF5PGFueT4sIHZhbHVlczogQXJyYXk8YW55PiwgbGFiZWxzOiBBcnJheTxhbnk+KSB7XHJcbiAgY29uc3QgdmFsID0gdmFsdWVzW2luZGV4XVxyXG4gIGlmIChsaXN0ICYmIHZhbHVlcy5sZW5ndGggPiBpbmRleCkge1xyXG4gICAgWEVVdGlscy5lYWNoKGxpc3QsIChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IHZhbCkge1xyXG4gICAgICAgIGxhYmVscy5wdXNoKGl0ZW0ubGFiZWwpXHJcbiAgICAgICAgbWF0Y2hDYXNjYWRlckRhdGEoKytpbmRleCwgaXRlbS5jaGlsZHJlbiwgdmFsdWVzLCBsYWJlbHMpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXREYXRlUGlja2VyIChkZWZhdWx0Rm9ybWF0OiBzdHJpbmcpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXREYXRlUGlja2VyQ2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcywgZGVmYXVsdEZvcm1hdCkpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZWxlY3RDZWxsVmFsdWUgKHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IGFueSkge1xyXG4gIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIHByb3BzID0ge30sIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGNvbnN0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICBjb25zdCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gIGNvbnN0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmICghaXNFbXB0eVZhbHVlKGNlbGxWYWx1ZSkpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLm1hcChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnID8gY2VsbFZhbHVlIDogW2NlbGxWYWx1ZV0sIG9wdGlvbkdyb3VwcyA/ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgIGxldCBzZWxlY3RJdGVtXHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvcHRpb25Hcm91cHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25Hcm91cHNbaW5kZXhdW2dyb3VwT3B0aW9uc10sIChpdGVtOiBhbnkpID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXHJcbiAgICAgICAgaWYgKHNlbGVjdEl0ZW0pIHtcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzZWxlY3RJdGVtID8gc2VsZWN0SXRlbVtsYWJlbFByb3BdIDogdmFsdWVcclxuICAgIH0gOiAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICBjb25zdCBzZWxlY3RJdGVtID0gWEVVdGlscy5maW5kKG9wdGlvbnMsIChpdGVtOiBhbnkpID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXHJcbiAgICAgIHJldHVybiBzZWxlY3RJdGVtID8gc2VsZWN0SXRlbVtsYWJlbFByb3BdIDogdmFsdWVcclxuICAgIH0pLmpvaW4oJywgJylcclxuICB9XHJcbiAgcmV0dXJuIG51bGxcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2FzY2FkZXJDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGNvbnN0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIHZhciB2YWx1ZXMgPSBjZWxsVmFsdWUgfHwgW11cclxuICB2YXIgbGFiZWxzOiBBcnJheTxhbnk+ID0gW11cclxuICBtYXRjaENhc2NhZGVyRGF0YSgwLCBwcm9wcy5vcHRpb25zLCB2YWx1ZXMsIGxhYmVscylcclxuICByZXR1cm4gKHByb3BzLnNob3dBbGxMZXZlbHMgPT09IGZhbHNlID8gbGFiZWxzLnNsaWNlKGxhYmVscy5sZW5ndGggLSAxLCBsYWJlbHMubGVuZ3RoKSA6IGxhYmVscykuam9pbihgICR7cHJvcHMuc2VwYXJhdG9yIHx8ICcvJ30gYClcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoY2VsbFZhbHVlKSB7XHJcbiAgICBjZWxsVmFsdWUgPSBYRVV0aWxzLm1hcChjZWxsVmFsdWUsIChkYXRlOiBhbnkpID0+IGRhdGUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCAnWVlZWS1NTS1ERCcpKS5qb2luKCcgfiAnKVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFRyZWVTZWxlY3RDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoY2VsbFZhbHVlICYmIChwcm9wcy50cmVlQ2hlY2thYmxlIHx8IHByb3BzLm11bHRpcGxlKSkge1xyXG4gICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmpvaW4oJzsnKVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhdGVQaWNrZXJDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcyB8IENvbHVtbkV4cG9ydENlbGxSZW5kZXJQYXJhbXMsIGRlZmF1bHRGb3JtYXQ6IHN0cmluZykge1xyXG4gIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoY2VsbFZhbHVlKSB7XHJcbiAgICBjZWxsVmFsdWUgPSBjZWxsVmFsdWUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCBkZWZhdWx0Rm9ybWF0KVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUVkaXRSZW5kZXIgKGRlZmF1bHRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkVkaXRSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKHJlbmRlck9wdHMubmFtZSwge1xyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgY2VsbFZhbHVlLCBkZWZhdWx0UHJvcHMpLFxyXG4gICAgICAgIG9uOiBnZXRFZGl0T25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgfSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIHJldHVybiBbXHJcbiAgICBoKCdhLWJ1dHRvbicsIHtcclxuICAgICAgYXR0cnMsXHJcbiAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgbnVsbCksXHJcbiAgICAgIG9uOiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgfSwgY2VsbFRleHQoaCwgcmVuZGVyT3B0cy5jb250ZW50KSlcclxuICBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gIHJldHVybiByZW5kZXJPcHRzLmNoaWxkcmVuLm1hcCgoY2hpbGRSZW5kZXJPcHRzOiBhbnkpID0+IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyKGgsIGNoaWxkUmVuZGVyT3B0cywgcGFyYW1zKVswXSlcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRmlsdGVyUmVuZGVyIChkZWZhdWx0UHJvcHM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5GaWx0ZXJSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkZpbHRlclJlbmRlclBhcmFtcykge1xyXG4gICAgY29uc3QgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgeyBuYW1lLCBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZGF0YVxyXG4gICAgICByZXR1cm4gaChuYW1lLCB7XHJcbiAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgcHJvcHM6IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb25WYWx1ZSwgZGVmYXVsdFByb3BzKSxcclxuICAgICAgICBvbjogZ2V0RmlsdGVyT25zKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uLCAoKSA9PiB7XHJcbiAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsICEhb3B0aW9uLmRhdGEsIG9wdGlvbilcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNvbmZpcm1GaWx0ZXIgKHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zLCBjaGVja2VkOiBib29sZWFuLCBvcHRpb246IGFueSkge1xyXG4gIGNvbnN0IHsgJHBhbmVsIH0gPSBwYXJhbXNcclxuICAkcGFuZWwuY2hhbmdlT3B0aW9uKHt9LCBjaGVja2VkLCBvcHRpb24pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXJNZXRob2QgKHBhcmFtczogQ29sdW1uRmlsdGVyTWV0aG9kUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBvcHRpb24sIHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBjb25zdCB7IGRhdGEgfSA9IG9wdGlvblxyXG4gIGNvbnN0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPT09IGRhdGFcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyT3B0aW9ucyAoaDogQ3JlYXRlRWxlbWVudCwgb3B0aW9uczogYW55W10sIG9wdGlvblByb3BzOiBPcHRpb25Qcm9wcykge1xyXG4gIGNvbnN0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICBjb25zdCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgY29uc3QgZGlzYWJsZWRQcm9wID0gb3B0aW9uUHJvcHMuZGlzYWJsZWQgfHwgJ2Rpc2FibGVkJ1xyXG4gIHJldHVybiBYRVV0aWxzLm1hcChvcHRpb25zLCAoaXRlbSwgb0luZGV4KSA9PiB7XHJcbiAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0aW9uJywge1xyXG4gICAgICBrZXk6IG9JbmRleCxcclxuICAgICAgcHJvcHM6IHtcclxuICAgICAgICB2YWx1ZTogaXRlbVt2YWx1ZVByb3BdLFxyXG4gICAgICAgIGRpc2FibGVkOiBpdGVtW2Rpc2FibGVkUHJvcF1cclxuICAgICAgfVxyXG4gICAgfSwgaXRlbVtsYWJlbFByb3BdKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNlbGxUZXh0IChoOiBDcmVhdGVFbGVtZW50LCBjZWxsVmFsdWU6IGFueSkge1xyXG4gIHJldHVybiBbJycgKyAoaXNFbXB0eVZhbHVlKGNlbGxWYWx1ZSkgPyAnJyA6IGNlbGxWYWx1ZSldXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZvcm1JdGVtUmVuZGVyIChkZWZhdWx0UHJvcHM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgeyBuYW1lIH0gPSByZW5kZXJPcHRzXHJcbiAgICBjb25zdCB7IGF0dHJzIH06IGFueSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChuYW1lLCB7XHJcbiAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgcHJvcHM6IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGl0ZW1WYWx1ZSwgZGVmYXVsdFByb3BzKSxcclxuICAgICAgICBvbjogZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0pXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHByb3BzID0gZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgbnVsbClcclxuICByZXR1cm4gW1xyXG4gICAgaCgnYS1idXR0b24nLCB7XHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBwcm9wcyxcclxuICAgICAgb246IGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICB9LCBjZWxsVGV4dChoLCByZW5kZXJPcHRzLmNvbnRlbnQgfHwgcHJvcHMuY29udGVudCkpXHJcbiAgXVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gIHJldHVybiByZW5kZXJPcHRzLmNoaWxkcmVuLm1hcCgoY2hpbGRSZW5kZXJPcHRzOiBhbnkpID0+IGRlZmF1bHRCdXR0b25JdGVtUmVuZGVyKGgsIGNoaWxkUmVuZGVyT3B0cywgcGFyYW1zKVswXSlcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCAoZGVmYXVsdEZvcm1hdDogc3RyaW5nLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogQ29sdW1uRXhwb3J0Q2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgcmV0dXJuIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocGFyYW1zLmNvbHVtbltyZW5kZXJQcm9wZXJ0eV0sIHBhcmFtcywgZGVmYXVsdEZvcm1hdClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUV4cG9ydE1ldGhvZCAodmFsdWVNZXRob2Q6IEZ1bmN0aW9uLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogQ29sdW1uRXhwb3J0Q2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgcmV0dXJuIHZhbHVlTWV0aG9kKHBhcmFtcy5jb2x1bW5bcmVuZGVyUHJvcGVydHldLCBwYXJhbXMpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIgKCkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IG5hbWUsIG9wdGlvbnMgPSBbXSwgb3B0aW9uUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICBjb25zdCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgICBjb25zdCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgICBjb25zdCBpdGVtVmFsdWUgPSBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSlcclxuICAgIHJldHVybiBbXHJcbiAgICAgIGgoYCR7bmFtZX1Hcm91cGAsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlKSxcclxuICAgICAgICBvbjogZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0sIG9wdGlvbnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgdmFsdWU6IG9wdGlvblt2YWx1ZVByb3BdLFxyXG4gICAgICAgICAgICBkaXNhYmxlZDogb3B0aW9uW2Rpc2FibGVkUHJvcF1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBvcHRpb25bbGFiZWxQcm9wXSlcclxuICAgICAgfSkpXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5riy5p+T5Ye95pWwXHJcbiAqL1xyXG5jb25zdCByZW5kZXJNYXAgPSB7XHJcbiAgQUF1dG9Db21wbGV0ZToge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBSW5wdXQ6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUlucHV0TnVtYmVyOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQtbnVtYmVyLWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0IChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgY29uc3QgcHJvcHMgPSBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgY2VsbFZhbHVlKVxyXG4gICAgICBjb25zdCBvbiA9IGdldEVkaXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGNvbnN0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgb25cclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG9uXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJGaWx0ZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBjb25zdCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcclxuICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKSxcclxuICAgICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIG9wdGlvbi5kYXRhICYmIG9wdGlvbi5kYXRhLmxlbmd0aCA+IDAsIG9wdGlvbilcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwOiBhbnksIGdJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZGF0YVxyXG4gICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKSxcclxuICAgICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcclxuICAgICAgICAgICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIG9wdGlvbi5kYXRhICYmIG9wdGlvbi5kYXRhLmxlbmd0aCA+IDAsIG9wdGlvbilcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyTWV0aG9kIChwYXJhbXM6IENvbHVtbkZpbHRlck1ldGhvZFBhcmFtcykge1xyXG4gICAgICBjb25zdCB7IG9wdGlvbiwgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBjb25zdCB7IGRhdGEgfSA9IG9wdGlvblxyXG4gICAgICBjb25zdCB7IHByb3BlcnR5LCBmaWx0ZXJSZW5kZXI6IHJlbmRlck9wdHMgfSA9IGNvbHVtblxyXG4gICAgICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBwcm9wZXJ0eSlcclxuICAgICAgaWYgKHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScpIHtcclxuICAgICAgICBpZiAoWEVVdGlscy5pc0FycmF5KGNlbGxWYWx1ZSkpIHtcclxuICAgICAgICAgIHJldHVybiBYRVV0aWxzLmluY2x1ZGVBcnJheXMoY2VsbFZhbHVlLCBkYXRhKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YS5pbmRleE9mKGNlbGxWYWx1ZSkgPiAtMVxyXG4gICAgICB9XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xyXG4gICAgICByZXR1cm4gY2VsbFZhbHVlID09IGRhdGFcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMpIHtcclxuICAgICAgY29uc3QgeyBvcHRpb25zID0gW10sIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGNvbnN0IHsgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xyXG4gICAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KVxyXG4gICAgICBjb25zdCBwcm9wcyA9IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGl0ZW1WYWx1ZSlcclxuICAgICAgY29uc3Qgb24gPSBnZXRJdGVtT25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBjb25zdCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIG9uXHJcbiAgICAgICAgICB9LCBYRVV0aWxzLm1hcChvcHRpb25Hcm91cHMsIChncm91cCwgZ0luZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBvblxyXG4gICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFNlbGVjdENlbGxWYWx1ZSksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFNlbGVjdENlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFDYXNjYWRlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0Q2FzY2FkZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldENhc2NhZGVyQ2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0Q2FzY2FkZXJDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBRGF0ZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTS1ERCcpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0tREQnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NLUREJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFNb250aFBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTScpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0nKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFSYW5nZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBV2Vla1BpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1XV+WRqCcpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktV1flkagnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLVdX5ZGoJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFUaW1lUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdISDptbTpzcycpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ0hIOm1tOnNzJyksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnSEg6bW06c3MnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVRyZWVTZWxlY3Q6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldFRyZWVTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFRyZWVTZWxlY3RDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVJhdGU6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBU3dpdGNoOiB7XHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBuYW1lLCBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcclxuICAgICAgICByZXR1cm4gaChuYW1lLCB7XHJcbiAgICAgICAgICBrZXk6IG9JbmRleCxcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgcHJvcHM6IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb25WYWx1ZSksXHJcbiAgICAgICAgICBvbjogZ2V0RmlsdGVyT25zKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIocGFyYW1zLCBYRVV0aWxzLmlzQm9vbGVhbihvcHRpb24uZGF0YSksIG9wdGlvbilcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBUmFkaW86IHtcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlcigpXHJcbiAgfSxcclxuICBBQ2hlY2tib3g6IHtcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlcigpXHJcbiAgfSxcclxuICBBQnV0dG9uOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0QnV0dG9uRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVySXRlbTogZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXJcclxuICB9LFxyXG4gIEFCdXR0b25zOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJJdGVtOiBkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXJcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmo4Dmn6Xop6blj5HmupDmmK/lkKblsZ7kuo7nm67moIfoioLngrlcclxuICovXHJcbmZ1bmN0aW9uIGdldEV2ZW50VGFyZ2V0Tm9kZSAoZXZudDogYW55LCBjb250YWluZXI6IEhUTUxFbGVtZW50LCBjbGFzc05hbWU6IHN0cmluZykge1xyXG4gIGxldCB0YXJnZXRFbGVtXHJcbiAgbGV0IHRhcmdldCA9IGV2bnQudGFyZ2V0XHJcbiAgd2hpbGUgKHRhcmdldCAmJiB0YXJnZXQubm9kZVR5cGUgJiYgdGFyZ2V0ICE9PSBkb2N1bWVudCkge1xyXG4gICAgaWYgKGNsYXNzTmFtZSAmJiB0YXJnZXQuY2xhc3NOYW1lICYmIHRhcmdldC5jbGFzc05hbWUuc3BsaXQoJyAnKS5pbmRleE9mKGNsYXNzTmFtZSkgPiAtMSkge1xyXG4gICAgICB0YXJnZXRFbGVtID0gdGFyZ2V0XHJcbiAgICB9IGVsc2UgaWYgKHRhcmdldCA9PT0gY29udGFpbmVyKSB7XHJcbiAgICAgIHJldHVybiB7IGZsYWc6IGNsYXNzTmFtZSA/ICEhdGFyZ2V0RWxlbSA6IHRydWUsIGNvbnRhaW5lciwgdGFyZ2V0RWxlbTogdGFyZ2V0RWxlbSB9XHJcbiAgICB9XHJcbiAgICB0YXJnZXQgPSB0YXJnZXQucGFyZW50Tm9kZVxyXG4gIH1cclxuICByZXR1cm4geyBmbGFnOiBmYWxzZSB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDkuovku7blhbzlrrnmgKflpITnkIZcclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZUNsZWFyRXZlbnQgKHBhcmFtczogVGFibGVSZW5kZXJQYXJhbXMsIGV2bnQ6IGFueSkge1xyXG4gIGNvbnN0IGJvZHlFbGVtOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmJvZHlcclxuICBpZiAoXHJcbiAgICAvLyDkuIvmi4nmoYZcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1zZWxlY3QtZHJvcGRvd24nKS5mbGFnIHx8XHJcbiAgICAvLyDnuqfogZRcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYXNjYWRlci1tZW51cycpLmZsYWcgfHxcclxuICAgIC8vIOaXpeacn1xyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhbGVuZGFyLXBpY2tlci1jb250YWluZXInKS5mbGFnIHx8XHJcbiAgICAvLyDml7bpl7TpgInmi6lcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC10aW1lLXBpY2tlci1wYW5lbCcpLmZsYWdcclxuICApIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOWfuuS6jiB2eGUtdGFibGUg6KGo5qC855qE6YCC6YWN5o+S5Lu277yM55So5LqO5YW85a65IGFudC1kZXNpZ24tdnVlIOe7hOS7tuW6k1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFZYRVRhYmxlUGx1Z2luQW50ZCA9IHtcclxuICBpbnN0YWxsICh7IGludGVyY2VwdG9yLCByZW5kZXJlciB9OiB0eXBlb2YgVlhFVGFibGUpIHtcclxuICAgIHJlbmRlcmVyLm1peGluKHJlbmRlck1hcClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJGaWx0ZXInLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gICAgaW50ZXJjZXB0b3IuYWRkKCdldmVudC5jbGVhckFjdGl2ZWQnLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gIH1cclxufVxyXG5cclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5WWEVUYWJsZSkge1xyXG4gIHdpbmRvdy5WWEVUYWJsZS51c2UoVlhFVGFibGVQbHVnaW5BbnRkKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWWEVUYWJsZVBsdWdpbkFudGRcclxuIl19
