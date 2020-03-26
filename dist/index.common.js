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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsImNlbGxWYWx1ZSIsInVuZGVmaW5lZCIsImdldE1vZGVsUHJvcCIsInJlbmRlck9wdHMiLCJwcm9wIiwibmFtZSIsImdldE1vZGVsRXZlbnQiLCJ0eXBlIiwiZ2V0Q2hhbmdlRXZlbnQiLCJnZXRDZWxsRWRpdEZpbHRlclByb3BzIiwicGFyYW1zIiwidmFsdWUiLCJkZWZhdWx0UHJvcHMiLCJ2U2l6ZSIsIiR0YWJsZSIsIlhFVXRpbHMiLCJhc3NpZ24iLCJzaXplIiwicHJvcHMiLCJnZXRJdGVtUHJvcHMiLCIkZm9ybSIsImdldE9ucyIsImlucHV0RnVuYyIsImNoYW5nZUZ1bmMiLCJldmVudHMiLCJtb2RlbEV2ZW50IiwiY2hhbmdlRXZlbnQiLCJpc1NhbWVFdmVudCIsIm9ucyIsIm9iamVjdEVhY2giLCJmdW5jIiwia2V5IiwiYXJncyIsImdldEVkaXRPbnMiLCJyb3ciLCJjb2x1bW4iLCJzZXQiLCJwcm9wZXJ0eSIsInVwZGF0ZVN0YXR1cyIsImdldEZpbHRlck9ucyIsIm9wdGlvbiIsImRhdGEiLCJnZXRJdGVtT25zIiwibWF0Y2hDYXNjYWRlckRhdGEiLCJpbmRleCIsImxpc3QiLCJ2YWx1ZXMiLCJsYWJlbHMiLCJ2YWwiLCJsZW5ndGgiLCJlYWNoIiwiaXRlbSIsInB1c2giLCJsYWJlbCIsImNoaWxkcmVuIiwiZm9ybWF0RGF0ZVBpY2tlciIsImRlZmF1bHRGb3JtYXQiLCJoIiwiY2VsbFRleHQiLCJnZXREYXRlUGlja2VyQ2VsbFZhbHVlIiwiZ2V0U2VsZWN0Q2VsbFZhbHVlIiwib3B0aW9ucyIsIm9wdGlvbkdyb3VwcyIsIm9wdGlvblByb3BzIiwib3B0aW9uR3JvdXBQcm9wcyIsImxhYmVsUHJvcCIsInZhbHVlUHJvcCIsImdyb3VwT3B0aW9ucyIsImdldCIsIm1hcCIsIm1vZGUiLCJzZWxlY3RJdGVtIiwiZmluZCIsImpvaW4iLCJnZXRDYXNjYWRlckNlbGxWYWx1ZSIsInNob3dBbGxMZXZlbHMiLCJzbGljZSIsInNlcGFyYXRvciIsImdldFJhbmdlUGlja2VyQ2VsbFZhbHVlIiwiZGF0ZSIsImZvcm1hdCIsImdldFRyZWVTZWxlY3RDZWxsVmFsdWUiLCJ0cmVlQ2hlY2thYmxlIiwibXVsdGlwbGUiLCJjcmVhdGVFZGl0UmVuZGVyIiwiYXR0cnMiLCJvbiIsImRlZmF1bHRCdXR0b25FZGl0UmVuZGVyIiwiY29udGVudCIsImRlZmF1bHRCdXR0b25zRWRpdFJlbmRlciIsImNoaWxkUmVuZGVyT3B0cyIsImNyZWF0ZUZpbHRlclJlbmRlciIsImZpbHRlcnMiLCJvSW5kZXgiLCJvcHRpb25WYWx1ZSIsImhhbmRsZUNvbmZpcm1GaWx0ZXIiLCJjaGVja2VkIiwiJHBhbmVsIiwiY2hhbmdlT3B0aW9uIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsInJlbmRlck9wdGlvbnMiLCJkaXNhYmxlZFByb3AiLCJkaXNhYmxlZCIsImNyZWF0ZUZvcm1JdGVtUmVuZGVyIiwiaXRlbVZhbHVlIiwiZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXIiLCJkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXIiLCJjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kIiwiaXNFZGl0IiwicmVuZGVyUHJvcGVydHkiLCJjcmVhdGVFeHBvcnRNZXRob2QiLCJ2YWx1ZU1ldGhvZCIsImNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlciIsInJlbmRlck1hcCIsIkFBdXRvQ29tcGxldGUiLCJhdXRvZm9jdXMiLCJyZW5kZXJEZWZhdWx0IiwicmVuZGVyRWRpdCIsInJlbmRlckZpbHRlciIsImZpbHRlck1ldGhvZCIsInJlbmRlckl0ZW0iLCJBSW5wdXQiLCJBSW5wdXROdW1iZXIiLCJBU2VsZWN0IiwiZ3JvdXBMYWJlbCIsImdyb3VwIiwiZ0luZGV4Iiwic2xvdCIsImNvbmNhdCIsInJlbmRlckNlbGwiLCJmaWx0ZXJSZW5kZXIiLCJpc0FycmF5IiwiaW5jbHVkZUFycmF5cyIsImluZGV4T2YiLCJjZWxsRXhwb3J0TWV0aG9kIiwiZWRpdENlbGxFeHBvcnRNZXRob2QiLCJBQ2FzY2FkZXIiLCJBRGF0ZVBpY2tlciIsIkFNb250aFBpY2tlciIsIkFSYW5nZVBpY2tlciIsIkFXZWVrUGlja2VyIiwiQVRpbWVQaWNrZXIiLCJBVHJlZVNlbGVjdCIsIkFSYXRlIiwiQVN3aXRjaCIsImlzQm9vbGVhbiIsIkFSYWRpbyIsIkFDaGVja2JveCIsIkFCdXR0b24iLCJBQnV0dG9ucyIsImdldEV2ZW50VGFyZ2V0Tm9kZSIsImV2bnQiLCJjb250YWluZXIiLCJjbGFzc05hbWUiLCJ0YXJnZXRFbGVtIiwidGFyZ2V0Iiwibm9kZVR5cGUiLCJkb2N1bWVudCIsInNwbGl0IiwiZmxhZyIsInBhcmVudE5vZGUiLCJoYW5kbGVDbGVhckV2ZW50IiwiYm9keUVsZW0iLCJib2R5IiwiVlhFVGFibGVQbHVnaW5BbnRkIiwiaW5zdGFsbCIsImludGVyY2VwdG9yIiwicmVuZGVyZXIiLCJtaXhpbiIsImFkZCIsIndpbmRvdyIsIlZYRVRhYmxlIiwidXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7Ozs7OztBQW1CQTtBQUVBLFNBQVNBLFlBQVQsQ0FBdUJDLFNBQXZCLEVBQXFDO0FBQ25DLFNBQU9BLFNBQVMsS0FBSyxJQUFkLElBQXNCQSxTQUFTLEtBQUtDLFNBQXBDLElBQWlERCxTQUFTLEtBQUssRUFBdEU7QUFDRDs7QUFFRCxTQUFTRSxZQUFULENBQXVCQyxVQUF2QixFQUFnRDtBQUM5QyxNQUFJQyxJQUFJLEdBQUcsT0FBWDs7QUFDQSxVQUFRRCxVQUFVLENBQUNFLElBQW5CO0FBQ0UsU0FBSyxTQUFMO0FBQ0VELE1BQUFBLElBQUksR0FBRyxTQUFQO0FBQ0E7QUFISjs7QUFLQSxTQUFPQSxJQUFQO0FBQ0Q7O0FBRUQsU0FBU0UsYUFBVCxDQUF3QkgsVUFBeEIsRUFBaUQ7QUFDL0MsTUFBSUksSUFBSSxHQUFHLFFBQVg7O0FBQ0EsVUFBUUosVUFBVSxDQUFDRSxJQUFuQjtBQUNFLFNBQUssUUFBTDtBQUNFRSxNQUFBQSxJQUFJLEdBQUcs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QVAsRUFBaUIscUJBQWpCLENBQWxCLENBQTBESCxJQUExRCxJQUNBO0FBQ0FULEVBQUFBLGtCQUFrQixDQUFDQyxJQUFELEVBQU9XLFFBQVAsRUFBaUIsb0JBQWpCLENBQWxCLENBQXlESCxJQUZ6RCxJQUdBO0FBQ0FULEVBQUFBLGtCQUFrQixDQUFDQyxJQUFELEVBQU9XLFFBQVAsRUFBaUIsK0JBQWpCLENBQWxCLENBQW9FSCxJQUpwRSxJQUtBO0FBQ0FULEVBQUFBLGtCQUFrQixDQUFDQyxJQUFELEVBQU9XLFFBQVAsRUFBaUIsdUJBQWpCLENBQWxCLENBQTRESCxJQVI5RCxFQVNFO0FBQ0EsV0FBTyxLQUFQO0FBQ0Q7QUFDRjtBQUVEOzs7OztBQUdPLElBQU1LLGtCQUFrQixHQUFHO0FBQ2hDQyxFQUFBQSxPQURnQyx5QkFDbUI7QUFBQSxRQUF4Q0MsV0FBd0MsUUFBeENBLFdBQXdDO0FBQUEsUUFBM0JDLFFBQTJCLFFBQTNCQSxRQUEyQjtBQUNqREEsSUFBQUEsUUFBUSxDQUFDQyxLQUFULENBQWV2RCxTQUFmO0FBQ0FxRCxJQUFBQSxXQUFXLENBQUNHLEdBQVosQ0FBZ0IsbUJBQWhCLEVBQXFDUixnQkFBckM7QUFDQUssSUFBQUEsV0FBVyxDQUFDRyxHQUFaLENBQWdCLG9CQUFoQixFQUFzQ1IsZ0JBQXRDO0FBQ0Q7QUFMK0IsQ0FBM0I7OztBQVFQLElBQUksT0FBT1MsTUFBUCxLQUFrQixXQUFsQixJQUFpQ0EsTUFBTSxDQUFDQyxRQUE1QyxFQUFzRDtBQUNwREQsRUFBQUEsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxHQUFoQixDQUFvQlIsa0JBQXBCO0FBQ0Q7O2VBRWNBLGtCIiwiZmlsZSI6ImluZGV4LmNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbmltcG9ydCB7IENyZWF0ZUVsZW1lbnQgfSBmcm9tICd2dWUnXHJcbmltcG9ydCBYRVV0aWxzIGZyb20gJ3hlLXV0aWxzL21ldGhvZHMveGUtdXRpbHMnXHJcbmltcG9ydCB7XHJcbiAgVlhFVGFibGUsXHJcbiAgUmVuZGVyUGFyYW1zLFxyXG4gIE9wdGlvblByb3BzLFxyXG4gIFJlbmRlck9wdGlvbnMsXHJcbiAgVGFibGVSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRmlsdGVyUGFyYW1zLFxyXG4gIENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsXHJcbiAgQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsXHJcbiAgQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMsXHJcbiAgRm9ybUl0ZW1SZW5kZXJPcHRpb25zLFxyXG4gIENvbHVtbkNlbGxSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRWRpdFJlbmRlclBhcmFtcyxcclxuICBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRmlsdGVyTWV0aG9kUGFyYW1zLFxyXG4gIENvbHVtbkV4cG9ydENlbGxSZW5kZXJQYXJhbXMsXHJcbiAgRm9ybUl0ZW1SZW5kZXJQYXJhbXNcclxufSBmcm9tICd2eGUtdGFibGUvbGliL3Z4ZS10YWJsZSdcclxuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5cclxuZnVuY3Rpb24gaXNFbXB0eVZhbHVlIChjZWxsVmFsdWU6IGFueSkge1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPT09IG51bGwgfHwgY2VsbFZhbHVlID09PSB1bmRlZmluZWQgfHwgY2VsbFZhbHVlID09PSAnJ1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRNb2RlbFByb3AgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMpIHtcclxuICBsZXQgcHJvcCA9ICd2YWx1ZSdcclxuICBzd2l0Y2ggKHJlbmRlck9wdHMubmFtZSkge1xyXG4gICAgY2FzZSAnQVN3aXRjaCc6XHJcbiAgICAgIHByb3AgPSAnY2hlY2tlZCdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIHByb3BcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TW9kZWxFdmVudCAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucykge1xyXG4gIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICBzd2l0Y2ggKHJlbmRlck9wdHMubmFtZSkge1xyXG4gICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgdHlwZSA9ICdjaGFuZ2UudmFsdWUnXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIHJldHVybiB0eXBlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENoYW5nZUV2ZW50IChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zKSB7XHJcbiAgcmV0dXJuICdjaGFuZ2UnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENlbGxFZGl0RmlsdGVyUHJvcHMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogVGFibGVSZW5kZXJQYXJhbXMsIHZhbHVlOiBhbnksIGRlZmF1bHRQcm9wcz86IHsgW3Byb3A6IHN0cmluZ106IGFueSB9KSB7XHJcbiAgY29uc3QgeyB2U2l6ZSB9ID0gcGFyYW1zLiR0YWJsZVxyXG4gIHJldHVybiBYRVV0aWxzLmFzc2lnbih2U2l6ZSA/IHsgc2l6ZTogdlNpemUgfSA6IHt9LCBkZWZhdWx0UHJvcHMsIHJlbmRlck9wdHMucHJvcHMsIHsgW2dldE1vZGVsUHJvcChyZW5kZXJPcHRzKV06IHZhbHVlIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEl0ZW1Qcm9wcyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcywgdmFsdWU6IGFueSwgZGVmYXVsdFByb3BzPzogeyBbcHJvcDogc3RyaW5nXTogYW55IH0pIHtcclxuICBjb25zdCB7IHZTaXplIH0gPSBwYXJhbXMuJGZvcm1cclxuICByZXR1cm4gWEVVdGlscy5hc3NpZ24odlNpemUgPyB7IHNpemU6IHZTaXplIH0gOiB7fSwgZGVmYXVsdFByb3BzLCByZW5kZXJPcHRzLnByb3BzLCB7IFtnZXRNb2RlbFByb3AocmVuZGVyT3B0cyldOiB2YWx1ZSB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRPbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogUmVuZGVyUGFyYW1zLCBpbnB1dEZ1bmM/OiBGdW5jdGlvbiwgY2hhbmdlRnVuYz86IEZ1bmN0aW9uKSB7XHJcbiAgY29uc3QgeyBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCBtb2RlbEV2ZW50ID0gZ2V0TW9kZWxFdmVudChyZW5kZXJPcHRzKVxyXG4gIGNvbnN0IGNoYW5nZUV2ZW50ID0gZ2V0Q2hhbmdlRXZlbnQocmVuZGVyT3B0cylcclxuICBjb25zdCBpc1NhbWVFdmVudCA9IGNoYW5nZUV2ZW50ID09PSBtb2RlbEV2ZW50XHJcbiAgY29uc3Qgb25zOiB7IFt0eXBlOiBzdHJpbmddOiBGdW5jdGlvbiB9ID0ge31cclxuICBYRVV0aWxzLm9iamVjdEVhY2goZXZlbnRzLCAoZnVuYzogRnVuY3Rpb24sIGtleTogc3RyaW5nKSA9PiB7XHJcbiAgICBvbnNba2V5XSA9IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICBmdW5jKHBhcmFtcywgLi4uYXJncylcclxuICAgIH1cclxuICB9KVxyXG4gIGlmIChpbnB1dEZ1bmMpIHtcclxuICAgIG9uc1ttb2RlbEV2ZW50XSA9IGZ1bmN0aW9uICh2YWx1ZTogYW55KSB7XHJcbiAgICAgIGlucHV0RnVuYyh2YWx1ZSlcclxuICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbbW9kZWxFdmVudF0pIHtcclxuICAgICAgICBldmVudHNbbW9kZWxFdmVudF0odmFsdWUpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKGlzU2FtZUV2ZW50ICYmIGNoYW5nZUZ1bmMpIHtcclxuICAgICAgICBjaGFuZ2VGdW5jKClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoIWlzU2FtZUV2ZW50ICYmIGNoYW5nZUZ1bmMpIHtcclxuICAgIG9uc1tjaGFuZ2VFdmVudF0gPSBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgY2hhbmdlRnVuYygpXHJcbiAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW2NoYW5nZUV2ZW50XSkge1xyXG4gICAgICAgIGV2ZW50c1tjaGFuZ2VFdmVudF0ocGFyYW1zLCAuLi5hcmdzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBvbnNcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RWRpdE9ucyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyAkdGFibGUsIHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICByZXR1cm4gZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcywgKHZhbHVlOiBhbnkpID0+IHtcclxuICAgIC8vIOWkhOeQhiBtb2RlbCDlgLzlj4zlkJHnu5HlrppcclxuICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCB2YWx1ZSlcclxuICB9LCAoKSA9PiB7XHJcbiAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgJHRhYmxlLnVwZGF0ZVN0YXR1cyhwYXJhbXMpXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RmlsdGVyT25zIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkZpbHRlclJlbmRlclBhcmFtcywgb3B0aW9uOiBDb2x1bW5GaWx0ZXJQYXJhbXMsIGNoYW5nZUZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgcmV0dXJuIGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAvLyDlpITnkIYgbW9kZWwg5YC85Y+M5ZCR57uR5a6aXHJcbiAgICBvcHRpb24uZGF0YSA9IHZhbHVlXHJcbiAgfSwgY2hhbmdlRnVuYylcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SXRlbU9ucyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgJGZvcm0sIGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICByZXR1cm4gZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcywgKHZhbHVlOiBhbnkpID0+IHtcclxuICAgIC8vIOWkhOeQhiBtb2RlbCDlgLzlj4zlkJHnu5HlrppcclxuICAgIFhFVXRpbHMuc2V0KGRhdGEsIHByb3BlcnR5LCB2YWx1ZSlcclxuICB9LCAoKSA9PiB7XHJcbiAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgJGZvcm0udXBkYXRlU3RhdHVzKHBhcmFtcylcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYXRjaENhc2NhZGVyRGF0YSAoaW5kZXg6IG51bWJlciwgbGlzdDogYW55W10sIHZhbHVlczogYW55W10sIGxhYmVsczogYW55W10pIHtcclxuICBjb25zdCB2YWwgPSB2YWx1ZXNbaW5kZXhdXHJcbiAgaWYgKGxpc3QgJiYgdmFsdWVzLmxlbmd0aCA+IGluZGV4KSB7XHJcbiAgICBYRVV0aWxzLmVhY2gobGlzdCwgKGl0ZW0pID0+IHtcclxuICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IHZhbCkge1xyXG4gICAgICAgIGxhYmVscy5wdXNoKGl0ZW0ubGFiZWwpXHJcbiAgICAgICAgbWF0Y2hDYXNjYWRlckRhdGEoKytpbmRleCwgaXRlbS5jaGlsZHJlbiwgdmFsdWVzLCBsYWJlbHMpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXREYXRlUGlja2VyIChkZWZhdWx0Rm9ybWF0OiBzdHJpbmcpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXREYXRlUGlja2VyQ2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcywgZGVmYXVsdEZvcm1hdCkpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZWxlY3RDZWxsVmFsdWUgKHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7IG9wdGlvbnMgPSBbXSwgb3B0aW9uR3JvdXBzLCBwcm9wcyA9IHt9LCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgY29uc3QgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoIWlzRW1wdHlWYWx1ZShjZWxsVmFsdWUpKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5tYXAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJyA/IGNlbGxWYWx1ZSA6IFtjZWxsVmFsdWVdLCBvcHRpb25Hcm91cHMgPyAodmFsdWUpID0+IHtcclxuICAgICAgbGV0IHNlbGVjdEl0ZW1cclxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9wdGlvbkdyb3Vwcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICBzZWxlY3RJdGVtID0gWEVVdGlscy5maW5kKG9wdGlvbkdyb3Vwc1tpbmRleF1bZ3JvdXBPcHRpb25zXSwgKGl0ZW0pID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXHJcbiAgICAgICAgaWYgKHNlbGVjdEl0ZW0pIHtcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzZWxlY3RJdGVtID8gc2VsZWN0SXRlbVtsYWJlbFByb3BdIDogdmFsdWVcclxuICAgIH0gOiAodmFsdWUpID0+IHtcclxuICAgICAgY29uc3Qgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25zLCAoaXRlbSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZVxyXG4gICAgfSkuam9pbignLCAnKVxyXG4gIH1cclxuICByZXR1cm4gbnVsbFxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXNjYWRlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgdmFyIHZhbHVlcyA9IGNlbGxWYWx1ZSB8fCBbXVxyXG4gIHZhciBsYWJlbHM6IEFycmF5PGFueT4gPSBbXVxyXG4gIG1hdGNoQ2FzY2FkZXJEYXRhKDAsIHByb3BzLm9wdGlvbnMsIHZhbHVlcywgbGFiZWxzKVxyXG4gIHJldHVybiAocHJvcHMuc2hvd0FsbExldmVscyA9PT0gZmFsc2UgPyBsYWJlbHMuc2xpY2UobGFiZWxzLmxlbmd0aCAtIDEsIGxhYmVscy5sZW5ndGgpIDogbGFiZWxzKS5qb2luKGAgJHtwcm9wcy5zZXBhcmF0b3IgfHwgJy8nfSBgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmIChjZWxsVmFsdWUpIHtcclxuICAgIGNlbGxWYWx1ZSA9IFhFVXRpbHMubWFwKGNlbGxWYWx1ZSwgKGRhdGUpID0+IGRhdGUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCAnWVlZWS1NTS1ERCcpKS5qb2luKCcgfiAnKVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFRyZWVTZWxlY3RDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoY2VsbFZhbHVlICYmIChwcm9wcy50cmVlQ2hlY2thYmxlIHx8IHByb3BzLm11bHRpcGxlKSkge1xyXG4gICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmpvaW4oJzsnKVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhdGVQaWNrZXJDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcyB8IENvbHVtbkV4cG9ydENlbGxSZW5kZXJQYXJhbXMsIGRlZmF1bHRGb3JtYXQ6IHN0cmluZykge1xyXG4gIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoY2VsbFZhbHVlKSB7XHJcbiAgICBjZWxsVmFsdWUgPSBjZWxsVmFsdWUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCBkZWZhdWx0Rm9ybWF0KVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUVkaXRSZW5kZXIgKGRlZmF1bHRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkVkaXRSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKHJlbmRlck9wdHMubmFtZSwge1xyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgY2VsbFZhbHVlLCBkZWZhdWx0UHJvcHMpLFxyXG4gICAgICAgIG9uOiBnZXRFZGl0T25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgfSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIHJldHVybiBbXHJcbiAgICBoKCdhLWJ1dHRvbicsIHtcclxuICAgICAgYXR0cnMsXHJcbiAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgbnVsbCksXHJcbiAgICAgIG9uOiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgfSwgY2VsbFRleHQoaCwgcmVuZGVyT3B0cy5jb250ZW50KSlcclxuICBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gIHJldHVybiByZW5kZXJPcHRzLmNoaWxkcmVuLm1hcCgoY2hpbGRSZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucykgPT4gZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIoaCwgY2hpbGRSZW5kZXJPcHRzLCBwYXJhbXMpWzBdKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGaWx0ZXJSZW5kZXIgKGRlZmF1bHRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IG5hbWUsIGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhXHJcbiAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICBrZXk6IG9JbmRleCxcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlLCBkZWZhdWx0UHJvcHMpLFxyXG4gICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcclxuICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKHBhcmFtcywgISFvcHRpb24uZGF0YSwgb3B0aW9uKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ29uZmlybUZpbHRlciAocGFyYW1zOiBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMsIGNoZWNrZWQ6IGJvb2xlYW4sIG9wdGlvbjogQ29sdW1uRmlsdGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyAkcGFuZWwgfSA9IHBhcmFtc1xyXG4gICRwYW5lbC5jaGFuZ2VPcHRpb24oe30sIGNoZWNrZWQsIG9wdGlvbilcclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEZpbHRlck1ldGhvZCAocGFyYW1zOiBDb2x1bW5GaWx0ZXJNZXRob2RQYXJhbXMpIHtcclxuICBjb25zdCB7IG9wdGlvbiwgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gZGF0YVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJPcHRpb25zIChoOiBDcmVhdGVFbGVtZW50LCBvcHRpb25zOiBhbnlbXSwgb3B0aW9uUHJvcHM6IE9wdGlvblByb3BzKSB7XHJcbiAgY29uc3QgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gIGNvbnN0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICBjb25zdCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgcmV0dXJuIFhFVXRpbHMubWFwKG9wdGlvbnMsIChpdGVtLCBvSW5kZXgpID0+IHtcclxuICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHRpb24nLCB7XHJcbiAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICBwcm9wczoge1xyXG4gICAgICAgIHZhbHVlOiBpdGVtW3ZhbHVlUHJvcF0sXHJcbiAgICAgICAgZGlzYWJsZWQ6IGl0ZW1bZGlzYWJsZWRQcm9wXVxyXG4gICAgICB9XHJcbiAgICB9LCBpdGVtW2xhYmVsUHJvcF0pXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2VsbFRleHQgKGg6IENyZWF0ZUVsZW1lbnQsIGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgcmV0dXJuIFsnJyArIChpc0VtcHR5VmFsdWUoY2VsbFZhbHVlKSA/ICcnIDogY2VsbFZhbHVlKV1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRm9ybUl0ZW1SZW5kZXIgKGRlZmF1bHRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IG5hbWUgfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChuYW1lLCB7XHJcbiAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgcHJvcHM6IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGl0ZW1WYWx1ZSwgZGVmYXVsdFByb3BzKSxcclxuICAgICAgICBvbjogZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0pXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHByb3BzID0gZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgbnVsbClcclxuICByZXR1cm4gW1xyXG4gICAgaCgnYS1idXR0b24nLCB7XHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBwcm9wcyxcclxuICAgICAgb246IGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICB9LCBjZWxsVGV4dChoLCByZW5kZXJPcHRzLmNvbnRlbnQgfHwgcHJvcHMuY29udGVudCkpXHJcbiAgXVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gIHJldHVybiByZW5kZXJPcHRzLmNoaWxkcmVuLm1hcCgoY2hpbGRSZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMpID0+IGRlZmF1bHRCdXR0b25JdGVtUmVuZGVyKGgsIGNoaWxkUmVuZGVyT3B0cywgcGFyYW1zKVswXSlcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCAoZGVmYXVsdEZvcm1hdDogc3RyaW5nLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogQ29sdW1uRXhwb3J0Q2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgcmV0dXJuIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocGFyYW1zLmNvbHVtbltyZW5kZXJQcm9wZXJ0eV0sIHBhcmFtcywgZGVmYXVsdEZvcm1hdClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUV4cG9ydE1ldGhvZCAodmFsdWVNZXRob2Q6IEZ1bmN0aW9uLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogQ29sdW1uRXhwb3J0Q2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgcmV0dXJuIHZhbHVlTWV0aG9kKHBhcmFtcy5jb2x1bW5bcmVuZGVyUHJvcGVydHldLCBwYXJhbXMpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIgKCkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IG5hbWUsIG9wdGlvbnMgPSBbXSwgb3B0aW9uUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICBjb25zdCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgICBjb25zdCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgICBjb25zdCBpdGVtVmFsdWUgPSBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSlcclxuICAgIHJldHVybiBbXHJcbiAgICAgIGgoYCR7bmFtZX1Hcm91cGAsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlKSxcclxuICAgICAgICBvbjogZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0sIG9wdGlvbnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgdmFsdWU6IG9wdGlvblt2YWx1ZVByb3BdLFxyXG4gICAgICAgICAgICBkaXNhYmxlZDogb3B0aW9uW2Rpc2FibGVkUHJvcF1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBvcHRpb25bbGFiZWxQcm9wXSlcclxuICAgICAgfSkpXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5riy5p+T5Ye95pWwXHJcbiAqL1xyXG5jb25zdCByZW5kZXJNYXAgPSB7XHJcbiAgQUF1dG9Db21wbGV0ZToge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBSW5wdXQ6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUlucHV0TnVtYmVyOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQtbnVtYmVyLWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0IChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgY29uc3QgcHJvcHMgPSBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgY2VsbFZhbHVlKVxyXG4gICAgICBjb25zdCBvbiA9IGdldEVkaXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGNvbnN0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgb25cclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG9uXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJGaWx0ZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBjb25zdCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcclxuICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKSxcclxuICAgICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIG9wdGlvbi5kYXRhICYmIG9wdGlvbi5kYXRhLmxlbmd0aCA+IDAsIG9wdGlvbilcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhXHJcbiAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uVmFsdWUpLFxyXG4gICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKHBhcmFtcywgb3B0aW9uLmRhdGEgJiYgb3B0aW9uLmRhdGEubGVuZ3RoID4gMCwgb3B0aW9uKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBmaWx0ZXJNZXRob2QgKHBhcmFtczogQ29sdW1uRmlsdGVyTWV0aG9kUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9uLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgICAgIGNvbnN0IHsgcHJvcGVydHksIGZpbHRlclJlbmRlcjogcmVuZGVyT3B0cyB9ID0gY29sdW1uXHJcbiAgICAgIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIHByb3BlcnR5KVxyXG4gICAgICBpZiAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJykge1xyXG4gICAgICAgIGlmIChYRVV0aWxzLmlzQXJyYXkoY2VsbFZhbHVlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIFhFVXRpbHMuaW5jbHVkZUFycmF5cyhjZWxsVmFsdWUsIGRhdGEpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhLmluZGV4T2YoY2VsbFZhbHVlKSA+IC0xXHJcbiAgICAgIH1cclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgICAgIHJldHVybiBjZWxsVmFsdWUgPT0gZGF0YVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW0gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gICAgICBjb25zdCB7IG9wdGlvbnMgPSBbXSwgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgaXRlbVZhbHVlID0gWEVVdGlscy5nZXQoZGF0YSwgcHJvcGVydHkpXHJcbiAgICAgIGNvbnN0IHByb3BzID0gZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlKVxyXG4gICAgICBjb25zdCBvbiA9IGdldEl0ZW1PbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGNvbnN0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgb25cclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIG9uXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0U2VsZWN0Q2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0U2VsZWN0Q2VsbFZhbHVlLCB0cnVlKVxyXG4gIH0sXHJcbiAgQUNhc2NhZGVyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRDYXNjYWRlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0Q2FzY2FkZXJDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRDYXNjYWRlckNlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFEYXRlUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NLUREJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTS1ERCcpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0tREQnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQU1vbnRoUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTScpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0nLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVJhbmdlUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFXZWVrUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLVdX5ZGoJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1XV+WRqCcpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktV1flkagnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVRpbWVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ0hIOm1tOnNzJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnSEg6bW06c3MnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdISDptbTpzcycsIHRydWUpXHJcbiAgfSxcclxuICBBVHJlZVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFRyZWVTZWxlY3RDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBUmF0ZToge1xyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFTd2l0Y2g6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRmlsdGVyUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgY29uc3QgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBjb25zdCB7IG5hbWUsIGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZGF0YVxyXG4gICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKSxcclxuICAgICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcclxuICAgICAgICAgICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIFhFVXRpbHMuaXNCb29sZWFuKG9wdGlvbi5kYXRhKSwgb3B0aW9uKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFSYWRpbzoge1xyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyKClcclxuICB9LFxyXG4gIEFDaGVja2JveDoge1xyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyKClcclxuICB9LFxyXG4gIEFCdXR0b246IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJJdGVtOiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlclxyXG4gIH0sXHJcbiAgQUJ1dHRvbnM6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckl0ZW06IGRlZmF1bHRCdXR0b25zSXRlbVJlbmRlclxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOajgOafpeinpuWPkea6kOaYr+WQpuWxnuS6juebruagh+iKgueCuVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0RXZlbnRUYXJnZXROb2RlIChldm50OiBhbnksIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgbGV0IHRhcmdldEVsZW1cclxuICBsZXQgdGFyZ2V0ID0gZXZudC50YXJnZXRcclxuICB3aGlsZSAodGFyZ2V0ICYmIHRhcmdldC5ub2RlVHlwZSAmJiB0YXJnZXQgIT09IGRvY3VtZW50KSB7XHJcbiAgICBpZiAoY2xhc3NOYW1lICYmIHRhcmdldC5jbGFzc05hbWUgJiYgdGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCAmJiB0YXJnZXQuY2xhc3NOYW1lLnNwbGl0KCcgJykuaW5kZXhPZihjbGFzc05hbWUpID4gLTEpIHtcclxuICAgICAgdGFyZ2V0RWxlbSA9IHRhcmdldFxyXG4gICAgfSBlbHNlIGlmICh0YXJnZXQgPT09IGNvbnRhaW5lcikge1xyXG4gICAgICByZXR1cm4geyBmbGFnOiBjbGFzc05hbWUgPyAhIXRhcmdldEVsZW0gOiB0cnVlLCBjb250YWluZXIsIHRhcmdldEVsZW06IHRhcmdldEVsZW0gfVxyXG4gICAgfVxyXG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGVcclxuICB9XHJcbiAgcmV0dXJuIHsgZmxhZzogZmFsc2UgfVxyXG59XHJcblxyXG4vKipcclxuICog5LqL5Lu25YW85a655oCn5aSE55CGXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVDbGVhckV2ZW50IChwYXJhbXM6IFRhYmxlUmVuZGVyUGFyYW1zLCBldm50OiBhbnkpIHtcclxuICBjb25zdCBib2R5RWxlbTogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5ib2R5XHJcbiAgaWYgKFxyXG4gICAgLy8g5LiL5ouJ5qGGXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtc2VsZWN0LWRyb3Bkb3duJykuZmxhZyB8fFxyXG4gICAgLy8g57qn6IGUXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FzY2FkZXItbWVudXMnKS5mbGFnIHx8XHJcbiAgICAvLyDml6XmnJ9cclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYWxlbmRhci1waWNrZXItY29udGFpbmVyJykuZmxhZyB8fFxyXG4gICAgLy8g5pe26Ze06YCJ5oupXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtdGltZS1waWNrZXItcGFuZWwnKS5mbGFnXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDln7rkuo4gdnhlLXRhYmxlIOihqOagvOeahOmAgumFjeaPkuS7tu+8jOeUqOS6juWFvOWuuSBhbnQtZGVzaWduLXZ1ZSDnu4Tku7blupNcclxuICovXHJcbmV4cG9ydCBjb25zdCBWWEVUYWJsZVBsdWdpbkFudGQgPSB7XHJcbiAgaW5zdGFsbCAoeyBpbnRlcmNlcHRvciwgcmVuZGVyZXIgfTogdHlwZW9mIFZYRVRhYmxlKSB7XHJcbiAgICByZW5kZXJlci5taXhpbihyZW5kZXJNYXApXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyRmlsdGVyJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJBY3RpdmVkJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICB9XHJcbn1cclxuXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVlhFVGFibGUpIHtcclxuICB3aW5kb3cuVlhFVGFibGUudXNlKFZYRVRhYmxlUGx1Z2luQW50ZClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5BbnRkXHJcbiJdfQ==
