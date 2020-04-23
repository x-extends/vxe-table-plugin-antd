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
        var props = getCellEditFilterProps(renderOpts, params, optionValue);
        return h('a-select', {
          key: oIndex,
          attrs: attrs,
          props: props,
          on: getFilterOns(renderOpts, params, option, function () {
            // 处理 change 事件相关逻辑
            handleConfirmFilter(params, props.mode === 'multiple' ? option.data && option.data.length > 0 : !_xeUtils["default"].eqNull(option.data), option);
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
        var props = getCellEditFilterProps(renderOpts, params, optionValue);
        return h('a-select', {
          key: oIndex,
          attrs: attrs,
          props: props,
          on: getFilterOns(renderOpts, params, option, function () {
            // 处理 change 事件相关逻辑
            handleConfirmFilter(params, props.mode === 'multiple' ? option.data && option.data.length > 0 : !_xeUtils["default"].eqNull(option.data), option);
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsImNlbGxWYWx1ZSIsInVuZGVmaW5lZCIsImdldE1vZGVsUHJvcCIsInJlbmRlck9wdHMiLCJwcm9wIiwibmFtZSIsImdldE1vZGVsRXZlbnQiLCJ0eXBlIiwiZ2V0Q2hhbmdlRXZlbnQiLCJnZXRDZWxsRWRpdEZpbHRlclByb3BzIiwicGFyYW1zIiwidmFsdWUiLCJkZWZhdWx0UHJvcHMiLCJ2U2l6ZSIsIiR0YWJsZSIsIlhFVXRpbHMiLCJhc3NpZ24iLCJzaXplIiwicHJvcHMiLCJnZXRJdGVtUHJvcHMiLCIkZm9ybSIsImdldE9ucyIsImlucHV0RnVuYyIsImNoYW5nZUZ1bmMiLCJldmVudHMiLCJtb2RlbEV2ZW50IiwiY2hhbmdlRXZlbnQiLCJpc1NhbWVFdmVudCIsIm9ucyIsIm9iamVjdEVhY2giLCJmdW5jIiwia2V5IiwiYXJncyIsInRhcmdldEV2bnQiLCJnZXRFZGl0T25zIiwicm93IiwiY29sdW1uIiwic2V0IiwicHJvcGVydHkiLCJ1cGRhdGVTdGF0dXMiLCJnZXRGaWx0ZXJPbnMiLCJvcHRpb24iLCJkYXRhIiwiZ2V0SXRlbU9ucyIsIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiZWFjaCIsIml0ZW0iLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsImNlbGxUZXh0IiwiZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZSIsImdldFNlbGVjdENlbGxWYWx1ZSIsIm9wdGlvbnMiLCJvcHRpb25Hcm91cHMiLCJvcHRpb25Qcm9wcyIsIm9wdGlvbkdyb3VwUHJvcHMiLCJsYWJlbFByb3AiLCJ2YWx1ZVByb3AiLCJncm91cE9wdGlvbnMiLCJnZXQiLCJtYXAiLCJtb2RlIiwic2VsZWN0SXRlbSIsImZpbmQiLCJqb2luIiwiZ2V0Q2FzY2FkZXJDZWxsVmFsdWUiLCJzaG93QWxsTGV2ZWxzIiwic2xpY2UiLCJzZXBhcmF0b3IiLCJnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSIsImRhdGUiLCJmb3JtYXQiLCJnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlIiwidHJlZURhdGEiLCJ0cmVlQ2hlY2thYmxlIiwibWF0Y2hPYmoiLCJmaW5kVHJlZSIsInRpdGxlIiwiY3JlYXRlRWRpdFJlbmRlciIsImF0dHJzIiwib24iLCJkZWZhdWx0QnV0dG9uRWRpdFJlbmRlciIsImNvbnRlbnQiLCJkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIiLCJjaGlsZFJlbmRlck9wdHMiLCJjcmVhdGVGaWx0ZXJSZW5kZXIiLCJmaWx0ZXJzIiwib0luZGV4Iiwib3B0aW9uVmFsdWUiLCJoYW5kbGVDb25maXJtRmlsdGVyIiwiY2hlY2tlZCIsIiRwYW5lbCIsImNoYW5nZU9wdGlvbiIsImRlZmF1bHRGaWx0ZXJNZXRob2QiLCJyZW5kZXJPcHRpb25zIiwiZGlzYWJsZWRQcm9wIiwiZGlzYWJsZWQiLCJjcmVhdGVGb3JtSXRlbVJlbmRlciIsIml0ZW1WYWx1ZSIsImRlZmF1bHRCdXR0b25JdGVtUmVuZGVyIiwiZGVmYXVsdEJ1dHRvbnNJdGVtUmVuZGVyIiwiY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCIsImlzRWRpdCIsInJlbmRlclByb3BlcnR5IiwiY3JlYXRlRXhwb3J0TWV0aG9kIiwidmFsdWVNZXRob2QiLCJjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIiLCJyZW5kZXJNYXAiLCJBQXV0b0NvbXBsZXRlIiwiYXV0b2ZvY3VzIiwicmVuZGVyRGVmYXVsdCIsInJlbmRlckVkaXQiLCJyZW5kZXJGaWx0ZXIiLCJmaWx0ZXJNZXRob2QiLCJyZW5kZXJJdGVtIiwiQUlucHV0IiwiQUlucHV0TnVtYmVyIiwiQVNlbGVjdCIsImdyb3VwTGFiZWwiLCJncm91cCIsImdJbmRleCIsInNsb3QiLCJjb25jYXQiLCJyZW5kZXJDZWxsIiwiZXFOdWxsIiwiZmlsdGVyUmVuZGVyIiwiaXNBcnJheSIsImluY2x1ZGVBcnJheXMiLCJpbmRleE9mIiwiY2VsbEV4cG9ydE1ldGhvZCIsImVkaXRDZWxsRXhwb3J0TWV0aG9kIiwiQUNhc2NhZGVyIiwiQURhdGVQaWNrZXIiLCJBTW9udGhQaWNrZXIiLCJBUmFuZ2VQaWNrZXIiLCJBV2Vla1BpY2tlciIsIkFUaW1lUGlja2VyIiwiQVRyZWVTZWxlY3QiLCJBUmF0ZSIsIkFTd2l0Y2giLCJpc0Jvb2xlYW4iLCJBUmFkaW8iLCJBQ2hlY2tib3giLCJBQnV0dG9uIiwiQUJ1dHRvbnMiLCJnZXRFdmVudFRhcmdldE5vZGUiLCJldm50IiwiY29udGFpbmVyIiwiY2xhc3NOYW1lIiwidGFyZ2V0RWxlbSIsInRhcmdldCIsIm5vZGVUeXBlIiwiZG9jdW1lbnQiLCJzcGxpdCIsImZsYWciLCJwYXJlbnROb2RlIiwiaGFuZGxlQ2xlYXJFdmVudCIsImUiLCJib2R5RWxlbSIsImJvZHkiLCIkZXZlbnQiLCJWWEVUYWJsZVBsdWdpbkFudGQiLCJpbnN0YWxsIiwiaW50ZXJjZXB0b3IiLCJyZW5kZXJlciIsIm1peGluIiwiYWRkIiwid2luZG93IiwiVlhFVGFibGUiLCJ1c2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7QUFFQTs7Ozs7O0FBb0JBO0FBRUEsU0FBU0EsWUFBVCxDQUF1QkMsU0FBdkIsRUFBcUM7QUFDbkMsU0FBT0EsU0FBUyxLQUFLLElBQWQsSUFBc0JBLFNBQVMsS0FBS0MsU0FBcEMsSUFBaURELFNBQVMsS0FBSyxFQUF0RTtBQUNEOztBQUVELFNBQVNFLFlBQVQsQ0FBdUJDLFVBQXZCLEVBQWdEO0FBQzlDLE1BQUlDLElBQUksR0FBRyxPQUFYOztBQUNBLFVBQVFELFVBQVUsQ0FBQ0UsSUFBbkI7QUFDRSxTQUFLLFNBQUw7QUFDRUQsTUFBQUEsSUFBSSxHQUFHLFNBQVA7QUFDQTtBQUhKOztBQUtBLFNBQU9BLElBQVA7QUFDRDs7QUFFRCxTQUFTRSxhQUFULENBQXdCSCxVQUF4QixFQUFpRDtBQUMvQyxNQUFJSSxJQUFJLEdBQUcsUUFBWDs7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dmFycyAqL1xyXG5pbXBvcnQgeyBDcmVhdGVFbGVtZW50IH0gZnJvbSAndnVlJ1xyXG5pbXBvcnQgWEVVdGlscyBmcm9tICd4ZS11dGlscy9tZXRob2RzL3hlLXV0aWxzJ1xyXG5pbXBvcnQge1xyXG4gIFZYRVRhYmxlLFxyXG4gIFJlbmRlclBhcmFtcyxcclxuICBPcHRpb25Qcm9wcyxcclxuICBSZW5kZXJPcHRpb25zLFxyXG4gIEludGVyY2VwdG9yUGFyYW1zLFxyXG4gIFRhYmxlUmVuZGVyUGFyYW1zLFxyXG4gIENvbHVtbkZpbHRlclBhcmFtcyxcclxuICBDb2x1bW5GaWx0ZXJSZW5kZXJPcHRpb25zLFxyXG4gIENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLFxyXG4gIENvbHVtbkVkaXRSZW5kZXJPcHRpb25zLFxyXG4gIEZvcm1JdGVtUmVuZGVyT3B0aW9ucyxcclxuICBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zLFxyXG4gIENvbHVtbkVkaXRSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zLFxyXG4gIENvbHVtbkZpbHRlck1ldGhvZFBhcmFtcyxcclxuICBDb2x1bW5FeHBvcnRDZWxsUmVuZGVyUGFyYW1zLFxyXG4gIEZvcm1JdGVtUmVuZGVyUGFyYW1zXHJcbn0gZnJvbSAndnhlLXRhYmxlL2xpYi92eGUtdGFibGUnXHJcbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMgKi9cclxuXHJcbmZ1bmN0aW9uIGlzRW1wdHlWYWx1ZSAoY2VsbFZhbHVlOiBhbnkpIHtcclxuICByZXR1cm4gY2VsbFZhbHVlID09PSBudWxsIHx8IGNlbGxWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGNlbGxWYWx1ZSA9PT0gJydcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TW9kZWxQcm9wIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zKSB7XHJcbiAgbGV0IHByb3AgPSAndmFsdWUnXHJcbiAgc3dpdGNoIChyZW5kZXJPcHRzLm5hbWUpIHtcclxuICAgIGNhc2UgJ0FTd2l0Y2gnOlxyXG4gICAgICBwcm9wID0gJ2NoZWNrZWQnXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIHJldHVybiBwcm9wXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE1vZGVsRXZlbnQgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMpIHtcclxuICBsZXQgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgc3dpdGNoIChyZW5kZXJPcHRzLm5hbWUpIHtcclxuICAgIGNhc2UgJ0FJbnB1dCc6XHJcbiAgICAgIHR5cGUgPSAnY2hhbmdlLnZhbHVlJ1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQVJhZGlvJzpcclxuICAgIGNhc2UgJ0FDaGVja2JveCc6XHJcbiAgICAgIHR5cGUgPSAnaW5wdXQnXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIHJldHVybiB0eXBlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENoYW5nZUV2ZW50IChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zKSB7XHJcbiAgcmV0dXJuICdjaGFuZ2UnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENlbGxFZGl0RmlsdGVyUHJvcHMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogVGFibGVSZW5kZXJQYXJhbXMsIHZhbHVlOiBhbnksIGRlZmF1bHRQcm9wcz86IHsgW3Byb3A6IHN0cmluZ106IGFueSB9KSB7XHJcbiAgY29uc3QgeyB2U2l6ZSB9ID0gcGFyYW1zLiR0YWJsZVxyXG4gIHJldHVybiBYRVV0aWxzLmFzc2lnbih2U2l6ZSA/IHsgc2l6ZTogdlNpemUgfSA6IHt9LCBkZWZhdWx0UHJvcHMsIHJlbmRlck9wdHMucHJvcHMsIHsgW2dldE1vZGVsUHJvcChyZW5kZXJPcHRzKV06IHZhbHVlIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEl0ZW1Qcm9wcyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcywgdmFsdWU6IGFueSwgZGVmYXVsdFByb3BzPzogeyBbcHJvcDogc3RyaW5nXTogYW55IH0pIHtcclxuICBjb25zdCB7IHZTaXplIH0gPSBwYXJhbXMuJGZvcm1cclxuICByZXR1cm4gWEVVdGlscy5hc3NpZ24odlNpemUgPyB7IHNpemU6IHZTaXplIH0gOiB7fSwgZGVmYXVsdFByb3BzLCByZW5kZXJPcHRzLnByb3BzLCB7IFtnZXRNb2RlbFByb3AocmVuZGVyT3B0cyldOiB2YWx1ZSB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRPbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogUmVuZGVyUGFyYW1zLCBpbnB1dEZ1bmM/OiBGdW5jdGlvbiwgY2hhbmdlRnVuYz86IEZ1bmN0aW9uKSB7XHJcbiAgY29uc3QgeyBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCBtb2RlbEV2ZW50ID0gZ2V0TW9kZWxFdmVudChyZW5kZXJPcHRzKVxyXG4gIGNvbnN0IGNoYW5nZUV2ZW50ID0gZ2V0Q2hhbmdlRXZlbnQocmVuZGVyT3B0cylcclxuICBjb25zdCBpc1NhbWVFdmVudCA9IGNoYW5nZUV2ZW50ID09PSBtb2RlbEV2ZW50XHJcbiAgY29uc3Qgb25zOiB7IFt0eXBlOiBzdHJpbmddOiBGdW5jdGlvbiB9ID0ge31cclxuICBYRVV0aWxzLm9iamVjdEVhY2goZXZlbnRzLCAoZnVuYzogRnVuY3Rpb24sIGtleTogc3RyaW5nKSA9PiB7XHJcbiAgICBvbnNba2V5XSA9IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICBmdW5jKHBhcmFtcywgLi4uYXJncylcclxuICAgIH1cclxuICB9KVxyXG4gIGlmIChpbnB1dEZ1bmMpIHtcclxuICAgIG9uc1ttb2RlbEV2ZW50XSA9IGZ1bmN0aW9uICh0YXJnZXRFdm50OiBhbnkpIHtcclxuICAgICAgaW5wdXRGdW5jKHRhcmdldEV2bnQpXHJcbiAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW21vZGVsRXZlbnRdKSB7XHJcbiAgICAgICAgZXZlbnRzW21vZGVsRXZlbnRdKHBhcmFtcywgdGFyZ2V0RXZudClcclxuICAgICAgfVxyXG4gICAgICBpZiAoaXNTYW1lRXZlbnQgJiYgY2hhbmdlRnVuYykge1xyXG4gICAgICAgIGNoYW5nZUZ1bmModGFyZ2V0RXZudClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoIWlzU2FtZUV2ZW50ICYmIGNoYW5nZUZ1bmMpIHtcclxuICAgIG9uc1tjaGFuZ2VFdmVudF0gPSBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgY2hhbmdlRnVuYyguLi5hcmdzKVxyXG4gICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1tjaGFuZ2VFdmVudF0pIHtcclxuICAgICAgICBldmVudHNbY2hhbmdlRXZlbnRdKHBhcmFtcywgLi4uYXJncylcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICByZXR1cm4gb25zXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEVkaXRPbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgJHRhYmxlLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgcmV0dXJuIGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAvLyDlpITnkIYgbW9kZWwg5YC85Y+M5ZCR57uR5a6aXHJcbiAgICBYRVV0aWxzLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgdmFsdWUpXHJcbiAgfSwgKCkgPT4ge1xyXG4gICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICR0YWJsZS51cGRhdGVTdGF0dXMocGFyYW1zKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZpbHRlck9ucyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMsIG9wdGlvbjogQ29sdW1uRmlsdGVyUGFyYW1zLCBjaGFuZ2VGdW5jOiBGdW5jdGlvbikge1xyXG4gIHJldHVybiBnZXRPbnMocmVuZGVyT3B0cywgcGFyYW1zLCAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgLy8g5aSE55CGIG1vZGVsIOWAvOWPjOWQkee7keWumlxyXG4gICAgb3B0aW9uLmRhdGEgPSB2YWx1ZVxyXG4gIH0sIGNoYW5nZUZ1bmMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEl0ZW1PbnMgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7ICRmb3JtLCBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgcmV0dXJuIGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAvLyDlpITnkIYgbW9kZWwg5YC85Y+M5ZCR57uR5a6aXHJcbiAgICBYRVV0aWxzLnNldChkYXRhLCBwcm9wZXJ0eSwgdmFsdWUpXHJcbiAgfSwgKCkgPT4ge1xyXG4gICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICRmb3JtLnVwZGF0ZVN0YXR1cyhwYXJhbXMpXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gbWF0Y2hDYXNjYWRlckRhdGEgKGluZGV4OiBudW1iZXIsIGxpc3Q6IGFueVtdLCB2YWx1ZXM6IGFueVtdLCBsYWJlbHM6IGFueVtdKSB7XHJcbiAgY29uc3QgdmFsID0gdmFsdWVzW2luZGV4XVxyXG4gIGlmIChsaXN0ICYmIHZhbHVlcy5sZW5ndGggPiBpbmRleCkge1xyXG4gICAgWEVVdGlscy5lYWNoKGxpc3QsIChpdGVtKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLnZhbHVlID09PSB2YWwpIHtcclxuICAgICAgICBsYWJlbHMucHVzaChpdGVtLmxhYmVsKVxyXG4gICAgICAgIG1hdGNoQ2FzY2FkZXJEYXRhKCsraW5kZXgsIGl0ZW0uY2hpbGRyZW4sIHZhbHVlcywgbGFiZWxzKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybWF0RGF0ZVBpY2tlciAoZGVmYXVsdEZvcm1hdDogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMsIGRlZmF1bHRGb3JtYXQpKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2VsZWN0Q2VsbFZhbHVlIChyZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBvcHRpb25zID0gW10sIG9wdGlvbkdyb3VwcywgcHJvcHMgPSB7fSwgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgY29uc3QgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gIGNvbnN0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICBjb25zdCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKCFpc0VtcHR5VmFsdWUoY2VsbFZhbHVlKSkge1xyXG4gICAgcmV0dXJuIFhFVXRpbHMubWFwKHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScgPyBjZWxsVmFsdWUgOiBbY2VsbFZhbHVlXSwgb3B0aW9uR3JvdXBzID8gKHZhbHVlKSA9PiB7XHJcbiAgICAgIGxldCBzZWxlY3RJdGVtXHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvcHRpb25Hcm91cHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25Hcm91cHNbaW5kZXhdW2dyb3VwT3B0aW9uc10sIChpdGVtKSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICAgIGlmIChzZWxlY3RJdGVtKSB7XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc2VsZWN0SXRlbSA/IHNlbGVjdEl0ZW1bbGFiZWxQcm9wXSA6IHZhbHVlXHJcbiAgICB9IDogKHZhbHVlKSA9PiB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdEl0ZW0gPSBYRVV0aWxzLmZpbmQob3B0aW9ucywgKGl0ZW0pID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXHJcbiAgICAgIHJldHVybiBzZWxlY3RJdGVtID8gc2VsZWN0SXRlbVtsYWJlbFByb3BdIDogdmFsdWVcclxuICAgIH0pLmpvaW4oJywgJylcclxuICB9XHJcbiAgcmV0dXJuIG51bGxcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2FzY2FkZXJDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGNvbnN0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIHZhciB2YWx1ZXMgPSBjZWxsVmFsdWUgfHwgW11cclxuICB2YXIgbGFiZWxzOiBBcnJheTxhbnk+ID0gW11cclxuICBtYXRjaENhc2NhZGVyRGF0YSgwLCBwcm9wcy5vcHRpb25zLCB2YWx1ZXMsIGxhYmVscylcclxuICByZXR1cm4gKHByb3BzLnNob3dBbGxMZXZlbHMgPT09IGZhbHNlID8gbGFiZWxzLnNsaWNlKGxhYmVscy5sZW5ndGggLSAxLCBsYWJlbHMubGVuZ3RoKSA6IGxhYmVscykuam9pbihgICR7cHJvcHMuc2VwYXJhdG9yIHx8ICcvJ30gYClcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoY2VsbFZhbHVlKSB7XHJcbiAgICBjZWxsVmFsdWUgPSBYRVV0aWxzLm1hcChjZWxsVmFsdWUsIChkYXRlKSA9PiBkYXRlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgJ1lZWVktTU0tREQnKSkuam9pbignIH4gJylcclxuICB9XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCB7IHRyZWVEYXRhLCB0cmVlQ2hlY2thYmxlIH0gPSBwcm9wc1xyXG4gIGNvbnN0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoIWlzRW1wdHlWYWx1ZShjZWxsVmFsdWUpKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5tYXAodHJlZUNoZWNrYWJsZSA/IGNlbGxWYWx1ZSA6IFtjZWxsVmFsdWVdLCAodmFsdWUpID0+IHtcclxuICAgICAgY29uc3QgbWF0Y2hPYmogPSBYRVV0aWxzLmZpbmRUcmVlKHRyZWVEYXRhLCAoaXRlbSkgPT4gaXRlbS52YWx1ZSA9PT0gdmFsdWUsIHsgY2hpbGRyZW46ICdjaGlsZHJlbicgfSlcclxuICAgICAgcmV0dXJuIG1hdGNoT2JqID8gbWF0Y2hPYmouaXRlbS50aXRsZSA6IHZhbHVlXHJcbiAgICB9KS5qb2luKCcsICcpXHJcbiAgfVxyXG4gIHJldHVybiBjZWxsVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zIHwgQ29sdW1uRXhwb3J0Q2VsbFJlbmRlclBhcmFtcywgZGVmYXVsdEZvcm1hdDogc3RyaW5nKSB7XHJcbiAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmIChjZWxsVmFsdWUpIHtcclxuICAgIGNlbGxWYWx1ZSA9IGNlbGxWYWx1ZS5mb3JtYXQocHJvcHMuZm9ybWF0IHx8IGRlZmF1bHRGb3JtYXQpXHJcbiAgfVxyXG4gIHJldHVybiBjZWxsVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRWRpdFJlbmRlciAoZGVmYXVsdFByb3BzPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gICAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgIHJldHVybiBbXHJcbiAgICAgIGgocmVuZGVyT3B0cy5uYW1lLCB7XHJcbiAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgcHJvcHM6IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBjZWxsVmFsdWUsIGRlZmF1bHRQcm9wcyksXHJcbiAgICAgICAgb246IGdldEVkaXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICB9KVxyXG4gICAgXVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkVkaXRSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgcmV0dXJuIFtcclxuICAgIGgoJ2EtYnV0dG9uJywge1xyXG4gICAgICBhdHRycyxcclxuICAgICAgcHJvcHM6IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBudWxsKSxcclxuICAgICAgb246IGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICB9LCBjZWxsVGV4dChoLCByZW5kZXJPcHRzLmNvbnRlbnQpKVxyXG4gIF1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEJ1dHRvbnNFZGl0UmVuZGVyIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgcmV0dXJuIHJlbmRlck9wdHMuY2hpbGRyZW4ubWFwKChjaGlsZFJlbmRlck9wdHM6IENvbHVtbkVkaXRSZW5kZXJPcHRpb25zKSA9PiBkZWZhdWx0QnV0dG9uRWRpdFJlbmRlcihoLCBjaGlsZFJlbmRlck9wdHMsIHBhcmFtcylbMF0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZpbHRlclJlbmRlciAoZGVmYXVsdFByb3BzPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRmlsdGVyUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgIGNvbnN0IHsgbmFtZSwgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgIHJldHVybiBbXHJcbiAgICAgIGgoJ2RpdicsIHtcclxuICAgICAgICBjbGFzczogJ3Z4ZS10YWJsZS0tZmlsdGVyLWl2aWV3LXdyYXBwZXInXHJcbiAgICAgIH0sIGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhXHJcbiAgICAgICAgcmV0dXJuIGgobmFtZSwge1xyXG4gICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIHByb3BzOiBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uVmFsdWUsIGRlZmF1bHRQcm9wcyksXHJcbiAgICAgICAgICBvbjogZ2V0RmlsdGVyT25zKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uLCAoKSA9PiB7XHJcbiAgICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIocGFyYW1zLCAhIW9wdGlvbi5kYXRhLCBvcHRpb24pXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH0pKVxyXG4gICAgXVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ29uZmlybUZpbHRlciAocGFyYW1zOiBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMsIGNoZWNrZWQ6IGJvb2xlYW4sIG9wdGlvbjogQ29sdW1uRmlsdGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyAkcGFuZWwgfSA9IHBhcmFtc1xyXG4gICRwYW5lbC5jaGFuZ2VPcHRpb24oe30sIGNoZWNrZWQsIG9wdGlvbilcclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEZpbHRlck1ldGhvZCAocGFyYW1zOiBDb2x1bW5GaWx0ZXJNZXRob2RQYXJhbXMpIHtcclxuICBjb25zdCB7IG9wdGlvbiwgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGNvbnN0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gZGF0YVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJPcHRpb25zIChoOiBDcmVhdGVFbGVtZW50LCBvcHRpb25zOiBhbnlbXSwgb3B0aW9uUHJvcHM6IE9wdGlvblByb3BzKSB7XHJcbiAgY29uc3QgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gIGNvbnN0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICBjb25zdCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgcmV0dXJuIFhFVXRpbHMubWFwKG9wdGlvbnMsIChpdGVtLCBvSW5kZXgpID0+IHtcclxuICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHRpb24nLCB7XHJcbiAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICBwcm9wczoge1xyXG4gICAgICAgIHZhbHVlOiBpdGVtW3ZhbHVlUHJvcF0sXHJcbiAgICAgICAgZGlzYWJsZWQ6IGl0ZW1bZGlzYWJsZWRQcm9wXVxyXG4gICAgICB9XHJcbiAgICB9LCBpdGVtW2xhYmVsUHJvcF0pXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2VsbFRleHQgKGg6IENyZWF0ZUVsZW1lbnQsIGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgcmV0dXJuIFsnJyArIChpc0VtcHR5VmFsdWUoY2VsbFZhbHVlKSA/ICcnIDogY2VsbFZhbHVlKV1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRm9ybUl0ZW1SZW5kZXIgKGRlZmF1bHRQcm9wcz86IHsgW2tleTogc3RyaW5nXTogYW55IH0pIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IG5hbWUgfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChuYW1lLCB7XHJcbiAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgcHJvcHM6IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGl0ZW1WYWx1ZSwgZGVmYXVsdFByb3BzKSxcclxuICAgICAgICBvbjogZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0pXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHByb3BzID0gZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgbnVsbClcclxuICByZXR1cm4gW1xyXG4gICAgaCgnYS1idXR0b24nLCB7XHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBwcm9wcyxcclxuICAgICAgb246IGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICB9LCBjZWxsVGV4dChoLCByZW5kZXJPcHRzLmNvbnRlbnQgfHwgcHJvcHMuY29udGVudCkpXHJcbiAgXVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gIHJldHVybiByZW5kZXJPcHRzLmNoaWxkcmVuLm1hcCgoY2hpbGRSZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMpID0+IGRlZmF1bHRCdXR0b25JdGVtUmVuZGVyKGgsIGNoaWxkUmVuZGVyT3B0cywgcGFyYW1zKVswXSlcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCAoZGVmYXVsdEZvcm1hdDogc3RyaW5nLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogQ29sdW1uRXhwb3J0Q2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgcmV0dXJuIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocGFyYW1zLmNvbHVtbltyZW5kZXJQcm9wZXJ0eV0sIHBhcmFtcywgZGVmYXVsdEZvcm1hdClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUV4cG9ydE1ldGhvZCAodmFsdWVNZXRob2Q6IEZ1bmN0aW9uLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogQ29sdW1uRXhwb3J0Q2VsbFJlbmRlclBhcmFtcykge1xyXG4gICAgcmV0dXJuIHZhbHVlTWV0aG9kKHBhcmFtcy5jb2x1bW5bcmVuZGVyUHJvcGVydHldLCBwYXJhbXMpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIgKCkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IG5hbWUsIG9wdGlvbnMgPSBbXSwgb3B0aW9uUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICBjb25zdCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgICBjb25zdCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgICBjb25zdCBpdGVtVmFsdWUgPSBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSlcclxuICAgIHJldHVybiBbXHJcbiAgICAgIGgoYCR7bmFtZX1Hcm91cGAsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlKSxcclxuICAgICAgICBvbjogZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0sIG9wdGlvbnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgdmFsdWU6IG9wdGlvblt2YWx1ZVByb3BdLFxyXG4gICAgICAgICAgICBkaXNhYmxlZDogb3B0aW9uW2Rpc2FibGVkUHJvcF1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBvcHRpb25bbGFiZWxQcm9wXSlcclxuICAgICAgfSkpXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5riy5p+T5Ye95pWwXHJcbiAqL1xyXG5jb25zdCByZW5kZXJNYXAgPSB7XHJcbiAgQUF1dG9Db21wbGV0ZToge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBSW5wdXQ6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUlucHV0TnVtYmVyOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQtbnVtYmVyLWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0IChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgY29uc3QgcHJvcHMgPSBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgY2VsbFZhbHVlKVxyXG4gICAgICBjb25zdCBvbiA9IGdldEVkaXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgY29uc3QgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGNvbnN0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgb25cclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG9uXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZW5kZXJDZWxsIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5DZWxsUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJGaWx0ZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgIGNvbnN0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgY29uc3QgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgaCgnZGl2Jywge1xyXG4gICAgICAgICAgY2xhc3M6ICd2eGUtdGFibGUtLWZpbHRlci1pdmlldy13cmFwcGVyJ1xyXG4gICAgICAgIH0sIG9wdGlvbkdyb3Vwc1xyXG4gICAgICAgICAgPyBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcclxuICAgICAgICAgICAgY29uc3QgcHJvcHMgPSBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uVmFsdWUpXHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IG9JbmRleCxcclxuICAgICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgICBvbjogZ2V0RmlsdGVyT25zKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScgPyAob3B0aW9uLmRhdGEgJiYgb3B0aW9uLmRhdGEubGVuZ3RoID4gMCkgOiAhWEVVdGlscy5lcU51bGwob3B0aW9uLmRhdGEpLCBvcHRpb24pXHJcbiAgICAgICAgICAgICAgfSlcclxuICAgICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXAsIGdJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgICApKVxyXG4gICAgICAgICAgICB9KSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICA6IGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgY29uc3Qgb3B0aW9uVmFsdWUgPSBvcHRpb24uZGF0YVxyXG4gICAgICAgICAgICBjb25zdCBwcm9wcyA9IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb25WYWx1ZSlcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcclxuICAgICAgICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKHBhcmFtcywgcHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJyA/IChvcHRpb24uZGF0YSAmJiBvcHRpb24uZGF0YS5sZW5ndGggPiAwKSA6ICFYRVV0aWxzLmVxTnVsbChvcHRpb24uZGF0YSksIG9wdGlvbilcclxuICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyTWV0aG9kIChwYXJhbXM6IENvbHVtbkZpbHRlck1ldGhvZFBhcmFtcykge1xyXG4gICAgICBjb25zdCB7IG9wdGlvbiwgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBjb25zdCB7IGRhdGEgfSA9IG9wdGlvblxyXG4gICAgICBjb25zdCB7IHByb3BlcnR5LCBmaWx0ZXJSZW5kZXI6IHJlbmRlck9wdHMgfSA9IGNvbHVtblxyXG4gICAgICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBwcm9wZXJ0eSlcclxuICAgICAgaWYgKHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScpIHtcclxuICAgICAgICBpZiAoWEVVdGlscy5pc0FycmF5KGNlbGxWYWx1ZSkpIHtcclxuICAgICAgICAgIHJldHVybiBYRVV0aWxzLmluY2x1ZGVBcnJheXMoY2VsbFZhbHVlLCBkYXRhKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YS5pbmRleE9mKGNlbGxWYWx1ZSkgPiAtMVxyXG4gICAgICB9XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xyXG4gICAgICByZXR1cm4gY2VsbFZhbHVlID09IGRhdGFcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMpIHtcclxuICAgICAgY29uc3QgeyBvcHRpb25zID0gW10sIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGNvbnN0IHsgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xyXG4gICAgICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KVxyXG4gICAgICBjb25zdCBwcm9wcyA9IGdldEl0ZW1Qcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGl0ZW1WYWx1ZSlcclxuICAgICAgY29uc3Qgb24gPSBnZXRJdGVtT25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBjb25zdCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIG9uXHJcbiAgICAgICAgICB9LCBYRVV0aWxzLm1hcChvcHRpb25Hcm91cHMsIChncm91cCwgZ0luZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBvblxyXG4gICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFNlbGVjdENlbGxWYWx1ZSksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFNlbGVjdENlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFDYXNjYWRlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0Q2FzY2FkZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldENhc2NhZGVyQ2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0Q2FzY2FkZXJDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBRGF0ZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTS1ERCcpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0tREQnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NLUREJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFNb250aFBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTScpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0nKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFSYW5nZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBV2Vla1BpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1XV+WRqCcpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktV1flkagnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLVdX5ZGoJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFUaW1lUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdISDptbTpzcycpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ0hIOm1tOnNzJyksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnSEg6bW06c3MnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVRyZWVTZWxlY3Q6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldFRyZWVTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFRyZWVTZWxlY3RDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVJhdGU6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBU3dpdGNoOiB7XHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBuYW1lLCBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2RpdicsIHtcclxuICAgICAgICAgIGNsYXNzOiAndnhlLXRhYmxlLS1maWx0ZXItaXZpZXctd3JhcHBlcidcclxuICAgICAgICB9LCBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhXHJcbiAgICAgICAgICByZXR1cm4gaChuYW1lLCB7XHJcbiAgICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgcHJvcHM6IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb25WYWx1ZSksXHJcbiAgICAgICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcclxuICAgICAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIocGFyYW1zLCBYRVV0aWxzLmlzQm9vbGVhbihvcHRpb24uZGF0YSksIG9wdGlvbilcclxuICAgICAgICAgICAgfSlcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSkpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBUmFkaW86IHtcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlcigpXHJcbiAgfSxcclxuICBBQ2hlY2tib3g6IHtcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlcigpXHJcbiAgfSxcclxuICBBQnV0dG9uOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0QnV0dG9uRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVySXRlbTogZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXJcclxuICB9LFxyXG4gIEFCdXR0b25zOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJJdGVtOiBkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXJcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmo4Dmn6Xop6blj5HmupDmmK/lkKblsZ7kuo7nm67moIfoioLngrlcclxuICovXHJcbmZ1bmN0aW9uIGdldEV2ZW50VGFyZ2V0Tm9kZSAoZXZudDogYW55LCBjb250YWluZXI6IEhUTUxFbGVtZW50LCBjbGFzc05hbWU6IHN0cmluZykge1xyXG4gIGxldCB0YXJnZXRFbGVtXHJcbiAgbGV0IHRhcmdldCA9IGV2bnQudGFyZ2V0XHJcbiAgd2hpbGUgKHRhcmdldCAmJiB0YXJnZXQubm9kZVR5cGUgJiYgdGFyZ2V0ICE9PSBkb2N1bWVudCkge1xyXG4gICAgaWYgKGNsYXNzTmFtZSAmJiB0YXJnZXQuY2xhc3NOYW1lICYmIHRhcmdldC5jbGFzc05hbWUuc3BsaXQgJiYgdGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCgnICcpLmluZGV4T2YoY2xhc3NOYW1lKSA+IC0xKSB7XHJcbiAgICAgIHRhcmdldEVsZW0gPSB0YXJnZXRcclxuICAgIH0gZWxzZSBpZiAodGFyZ2V0ID09PSBjb250YWluZXIpIHtcclxuICAgICAgcmV0dXJuIHsgZmxhZzogY2xhc3NOYW1lID8gISF0YXJnZXRFbGVtIDogdHJ1ZSwgY29udGFpbmVyLCB0YXJnZXRFbGVtOiB0YXJnZXRFbGVtIH1cclxuICAgIH1cclxuICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlXHJcbiAgfVxyXG4gIHJldHVybiB7IGZsYWc6IGZhbHNlIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOS6i+S7tuWFvOWuueaAp+WkhOeQhlxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlQ2xlYXJFdmVudCAocGFyYW1zOiBhbnksIGU6IGFueSkge1xyXG4gIGNvbnN0IGJvZHlFbGVtOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmJvZHlcclxuICBjb25zdCBldm50ID0gcGFyYW1zLiRldmVudCB8fCBlXHJcbiAgaWYgKFxyXG4gICAgLy8g5LiL5ouJ5qGGXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtc2VsZWN0LWRyb3Bkb3duJykuZmxhZyB8fFxyXG4gICAgLy8g57qn6IGUXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FzY2FkZXItbWVudXMnKS5mbGFnIHx8XHJcbiAgICAvLyDml6XmnJ9cclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYWxlbmRhci1waWNrZXItY29udGFpbmVyJykuZmxhZyB8fFxyXG4gICAgLy8g5pe26Ze06YCJ5oupXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtdGltZS1waWNrZXItcGFuZWwnKS5mbGFnXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDln7rkuo4gdnhlLXRhYmxlIOihqOagvOeahOmAgumFjeaPkuS7tu+8jOeUqOS6juWFvOWuuSBhbnQtZGVzaWduLXZ1ZSDnu4Tku7blupNcclxuICovXHJcbmV4cG9ydCBjb25zdCBWWEVUYWJsZVBsdWdpbkFudGQgPSB7XHJcbiAgaW5zdGFsbCAoeyBpbnRlcmNlcHRvciwgcmVuZGVyZXIgfTogdHlwZW9mIFZYRVRhYmxlKSB7XHJcbiAgICByZW5kZXJlci5taXhpbihyZW5kZXJNYXApXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyRmlsdGVyJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJBY3RpdmVkJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICB9XHJcbn1cclxuXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVlhFVGFibGUpIHtcclxuICB3aW5kb3cuVlhFVGFibGUudXNlKFZYRVRhYmxlUGx1Z2luQW50ZClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5BbnRkXHJcbiJdfQ==
