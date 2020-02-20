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

function getProps(_ref, _ref2, defaultProps) {
  var $table = _ref.$table;
  var props = _ref2.props;
  return _xeUtils["default"].assign($table.vSize ? {
    size: $table.vSize
  } : {}, defaultProps, props);
}

function getCellEvents(renderOpts, params) {
  var name = renderOpts.name,
      events = renderOpts.events;
  var $table = params.$table;
  var type = 'change';

  switch (name) {
    case 'AAutoComplete':
      type = 'select';
      break;

    case 'AInput':
      type = 'input';
      break;

    case 'AInputNumber':
      type = 'change';
      break;
  }

  var on = _defineProperty({}, type, function (evnt) {
    $table.updateStatus(params);

    if (events && events[type]) {
      events[type](params, evnt);
    }
  });

  if (events) {
    return _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        cb.apply(null, [params].concat.apply(params, args));
      };
    }), on);
  }

  return on;
}

function getSelectCellValue(renderOpts, params) {
  var options = renderOpts.options,
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
    }).join(';');
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
    var props = getProps(params, renderOpts, defaultProps);
    return [h(renderOpts.name, {
      props: props,
      attrs: attrs,
      model: {
        value: _xeUtils["default"].get(row, column.property),
        callback: function callback(value) {
          _xeUtils["default"].set(row, column.property, value);
        }
      },
      on: getCellEvents(renderOpts, params)
    })];
  };
}

function getFilterEvents(on, renderOpts, params) {
  var events = renderOpts.events;

  if (events) {
    return _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
      return function () {
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        cb.apply(null, [params].concat(args));
      };
    }), on);
  }

  return on;
}

function createFilterRender(defaultProps) {
  return function (h, renderOpts, params, context) {
    var column = params.column;
    var name = renderOpts.name,
        attrs = renderOpts.attrs,
        events = renderOpts.events;
    var props = getProps(params, renderOpts);
    var type = 'change';

    switch (name) {
      case 'AAutoComplete':
        type = 'select';
        break;

      case 'AInput':
        type = 'input';
        break;

      case 'AInputNumber':
        type = 'change';
        break;
    }

    return column.filters.map(function (item) {
      return h(name, {
        props: props,
        attrs: attrs,
        model: {
          value: item.data,
          callback: function callback(optionValue) {
            item.data = optionValue;
          }
        },
        on: getFilterEvents(_defineProperty({}, type, function (evnt) {
          handleConfirmFilter(params, column, !!item.data, item);

          if (events && events[type]) {
            events[type](params, evnt);
          }
        }), renderOpts, params)
      });
    });
  };
}

function handleConfirmFilter(params, column, checked, item) {
  var $panel = params.$panel || params.context;
  $panel[column.filterMultiple ? 'changeMultipleOption' : 'changeRadioOption']({}, checked, item);
}

function defaultFilterMethod(_ref3) {
  var option = _ref3.option,
      row = _ref3.row,
      column = _ref3.column;
  var data = option.data;

  var cellValue = _xeUtils["default"].get(row, column.property);
  /* eslint-disable eqeqeq */


  return cellValue === data;
}

function renderOptions(h, options, optionProps) {
  var labelProp = optionProps.label || 'label';
  var valueProp = optionProps.value || 'value';
  var disabledProp = optionProps.disabled || 'disabled';
  return _xeUtils["default"].map(options, function (item, index) {
    return h('a-select-option', {
      props: {
        value: item[valueProp],
        disabled: item[disabledProp]
      },
      key: index
    }, item[labelProp]);
  });
}

function cellText(h, cellValue) {
  return ['' + (isEmptyValue(cellValue) ? '' : cellValue)];
}

function createFormItemRender(defaultProps) {
  return function (h, renderOpts, params, context) {
    var data = params.data,
        property = params.property;
    var name = renderOpts.name;
    var attrs = renderOpts.attrs;
    var props = getFormProps(params, renderOpts, defaultProps);
    return [h(name, {
      attrs: attrs,
      props: props,
      model: {
        value: _xeUtils["default"].get(data, property),
        callback: function callback(value) {
          _xeUtils["default"].set(data, property, value);
        }
      },
      on: getFormEvents(renderOpts, params)
    })];
  };
}

function getFormProps(_ref4, _ref5, defaultProps) {
  var $form = _ref4.$form;
  var props = _ref5.props;
  return _xeUtils["default"].assign($form.vSize ? {
    size: $form.vSize
  } : {}, defaultProps, props);
}

function getFormEvents(renderOpts, params) {
  var events = renderOpts.events;
  var $form = params.$form;
  var type = 'change';

  switch (name) {
    case 'AAutoComplete':
      type = 'select';
      break;

    case 'AInput':
      type = 'input';
      break;

    case 'AInputNumber':
      type = 'change';
      break;
  }

  var on = _defineProperty({}, type, function (evnt) {
    $form.updateStatus(params);

    if (events && events[type]) {
      events[type](params, evnt);
    }
  });

  if (events) {
    return _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
      return function () {
        for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
          args[_key3] = arguments[_key3];
        }

        cb.apply(null, [params].concat.apply(params, args));
      };
    }), on);
  }

  return on;
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
  return function (h, renderOpts, params, context) {
    var name = renderOpts.name,
        options = renderOpts.options,
        _renderOpts$optionPro2 = renderOpts.optionProps,
        optionProps = _renderOpts$optionPro2 === void 0 ? {} : _renderOpts$optionPro2;
    var data = params.data,
        property = params.property;
    var attrs = renderOpts.attrs;
    var props = getFormProps(params, renderOpts);
    var labelProp = optionProps.label || 'label';
    var valueProp = optionProps.value || 'value';
    var disabledProp = optionProps.disabled || 'disabled';
    return [h("".concat(name, "Group"), {
      props: props,
      attrs: attrs,
      model: {
        value: _xeUtils["default"].get(data, property),
        callback: function callback(cellValue) {
          _xeUtils["default"].set(data, property, cellValue);
        }
      },
      on: getFormEvents(renderOpts, params)
    }, options.map(function (option) {
      return h(name, {
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
      var options = renderOpts.options,
          optionGroups = renderOpts.optionGroups,
          _renderOpts$optionPro3 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro3 === void 0 ? {} : _renderOpts$optionPro3,
          _renderOpts$optionGro2 = renderOpts.optionGroupProps,
          optionGroupProps = _renderOpts$optionGro2 === void 0 ? {} : _renderOpts$optionGro2;
      var row = params.row,
          column = params.column;
      var attrs = renderOpts.attrs;
      var props = getProps(params, renderOpts);

      if (optionGroups) {
        var groupOptions = optionGroupProps.options || 'options';
        var groupLabel = optionGroupProps.label || 'label';
        return [h('a-select', {
          props: props,
          attrs: attrs,
          model: {
            value: _xeUtils["default"].get(row, column.property),
            callback: function callback(cellValue) {
              _xeUtils["default"].set(row, column.property, cellValue);
            }
          },
          on: getCellEvents(renderOpts, params)
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
        model: {
          value: _xeUtils["default"].get(row, column.property),
          callback: function callback(cellValue) {
            _xeUtils["default"].set(row, column.property, cellValue);
          }
        },
        on: getCellEvents(renderOpts, params)
      }, renderOptions(h, options, optionProps))];
    },
    renderCell: function renderCell(h, renderOpts, params) {
      return cellText(h, getSelectCellValue(renderOpts, params));
    },
    renderFilter: function renderFilter(h, renderOpts, params, context) {
      var options = renderOpts.options,
          optionGroups = renderOpts.optionGroups,
          _renderOpts$optionPro4 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro4 === void 0 ? {} : _renderOpts$optionPro4,
          _renderOpts$optionGro3 = renderOpts.optionGroupProps,
          optionGroupProps = _renderOpts$optionGro3 === void 0 ? {} : _renderOpts$optionGro3;
      var column = params.column;
      var attrs = renderOpts.attrs,
          events = renderOpts.events;
      var props = getProps(params, renderOpts);
      var type = 'change';

      if (optionGroups) {
        var groupOptions = optionGroupProps.options || 'options';
        var groupLabel = optionGroupProps.label || 'label';
        return column.filters.map(function (item) {
          return h('a-select', {
            props: props,
            attrs: attrs,
            model: {
              value: item.data,
              callback: function callback(optionValue) {
                item.data = optionValue;
              }
            },
            on: getFilterEvents(_defineProperty({}, type, function (value) {
              handleConfirmFilter(params, column, value && value.length > 0, item);

              if (events && events[type]) {
                events[type](params, value);
              }
            }), renderOpts, params)
          }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
            return h('a-select-opt-group', {
              key: gIndex
            }, [h('span', {
              slot: 'label'
            }, group[groupLabel])].concat(renderOptions(h, group[groupOptions], optionProps)));
          }));
        });
      }

      return column.filters.map(function (item) {
        return h('a-select', {
          props: props,
          attrs: attrs,
          model: {
            value: item.data,
            callback: function callback(optionValue) {
              item.data = optionValue;
            }
          },
          on: getFilterEvents({
            change: function change(value) {
              handleConfirmFilter(params, column, value && value.length > 0, item);

              if (events && events[type]) {
                events[type](params, value);
              }
            }
          }, renderOpts, params)
        }, renderOptions(h, options, optionProps));
      });
    },
    filterMethod: function filterMethod(_ref6) {
      var option = _ref6.option,
          row = _ref6.row,
          column = _ref6.column;
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
    renderItem: function renderItem(h, renderOpts, params, context) {
      var options = renderOpts.options,
          optionGroups = renderOpts.optionGroups,
          _renderOpts$optionPro5 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro5 === void 0 ? {} : _renderOpts$optionPro5,
          _renderOpts$optionGro4 = renderOpts.optionGroupProps,
          optionGroupProps = _renderOpts$optionGro4 === void 0 ? {} : _renderOpts$optionGro4;
      var data = params.data,
          property = params.property;
      var attrs = renderOpts.attrs;
      var props = getFormProps(params, renderOpts);

      if (optionGroups) {
        var groupOptions = optionGroupProps.options || 'options';
        var groupLabel = optionGroupProps.label || 'label';
        return [h('a-select', {
          props: props,
          attrs: attrs,
          model: {
            value: _xeUtils["default"].get(data, property),
            callback: function callback(cellValue) {
              _xeUtils["default"].set(data, property, cellValue);
            }
          },
          on: getFormEvents(renderOpts, params)
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
        model: {
          value: _xeUtils["default"].get(data, property),
          callback: function callback(cellValue) {
            _xeUtils["default"].set(data, property, cellValue);
          }
        },
        on: getFormEvents(renderOpts, params)
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
    renderFilter: createFilterRender(),
    filterMethod: defaultFilterMethod,
    renderItem: createFormItemRender()
  },
  ARadio: {
    renderItem: createFormItemRadioAndCheckboxRender()
  },
  ACheckbox: {
    renderItem: createFormItemRadioAndCheckboxRender()
  }
};
/**
 * 事件兼容性处理
 */

function handleClearEvent(params, evnt, context) {
  var $table = params.$table;
  var getEventTargetNode = $table ? $table.getEventTargetNode : context.getEventTargetNode;
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
  install: function install(xtable) {
    var interceptor = xtable.interceptor,
        renderer = xtable.renderer;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsImNlbGxWYWx1ZSIsInVuZGVmaW5lZCIsIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiWEVVdGlscyIsImVhY2giLCJpdGVtIiwidmFsdWUiLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsInJlbmRlck9wdHMiLCJwYXJhbXMiLCJjZWxsVGV4dCIsImdldERhdGVQaWNrZXJDZWxsVmFsdWUiLCJnZXRQcm9wcyIsImRlZmF1bHRQcm9wcyIsIiR0YWJsZSIsInByb3BzIiwiYXNzaWduIiwidlNpemUiLCJzaXplIiwiZ2V0Q2VsbEV2ZW50cyIsIm5hbWUiLCJldmVudHMiLCJ0eXBlIiwib24iLCJldm50IiwidXBkYXRlU3RhdHVzIiwib2JqZWN0TWFwIiwiY2IiLCJhcmdzIiwiYXBwbHkiLCJjb25jYXQiLCJnZXRTZWxlY3RDZWxsVmFsdWUiLCJvcHRpb25zIiwib3B0aW9uR3JvdXBzIiwib3B0aW9uUHJvcHMiLCJvcHRpb25Hcm91cFByb3BzIiwicm93IiwiY29sdW1uIiwibGFiZWxQcm9wIiwidmFsdWVQcm9wIiwiZ3JvdXBPcHRpb25zIiwiZ2V0IiwicHJvcGVydHkiLCJtYXAiLCJtb2RlIiwic2VsZWN0SXRlbSIsImZpbmQiLCJqb2luIiwiZ2V0Q2FzY2FkZXJDZWxsVmFsdWUiLCJzaG93QWxsTGV2ZWxzIiwic2xpY2UiLCJzZXBhcmF0b3IiLCJnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSIsImRhdGUiLCJmb3JtYXQiLCJnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlIiwidHJlZUNoZWNrYWJsZSIsIm11bHRpcGxlIiwiY3JlYXRlRWRpdFJlbmRlciIsImF0dHJzIiwibW9kZWwiLCJjYWxsYmFjayIsInNldCIsImdldEZpbHRlckV2ZW50cyIsImNyZWF0ZUZpbHRlclJlbmRlciIsImNvbnRleHQiLCJmaWx0ZXJzIiwiZGF0YSIsIm9wdGlvblZhbHVlIiwiaGFuZGxlQ29uZmlybUZpbHRlciIsImNoZWNrZWQiLCIkcGFuZWwiLCJmaWx0ZXJNdWx0aXBsZSIsImRlZmF1bHRGaWx0ZXJNZXRob2QiLCJvcHRpb24iLCJyZW5kZXJPcHRpb25zIiwiZGlzYWJsZWRQcm9wIiwiZGlzYWJsZWQiLCJrZXkiLCJjcmVhdGVGb3JtSXRlbVJlbmRlciIsImdldEZvcm1Qcm9wcyIsImdldEZvcm1FdmVudHMiLCIkZm9ybSIsImNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QiLCJpc0VkaXQiLCJyZW5kZXJQcm9wZXJ0eSIsImNyZWF0ZUV4cG9ydE1ldGhvZCIsInZhbHVlTWV0aG9kIiwiY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyIiwicmVuZGVyTWFwIiwiQUF1dG9Db21wbGV0ZSIsImF1dG9mb2N1cyIsInJlbmRlckRlZmF1bHQiLCJyZW5kZXJFZGl0IiwicmVuZGVyRmlsdGVyIiwiZmlsdGVyTWV0aG9kIiwicmVuZGVySXRlbSIsIkFJbnB1dCIsIkFJbnB1dE51bWJlciIsIkFTZWxlY3QiLCJncm91cExhYmVsIiwiZ3JvdXAiLCJnSW5kZXgiLCJzbG90IiwicmVuZGVyQ2VsbCIsImNoYW5nZSIsImZpbHRlclJlbmRlciIsImlzQXJyYXkiLCJpbmNsdWRlQXJyYXlzIiwiaW5kZXhPZiIsImNlbGxFeHBvcnRNZXRob2QiLCJlZGl0Q2VsbEV4cG9ydE1ldGhvZCIsIkFDYXNjYWRlciIsIkFEYXRlUGlja2VyIiwiQU1vbnRoUGlja2VyIiwiQVJhbmdlUGlja2VyIiwiQVdlZWtQaWNrZXIiLCJBVGltZVBpY2tlciIsIkFUcmVlU2VsZWN0IiwiQVJhdGUiLCJBU3dpdGNoIiwiQVJhZGlvIiwiQUNoZWNrYm94IiwiaGFuZGxlQ2xlYXJFdmVudCIsImdldEV2ZW50VGFyZ2V0Tm9kZSIsImJvZHlFbGVtIiwiZG9jdW1lbnQiLCJib2R5IiwiZmxhZyIsIlZYRVRhYmxlUGx1Z2luQW50ZCIsImluc3RhbGwiLCJ4dGFibGUiLCJpbnRlcmNlcHRvciIsInJlbmRlcmVyIiwibWl4aW4iLCJhZGQiLCJ0b01vbWVudFN0cmluZyIsIndpbmRvdyIsIlZYRVRhYmxlIiwidXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUdBLFNBQVNBLFlBQVQsQ0FBdUJDLFNBQXZCLEVBQXFDO0FBQ25DLFNBQU9BLFNBQVMsS0FBSyxJQUFkLElBQXNCQSxTQUFTLEtBQUtDLFNBQXBDLElBQWlERCxTQUFTLEtBQUssRUFBdEU7QUFDRDs7QUFFRCxTQUFTRSxpQkFBVCxDQUE0QkMsS0FBNUIsRUFBMkNDLElBQTNDLEVBQTZEQyxNQUE3RCxFQUFpRkMsTUFBakYsRUFBbUc7QUFDakcsTUFBSUMsR0FBRyxHQUFHRixNQUFNLENBQUNGLEtBQUQsQ0FBaEI7O0FBQ0EsTUFBSUMsSUFBSSxJQUFJQyxNQUFNLENBQUNHLE1BQVAsR0FBZ0JMLEtBQTVCLEVBQW1DO0FBQ2pDTSx3QkFBUUMsSUFBUixDQUFhTixJQUFiLEVBQW1CLFVBQUNPLElBQUQsRUFBYztBQUMvQixVQUFJQSxJQUFJLENBQUNDLEtBQUwsS0FBZUwsR0FBbkIsRUFBd0I7QUFDdEJELFFBQUFBLE1BQU0sQ0FBQ08sSUFBUCxDQUFZRixJQUFJLENBQUNHLEtBQWpCO0FBQ0FaLFFBQUFBLGlCQUFpQixDQUFDLEVBQUVDLEtBQUgsRUFBVVEsSUFBSSxDQUFDSSxRQUFmLEVBQXlCVixNQUF6QixFQUFpQ0MsTUFBakMsQ0FBakI7QUFDRDtBQUNGLEtBTEQ7QUFNRDtBQUNGOztBQUVELFNBQVNVLGdCQUFULENBQTJCQyxhQUEzQixFQUFnRDtBQUM5QyxTQUFPLFVBQVVDLENBQVYsRUFBdUJDLFVBQXZCLEVBQXdDQyxNQUF4QyxFQUFtRDtBQUN4RCxXQUFPQyxRQUFRLENBQUNILENBQUQsRUFBSUksc0JBQXNCLENBQUNILFVBQUQsRUFBYUMsTUFBYixFQUFxQkgsYUFBckIsQ0FBMUIsQ0FBZjtBQUNELEdBRkQ7QUFHRDs7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R0EsU0FBUyxDQUFDaUUsTUFBVixDQUFpQkEsTUFBakIsQ0FBSCxHQUE4QixFQUE5QztBQUNEOztBQWFEeEQsb0JBQVF3SSxLQUFSLENBQWM7QUFDWkUsRUFBQUEsY0FBYyxFQUFkQTtBQURZLENBQWQ7O0FBSUEsSUFBSSxPQUFPQyxNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxNQUFNLENBQUNDLFFBQTVDLEVBQXNEO0FBQ3BERCxFQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CVixrQkFBcEI7QUFDRDs7ZUFFY0Esa0IiLCJmaWxlIjoiaW5kZXguY29tbW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFhFVXRpbHMgZnJvbSAneGUtdXRpbHMvbWV0aG9kcy94ZS11dGlscydcclxuaW1wb3J0IFZYRVRhYmxlIGZyb20gJ3Z4ZS10YWJsZS9saWIvdnhlLXRhYmxlJ1xyXG5cclxuZnVuY3Rpb24gaXNFbXB0eVZhbHVlIChjZWxsVmFsdWU6IGFueSkge1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPT09IG51bGwgfHwgY2VsbFZhbHVlID09PSB1bmRlZmluZWQgfHwgY2VsbFZhbHVlID09PSAnJ1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYXRjaENhc2NhZGVyRGF0YSAoaW5kZXg6IG51bWJlciwgbGlzdDogQXJyYXk8YW55PiwgdmFsdWVzOiBBcnJheTxhbnk+LCBsYWJlbHM6IEFycmF5PGFueT4pIHtcclxuICBsZXQgdmFsID0gdmFsdWVzW2luZGV4XVxyXG4gIGlmIChsaXN0ICYmIHZhbHVlcy5sZW5ndGggPiBpbmRleCkge1xyXG4gICAgWEVVdGlscy5lYWNoKGxpc3QsIChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IHZhbCkge1xyXG4gICAgICAgIGxhYmVscy5wdXNoKGl0ZW0ubGFiZWwpXHJcbiAgICAgICAgbWF0Y2hDYXNjYWRlckRhdGEoKytpbmRleCwgaXRlbS5jaGlsZHJlbiwgdmFsdWVzLCBsYWJlbHMpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXREYXRlUGlja2VyIChkZWZhdWx0Rm9ybWF0OiBzdHJpbmcpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMsIGRlZmF1bHRGb3JtYXQpKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UHJvcHMgKHsgJHRhYmxlIH06IGFueSwgeyBwcm9wcyB9OiBhbnksIGRlZmF1bHRQcm9wcz86IGFueSkge1xyXG4gIHJldHVybiBYRVV0aWxzLmFzc2lnbigkdGFibGUudlNpemUgPyB7IHNpemU6ICR0YWJsZS52U2l6ZSB9IDoge30sIGRlZmF1bHRQcm9wcywgcHJvcHMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENlbGxFdmVudHMgKHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyBuYW1lLCBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyAkdGFibGUgfSA9IHBhcmFtc1xyXG4gIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgIGNhc2UgJ0FBdXRvQ29tcGxldGUnOlxyXG4gICAgICB0eXBlID0gJ3NlbGVjdCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dCc6XHJcbiAgICAgIHR5cGUgPSAnaW5wdXQnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXROdW1iZXInOlxyXG4gICAgICB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgbGV0IG9uID0ge1xyXG4gICAgW3R5cGVdOiAoZXZudDogYW55KSA9PiB7XHJcbiAgICAgICR0YWJsZS51cGRhdGVTdGF0dXMocGFyYW1zKVxyXG4gICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgIGV2ZW50c1t0eXBlXShwYXJhbXMsIGV2bnQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgaWYgKGV2ZW50cykge1xyXG4gICAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKHt9LCBYRVV0aWxzLm9iamVjdE1hcChldmVudHMsIChjYjogRnVuY3Rpb24pID0+IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICBjYi5hcHBseShudWxsLCBbcGFyYW1zXS5jb25jYXQuYXBwbHkocGFyYW1zLCBhcmdzKSlcclxuICAgIH0pLCBvbilcclxuICB9XHJcbiAgcmV0dXJuIG9uXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNlbGVjdENlbGxWYWx1ZSAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IG9wdGlvbnMsIG9wdGlvbkdyb3VwcywgcHJvcHMgPSB7fSwgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgbGV0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICBsZXQgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoIWlzRW1wdHlWYWx1ZShjZWxsVmFsdWUpKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5tYXAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJyA/IGNlbGxWYWx1ZSA6IFtjZWxsVmFsdWVdLCBvcHRpb25Hcm91cHMgPyAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICBsZXQgc2VsZWN0SXRlbVxyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb3B0aW9uR3JvdXBzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgIHNlbGVjdEl0ZW0gPSBYRVV0aWxzLmZpbmQob3B0aW9uR3JvdXBzW2luZGV4XVtncm91cE9wdGlvbnNdLCAoaXRlbTogYW55KSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICAgIGlmIChzZWxlY3RJdGVtKSB7XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc2VsZWN0SXRlbSA/IHNlbGVjdEl0ZW1bbGFiZWxQcm9wXSA6IHZhbHVlXHJcbiAgICB9IDogKHZhbHVlOiBhbnkpID0+IHtcclxuICAgICAgbGV0IHNlbGVjdEl0ZW0gPSBYRVV0aWxzLmZpbmQob3B0aW9ucywgKGl0ZW06IGFueSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZVxyXG4gICAgfSkuam9pbignOycpXHJcbiAgfVxyXG4gIHJldHVybiBudWxsXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhc2NhZGVyQ2VsbFZhbHVlIChyZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgbGV0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgdmFyIHZhbHVlcyA9IGNlbGxWYWx1ZSB8fCBbXVxyXG4gIHZhciBsYWJlbHM6IEFycmF5PGFueT4gPSBbXVxyXG4gIG1hdGNoQ2FzY2FkZXJEYXRhKDAsIHByb3BzLm9wdGlvbnMsIHZhbHVlcywgbGFiZWxzKVxyXG4gIHJldHVybiAocHJvcHMuc2hvd0FsbExldmVscyA9PT0gZmFsc2UgPyBsYWJlbHMuc2xpY2UobGFiZWxzLmxlbmd0aCAtIDEsIGxhYmVscy5sZW5ndGgpIDogbGFiZWxzKS5qb2luKGAgJHtwcm9wcy5zZXBhcmF0b3IgfHwgJy8nfSBgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmIChjZWxsVmFsdWUpIHtcclxuICAgIGNlbGxWYWx1ZSA9IFhFVXRpbHMubWFwKGNlbGxWYWx1ZSwgKGRhdGU6IGFueSkgPT4gZGF0ZS5mb3JtYXQocHJvcHMuZm9ybWF0IHx8ICdZWVlZLU1NLUREJykpLmpvaW4oJyB+ICcpXHJcbiAgfVxyXG4gIHJldHVybiBjZWxsVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmIChjZWxsVmFsdWUgJiYgKHByb3BzLnRyZWVDaGVja2FibGUgfHwgcHJvcHMubXVsdGlwbGUpKSB7XHJcbiAgICBjZWxsVmFsdWUgPSBjZWxsVmFsdWUuam9pbignOycpXHJcbiAgfVxyXG4gIHJldHVybiBjZWxsVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgZGVmYXVsdEZvcm1hdDogc3RyaW5nKSB7XHJcbiAgbGV0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgZGVmYXVsdEZvcm1hdClcclxuICB9XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFZGl0UmVuZGVyIChkZWZhdWx0UHJvcHM/OiBhbnkpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzLCBkZWZhdWx0UHJvcHMpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKHJlbmRlck9wdHMubmFtZSwge1xyXG4gICAgICAgIHByb3BzLFxyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgICAgY2FsbGJhY2sgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIHZhbHVlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICB9KVxyXG4gICAgXVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RmlsdGVyRXZlbnRzIChvbjogYW55LCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgbGV0IHsgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgaWYgKGV2ZW50cykge1xyXG4gICAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKHt9LCBYRVV0aWxzLm9iamVjdE1hcChldmVudHMsIChjYjogRnVuY3Rpb24pID0+IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICBjYi5hcHBseShudWxsLCBbcGFyYW1zXS5jb25jYXQoYXJncykpXHJcbiAgICB9KSwgb24pXHJcbiAgfVxyXG4gIHJldHVybiBvblxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGaWx0ZXJSZW5kZXIgKGRlZmF1bHRQcm9wcz86IGFueSkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gICAgbGV0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgIGxldCB7IG5hbWUsIGF0dHJzLCBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICBjYXNlICdBQXV0b0NvbXBsZXRlJzpcclxuICAgICAgICB0eXBlID0gJ3NlbGVjdCdcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdBSW5wdXQnOlxyXG4gICAgICAgIHR5cGUgPSAnaW5wdXQnXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnQUlucHV0TnVtYmVyJzpcclxuICAgICAgICB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICBwcm9wcyxcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICAgIGNhbGxiYWNrIChvcHRpb25WYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGl0ZW0uZGF0YSA9IG9wdGlvblZhbHVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjogZ2V0RmlsdGVyRXZlbnRzKHtcclxuICAgICAgICAgIFt0eXBlXSAoZXZudDogYW55KSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIocGFyYW1zLCBjb2x1bW4sICEhaXRlbS5kYXRhLCBpdGVtKVxyXG4gICAgICAgICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgICAgICAgIGV2ZW50c1t0eXBlXShwYXJhbXMsIGV2bnQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ29uZmlybUZpbHRlciAocGFyYW1zOiBhbnksIGNvbHVtbjogYW55LCBjaGVja2VkOiBhbnksIGl0ZW06IGFueSkge1xyXG4gIGNvbnN0ICRwYW5lbCA9IHBhcmFtcy4kcGFuZWwgfHwgcGFyYW1zLmNvbnRleHRcclxuICAkcGFuZWxbY29sdW1uLmZpbHRlck11bHRpcGxlID8gJ2NoYW5nZU11bHRpcGxlT3B0aW9uJyA6ICdjaGFuZ2VSYWRpb09wdGlvbiddKHt9LCBjaGVja2VkLCBpdGVtKVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyTWV0aG9kICh7IG9wdGlvbiwgcm93LCBjb2x1bW4gfTogYW55KSB7XHJcbiAgbGV0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPT09IGRhdGFcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyT3B0aW9ucyAoaDogRnVuY3Rpb24sIG9wdGlvbnM6IGFueSwgb3B0aW9uUHJvcHM6IGFueSkge1xyXG4gIGxldCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgbGV0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICBsZXQgZGlzYWJsZWRQcm9wID0gb3B0aW9uUHJvcHMuZGlzYWJsZWQgfHwgJ2Rpc2FibGVkJ1xyXG4gIHJldHVybiBYRVV0aWxzLm1hcChvcHRpb25zLCAoaXRlbTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0aW9uJywge1xyXG4gICAgICBwcm9wczoge1xyXG4gICAgICAgIHZhbHVlOiBpdGVtW3ZhbHVlUHJvcF0sXHJcbiAgICAgICAgZGlzYWJsZWQ6IGl0ZW1bZGlzYWJsZWRQcm9wXVxyXG4gICAgICB9LFxyXG4gICAgICBrZXk6IGluZGV4XHJcbiAgICB9LCBpdGVtW2xhYmVsUHJvcF0pXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2VsbFRleHQgKGg6IEZ1bmN0aW9uLCBjZWxsVmFsdWU6IGFueSkge1xyXG4gIHJldHVybiBbJycgKyAoaXNFbXB0eVZhbHVlKGNlbGxWYWx1ZSkgPyAnJyA6IGNlbGxWYWx1ZSldXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZvcm1JdGVtUmVuZGVyIChkZWZhdWx0UHJvcHM/OiBhbnkpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICAgIGxldCB7IGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICAgIGxldCB7IG5hbWUgfSA9IHJlbmRlck9wdHNcclxuICAgIGxldCB7IGF0dHJzIH06IGFueSA9IHJlbmRlck9wdHNcclxuICAgIGxldCBwcm9wczogYW55ID0gZ2V0Rm9ybVByb3BzKHBhcmFtcywgcmVuZGVyT3B0cywgZGVmYXVsdFByb3BzKVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChuYW1lLCB7XHJcbiAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSksXHJcbiAgICAgICAgICBjYWxsYmFjayAodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBYRVV0aWxzLnNldChkYXRhLCBwcm9wZXJ0eSwgdmFsdWUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjogZ2V0Rm9ybUV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0pXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGb3JtUHJvcHMgKHsgJGZvcm0gfTogYW55LCB7IHByb3BzIH06IGFueSwgZGVmYXVsdFByb3BzPzogYW55KSB7XHJcbiAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKCRmb3JtLnZTaXplID8geyBzaXplOiAkZm9ybS52U2l6ZSB9IDoge30sIGRlZmF1bHRQcm9wcywgcHJvcHMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZvcm1FdmVudHMgKHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyBldmVudHMgfTogYW55ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7ICRmb3JtIH0gPSBwYXJhbXNcclxuICBsZXQgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICBjYXNlICdBQXV0b0NvbXBsZXRlJzpcclxuICAgICAgdHlwZSA9ICdzZWxlY3QnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXQnOlxyXG4gICAgICB0eXBlID0gJ2lucHV0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0TnVtYmVyJzpcclxuICAgICAgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIGxldCBvbiA9IHtcclxuICAgIFt0eXBlXTogKGV2bnQ6IGFueSkgPT4ge1xyXG4gICAgICAkZm9ybS51cGRhdGVTdGF0dXMocGFyYW1zKVxyXG4gICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgIGV2ZW50c1t0eXBlXShwYXJhbXMsIGV2bnQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgaWYgKGV2ZW50cykge1xyXG4gICAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKHt9LCBYRVV0aWxzLm9iamVjdE1hcChldmVudHMsIChjYjogRnVuY3Rpb24pID0+IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICBjYi5hcHBseShudWxsLCBbcGFyYW1zXS5jb25jYXQuYXBwbHkocGFyYW1zLCBhcmdzKSlcclxuICAgIH0pLCBvbilcclxuICB9XHJcbiAgcmV0dXJuIG9uXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QgKGRlZmF1bHRGb3JtYXQ6IHN0cmluZywgaXNFZGl0PzogYm9vbGVhbikge1xyXG4gIGNvbnN0IHJlbmRlclByb3BlcnR5ID0gaXNFZGl0ID8gJ2VkaXRSZW5kZXInIDogJ2NlbGxSZW5kZXInXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChwYXJhbXM6IGFueSkge1xyXG4gICAgcmV0dXJuIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocGFyYW1zLmNvbHVtbltyZW5kZXJQcm9wZXJ0eV0sIHBhcmFtcywgZGVmYXVsdEZvcm1hdClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUV4cG9ydE1ldGhvZCAodmFsdWVNZXRob2Q6IEZ1bmN0aW9uLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogYW55KSB7XHJcbiAgICByZXR1cm4gdmFsdWVNZXRob2QocGFyYW1zLmNvbHVtbltyZW5kZXJQcm9wZXJ0eV0sIHBhcmFtcylcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlciAoKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgICBsZXQgeyBuYW1lLCBvcHRpb25zLCBvcHRpb25Qcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICBsZXQgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgbGV0IHByb3BzOiBhbnkgPSBnZXRGb3JtUHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gICAgbGV0IGxhYmVsUHJvcDogc3RyaW5nID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgbGV0IHZhbHVlUHJvcDogc3RyaW5nID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gICAgbGV0IGRpc2FibGVkUHJvcDogc3RyaW5nID0gb3B0aW9uUHJvcHMuZGlzYWJsZWQgfHwgJ2Rpc2FibGVkJ1xyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChgJHtuYW1lfUdyb3VwYCwge1xyXG4gICAgICAgIHByb3BzLFxyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQoZGF0YSwgcHJvcGVydHkpLFxyXG4gICAgICAgICAgY2FsbGJhY2sgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIFhFVXRpbHMuc2V0KGRhdGEsIHByb3BlcnR5LCBjZWxsVmFsdWUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjogZ2V0Rm9ybUV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0sIG9wdGlvbnMubWFwKChvcHRpb246IGFueSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBvcHRpb25bdmFsdWVQcm9wXSxcclxuICAgICAgICAgICAgZGlzYWJsZWQ6IG9wdGlvbltkaXNhYmxlZFByb3BdXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgb3B0aW9uW2xhYmVsUHJvcF0pXHJcbiAgICAgIH0pKVxyXG4gICAgXVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOa4suafk+WHveaVsFxyXG4gKi9cclxuY29uc3QgcmVuZGVyTWFwID0ge1xyXG4gIEFBdXRvQ29tcGxldGU6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUlucHV0OiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFJbnB1dE51bWJlcjoge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0LW51bWJlci1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdCAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcclxuICAgICAgICBsZXQgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGxldCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KSxcclxuICAgICAgICAgICAgICBjYWxsYmFjayAoY2VsbFZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCBjZWxsVmFsdWUpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbjogZ2V0Q2VsbEV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgICB9LCBYRVV0aWxzLm1hcChvcHRpb25Hcm91cHMsIChncm91cDogYW55LCBnSW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgIGtleTogZ0luZGV4XHJcbiAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xyXG4gICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxyXG4gICAgICAgICAgICApKVxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KSxcclxuICAgICAgICAgICAgY2FsbGJhY2sgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIGNlbGxWYWx1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHJlbmRlckNlbGwgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJGaWx0ZXIgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICAgICAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IHsgYXR0cnMsIGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgICAgIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGxldCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgbGV0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICAgIHZhbHVlOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sgKG9wdGlvblZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZGF0YSA9IG9wdGlvblZhbHVlXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbjogZ2V0RmlsdGVyRXZlbnRzKHtcclxuICAgICAgICAgICAgICBbdHlwZV0gKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIocGFyYW1zLCBjb2x1bW4sIHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDAsIGl0ZW0pXHJcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgICAgICAgICAgICBldmVudHNbdHlwZV0ocGFyYW1zLCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwOiBhbnksIGdJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogaXRlbS5kYXRhLFxyXG4gICAgICAgICAgICBjYWxsYmFjayAob3B0aW9uVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIGl0ZW0uZGF0YSA9IG9wdGlvblZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjogZ2V0RmlsdGVyRXZlbnRzKHtcclxuICAgICAgICAgICAgY2hhbmdlICh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIGNvbHVtbiwgdmFsdWUgJiYgdmFsdWUubGVuZ3RoID4gMCwgaXRlbSlcclxuICAgICAgICAgICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzW3R5cGVdKHBhcmFtcywgdmFsdWUpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyTWV0aG9kICh7IG9wdGlvbiwgcm93LCBjb2x1bW4gfTogYW55KSB7XHJcbiAgICAgIGxldCB7IGRhdGEgfSA9IG9wdGlvblxyXG4gICAgICBsZXQgeyBwcm9wZXJ0eSwgZmlsdGVyUmVuZGVyOiByZW5kZXJPcHRzIH0gPSBjb2x1bW5cclxuICAgICAgbGV0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBwcm9wZXJ0eSlcclxuICAgICAgaWYgKHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScpIHtcclxuICAgICAgICBpZiAoWEVVdGlscy5pc0FycmF5KGNlbGxWYWx1ZSkpIHtcclxuICAgICAgICAgIHJldHVybiBYRVV0aWxzLmluY2x1ZGVBcnJheXMoY2VsbFZhbHVlLCBkYXRhKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YS5pbmRleE9mKGNlbGxWYWx1ZSkgPiAtMVxyXG4gICAgICB9XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xyXG4gICAgICByZXR1cm4gY2VsbFZhbHVlID09IGRhdGFcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgICAgIGxldCB7IG9wdGlvbnMsIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCB7IGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICAgICAgbGV0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHByb3BzOiBhbnkgPSBnZXRGb3JtUHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwT3B0aW9uczogc3RyaW5nID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGxldCBncm91cExhYmVsOiBzdHJpbmcgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQoZGF0YSwgcHJvcGVydHkpLFxyXG4gICAgICAgICAgICAgIGNhbGxiYWNrIChjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgWEVVdGlscy5zZXQoZGF0YSwgcHJvcGVydHksIGNlbGxWYWx1ZSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uOiBnZXRGb3JtRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwOiBhbnksIGdJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQoZGF0YSwgcHJvcGVydHkpLFxyXG4gICAgICAgICAgICBjYWxsYmFjayAoY2VsbFZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICBYRVV0aWxzLnNldChkYXRhLCBwcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgb246IGdldEZvcm1FdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFNlbGVjdENlbGxWYWx1ZSksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFNlbGVjdENlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFDYXNjYWRlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldENhc2NhZGVyQ2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRDYXNjYWRlckNlbGxWYWx1ZSksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldENhc2NhZGVyQ2VsbFZhbHVlLCB0cnVlKVxyXG4gIH0sXHJcbiAgQURhdGVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktTU0tREQnKSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NLUREJyksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTS1ERCcsIHRydWUpXHJcbiAgfSxcclxuICBBTW9udGhQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktTU0nKSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NJyksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTScsIHRydWUpXHJcbiAgfSxcclxuICBBUmFuZ2VQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFXZWVrUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLVdX5ZGoJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1XV+WRqCcpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktV1flkagnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVRpbWVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ0hIOm1tOnNzJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnSEg6bW06c3MnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdISDptbTpzcycsIHRydWUpXHJcbiAgfSxcclxuICBBVHJlZVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldFRyZWVTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFRyZWVTZWxlY3RDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVJhdGU6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBU3dpdGNoOiB7XHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQVJhZGlvOiB7XHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUNoZWNrYm94OiB7XHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJhZGlvQW5kQ2hlY2tib3hSZW5kZXIoKVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOS6i+S7tuWFvOWuueaAp+WkhOeQhlxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlQ2xlYXJFdmVudCAocGFyYW1zOiBhbnksIGV2bnQ6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgY29uc3QgeyAkdGFibGUgfSA9IHBhcmFtc1xyXG4gIGNvbnN0IGdldEV2ZW50VGFyZ2V0Tm9kZSA9ICR0YWJsZSA/ICR0YWJsZS5nZXRFdmVudFRhcmdldE5vZGUgOiBjb250ZXh0LmdldEV2ZW50VGFyZ2V0Tm9kZVxyXG4gIGNvbnN0IGJvZHlFbGVtOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmJvZHlcclxuICBpZiAoXHJcbiAgICAvLyDkuIvmi4nmoYZcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1zZWxlY3QtZHJvcGRvd24nKS5mbGFnIHx8XHJcbiAgICAvLyDnuqfogZRcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYXNjYWRlci1tZW51cycpLmZsYWcgfHxcclxuICAgIC8vIOaXpeacn1xyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhbGVuZGFyLXBpY2tlci1jb250YWluZXInKS5mbGFnIHx8XHJcbiAgICAvLyDml7bpl7TpgInmi6lcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC10aW1lLXBpY2tlci1wYW5lbCcpLmZsYWdcclxuICApIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOWfuuS6jiB2eGUtdGFibGUg6KGo5qC855qE6YCC6YWN5o+S5Lu277yM55So5LqO5YW85a65IGFudC1kZXNpZ24tdnVlIOe7hOS7tuW6k1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFZYRVRhYmxlUGx1Z2luQW50ZCA9IHtcclxuICBpbnN0YWxsICh4dGFibGU6IHR5cGVvZiBWWEVUYWJsZSkge1xyXG4gICAgbGV0IHsgaW50ZXJjZXB0b3IsIHJlbmRlcmVyIH0gPSB4dGFibGVcclxuICAgIHJlbmRlcmVyLm1peGluKHJlbmRlck1hcClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJGaWx0ZXInLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gICAgaW50ZXJjZXB0b3IuYWRkKCdldmVudC5jbGVhckFjdGl2ZWQnLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdG9Nb21lbnRTdHJpbmcgKGNlbGxWYWx1ZTogYW55LCBmb3JtYXQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA/IGNlbGxWYWx1ZS5mb3JtYXQoZm9ybWF0KSA6ICcnXHJcbn1cclxuXHJcbmRlY2xhcmUgbW9kdWxlICd4ZS11dGlscy9tZXRob2RzL3hlLXV0aWxzJyB7XHJcbiAgaW50ZXJmYWNlIFhFVXRpbHNNZXRob2RzIHtcclxuICAgIC8qKlxyXG4gICAgICog5bCGIE1vbWVudCDml6XmnJ/moLzlvI/ljJbkuLrlrZfnrKbkuLJcclxuICAgICAqIEBwYXJhbSBjZWxsVmFsdWUg5YC8XHJcbiAgICAgKiBAcGFyYW0gZm9ybWF0IOagvOW8j+WMllxyXG4gICAgICovXHJcbiAgICB0b01vbWVudFN0cmluZzogdHlwZW9mIHRvTW9tZW50U3RyaW5nO1xyXG4gIH1cclxufVxyXG5cclxuWEVVdGlscy5taXhpbih7XHJcbiAgdG9Nb21lbnRTdHJpbmdcclxufSlcclxuXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVlhFVGFibGUpIHtcclxuICB3aW5kb3cuVlhFVGFibGUudXNlKFZYRVRhYmxlUGx1Z2luQW50ZClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5BbnRkXHJcbiJdfQ==
