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
    ons[modelEvent] = function (targetEvnt) {
      inputFunc(targetEvnt);

      if (events && events[modelEvent]) {
        events[modelEvent](params, targetEvnt);
      }

      if (isSameEvent && changeFunc) {
        changeFunc(targetEvnt);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsImNlbGxWYWx1ZSIsInVuZGVmaW5lZCIsImdldE1vZGVsUHJvcCIsInJlbmRlck9wdHMiLCJwcm9wIiwibmFtZSIsImdldE1vZGVsRXZlbnQiLCJ0eXBlIiwiZ2V0Q2hhbmdlRXZlbnQiLCJnZXRDZWxsRWRpdEZpbHRlclByb3BzIiwicGFyYW1zIiwidmFsdWUiLCJkZWZhdWx0UHJvcHMiLCJ2U2l6ZSIsIiR0YWJsZSIsIlhFVXRpbHMiLCJhc3NpZ24iLCJzaXplIiwicHJvcHMiLCJnZXRJdGVtUHJvcHMiLCIkZm9ybSIsImdldE9ucyIsImlucHV0RnVuYyIsImNoYW5nZUZ1bmMiLCJldmVudHMiLCJtb2RlbEV2ZW50IiwiY2hhbmdlRXZlbnQiLCJpc1NhbWVFdmVudCIsIm9ucyIsIm9iamVjdEVhY2giLCJmdW5jIiwia2V5IiwiYXJncyIsInRhcmdldEV2bnQiLCJnZXRFZGl0T25zIiwicm93IiwiY29sdW1uIiwic2V0IiwicHJvcGVydHkiLCJ1cGRhdGVTdGF0dXMiLCJnZXRGaWx0ZXJPbnMiLCJvcHRpb24iLCJkYXRhIiwiZ2V0SXRlbU9ucyIsIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiZWFjaCIsIml0ZW0iLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsImNlbGxUZXh0IiwiZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZSIsImdldFNlbGVjdENlbGxWYWx1ZSIsIm9wdGlvbnMiLCJvcHRpb25Hcm91cHMiLCJvcHRpb25Qcm9wcyIsIm9wdGlvbkdyb3VwUHJvcHMiLCJsYWJlbFByb3AiLCJ2YWx1ZVByb3AiLCJncm91cE9wdGlvbnMiLCJnZXQiLCJtYXAiLCJtb2RlIiwic2VsZWN0SXRlbSIsImZpbmQiLCJqb2luIiwiZ2V0Q2FzY2FkZXJDZWxsVmFsdWUiLCJzaG93QWxsTGV2ZWxzIiwic2xpY2UiLCJzZXBhcmF0b3IiLCJnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSIsImRhdGUiLCJmb3JtYXQiLCJnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlIiwidHJlZURhdGEiLCJ0cmVlQ2hlY2thYmxlIiwibWF0Y2hPYmoiLCJmaW5kVHJlZSIsInRpdGxlIiwiY3JlYXRlRWRpdFJlbmRlciIsImF0dHJzIiwib24iLCJkZWZhdWx0QnV0dG9uRWRpdFJlbmRlciIsImNvbnRlbnQiLCJkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIiLCJjaGlsZFJlbmRlck9wdHMiLCJjcmVhdGVGaWx0ZXJSZW5kZXIiLCJmaWx0ZXJzIiwib0luZGV4Iiwib3B0aW9uVmFsdWUiLCJoYW5kbGVDb25maXJtRmlsdGVyIiwiY2hlY2tlZCIsIiRwYW5lbCIsImNoYW5nZU9wdGlvbiIsImRlZmF1bHRGaWx0ZXJNZXRob2QiLCJyZW5kZXJPcHRpb25zIiwiZGlzYWJsZWRQcm9wIiwiZGlzYWJsZWQiLCJjcmVhdGVGb3JtSXRlbVJlbmRlciIsIml0ZW1WYWx1ZSIsImRlZmF1bHRCdXR0b25JdGVtUmVuZGVyIiwiZGVmYXVsdEJ1dHRvbnNJdGVtUmVuZGVyIiwiY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCIsImlzRWRpdCIsInJlbmRlclByb3BlcnR5IiwiY3JlYXRlRXhwb3J0TWV0aG9kIiwidmFsdWVNZXRob2QiLCJjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIiLCJyZW5kZXJNYXAiLCJBQXV0b0NvbXBsZXRlIiwiYXV0b2ZvY3VzIiwicmVuZGVyRGVmYXVsdCIsInJlbmRlckVkaXQiLCJyZW5kZXJGaWx0ZXIiLCJmaWx0ZXJNZXRob2QiLCJyZW5kZXJJdGVtIiwiQUlucHV0IiwiQUlucHV0TnVtYmVyIiwiQVNlbGVjdCIsImdyb3VwTGFiZWwiLCJncm91cCIsImdJbmRleCIsInNsb3QiLCJjb25jYXQiLCJyZW5kZXJDZWxsIiwiZmlsdGVyUmVuZGVyIiwiaXNBcnJheSIsImluY2x1ZGVBcnJheXMiLCJpbmRleE9mIiwiY2VsbEV4cG9ydE1ldGhvZCIsImVkaXRDZWxsRXhwb3J0TWV0aG9kIiwiQUNhc2NhZGVyIiwiQURhdGVQaWNrZXIiLCJBTW9udGhQaWNrZXIiLCJBUmFuZ2VQaWNrZXIiLCJBV2Vla1BpY2tlciIsIkFUaW1lUGlja2VyIiwiQVRyZWVTZWxlY3QiLCJBUmF0ZSIsIkFTd2l0Y2giLCJpc0Jvb2xlYW4iLCJBUmFkaW8iLCJBQ2hlY2tib3giLCJBQnV0dG9uIiwiQUJ1dHRvbnMiLCJnZXRFdmVudFRhcmdldE5vZGUiLCJldm50IiwiY29udGFpbmVyIiwiY2xhc3NOYW1lIiwidGFyZ2V0RWxlbSIsInRhcmdldCIsIm5vZGVUeXBlIiwiZG9jdW1lbnQiLCJzcGxpdCIsImZsYWciLCJwYXJlbnROb2RlIiwiaGFuZGxlQ2xlYXJFdmVudCIsImUiLCJib2R5RWxlbSIsImJvZHkiLCIkZXZlbnQiLCJWWEVUYWJsZVBsdWdpbkFudGQiLCJpbnN0YWxsIiwiaW50ZXJjZXB0b3IiLCJyZW5kZXJlciIsIm1peGluIiwiYWRkIiwid2luZG93IiwiVlhFVGFibGUiLCJ1c2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7Ozs7O0FBb0JBO0FBRUEsU0FBU0EsWUFBVCxDQUF1QkMsU0FBdkIsRUFBcUM7QUFDbkMsU0FBT0EsU0FBUyxLQUFLLElBQWQsSUFBc0JBLFNBQVMsS0FBS0MsU0FBcEMsSUFBaURELFNBQVMsS0FBSyxFQUF0RTtBQUNEOztBQUVELFNBQVNFLFlBQVQsQ0FBdUJDLFVBQXZCLEVBQWdEO0FBQzlDLE1BQUlDLElBQUksR0FBRyxPQUFYOztBQUNBLFVBQVFELFVBQVUsQ0FBQ0UsSUFBbkI7QUFDRSxTQUFLLFNBQUw7QUFDRUQsTUFBQUEsSUFBSSxHQUFHLFNBQVA7QUFDQTtBQUhKOztBQUtBLFNBQU9BLElBQVA7QUFDRDs7QUFFRCxTQUFTRSxhQUFULENBQXdCSCxVQUF4QixFQUFpRDtBQUMvQyxNQUFJSSxJQUFJLEdBQUcsUUFBWDs7QUFDQSxVQUFR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RUFBT1ksUUFBUCxFQUFpQiwrQkFBakIsQ0FBbEIsQ0FBb0VKLElBSnBFLElBS0E7QUFDQVQsRUFBQUEsa0JBQWtCLENBQUNDLElBQUQsRUFBT1ksUUFBUCxFQUFpQix1QkFBakIsQ0FBbEIsQ0FBNERKLElBUjlELEVBU0U7QUFDQSxXQUFPLEtBQVA7QUFDRDtBQUNGO0FBRUQ7Ozs7O0FBR08sSUFBTU8sa0JBQWtCLEdBQUc7QUFDaENDLEVBQUFBLE9BRGdDLHlCQUNtQjtBQUFBLFFBQXhDQyxXQUF3QyxRQUF4Q0EsV0FBd0M7QUFBQSxRQUEzQkMsUUFBMkIsUUFBM0JBLFFBQTJCO0FBQ2pEQSxJQUFBQSxRQUFRLENBQUNDLEtBQVQsQ0FBZXpELFNBQWY7QUFDQXVELElBQUFBLFdBQVcsQ0FBQ0csR0FBWixDQUFnQixtQkFBaEIsRUFBcUNWLGdCQUFyQztBQUNBTyxJQUFBQSxXQUFXLENBQUNHLEdBQVosQ0FBZ0Isb0JBQWhCLEVBQXNDVixnQkFBdEM7QUFDRDtBQUwrQixDQUEzQjs7O0FBUVAsSUFBSSxPQUFPVyxNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxNQUFNLENBQUNDLFFBQTVDLEVBQXNEO0FBQ3BERCxFQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CUixrQkFBcEI7QUFDRDs7ZUFFY0Esa0IiLCJmaWxlIjoiaW5kZXguY29tbW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuaW1wb3J0IHsgQ3JlYXRlRWxlbWVudCB9IGZyb20gJ3Z1ZSdcclxuaW1wb3J0IFhFVXRpbHMgZnJvbSAneGUtdXRpbHMvbWV0aG9kcy94ZS11dGlscydcclxuaW1wb3J0IHtcclxuICBWWEVUYWJsZSxcclxuICBSZW5kZXJQYXJhbXMsXHJcbiAgT3B0aW9uUHJvcHMsXHJcbiAgUmVuZGVyT3B0aW9ucyxcclxuICBJbnRlcmNlcHRvclBhcmFtcyxcclxuICBUYWJsZVJlbmRlclBhcmFtcyxcclxuICBDb2x1bW5GaWx0ZXJQYXJhbXMsXHJcbiAgQ29sdW1uRmlsdGVyUmVuZGVyT3B0aW9ucyxcclxuICBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucyxcclxuICBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucyxcclxuICBGb3JtSXRlbVJlbmRlck9wdGlvbnMsXHJcbiAgQ29sdW1uQ2VsbFJlbmRlclBhcmFtcyxcclxuICBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zLFxyXG4gIENvbHVtbkZpbHRlclJlbmRlclBhcmFtcyxcclxuICBDb2x1bW5GaWx0ZXJNZXRob2RQYXJhbXMsXHJcbiAgQ29sdW1uRXhwb3J0Q2VsbFJlbmRlclBhcmFtcyxcclxuICBGb3JtSXRlbVJlbmRlclBhcmFtc1xyXG59IGZyb20gJ3Z4ZS10YWJsZS9saWIvdnhlLXRhYmxlJ1xyXG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzICovXHJcblxyXG5mdW5jdGlvbiBpc0VtcHR5VmFsdWUgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gbnVsbCB8fCBjZWxsVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBjZWxsVmFsdWUgPT09ICcnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE1vZGVsUHJvcCAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucykge1xyXG4gIGxldCBwcm9wID0gJ3ZhbHVlJ1xyXG4gIHN3aXRjaCAocmVuZGVyT3B0cy5uYW1lKSB7XHJcbiAgICBjYXNlICdBU3dpdGNoJzpcclxuICAgICAgcHJvcCA9ICdjaGVja2VkJ1xyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gcHJvcFxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRNb2RlbEV2ZW50IChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zKSB7XHJcbiAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gIHN3aXRjaCAocmVuZGVyT3B0cy5uYW1lKSB7XHJcbiAgICBjYXNlICdBSW5wdXQnOlxyXG4gICAgICB0eXBlID0gJ2NoYW5nZS52YWx1ZSdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FSYWRpbyc6XHJcbiAgICBjYXNlICdBQ2hlY2tib3gnOlxyXG4gICAgICB0eXBlID0gJ2lucHV0J1xyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gdHlwZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDaGFuZ2VFdmVudCAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucykge1xyXG4gIHJldHVybiAnY2hhbmdlJ1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDZWxsRWRpdEZpbHRlclByb3BzIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IFRhYmxlUmVuZGVyUGFyYW1zLCB2YWx1ZTogYW55LCBkZWZhdWx0UHJvcHM/OiB7IFtwcm9wOiBzdHJpbmddOiBhbnkgfSkge1xyXG4gIGNvbnN0IHsgdlNpemUgfSA9IHBhcmFtcy4kdGFibGVcclxuICByZXR1cm4gWEVVdGlscy5hc3NpZ24odlNpemUgPyB7IHNpemU6IHZTaXplIH0gOiB7fSwgZGVmYXVsdFByb3BzLCByZW5kZXJPcHRzLnByb3BzLCB7IFtnZXRNb2RlbFByb3AocmVuZGVyT3B0cyldOiB2YWx1ZSB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJdGVtUHJvcHMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMsIHZhbHVlOiBhbnksIGRlZmF1bHRQcm9wcz86IHsgW3Byb3A6IHN0cmluZ106IGFueSB9KSB7XHJcbiAgY29uc3QgeyB2U2l6ZSB9ID0gcGFyYW1zLiRmb3JtXHJcbiAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKHZTaXplID8geyBzaXplOiB2U2l6ZSB9IDoge30sIGRlZmF1bHRQcm9wcywgcmVuZGVyT3B0cy5wcm9wcywgeyBbZ2V0TW9kZWxQcm9wKHJlbmRlck9wdHMpXTogdmFsdWUgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0T25zIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IFJlbmRlclBhcmFtcywgaW5wdXRGdW5jPzogRnVuY3Rpb24sIGNoYW5nZUZ1bmM/OiBGdW5jdGlvbikge1xyXG4gIGNvbnN0IHsgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgbW9kZWxFdmVudCA9IGdldE1vZGVsRXZlbnQocmVuZGVyT3B0cylcclxuICBjb25zdCBjaGFuZ2VFdmVudCA9IGdldENoYW5nZUV2ZW50KHJlbmRlck9wdHMpXHJcbiAgY29uc3QgaXNTYW1lRXZlbnQgPSBjaGFuZ2VFdmVudCA9PT0gbW9kZWxFdmVudFxyXG4gIGNvbnN0IG9uczogeyBbdHlwZTogc3RyaW5nXTogRnVuY3Rpb24gfSA9IHt9XHJcbiAgWEVVdGlscy5vYmplY3RFYWNoKGV2ZW50cywgKGZ1bmM6IEZ1bmN0aW9uLCBrZXk6IHN0cmluZykgPT4ge1xyXG4gICAgb25zW2tleV0gPSBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgZnVuYyhwYXJhbXMsIC4uLmFyZ3MpXHJcbiAgICB9XHJcbiAgfSlcclxuICBpZiAoaW5wdXRGdW5jKSB7XHJcbiAgICBvbnNbbW9kZWxFdmVudF0gPSBmdW5jdGlvbiAodGFyZ2V0RXZudDogYW55KSB7XHJcbiAgICAgIGlucHV0RnVuYyh0YXJnZXRFdm50KVxyXG4gICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1ttb2RlbEV2ZW50XSkge1xyXG4gICAgICAgIGV2ZW50c1ttb2RlbEV2ZW50XShwYXJhbXMsIHRhcmdldEV2bnQpXHJcbiAgICAgIH1cclxuICAgICAgaWYgKGlzU2FtZUV2ZW50ICYmIGNoYW5nZUZ1bmMpIHtcclxuICAgICAgICBjaGFuZ2VGdW5jKHRhcmdldEV2bnQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgaWYgKCFpc1NhbWVFdmVudCAmJiBjaGFuZ2VGdW5jKSB7XHJcbiAgICBvbnNbY2hhbmdlRXZlbnRdID0gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGNoYW5nZUZ1bmMoLi4uYXJncylcclxuICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbY2hhbmdlRXZlbnRdKSB7XHJcbiAgICAgICAgZXZlbnRzW2NoYW5nZUV2ZW50XShwYXJhbXMsIC4uLmFyZ3MpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgcmV0dXJuIG9uc1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRFZGl0T25zIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7ICR0YWJsZSwgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIHJldHVybiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zLCAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgLy8g5aSE55CGIG1vZGVsIOWAvOWPjOWQkee7keWumlxyXG4gICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIHZhbHVlKVxyXG4gIH0sICgpID0+IHtcclxuICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAkdGFibGUudXBkYXRlU3RhdHVzKHBhcmFtcylcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGaWx0ZXJPbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zLCBvcHRpb246IENvbHVtbkZpbHRlclBhcmFtcywgY2hhbmdlRnVuYzogRnVuY3Rpb24pIHtcclxuICByZXR1cm4gZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcywgKHZhbHVlOiBhbnkpID0+IHtcclxuICAgIC8vIOWkhOeQhiBtb2RlbCDlgLzlj4zlkJHnu5HlrppcclxuICAgIG9wdGlvbi5kYXRhID0gdmFsdWVcclxuICB9LCBjaGFuZ2VGdW5jKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRJdGVtT25zIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyAkZm9ybSwgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xyXG4gIHJldHVybiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zLCAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgLy8g5aSE55CGIG1vZGVsIOWAvOWPjOWQkee7keWumlxyXG4gICAgWEVVdGlscy5zZXQoZGF0YSwgcHJvcGVydHksIHZhbHVlKVxyXG4gIH0sICgpID0+IHtcclxuICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAkZm9ybS51cGRhdGVTdGF0dXMocGFyYW1zKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hdGNoQ2FzY2FkZXJEYXRhIChpbmRleDogbnVtYmVyLCBsaXN0OiBhbnlbXSwgdmFsdWVzOiBhbnlbXSwgbGFiZWxzOiBhbnlbXSkge1xyXG4gIGNvbnN0IHZhbCA9IHZhbHVlc1tpbmRleF1cclxuICBpZiAobGlzdCAmJiB2YWx1ZXMubGVuZ3RoID4gaW5kZXgpIHtcclxuICAgIFhFVXRpbHMuZWFjaChsaXN0LCAoaXRlbSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS52YWx1ZSA9PT0gdmFsKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goaXRlbS5sYWJlbClcclxuICAgICAgICBtYXRjaENhc2NhZGVyRGF0YSgrK2luZGV4LCBpdGVtLmNoaWxkcmVuLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdERhdGVQaWNrZXIgKGRlZmF1bHRGb3JtYXQ6IHN0cmluZykge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zLCBkZWZhdWx0Rm9ybWF0KSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNlbGVjdENlbGxWYWx1ZSAocmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIHByb3BzID0ge30sIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGNvbnN0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICBjb25zdCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gIGNvbnN0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmICghaXNFbXB0eVZhbHVlKGNlbGxWYWx1ZSkpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLm1hcChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnID8gY2VsbFZhbHVlIDogW2NlbGxWYWx1ZV0sIG9wdGlvbkdyb3VwcyA/ICh2YWx1ZSkgPT4ge1xyXG4gICAgICBsZXQgc2VsZWN0SXRlbVxyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb3B0aW9uR3JvdXBzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgIHNlbGVjdEl0ZW0gPSBYRVV0aWxzLmZpbmQob3B0aW9uR3JvdXBzW2luZGV4XVtncm91cE9wdGlvbnNdLCAoaXRlbSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgICBpZiAoc2VsZWN0SXRlbSkge1xyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZVxyXG4gICAgfSA6ICh2YWx1ZSkgPT4ge1xyXG4gICAgICBjb25zdCBzZWxlY3RJdGVtID0gWEVVdGlscy5maW5kKG9wdGlvbnMsIChpdGVtKSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICByZXR1cm4gc2VsZWN0SXRlbSA/IHNlbGVjdEl0ZW1bbGFiZWxQcm9wXSA6IHZhbHVlXHJcbiAgICB9KS5qb2luKCcsICcpXHJcbiAgfVxyXG4gIHJldHVybiBudWxsXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhc2NhZGVyQ2VsbFZhbHVlIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICB2YXIgdmFsdWVzID0gY2VsbFZhbHVlIHx8IFtdXHJcbiAgdmFyIGxhYmVsczogQXJyYXk8YW55PiA9IFtdXHJcbiAgbWF0Y2hDYXNjYWRlckRhdGEoMCwgcHJvcHMub3B0aW9ucywgdmFsdWVzLCBsYWJlbHMpXHJcbiAgcmV0dXJuIChwcm9wcy5zaG93QWxsTGV2ZWxzID09PSBmYWxzZSA/IGxhYmVscy5zbGljZShsYWJlbHMubGVuZ3RoIC0gMSwgbGFiZWxzLmxlbmd0aCkgOiBsYWJlbHMpLmpvaW4oYCAke3Byb3BzLnNlcGFyYXRvciB8fCAnLyd9IGApXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgY2VsbFZhbHVlID0gWEVVdGlscy5tYXAoY2VsbFZhbHVlLCAoZGF0ZSkgPT4gZGF0ZS5mb3JtYXQocHJvcHMuZm9ybWF0IHx8ICdZWVlZLU1NLUREJykpLmpvaW4oJyB+ICcpXHJcbiAgfVxyXG4gIHJldHVybiBjZWxsVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyB0cmVlRGF0YSwgdHJlZUNoZWNrYWJsZSB9ID0gcHJvcHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKCFpc0VtcHR5VmFsdWUoY2VsbFZhbHVlKSkge1xyXG4gICAgcmV0dXJuIFhFVXRpbHMubWFwKHRyZWVDaGVja2FibGUgPyBjZWxsVmFsdWUgOiBbY2VsbFZhbHVlXSwgKHZhbHVlKSA9PiB7XHJcbiAgICAgIGNvbnN0IG1hdGNoT2JqID0gWEVVdGlscy5maW5kVHJlZSh0cmVlRGF0YSwgKGl0ZW0pID0+IGl0ZW0udmFsdWUgPT09IHZhbHVlLCB7IGNoaWxkcmVuOiAnY2hpbGRyZW4nIH0pXHJcbiAgICAgIHJldHVybiBtYXRjaE9iaiA/IG1hdGNoT2JqLml0ZW0udGl0bGUgOiB2YWx1ZVxyXG4gICAgfSkuam9pbignLCAnKVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhdGVQaWNrZXJDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcyB8IENvbHVtbkV4cG9ydENlbGxSZW5kZXJQYXJhbXMsIGRlZmF1bHRGb3JtYXQ6IHN0cmluZykge1xyXG4gIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoY2VsbFZhbHVlKSB7XHJcbiAgICBjZWxsVmFsdWUgPSBjZWxsVmFsdWUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCBkZWZhdWx0Rm9ybWF0KVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUVkaXRSZW5kZXIgKGRlZmF1bHRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkVkaXRSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKHJlbmRlck9wdHMubmFtZSwge1xyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgY2VsbFZhbHVlLCBkZWZhdWx0UHJvcHMpLFxyXG4gICAgICAgIG9uOiBnZXRFZGl0T25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgfSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIHJldHVybiBbXHJcbiAgICBoKCdhLWJ1dHRvbicsIHtcclxuICAgICAgYXR0cnMsXHJcbiAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgbnVsbCksXHJcbiAgICAgIG9uOiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgfSwgY2VsbFRleHQoaCwgcmVuZGVyT3B0cy5jb250ZW50KSlcclxuICBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gIHJldHVybiByZW5kZXJPcHRzLmNoaWxkcmVuLm1hcCgoY2hpbGRSZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucykgPT4gZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIoaCwgY2hpbGRSZW5kZXJPcHRzLCBwYXJhbXMpWzBdKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGaWx0ZXJSZW5kZXIgKGRlZmF1bHRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IG5hbWUsIGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKCdkaXYnLCB7XHJcbiAgICAgICAgY2xhc3M6ICd2eGUtdGFibGUtLWZpbHRlci1pdmlldy13cmFwcGVyJ1xyXG4gICAgICB9LCBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XHJcbiAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZGF0YVxyXG4gICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlLCBkZWZhdWx0UHJvcHMpLFxyXG4gICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKHBhcmFtcywgISFvcHRpb24uZGF0YSwgb3B0aW9uKVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9KVxyXG4gICAgICB9KSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNvbmZpcm1GaWx0ZXIgKHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zLCBjaGVja2VkOiBib29sZWFuLCBvcHRpb246IENvbHVtbkZpbHRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgJHBhbmVsIH0gPSBwYXJhbXNcclxuICAkcGFuZWwuY2hhbmdlT3B0aW9uKHt9LCBjaGVja2VkLCBvcHRpb24pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXJNZXRob2QgKHBhcmFtczogQ29sdW1uRmlsdGVyTWV0aG9kUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBvcHRpb24sIHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBjb25zdCB7IGRhdGEgfSA9IG9wdGlvblxyXG4gIGNvbnN0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPT09IGRhdGFcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyT3B0aW9ucyAoaDogQ3JlYXRlRWxlbWVudCwgb3B0aW9uczogYW55W10sIG9wdGlvblByb3BzOiBPcHRpb25Qcm9wcykge1xyXG4gIGNvbnN0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICBjb25zdCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgY29uc3QgZGlzYWJsZWRQcm9wID0gb3B0aW9uUHJvcHMuZGlzYWJsZWQgfHwgJ2Rpc2FibGVkJ1xyXG4gIHJldHVybiBYRVV0aWxzLm1hcChvcHRpb25zLCAoaXRlbSwgb0luZGV4KSA9PiB7XHJcbiAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0aW9uJywge1xyXG4gICAgICBrZXk6IG9JbmRleCxcclxuICAgICAgcHJvcHM6IHtcclxuICAgICAgICB2YWx1ZTogaXRlbVt2YWx1ZVByb3BdLFxyXG4gICAgICAgIGRpc2FibGVkOiBpdGVtW2Rpc2FibGVkUHJvcF1cclxuICAgICAgfVxyXG4gICAgfSwgaXRlbVtsYWJlbFByb3BdKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNlbGxUZXh0IChoOiBDcmVhdGVFbGVtZW50LCBjZWxsVmFsdWU6IGFueSkge1xyXG4gIHJldHVybiBbJycgKyAoaXNFbXB0eVZhbHVlKGNlbGxWYWx1ZSkgPyAnJyA6IGNlbGxWYWx1ZSldXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZvcm1JdGVtUmVuZGVyIChkZWZhdWx0UHJvcHM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgeyBuYW1lIH0gPSByZW5kZXJPcHRzXHJcbiAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICBjb25zdCBpdGVtVmFsdWUgPSBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSlcclxuICAgIHJldHVybiBbXHJcbiAgICAgIGgobmFtZSwge1xyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIHByb3BzOiBnZXRJdGVtUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBpdGVtVmFsdWUsIGRlZmF1bHRQcm9wcyksXHJcbiAgICAgICAgb246IGdldEl0ZW1PbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICB9KVxyXG4gICAgXVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCBwcm9wcyA9IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG51bGwpXHJcbiAgcmV0dXJuIFtcclxuICAgIGgoJ2EtYnV0dG9uJywge1xyXG4gICAgICBhdHRycyxcclxuICAgICAgcHJvcHMsXHJcbiAgICAgIG9uOiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgfSwgY2VsbFRleHQoaCwgcmVuZGVyT3B0cy5jb250ZW50IHx8IHByb3BzLmNvbnRlbnQpKVxyXG4gIF1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEJ1dHRvbnNJdGVtUmVuZGVyIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMpIHtcclxuICByZXR1cm4gcmVuZGVyT3B0cy5jaGlsZHJlbi5tYXAoKGNoaWxkUmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zKSA9PiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlcihoLCBjaGlsZFJlbmRlck9wdHMsIHBhcmFtcylbMF0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QgKGRlZmF1bHRGb3JtYXQ6IHN0cmluZywgaXNFZGl0PzogYm9vbGVhbikge1xyXG4gIGNvbnN0IHJlbmRlclByb3BlcnR5ID0gaXNFZGl0ID8gJ2VkaXRSZW5kZXInIDogJ2NlbGxSZW5kZXInXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChwYXJhbXM6IENvbHVtbkV4cG9ydENlbGxSZW5kZXJQYXJhbXMpIHtcclxuICAgIHJldHVybiBnZXREYXRlUGlja2VyQ2VsbFZhbHVlKHBhcmFtcy5jb2x1bW5bcmVuZGVyUHJvcGVydHldLCBwYXJhbXMsIGRlZmF1bHRGb3JtYXQpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFeHBvcnRNZXRob2QgKHZhbHVlTWV0aG9kOiBGdW5jdGlvbiwgaXNFZGl0PzogYm9vbGVhbikge1xyXG4gIGNvbnN0IHJlbmRlclByb3BlcnR5ID0gaXNFZGl0ID8gJ2VkaXRSZW5kZXInIDogJ2NlbGxSZW5kZXInXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChwYXJhbXM6IENvbHVtbkV4cG9ydENlbGxSZW5kZXJQYXJhbXMpIHtcclxuICAgIHJldHVybiB2YWx1ZU1ldGhvZChwYXJhbXMuY29sdW1uW3JlbmRlclByb3BlcnR5XSwgcGFyYW1zKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyICgpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gICAgY29uc3QgeyBuYW1lLCBvcHRpb25zID0gW10sIG9wdGlvblByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IHsgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgY29uc3QgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gICAgY29uc3QgZGlzYWJsZWRQcm9wID0gb3B0aW9uUHJvcHMuZGlzYWJsZWQgfHwgJ2Rpc2FibGVkJ1xyXG4gICAgY29uc3QgaXRlbVZhbHVlID0gWEVVdGlscy5nZXQoZGF0YSwgcHJvcGVydHkpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKGAke25hbWV9R3JvdXBgLCB7XHJcbiAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgcHJvcHM6IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGl0ZW1WYWx1ZSksXHJcbiAgICAgICAgb246IGdldEl0ZW1PbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICB9LCBvcHRpb25zLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICByZXR1cm4gaChuYW1lLCB7XHJcbiAgICAgICAgICBrZXk6IG9JbmRleCxcclxuICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBvcHRpb25bdmFsdWVQcm9wXSxcclxuICAgICAgICAgICAgZGlzYWJsZWQ6IG9wdGlvbltkaXNhYmxlZFByb3BdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgb3B0aW9uW2xhYmVsUHJvcF0pXHJcbiAgICAgIH0pKVxyXG4gICAgXVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOa4suafk+WHveaVsFxyXG4gKi9cclxuY29uc3QgcmVuZGVyTWFwID0ge1xyXG4gIEFBdXRvQ29tcGxldGU6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUlucHV0OiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFJbnB1dE51bWJlcjoge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0LW51bWJlci1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdCAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gICAgICBjb25zdCB7IG9wdGlvbnMgPSBbXSwgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICAgIGNvbnN0IHByb3BzID0gZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGNlbGxWYWx1ZSlcclxuICAgICAgY29uc3Qgb24gPSBnZXRFZGl0T25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBjb25zdCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgIG9uXHJcbiAgICAgICAgICB9LCBYRVV0aWxzLm1hcChvcHRpb25Hcm91cHMsIChncm91cCwgZ0luZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBvblxyXG4gICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0U2VsZWN0Q2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyRmlsdGVyIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5GaWx0ZXJSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkZpbHRlclJlbmRlclBhcmFtcykge1xyXG4gICAgICBjb25zdCB7IG9wdGlvbnMgPSBbXSwgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICBjb25zdCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgIGNvbnN0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2RpdicsIHtcclxuICAgICAgICAgIGNsYXNzOiAndnhlLXRhYmxlLS1maWx0ZXItaXZpZXctd3JhcHBlcidcclxuICAgICAgICB9LCBvcHRpb25Hcm91cHNcclxuICAgICAgICAgID8gY29sdW1uLmZpbHRlcnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhXHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IG9JbmRleCxcclxuICAgICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKSxcclxuICAgICAgICAgICAgICBvbjogZ2V0RmlsdGVyT25zKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIocGFyYW1zLCBvcHRpb24uZGF0YSAmJiBvcHRpb24uZGF0YS5sZW5ndGggPiAwLCBvcHRpb24pXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXAsIGdJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgICApKVxyXG4gICAgICAgICAgICB9KSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICA6IGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZGF0YVxyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgICAgcHJvcHM6IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb25WYWx1ZSksXHJcbiAgICAgICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKHBhcmFtcywgb3B0aW9uLmRhdGEgJiYgb3B0aW9uLmRhdGEubGVuZ3RoID4gMCwgb3B0aW9uKVxyXG4gICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBmaWx0ZXJNZXRob2QgKHBhcmFtczogQ29sdW1uRmlsdGVyTWV0aG9kUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9uLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgICAgIGNvbnN0IHsgcHJvcGVydHksIGZpbHRlclJlbmRlcjogcmVuZGVyT3B0cyB9ID0gY29sdW1uXHJcbiAgICAgIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIHByb3BlcnR5KVxyXG4gICAgICBpZiAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJykge1xyXG4gICAgICAgIGlmIChYRVV0aWxzLmlzQXJyYXkoY2VsbFZhbHVlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIFhFVXRpbHMuaW5jbHVkZUFycmF5cyhjZWxsVmFsdWUsIGRhdGEpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhLmluZGV4T2YoY2VsbFZhbHVlKSA+IC0xXHJcbiAgICAgIH1cclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgICAgIHJldHVybiBjZWxsVmFsdWUgPT0gZGF0YVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW0gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gICAgICBjb25zdCB7IG9wdGlvbnMgPSBbXSwgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgaXRlbVZhbHVlID0gWEVVdGlscy5nZXQoZGF0YSwgcHJvcGVydHkpXHJcbiAgICAgIGNvbnN0IHByb3BzID0gZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlKVxyXG4gICAgICBjb25zdCBvbiA9IGdldEl0ZW1PbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGNvbnN0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgb25cclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIG9uXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0U2VsZWN0Q2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0U2VsZWN0Q2VsbFZhbHVlLCB0cnVlKVxyXG4gIH0sXHJcbiAgQUNhc2NhZGVyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRDYXNjYWRlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0Q2FzY2FkZXJDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRDYXNjYWRlckNlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFEYXRlUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NLUREJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTS1ERCcpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0tREQnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQU1vbnRoUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTScpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0nLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVJhbmdlUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFXZWVrUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLVdX5ZGoJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1XV+WRqCcpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktV1flkagnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVRpbWVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ0hIOm1tOnNzJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnSEg6bW06c3MnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdISDptbTpzcycsIHRydWUpXHJcbiAgfSxcclxuICBBVHJlZVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFRyZWVTZWxlY3RDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBUmF0ZToge1xyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFTd2l0Y2g6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRmlsdGVyUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgY29uc3QgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBjb25zdCB7IG5hbWUsIGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgaCgnZGl2Jywge1xyXG4gICAgICAgICAgY2xhc3M6ICd2eGUtdGFibGUtLWZpbHRlci1pdmlldy13cmFwcGVyJ1xyXG4gICAgICAgIH0sIGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcclxuICAgICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKSxcclxuICAgICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIFhFVXRpbHMuaXNCb29sZWFuKG9wdGlvbi5kYXRhKSwgb3B0aW9uKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgICAgfSlcclxuICAgICAgICB9KSlcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFSYWRpbzoge1xyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyKClcclxuICB9LFxyXG4gIEFDaGVja2JveDoge1xyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyKClcclxuICB9LFxyXG4gIEFCdXR0b246IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJJdGVtOiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlclxyXG4gIH0sXHJcbiAgQUJ1dHRvbnM6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckl0ZW06IGRlZmF1bHRCdXR0b25zSXRlbVJlbmRlclxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOajgOafpeinpuWPkea6kOaYr+WQpuWxnuS6juebruagh+iKgueCuVxyXG4gKi9cclxuZnVuY3Rpb24gZ2V0RXZlbnRUYXJnZXROb2RlIChldm50OiBhbnksIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQsIGNsYXNzTmFtZTogc3RyaW5nKSB7XHJcbiAgbGV0IHRhcmdldEVsZW1cclxuICBsZXQgdGFyZ2V0ID0gZXZudC50YXJnZXRcclxuICB3aGlsZSAodGFyZ2V0ICYmIHRhcmdldC5ub2RlVHlwZSAmJiB0YXJnZXQgIT09IGRvY3VtZW50KSB7XHJcbiAgICBpZiAoY2xhc3NOYW1lICYmIHRhcmdldC5jbGFzc05hbWUgJiYgdGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCAmJiB0YXJnZXQuY2xhc3NOYW1lLnNwbGl0KCcgJykuaW5kZXhPZihjbGFzc05hbWUpID4gLTEpIHtcclxuICAgICAgdGFyZ2V0RWxlbSA9IHRhcmdldFxyXG4gICAgfSBlbHNlIGlmICh0YXJnZXQgPT09IGNvbnRhaW5lcikge1xyXG4gICAgICByZXR1cm4geyBmbGFnOiBjbGFzc05hbWUgPyAhIXRhcmdldEVsZW0gOiB0cnVlLCBjb250YWluZXIsIHRhcmdldEVsZW06IHRhcmdldEVsZW0gfVxyXG4gICAgfVxyXG4gICAgdGFyZ2V0ID0gdGFyZ2V0LnBhcmVudE5vZGVcclxuICB9XHJcbiAgcmV0dXJuIHsgZmxhZzogZmFsc2UgfVxyXG59XHJcblxyXG4vKipcclxuICog5LqL5Lu25YW85a655oCn5aSE55CGXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVDbGVhckV2ZW50IChwYXJhbXM6IGFueSwgZTogYW55KSB7XHJcbiAgY29uc3QgYm9keUVsZW06IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuYm9keVxyXG4gIGNvbnN0IGV2bnQgPSBwYXJhbXMuJGV2ZW50IHx8IGVcclxuICBpZiAoXHJcbiAgICAvLyDkuIvmi4nmoYZcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1zZWxlY3QtZHJvcGRvd24nKS5mbGFnIHx8XHJcbiAgICAvLyDnuqfogZRcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYXNjYWRlci1tZW51cycpLmZsYWcgfHxcclxuICAgIC8vIOaXpeacn1xyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhbGVuZGFyLXBpY2tlci1jb250YWluZXInKS5mbGFnIHx8XHJcbiAgICAvLyDml7bpl7TpgInmi6lcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC10aW1lLXBpY2tlci1wYW5lbCcpLmZsYWdcclxuICApIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOWfuuS6jiB2eGUtdGFibGUg6KGo5qC855qE6YCC6YWN5o+S5Lu277yM55So5LqO5YW85a65IGFudC1kZXNpZ24tdnVlIOe7hOS7tuW6k1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFZYRVRhYmxlUGx1Z2luQW50ZCA9IHtcclxuICBpbnN0YWxsICh7IGludGVyY2VwdG9yLCByZW5kZXJlciB9OiB0eXBlb2YgVlhFVGFibGUpIHtcclxuICAgIHJlbmRlcmVyLm1peGluKHJlbmRlck1hcClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJGaWx0ZXInLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gICAgaW50ZXJjZXB0b3IuYWRkKCdldmVudC5jbGVhckFjdGl2ZWQnLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gIH1cclxufVxyXG5cclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5WWEVUYWJsZSkge1xyXG4gIHdpbmRvdy5WWEVUYWJsZS51c2UoVlhFVGFibGVQbHVnaW5BbnRkKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWWEVUYWJsZVBsdWdpbkFudGRcclxuIl19
