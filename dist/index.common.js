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
    return [h('div', {
      "class": 'vxe-table--filter-iview-wrapper'
    }, column.filters.map(function (option, oIndex) {
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
    }))];
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
      var groupOptions = optionGroupProps.options || 'options';
      var groupLabel = optionGroupProps.label || 'label';
      var column = params.column;
      var attrs = renderOpts.attrs;
      return [h('div', {
        "class": 'vxe-table--filter-iview-wrapper'
      }, optionGroups ? column.filters.map(function (option, oIndex) {
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
      }) : column.filters.map(function (option, oIndex) {
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
      }))];
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
      return [h('div', {
        "class": 'vxe-table--filter-iview-wrapper'
      }, column.filters.map(function (option, oIndex) {
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
      }))];
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsImNlbGxWYWx1ZSIsInVuZGVmaW5lZCIsImdldE1vZGVsUHJvcCIsInJlbmRlck9wdHMiLCJwcm9wIiwibmFtZSIsImdldE1vZGVsRXZlbnQiLCJ0eXBlIiwiZ2V0Q2hhbmdlRXZlbnQiLCJnZXRDZWxsRWRpdEZpbHRlclByb3BzIiwicGFyYW1zIiwidmFsdWUiLCJkZWZhdWx0UHJvcHMiLCJ2U2l6ZSIsIiR0YWJsZSIsIlhFVXRpbHMiLCJhc3NpZ24iLCJzaXplIiwicHJvcHMiLCJnZXRJdGVtUHJvcHMiLCIkZm9ybSIsImdldE9ucyIsImlucHV0RnVuYyIsImNoYW5nZUZ1bmMiLCJldmVudHMiLCJtb2RlbEV2ZW50IiwiY2hhbmdlRXZlbnQiLCJpc1NhbWVFdmVudCIsIm9ucyIsIm9iamVjdEVhY2giLCJmdW5jIiwia2V5IiwiYXJncyIsImFyZ3MxIiwiZ2V0RWRpdE9ucyIsInJvdyIsImNvbHVtbiIsInNldCIsInByb3BlcnR5IiwidXBkYXRlU3RhdHVzIiwiZ2V0RmlsdGVyT25zIiwib3B0aW9uIiwiZGF0YSIsImdldEl0ZW1PbnMiLCJtYXRjaENhc2NhZGVyRGF0YSIsImluZGV4IiwibGlzdCIsInZhbHVlcyIsImxhYmVscyIsInZhbCIsImxlbmd0aCIsImVhY2giLCJpdGVtIiwicHVzaCIsImxhYmVsIiwiY2hpbGRyZW4iLCJmb3JtYXREYXRlUGlja2VyIiwiZGVmYXVsdEZvcm1hdCIsImgiLCJjZWxsVGV4dCIsImdldERhdGVQaWNrZXJDZWxsVmFsdWUiLCJnZXRTZWxlY3RDZWxsVmFsdWUiLCJvcHRpb25zIiwib3B0aW9uR3JvdXBzIiwib3B0aW9uUHJvcHMiLCJvcHRpb25Hcm91cFByb3BzIiwibGFiZWxQcm9wIiwidmFsdWVQcm9wIiwiZ3JvdXBPcHRpb25zIiwiZ2V0IiwibWFwIiwibW9kZSIsInNlbGVjdEl0ZW0iLCJmaW5kIiwiam9pbiIsImdldENhc2NhZGVyQ2VsbFZhbHVlIiwic2hvd0FsbExldmVscyIsInNsaWNlIiwic2VwYXJhdG9yIiwiZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUiLCJkYXRlIiwiZm9ybWF0IiwiZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSIsInRyZWVEYXRhIiwidHJlZUNoZWNrYWJsZSIsIm1hdGNoT2JqIiwiZmluZFRyZWUiLCJ0aXRsZSIsImNyZWF0ZUVkaXRSZW5kZXIiLCJhdHRycyIsIm9uIiwiZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIiLCJjb250ZW50IiwiZGVmYXVsdEJ1dHRvbnNFZGl0UmVuZGVyIiwiY2hpbGRSZW5kZXJPcHRzIiwiY3JlYXRlRmlsdGVyUmVuZGVyIiwiZmlsdGVycyIsIm9JbmRleCIsIm9wdGlvblZhbHVlIiwiaGFuZGxlQ29uZmlybUZpbHRlciIsImNoZWNrZWQiLCIkcGFuZWwiLCJjaGFuZ2VPcHRpb24iLCJkZWZhdWx0RmlsdGVyTWV0aG9kIiwicmVuZGVyT3B0aW9ucyIsImRpc2FibGVkUHJvcCIsImRpc2FibGVkIiwiY3JlYXRlRm9ybUl0ZW1SZW5kZXIiLCJpdGVtVmFsdWUiLCJkZWZhdWx0QnV0dG9uSXRlbVJlbmRlciIsImRlZmF1bHRCdXR0b25zSXRlbVJlbmRlciIsImNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QiLCJpc0VkaXQiLCJyZW5kZXJQcm9wZXJ0eSIsImNyZWF0ZUV4cG9ydE1ldGhvZCIsInZhbHVlTWV0aG9kIiwiY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyIiwicmVuZGVyTWFwIiwiQUF1dG9Db21wbGV0ZSIsImF1dG9mb2N1cyIsInJlbmRlckRlZmF1bHQiLCJyZW5kZXJFZGl0IiwicmVuZGVyRmlsdGVyIiwiZmlsdGVyTWV0aG9kIiwicmVuZGVySXRlbSIsIkFJbnB1dCIsIkFJbnB1dE51bWJlciIsIkFTZWxlY3QiLCJncm91cExhYmVsIiwiZ3JvdXAiLCJnSW5kZXgiLCJzbG90IiwiY29uY2F0IiwicmVuZGVyQ2VsbCIsImZpbHRlclJlbmRlciIsImlzQXJyYXkiLCJpbmNsdWRlQXJyYXlzIiwiaW5kZXhPZiIsImNlbGxFeHBvcnRNZXRob2QiLCJlZGl0Q2VsbEV4cG9ydE1ldGhvZCIsIkFDYXNjYWRlciIsIkFEYXRlUGlja2VyIiwiQU1vbnRoUGlja2VyIiwiQVJhbmdlUGlja2VyIiwiQVdlZWtQaWNrZXIiLCJBVGltZVBpY2tlciIsIkFUcmVlU2VsZWN0IiwiQVJhdGUiLCJBU3dpdGNoIiwiaXNCb29sZWFuIiwiQVJhZGlvIiwiQUNoZWNrYm94IiwiQUJ1dHRvbiIsIkFCdXR0b25zIiwiZ2V0RXZlbnRUYXJnZXROb2RlIiwiZXZudCIsImNvbnRhaW5lciIsImNsYXNzTmFtZSIsInRhcmdldEVsZW0iLCJ0YXJnZXQiLCJub2RlVHlwZSIsImRvY3VtZW50Iiwic3BsaXQiLCJmbGFnIiwicGFyZW50Tm9kZSIsImhhbmRsZUNsZWFyRXZlbnQiLCJlIiwiYm9keUVsZW0iLCJib2R5IiwiJGV2ZW50IiwiVlhFVGFibGVQbHVnaW5BbnRkIiwiaW5zdGFsbCIsImludGVyY2VwdG9yIiwicmVuZGVyZXIiLCJtaXhpbiIsImFkZCIsIndpbmRvdyIsIlZYRVRhYmxlIiwidXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBRUE7Ozs7OztBQW9CQTtBQUVBLFNBQVNBLFlBQVQsQ0FBdUJDLFNBQXZCLEVBQXFDO0FBQ25DLFNBQU9BLFNBQVMsS0FBSyxJQUFkLElBQXNCQSxTQUFTLEtBQUtDLFNBQXBDLElBQWlERCxTQUFTLEtBQUssRUFBdEU7QUFDRDs7QUFFRCxTQUFTRSxZQUFULENBQXVCQyxVQUF2QixFQUFnRDtBQUM5QyxNQUFJQyxJQUFJLEdBQUcsT0FBWDs7QUFDQSxVQUFRRCxVQUFVLENBQUNFLElBQW5CO0FBQ0UsU0FBSyxTQUFMO0FBQ0VELE1BQUFBLElBQUksR0FBRyxTQUFQO0FBQ0E7QUFISjs7QUFLQSxTQUFPQSxJQUFQO0FBQ0Q7O0FBRUQsU0FBU0UsYUFBVCxDQUF3QkgsVUFBeEIsRUFBaUQ7QUFDL0MsTUFBSUksSUFBSSxHQUFHLFFBQVg7O0FBQ0EsVUFBUUosVUFB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QUFqQixDQUFsQixDQUFvRUosSUFKcEUsSUFLQTtBQUNBVCxFQUFBQSxrQkFBa0IsQ0FBQ0MsSUFBRCxFQUFPWSxRQUFQLEVBQWlCLHVCQUFqQixDQUFsQixDQUE0REosSUFSOUQsRUFTRTtBQUNBLFdBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFFRDs7Ozs7QUFHTyxJQUFNTyxrQkFBa0IsR0FBRztBQUNoQ0MsRUFBQUEsT0FEZ0MseUJBQ21CO0FBQUEsUUFBeENDLFdBQXdDLFFBQXhDQSxXQUF3QztBQUFBLFFBQTNCQyxRQUEyQixRQUEzQkEsUUFBMkI7QUFDakRBLElBQUFBLFFBQVEsQ0FBQ0MsS0FBVCxDQUFlekQsU0FBZjtBQUNBdUQsSUFBQUEsV0FBVyxDQUFDRyxHQUFaLENBQWdCLG1CQUFoQixFQUFxQ1YsZ0JBQXJDO0FBQ0FPLElBQUFBLFdBQVcsQ0FBQ0csR0FBWixDQUFnQixvQkFBaEIsRUFBc0NWLGdCQUF0QztBQUNEO0FBTCtCLENBQTNCOzs7QUFRUCxJQUFJLE9BQU9XLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE1BQU0sQ0FBQ0MsUUFBNUMsRUFBc0Q7QUFDcERELEVBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JSLGtCQUFwQjtBQUNEOztlQUVjQSxrQiIsImZpbGUiOiJpbmRleC5jb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5pbXBvcnQgeyBDcmVhdGVFbGVtZW50IH0gZnJvbSAndnVlJ1xyXG5pbXBvcnQgWEVVdGlscyBmcm9tICd4ZS11dGlscy9tZXRob2RzL3hlLXV0aWxzJ1xyXG5pbXBvcnQge1xyXG4gIFZYRVRhYmxlLFxyXG4gIFJlbmRlclBhcmFtcyxcclxuICBPcHRpb25Qcm9wcyxcclxuICBSZW5kZXJPcHRpb25zLFxyXG4gIEludGVyY2VwdG9yUGFyYW1zLFxyXG4gIFRhYmxlUmVuZGVyUGFyYW1zLFxyXG4gIENvbHVtbkZpbHRlclBhcmFtcyxcclxuICBDb2x1bW5GaWx0ZXJSZW5kZXJPcHRpb25zLFxyXG4gIENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLFxyXG4gIENvbHVtbkVkaXRSZW5kZXJPcHRpb25zLFxyXG4gIEZvcm1JdGVtUmVuZGVyT3B0aW9ucyxcclxuICBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zLFxyXG4gIENvbHVtbkVkaXRSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zLFxyXG4gIENvbHVtbkZpbHRlck1ldGhvZFBhcmFtcyxcclxuICBDb2x1bW5FeHBvcnRDZWxsUmVuZGVyUGFyYW1zLFxyXG4gIEZvcm1JdGVtUmVuZGVyUGFyYW1zXHJcbn0gZnJvbSAndnhlLXRhYmxlL2xpYi92eGUtdGFibGUnXHJcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuXHJcbmZ1bmN0aW9uIGlzRW1wdHlWYWx1ZSAoY2VsbFZhbHVlOiBhbnkpIHtcclxuICByZXR1cm4gY2VsbFZhbHVlID09PSBudWxsIHx8IGNlbGxWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGNlbGxWYWx1ZSA9PT0gJydcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TW9kZWxQcm9wIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zKSB7XHJcbiAgbGV0IHByb3AgPSAndmFsdWUnXHJcbiAgc3dpdGNoIChyZW5kZXJPcHRzLm5hbWUpIHtcclxuICAgIGNhc2UgJ0FTd2l0Y2gnOlxyXG4gICAgICBwcm9wID0gJ2NoZWNrZWQnXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIHJldHVybiBwcm9wXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE1vZGVsRXZlbnQgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMpIHtcclxuICBsZXQgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgc3dpdGNoIChyZW5kZXJPcHRzLm5hbWUpIHtcclxuICAgIGNhc2UgJ0FJbnB1dCc6XHJcbiAgICAgIHR5cGUgPSAnY2hhbmdlLnZhbHVlJ1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQVJhZGlvJzpcclxuICAgIGNhc2UgJ0FDaGVja2JveCc6XHJcbiAgICAgIHR5cGUgPSAnaW5wdXQnXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIHJldHVybiB0eXBlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENoYW5nZUV2ZW50IChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zKSB7XHJcbiAgcmV0dXJuICdjaGFuZ2UnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENlbGxFZGl0RmlsdGVyUHJvcHMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogVGFibGVSZW5kZXJQYXJhbXMsIHZhbHVlOiBhbnksIGRlZmF1bHRQcm9wcz86IHsgW3Byb3A6IHN0cmluZ106IGFueSB9KSB7XHJcbiAgY29uc3QgeyB2U2l6ZSB9ID0gcGFyYW1zLiR0YWJsZVxyXG4gIHJldHVybiBYRVV0aWxzLmFzc2lnbih2U2l6ZSA/IHsgc2l6ZTogdlNpemUgfSA6IHt9LCBkZWZhdWx0UHJvcHMsIHJlbmRlck9wdHMucHJvcHMsIHsgW2dldE1vZGVsUHJvcChyZW5kZXJPcHRzKV06IHZhbHVlIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEl0ZW1Qcm9wcyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcywgdmFsdWU6IGFueSwgZGVmYXVsdFByb3BzPzogeyBbcHJvcDogc3RyaW5nXTogYW55IH0pIHtcclxuICBjb25zdCB7IHZTaXplIH0gPSBwYXJhbXMuJGZvcm1cclxuICByZXR1cm4gWEVVdGlscy5hc3NpZ24odlNpemUgPyB7IHNpemU6IHZTaXplIH0gOiB7fSwgZGVmYXVsdFByb3BzLCByZW5kZXJPcHRzLnByb3BzLCB7IFtnZXRNb2RlbFByb3AocmVuZGVyT3B0cyldOiB2YWx1ZSB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRPbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogUmVuZGVyUGFyYW1zLCBpbnB1dEZ1bmM/OiBGdW5jdGlvbiwgY2hhbmdlRnVuYz86IEZ1bmN0aW9uKSB7XHJcbiAgY29uc3QgeyBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCBtb2RlbEV2ZW50ID0gZ2V0TW9kZWxFdmVudChyZW5kZXJPcHRzKVxyXG4gIGNvbnN0IGNoYW5nZUV2ZW50ID0gZ2V0Q2hhbmdlRXZlbnQocmVuZGVyT3B0cylcclxuICBjb25zdCBpc1NhbWVFdmVudCA9IGNoYW5nZUV2ZW50ID09PSBtb2RlbEV2ZW50XHJcbiAgY29uc3Qgb25zOiB7IFt0eXBlOiBzdHJpbmddOiBGdW5jdGlvbiB9ID0ge31cclxuICBYRVV0aWxzLm9iamVjdEVhY2goZXZlbnRzLCAoZnVuYzogRnVuY3Rpb24sIGtleTogc3RyaW5nKSA9PiB7XHJcbiAgICBvbnNba2V5XSA9IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICBmdW5jKHBhcmFtcywgLi4uYXJncylcclxuICAgIH1cclxuICB9KVxyXG4gIGlmIChpbnB1dEZ1bmMpIHtcclxuICAgIG9uc1ttb2RlbEV2ZW50XSA9IGZ1bmN0aW9uIChhcmdzMTogYW55KSB7XHJcbiAgICAgIGlucHV0RnVuYyhhcmdzMSlcclxuICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbbW9kZWxFdmVudF0pIHtcclxuICAgICAgICBldmVudHNbbW9kZWxFdmVudF0oYXJnczEpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKGlzU2FtZUV2ZW50ICYmIGNoYW5nZUZ1bmMpIHtcclxuICAgICAgICBjaGFuZ2VGdW5jKGFyZ3MxKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmICghaXNTYW1lRXZlbnQgJiYgY2hhbmdlRnVuYykge1xyXG4gICAgb25zW2NoYW5nZUV2ZW50XSA9IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICBjaGFuZ2VGdW5jKC4uLmFyZ3MpXHJcbiAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW2NoYW5nZUV2ZW50XSkge1xyXG4gICAgICAgIGV2ZW50c1tjaGFuZ2VFdmVudF0ocGFyYW1zLCAuLi5hcmdzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBvbnNcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RWRpdE9ucyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyAkdGFibGUsIHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICByZXR1cm4gZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcywgKHZhbHVlOiBhbnkpID0+IHtcclxuICAgIC8vIOWkhOeQhiBtb2RlbCDlgLzlj4zlkJHnu5HlrppcclxuICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCB2YWx1ZSlcclxuICB9LCAoKSA9PiB7XHJcbiAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgJHRhYmxlLnVwZGF0ZVN0YXR1cyhwYXJhbXMpXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RmlsdGVyT25zIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkZpbHRlclJlbmRlclBhcmFtcywgb3B0aW9uOiBDb2x1bW5GaWx0ZXJQYXJhbXMsIGNoYW5nZUZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgcmV0dXJuIGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAvLyDlpITnkIYgbW9kZWwg5YC85Y+M5ZCR57uR5a6aXHJcbiAgICBvcHRpb24uZGF0YSA9IHZhbHVlXHJcbiAgfSwgY2hhbmdlRnVuYylcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SXRlbU9ucyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgJGZvcm0sIGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICByZXR1cm4gZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcywgKHZhbHVlOiBhbnkpID0+IHtcclxuICAgIC8vIOWkhOeQhiBtb2RlbCDlgLzlj4zlkJHnu5HlrppcclxuICAgIFhFVXRpbHMuc2V0KGRhdGEsIHByb3BlcnR5LCB2YWx1ZSlcclxuICB9LCAoKSA9PiB7XHJcbiAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgJGZvcm0udXBkYXRlU3RhdHVzKHBhcmFtcylcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYXRjaENhc2NhZGVyRGF0YSAoaW5kZXg6IG51bWJlciwgbGlzdDogYW55W10sIHZhbHVlczogYW55W10sIGxhYmVsczogYW55W10pIHtcclxuICBjb25zdCB2YWwgPSB2YWx1ZXNbaW5kZXhdXHJcbiAgaWYgKGxpc3QgJiYgdmFsdWVzLmxlbmd0aCA+IGluZGV4KSB7XHJcbiAgICBYRVV0aWxzLmVhY2gobGlzdCwgKGl0ZW0pID0+IHtcclxuICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IHZhbCkge1xyXG4gICAgICAgIGxhYmVscy5wdXNoKGl0ZW0ubGFiZWwpXHJcbiAgICAgICAgbWF0Y2hDYXNjYWRlckRhdGEoKytpbmRleCwgaXRlbS5jaGlsZHJlbiwgdmFsdWVzLCBsYWJlbHMpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXREYXRlUGlja2VyIChkZWZhdWx0Rm9ybWF0OiBzdHJpbmcpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXREYXRlUGlja2VyQ2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcywgZGVmYXVsdEZvcm1hdCkpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZWxlY3RDZWxsVmFsdWUgKHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7IG9wdGlvbnMgPSBbXSwgb3B0aW9uR3JvdXBzLCBwcm9wcyA9IHt9LCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgY29uc3QgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoIWlzRW1wdHlWYWx1ZShjZWxsVmFsdWUpKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5tYXAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJyA/IGNlbGxWYWx1ZSA6IFtjZWxsVmFsdWVdLCBvcHRpb25Hcm91cHMgPyAodmFsdWUpID0+IHtcclxuICAgICAgbGV0IHNlbGVjdEl0ZW1cclxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9wdGlvbkdyb3Vwcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICBzZWxlY3RJdGVtID0gWEVVdGlscy5maW5kKG9wdGlvbkdyb3Vwc1tpbmRleF1bZ3JvdXBPcHRpb25zXSwgKGl0ZW0pID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXHJcbiAgICAgICAgaWYgKHNlbGVjdEl0ZW0pIHtcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzZWxlY3RJdGVtID8gc2VsZWN0SXRlbVtsYWJlbFByb3BdIDogdmFsdWVcclxuICAgIH0gOiAodmFsdWUpID0+IHtcclxuICAgICAgY29uc3Qgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25zLCAoaXRlbSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZVxyXG4gICAgfSkuam9pbignLCAnKVxyXG4gIH1cclxuICByZXR1cm4gbnVsbFxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXNjYWRlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgdmFyIHZhbHVlcyA9IGNlbGxWYWx1ZSB8fCBbXVxyXG4gIHZhciBsYWJlbHM6IEFycmF5PGFueT4gPSBbXVxyXG4gIG1hdGNoQ2FzY2FkZXJEYXRhKDAsIHByb3BzLm9wdGlvbnMsIHZhbHVlcywgbGFiZWxzKVxyXG4gIHJldHVybiAocHJvcHMuc2hvd0FsbExldmVscyA9PT0gZmFsc2UgPyBsYWJlbHMuc2xpY2UobGFiZWxzLmxlbmd0aCAtIDEsIGxhYmVscy5sZW5ndGgpIDogbGFiZWxzKS5qb2luKGAgJHtwcm9wcy5zZXBhcmF0b3IgfHwgJy8nfSBgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmIChjZWxsVmFsdWUpIHtcclxuICAgIGNlbGxWYWx1ZSA9IFhFVXRpbHMubWFwKGNlbGxWYWx1ZSwgKGRhdGUpID0+IGRhdGUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCAnWVlZWS1NTS1ERCcpKS5qb2luKCcgfiAnKVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFRyZWVTZWxlY3RDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgdHJlZURhdGEsIHRyZWVDaGVja2FibGUgfSA9IHByb3BzXHJcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmICghaXNFbXB0eVZhbHVlKGNlbGxWYWx1ZSkpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLm1hcCh0cmVlQ2hlY2thYmxlID8gY2VsbFZhbHVlIDogW2NlbGxWYWx1ZV0sICh2YWx1ZSkgPT4ge1xyXG4gICAgICBjb25zdCBtYXRjaE9iaiA9IFhFVXRpbHMuZmluZFRyZWUodHJlZURhdGEsIChpdGVtKSA9PiBpdGVtLnZhbHVlID09PSB2YWx1ZSwgeyBjaGlsZHJlbjogJ2NoaWxkcmVuJyB9KVxyXG4gICAgICByZXR1cm4gbWF0Y2hPYmogPyBtYXRjaE9iai5pdGVtLnRpdGxlIDogdmFsdWVcclxuICAgIH0pLmpvaW4oJywgJylcclxuICB9XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXREYXRlUGlja2VyQ2VsbFZhbHVlIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMgfCBDb2x1bW5FeHBvcnRDZWxsUmVuZGVyUGFyYW1zLCBkZWZhdWx0Rm9ybWF0OiBzdHJpbmcpIHtcclxuICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgZGVmYXVsdEZvcm1hdClcclxuICB9XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFZGl0UmVuZGVyIChkZWZhdWx0UHJvcHM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChyZW5kZXJPcHRzLm5hbWUsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGNlbGxWYWx1ZSwgZGVmYXVsdFByb3BzKSxcclxuICAgICAgICBvbjogZ2V0RWRpdE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0pXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uRWRpdFJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICByZXR1cm4gW1xyXG4gICAgaCgnYS1idXR0b24nLCB7XHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG51bGwpLFxyXG4gICAgICBvbjogZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgIH0sIGNlbGxUZXh0KGgsIHJlbmRlck9wdHMuY29udGVudCkpXHJcbiAgXVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkVkaXRSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICByZXR1cm4gcmVuZGVyT3B0cy5jaGlsZHJlbi5tYXAoKGNoaWxkUmVuZGVyT3B0czogQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMpID0+IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyKGgsIGNoaWxkUmVuZGVyT3B0cywgcGFyYW1zKVswXSlcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRmlsdGVyUmVuZGVyIChkZWZhdWx0UHJvcHM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5GaWx0ZXJSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkZpbHRlclJlbmRlclBhcmFtcykge1xyXG4gICAgY29uc3QgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgeyBuYW1lLCBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaCgnZGl2Jywge1xyXG4gICAgICAgIGNsYXNzOiAndnhlLXRhYmxlLS1maWx0ZXItaXZpZXctd3JhcHBlcidcclxuICAgICAgfSwgY29sdW1uLmZpbHRlcnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcclxuICAgICAgICByZXR1cm4gaChuYW1lLCB7XHJcbiAgICAgICAgICBrZXk6IG9JbmRleCxcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgcHJvcHM6IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb25WYWx1ZSwgZGVmYXVsdFByb3BzKSxcclxuICAgICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcclxuICAgICAgICAgICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsICEhb3B0aW9uLmRhdGEsIG9wdGlvbilcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSlcclxuICAgICAgfSkpXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVDb25maXJtRmlsdGVyIChwYXJhbXM6IENvbHVtbkZpbHRlclJlbmRlclBhcmFtcywgY2hlY2tlZDogYm9vbGVhbiwgb3B0aW9uOiBDb2x1bW5GaWx0ZXJQYXJhbXMpIHtcclxuICBjb25zdCB7ICRwYW5lbCB9ID0gcGFyYW1zXHJcbiAgJHBhbmVsLmNoYW5nZU9wdGlvbih7fSwgY2hlY2tlZCwgb3B0aW9uKVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyTWV0aG9kIChwYXJhbXM6IENvbHVtbkZpbHRlck1ldGhvZFBhcmFtcykge1xyXG4gIGNvbnN0IHsgb3B0aW9uLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgY29uc3QgeyBkYXRhIH0gPSBvcHRpb25cclxuICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cclxuICByZXR1cm4gY2VsbFZhbHVlID09PSBkYXRhXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlck9wdGlvbnMgKGg6IENyZWF0ZUVsZW1lbnQsIG9wdGlvbnM6IGFueVtdLCBvcHRpb25Qcm9wczogT3B0aW9uUHJvcHMpIHtcclxuICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgY29uc3QgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gIGNvbnN0IGRpc2FibGVkUHJvcCA9IG9wdGlvblByb3BzLmRpc2FibGVkIHx8ICdkaXNhYmxlZCdcclxuICByZXR1cm4gWEVVdGlscy5tYXAob3B0aW9ucywgKGl0ZW0sIG9JbmRleCkgPT4ge1xyXG4gICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdGlvbicsIHtcclxuICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgdmFsdWU6IGl0ZW1bdmFsdWVQcm9wXSxcclxuICAgICAgICBkaXNhYmxlZDogaXRlbVtkaXNhYmxlZFByb3BdXHJcbiAgICAgIH1cclxuICAgIH0sIGl0ZW1bbGFiZWxQcm9wXSlcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBjZWxsVGV4dCAoaDogQ3JlYXRlRWxlbWVudCwgY2VsbFZhbHVlOiBhbnkpIHtcclxuICByZXR1cm4gWycnICsgKGlzRW1wdHlWYWx1ZShjZWxsVmFsdWUpID8gJycgOiBjZWxsVmFsdWUpXVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGb3JtSXRlbVJlbmRlciAoZGVmYXVsdFByb3BzPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICAgIGNvbnN0IHsgbmFtZSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgaXRlbVZhbHVlID0gWEVVdGlscy5nZXQoZGF0YSwgcHJvcGVydHkpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKG5hbWUsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlLCBkZWZhdWx0UHJvcHMpLFxyXG4gICAgICAgIG9uOiBnZXRJdGVtT25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgfSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25JdGVtUmVuZGVyIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgcHJvcHMgPSBnZXRJdGVtUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBudWxsKVxyXG4gIHJldHVybiBbXHJcbiAgICBoKCdhLWJ1dHRvbicsIHtcclxuICAgICAgYXR0cnMsXHJcbiAgICAgIHByb3BzLFxyXG4gICAgICBvbjogZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgIH0sIGNlbGxUZXh0KGgsIHJlbmRlck9wdHMuY29udGVudCB8fCBwcm9wcy5jb250ZW50KSlcclxuICBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25zSXRlbVJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgcmV0dXJuIHJlbmRlck9wdHMuY2hpbGRyZW4ubWFwKChjaGlsZFJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucykgPT4gZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXIoaCwgY2hpbGRSZW5kZXJPcHRzLCBwYXJhbXMpWzBdKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kIChkZWZhdWx0Rm9ybWF0OiBzdHJpbmcsIGlzRWRpdD86IGJvb2xlYW4pIHtcclxuICBjb25zdCByZW5kZXJQcm9wZXJ0eSA9IGlzRWRpdCA/ICdlZGl0UmVuZGVyJyA6ICdjZWxsUmVuZGVyJ1xyXG4gIHJldHVybiBmdW5jdGlvbiAocGFyYW1zOiBDb2x1bW5FeHBvcnRDZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgICByZXR1cm4gZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZShwYXJhbXMuY29sdW1uW3JlbmRlclByb3BlcnR5XSwgcGFyYW1zLCBkZWZhdWx0Rm9ybWF0KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRXhwb3J0TWV0aG9kICh2YWx1ZU1ldGhvZDogRnVuY3Rpb24sIGlzRWRpdD86IGJvb2xlYW4pIHtcclxuICBjb25zdCByZW5kZXJQcm9wZXJ0eSA9IGlzRWRpdCA/ICdlZGl0UmVuZGVyJyA6ICdjZWxsUmVuZGVyJ1xyXG4gIHJldHVybiBmdW5jdGlvbiAocGFyYW1zOiBDb2x1bW5FeHBvcnRDZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgICByZXR1cm4gdmFsdWVNZXRob2QocGFyYW1zLmNvbHVtbltyZW5kZXJQcm9wZXJ0eV0sIHBhcmFtcylcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlciAoKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgbmFtZSwgb3B0aW9ucyA9IFtdLCBvcHRpb25Qcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICBjb25zdCB7IGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgIGNvbnN0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICAgIGNvbnN0IGRpc2FibGVkUHJvcCA9IG9wdGlvblByb3BzLmRpc2FibGVkIHx8ICdkaXNhYmxlZCdcclxuICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChgJHtuYW1lfUdyb3VwYCwge1xyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIHByb3BzOiBnZXRJdGVtUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBpdGVtVmFsdWUpLFxyXG4gICAgICAgIG9uOiBnZXRJdGVtT25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgfSwgb3B0aW9ucy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGgobmFtZSwge1xyXG4gICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICB2YWx1ZTogb3B0aW9uW3ZhbHVlUHJvcF0sXHJcbiAgICAgICAgICAgIGRpc2FibGVkOiBvcHRpb25bZGlzYWJsZWRQcm9wXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIG9wdGlvbltsYWJlbFByb3BdKVxyXG4gICAgICB9KSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmuLLmn5Plh73mlbBcclxuICovXHJcbmNvbnN0IHJlbmRlck1hcCA9IHtcclxuICBBQXV0b0NvbXBsZXRlOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFJbnB1dDoge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBSW5wdXROdW1iZXI6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dC1udW1iZXItaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFTZWxlY3Q6IHtcclxuICAgIHJlbmRlckVkaXQgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkVkaXRSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgY29uc3QgeyBvcHRpb25zID0gW10sIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGNvbnN0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICBjb25zdCBwcm9wcyA9IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBjZWxsVmFsdWUpXHJcbiAgICAgIGNvbnN0IG9uID0gZ2V0RWRpdE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcclxuICAgICAgICBjb25zdCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgY29uc3QgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBvblxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXAsIGdJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgIGtleTogZ0luZGV4XHJcbiAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xyXG4gICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxyXG4gICAgICAgICAgICApKVxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgb25cclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHJlbmRlckNlbGwgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldFNlbGVjdENlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckZpbHRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRmlsdGVyUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgY29uc3QgeyBvcHRpb25zID0gW10sIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgY29uc3QgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICBjb25zdCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBoKCdkaXYnLCB7XHJcbiAgICAgICAgICBjbGFzczogJ3Z4ZS10YWJsZS0tZmlsdGVyLWl2aWV3LXdyYXBwZXInXHJcbiAgICAgICAgfSwgb3B0aW9uR3JvdXBzXHJcbiAgICAgICAgICA/IGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZGF0YVxyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgICAgcHJvcHM6IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb25WYWx1ZSksXHJcbiAgICAgICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKHBhcmFtcywgb3B0aW9uLmRhdGEgJiYgb3B0aW9uLmRhdGEubGVuZ3RoID4gMCwgb3B0aW9uKVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICAgKSlcclxuICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgOiBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uVmFsdWUpLFxyXG4gICAgICAgICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcclxuICAgICAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIG9wdGlvbi5kYXRhICYmIG9wdGlvbi5kYXRhLmxlbmd0aCA+IDAsIG9wdGlvbilcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyTWV0aG9kIChwYXJhbXM6IENvbHVtbkZpbHRlck1ldGhvZFBhcmFtcykge1xyXG4gICAgICBjb25zdCB7IG9wdGlvbiwgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBjb25zdCB7IGRhdGEgfSA9IG9wdGlvblxyXG4gICAgICBjb25zdCB7IHByb3BlcnR5LCBmaWx0ZXJSZW5kZXI6IHJlbmRlck9wdHMgfSA9IGNvbHVtblxyXG4gICAgICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBwcm9wZXJ0eSlcclxuICAgICAgaWYgKHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScpIHtcclxuICAgICAgICBpZiAoWEVVdGlscy5pc0FycmF5KGNlbGxWYWx1ZSkpIHtcclxuICAgICAgICAgIHJldHVybiBYRVV0aWxzLmluY2x1ZGVBcnJheXMoY2VsbFZhbHVlLCBkYXRhKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YS5pbmRleE9mKGNlbGxWYWx1ZSkgPiAtMVxyXG4gICAgICB9XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xyXG4gICAgICByZXR1cm4gY2VsbFZhbHVlID09IGRhdGFcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMpIHtcclxuICAgICAgY29uc3QgeyBvcHRpb25zID0gW10sIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGNvbnN0IHsgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xyXG4gICAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KVxyXG4gICAgICBjb25zdCBwcm9wcyA9IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGl0ZW1WYWx1ZSlcclxuICAgICAgY29uc3Qgb24gPSBnZXRJdGVtT25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBjb25zdCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIG9uXHJcbiAgICAgICAgICB9LCBYRVV0aWxzLm1hcChvcHRpb25Hcm91cHMsIChncm91cCwgZ0luZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBvblxyXG4gICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFNlbGVjdENlbGxWYWx1ZSksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFNlbGVjdENlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFDYXNjYWRlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0Q2FzY2FkZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldENhc2NhZGVyQ2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0Q2FzY2FkZXJDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBRGF0ZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTS1ERCcpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0tREQnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NLUREJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFNb250aFBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTScpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0nKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFSYW5nZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBV2Vla1BpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1XV+WRqCcpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktV1flkagnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLVdX5ZGoJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFUaW1lUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdISDptbTpzcycpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ0hIOm1tOnNzJyksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnSEg6bW06c3MnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVRyZWVTZWxlY3Q6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldFRyZWVTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFRyZWVTZWxlY3RDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVJhdGU6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBU3dpdGNoOiB7XHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBuYW1lLCBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2RpdicsIHtcclxuICAgICAgICAgIGNsYXNzOiAndnhlLXRhYmxlLS1maWx0ZXItaXZpZXctd3JhcHBlcidcclxuICAgICAgICB9LCBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhXHJcbiAgICAgICAgICByZXR1cm4gaChuYW1lLCB7XHJcbiAgICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgcHJvcHM6IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb25WYWx1ZSksXHJcbiAgICAgICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcclxuICAgICAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIocGFyYW1zLCBYRVV0aWxzLmlzQm9vbGVhbihvcHRpb24uZGF0YSksIG9wdGlvbilcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSkpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBUmFkaW86IHtcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlcigpXHJcbiAgfSxcclxuICBBQ2hlY2tib3g6IHtcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlcigpXHJcbiAgfSxcclxuICBBQnV0dG9uOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0QnV0dG9uRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVySXRlbTogZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXJcclxuICB9LFxyXG4gIEFCdXR0b25zOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJJdGVtOiBkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXJcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmo4Dmn6Xop6blj5HmupDmmK/lkKblsZ7kuo7nm67moIfoioLngrlcclxuICovXHJcbmZ1bmN0aW9uIGdldEV2ZW50VGFyZ2V0Tm9kZSAoZXZudDogYW55LCBjb250YWluZXI6IEhUTUxFbGVtZW50LCBjbGFzc05hbWU6IHN0cmluZykge1xyXG4gIGxldCB0YXJnZXRFbGVtXHJcbiAgbGV0IHRhcmdldCA9IGV2bnQudGFyZ2V0XHJcbiAgd2hpbGUgKHRhcmdldCAmJiB0YXJnZXQubm9kZVR5cGUgJiYgdGFyZ2V0ICE9PSBkb2N1bWVudCkge1xyXG4gICAgaWYgKGNsYXNzTmFtZSAmJiB0YXJnZXQuY2xhc3NOYW1lICYmIHRhcmdldC5jbGFzc05hbWUuc3BsaXQgJiYgdGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCgnICcpLmluZGV4T2YoY2xhc3NOYW1lKSA+IC0xKSB7XHJcbiAgICAgIHRhcmdldEVsZW0gPSB0YXJnZXRcclxuICAgIH0gZWxzZSBpZiAodGFyZ2V0ID09PSBjb250YWluZXIpIHtcclxuICAgICAgcmV0dXJuIHsgZmxhZzogY2xhc3NOYW1lID8gISF0YXJnZXRFbGVtIDogdHJ1ZSwgY29udGFpbmVyLCB0YXJnZXRFbGVtOiB0YXJnZXRFbGVtIH1cclxuICAgIH1cclxuICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlXHJcbiAgfVxyXG4gIHJldHVybiB7IGZsYWc6IGZhbHNlIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOS6i+S7tuWFvOWuueaAp+WkhOeQhlxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlQ2xlYXJFdmVudCAocGFyYW1zOiBhbnksIGU6IGFueSkge1xyXG4gIGNvbnN0IGJvZHlFbGVtOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmJvZHlcclxuICBjb25zdCBldm50ID0gcGFyYW1zLiRldmVudCB8fCBlXHJcbiAgaWYgKFxyXG4gICAgLy8g5LiL5ouJ5qGGXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtc2VsZWN0LWRyb3Bkb3duJykuZmxhZyB8fFxyXG4gICAgLy8g57qn6IGUXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FzY2FkZXItbWVudXMnKS5mbGFnIHx8XHJcbiAgICAvLyDml6XmnJ9cclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYWxlbmRhci1waWNrZXItY29udGFpbmVyJykuZmxhZyB8fFxyXG4gICAgLy8g5pe26Ze06YCJ5oupXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtdGltZS1waWNrZXItcGFuZWwnKS5mbGFnXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDln7rkuo4gdnhlLXRhYmxlIOihqOagvOeahOmAgumFjeaPkuS7tu+8jOeUqOS6juWFvOWuuSBhbnQtZGVzaWduLXZ1ZSDnu4Tku7blupNcclxuICovXHJcbmV4cG9ydCBjb25zdCBWWEVUYWJsZVBsdWdpbkFudGQgPSB7XHJcbiAgaW5zdGFsbCAoeyBpbnRlcmNlcHRvciwgcmVuZGVyZXIgfTogdHlwZW9mIFZYRVRhYmxlKSB7XHJcbiAgICByZW5kZXJlci5taXhpbihyZW5kZXJNYXApXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyRmlsdGVyJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJBY3RpdmVkJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICB9XHJcbn1cclxuXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVlhFVGFibGUpIHtcclxuICB3aW5kb3cuVlhFVGFibGUudXNlKFZYRVRhYmxlUGx1Z2luQW50ZClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5BbnRkXHJcbiJdfQ==
