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

function getNativeOns(renderOpts, params) {
  var nativeEvents = renderOpts.nativeEvents;
  var nativeOns = {};

  _xeUtils["default"].objectEach(nativeEvents, function (func, key) {
    nativeOns[key] = function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      func.apply(void 0, [params].concat(args));
    };
  });

  return nativeOns;
}

function getOns(renderOpts, params, inputFunc, changeFunc) {
  var events = renderOpts.events;
  var modelEvent = getModelEvent(renderOpts);
  var changeEvent = getChangeEvent(renderOpts);
  var isSameEvent = changeEvent === modelEvent;
  var ons = {};

  _xeUtils["default"].objectEach(events, function (func, key) {
    ons[key] = function () {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
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
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
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
      on: getEditOns(renderOpts, params),
      nativeOn: getNativeOns(renderOpts, params)
    })];
  };
}

function defaultButtonEditRender(h, renderOpts, params) {
  var attrs = renderOpts.attrs;
  return [h('a-button', {
    attrs: attrs,
    props: getCellEditFilterProps(renderOpts, params, null),
    on: getOns(renderOpts, params),
    nativeOn: getNativeOns(renderOpts, params)
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
        }),
        nativeOn: getNativeOns(renderOpts, params)
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
      on: getItemOns(renderOpts, params),
      nativeOn: getNativeOns(renderOpts, params)
    })];
  };
}

function defaultButtonItemRender(h, renderOpts, params) {
  var attrs = renderOpts.attrs;
  var props = getItemProps(renderOpts, params, null);
  return [h('a-button', {
    attrs: attrs,
    props: props,
    on: getOns(renderOpts, params),
    nativeOn: getNativeOns(renderOpts, params)
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
      on: getItemOns(renderOpts, params),
      nativeOn: getNativeOns(renderOpts, params)
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
      var nativeOn = getNativeOns(renderOpts, params);

      if (optionGroups) {
        var groupOptions = optionGroupProps.options || 'options';
        var groupLabel = optionGroupProps.label || 'label';
        return [h('a-select', {
          props: props,
          attrs: attrs,
          on: on,
          nativeOn: nativeOn
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
        on: on,
        nativeOn: nativeOn
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
      var nativeOn = getNativeOns(renderOpts, params);
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
          }),
          nativeOn: nativeOn
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
          }),
          nativeOn: nativeOn
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
      var nativeOn = getNativeOns(renderOpts, params);

      if (optionGroups) {
        var groupOptions = optionGroupProps.options || 'options';
        var groupLabel = optionGroupProps.label || 'label';
        return [h('a-select', {
          attrs: attrs,
          props: props,
          on: on,
          nativeOn: nativeOn
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
        on: on,
        nativeOn: nativeOn
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
      var nativeOn = getNativeOns(renderOpts, params);
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
          }),
          nativeOn: nativeOn
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsImNlbGxWYWx1ZSIsInVuZGVmaW5lZCIsImdldE1vZGVsUHJvcCIsInJlbmRlck9wdHMiLCJwcm9wIiwibmFtZSIsImdldE1vZGVsRXZlbnQiLCJ0eXBlIiwiZ2V0Q2hhbmdlRXZlbnQiLCJnZXRDZWxsRWRpdEZpbHRlclByb3BzIiwicGFyYW1zIiwidmFsdWUiLCJkZWZhdWx0UHJvcHMiLCJ2U2l6ZSIsIiR0YWJsZSIsIlhFVXRpbHMiLCJhc3NpZ24iLCJzaXplIiwicHJvcHMiLCJnZXRJdGVtUHJvcHMiLCIkZm9ybSIsImdldE5hdGl2ZU9ucyIsIm5hdGl2ZUV2ZW50cyIsIm5hdGl2ZU9ucyIsIm9iamVjdEVhY2giLCJmdW5jIiwia2V5IiwiYXJncyIsImdldE9ucyIsImlucHV0RnVuYyIsImNoYW5nZUZ1bmMiLCJldmVudHMiLCJtb2RlbEV2ZW50IiwiY2hhbmdlRXZlbnQiLCJpc1NhbWVFdmVudCIsIm9ucyIsInRhcmdldEV2bnQiLCJnZXRFZGl0T25zIiwicm93IiwiY29sdW1uIiwic2V0IiwicHJvcGVydHkiLCJ1cGRhdGVTdGF0dXMiLCJnZXRGaWx0ZXJPbnMiLCJvcHRpb24iLCJkYXRhIiwiZ2V0SXRlbU9ucyIsIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiZWFjaCIsIml0ZW0iLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsImNlbGxUZXh0IiwiZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZSIsImdldFNlbGVjdENlbGxWYWx1ZSIsIm9wdGlvbnMiLCJvcHRpb25Hcm91cHMiLCJvcHRpb25Qcm9wcyIsIm9wdGlvbkdyb3VwUHJvcHMiLCJsYWJlbFByb3AiLCJ2YWx1ZVByb3AiLCJncm91cE9wdGlvbnMiLCJnZXQiLCJtYXAiLCJtb2RlIiwic2VsZWN0SXRlbSIsImZpbmQiLCJqb2luIiwiZ2V0Q2FzY2FkZXJDZWxsVmFsdWUiLCJzaG93QWxsTGV2ZWxzIiwic2xpY2UiLCJzZXBhcmF0b3IiLCJnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSIsImRhdGUiLCJmb3JtYXQiLCJnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlIiwidHJlZURhdGEiLCJ0cmVlQ2hlY2thYmxlIiwibWF0Y2hPYmoiLCJmaW5kVHJlZSIsInRpdGxlIiwiY3JlYXRlRWRpdFJlbmRlciIsImF0dHJzIiwib24iLCJuYXRpdmVPbiIsImRlZmF1bHRCdXR0b25FZGl0UmVuZGVyIiwiY29udGVudCIsImRlZmF1bHRCdXR0b25zRWRpdFJlbmRlciIsImNoaWxkUmVuZGVyT3B0cyIsImNyZWF0ZUZpbHRlclJlbmRlciIsImZpbHRlcnMiLCJvSW5kZXgiLCJvcHRpb25WYWx1ZSIsImhhbmRsZUNvbmZpcm1GaWx0ZXIiLCJjaGVja2VkIiwiJHBhbmVsIiwiY2hhbmdlT3B0aW9uIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsInJlbmRlck9wdGlvbnMiLCJkaXNhYmxlZFByb3AiLCJkaXNhYmxlZCIsImNyZWF0ZUZvcm1JdGVtUmVuZGVyIiwiaXRlbVZhbHVlIiwiZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXIiLCJkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXIiLCJjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kIiwiaXNFZGl0IiwicmVuZGVyUHJvcGVydHkiLCJjcmVhdGVFeHBvcnRNZXRob2QiLCJ2YWx1ZU1ldGhvZCIsImNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlciIsInJlbmRlck1hcCIsIkFBdXRvQ29tcGxldGUiLCJhdXRvZm9jdXMiLCJyZW5kZXJEZWZhdWx0IiwicmVuZGVyRWRpdCIsInJlbmRlckZpbHRlciIsImZpbHRlck1ldGhvZCIsInJlbmRlckl0ZW0iLCJBSW5wdXQiLCJBSW5wdXROdW1iZXIiLCJBU2VsZWN0IiwiZ3JvdXBMYWJlbCIsImdyb3VwIiwiZ0luZGV4Iiwic2xvdCIsImNvbmNhdCIsInJlbmRlckNlbGwiLCJlcU51bGwiLCJmaWx0ZXJSZW5kZXIiLCJpc0FycmF5IiwiaW5jbHVkZUFycmF5cyIsImluZGV4T2YiLCJjZWxsRXhwb3J0TWV0aG9kIiwiZWRpdENlbGxFeHBvcnRNZXRob2QiLCJBQ2FzY2FkZXIiLCJBRGF0ZVBpY2tlciIsIkFNb250aFBpY2tlciIsIkFSYW5nZVBpY2tlciIsIkFXZWVrUGlja2VyIiwiQVRpbWVQaWNrZXIiLCJBVHJlZVNlbGVjdCIsIkFSYXRlIiwiQVN3aXRjaCIsImlzQm9vbGVhbiIsIkFSYWRpbyIsIkFDaGVja2JveCIsIkFCdXR0b24iLCJBQnV0dG9ucyIsImdldEV2ZW50VGFyZ2V0Tm9kZSIsImV2bnQiLCJjb250YWluZXIiLCJjbGFzc05hbWUiLCJ0YXJnZXRFbGVtIiwidGFyZ2V0Iiwibm9kZVR5cGUiLCJkb2N1bWVudCIsInNwbGl0IiwiZmxhZyIsInBhcmVudE5vZGUiLCJoYW5kbGVDbGVhckV2ZW50IiwiZSIsImJvZHlFbGVtIiwiYm9keSIsIiRldmVudCIsIlZYRVRhYmxlUGx1Z2luQW50ZCIsImluc3RhbGwiLCJpbnRlcmNlcHRvciIsInJlbmRlcmVyIiwibWl4aW4iLCJhZGQiLCJ3aW5kb3ciLCJWWEVUYWJsZSIsInVzZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUVBOzs7Ozs7QUFvQkE7QUFFQSxTQUFTQSxZQUFULENBQXVCQyxTQUF2QixFQUFxQztBQUNuQyxTQUFPQSxTQUFTLEtBQUssSUFBZCxJQUFzQkEsU0FBUyxLQUFLQyxTQUFwQyxJQUFpREQsU0FBUyxLQUFLLEVBQXRFO0FBQ0Q7O0FBRUQsU0FBU0UsWUFBVCxDQUF1QkMsVUFBdkIsRUFBZ0Q7QUFDOUMsTUFBSUMsSUFBSSxHQUFHLE9BQVg7O0FBQ0EsVUFBUUQsVUFBVSxDQUFDRSxJQUFuQjtBQUNFLFNBQUssU0FBTDtBQUNFRCxNQUFBQSxJQUFJLEdBQUcsU0FBUDtBQUNBO0FBSEo7O0FBS0EsU0FBT0EsSUFBUDtBQUNEOztBQUVELFNBQVNF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Q0FBZ0IsbUJBQWhCLEVBQXFDVixnQkFBckM7QUFDQU8sSUFBQUEsV0FBVyxDQUFDRyxHQUFaLENBQWdCLG9CQUFoQixFQUFzQ1YsZ0JBQXRDO0FBQ0Q7QUFMK0IsQ0FBM0I7OztBQVFQLElBQUksT0FBT1csTUFBUCxLQUFrQixXQUFsQixJQUFpQ0EsTUFBTSxDQUFDQyxRQUE1QyxFQUFzRDtBQUNwREQsRUFBQUEsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxHQUFoQixDQUFvQlIsa0JBQXBCO0FBQ0Q7O2VBRWNBLGtCIiwiZmlsZSI6ImluZGV4LmNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXHJcbmltcG9ydCB7IENyZWF0ZUVsZW1lbnQgfSBmcm9tICd2dWUnXHJcbmltcG9ydCBYRVV0aWxzIGZyb20gJ3hlLXV0aWxzL21ldGhvZHMveGUtdXRpbHMnXHJcbmltcG9ydCB7XHJcbiAgVlhFVGFibGUsXHJcbiAgUmVuZGVyUGFyYW1zLFxyXG4gIE9wdGlvblByb3BzLFxyXG4gIFJlbmRlck9wdGlvbnMsXHJcbiAgSW50ZXJjZXB0b3JQYXJhbXMsXHJcbiAgVGFibGVSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRmlsdGVyUGFyYW1zLFxyXG4gIENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsXHJcbiAgQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsXHJcbiAgQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMsXHJcbiAgRm9ybUl0ZW1SZW5kZXJPcHRpb25zLFxyXG4gIENvbHVtbkNlbGxSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRWRpdFJlbmRlclBhcmFtcyxcclxuICBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMsXHJcbiAgQ29sdW1uRmlsdGVyTWV0aG9kUGFyYW1zLFxyXG4gIENvbHVtbkV4cG9ydENlbGxSZW5kZXJQYXJhbXMsXHJcbiAgRm9ybUl0ZW1SZW5kZXJQYXJhbXNcclxufSBmcm9tICd2eGUtdGFibGUvbGliL3Z4ZS10YWJsZSdcclxuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycyAqL1xyXG5cclxuZnVuY3Rpb24gaXNFbXB0eVZhbHVlIChjZWxsVmFsdWU6IGFueSkge1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPT09IG51bGwgfHwgY2VsbFZhbHVlID09PSB1bmRlZmluZWQgfHwgY2VsbFZhbHVlID09PSAnJ1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRNb2RlbFByb3AgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMpIHtcclxuICBsZXQgcHJvcCA9ICd2YWx1ZSdcclxuICBzd2l0Y2ggKHJlbmRlck9wdHMubmFtZSkge1xyXG4gICAgY2FzZSAnQVN3aXRjaCc6XHJcbiAgICAgIHByb3AgPSAnY2hlY2tlZCdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIHByb3BcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0TW9kZWxFdmVudCAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucykge1xyXG4gIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICBzd2l0Y2ggKHJlbmRlck9wdHMubmFtZSkge1xyXG4gICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgdHlwZSA9ICdjaGFuZ2UudmFsdWUnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBUmFkaW8nOlxyXG4gICAgY2FzZSAnQUNoZWNrYm94JzpcclxuICAgICAgdHlwZSA9ICdpbnB1dCdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIHR5cGVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2hhbmdlRXZlbnQgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMpIHtcclxuICByZXR1cm4gJ2NoYW5nZSdcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBUYWJsZVJlbmRlclBhcmFtcywgdmFsdWU6IGFueSwgZGVmYXVsdFByb3BzPzogeyBbcHJvcDogc3RyaW5nXTogYW55IH0pIHtcclxuICBjb25zdCB7IHZTaXplIH0gPSBwYXJhbXMuJHRhYmxlXHJcbiAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKHZTaXplID8geyBzaXplOiB2U2l6ZSB9IDoge30sIGRlZmF1bHRQcm9wcywgcmVuZGVyT3B0cy5wcm9wcywgeyBbZ2V0TW9kZWxQcm9wKHJlbmRlck9wdHMpXTogdmFsdWUgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SXRlbVByb3BzIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zLCB2YWx1ZTogYW55LCBkZWZhdWx0UHJvcHM/OiB7IFtwcm9wOiBzdHJpbmddOiBhbnkgfSkge1xyXG4gIGNvbnN0IHsgdlNpemUgfSA9IHBhcmFtcy4kZm9ybVxyXG4gIHJldHVybiBYRVV0aWxzLmFzc2lnbih2U2l6ZSA/IHsgc2l6ZTogdlNpemUgfSA6IHt9LCBkZWZhdWx0UHJvcHMsIHJlbmRlck9wdHMucHJvcHMsIHsgW2dldE1vZGVsUHJvcChyZW5kZXJPcHRzKV06IHZhbHVlIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE5hdGl2ZU9ucyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7IG5hdGl2ZUV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IG5hdGl2ZU9uczogeyBbdHlwZTogc3RyaW5nXTogRnVuY3Rpb24gfSA9IHt9XHJcbiAgWEVVdGlscy5vYmplY3RFYWNoKG5hdGl2ZUV2ZW50cywgKGZ1bmM6IEZ1bmN0aW9uLCBrZXk6IHN0cmluZykgPT4ge1xyXG4gICAgbmF0aXZlT25zW2tleV0gPSBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgZnVuYyhwYXJhbXMsIC4uLmFyZ3MpXHJcbiAgICB9XHJcbiAgfSlcclxuICByZXR1cm4gbmF0aXZlT25zXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldE9ucyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBSZW5kZXJQYXJhbXMsIGlucHV0RnVuYz86IEZ1bmN0aW9uLCBjaGFuZ2VGdW5jPzogRnVuY3Rpb24pIHtcclxuICBjb25zdCB7IGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IG1vZGVsRXZlbnQgPSBnZXRNb2RlbEV2ZW50KHJlbmRlck9wdHMpXHJcbiAgY29uc3QgY2hhbmdlRXZlbnQgPSBnZXRDaGFuZ2VFdmVudChyZW5kZXJPcHRzKVxyXG4gIGNvbnN0IGlzU2FtZUV2ZW50ID0gY2hhbmdlRXZlbnQgPT09IG1vZGVsRXZlbnRcclxuICBjb25zdCBvbnM6IHsgW3R5cGU6IHN0cmluZ106IEZ1bmN0aW9uIH0gPSB7fVxyXG4gIFhFVXRpbHMub2JqZWN0RWFjaChldmVudHMsIChmdW5jOiBGdW5jdGlvbiwga2V5OiBzdHJpbmcpID0+IHtcclxuICAgIG9uc1trZXldID0gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGZ1bmMocGFyYW1zLCAuLi5hcmdzKVxyXG4gICAgfVxyXG4gIH0pXHJcbiAgaWYgKGlucHV0RnVuYykge1xyXG4gICAgb25zW21vZGVsRXZlbnRdID0gZnVuY3Rpb24gKHRhcmdldEV2bnQ6IGFueSkge1xyXG4gICAgICBpbnB1dEZ1bmModGFyZ2V0RXZudClcclxuICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbbW9kZWxFdmVudF0pIHtcclxuICAgICAgICBldmVudHNbbW9kZWxFdmVudF0ocGFyYW1zLCB0YXJnZXRFdm50KVxyXG4gICAgICB9XHJcbiAgICAgIGlmIChpc1NhbWVFdmVudCAmJiBjaGFuZ2VGdW5jKSB7XHJcbiAgICAgICAgY2hhbmdlRnVuYyh0YXJnZXRFdm50KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmICghaXNTYW1lRXZlbnQgJiYgY2hhbmdlRnVuYykge1xyXG4gICAgb25zW2NoYW5nZUV2ZW50XSA9IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICBjaGFuZ2VGdW5jKC4uLmFyZ3MpXHJcbiAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW2NoYW5nZUV2ZW50XSkge1xyXG4gICAgICAgIGV2ZW50c1tjaGFuZ2VFdmVudF0ocGFyYW1zLCAuLi5hcmdzKVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIHJldHVybiBvbnNcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RWRpdE9ucyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyAkdGFibGUsIHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICByZXR1cm4gZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcywgKHZhbHVlOiBhbnkpID0+IHtcclxuICAgIC8vIOWkhOeQhiBtb2RlbCDlgLzlj4zlkJHnu5HlrppcclxuICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCB2YWx1ZSlcclxuICB9LCAoKSA9PiB7XHJcbiAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgJHRhYmxlLnVwZGF0ZVN0YXR1cyhwYXJhbXMpXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RmlsdGVyT25zIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkZpbHRlclJlbmRlclBhcmFtcywgb3B0aW9uOiBDb2x1bW5GaWx0ZXJQYXJhbXMsIGNoYW5nZUZ1bmM6IEZ1bmN0aW9uKSB7XHJcbiAgcmV0dXJuIGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAvLyDlpITnkIYgbW9kZWwg5YC85Y+M5ZCR57uR5a6aXHJcbiAgICBvcHRpb24uZGF0YSA9IHZhbHVlXHJcbiAgfSwgY2hhbmdlRnVuYylcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0SXRlbU9ucyAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBGb3JtSXRlbVJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgJGZvcm0sIGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICByZXR1cm4gZ2V0T25zKHJlbmRlck9wdHMsIHBhcmFtcywgKHZhbHVlOiBhbnkpID0+IHtcclxuICAgIC8vIOWkhOeQhiBtb2RlbCDlgLzlj4zlkJHnu5HlrppcclxuICAgIFhFVXRpbHMuc2V0KGRhdGEsIHByb3BlcnR5LCB2YWx1ZSlcclxuICB9LCAoKSA9PiB7XHJcbiAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgJGZvcm0udXBkYXRlU3RhdHVzKHBhcmFtcylcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBtYXRjaENhc2NhZGVyRGF0YSAoaW5kZXg6IG51bWJlciwgbGlzdDogYW55W10sIHZhbHVlczogYW55W10sIGxhYmVsczogYW55W10pIHtcclxuICBjb25zdCB2YWwgPSB2YWx1ZXNbaW5kZXhdXHJcbiAgaWYgKGxpc3QgJiYgdmFsdWVzLmxlbmd0aCA+IGluZGV4KSB7XHJcbiAgICBYRVV0aWxzLmVhY2gobGlzdCwgKGl0ZW0pID0+IHtcclxuICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IHZhbCkge1xyXG4gICAgICAgIGxhYmVscy5wdXNoKGl0ZW0ubGFiZWwpXHJcbiAgICAgICAgbWF0Y2hDYXNjYWRlckRhdGEoKytpbmRleCwgaXRlbS5jaGlsZHJlbiwgdmFsdWVzLCBsYWJlbHMpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXREYXRlUGlja2VyIChkZWZhdWx0Rm9ybWF0OiBzdHJpbmcpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXREYXRlUGlja2VyQ2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcywgZGVmYXVsdEZvcm1hdCkpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZWxlY3RDZWxsVmFsdWUgKHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7IG9wdGlvbnMgPSBbXSwgb3B0aW9uR3JvdXBzLCBwcm9wcyA9IHt9LCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgY29uc3QgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoIWlzRW1wdHlWYWx1ZShjZWxsVmFsdWUpKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5tYXAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJyA/IGNlbGxWYWx1ZSA6IFtjZWxsVmFsdWVdLCBvcHRpb25Hcm91cHMgPyAodmFsdWUpID0+IHtcclxuICAgICAgbGV0IHNlbGVjdEl0ZW1cclxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9wdGlvbkdyb3Vwcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICBzZWxlY3RJdGVtID0gWEVVdGlscy5maW5kKG9wdGlvbkdyb3Vwc1tpbmRleF1bZ3JvdXBPcHRpb25zXSwgKGl0ZW0pID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXHJcbiAgICAgICAgaWYgKHNlbGVjdEl0ZW0pIHtcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzZWxlY3RJdGVtID8gc2VsZWN0SXRlbVtsYWJlbFByb3BdIDogdmFsdWVcclxuICAgIH0gOiAodmFsdWUpID0+IHtcclxuICAgICAgY29uc3Qgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25zLCAoaXRlbSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZVxyXG4gICAgfSkuam9pbignLCAnKVxyXG4gIH1cclxuICByZXR1cm4gbnVsbFxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXNjYWRlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgY29uc3QgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgdmFyIHZhbHVlcyA9IGNlbGxWYWx1ZSB8fCBbXVxyXG4gIHZhciBsYWJlbHM6IEFycmF5PGFueT4gPSBbXVxyXG4gIG1hdGNoQ2FzY2FkZXJEYXRhKDAsIHByb3BzLm9wdGlvbnMsIHZhbHVlcywgbGFiZWxzKVxyXG4gIHJldHVybiAocHJvcHMuc2hvd0FsbExldmVscyA9PT0gZmFsc2UgPyBsYWJlbHMuc2xpY2UobGFiZWxzLmxlbmd0aCAtIDEsIGxhYmVscy5sZW5ndGgpIDogbGFiZWxzKS5qb2luKGAgJHtwcm9wcy5zZXBhcmF0b3IgfHwgJy8nfSBgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5DZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmIChjZWxsVmFsdWUpIHtcclxuICAgIGNlbGxWYWx1ZSA9IFhFVXRpbHMubWFwKGNlbGxWYWx1ZSwgKGRhdGUpID0+IGRhdGUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCAnWVlZWS1NTS1ERCcpKS5qb2luKCcgfiAnKVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFRyZWVTZWxlY3RDZWxsVmFsdWUgKHJlbmRlck9wdHM6IFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uQ2VsbFJlbmRlclBhcmFtcykge1xyXG4gIGNvbnN0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHsgdHJlZURhdGEsIHRyZWVDaGVja2FibGUgfSA9IHByb3BzXHJcbiAgY29uc3QgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmICghaXNFbXB0eVZhbHVlKGNlbGxWYWx1ZSkpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLm1hcCh0cmVlQ2hlY2thYmxlID8gY2VsbFZhbHVlIDogW2NlbGxWYWx1ZV0sICh2YWx1ZSkgPT4ge1xyXG4gICAgICBjb25zdCBtYXRjaE9iaiA9IFhFVXRpbHMuZmluZFRyZWUodHJlZURhdGEsIChpdGVtKSA9PiBpdGVtLnZhbHVlID09PSB2YWx1ZSwgeyBjaGlsZHJlbjogJ2NoaWxkcmVuJyB9KVxyXG4gICAgICByZXR1cm4gbWF0Y2hPYmogPyBtYXRjaE9iai5pdGVtLnRpdGxlIDogdmFsdWVcclxuICAgIH0pLmpvaW4oJywgJylcclxuICB9XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXREYXRlUGlja2VyQ2VsbFZhbHVlIChyZW5kZXJPcHRzOiBSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMgfCBDb2x1bW5FeHBvcnRDZWxsUmVuZGVyUGFyYW1zLCBkZWZhdWx0Rm9ybWF0OiBzdHJpbmcpIHtcclxuICBjb25zdCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgZGVmYXVsdEZvcm1hdClcclxuICB9XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFZGl0UmVuZGVyIChkZWZhdWx0UHJvcHM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChyZW5kZXJPcHRzLm5hbWUsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIGNlbGxWYWx1ZSwgZGVmYXVsdFByb3BzKSxcclxuICAgICAgICBvbjogZ2V0RWRpdE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpLFxyXG4gICAgICAgIG5hdGl2ZU9uOiBnZXROYXRpdmVPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICB9KVxyXG4gICAgXVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkVkaXRSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgcmV0dXJuIFtcclxuICAgIGgoJ2EtYnV0dG9uJywge1xyXG4gICAgICBhdHRycyxcclxuICAgICAgcHJvcHM6IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBudWxsKSxcclxuICAgICAgb246IGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpLFxyXG4gICAgICBuYXRpdmVPbjogZ2V0TmF0aXZlT25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgIH0sIGNlbGxUZXh0KGgsIHJlbmRlck9wdHMuY29udGVudCkpXHJcbiAgXVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkVkaXRSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICByZXR1cm4gcmVuZGVyT3B0cy5jaGlsZHJlbi5tYXAoKGNoaWxkUmVuZGVyT3B0czogQ29sdW1uRWRpdFJlbmRlck9wdGlvbnMpID0+IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyKGgsIGNoaWxkUmVuZGVyT3B0cywgcGFyYW1zKVswXSlcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRmlsdGVyUmVuZGVyIChkZWZhdWx0UHJvcHM/OiB7IFtrZXk6IHN0cmluZ106IGFueSB9KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5GaWx0ZXJSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkZpbHRlclJlbmRlclBhcmFtcykge1xyXG4gICAgY29uc3QgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgY29uc3QgeyBuYW1lLCBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaCgnZGl2Jywge1xyXG4gICAgICAgIGNsYXNzOiAndnhlLXRhYmxlLS1maWx0ZXItaXZpZXctd3JhcHBlcidcclxuICAgICAgfSwgY29sdW1uLmZpbHRlcnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcclxuICAgICAgICByZXR1cm4gaChuYW1lLCB7XHJcbiAgICAgICAgICBrZXk6IG9JbmRleCxcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgcHJvcHM6IGdldENlbGxFZGl0RmlsdGVyUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb25WYWx1ZSwgZGVmYXVsdFByb3BzKSxcclxuICAgICAgICAgIG9uOiBnZXRGaWx0ZXJPbnMocmVuZGVyT3B0cywgcGFyYW1zLCBvcHRpb24sICgpID0+IHtcclxuICAgICAgICAgICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsICEhb3B0aW9uLmRhdGEsIG9wdGlvbilcclxuICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgbmF0aXZlT246IGdldE5hdGl2ZU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgfSlcclxuICAgICAgfSkpXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVDb25maXJtRmlsdGVyIChwYXJhbXM6IENvbHVtbkZpbHRlclJlbmRlclBhcmFtcywgY2hlY2tlZDogYm9vbGVhbiwgb3B0aW9uOiBDb2x1bW5GaWx0ZXJQYXJhbXMpIHtcclxuICBjb25zdCB7ICRwYW5lbCB9ID0gcGFyYW1zXHJcbiAgJHBhbmVsLmNoYW5nZU9wdGlvbih7fSwgY2hlY2tlZCwgb3B0aW9uKVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyTWV0aG9kIChwYXJhbXM6IENvbHVtbkZpbHRlck1ldGhvZFBhcmFtcykge1xyXG4gIGNvbnN0IHsgb3B0aW9uLCByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgY29uc3QgeyBkYXRhIH0gPSBvcHRpb25cclxuICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cclxuICByZXR1cm4gY2VsbFZhbHVlID09PSBkYXRhXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlck9wdGlvbnMgKGg6IENyZWF0ZUVsZW1lbnQsIG9wdGlvbnM6IGFueVtdLCBvcHRpb25Qcm9wczogT3B0aW9uUHJvcHMpIHtcclxuICBjb25zdCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgY29uc3QgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gIGNvbnN0IGRpc2FibGVkUHJvcCA9IG9wdGlvblByb3BzLmRpc2FibGVkIHx8ICdkaXNhYmxlZCdcclxuICByZXR1cm4gWEVVdGlscy5tYXAob3B0aW9ucywgKGl0ZW0sIG9JbmRleCkgPT4ge1xyXG4gICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdGlvbicsIHtcclxuICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgdmFsdWU6IGl0ZW1bdmFsdWVQcm9wXSxcclxuICAgICAgICBkaXNhYmxlZDogaXRlbVtkaXNhYmxlZFByb3BdXHJcbiAgICAgIH1cclxuICAgIH0sIGl0ZW1bbGFiZWxQcm9wXSlcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBjZWxsVGV4dCAoaDogQ3JlYXRlRWxlbWVudCwgY2VsbFZhbHVlOiBhbnkpIHtcclxuICByZXR1cm4gWycnICsgKGlzRW1wdHlWYWx1ZShjZWxsVmFsdWUpID8gJycgOiBjZWxsVmFsdWUpXVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGb3JtSXRlbVJlbmRlciAoZGVmYXVsdFByb3BzPzogeyBba2V5OiBzdHJpbmddOiBhbnkgfSkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgICBjb25zdCB7IGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICAgIGNvbnN0IHsgbmFtZSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgY29uc3QgaXRlbVZhbHVlID0gWEVVdGlscy5nZXQoZGF0YSwgcHJvcGVydHkpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKG5hbWUsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wczogZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgaXRlbVZhbHVlLCBkZWZhdWx0UHJvcHMpLFxyXG4gICAgICAgIG9uOiBnZXRJdGVtT25zKHJlbmRlck9wdHMsIHBhcmFtcyksXHJcbiAgICAgICAgbmF0aXZlT246IGdldE5hdGl2ZU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0pXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHByb3BzID0gZ2V0SXRlbVByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgbnVsbClcclxuICByZXR1cm4gW1xyXG4gICAgaCgnYS1idXR0b24nLCB7XHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBwcm9wcyxcclxuICAgICAgb246IGdldE9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpLFxyXG4gICAgICBuYXRpdmVPbjogZ2V0TmF0aXZlT25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgIH0sIGNlbGxUZXh0KGgsIHJlbmRlck9wdHMuY29udGVudCB8fCBwcm9wcy5jb250ZW50KSlcclxuICBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25zSXRlbVJlbmRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgcmV0dXJuIHJlbmRlck9wdHMuY2hpbGRyZW4ubWFwKChjaGlsZFJlbmRlck9wdHM6IEZvcm1JdGVtUmVuZGVyT3B0aW9ucykgPT4gZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXIoaCwgY2hpbGRSZW5kZXJPcHRzLCBwYXJhbXMpWzBdKVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kIChkZWZhdWx0Rm9ybWF0OiBzdHJpbmcsIGlzRWRpdD86IGJvb2xlYW4pIHtcclxuICBjb25zdCByZW5kZXJQcm9wZXJ0eSA9IGlzRWRpdCA/ICdlZGl0UmVuZGVyJyA6ICdjZWxsUmVuZGVyJ1xyXG4gIHJldHVybiBmdW5jdGlvbiAocGFyYW1zOiBDb2x1bW5FeHBvcnRDZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgICByZXR1cm4gZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZShwYXJhbXMuY29sdW1uW3JlbmRlclByb3BlcnR5XSwgcGFyYW1zLCBkZWZhdWx0Rm9ybWF0KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRXhwb3J0TWV0aG9kICh2YWx1ZU1ldGhvZDogRnVuY3Rpb24sIGlzRWRpdD86IGJvb2xlYW4pIHtcclxuICBjb25zdCByZW5kZXJQcm9wZXJ0eSA9IGlzRWRpdCA/ICdlZGl0UmVuZGVyJyA6ICdjZWxsUmVuZGVyJ1xyXG4gIHJldHVybiBmdW5jdGlvbiAocGFyYW1zOiBDb2x1bW5FeHBvcnRDZWxsUmVuZGVyUGFyYW1zKSB7XHJcbiAgICByZXR1cm4gdmFsdWVNZXRob2QocGFyYW1zLmNvbHVtbltyZW5kZXJQcm9wZXJ0eV0sIHBhcmFtcylcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlciAoKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBGb3JtSXRlbVJlbmRlck9wdGlvbnMsIHBhcmFtczogRm9ybUl0ZW1SZW5kZXJQYXJhbXMpIHtcclxuICAgIGNvbnN0IHsgbmFtZSwgb3B0aW9ucyA9IFtdLCBvcHRpb25Qcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICBjb25zdCB7IGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgIGNvbnN0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgIGNvbnN0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICAgIGNvbnN0IGRpc2FibGVkUHJvcCA9IG9wdGlvblByb3BzLmRpc2FibGVkIHx8ICdkaXNhYmxlZCdcclxuICAgIGNvbnN0IGl0ZW1WYWx1ZSA9IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChgJHtuYW1lfUdyb3VwYCwge1xyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIHByb3BzOiBnZXRJdGVtUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBpdGVtVmFsdWUpLFxyXG4gICAgICAgIG9uOiBnZXRJdGVtT25zKHJlbmRlck9wdHMsIHBhcmFtcyksXHJcbiAgICAgICAgbmF0aXZlT246IGdldE5hdGl2ZU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0sIG9wdGlvbnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgIGtleTogb0luZGV4LFxyXG4gICAgICAgICAgcHJvcHM6IHtcclxuICAgICAgICAgICAgdmFsdWU6IG9wdGlvblt2YWx1ZVByb3BdLFxyXG4gICAgICAgICAgICBkaXNhYmxlZDogb3B0aW9uW2Rpc2FibGVkUHJvcF1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCBvcHRpb25bbGFiZWxQcm9wXSlcclxuICAgICAgfSkpXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5riy5p+T5Ye95pWwXHJcbiAqL1xyXG5jb25zdCByZW5kZXJNYXAgPSB7XHJcbiAgQUF1dG9Db21wbGV0ZToge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBSW5wdXQ6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUlucHV0TnVtYmVyOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQtbnVtYmVyLWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0IChoOiBDcmVhdGVFbGVtZW50LCByZW5kZXJPcHRzOiBDb2x1bW5FZGl0UmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5FZGl0UmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgY29uc3QgcHJvcHMgPSBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgY2VsbFZhbHVlKVxyXG4gICAgICBjb25zdCBvbiA9IGdldEVkaXRPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICBjb25zdCBuYXRpdmVPbiA9IGdldE5hdGl2ZU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcclxuICAgICAgICBjb25zdCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgY29uc3QgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBvbixcclxuICAgICAgICAgICAgbmF0aXZlT25cclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG9uLFxyXG4gICAgICAgICAgbmF0aXZlT25cclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHJlbmRlckNlbGwgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkNlbGxSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldFNlbGVjdENlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckZpbHRlciAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uRmlsdGVyUmVuZGVyT3B0aW9ucywgcGFyYW1zOiBDb2x1bW5GaWx0ZXJSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgY29uc3QgeyBvcHRpb25zID0gW10sIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgY29uc3QgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICBjb25zdCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgY29uc3QgbmF0aXZlT24gPSBnZXROYXRpdmVPbnMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2RpdicsIHtcclxuICAgICAgICAgIGNsYXNzOiAndnhlLXRhYmxlLS1maWx0ZXItaXZpZXctd3JhcHBlcidcclxuICAgICAgICB9LCBvcHRpb25Hcm91cHNcclxuICAgICAgICAgID8gY29sdW1uLmZpbHRlcnMubWFwKChvcHRpb24sIG9JbmRleCkgPT4ge1xyXG4gICAgICAgICAgICBjb25zdCBvcHRpb25WYWx1ZSA9IG9wdGlvbi5kYXRhXHJcbiAgICAgICAgICAgIGNvbnN0IHByb3BzID0gZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKVxyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgICAgLy8g5aSE55CGIGNoYW5nZSDkuovku7bnm7jlhbPpgLvovpFcclxuICAgICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIocGFyYW1zLCBwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnID8gKG9wdGlvbi5kYXRhICYmIG9wdGlvbi5kYXRhLmxlbmd0aCA+IDApIDogIVhFVXRpbHMuZXFOdWxsKG9wdGlvbi5kYXRhKSwgb3B0aW9uKVxyXG4gICAgICAgICAgICAgIH0pLFxyXG4gICAgICAgICAgICAgIG5hdGl2ZU9uXHJcbiAgICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwLCBnSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICAgKSlcclxuICAgICAgICAgICAgfSkpXHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgOiBjb2x1bW4uZmlsdGVycy5tYXAoKG9wdGlvbiwgb0luZGV4KSA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcclxuICAgICAgICAgICAgY29uc3QgcHJvcHMgPSBnZXRDZWxsRWRpdEZpbHRlclByb3BzKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uVmFsdWUpXHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IG9JbmRleCxcclxuICAgICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgICBvbjogZ2V0RmlsdGVyT25zKHJlbmRlck9wdHMsIHBhcmFtcywgb3B0aW9uLCAoKSA9PiB7XHJcbiAgICAgICAgICAgICAgICAvLyDlpITnkIYgY2hhbmdlIOS6i+S7tuebuOWFs+mAu+i+kVxyXG4gICAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScgPyAob3B0aW9uLmRhdGEgJiYgb3B0aW9uLmRhdGEubGVuZ3RoID4gMCkgOiAhWEVVdGlscy5lcU51bGwob3B0aW9uLmRhdGEpLCBvcHRpb24pXHJcbiAgICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgICAgbmF0aXZlT25cclxuICAgICAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIGZpbHRlck1ldGhvZCAocGFyYW1zOiBDb2x1bW5GaWx0ZXJNZXRob2RQYXJhbXMpIHtcclxuICAgICAgY29uc3QgeyBvcHRpb24sIHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBkYXRhIH0gPSBvcHRpb25cclxuICAgICAgY29uc3QgeyBwcm9wZXJ0eSwgZmlsdGVyUmVuZGVyOiByZW5kZXJPcHRzIH0gPSBjb2x1bW5cclxuICAgICAgY29uc3QgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGNvbnN0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgcHJvcGVydHkpXHJcbiAgICAgIGlmIChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnKSB7XHJcbiAgICAgICAgaWYgKFhFVXRpbHMuaXNBcnJheShjZWxsVmFsdWUpKSB7XHJcbiAgICAgICAgICByZXR1cm4gWEVVdGlscy5pbmNsdWRlQXJyYXlzKGNlbGxWYWx1ZSwgZGF0YSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGEuaW5kZXhPZihjZWxsVmFsdWUpID4gLTFcclxuICAgICAgfVxyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cclxuICAgICAgcmV0dXJuIGNlbGxWYWx1ZSA9PSBkYXRhXHJcbiAgICB9LFxyXG4gICAgcmVuZGVySXRlbSAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogRm9ybUl0ZW1SZW5kZXJPcHRpb25zLCBwYXJhbXM6IEZvcm1JdGVtUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgb3B0aW9ucyA9IFtdLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCB7IGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBpdGVtVmFsdWUgPSBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSlcclxuICAgICAgY29uc3QgcHJvcHMgPSBnZXRJdGVtUHJvcHMocmVuZGVyT3B0cywgcGFyYW1zLCBpdGVtVmFsdWUpXHJcbiAgICAgIGNvbnN0IG9uID0gZ2V0SXRlbU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIGNvbnN0IG5hdGl2ZU9uID0gZ2V0TmF0aXZlT25zKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGNvbnN0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBjb25zdCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIG9uLFxyXG4gICAgICAgICAgICBuYXRpdmVPblxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXAsIGdJbmRleCkgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgIGtleTogZ0luZGV4XHJcbiAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xyXG4gICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxyXG4gICAgICAgICAgICApKVxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgb24sXHJcbiAgICAgICAgICBuYXRpdmVPblxyXG4gICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFNlbGVjdENlbGxWYWx1ZSksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFNlbGVjdENlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFDYXNjYWRlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0Q2FzY2FkZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldENhc2NhZGVyQ2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0Q2FzY2FkZXJDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBRGF0ZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTS1ERCcpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0tREQnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NLUREJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFNb250aFBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTScpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0nKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFSYW5nZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogQ3JlYXRlRWxlbWVudCwgcmVuZGVyT3B0czogQ29sdW1uQ2VsbFJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRWRpdFJlbmRlclBhcmFtcykge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBV2Vla1BpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1XV+WRqCcpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktV1flkagnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLVdX5ZGoJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFUaW1lUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdISDptbTpzcycpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ0hIOm1tOnNzJyksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnSEg6bW06c3MnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVRyZWVTZWxlY3Q6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkNlbGxSZW5kZXJPcHRpb25zLCBwYXJhbXM6IENvbHVtbkVkaXRSZW5kZXJQYXJhbXMpIHtcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldFRyZWVTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFRyZWVTZWxlY3RDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVJhdGU6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBU3dpdGNoOiB7XHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXIgKGg6IENyZWF0ZUVsZW1lbnQsIHJlbmRlck9wdHM6IENvbHVtbkZpbHRlclJlbmRlck9wdGlvbnMsIHBhcmFtczogQ29sdW1uRmlsdGVyUmVuZGVyUGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgY29uc3QgeyBuYW1lLCBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBjb25zdCBuYXRpdmVPbiA9IGdldE5hdGl2ZU9ucyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgaCgnZGl2Jywge1xyXG4gICAgICAgICAgY2xhc3M6ICd2eGUtdGFibGUtLWZpbHRlci1pdmlldy13cmFwcGVyJ1xyXG4gICAgICAgIH0sIGNvbHVtbi5maWx0ZXJzLm1hcCgob3B0aW9uLCBvSW5kZXgpID0+IHtcclxuICAgICAgICAgIGNvbnN0IG9wdGlvblZhbHVlID0gb3B0aW9uLmRhdGFcclxuICAgICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgICAga2V5OiBvSW5kZXgsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBwcm9wczogZ2V0Q2VsbEVkaXRGaWx0ZXJQcm9wcyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvblZhbHVlKSxcclxuICAgICAgICAgICAgb246IGdldEZpbHRlck9ucyhyZW5kZXJPcHRzLCBwYXJhbXMsIG9wdGlvbiwgKCkgPT4ge1xyXG4gICAgICAgICAgICAgIC8vIOWkhOeQhiBjaGFuZ2Ug5LqL5Lu255u45YWz6YC76L6RXHJcbiAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIFhFVXRpbHMuaXNCb29sZWFuKG9wdGlvbi5kYXRhKSwgb3B0aW9uKVxyXG4gICAgICAgICAgICB9KSxcclxuICAgICAgICAgICAgbmF0aXZlT25cclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgfSkpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBUmFkaW86IHtcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlcigpXHJcbiAgfSxcclxuICBBQ2hlY2tib3g6IHtcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlcigpXHJcbiAgfSxcclxuICBBQnV0dG9uOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0QnV0dG9uRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVySXRlbTogZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXJcclxuICB9LFxyXG4gIEFCdXR0b25zOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJJdGVtOiBkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXJcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmo4Dmn6Xop6blj5HmupDmmK/lkKblsZ7kuo7nm67moIfoioLngrlcclxuICovXHJcbmZ1bmN0aW9uIGdldEV2ZW50VGFyZ2V0Tm9kZSAoZXZudDogYW55LCBjb250YWluZXI6IEhUTUxFbGVtZW50LCBjbGFzc05hbWU6IHN0cmluZykge1xyXG4gIGxldCB0YXJnZXRFbGVtXHJcbiAgbGV0IHRhcmdldCA9IGV2bnQudGFyZ2V0XHJcbiAgd2hpbGUgKHRhcmdldCAmJiB0YXJnZXQubm9kZVR5cGUgJiYgdGFyZ2V0ICE9PSBkb2N1bWVudCkge1xyXG4gICAgaWYgKGNsYXNzTmFtZSAmJiB0YXJnZXQuY2xhc3NOYW1lICYmIHRhcmdldC5jbGFzc05hbWUuc3BsaXQgJiYgdGFyZ2V0LmNsYXNzTmFtZS5zcGxpdCgnICcpLmluZGV4T2YoY2xhc3NOYW1lKSA+IC0xKSB7XHJcbiAgICAgIHRhcmdldEVsZW0gPSB0YXJnZXRcclxuICAgIH0gZWxzZSBpZiAodGFyZ2V0ID09PSBjb250YWluZXIpIHtcclxuICAgICAgcmV0dXJuIHsgZmxhZzogY2xhc3NOYW1lID8gISF0YXJnZXRFbGVtIDogdHJ1ZSwgY29udGFpbmVyLCB0YXJnZXRFbGVtOiB0YXJnZXRFbGVtIH1cclxuICAgIH1cclxuICAgIHRhcmdldCA9IHRhcmdldC5wYXJlbnROb2RlXHJcbiAgfVxyXG4gIHJldHVybiB7IGZsYWc6IGZhbHNlIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOS6i+S7tuWFvOWuueaAp+WkhOeQhlxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlQ2xlYXJFdmVudCAocGFyYW1zOiBJbnRlcmNlcHRvclBhcmFtcywgZTogYW55KSB7XHJcbiAgY29uc3QgYm9keUVsZW06IEhUTUxFbGVtZW50ID0gZG9jdW1lbnQuYm9keVxyXG4gIGNvbnN0IGV2bnQgPSBwYXJhbXMuJGV2ZW50IHx8IGVcclxuICBpZiAoXHJcbiAgICAvLyDkuIvmi4nmoYZcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1zZWxlY3QtZHJvcGRvd24nKS5mbGFnIHx8XHJcbiAgICAvLyDnuqfogZRcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYXNjYWRlci1tZW51cycpLmZsYWcgfHxcclxuICAgIC8vIOaXpeacn1xyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhbGVuZGFyLXBpY2tlci1jb250YWluZXInKS5mbGFnIHx8XHJcbiAgICAvLyDml7bpl7TpgInmi6lcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC10aW1lLXBpY2tlci1wYW5lbCcpLmZsYWdcclxuICApIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOWfuuS6jiB2eGUtdGFibGUg6KGo5qC855qE6YCC6YWN5o+S5Lu277yM55So5LqO5YW85a65IGFudC1kZXNpZ24tdnVlIOe7hOS7tuW6k1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFZYRVRhYmxlUGx1Z2luQW50ZCA9IHtcclxuICBpbnN0YWxsICh7IGludGVyY2VwdG9yLCByZW5kZXJlciB9OiB0eXBlb2YgVlhFVGFibGUpIHtcclxuICAgIHJlbmRlcmVyLm1peGluKHJlbmRlck1hcClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJGaWx0ZXInLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gICAgaW50ZXJjZXB0b3IuYWRkKCdldmVudC5jbGVhckFjdGl2ZWQnLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gIH1cclxufVxyXG5cclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5WWEVUYWJsZSkge1xyXG4gIHdpbmRvdy5WWEVUYWJsZS51c2UoVlhFVGFibGVQbHVnaW5BbnRkKVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBWWEVUYWJsZVBsdWdpbkFudGRcclxuIl19
