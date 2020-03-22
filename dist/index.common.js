"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.VXETablePluginAntd = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils/methods/xe-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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

function toMomentString(cellValue, format) {
  return cellValue ? cellValue.format(format) : '';
}

_xeUtils["default"].mixin({
  toMomentString: toMomentString
});

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginAntd);
}

var _default = VXETablePluginAntd;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsImNlbGxWYWx1ZSIsInVuZGVmaW5lZCIsImdldE1vZGVsUHJvcCIsInJlbmRlck9wdHMiLCJwcm9wIiwibmFtZSIsImdldE1vZGVsRXZlbnQiLCJ0eXBlIiwiZ2V0Q2hhbmdlRXZlbnQiLCJnZXRDZWxsRWRpdEZpbHRlclByb3BzIiwicGFyYW1zIiwidmFsdWUiLCJkZWZhdWx0UHJvcHMiLCJ2U2l6ZSIsIiR0YWJsZSIsIlhFVXRpbHMiLCJhc3NpZ24iLCJzaXplIiwicHJvcHMiLCJnZXRJdGVtUHJvcHMiLCIkZm9ybSIsImdldE9ucyIsImlucHV0RnVuYyIsImNoYW5nZUZ1bmMiLCJldmVudHMiLCJtb2RlbEV2ZW50IiwiY2hhbmdlRXZlbnQiLCJpc1NhbWVFdmVudCIsIm9ucyIsIm9iamVjdEVhY2giLCJmdW5jIiwia2V5IiwiYXJncyIsImdldEVkaXRPbnMiLCJyb3ciLCJjb2x1bW4iLCJzZXQiLCJwcm9wZXJ0eSIsInVwZGF0ZVN0YXR1cyIsImdldEZpbHRlck9ucyIsIm9wdGlvbiIsImRhdGEiLCJnZXRJdGVtT25zIiwibWF0Y2hDYXNjYWRlckRhdGEiLCJpbmRleCIsImxpc3QiLCJ2YWx1ZXMiLCJsYWJlbHMiLCJ2YWwiLCJsZW5ndGgiLCJlYWNoIiwiaXRlbSIsInB1c2giLCJsYWJlbCIsImNoaWxkcmVuIiwiZm9ybWF0RGF0ZVBpY2tlciIsImRlZmF1bHRGb3JtYXQiLCJoIiwiY2VsbFRleHQiLCJnZXREYXRlUGlja2VyQ2VsbFZhbHVlIiwiZ2V0U2VsZWN0Q2VsbFZhbHVlIiwib3B0aW9ucyIsIm9wdGlvbkdyb3VwcyIsIm9wdGlvblByb3BzIiwib3B0aW9uR3JvdXBQcm9wcyIsImxhYmVsUHJvcCIsInZhbHVlUHJvcCIsImdyb3VwT3B0aW9ucyIsImdldCIsIm1hcCIsIm1vZGUiLCJzZWxlY3RJdGVtIiwiZmluZCIsImpvaW4iLCJnZXRDYXNjYWRlckNlbGxWYWx1ZSIsInNob3dBbGxMZXZlbHMiLCJzbGljZSIsInNlcGFyYXRvciIsImdldFJhbmdlUGlja2VyQ2VsbFZhbHVlIiwiZGF0ZSIsImZvcm1hdCIsImdldFRyZWVTZWxlY3RDZWxsVmFsdWUiLCJ0cmVlQ2hlY2thYmxlIiwibXVsdGlwbGUiLCJjcmVhdGVFZGl0UmVuZGVyIiwiYXR0cnMiLCJvbiIsImRlZmF1bHRCdXR0b25FZGl0UmVuZGVyIiwiY29udGVudCIsImRlZmF1bHRCdXR0b25zRWRpdFJlbmRlciIsImNoaWxkUmVuZGVyT3B0cyIsImNyZWF0ZUZpbHRlclJlbmRlciIsImZpbHRlcnMiLCJvSW5kZXgiLCJvcHRpb25WYWx1ZSIsImhhbmRsZUNvbmZpcm1GaWx0ZXIiLCJjaGVja2VkIiwiJHBhbmVsIiwiY2hhbmdlT3B0aW9uIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsInJlbmRlck9wdGlvbnMiLCJkaXNhYmxlZFByb3AiLCJkaXNhYmxlZCIsImNyZWF0ZUZvcm1JdGVtUmVuZGVyIiwiaXRlbVZhbHVlIiwiZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXIiLCJkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXIiLCJjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kIiwiaXNFZGl0IiwicmVuZGVyUHJvcGVydHkiLCJjcmVhdGVFeHBvcnRNZXRob2QiLCJ2YWx1ZU1ldGhvZCIsImNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlciIsInJlbmRlck1hcCIsIkFBdXRvQ29tcGxldGUiLCJhdXRvZm9jdXMiLCJyZW5kZXJEZWZhdWx0IiwicmVuZGVyRWRpdCIsInJlbmRlckZpbHRlciIsImZpbHRlck1ldGhvZCIsInJlbmRlckl0ZW0iLCJBSW5wdXQiLCJBSW5wdXROdW1iZXIiLCJBU2VsZWN0IiwiZ3JvdXBMYWJlbCIsImdyb3VwIiwiZ0luZGV4Iiwic2xvdCIsImNvbmNhdCIsInJlbmRlckNlbGwiLCJmaWx0ZXJSZW5kZXIiLCJpc0FycmF5IiwiaW5jbHVkZUFycmF5cyIsImluZGV4T2YiLCJjZWxsRXhwb3J0TWV0aG9kIiwiZWRpdENlbGxFeHBvcnRNZXRob2QiLCJBQ2FzY2FkZXIiLCJBRGF0ZVBpY2tlciIsIkFNb250aFBpY2tlciIsIkFSYW5nZVBpY2tlciIsIkFXZWVrUGlja2VyIiwiQVRpbWVQaWNrZXIiLCJBVHJlZVNlbGVjdCIsIkFSYXRlIiwiQVN3aXRjaCIsImlzQm9vbGVhbiIsIkFSYWRpbyIsIkFDaGVja2JveCIsIkFCdXR0b24iLCJBQnV0dG9ucyIsImdldEV2ZW50VGFyZ2V0Tm9kZSIsImV2bnQiLCJjb250YWluZXIiLCJjbGFzc05hbWUiLCJ0YXJnZXRFbGVtIiwidGFyZ2V0Iiwibm9kZVR5cGUiLCJkb2N1bWVudCIsInNwbGl0IiwiZmxhZyIsInBhcmVudE5vZGUiLCJoYW5kbGVDbGVhckV2ZW50IiwiYm9keUVsZW0iLCJib2R5IiwiVlhFVGFibGVQbHVnaW5BbnRkIiwiaW5zdGFsbCIsImludGVyY2VwdG9yIiwicmVuZGVyZXIiLCJtaXhpbiIsImFkZCIsInRvTW9tZW50U3RyaW5nIiwid2luZG93IiwiVlhFVGFibGUiLCJ1c2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFDQTs7Ozs7O0FBR0EsU0FBU0EsWUFBVCxDQUF1QkMsU0FBdkIsRUFBcUM7QUFDbkMsU0FBT0EsU0FBUyxLQUFLLElBQWQsSUFBc0JBLFNBQVMsS0FBS0MsU0FBcEMsSUFBaURELFNBQVMsS0FBSyxFQUF0RTtBQUNEOztBQUVELFNBQVNFLFlBQVQsQ0FBdUJDLFVBQXZCLEVBQWdEO0FBQzlDLE1BQUlDLElBQUksR0FBRyxPQUFYOztBQUNBLFVBQVFELFVBQVUsQ0FBQ0UsSUFBbkI7QUFDRSxTQUFLLFNBQUw7QUFDRUQsTUFBQUEsSUFBSSxHQUFHLFNBQVA7QUFDQTtBQUhKOztBQUtBLFNBQU9BLElBQVA7QUFDRDs7QUFFRCxTQUFTRSxhQUFULENBQXdCSCxVQUF4QixFQUFpRDtBQUMvQyxNQUFJSSxJQUFJLEdBQUcsUUFBWDs7QUFDQSxVQUFRSixVQUFVLENBQUNFLElBQW5CO0FBQ0UsU0FBSyxRQUFMO0FBQ0VFLE1BQUFB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anMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDcmVhdGVFbGVtZW50IH0gZnJvbSAndnVlJyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcbmltcG9ydCBYRVV0aWxzIGZyb20gJ3hlLXV0aWxzL21ldGhvZHMveGUtdXRpbHMnXHJcbmltcG9ydCB7IFZYRVRhYmxlLCBSZW5kZXJQYXJhbXMsIE9wdGlvblByb3BzLCBUYWJsZVJlbmRlclBhcmFtcywgUmVuZGVyT3B0aW9ucywgRmlsdGVyUmVuZGVyT3B0aW9ucywgQ2VsbFJlbmRlck9wdGlvbnMsIEVkaXRSZW5kZXJPcHRpb25zLCBJdGVtUmVuZGVyT3B0aW9ucywgQ2VsbFJlbmRlclBhcmFtcywgRWRpdFJlbmRlclBhcmFtcywgRmlsdGVyUmVuZGVyUGFyYW1zLCBGaWx0ZXJNZXRob2RQYXJhbXMsIEl0ZW1SZW5kZXJQYXJhbXMsIERhdGFFeHBvcnRMYWJlbFBhcmFtcyB9IGZyb20gJ3Z4ZS10YWJsZS9saWIvdnhlLXRhYmxlJyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVudXNlZC12YXJzXHJcblxyXG5mdW5jdGlvbiBpc0VtcHR5VmFsdWUgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gbnVsbCB8fCBjZWxsVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBjZWxsVmFsdWUgPT09ICcnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE1vZGVsUHJvcCAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucykge1xyXG4gIGxldCBwcm9wID0gJ3ZhbHVlJ1xyXG4gIHN3aXRjaCAocmVuZGVyT3B0cy5uYW1lKSB7XHJcbiAgICBjYXNlICdBU3dpdGNoJzpcclxuICAgICAgcHJvcCA9ICdjaGVja2VkJ1xyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gcHJvcFxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRNb2RlbEV2ZW50IChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zKSB7XHJcbiAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gIHN3aXRjaCAocmVuZGVyT3B0cy5uYW1lKSB7XHJcbiAgICBjYXNlICdBSW5wdXQnOlxyXG4gICAgICB0eXBlID0gJ2NoYW5nZS52YWx1ZSdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIHR5cGVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2hhbmdlRXZlbnQgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMpIHtcclxuICByZXR1cm4gJ2NoYW5nZSdcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBUYWJsZVJlbmRlclBhcmFtcywgdmFsdWU6IGFueSwgZGVmYXVsdFByb3BzPzogeyBbcHJvcDogc3RyaW5nXTogYW55IH0pIHtcclxuICBjb25zdCB7IHZTaXplIH0gPSBwYXJhbXMuJHRhYmxlXHJcbiAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKHZTaXplID8geyBzaXplOiB2U2l6ZSB9IDoge30sIGRlZmF1bHRQcm9wcywgcmVuZGVyT3B0cy5wcm9wcywgeyBbZ2V0TW9kZWxQcm9wKHJlbmRlck9wdHMpXTogdmFsdWUgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SXRlbVByb3BzIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IEl0ZW1SZW5kZXJQYXJhbXMsIHZhbHVlOiBhbnksIGRlZmF1bHRQcm9wcz86IHsgW3Byb3A6IHN0cmluZ106IGFueSB9KSB7XHJcbiAgY29uc3QgeyB2U2l6ZSB9ID0gcGFyYW1zLiRmb3JtXHJcbiAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKHZTaXplID8geyBzaXplOiB2U2l6ZSB9IDoge30sIGRlZmF1bHRQcm9wcywgcmVuZGVyT3B0cy5wcm9wcywgeyBbZ2V0TW9kZWxQcm9wKHJlbmRlck9wdHMpXTogdmFsdWUgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0T25zIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IFJlbmRlclBhcmFtcywgaW5wdXRGdW5jPzogRnVuY3Rpb24sIGNoYW5nZUZ1bmM/OiBGdW5jdGlvbikge1xyXG4gIGNvbnN0IHsgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgbW9kZWxFdmVudCA9IGdldE1vZGVsRXZlbnQocmVuZGVyT3B0cylcclxuICBjb25zdCBjaGFuZ2VFdmVudCA9IGdldENoYW5nZUV2ZW50KHJlbmRlck9wdHMpXHJcbiAgY29uc3QgaXNTYW1lRXZlbnQgPSBjaGFuZ2VFdmVudCA9PT0gbW9kZWxFdmVudFxyXG4gIGNvbnN0IG9uczogeyBbdHlwZTogc3RyaW5nXTogRnVuY3Rpb24gfSA9IHt9XHJcbiAgWEVVdGlscy5vYmplY3RFYWNoKGV2ZW50cywgKGZ1bmM6IEZ1bmN0aW9uLCBrZXk6IHN0cmluZykgPT4ge1xyXG4gICAgb25zW2tleV0gPSBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgZnVuYyhwYXJhbXMsIC4uLmFyZ3MpXHJcbiAgICB9XHJcbiAgfSlcclxuICBpZiAoaW5wdXRGdW5jKSB7XHJcbiAgICBvbnNbbW9kZWxFdmVudF0gPSBmdW5jdGlvbiAodmFsdWU6IGFueSkge1xyXG4gICAgICBpbnB1dEZ1bmModmFsdWUpXHJcbiAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW21vZGVsRXZlbnRdKSB7XHJcbiAgICAgICAgZXZlbnRzW21vZGVsRXZlbnRdKHZhbHVlKVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChpc1NhbWVFdmVudCAmJiBjaGFuZ2VGdW5jKSB7XHJcbiAgICAgICAgY2hhbmdlRnVuYygpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgaWYgKCFpc1NhbWVFdmVudCAmJiBjaGFuZ2VGdW5jKSB7XHJcbiAgICBvbnNbY2hhbmdlRXZlbnRdID0gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGNoYW5nZUZ1bmMoKVxyXG4gICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1tjaGFuZ2VFdmVudF0pIHtcclxuICAgICAgICBldmVudHNbY2hhbmdlRXZlbnRdKHBhcmFtcywgLi4uYXJncylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gb25zXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEVkaXRPbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogRWRpdFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgJHRhYmxlLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgcmV0dXJuIGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAvLyDlpITnkIYgbW9kZWwg5YC85Y+M5ZCR57uR5a6aXHJcbiAgICBYRVV0aWxzLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgdmFsdWUpXHJcbiAgfSwgKCkgPT4ge1xyXG4gICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICR0YWJsZS51cGRhdGVTdGF0dXMocGFyYW1zKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZpbHRlck9ucyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGaWx0ZXJSZW5kZXJQYXJhbXMsIG9wdGlvbjogYW55LCBjaGFuZ2VGdW5jOiBGdW5jdGlvbikge1xyXG4gIHJldHVybiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zLCAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgLy8g5aSE55CGIG1vZGVsIOWAvOWPjOWQkee7keWumlxyXG4gICAgb3B0aW9uLmRhdGEgPSB2YWx1ZVxyXG4gIH0sIGNoYW5nZUZ1bmMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEl0ZW1PbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogSXRlbVJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgJGZvcm0sIGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICByZXR1cm4gZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcywgKHZhbHVlOiBhbnkpID0+IHtcclxuICAgIC8vIOWkhOeQhiBtb2RlbCDlgLzlj4zlkJHnu5HlrppcclxuICAgIFhFVXRpbHMuc2V0KGRhdGEsIHByb3BlcnR5LCB2YWx1ZSlcclxuICB9LCAoKSA9PiB7XHJcbiAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgJGZvcm0udXBkYXRlU3RhdHVzKHBhcmFtcylcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYXRjaENhc2NhZGVyRGF0YSAoaW5kZXg6IG51bWJlciwgbGlzdDogQXJyYXk8YW55PiwgdmFsdWVzOiBBcnJheTxhbnk+LCBsYWJlbHM6IEFycmF5PGFueT4pIHtcclxuICBjb25zdCB2YWwgPSB2YWx1ZXNbaW5kZXhdXHJcbiAgaWYgKGxpc3QgJiYgdmFsdWVzLmxlbmd0aCA+IGluZGV4KSB7XHJcbiAgICBYRVV0aWxzLmVhY2gobGlzdCwgKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS52YWx1ZSA9PT0gdmFsKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goaXRlbS5sYWJlbClcclxuICAgICAgICBtYXRjaENhc2NhZGVyRGF0YSgrK2luZGV4LCBpdGVtLmNoaWxkcmVuLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdERhdGVQaWNrZXIgKGRlZmF1bHRGb3JtYXQ6IHN0cmluZykge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zLCBkZWZhdWx0Rm9ybWF0KSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNlbGVjdENlbGxWYWx1ZSAocmVuZGVyT3B0czogQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogYW55KSB7XHJcbiAgY29uc3QgeyBvcHRpb25zID0gW10sIG9wdGlvbkdyb3VwcywgcHJvcHMgPSB7fSwgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgY29uc3QgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gIGNvbnN0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICBjb25zdCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKCFpc0VtcHR5VmFsdWUoY2VsbFZhbHVlKSkge1xyXG4gICAgcmV0dXJuIFhFVXRpbHMubWFwKHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScgPyBjZWxsVmFsdWUgOiBbY2VsbFZhbHVlXSwgb3B0aW9uR3JvdXBzID8gKHZhbHVlOiBhbnkpID0+IHtcclxuICAgICAgbGV0IHNlbGVjdEl0ZW1cclxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9wdGlvbkdyb3Vwcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICBzZWxlY3RJdGVtID0gWEVVdGlscy5maW5kKG9wdGlvbkdyb3Vwc1tpbmRleF1bZ3JvdXBPcHRpb25zXSwgKGl0ZW06IGFueSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgICBpZiAoc2VsZWN0SXRlbSkge1xyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZVxyXG4gICAgfSA6ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdEl0ZW0gPSBYRVV0aWxzLmZpbmQob3B0aW9ucywgKGl0ZW06IGFueSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZVxyXG4gICAgfSkuam9pbignLCAnKVxyXG4gIH1cclxuICByZXR1cm4gbnVsbFxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXNjYWRlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgdmFyIHZhbHVlcyA9IGNlbGxWYWx1ZSB8fCBbXVxyXG4gIHZhciBsYWJlbHM6IEFycmF5PGFueT4gPSBbXVxyXG4gIG1hdGNoQ2FzY2FkZXJEYXRhKDAsIHByb3BzLm9wdGlvbnMsIHZhbHVlcywgbGFiZWxzKVxyXG4gIHJldHVybiAocHJvcHMuc2hvd0FsbExldmVscyA9PT0gZmFsc2UgPyBsYWJlbHMuc2xpY2UobGFiZWxzLmxlbmd0aCAtIDEsIGxhYmVscy5sZW5ndGgpIDogbGFiZWxzKS5qb2luKGAgJHtwcm9wcy5zZXBhcmF0b3IgfHwgJy8nfSBgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmIChjZWxsVmFsdWUpIHtcclxuICAgIGNlbGxWYWx1ZSA9IFhFVXRpbHMubWFwKGNlbGxWYWx1ZSwgKGRhdGU6IGFueSkgPT4gZGF0ZS5mb3JtYXQocHJvcHMuZm9ybWF0IHx8ICdZWVlZLU1NLUREJykpLmpvaW4oJyB+ICcpXHJcbiAgfVxyXG4gIHJldHVybiBjZWxsVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmIChjZWxsVmFsdWUgJiYgKHByb3BzLnRyZWVDaGVja2FibGUgfHwgcHJvcHMubXVsdGlwbGUpKSB7XHJcbiAgICBjZWxsVmFsdWUgPSBjZWxsVmFsdWUuam9pbignOycpXHJcbiAgfVxyXG4gIHJldHVybiBjZWxsVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDZWxsUmVuZGVyUGFyYW1zIHwgRGF0YUV4cG9ydExhYmVsUGFyYW1zLCBkZWZhdWx0Rm9ybWF0OiBzdHJpbmcpIHtcclxuICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgZGVmYXVsdEZvcm1hdClcclxuICB9XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFZGl0UmVuZGVyIChkZWZhdWx0UHJvcHM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBFZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBFZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChyZW5kZXJPcHRzLm5hbWUsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGNlbGxWYWx1ZSwgZGVmYXVsdFByb3BzKSxcclxuICAgICAgICBvbjogZ2V0RWRpdE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0pXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uRWRpdFJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRWRpdFJlbmRlck9wdGlvbnMsIHBhcmFtczogRWRpdFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICByZXR1cm4gW1xyXG4gICAgaCgnYS1idXR0b24nLCB7XHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG51bGwpLFxyXG4gICAgICBvbjogZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgIH0sIGNlbGxUZXh0KGgsIHJlbmRlck9wdHMuY29udGVudCkpXHJcbiAgXVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEVkaXRSZW5kZXJPcHRpb25zLCBwYXJhbXM6IEVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICByZXR1cm4gcmVuZGVyT3B0cy5jaGlsZHJlbi5tYXAoKGNoaWxkUmVuZGVyT3B0czogYW55KSA9PiBkZWZhdWx0QnV0dG9uRWRpdFJlbmRlcihoLCBjaGlsZFJlbmRlck9wdHMsIHBhcmFtcylbMF0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZpbHRlclJlbmRlciAoZGVmYXVsdFByb3BzPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRmlsdGVyUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGaWx0ZXJSZW5kZXJQYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgIGNvbnN0IHsgbmFtZSwgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XHJcbiAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcclxuICAgICAgcmV0dXJuIGgobmFtZSwge1xyXG4gICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uVmFsdWUsIGRlZmF1bHRQcm9wcyksXHJcbiAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIocGFyYW1zLCAhIW9wdGlvbi5kYXRhLCBvcHRpb24pXHJcbiAgICAgICAgfSlcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVDb25maXJtRmlsdGVyIChwYXJhbXM6IEZpbHRlclJlbmRlclBhcmFtcywgY2hlY2tlZDogYm9vbGVhbiwgb3B0aW9uOiBhbnkpIHtcclxuICBjb25zdCB7ICRwYW5lbCB9ID0gcGFyYW1zXHJcbiAgJHBhbmVsLmNoYW5nZU9wdGlvbih7fSwgY2hlY2tlZCwgb3B0aW9uKVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyTWV0aG9kIChwYXJhbXM6IEZpbHRlck1ldGhvZFBhcmFtcykge1xyXG4gIGNvbnN0IHsgb3B0aW9uLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgY29uc3QgeyBkYXRhIH0gPSBvcHRpb25cclxuICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cclxuICByZXR1cm4gY2VsbFZhbHVlID09PSBkYXRhXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlck9wdGlvbnMgKGg6IENyZWF0ZUVsZW1lbnQsIG9wdGlvbnM6IGFueVtdLCBvcHRpb25Qcm9wczogT3B0aW9uUHJvcHMpIHtcclxuICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgY29uc3QgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gIGNvbnN0IGRpc2FibGVkUHJvcCA9IG9wdGlvblByb3BzLmRpc2FibGVkIHx8ICdkaXNhYmxlZCdcclxuICByZXR1cm4gWEVVdGlscy5tYXAob3B0aW9ucywgKGl0ZW0sIG9JbmRleCkgPT4ge1xyXG4gICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdGlvbicsIHtcclxuICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgdmFsdWU6IGl0ZW1bdmFsdWVQcm9wXSxcclxuICAgICAgICBkaXNhYmxlZDogaXRlbVtkaXNhYmxlZFByb3BdXHJcbiAgICAgIH1cclxuICAgIH0sIGl0ZW1bbGFiZWxQcm9wXSlcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBjZWxsVGV4dCAoaDogQ3JlYXRlRWxlbWVudCwgY2VsbFZhbHVlOiBhbnkpIHtcclxuICByZXR1cm4gWycnICsgKGlzRW1wdHlWYWx1ZShjZWxsVmFsdWUpID8gJycgOiBjZWxsVmFsdWUpXVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGb3JtSXRlbVJlbmRlciAoZGVmYXVsdFByb3BzPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogSXRlbVJlbmRlck9wdGlvbnMsIHBhcmFtczogSXRlbVJlbmRlclBhcmFtcykge1xyXG4gICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IG5hbWUgfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IHsgYXR0cnMgfTogYW55ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgaXRlbVZhbHVlID0gWEVVdGlscy5nZXQoZGF0YSwgcHJvcGVydHkpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKG5hbWUsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlLCBkZWZhdWx0UHJvcHMpLFxyXG4gICAgICAgIG9uOiBnZXRJdGVtT25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgfSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25JdGVtUmVuZGVyIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBJdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBJdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHByb3BzID0gZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgbnVsbClcclxuICByZXR1cm4gW1xyXG4gICAgaCgnYS1idXR0b24nLCB7XHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBwcm9wcyxcclxuICAgICAgb246IGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICB9LCBjZWxsVGV4dChoLCByZW5kZXJPcHRzLmNvbnRlbnQgfHwgcHJvcHMuY29udGVudCkpXHJcbiAgXVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEl0ZW1SZW5kZXJQYXJhbXMpIHtcclxuICByZXR1cm4gcmVuZGVyT3B0cy5jaGlsZHJlbi5tYXAoKGNoaWxkUmVuZGVyT3B0czogYW55KSA9PiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlcihoLCBjaGlsZFJlbmRlck9wdHMsIHBhcmFtcylbMF0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QgKGRlZmF1bHRGb3JtYXQ6IHN0cmluZywgaXNFZGl0PzogYm9vbGVhbikge1xyXG4gIGNvbnN0IHJlbmRlclByb3BlcnR5ID0gaXNFZGl0ID8gJ2VkaXRSZW5kZXInIDogJ2NlbGxSZW5kZXInXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChwYXJhbXM6IERhdGFFeHBvcnRMYWJlbFBhcmFtcykge1xyXG4gICAgcmV0dXJuIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocGFyYW1zLmNvbHVtbltyZW5kZXJQcm9wZXJ0eV0sIHBhcmFtcywgZGVmYXVsdEZvcm1hdClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUV4cG9ydE1ldGhvZCAodmFsdWVNZXRob2Q6IEZ1bmN0aW9uLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogRGF0YUV4cG9ydExhYmVsUGFyYW1zKSB7XHJcbiAgICByZXR1cm4gdmFsdWVNZXRob2QocGFyYW1zLmNvbHVtbltyZW5kZXJQcm9wZXJ0eV0sIHBhcmFtcylcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlciAoKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBJdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBJdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IG5hbWUsIG9wdGlvbnMgPSBbXSwgb3B0aW9uUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICBjb25zdCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgICBjb25zdCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgICBjb25zdCBpdGVtVmFsdWUgPSBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSlcclxuICAgIHJldHVybiBbXHJcbiAgICAgIGgoYCR7bmFtZX1Hcm91cGAsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlKSxcclxuICAgICAgICBvbjogZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0sIG9wdGlvbnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgdmFsdWU6IG9wdGlvblt2YWx1ZVByb3BdLFxyXG4gICAgICAgICAgICBkaXNhYmxlZDogb3B0aW9uW2Rpc2FibGVkUHJvcF1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBvcHRpb25bbGFiZWxQcm9wXSlcclxuICAgICAgfSkpXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5riy5p+T5Ye95pWwXHJcbiAqL1xyXG5jb25zdCByZW5kZXJNYXAgPSB7XHJcbiAgQUF1dG9Db21wbGV0ZToge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBSW5wdXQ6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUlucHV0TnVtYmVyOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQtbnVtYmVyLWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0IChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBFZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBFZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgY29uc3QgcHJvcHMgPSBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgY2VsbFZhbHVlKVxyXG4gICAgICBjb25zdCBvbiA9IGdldEVkaXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGNvbnN0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgb25cclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG9uXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJGaWx0ZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZpbHRlclJlbmRlck9wdGlvbnMsIHBhcmFtczogRmlsdGVyUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBjb25zdCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcclxuICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKSxcclxuICAgICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIG9wdGlvbi5kYXRhICYmIG9wdGlvbi5kYXRhLmxlbmd0aCA+IDAsIG9wdGlvbilcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwOiBhbnksIGdJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZGF0YVxyXG4gICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKSxcclxuICAgICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcclxuICAgICAgICAgICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIG9wdGlvbi5kYXRhICYmIG9wdGlvbi5kYXRhLmxlbmd0aCA+IDAsIG9wdGlvbilcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyTWV0aG9kIChwYXJhbXM6IEZpbHRlck1ldGhvZFBhcmFtcykge1xyXG4gICAgICBjb25zdCB7IG9wdGlvbiwgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBjb25zdCB7IGRhdGEgfSA9IG9wdGlvblxyXG4gICAgICBjb25zdCB7IHByb3BlcnR5LCBmaWx0ZXJSZW5kZXI6IHJlbmRlck9wdHMgfSA9IGNvbHVtblxyXG4gICAgICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBwcm9wZXJ0eSlcclxuICAgICAgaWYgKHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScpIHtcclxuICAgICAgICBpZiAoWEVVdGlscy5pc0FycmF5KGNlbGxWYWx1ZSkpIHtcclxuICAgICAgICAgIHJldHVybiBYRVV0aWxzLmluY2x1ZGVBcnJheXMoY2VsbFZhbHVlLCBkYXRhKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YS5pbmRleE9mKGNlbGxWYWx1ZSkgPiAtMVxyXG4gICAgICB9XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xyXG4gICAgICByZXR1cm4gY2VsbFZhbHVlID09IGRhdGFcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBJdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBJdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCB7IGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBpdGVtVmFsdWUgPSBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSlcclxuICAgICAgY29uc3QgcHJvcHMgPSBnZXRJdGVtUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBpdGVtVmFsdWUpXHJcbiAgICAgIGNvbnN0IG9uID0gZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcclxuICAgICAgICBjb25zdCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgY29uc3QgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBvblxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXAsIGdJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgIGtleTogZ0luZGV4XHJcbiAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xyXG4gICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxyXG4gICAgICAgICAgICApKVxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgb25cclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRTZWxlY3RDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRTZWxlY3RDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBQ2FzY2FkZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IEVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldENhc2NhZGVyQ2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRDYXNjYWRlckNlbGxWYWx1ZSksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldENhc2NhZGVyQ2VsbFZhbHVlLCB0cnVlKVxyXG4gIH0sXHJcbiAgQURhdGVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktTU0tREQnKSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NLUREJyksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTS1ERCcsIHRydWUpXHJcbiAgfSxcclxuICBBTW9udGhQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktTU0nKSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NJyksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTScsIHRydWUpXHJcbiAgfSxcclxuICBBUmFuZ2VQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IEVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVdlZWtQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktV1flkagnKSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLVdX5ZGoJyksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1XV+WRqCcsIHRydWUpXHJcbiAgfSxcclxuICBBVGltZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignSEg6bW06c3MnKSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdISDptbTpzcycpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ0hIOm1tOnNzJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFUcmVlU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBFZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFSYXRlOiB7XHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQVN3aXRjaDoge1xyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBGaWx0ZXJSZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZpbHRlclJlbmRlclBhcmFtcykge1xyXG4gICAgICBjb25zdCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgbmFtZSwgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhXHJcbiAgICAgICAgcmV0dXJuIGgobmFtZSwge1xyXG4gICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uVmFsdWUpLFxyXG4gICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKHBhcmFtcywgWEVVdGlscy5pc0Jvb2xlYW4ob3B0aW9uLmRhdGEpLCBvcHRpb24pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQVJhZGlvOiB7XHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUNoZWNrYm94OiB7XHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUJ1dHRvbjoge1xyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBkZWZhdWx0QnV0dG9uRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckl0ZW06IGRlZmF1bHRCdXR0b25JdGVtUmVuZGVyXHJcbiAgfSxcclxuICBBQnV0dG9uczoge1xyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEJ1dHRvbnNFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEJ1dHRvbnNFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVySXRlbTogZGVmYXVsdEJ1dHRvbnNJdGVtUmVuZGVyXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5qOA5p+l6Kem5Y+R5rqQ5piv5ZCm5bGe5LqO55uu5qCH6IqC54K5XHJcbiAqL1xyXG5mdW5jdGlvbiBnZXRFdmVudFRhcmdldE5vZGUgKGV2bnQ6IGFueSwgY29udGFpbmVyOiBIVE1MRWxlbWVudCwgY2xhc3NOYW1lOiBzdHJpbmcpIHtcclxuICBsZXQgdGFyZ2V0RWxlbVxyXG4gIGxldCB0YXJnZXQgPSBldm50LnRhcmdldFxyXG4gIHdoaWxlICh0YXJnZXQgJiYgdGFyZ2V0Lm5vZGVUeXBlICYmIHRhcmdldCAhPT0gZG9jdW1lbnQpIHtcclxuICAgIGlmIChjbGFzc05hbWUgJiYgdGFyZ2V0LmNsYXNzTmFtZSAmJiB0YXJnZXQuY2xhc3NOYW1lLnNwbGl0KCcgJykuaW5kZXhPZihjbGFzc05hbWUpID4gLTEpIHtcclxuICAgICAgdGFyZ2V0RWxlbSA9IHRhcmdldFxyXG4gICAgfSBlbHNlIGlmICh0YXJnZXQgPT09IGNvbnRhaW5lcikge1xyXG4gICAgICByZXR1cm4geyBmbGFnOiBjbGFzc05hbWUgPyAhIXRhcmdldEVsZW0gOiB0cnVlLCBjb250YWluZXIsIHRhcmdldEVsZW06IHRhcmdldEVsZW0gfVxyXG4gICAgfVxyXG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGVcclxuICB9XHJcbiAgcmV0dXJuIHsgZmxhZzogZmFsc2UgfVxyXG59XHJcblxyXG4vKipcclxuICog5LqL5Lu25YW85a655oCn5aSE55CGXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVDbGVhckV2ZW50IChwYXJhbXM6IFRhYmxlUmVuZGVyUGFyYW1zLCBldm50OiBhbnkpIHtcclxuICBjb25zdCBib2R5RWxlbTogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5ib2R5XHJcbiAgaWYgKFxyXG4gICAgLy8g5LiL5ouJ5qGGXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtc2VsZWN0LWRyb3Bkb3duJykuZmxhZyB8fFxyXG4gICAgLy8g57qn6IGUXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FzY2FkZXItbWVudXMnKS5mbGFnIHx8XHJcbiAgICAvLyDml6XmnJ9cclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYWxlbmRhci1waWNrZXItY29udGFpbmVyJykuZmxhZyB8fFxyXG4gICAgLy8g5pe26Ze06YCJ5oupXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtdGltZS1waWNrZXItcGFuZWwnKS5mbGFnXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDln7rkuo4gdnhlLXRhYmxlIOihqOagvOeahOmAgumFjeaPkuS7tu+8jOeUqOS6juWFvOWuuSBhbnQtZGVzaWduLXZ1ZSDnu4Tku7blupNcclxuICovXHJcbmV4cG9ydCBjb25zdCBWWEVUYWJsZVBsdWdpbkFudGQgPSB7XHJcbiAgaW5zdGFsbCAoeyBpbnRlcmNlcHRvciwgcmVuZGVyZXIgfTogdHlwZW9mIFZYRVRhYmxlKSB7XHJcbiAgICByZW5kZXJlci5taXhpbihyZW5kZXJNYXApXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyRmlsdGVyJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJBY3RpdmVkJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvTW9tZW50U3RyaW5nIChjZWxsVmFsdWU6IGFueSwgZm9ybWF0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPyBjZWxsVmFsdWUuZm9ybWF0KGZvcm1hdCkgOiAnJ1xyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSAneGUtdXRpbHMvbWV0aG9kcy94ZS11dGlscycge1xyXG4gIGludGVyZmFjZSBYRVV0aWxzTWV0aG9kcyB7XHJcbiAgICAvKipcclxuICAgICAqIOWwhiBNb21lbnQg5pel5pyf5qC85byP5YyW5Li65a2X56ym5LiyXHJcbiAgICAgKiBAcGFyYW0gY2VsbFZhbHVlIOWAvFxyXG4gICAgICogQHBhcmFtIGZvcm1hdCDmoLzlvI/ljJZcclxuICAgICAqL1xyXG4gICAgdG9Nb21lbnRTdHJpbmc6IHR5cGVvZiB0b01vbWVudFN0cmluZztcclxuICB9XHJcbn1cclxuXHJcblhFVXRpbHMubWl4aW4oe1xyXG4gIHRvTW9tZW50U3RyaW5nXHJcbn0pXHJcblxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LlZYRVRhYmxlKSB7XHJcbiAgd2luZG93LlZYRVRhYmxlLnVzZShWWEVUYWJsZVBsdWdpbkFudGQpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZYRVRhYmxlUGx1Z2luQW50ZFxyXG4iXX0=
