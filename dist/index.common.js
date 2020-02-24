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

function defaultButtonEditRender(h, renderOpts, params) {
  var attrs = renderOpts.attrs;
  var props = getProps(params, renderOpts);
  return [h('a-button', {
    attrs: attrs,
    props: props,
    on: getCellEvents(renderOpts, params)
  }, cellText(h, renderOpts.content))];
}

function defaultButtonsEditRender(h, renderOpts, params) {
  return renderOpts.children.map(function (childRenderOpts) {
    return defaultButtonEditRender(h, childRenderOpts, params)[0];
  });
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
    var props = getFormItemProps(params, renderOpts, defaultProps);
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

function defaultButtonItemRender(h, renderOpts, params) {
  var attrs = renderOpts.attrs;
  var props = getFormItemProps(params, renderOpts);
  return [h('a-button', {
    attrs: attrs,
    props: props,
    on: getFormEvents(renderOpts, params)
  }, cellText(h, props.content))];
}

function defaultButtonsItemRender(h, renderOpts, params) {
  return renderOpts.children.map(function (childRenderOpts) {
    return defaultButtonItemRender(h, childRenderOpts, params)[0];
  });
}

function getFormItemProps(_ref4, _ref5, defaultProps) {
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
    var props = getFormItemProps(params, renderOpts);
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
      var props = getFormItemProps(params, renderOpts);

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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsImNlbGxWYWx1ZSIsInVuZGVmaW5lZCIsIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiWEVVdGlscyIsImVhY2giLCJpdGVtIiwidmFsdWUiLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsInJlbmRlck9wdHMiLCJwYXJhbXMiLCJjZWxsVGV4dCIsImdldERhdGVQaWNrZXJDZWxsVmFsdWUiLCJnZXRQcm9wcyIsImRlZmF1bHRQcm9wcyIsIiR0YWJsZSIsInByb3BzIiwiYXNzaWduIiwidlNpemUiLCJzaXplIiwiZ2V0Q2VsbEV2ZW50cyIsIm5hbWUiLCJldmVudHMiLCJ0eXBlIiwib24iLCJldm50IiwidXBkYXRlU3RhdHVzIiwib2JqZWN0TWFwIiwiY2IiLCJhcmdzIiwiYXBwbHkiLCJjb25jYXQiLCJnZXRTZWxlY3RDZWxsVmFsdWUiLCJvcHRpb25zIiwib3B0aW9uR3JvdXBzIiwib3B0aW9uUHJvcHMiLCJvcHRpb25Hcm91cFByb3BzIiwicm93IiwiY29sdW1uIiwibGFiZWxQcm9wIiwidmFsdWVQcm9wIiwiZ3JvdXBPcHRpb25zIiwiZ2V0IiwicHJvcGVydHkiLCJtYXAiLCJtb2RlIiwic2VsZWN0SXRlbSIsImZpbmQiLCJqb2luIiwiZ2V0Q2FzY2FkZXJDZWxsVmFsdWUiLCJzaG93QWxsTGV2ZWxzIiwic2xpY2UiLCJzZXBhcmF0b3IiLCJnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSIsImRhdGUiLCJmb3JtYXQiLCJnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlIiwidHJlZUNoZWNrYWJsZSIsIm11bHRpcGxlIiwiY3JlYXRlRWRpdFJlbmRlciIsImF0dHJzIiwibW9kZWwiLCJjYWxsYmFjayIsInNldCIsImRlZmF1bHRCdXR0b25FZGl0UmVuZGVyIiwiY29udGVudCIsImRlZmF1bHRCdXR0b25zRWRpdFJlbmRlciIsImNoaWxkUmVuZGVyT3B0cyIsImdldEZpbHRlckV2ZW50cyIsImNyZWF0ZUZpbHRlclJlbmRlciIsImNvbnRleHQiLCJmaWx0ZXJzIiwiZGF0YSIsIm9wdGlvblZhbHVlIiwiaGFuZGxlQ29uZmlybUZpbHRlciIsImNoZWNrZWQiLCIkcGFuZWwiLCJmaWx0ZXJNdWx0aXBsZSIsImRlZmF1bHRGaWx0ZXJNZXRob2QiLCJvcHRpb24iLCJyZW5kZXJPcHRpb25zIiwiZGlzYWJsZWRQcm9wIiwiZGlzYWJsZWQiLCJrZXkiLCJjcmVhdGVGb3JtSXRlbVJlbmRlciIsImdldEZvcm1JdGVtUHJvcHMiLCJnZXRGb3JtRXZlbnRzIiwiZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXIiLCJkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXIiLCIkZm9ybSIsImNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QiLCJpc0VkaXQiLCJyZW5kZXJQcm9wZXJ0eSIsImNyZWF0ZUV4cG9ydE1ldGhvZCIsInZhbHVlTWV0aG9kIiwiY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyIiwicmVuZGVyTWFwIiwiQUF1dG9Db21wbGV0ZSIsImF1dG9mb2N1cyIsInJlbmRlckRlZmF1bHQiLCJyZW5kZXJFZGl0IiwicmVuZGVyRmlsdGVyIiwiZmlsdGVyTWV0aG9kIiwicmVuZGVySXRlbSIsIkFJbnB1dCIsIkFJbnB1dE51bWJlciIsIkFTZWxlY3QiLCJncm91cExhYmVsIiwiZ3JvdXAiLCJnSW5kZXgiLCJzbG90IiwicmVuZGVyQ2VsbCIsImNoYW5nZSIsImZpbHRlclJlbmRlciIsImlzQXJyYXkiLCJpbmNsdWRlQXJyYXlzIiwiaW5kZXhPZiIsImNlbGxFeHBvcnRNZXRob2QiLCJlZGl0Q2VsbEV4cG9ydE1ldGhvZCIsIkFDYXNjYWRlciIsIkFEYXRlUGlja2VyIiwiQU1vbnRoUGlja2VyIiwiQVJhbmdlUGlja2VyIiwiQVdlZWtQaWNrZXIiLCJBVGltZVBpY2tlciIsIkFUcmVlU2VsZWN0IiwiQVJhdGUiLCJBU3dpdGNoIiwiQVJhZGlvIiwiQUNoZWNrYm94IiwiQUJ1dHRvbiIsIkFCdXR0b25zIiwiaGFuZGxlQ2xlYXJFdmVudCIsImdldEV2ZW50VGFyZ2V0Tm9kZSIsImJvZHlFbGVtIiwiZG9jdW1lbnQiLCJib2R5IiwiZmxhZyIsIlZYRVRhYmxlUGx1Z2luQW50ZCIsImluc3RhbGwiLCJ4dGFibGUiLCJpbnRlcmNlcHRvciIsInJlbmRlcmVyIiwibWl4aW4iLCJhZGQiLCJ0b01vbWVudFN0cmluZyIsIndpbmRvdyIsIlZYRVRhYmxlIiwidXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUdBLFNBQVNBLFlBQVQsQ0FBdUJDLFNBQXZCLEVBQXFDO0FBQ25DLFNBQU9BLFNBQVMsS0FBSyxJQUFkLElBQXNCQSxTQUFTLEtBQUtDLFNBQXBDLElBQWlERCxTQUFTLEtBQUssRUFBdEU7QUFDRDs7QUFFRCxTQUFTRSxpQkFBVCxDQUE0QkMsS0FBNUIsRUFBMkNDLElBQTNDLEVBQTZEQyxNQUE3RCxFQUFpRkMsTUFBakYsRUFBbUc7QUFDakcsTUFBSUMsR0FBRyxHQUFHRixNQUFNLENBQUNGLEtBQUQsQ0FBaEI7O0FBQ0EsTUFBSUMsSUFBSSxJQUFJQyxNQUFNLENBQUNHLE1BQVAsR0FBZ0JMLEtBQTVCLEVBQW1DO0FBQ2pDTSx3QkFBUUMsSUFBUixDQUFhTixJQUFiLEVBQW1CLFVBQUNPLElBQUQsRUFBYztBQUMvQixVQUFJQSxJQUFJLENBQUNDLEtBQUwsS0FBZUwsR0FBbkIsRUFBd0I7QUFDdEJELFFBQUFBLE1BQU0sQ0FBQ08sSUFBUCxDQUFZRixJQUFJLENBQUNHLEtBQWpCO0FBQ0FaLFFBQUFBLGlCQUFpQixDQUFDLEVBQUVDLEtBQUgsRUFBVVEsSUFBSSxDQUFDSSxRQUFmLEVBQXlCVixNQUF6QixFQUFpQ0MsTUFBakMsQ0FBakI7QUFDRDtBQUNGLEtBTEQ7QUFNRDtBQUNGOztBQUVELFNBQVNVLGdCQUFULENBQTJCQyxhQUEzQixFQUFn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QSxNQUFNLENBQUNDLFFBQTVDLEVBQXNEO0FBQ3BERCxFQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CVixrQkFBcEI7QUFDRDs7ZUFFY0Esa0IiLCJmaWxlIjoiaW5kZXguY29tbW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFhFVXRpbHMgZnJvbSAneGUtdXRpbHMvbWV0aG9kcy94ZS11dGlscydcclxuaW1wb3J0IFZYRVRhYmxlIGZyb20gJ3Z4ZS10YWJsZS9saWIvdnhlLXRhYmxlJ1xyXG5cclxuZnVuY3Rpb24gaXNFbXB0eVZhbHVlIChjZWxsVmFsdWU6IGFueSkge1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPT09IG51bGwgfHwgY2VsbFZhbHVlID09PSB1bmRlZmluZWQgfHwgY2VsbFZhbHVlID09PSAnJ1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYXRjaENhc2NhZGVyRGF0YSAoaW5kZXg6IG51bWJlciwgbGlzdDogQXJyYXk8YW55PiwgdmFsdWVzOiBBcnJheTxhbnk+LCBsYWJlbHM6IEFycmF5PGFueT4pIHtcclxuICBsZXQgdmFsID0gdmFsdWVzW2luZGV4XVxyXG4gIGlmIChsaXN0ICYmIHZhbHVlcy5sZW5ndGggPiBpbmRleCkge1xyXG4gICAgWEVVdGlscy5lYWNoKGxpc3QsIChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IHZhbCkge1xyXG4gICAgICAgIGxhYmVscy5wdXNoKGl0ZW0ubGFiZWwpXHJcbiAgICAgICAgbWF0Y2hDYXNjYWRlckRhdGEoKytpbmRleCwgaXRlbS5jaGlsZHJlbiwgdmFsdWVzLCBsYWJlbHMpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXREYXRlUGlja2VyIChkZWZhdWx0Rm9ybWF0OiBzdHJpbmcpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMsIGRlZmF1bHRGb3JtYXQpKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UHJvcHMgKHsgJHRhYmxlIH06IGFueSwgeyBwcm9wcyB9OiBhbnksIGRlZmF1bHRQcm9wcz86IGFueSkge1xyXG4gIHJldHVybiBYRVV0aWxzLmFzc2lnbigkdGFibGUudlNpemUgPyB7IHNpemU6ICR0YWJsZS52U2l6ZSB9IDoge30sIGRlZmF1bHRQcm9wcywgcHJvcHMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENlbGxFdmVudHMgKHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyBuYW1lLCBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyAkdGFibGUgfSA9IHBhcmFtc1xyXG4gIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgIGNhc2UgJ0FBdXRvQ29tcGxldGUnOlxyXG4gICAgICB0eXBlID0gJ3NlbGVjdCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dCc6XHJcbiAgICAgIHR5cGUgPSAnaW5wdXQnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXROdW1iZXInOlxyXG4gICAgICB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgbGV0IG9uID0ge1xyXG4gICAgW3R5cGVdOiAoZXZudDogYW55KSA9PiB7XHJcbiAgICAgICR0YWJsZS51cGRhdGVTdGF0dXMocGFyYW1zKVxyXG4gICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgIGV2ZW50c1t0eXBlXShwYXJhbXMsIGV2bnQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgaWYgKGV2ZW50cykge1xyXG4gICAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKHt9LCBYRVV0aWxzLm9iamVjdE1hcChldmVudHMsIChjYjogRnVuY3Rpb24pID0+IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICBjYi5hcHBseShudWxsLCBbcGFyYW1zXS5jb25jYXQuYXBwbHkocGFyYW1zLCBhcmdzKSlcclxuICAgIH0pLCBvbilcclxuICB9XHJcbiAgcmV0dXJuIG9uXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFNlbGVjdENlbGxWYWx1ZSAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IG9wdGlvbnMsIG9wdGlvbkdyb3VwcywgcHJvcHMgPSB7fSwgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgbGV0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICBsZXQgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICBpZiAoIWlzRW1wdHlWYWx1ZShjZWxsVmFsdWUpKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5tYXAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJyA/IGNlbGxWYWx1ZSA6IFtjZWxsVmFsdWVdLCBvcHRpb25Hcm91cHMgPyAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICBsZXQgc2VsZWN0SXRlbVxyXG4gICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb3B0aW9uR3JvdXBzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgIHNlbGVjdEl0ZW0gPSBYRVV0aWxzLmZpbmQob3B0aW9uR3JvdXBzW2luZGV4XVtncm91cE9wdGlvbnNdLCAoaXRlbTogYW55KSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICAgIGlmIChzZWxlY3RJdGVtKSB7XHJcbiAgICAgICAgICBicmVha1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gc2VsZWN0SXRlbSA/IHNlbGVjdEl0ZW1bbGFiZWxQcm9wXSA6IHZhbHVlXHJcbiAgICB9IDogKHZhbHVlOiBhbnkpID0+IHtcclxuICAgICAgbGV0IHNlbGVjdEl0ZW0gPSBYRVV0aWxzLmZpbmQob3B0aW9ucywgKGl0ZW06IGFueSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZVxyXG4gICAgfSkuam9pbignOycpXHJcbiAgfVxyXG4gIHJldHVybiBudWxsXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhc2NhZGVyQ2VsbFZhbHVlIChyZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgbGV0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgdmFyIHZhbHVlcyA9IGNlbGxWYWx1ZSB8fCBbXVxyXG4gIHZhciBsYWJlbHM6IEFycmF5PGFueT4gPSBbXVxyXG4gIG1hdGNoQ2FzY2FkZXJEYXRhKDAsIHByb3BzLm9wdGlvbnMsIHZhbHVlcywgbGFiZWxzKVxyXG4gIHJldHVybiAocHJvcHMuc2hvd0FsbExldmVscyA9PT0gZmFsc2UgPyBsYWJlbHMuc2xpY2UobGFiZWxzLmxlbmd0aCAtIDEsIGxhYmVscy5sZW5ndGgpIDogbGFiZWxzKS5qb2luKGAgJHtwcm9wcy5zZXBhcmF0b3IgfHwgJy8nfSBgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmIChjZWxsVmFsdWUpIHtcclxuICAgIGNlbGxWYWx1ZSA9IFhFVXRpbHMubWFwKGNlbGxWYWx1ZSwgKGRhdGU6IGFueSkgPT4gZGF0ZS5mb3JtYXQocHJvcHMuZm9ybWF0IHx8ICdZWVlZLU1NLUREJykpLmpvaW4oJyB+ICcpXHJcbiAgfVxyXG4gIHJldHVybiBjZWxsVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmIChjZWxsVmFsdWUgJiYgKHByb3BzLnRyZWVDaGVja2FibGUgfHwgcHJvcHMubXVsdGlwbGUpKSB7XHJcbiAgICBjZWxsVmFsdWUgPSBjZWxsVmFsdWUuam9pbignOycpXHJcbiAgfVxyXG4gIHJldHVybiBjZWxsVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgZGVmYXVsdEZvcm1hdDogc3RyaW5nKSB7XHJcbiAgbGV0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgZGVmYXVsdEZvcm1hdClcclxuICB9XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFZGl0UmVuZGVyIChkZWZhdWx0UHJvcHM/OiBhbnkpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzLCBkZWZhdWx0UHJvcHMpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKHJlbmRlck9wdHMubmFtZSwge1xyXG4gICAgICAgIHByb3BzLFxyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgICAgY2FsbGJhY2sgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIHZhbHVlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICB9KVxyXG4gICAgXVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHByb3BzOiBhbnkgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgcmV0dXJuIFtcclxuICAgIGgoJ2EtYnV0dG9uJywge1xyXG4gICAgICBhdHRycyxcclxuICAgICAgcHJvcHMsXHJcbiAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgIH0sIGNlbGxUZXh0KGgsIHJlbmRlck9wdHMuY29udGVudCkpXHJcbiAgXVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgcmV0dXJuIHJlbmRlck9wdHMuY2hpbGRyZW4ubWFwKChjaGlsZFJlbmRlck9wdHM6IGFueSkgPT4gZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIoaCwgY2hpbGRSZW5kZXJPcHRzLCBwYXJhbXMpWzBdKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGaWx0ZXJFdmVudHMgKG9uOiBhbnksIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBpZiAoZXZlbnRzKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5hc3NpZ24oe30sIFhFVXRpbHMub2JqZWN0TWFwKGV2ZW50cywgKGNiOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGNiLmFwcGx5KG51bGwsIFtwYXJhbXNdLmNvbmNhdChhcmdzKSlcclxuICAgIH0pLCBvbilcclxuICB9XHJcbiAgcmV0dXJuIG9uXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZpbHRlclJlbmRlciAoZGVmYXVsdFByb3BzPzogYW55KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgICBsZXQgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgbGV0IHsgbmFtZSwgYXR0cnMsIGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gICAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICAgIGNhc2UgJ0FBdXRvQ29tcGxldGUnOlxyXG4gICAgICAgIHR5cGUgPSAnc2VsZWN0J1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ0FJbnB1dCc6XHJcbiAgICAgICAgdHlwZSA9ICdpbnB1dCdcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdBSW5wdXROdW1iZXInOlxyXG4gICAgICAgIHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICB9XHJcbiAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgcmV0dXJuIGgobmFtZSwge1xyXG4gICAgICAgIHByb3BzLFxyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICB2YWx1ZTogaXRlbS5kYXRhLFxyXG4gICAgICAgICAgY2FsbGJhY2sgKG9wdGlvblZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgaXRlbS5kYXRhID0gb3B0aW9uVmFsdWVcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiBnZXRGaWx0ZXJFdmVudHMoe1xyXG4gICAgICAgICAgW3R5cGVdIChldm50OiBhbnkpIHtcclxuICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIGNvbHVtbiwgISFpdGVtLmRhdGEsIGl0ZW0pXHJcbiAgICAgICAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgICAgICAgZXZlbnRzW3R5cGVdKHBhcmFtcywgZXZudClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVDb25maXJtRmlsdGVyIChwYXJhbXM6IGFueSwgY29sdW1uOiBhbnksIGNoZWNrZWQ6IGFueSwgaXRlbTogYW55KSB7XHJcbiAgY29uc3QgJHBhbmVsID0gcGFyYW1zLiRwYW5lbCB8fCBwYXJhbXMuY29udGV4dFxyXG4gICRwYW5lbFtjb2x1bW4uZmlsdGVyTXVsdGlwbGUgPyAnY2hhbmdlTXVsdGlwbGVPcHRpb24nIDogJ2NoYW5nZVJhZGlvT3B0aW9uJ10oe30sIGNoZWNrZWQsIGl0ZW0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXJNZXRob2QgKHsgb3B0aW9uLCByb3csIGNvbHVtbiB9OiBhbnkpIHtcclxuICBsZXQgeyBkYXRhIH0gPSBvcHRpb25cclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gZGF0YVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJPcHRpb25zIChoOiBGdW5jdGlvbiwgb3B0aW9uczogYW55LCBvcHRpb25Qcm9wczogYW55KSB7XHJcbiAgbGV0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICBsZXQgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gIGxldCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgcmV0dXJuIFhFVXRpbHMubWFwKG9wdGlvbnMsIChpdGVtOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHRpb24nLCB7XHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgdmFsdWU6IGl0ZW1bdmFsdWVQcm9wXSxcclxuICAgICAgICBkaXNhYmxlZDogaXRlbVtkaXNhYmxlZFByb3BdXHJcbiAgICAgIH0sXHJcbiAgICAgIGtleTogaW5kZXhcclxuICAgIH0sIGl0ZW1bbGFiZWxQcm9wXSlcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBjZWxsVGV4dCAoaDogRnVuY3Rpb24sIGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgcmV0dXJuIFsnJyArIChpc0VtcHR5VmFsdWUoY2VsbFZhbHVlKSA/ICcnIDogY2VsbFZhbHVlKV1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRm9ybUl0ZW1SZW5kZXIgKGRlZmF1bHRQcm9wcz86IGFueSkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gICAgbGV0IHsgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xyXG4gICAgbGV0IHsgbmFtZSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgbGV0IHsgYXR0cnMgfTogYW55ID0gcmVuZGVyT3B0c1xyXG4gICAgbGV0IHByb3BzOiBhbnkgPSBnZXRGb3JtSXRlbVByb3BzKHBhcmFtcywgcmVuZGVyT3B0cywgZGVmYXVsdFByb3BzKVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChuYW1lLCB7XHJcbiAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSksXHJcbiAgICAgICAgICBjYWxsYmFjayAodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBYRVV0aWxzLnNldChkYXRhLCBwcm9wZXJ0eSwgdmFsdWUpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjogZ2V0Rm9ybUV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0pXHJcbiAgICBdXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlciAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBjb25zdCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgY29uc3QgcHJvcHM6IGFueSA9IGdldEZvcm1JdGVtUHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gIHJldHVybiBbXHJcbiAgICBoKCdhLWJ1dHRvbicsIHtcclxuICAgICAgYXR0cnMsXHJcbiAgICAgIHByb3BzLFxyXG4gICAgICBvbjogZ2V0Rm9ybUV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICB9LCBjZWxsVGV4dChoLCBwcm9wcy5jb250ZW50KSlcclxuICBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25zSXRlbVJlbmRlciAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICByZXR1cm4gcmVuZGVyT3B0cy5jaGlsZHJlbi5tYXAoKGNoaWxkUmVuZGVyT3B0czogYW55KSA9PiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlcihoLCBjaGlsZFJlbmRlck9wdHMsIHBhcmFtcylbMF0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZvcm1JdGVtUHJvcHMgKHsgJGZvcm0gfTogYW55LCB7IHByb3BzIH06IGFueSwgZGVmYXVsdFByb3BzPzogYW55KSB7XHJcbiAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKCRmb3JtLnZTaXplID8geyBzaXplOiAkZm9ybS52U2l6ZSB9IDoge30sIGRlZmF1bHRQcm9wcywgcHJvcHMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZvcm1FdmVudHMgKHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyBldmVudHMgfTogYW55ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7ICRmb3JtIH0gPSBwYXJhbXNcclxuICBsZXQgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICBjYXNlICdBQXV0b0NvbXBsZXRlJzpcclxuICAgICAgdHlwZSA9ICdzZWxlY3QnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXQnOlxyXG4gICAgICB0eXBlID0gJ2lucHV0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0TnVtYmVyJzpcclxuICAgICAgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIGxldCBvbiA9IHtcclxuICAgIFt0eXBlXTogKGV2bnQ6IGFueSkgPT4ge1xyXG4gICAgICAkZm9ybS51cGRhdGVTdGF0dXMocGFyYW1zKVxyXG4gICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgIGV2ZW50c1t0eXBlXShwYXJhbXMsIGV2bnQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgaWYgKGV2ZW50cykge1xyXG4gICAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKHt9LCBYRVV0aWxzLm9iamVjdE1hcChldmVudHMsIChjYjogRnVuY3Rpb24pID0+IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICBjYi5hcHBseShudWxsLCBbcGFyYW1zXS5jb25jYXQuYXBwbHkocGFyYW1zLCBhcmdzKSlcclxuICAgIH0pLCBvbilcclxuICB9XHJcbiAgcmV0dXJuIG9uXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QgKGRlZmF1bHRGb3JtYXQ6IHN0cmluZywgaXNFZGl0PzogYm9vbGVhbikge1xyXG4gIGNvbnN0IHJlbmRlclByb3BlcnR5ID0gaXNFZGl0ID8gJ2VkaXRSZW5kZXInIDogJ2NlbGxSZW5kZXInXHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChwYXJhbXM6IGFueSkge1xyXG4gICAgcmV0dXJuIGdldERhdGVQaWNrZXJDZWxsVmFsdWUocGFyYW1zLmNvbHVtbltyZW5kZXJQcm9wZXJ0eV0sIHBhcmFtcywgZGVmYXVsdEZvcm1hdClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUV4cG9ydE1ldGhvZCAodmFsdWVNZXRob2Q6IEZ1bmN0aW9uLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogYW55KSB7XHJcbiAgICByZXR1cm4gdmFsdWVNZXRob2QocGFyYW1zLmNvbHVtbltyZW5kZXJQcm9wZXJ0eV0sIHBhcmFtcylcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlciAoKSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgICBsZXQgeyBuYW1lLCBvcHRpb25zLCBvcHRpb25Qcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICBsZXQgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgbGV0IHByb3BzOiBhbnkgPSBnZXRGb3JtSXRlbVByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgIGxldCBsYWJlbFByb3A6IHN0cmluZyA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgIGxldCB2YWx1ZVByb3A6IHN0cmluZyA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICAgIGxldCBkaXNhYmxlZFByb3A6IHN0cmluZyA9IG9wdGlvblByb3BzLmRpc2FibGVkIHx8ICdkaXNhYmxlZCdcclxuICAgIHJldHVybiBbXHJcbiAgICAgIGgoYCR7bmFtZX1Hcm91cGAsIHtcclxuICAgICAgICBwcm9wcyxcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KSxcclxuICAgICAgICAgIGNhbGxiYWNrIChjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBYRVV0aWxzLnNldChkYXRhLCBwcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IGdldEZvcm1FdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICB9LCBvcHRpb25zLm1hcCgob3B0aW9uOiBhbnkpID0+IHtcclxuICAgICAgICByZXR1cm4gaChuYW1lLCB7XHJcbiAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICB2YWx1ZTogb3B0aW9uW3ZhbHVlUHJvcF0sXHJcbiAgICAgICAgICAgIGRpc2FibGVkOiBvcHRpb25bZGlzYWJsZWRQcm9wXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIG9wdGlvbltsYWJlbFByb3BdKVxyXG4gICAgICB9KSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmuLLmn5Plh73mlbBcclxuICovXHJcbmNvbnN0IHJlbmRlck1hcCA9IHtcclxuICBBQXV0b0NvbXBsZXRlOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFJbnB1dDoge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBSW5wdXROdW1iZXI6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dC1udW1iZXItaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFTZWxlY3Q6IHtcclxuICAgIHJlbmRlckVkaXQgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IG9wdGlvbnMsIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBsZXQgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSksXHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBYRVV0aWxzLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXA6IGFueSwgZ0luZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSksXHJcbiAgICAgICAgICAgIGNhbGxiYWNrIChjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCBjZWxsVmFsdWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjogZ2V0Q2VsbEV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZW5kZXJDZWxsIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0U2VsZWN0Q2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyRmlsdGVyIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgICAgIGxldCB7IG9wdGlvbnMsIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCB7IGF0dHJzLCBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gICAgICBsZXQgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcclxuICAgICAgICBsZXQgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGxldCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICB2YWx1ZTogaXRlbS5kYXRhLFxyXG4gICAgICAgICAgICAgIGNhbGxiYWNrIChvcHRpb25WYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmRhdGEgPSBvcHRpb25WYWx1ZVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb246IGdldEZpbHRlckV2ZW50cyh7XHJcbiAgICAgICAgICAgICAgW3R5cGVdICh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKHBhcmFtcywgY29sdW1uLCB2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwLCBpdGVtKVxyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICAgICAgICAgICAgZXZlbnRzW3R5cGVdKHBhcmFtcywgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgICB9LCBYRVV0aWxzLm1hcChvcHRpb25Hcm91cHMsIChncm91cDogYW55LCBnSW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgIGtleTogZ0luZGV4XHJcbiAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xyXG4gICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxyXG4gICAgICAgICAgICApKVxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICAgICAgY2FsbGJhY2sgKG9wdGlvblZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICBpdGVtLmRhdGEgPSBvcHRpb25WYWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgb246IGdldEZpbHRlckV2ZW50cyh7XHJcbiAgICAgICAgICAgIGNoYW5nZSAodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIocGFyYW1zLCBjb2x1bW4sIHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDAsIGl0ZW0pXHJcbiAgICAgICAgICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50c1t0eXBlXShwYXJhbXMsIHZhbHVlKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSwgcmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGZpbHRlck1ldGhvZCAoeyBvcHRpb24sIHJvdywgY29sdW1uIH06IGFueSkge1xyXG4gICAgICBsZXQgeyBkYXRhIH0gPSBvcHRpb25cclxuICAgICAgbGV0IHsgcHJvcGVydHksIGZpbHRlclJlbmRlcjogcmVuZGVyT3B0cyB9ID0gY29sdW1uXHJcbiAgICAgIGxldCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgcHJvcGVydHkpXHJcbiAgICAgIGlmIChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnKSB7XHJcbiAgICAgICAgaWYgKFhFVXRpbHMuaXNBcnJheShjZWxsVmFsdWUpKSB7XHJcbiAgICAgICAgICByZXR1cm4gWEVVdGlscy5pbmNsdWRlQXJyYXlzKGNlbGxWYWx1ZSwgZGF0YSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGEuaW5kZXhPZihjZWxsVmFsdWUpID4gLTFcclxuICAgICAgfVxyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cclxuICAgICAgcmV0dXJuIGNlbGxWYWx1ZSA9PSBkYXRhXHJcbiAgICB9LFxyXG4gICAgcmVuZGVySXRlbSAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gICAgICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBwcm9wczogYW55ID0gZ2V0Rm9ybUl0ZW1Qcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcclxuICAgICAgICBsZXQgZ3JvdXBPcHRpb25zOiBzdHJpbmcgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgbGV0IGdyb3VwTGFiZWw6IHN0cmluZyA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSksXHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBYRVV0aWxzLnNldChkYXRhLCBwcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb246IGdldEZvcm1FdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXA6IGFueSwgZ0luZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChkYXRhLCBwcm9wZXJ0eSksXHJcbiAgICAgICAgICAgIGNhbGxiYWNrIChjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIFhFVXRpbHMuc2V0KGRhdGEsIHByb3BlcnR5LCBjZWxsVmFsdWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjogZ2V0Rm9ybUV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0U2VsZWN0Q2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0U2VsZWN0Q2VsbFZhbHVlLCB0cnVlKVxyXG4gIH0sXHJcbiAgQUNhc2NhZGVyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0Q2FzY2FkZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldENhc2NhZGVyQ2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0Q2FzY2FkZXJDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBRGF0ZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTS1ERCcpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0tREQnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NLUREJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFNb250aFBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTScpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0nKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLU1NJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFSYW5nZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVdlZWtQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktV1flkagnKSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLVdX5ZGoJyksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1XV+WRqCcsIHRydWUpXHJcbiAgfSxcclxuICBBVGltZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignSEg6bW06c3MnKSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdISDptbTpzcycpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ0hIOm1tOnNzJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFUcmVlU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFRyZWVTZWxlY3RDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBUmF0ZToge1xyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFTd2l0Y2g6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBUmFkaW86IHtcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlcigpXHJcbiAgfSxcclxuICBBQ2hlY2tib3g6IHtcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmFkaW9BbmRDaGVja2JveFJlbmRlcigpXHJcbiAgfSxcclxuICBBQnV0dG9uOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0QnV0dG9uRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVySXRlbTogZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXJcclxuICB9LFxyXG4gIEFCdXR0b25zOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJJdGVtOiBkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXJcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDkuovku7blhbzlrrnmgKflpITnkIZcclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZUNsZWFyRXZlbnQgKHBhcmFtczogYW55LCBldm50OiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gIGNvbnN0IHsgJHRhYmxlIH0gPSBwYXJhbXNcclxuICBjb25zdCBnZXRFdmVudFRhcmdldE5vZGUgPSAkdGFibGUgPyAkdGFibGUuZ2V0RXZlbnRUYXJnZXROb2RlIDogY29udGV4dC5nZXRFdmVudFRhcmdldE5vZGVcclxuICBjb25zdCBib2R5RWxlbTogSFRNTEVsZW1lbnQgPSBkb2N1bWVudC5ib2R5XHJcbiAgaWYgKFxyXG4gICAgLy8g5LiL5ouJ5qGGXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtc2VsZWN0LWRyb3Bkb3duJykuZmxhZyB8fFxyXG4gICAgLy8g57qn6IGUXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FzY2FkZXItbWVudXMnKS5mbGFnIHx8XHJcbiAgICAvLyDml6XmnJ9cclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYWxlbmRhci1waWNrZXItY29udGFpbmVyJykuZmxhZyB8fFxyXG4gICAgLy8g5pe26Ze06YCJ5oupXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtdGltZS1waWNrZXItcGFuZWwnKS5mbGFnXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDln7rkuo4gdnhlLXRhYmxlIOihqOagvOeahOmAgumFjeaPkuS7tu+8jOeUqOS6juWFvOWuuSBhbnQtZGVzaWduLXZ1ZSDnu4Tku7blupNcclxuICovXHJcbmV4cG9ydCBjb25zdCBWWEVUYWJsZVBsdWdpbkFudGQgPSB7XHJcbiAgaW5zdGFsbCAoeHRhYmxlOiB0eXBlb2YgVlhFVGFibGUpIHtcclxuICAgIGxldCB7IGludGVyY2VwdG9yLCByZW5kZXJlciB9ID0geHRhYmxlXHJcbiAgICByZW5kZXJlci5taXhpbihyZW5kZXJNYXApXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyRmlsdGVyJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJBY3RpdmVkJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvTW9tZW50U3RyaW5nIChjZWxsVmFsdWU6IGFueSwgZm9ybWF0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPyBjZWxsVmFsdWUuZm9ybWF0KGZvcm1hdCkgOiAnJ1xyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSAneGUtdXRpbHMvbWV0aG9kcy94ZS11dGlscycge1xyXG4gIGludGVyZmFjZSBYRVV0aWxzTWV0aG9kcyB7XHJcbiAgICAvKipcclxuICAgICAqIOWwhiBNb21lbnQg5pel5pyf5qC85byP5YyW5Li65a2X56ym5LiyXHJcbiAgICAgKiBAcGFyYW0gY2VsbFZhbHVlIOWAvFxyXG4gICAgICogQHBhcmFtIGZvcm1hdCDmoLzlvI/ljJZcclxuICAgICAqL1xyXG4gICAgdG9Nb21lbnRTdHJpbmc6IHR5cGVvZiB0b01vbWVudFN0cmluZztcclxuICB9XHJcbn1cclxuXHJcblhFVXRpbHMubWl4aW4oe1xyXG4gIHRvTW9tZW50U3RyaW5nXHJcbn0pXHJcblxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LlZYRVRhYmxlKSB7XHJcbiAgd2luZG93LlZYRVRhYmxlLnVzZShWWEVUYWJsZVBsdWdpbkFudGQpXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IFZYRVRhYmxlUGx1Z2luQW50ZFxyXG4iXX0=
