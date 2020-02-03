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

function getFilterEvents(on, renderOpts, params, context) {
  var events = renderOpts.events;

  if (events) {
    return _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
      return function () {
        params = Object.assign({
          context: context
        }, params);

        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        cb.apply(null, [params].concat.apply(params, args));
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
          handleConfirmFilter(context, column, !!item.data, item);

          if (events && events[type]) {
            events[type](Object.assign({
              context: context
            }, params), evnt);
          }
        }), renderOpts, params, context)
      });
    });
  };
}

function handleConfirmFilter(context, column, checked, item) {
  context[column.filterMultiple ? 'changeMultipleOption' : 'changeRadioOption']({}, checked, item);
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
        field = params.field;
    var name = renderOpts.name;
    var attrs = renderOpts.attrs;
    var props = getFormProps(context, renderOpts, defaultProps);
    return [h(name, {
      attrs: attrs,
      props: props,
      model: {
        value: _xeUtils["default"].get(data, field),
        callback: function callback(value) {
          _xeUtils["default"].set(data, field, value);
        }
      },
      on: getFormEvents(renderOpts, params, context)
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

function getFormEvents(renderOpts, params, context) {
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
          _renderOpts$optionPro2 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro2 === void 0 ? {} : _renderOpts$optionPro2,
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
          _renderOpts$optionPro3 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro3 === void 0 ? {} : _renderOpts$optionPro3,
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
              handleConfirmFilter(context, column, value && value.length > 0, item);

              if (events && events[type]) {
                events[type](Object.assign({
                  context: context
                }, params), value);
              }
            }), renderOpts, params, context)
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
              handleConfirmFilter(context, column, value && value.length > 0, item);

              if (events && events[type]) {
                events[type](Object.assign({
                  context: context
                }, params), value);
              }
            }
          }, renderOpts, params, context)
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
          _renderOpts$optionPro4 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro4 === void 0 ? {} : _renderOpts$optionPro4,
          _renderOpts$optionGro4 = renderOpts.optionGroupProps,
          optionGroupProps = _renderOpts$optionGro4 === void 0 ? {} : _renderOpts$optionGro4;
      var data = params.data,
          property = params.property;
      var attrs = renderOpts.attrs;
      var props = getFormProps(context, renderOpts);

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
          on: getFormEvents(renderOpts, params, context)
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
        on: getFormEvents(renderOpts, params, context)
      }, renderOptions(h, options, optionProps))];
    },
    editExportMethod: createExportMethod(getSelectCellValue, true),
    cellExportMethod: createExportMethod(getSelectCellValue)
  },
  ACascader: {
    renderEdit: createEditRender(),
    renderCell: function renderCell(h, renderOpts, params) {
      return cellText(h, getCascaderCellValue(renderOpts, params));
    },
    renderItem: createFormItemRender(),
    editExportMethod: createExportMethod(getCascaderCellValue, true),
    cellExportMethod: createExportMethod(getCascaderCellValue)
  },
  ADatePicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-MM-DD'),
    renderItem: createFormItemRender(),
    editExportMethod: createDatePickerExportMethod('YYYY-MM-DD', true),
    cellExportMethod: createDatePickerExportMethod('YYYY-MM-DD')
  },
  AMonthPicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-MM'),
    renderItem: createFormItemRender(),
    editExportMethod: createDatePickerExportMethod('YYYY-MM', true),
    cellExportMethod: createDatePickerExportMethod('YYYY-MM')
  },
  ARangePicker: {
    renderEdit: createEditRender(),
    renderCell: function renderCell(h, renderOpts, params) {
      return cellText(h, getRangePickerCellValue(renderOpts, params));
    },
    renderItem: createFormItemRender(),
    editExportMethod: createExportMethod(getRangePickerCellValue, true),
    cellExportMethod: createExportMethod(getRangePickerCellValue)
  },
  AWeekPicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-WW周'),
    renderItem: createFormItemRender(),
    editExportMethod: createDatePickerExportMethod('YYYY-WW周', true),
    cellExportMethod: createDatePickerExportMethod('YYYY-WW周')
  },
  ATimePicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('HH:mm:ss'),
    renderItem: createFormItemRender(),
    editExportMethod: createDatePickerExportMethod('HH:mm:ss', true),
    cellExportMethod: createDatePickerExportMethod('HH:mm:ss')
  },
  ATreeSelect: {
    renderEdit: createEditRender(),
    renderCell: function renderCell(h, renderOpts, params) {
      return cellText(h, getTreeSelectCellValue(renderOpts, params));
    },
    renderItem: createFormItemRender(),
    editExportMethod: createExportMethod(getTreeSelectCellValue, true),
    cellExportMethod: createExportMethod(getTreeSelectCellValue)
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
  }
};
/**
 * 事件兼容性处理
 */

function handleClearEvent(params, evnt, context) {
  var getEventTargetNode = context.getEventTargetNode;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsImNlbGxWYWx1ZSIsInVuZGVmaW5lZCIsIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiWEVVdGlscyIsImVhY2giLCJpdGVtIiwidmFsdWUiLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsInJlbmRlck9wdHMiLCJwYXJhbXMiLCJjZWxsVGV4dCIsImdldERhdGVQaWNrZXJDZWxsVmFsdWUiLCJnZXRQcm9wcyIsImRlZmF1bHRQcm9wcyIsIiR0YWJsZSIsInByb3BzIiwiYXNzaWduIiwidlNpemUiLCJzaXplIiwiZ2V0Q2VsbEV2ZW50cyIsIm5hbWUiLCJldmVudHMiLCJ0eXBlIiwib24iLCJldm50IiwidXBkYXRlU3RhdHVzIiwib2JqZWN0TWFwIiwiY2IiLCJhcmdzIiwiYXBwbHkiLCJjb25jYXQiLCJnZXRTZWxlY3RDZWxsVmFsdWUiLCJvcHRpb25zIiwib3B0aW9uR3JvdXBzIiwib3B0aW9uUHJvcHMiLCJvcHRpb25Hcm91cFByb3BzIiwicm93IiwiY29sdW1uIiwibGFiZWxQcm9wIiwidmFsdWVQcm9wIiwiZ3JvdXBPcHRpb25zIiwiZ2V0IiwicHJvcGVydHkiLCJtYXAiLCJtb2RlIiwic2VsZWN0SXRlbSIsImZpbmQiLCJqb2luIiwiZ2V0Q2FzY2FkZXJDZWxsVmFsdWUiLCJzaG93QWxsTGV2ZWxzIiwic2xpY2UiLCJzZXBhcmF0b3IiLCJnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSIsImRhdGUiLCJmb3JtYXQiLCJnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlIiwidHJlZUNoZWNrYWJsZSIsIm11bHRpcGxlIiwiY3JlYXRlRWRpdFJlbmRlciIsImF0dHJzIiwibW9kZWwiLCJjYWxsYmFjayIsInNldCIsImdldEZpbHRlckV2ZW50cyIsImNvbnRleHQiLCJPYmplY3QiLCJjcmVhdGVGaWx0ZXJSZW5kZXIiLCJmaWx0ZXJzIiwiZGF0YSIsIm9wdGlvblZhbHVlIiwiaGFuZGxlQ29uZmlybUZpbHRlciIsImNoZWNrZWQiLCJmaWx0ZXJNdWx0aXBsZSIsImRlZmF1bHRGaWx0ZXJNZXRob2QiLCJvcHRpb24iLCJyZW5kZXJPcHRpb25zIiwiZGlzYWJsZWRQcm9wIiwiZGlzYWJsZWQiLCJrZXkiLCJjcmVhdGVGb3JtSXRlbVJlbmRlciIsImZpZWxkIiwiZ2V0Rm9ybVByb3BzIiwiZ2V0Rm9ybUV2ZW50cyIsIiRmb3JtIiwiY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCIsImlzRWRpdCIsInJlbmRlclByb3BlcnR5IiwiY3JlYXRlRXhwb3J0TWV0aG9kIiwidmFsdWVNZXRob2QiLCJyZW5kZXJNYXAiLCJBQXV0b0NvbXBsZXRlIiwiYXV0b2ZvY3VzIiwicmVuZGVyRGVmYXVsdCIsInJlbmRlckVkaXQiLCJyZW5kZXJGaWx0ZXIiLCJmaWx0ZXJNZXRob2QiLCJyZW5kZXJJdGVtIiwiQUlucHV0IiwiQUlucHV0TnVtYmVyIiwiQVNlbGVjdCIsImdyb3VwTGFiZWwiLCJncm91cCIsImdJbmRleCIsInNsb3QiLCJyZW5kZXJDZWxsIiwiY2hhbmdlIiwiZmlsdGVyUmVuZGVyIiwiaXNBcnJheSIsImluY2x1ZGVBcnJheXMiLCJpbmRleE9mIiwiZWRpdEV4cG9ydE1ldGhvZCIsImNlbGxFeHBvcnRNZXRob2QiLCJBQ2FzY2FkZXIiLCJBRGF0ZVBpY2tlciIsIkFNb250aFBpY2tlciIsIkFSYW5nZVBpY2tlciIsIkFXZWVrUGlja2VyIiwiQVRpbWVQaWNrZXIiLCJBVHJlZVNlbGVjdCIsIkFSYXRlIiwiQVN3aXRjaCIsImhhbmRsZUNsZWFyRXZlbnQiLCJnZXRFdmVudFRhcmdldE5vZGUiLCJib2R5RWxlbSIsImRvY3VtZW50IiwiYm9keSIsImZsYWciLCJWWEVUYWJsZVBsdWdpbkFudGQiLCJpbnN0YWxsIiwieHRhYmxlIiwiaW50ZXJjZXB0b3IiLCJyZW5k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O2VBRWNBLGtCIiwiZmlsZSI6ImluZGV4LmNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBYRVV0aWxzIGZyb20gJ3hlLXV0aWxzL21ldGhvZHMveGUtdXRpbHMnXHJcbmltcG9ydCBWWEVUYWJsZSBmcm9tICd2eGUtdGFibGUvbGliL3Z4ZS10YWJsZSdcclxuXHJcbmZ1bmN0aW9uIGlzRW1wdHlWYWx1ZSAoY2VsbFZhbHVlOiBhbnkpIHtcclxuICByZXR1cm4gY2VsbFZhbHVlID09PSBudWxsIHx8IGNlbGxWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGNlbGxWYWx1ZSA9PT0gJydcclxufVxyXG5cclxuZnVuY3Rpb24gbWF0Y2hDYXNjYWRlckRhdGEgKGluZGV4OiBudW1iZXIsIGxpc3Q6IEFycmF5PGFueT4sIHZhbHVlczogQXJyYXk8YW55PiwgbGFiZWxzOiBBcnJheTxhbnk+KSB7XHJcbiAgbGV0IHZhbCA9IHZhbHVlc1tpbmRleF1cclxuICBpZiAobGlzdCAmJiB2YWx1ZXMubGVuZ3RoID4gaW5kZXgpIHtcclxuICAgIFhFVXRpbHMuZWFjaChsaXN0LCAoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLnZhbHVlID09PSB2YWwpIHtcclxuICAgICAgICBsYWJlbHMucHVzaChpdGVtLmxhYmVsKVxyXG4gICAgICAgIG1hdGNoQ2FzY2FkZXJEYXRhKCsraW5kZXgsIGl0ZW0uY2hpbGRyZW4sIHZhbHVlcywgbGFiZWxzKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybWF0RGF0ZVBpY2tlciAoZGVmYXVsdEZvcm1hdDogc3RyaW5nKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zLCBkZWZhdWx0Rm9ybWF0KSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFByb3BzICh7ICR0YWJsZSB9OiBhbnksIHsgcHJvcHMgfTogYW55LCBkZWZhdWx0UHJvcHM/OiBhbnkpIHtcclxuICByZXR1cm4gWEVVdGlscy5hc3NpZ24oJHRhYmxlLnZTaXplID8geyBzaXplOiAkdGFibGUudlNpemUgfSA6IHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDZWxsRXZlbnRzIChyZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgbGV0IHsgbmFtZSwgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgbGV0IHsgJHRhYmxlIH0gPSBwYXJhbXNcclxuICBsZXQgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICBjYXNlICdBQXV0b0NvbXBsZXRlJzpcclxuICAgICAgdHlwZSA9ICdzZWxlY3QnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXQnOlxyXG4gICAgICB0eXBlID0gJ2lucHV0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0TnVtYmVyJzpcclxuICAgICAgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIGxldCBvbiA9IHtcclxuICAgIFt0eXBlXTogKGV2bnQ6IGFueSkgPT4ge1xyXG4gICAgICAkdGFibGUudXBkYXRlU3RhdHVzKHBhcmFtcylcclxuICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICBldmVudHNbdHlwZV0ocGFyYW1zLCBldm50KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChldmVudHMpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLmFzc2lnbih7fSwgWEVVdGlscy5vYmplY3RNYXAoZXZlbnRzLCAoY2I6IEZ1bmN0aW9uKSA9PiBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgY2IuYXBwbHkobnVsbCwgW3BhcmFtc10uY29uY2F0LmFwcGx5KHBhcmFtcywgYXJncykpXHJcbiAgICB9KSwgb24pXHJcbiAgfVxyXG4gIHJldHVybiBvblxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRTZWxlY3RDZWxsVmFsdWUgKHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIHByb3BzID0ge30sIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gIGxldCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgbGV0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKCFpc0VtcHR5VmFsdWUoY2VsbFZhbHVlKSkge1xyXG4gICAgcmV0dXJuIFhFVXRpbHMubWFwKHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScgPyBjZWxsVmFsdWUgOiBbY2VsbFZhbHVlXSwgb3B0aW9uR3JvdXBzID8gKHZhbHVlOiBhbnkpID0+IHtcclxuICAgICAgbGV0IHNlbGVjdEl0ZW1cclxuICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9wdGlvbkdyb3Vwcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICBzZWxlY3RJdGVtID0gWEVVdGlscy5maW5kKG9wdGlvbkdyb3Vwc1tpbmRleF1bZ3JvdXBPcHRpb25zXSwgKGl0ZW06IGFueSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgICBpZiAoc2VsZWN0SXRlbSkge1xyXG4gICAgICAgICAgYnJlYWtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZVxyXG4gICAgfSA6ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgIGxldCBzZWxlY3RJdGVtID0gWEVVdGlscy5maW5kKG9wdGlvbnMsIChpdGVtOiBhbnkpID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXHJcbiAgICAgIHJldHVybiBzZWxlY3RJdGVtID8gc2VsZWN0SXRlbVtsYWJlbFByb3BdIDogdmFsdWVcclxuICAgIH0pLmpvaW4oJzsnKVxyXG4gIH1cclxuICByZXR1cm4gbnVsbFxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDYXNjYWRlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIHZhciB2YWx1ZXMgPSBjZWxsVmFsdWUgfHwgW11cclxuICB2YXIgbGFiZWxzOiBBcnJheTxhbnk+ID0gW11cclxuICBtYXRjaENhc2NhZGVyRGF0YSgwLCBwcm9wcy5vcHRpb25zLCB2YWx1ZXMsIGxhYmVscylcclxuICByZXR1cm4gKHByb3BzLnNob3dBbGxMZXZlbHMgPT09IGZhbHNlID8gbGFiZWxzLnNsaWNlKGxhYmVscy5sZW5ndGggLSAxLCBsYWJlbHMubGVuZ3RoKSA6IGxhYmVscykuam9pbihgICR7cHJvcHMuc2VwYXJhdG9yIHx8ICcvJ30gYClcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUgKHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoY2VsbFZhbHVlKSB7XHJcbiAgICBjZWxsVmFsdWUgPSBYRVV0aWxzLm1hcChjZWxsVmFsdWUsIChkYXRlOiBhbnkpID0+IGRhdGUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCAnWVlZWS1NTS1ERCcpKS5qb2luKCcgfiAnKVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFRyZWVTZWxlY3RDZWxsVmFsdWUgKHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoY2VsbFZhbHVlICYmIChwcm9wcy50cmVlQ2hlY2thYmxlIHx8IHByb3BzLm11bHRpcGxlKSkge1xyXG4gICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmpvaW4oJzsnKVxyXG4gIH1cclxuICByZXR1cm4gY2VsbFZhbHVlXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldERhdGVQaWNrZXJDZWxsVmFsdWUgKHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnksIGRlZmF1bHRGb3JtYXQ6IHN0cmluZykge1xyXG4gIGxldCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmIChjZWxsVmFsdWUpIHtcclxuICAgIGNlbGxWYWx1ZSA9IGNlbGxWYWx1ZS5mb3JtYXQocHJvcHMuZm9ybWF0IHx8IGRlZmF1bHRGb3JtYXQpXHJcbiAgfVxyXG4gIHJldHVybiBjZWxsVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRWRpdFJlbmRlciAoZGVmYXVsdFByb3BzPzogYW55KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgbGV0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cywgZGVmYXVsdFByb3BzKVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChyZW5kZXJPcHRzLm5hbWUsIHtcclxuICAgICAgICBwcm9wcyxcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KSxcclxuICAgICAgICAgIGNhbGxiYWNrICh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCB2YWx1ZSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgfSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZpbHRlckV2ZW50cyAob246IGFueSwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgbGV0IHsgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgaWYgKGV2ZW50cykge1xyXG4gICAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKHt9LCBYRVV0aWxzLm9iamVjdE1hcChldmVudHMsIChjYjogRnVuY3Rpb24pID0+IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICBwYXJhbXMgPSBPYmplY3QuYXNzaWduKHsgY29udGV4dCB9LCBwYXJhbXMpXHJcbiAgICAgIGNiLmFwcGx5KG51bGwsIFtwYXJhbXNdLmNvbmNhdC5hcHBseShwYXJhbXMsIGFyZ3MpKVxyXG4gICAgfSksIG9uKVxyXG4gIH1cclxuICByZXR1cm4gb25cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRmlsdGVyUmVuZGVyIChkZWZhdWx0UHJvcHM/OiBhbnkpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICAgIGxldCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICBsZXQgeyBuYW1lLCBhdHRycywgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgICBsZXQgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgY2FzZSAnQUF1dG9Db21wbGV0ZSc6XHJcbiAgICAgICAgdHlwZSA9ICdzZWxlY3QnXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgICB0eXBlID0gJ2lucHV0J1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ0FJbnB1dE51bWJlcic6XHJcbiAgICAgICAgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICByZXR1cm4gaChuYW1lLCB7XHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgIHZhbHVlOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgICBjYWxsYmFjayAob3B0aW9uVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBpdGVtLmRhdGEgPSBvcHRpb25WYWx1ZVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IGdldEZpbHRlckV2ZW50cyh7XHJcbiAgICAgICAgICBbdHlwZV0gKGV2bnQ6IGFueSkge1xyXG4gICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKGNvbnRleHQsIGNvbHVtbiwgISFpdGVtLmRhdGEsIGl0ZW0pXHJcbiAgICAgICAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgICAgICAgZXZlbnRzW3R5cGVdKE9iamVjdC5hc3NpZ24oeyBjb250ZXh0IH0sIHBhcmFtcyksIGV2bnQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMsIGNvbnRleHQpXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ29uZmlybUZpbHRlciAoY29udGV4dDogYW55LCBjb2x1bW46IGFueSwgY2hlY2tlZDogYW55LCBpdGVtOiBhbnkpIHtcclxuICBjb250ZXh0W2NvbHVtbi5maWx0ZXJNdWx0aXBsZSA/ICdjaGFuZ2VNdWx0aXBsZU9wdGlvbicgOiAnY2hhbmdlUmFkaW9PcHRpb24nXSh7fSwgY2hlY2tlZCwgaXRlbSlcclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEZpbHRlck1ldGhvZCAoeyBvcHRpb24sIHJvdywgY29sdW1uIH06IGFueSkge1xyXG4gIGxldCB7IGRhdGEgfSA9IG9wdGlvblxyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cclxuICByZXR1cm4gY2VsbFZhbHVlID09PSBkYXRhXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlck9wdGlvbnMgKGg6IEZ1bmN0aW9uLCBvcHRpb25zOiBhbnksIG9wdGlvblByb3BzOiBhbnkpIHtcclxuICBsZXQgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gIGxldCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgbGV0IGRpc2FibGVkUHJvcCA9IG9wdGlvblByb3BzLmRpc2FibGVkIHx8ICdkaXNhYmxlZCdcclxuICByZXR1cm4gWEVVdGlscy5tYXAob3B0aW9ucywgKGl0ZW06IGFueSwgaW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdGlvbicsIHtcclxuICAgICAgcHJvcHM6IHtcclxuICAgICAgICB2YWx1ZTogaXRlbVt2YWx1ZVByb3BdLFxyXG4gICAgICAgIGRpc2FibGVkOiBpdGVtW2Rpc2FibGVkUHJvcF1cclxuICAgICAgfSxcclxuICAgICAga2V5OiBpbmRleFxyXG4gICAgfSwgaXRlbVtsYWJlbFByb3BdKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNlbGxUZXh0IChoOiBGdW5jdGlvbiwgY2VsbFZhbHVlOiBhbnkpIHtcclxuICByZXR1cm4gWycnICsgKGlzRW1wdHlWYWx1ZShjZWxsVmFsdWUpID8gJycgOiBjZWxsVmFsdWUpXVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGb3JtSXRlbVJlbmRlciAoZGVmYXVsdFByb3BzPzogYW55KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgICBsZXQgeyBkYXRhLCBmaWVsZCB9ID0gcGFyYW1zXHJcbiAgICBsZXQgeyBuYW1lIH0gPSByZW5kZXJPcHRzXHJcbiAgICBsZXQgeyBhdHRycyB9OiBhbnkgPSByZW5kZXJPcHRzXHJcbiAgICBsZXQgcHJvcHM6IGFueSA9IGdldEZvcm1Qcm9wcyhjb250ZXh0LCByZW5kZXJPcHRzLCBkZWZhdWx0UHJvcHMpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKG5hbWUsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wcyxcclxuICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KGRhdGEsIGZpZWxkKSxcclxuICAgICAgICAgIGNhbGxiYWNrICh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIFhFVXRpbHMuc2V0KGRhdGEsIGZpZWxkLCB2YWx1ZSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiBnZXRGb3JtRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcywgY29udGV4dClcclxuICAgICAgfSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZvcm1Qcm9wcyAoeyAkZm9ybSB9OiBhbnksIHsgcHJvcHMgfTogYW55LCBkZWZhdWx0UHJvcHM/OiBhbnkpIHtcclxuICByZXR1cm4gWEVVdGlscy5hc3NpZ24oJGZvcm0udlNpemUgPyB7IHNpemU6ICRmb3JtLnZTaXplIH0gOiB7fSwgZGVmYXVsdFByb3BzLCBwcm9wcylcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Rm9ybUV2ZW50cyAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgbGV0IHsgZXZlbnRzIH06IGFueSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyAkZm9ybSB9ID0gcGFyYW1zXHJcbiAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gIHN3aXRjaCAobmFtZSkge1xyXG4gICAgY2FzZSAnQUF1dG9Db21wbGV0ZSc6XHJcbiAgICAgIHR5cGUgPSAnc2VsZWN0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgdHlwZSA9ICdpbnB1dCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dE51bWJlcic6XHJcbiAgICAgIHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICBicmVha1xyXG4gIH1cclxuICBsZXQgb24gPSB7XHJcbiAgICBbdHlwZV06IChldm50OiBhbnkpID0+IHtcclxuICAgICAgJGZvcm0udXBkYXRlU3RhdHVzKHBhcmFtcylcclxuICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICBldmVudHNbdHlwZV0ocGFyYW1zLCBldm50KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChldmVudHMpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLmFzc2lnbih7fSwgWEVVdGlscy5vYmplY3RNYXAoZXZlbnRzLCAoY2I6IEZ1bmN0aW9uKSA9PiBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgY2IuYXBwbHkobnVsbCwgW3BhcmFtc10uY29uY2F0LmFwcGx5KHBhcmFtcywgYXJncykpXHJcbiAgICB9KSwgb24pXHJcbiAgfVxyXG4gIHJldHVybiBvblxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kIChkZWZhdWx0Rm9ybWF0OiBzdHJpbmcsIGlzRWRpdD86IGJvb2xlYW4pIHtcclxuICBjb25zdCByZW5kZXJQcm9wZXJ0eSA9IGlzRWRpdCA/ICdlZGl0UmVuZGVyJyA6ICdjZWxsUmVuZGVyJ1xyXG4gIHJldHVybiBmdW5jdGlvbiAocGFyYW1zOiBhbnkpIHtcclxuICAgIHJldHVybiBnZXREYXRlUGlja2VyQ2VsbFZhbHVlKHBhcmFtcy5jb2x1bW5bcmVuZGVyUHJvcGVydHldLCBwYXJhbXMsIGRlZmF1bHRGb3JtYXQpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFeHBvcnRNZXRob2QgKHZhbHVlTWV0aG9kOiBGdW5jdGlvbiwgaXNFZGl0PzogYm9vbGVhbikge1xyXG4gIGNvbnN0IHJlbmRlclByb3BlcnR5ID0gaXNFZGl0ID8gJ2VkaXRSZW5kZXInIDogJ2NlbGxSZW5kZXInXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChwYXJhbXM6IGFueSkge1xyXG4gICAgcmV0dXJuIHZhbHVlTWV0aG9kKHBhcmFtcy5jb2x1bW5bcmVuZGVyUHJvcGVydHldLCBwYXJhbXMpXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5riy5p+T5Ye95pWwXHJcbiAqL1xyXG5jb25zdCByZW5kZXJNYXAgPSB7XHJcbiAgQUF1dG9Db21wbGV0ZToge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBSW5wdXQ6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQUlucHV0TnVtYmVyOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQtbnVtYmVyLWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0IChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGxldCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgbGV0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgICAgICAgIGNhbGxiYWNrIChjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIGNlbGxWYWx1ZSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwOiBhbnksIGdJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgICAgICBjYWxsYmFjayAoY2VsbFZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICBYRVV0aWxzLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldFNlbGVjdENlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckZpbHRlciAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gICAgICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgeyBhdHRycywgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgICAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBsZXQgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICAgICAgICBjYWxsYmFjayAob3B0aW9uVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kYXRhID0gb3B0aW9uVmFsdWVcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uOiBnZXRGaWx0ZXJFdmVudHMoe1xyXG4gICAgICAgICAgICAgIFt0eXBlXSAodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihjb250ZXh0LCBjb2x1bW4sIHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDAsIGl0ZW0pXHJcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgICAgICAgICAgICBldmVudHNbdHlwZV0oT2JqZWN0LmFzc2lnbih7IGNvbnRleHQgfSwgcGFyYW1zKSwgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMsIGNvbnRleHQpXHJcbiAgICAgICAgICB9LCBYRVV0aWxzLm1hcChvcHRpb25Hcm91cHMsIChncm91cDogYW55LCBnSW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgIGtleTogZ0luZGV4XHJcbiAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xyXG4gICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxyXG4gICAgICAgICAgICApKVxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICAgICAgY2FsbGJhY2sgKG9wdGlvblZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICBpdGVtLmRhdGEgPSBvcHRpb25WYWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgb246IGdldEZpbHRlckV2ZW50cyh7XHJcbiAgICAgICAgICAgIGNoYW5nZSAodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dCwgY29sdW1uLCB2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwLCBpdGVtKVxyXG4gICAgICAgICAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudHNbdHlwZV0oT2JqZWN0LmFzc2lnbih7IGNvbnRleHQgfSwgcGFyYW1zKSwgdmFsdWUpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMsIGNvbnRleHQpXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyTWV0aG9kICh7IG9wdGlvbiwgcm93LCBjb2x1bW4gfTogYW55KSB7XHJcbiAgICAgIGxldCB7IGRhdGEgfSA9IG9wdGlvblxyXG4gICAgICBsZXQgeyBwcm9wZXJ0eSwgZmlsdGVyUmVuZGVyOiByZW5kZXJPcHRzIH0gPSBjb2x1bW5cclxuICAgICAgbGV0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBwcm9wZXJ0eSlcclxuICAgICAgaWYgKHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScpIHtcclxuICAgICAgICBpZiAoWEVVdGlscy5pc0FycmF5KGNlbGxWYWx1ZSkpIHtcclxuICAgICAgICAgIHJldHVybiBYRVV0aWxzLmluY2x1ZGVBcnJheXMoY2VsbFZhbHVlLCBkYXRhKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YS5pbmRleE9mKGNlbGxWYWx1ZSkgPiAtMVxyXG4gICAgICB9XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xyXG4gICAgICByZXR1cm4gY2VsbFZhbHVlID09IGRhdGFcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgICAgIGxldCB7IG9wdGlvbnMsIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCB7IGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICAgICAgbGV0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHByb3BzOiBhbnkgPSBnZXRGb3JtUHJvcHMoY29udGV4dCwgcmVuZGVyT3B0cylcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGxldCBncm91cE9wdGlvbnM6IHN0cmluZyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBsZXQgZ3JvdXBMYWJlbDogc3RyaW5nID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KSxcclxuICAgICAgICAgICAgICBjYWxsYmFjayAoY2VsbFZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIFhFVXRpbHMuc2V0KGRhdGEsIHByb3BlcnR5LCBjZWxsVmFsdWUpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbjogZ2V0Rm9ybUV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMsIGNvbnRleHQpXHJcbiAgICAgICAgICB9LCBYRVV0aWxzLm1hcChvcHRpb25Hcm91cHMsIChncm91cDogYW55LCBnSW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgIGtleTogZ0luZGV4XHJcbiAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xyXG4gICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxyXG4gICAgICAgICAgICApKVxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KSxcclxuICAgICAgICAgICAgY2FsbGJhY2sgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgWEVVdGlscy5zZXQoZGF0YSwgcHJvcGVydHksIGNlbGxWYWx1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9uOiBnZXRGb3JtRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcywgY29udGV4dClcclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIGVkaXRFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRTZWxlY3RDZWxsVmFsdWUsIHRydWUpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFNlbGVjdENlbGxWYWx1ZSlcclxuICB9LFxyXG4gIEFDYXNjYWRlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldENhc2NhZGVyQ2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGVkaXRFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRDYXNjYWRlckNlbGxWYWx1ZSwgdHJ1ZSksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0Q2FzY2FkZXJDZWxsVmFsdWUpXHJcbiAgfSxcclxuICBBRGF0ZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTS1ERCcpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGVkaXRFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0tREQnLCB0cnVlKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0tREQnKVxyXG4gIH0sXHJcbiAgQU1vbnRoUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgZWRpdEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTScsIHRydWUpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTScpXHJcbiAgfSxcclxuICBBUmFuZ2VQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBlZGl0RXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUsIHRydWUpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlKVxyXG4gIH0sXHJcbiAgQVdlZWtQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktV1flkagnKSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBlZGl0RXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLVdX5ZGoJywgdHJ1ZSksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLVdX5ZGoJylcclxuICB9LFxyXG4gIEFUaW1lUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdISDptbTpzcycpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGVkaXRFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ0hIOm1tOnNzJywgdHJ1ZSksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdISDptbTpzcycpXHJcbiAgfSxcclxuICBBVHJlZVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldFRyZWVTZWxlY3RDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgZWRpdEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFRyZWVTZWxlY3RDZWxsVmFsdWUsIHRydWUpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFRyZWVTZWxlY3RDZWxsVmFsdWUpXHJcbiAgfSxcclxuICBBUmF0ZToge1xyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFTd2l0Y2g6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5LqL5Lu25YW85a655oCn5aSE55CGXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVDbGVhckV2ZW50IChwYXJhbXM6IGFueSwgZXZudDogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICBsZXQgeyBnZXRFdmVudFRhcmdldE5vZGUgfSA9IGNvbnRleHRcclxuICBsZXQgYm9keUVsZW0gPSBkb2N1bWVudC5ib2R5XHJcbiAgaWYgKFxyXG4gICAgLy8g5LiL5ouJ5qGGXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtc2VsZWN0LWRyb3Bkb3duJykuZmxhZyB8fFxyXG4gICAgLy8g57qn6IGUXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FzY2FkZXItbWVudXMnKS5mbGFnIHx8XHJcbiAgICAvLyDml6XmnJ9cclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYWxlbmRhci1waWNrZXItY29udGFpbmVyJykuZmxhZyB8fFxyXG4gICAgLy8g5pe26Ze06YCJ5oupXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtdGltZS1waWNrZXItcGFuZWwnKS5mbGFnXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDln7rkuo4gdnhlLXRhYmxlIOihqOagvOeahOmAgumFjeaPkuS7tu+8jOeUqOS6juWFvOWuuSBhbnQtZGVzaWduLXZ1ZSDnu4Tku7blupNcclxuICovXHJcbmV4cG9ydCBjb25zdCBWWEVUYWJsZVBsdWdpbkFudGQgPSB7XHJcbiAgaW5zdGFsbCAoeHRhYmxlOiB0eXBlb2YgVlhFVGFibGUpIHtcclxuICAgIGxldCB7IGludGVyY2VwdG9yLCByZW5kZXJlciB9ID0geHRhYmxlXHJcbiAgICByZW5kZXJlci5taXhpbihyZW5kZXJNYXApXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyRmlsdGVyJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJBY3RpdmVkJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvTW9tZW50U3RyaW5nIChjZWxsVmFsdWU6IGFueSwgZm9ybWF0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPyBjZWxsVmFsdWUuZm9ybWF0KGZvcm1hdCkgOiAnJ1xyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSAneGUtdXRpbHMvbWV0aG9kcy94ZS11dGlscycge1xyXG4gIGludGVyZmFjZSBYRVV0aWxzTWV0aG9kcyB7XHJcbiAgICAvKipcclxuICAgICAqIOWwhiBNb21lbnQg5pel5pyf5qC85byP5YyW5Li65a2X56ym5LiyXHJcbiAgICAgKiBAcGFyYW0gY2VsbFZhbHVlIOWAvFxyXG4gICAgICogQHBhcmFtIGZvcm1hdCDmoLzlvI/ljJZcclxuICAgICAqL1xyXG4gICAgdG9Nb21lbnRTdHJpbmc6IHR5cGVvZiB0b01vbWVudFN0cmluZztcclxuICB9XHJcbn1cclxuXHJcblhFVXRpbHMubWl4aW4oe1xyXG4gIHRvTW9tZW50U3RyaW5nXHJcbn0pXHJcblxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LlZYRVRhYmxlKSB7XHJcbiAgd2luZG93LlZYRVRhYmxlLnVzZShWWEVUYWJsZVBsdWdpbkFudGQpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZYRVRhYmxlUGx1Z2luQW50ZFxyXG4iXX0=
