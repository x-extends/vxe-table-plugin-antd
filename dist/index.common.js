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
  return function (h, renderOpts, params) {
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
  return function (h, renderOpts, params) {
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
  return function (h, renderOpts, params) {
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
    renderFilter: function renderFilter(h, renderOpts, params) {
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
    renderItem: function renderItem(h, renderOpts, params) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbImlzRW1wdHlWYWx1ZSIsImNlbGxWYWx1ZSIsInVuZGVmaW5lZCIsIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiWEVVdGlscyIsImVhY2giLCJpdGVtIiwidmFsdWUiLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsInJlbmRlck9wdHMiLCJwYXJhbXMiLCJjZWxsVGV4dCIsImdldERhdGVQaWNrZXJDZWxsVmFsdWUiLCJnZXRQcm9wcyIsImRlZmF1bHRQcm9wcyIsIiR0YWJsZSIsInByb3BzIiwiYXNzaWduIiwidlNpemUiLCJzaXplIiwiZ2V0Q2VsbEV2ZW50cyIsIm5hbWUiLCJldmVudHMiLCJ0eXBlIiwib24iLCJldm50IiwidXBkYXRlU3RhdHVzIiwib2JqZWN0TWFwIiwiY2IiLCJhcmdzIiwiYXBwbHkiLCJjb25jYXQiLCJnZXRTZWxlY3RDZWxsVmFsdWUiLCJvcHRpb25zIiwib3B0aW9uR3JvdXBzIiwib3B0aW9uUHJvcHMiLCJvcHRpb25Hcm91cFByb3BzIiwicm93IiwiY29sdW1uIiwibGFiZWxQcm9wIiwidmFsdWVQcm9wIiwiZ3JvdXBPcHRpb25zIiwiZ2V0IiwicHJvcGVydHkiLCJtYXAiLCJtb2RlIiwic2VsZWN0SXRlbSIsImZpbmQiLCJqb2luIiwiZ2V0Q2FzY2FkZXJDZWxsVmFsdWUiLCJzaG93QWxsTGV2ZWxzIiwic2xpY2UiLCJzZXBhcmF0b3IiLCJnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSIsImRhdGUiLCJmb3JtYXQiLCJnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlIiwidHJlZUNoZWNrYWJsZSIsIm11bHRpcGxlIiwiY3JlYXRlRWRpdFJlbmRlciIsImF0dHJzIiwibW9kZWwiLCJjYWxsYmFjayIsInNldCIsImRlZmF1bHRCdXR0b25FZGl0UmVuZGVyIiwiY29udGVudCIsImRlZmF1bHRCdXR0b25zRWRpdFJlbmRlciIsImNoaWxkUmVuZGVyT3B0cyIsImdldEZpbHRlckV2ZW50cyIsImNyZWF0ZUZpbHRlclJlbmRlciIsImZpbHRlcnMiLCJkYXRhIiwib3B0aW9uVmFsdWUiLCJoYW5kbGVDb25maXJtRmlsdGVyIiwiY2hlY2tlZCIsIiRwYW5lbCIsImNvbnRleHQiLCJmaWx0ZXJNdWx0aXBsZSIsImRlZmF1bHRGaWx0ZXJNZXRob2QiLCJvcHRpb24iLCJyZW5kZXJPcHRpb25zIiwiZGlzYWJsZWRQcm9wIiwiZGlzYWJsZWQiLCJrZXkiLCJjcmVhdGVGb3JtSXRlbVJlbmRlciIsImdldEZvcm1JdGVtUHJvcHMiLCJnZXRGb3JtRXZlbnRzIiwiZGVmYXVsdEJ1dHRvbkl0ZW1SZW5kZXIiLCJkZWZhdWx0QnV0dG9uc0l0ZW1SZW5kZXIiLCIkZm9ybSIsImNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QiLCJpc0VkaXQiLCJyZW5kZXJQcm9wZXJ0eSIsImNyZWF0ZUV4cG9ydE1ldGhvZCIsInZhbHVlTWV0aG9kIiwiY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyIiwicmVuZGVyTWFwIiwiQUF1dG9Db21wbGV0ZSIsImF1dG9mb2N1cyIsInJlbmRlckRlZmF1bHQiLCJyZW5kZXJFZGl0IiwicmVuZGVyRmlsdGVyIiwiZmlsdGVyTWV0aG9kIiwicmVuZGVySXRlbSIsIkFJbnB1dCIsIkFJbnB1dE51bWJlciIsIkFTZWxlY3QiLCJncm91cExhYmVsIiwiZ3JvdXAiLCJnSW5kZXgiLCJzbG90IiwicmVuZGVyQ2VsbCIsImNoYW5nZSIsImZpbHRlclJlbmRlciIsImlzQXJyYXkiLCJpbmNsdWRlQXJyYXlzIiwiaW5kZXhPZiIsImNlbGxFeHBvcnRNZXRob2QiLCJlZGl0Q2VsbEV4cG9ydE1ldGhvZCIsIkFDYXNjYWRlciIsIkFEYXRlUGlja2VyIiwiQU1vbnRoUGlja2VyIiwiQVJhbmdlUGlja2VyIiwiQVdlZWtQaWNrZXIiLCJBVGltZVBpY2tlciIsIkFUcmVlU2VsZWN0IiwiQVJhdGUiLCJBU3dpdGNoIiwiQVJhZGlvIiwiQUNoZWNrYm94IiwiQUJ1dHRvbiIsIkFCdXR0b25zIiwiaGFuZGxlQ2xlYXJFdmVudCIsImdldEV2ZW50VGFyZ2V0Tm9kZSIsImJvZHlFbGVtIiwiZG9jdW1lbnQiLCJib2R5IiwiZmxhZyIsIlZYRVRhYmxlUGx1Z2luQW50ZCIsImluc3RhbGwiLCJ4dGFibGUiLCJpbnRlcmNlcHRvciIsInJlbmRlcmVyIiwibWl4aW4iLCJhZGQiLCJ0b01vbWVudFN0cmluZyIsIndpbmRvdyIsIlZYRVRhYmxlIiwidXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUdBLFNBQVNBLFlBQVQsQ0FBdUJDLFNBQXZCLEVBQXFDO0FBQ25DLFNBQU9BLFNBQVMsS0FBSyxJQUFkLElBQXNCQSxTQUFTLEtBQUtDLFNBQXBDLElBQWlERCxTQUFTLEtBQUssRUFBdEU7QUFDRDs7QUFFRCxTQUFTRSxpQkFBVCxDQUE0QkMsS0FBNUIsRUFBMkNDLElBQTNDLEVBQTZEQyxNQUE3RCxFQUFpRkMsTUFBakYsRUFBbUc7QUFDakcsTUFBSUMsR0FBRyxHQUFHRixNQUFNLENBQUNGLEtBQUQsQ0FBaEI7O0FBQ0EsTUFBSUMsSUFBSSxJQUFJQyxNQUFNLENBQUNHLE1BQVAsR0FBZ0JMLEtBQTVCLEVBQW1DO0FBQ2pDTSx3QkFBUUMsSUFBUixDQUFhTixJQUFiLEVBQW1CLFVBQUNPLElBQUQsRUFBYztBQUMvQixVQUFJQSxJQUFJLENBQUNDLEtBQUwsS0FBZUwsR0FBbkIsRUFBd0I7QUFDdEJELFFBQUFBLE1BQU0sQ0FBQ08sSUFBUCxDQUFZRixJQUFJLENBQUNHLEtBQWpCO0FBQ0FaLFFBQUFBLGlCQUFpQixDQUFDLEVBQUVDLEtBQUgsRUFBVVEsSUFBSSxDQUFDSSxRQUFmLEVBQXlCVixNQUF6QixFQUFpQ0MsTUFBakMsQ0FBakI7QUFDRDtBQUNGLEtBTEQ7QUFNRDtBQUNGOztBQUVELFNBQVNVLGdCQUFULENBQTJCQyxhQUEzQixFQUFn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QUFwQjtBQUNEOztlQUVjQSxrQiIsImZpbGUiOiJpbmRleC5jb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgWEVVdGlscyBmcm9tICd4ZS11dGlscy9tZXRob2RzL3hlLXV0aWxzJ1xyXG5pbXBvcnQgVlhFVGFibGUgZnJvbSAndnhlLXRhYmxlL2xpYi92eGUtdGFibGUnXHJcblxyXG5mdW5jdGlvbiBpc0VtcHR5VmFsdWUgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gbnVsbCB8fCBjZWxsVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBjZWxsVmFsdWUgPT09ICcnXHJcbn1cclxuXHJcbmZ1bmN0aW9uIG1hdGNoQ2FzY2FkZXJEYXRhIChpbmRleDogbnVtYmVyLCBsaXN0OiBBcnJheTxhbnk+LCB2YWx1ZXM6IEFycmF5PGFueT4sIGxhYmVsczogQXJyYXk8YW55Pikge1xyXG4gIGxldCB2YWwgPSB2YWx1ZXNbaW5kZXhdXHJcbiAgaWYgKGxpc3QgJiYgdmFsdWVzLmxlbmd0aCA+IGluZGV4KSB7XHJcbiAgICBYRVV0aWxzLmVhY2gobGlzdCwgKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS52YWx1ZSA9PT0gdmFsKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goaXRlbS5sYWJlbClcclxuICAgICAgICBtYXRjaENhc2NhZGVyRGF0YSgrK2luZGV4LCBpdGVtLmNoaWxkcmVuLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdERhdGVQaWNrZXIgKGRlZmF1bHRGb3JtYXQ6IHN0cmluZykge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXREYXRlUGlja2VyQ2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcywgZGVmYXVsdEZvcm1hdCkpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQcm9wcyAoeyAkdGFibGUgfTogYW55LCB7IHByb3BzIH06IGFueSwgZGVmYXVsdFByb3BzPzogYW55KSB7XHJcbiAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKCR0YWJsZS52U2l6ZSA/IHsgc2l6ZTogJHRhYmxlLnZTaXplIH0gOiB7fSwgZGVmYXVsdFByb3BzLCBwcm9wcylcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2VsbEV2ZW50cyAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IG5hbWUsIGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7ICR0YWJsZSB9ID0gcGFyYW1zXHJcbiAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gIHN3aXRjaCAobmFtZSkge1xyXG4gICAgY2FzZSAnQUF1dG9Db21wbGV0ZSc6XHJcbiAgICAgIHR5cGUgPSAnc2VsZWN0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgdHlwZSA9ICdpbnB1dCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dE51bWJlcic6XHJcbiAgICAgIHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICBicmVha1xyXG4gIH1cclxuICBsZXQgb24gPSB7XHJcbiAgICBbdHlwZV06IChldm50OiBhbnkpID0+IHtcclxuICAgICAgJHRhYmxlLnVwZGF0ZVN0YXR1cyhwYXJhbXMpXHJcbiAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgZXZlbnRzW3R5cGVdKHBhcmFtcywgZXZudClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoZXZlbnRzKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5hc3NpZ24oe30sIFhFVXRpbHMub2JqZWN0TWFwKGV2ZW50cywgKGNiOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGNiLmFwcGx5KG51bGwsIFtwYXJhbXNdLmNvbmNhdC5hcHBseShwYXJhbXMsIGFyZ3MpKVxyXG4gICAgfSksIG9uKVxyXG4gIH1cclxuICByZXR1cm4gb25cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0U2VsZWN0Q2VsbFZhbHVlIChyZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBwcm9wcyA9IHt9LCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICBsZXQgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gIGxldCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmICghaXNFbXB0eVZhbHVlKGNlbGxWYWx1ZSkpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLm1hcChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnID8gY2VsbFZhbHVlIDogW2NlbGxWYWx1ZV0sIG9wdGlvbkdyb3VwcyA/ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgIGxldCBzZWxlY3RJdGVtXHJcbiAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvcHRpb25Hcm91cHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25Hcm91cHNbaW5kZXhdW2dyb3VwT3B0aW9uc10sIChpdGVtOiBhbnkpID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXHJcbiAgICAgICAgaWYgKHNlbGVjdEl0ZW0pIHtcclxuICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBzZWxlY3RJdGVtID8gc2VsZWN0SXRlbVtsYWJlbFByb3BdIDogdmFsdWVcclxuICAgIH0gOiAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICBsZXQgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25zLCAoaXRlbTogYW55KSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICByZXR1cm4gc2VsZWN0SXRlbSA/IHNlbGVjdEl0ZW1bbGFiZWxQcm9wXSA6IHZhbHVlXHJcbiAgICB9KS5qb2luKCcsICcpXHJcbiAgfVxyXG4gIHJldHVybiBudWxsXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENhc2NhZGVyQ2VsbFZhbHVlIChyZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgbGV0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgdmFyIHZhbHVlcyA9IGNlbGxWYWx1ZSB8fCBbXVxyXG4gIHZhciBsYWJlbHM6IEFycmF5PGFueT4gPSBbXVxyXG4gIG1hdGNoQ2FzY2FkZXJEYXRhKDAsIHByb3BzLm9wdGlvbnMsIHZhbHVlcywgbGFiZWxzKVxyXG4gIHJldHVybiAocHJvcHMuc2hvd0FsbExldmVscyA9PT0gZmFsc2UgPyBsYWJlbHMuc2xpY2UobGFiZWxzLmxlbmd0aCAtIDEsIGxhYmVscy5sZW5ndGgpIDogbGFiZWxzKS5qb2luKGAgJHtwcm9wcy5zZXBhcmF0b3IgfHwgJy8nfSBgKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRSYW5nZVBpY2tlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmIChjZWxsVmFsdWUpIHtcclxuICAgIGNlbGxWYWx1ZSA9IFhFVXRpbHMubWFwKGNlbGxWYWx1ZSwgKGRhdGU6IGFueSkgPT4gZGF0ZS5mb3JtYXQocHJvcHMuZm9ybWF0IHx8ICdZWVlZLU1NLUREJykpLmpvaW4oJyB+ICcpXHJcbiAgfVxyXG4gIHJldHVybiBjZWxsVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIGlmIChjZWxsVmFsdWUgJiYgKHByb3BzLnRyZWVDaGVja2FibGUgfHwgcHJvcHMubXVsdGlwbGUpKSB7XHJcbiAgICBjZWxsVmFsdWUgPSBjZWxsVmFsdWUuam9pbignOycpXHJcbiAgfVxyXG4gIHJldHVybiBjZWxsVmFsdWVcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZSAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgZGVmYXVsdEZvcm1hdDogc3RyaW5nKSB7XHJcbiAgbGV0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgZGVmYXVsdEZvcm1hdClcclxuICB9XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFZGl0UmVuZGVyIChkZWZhdWx0UHJvcHM/OiBhbnkpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzLCBkZWZhdWx0UHJvcHMpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKHJlbmRlck9wdHMubmFtZSwge1xyXG4gICAgICAgIHByb3BzLFxyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgICAgY2FsbGJhY2sgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIHZhbHVlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICB9KVxyXG4gICAgXVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgY29uc3QgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIGNvbnN0IHByb3BzOiBhbnkgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgcmV0dXJuIFtcclxuICAgIGgoJ2EtYnV0dG9uJywge1xyXG4gICAgICBhdHRycyxcclxuICAgICAgcHJvcHMsXHJcbiAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgIH0sIGNlbGxUZXh0KGgsIHJlbmRlck9wdHMuY29udGVudCkpXHJcbiAgXVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0QnV0dG9uc0VkaXRSZW5kZXIgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgcmV0dXJuIHJlbmRlck9wdHMuY2hpbGRyZW4ubWFwKChjaGlsZFJlbmRlck9wdHM6IGFueSkgPT4gZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIoaCwgY2hpbGRSZW5kZXJPcHRzLCBwYXJhbXMpWzBdKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGaWx0ZXJFdmVudHMgKG9uOiBhbnksIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBpZiAoZXZlbnRzKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5hc3NpZ24oe30sIFhFVXRpbHMub2JqZWN0TWFwKGV2ZW50cywgKGNiOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGNiLmFwcGx5KG51bGwsIFtwYXJhbXNdLmNvbmNhdChhcmdzKSlcclxuICAgIH0pLCBvbilcclxuICB9XHJcbiAgcmV0dXJuIG9uXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZpbHRlclJlbmRlciAoZGVmYXVsdFByb3BzPzogYW55KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgbGV0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgIGxldCB7IG5hbWUsIGF0dHJzLCBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICBjYXNlICdBQXV0b0NvbXBsZXRlJzpcclxuICAgICAgICB0eXBlID0gJ3NlbGVjdCdcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdBSW5wdXQnOlxyXG4gICAgICAgIHR5cGUgPSAnaW5wdXQnXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnQUlucHV0TnVtYmVyJzpcclxuICAgICAgICB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICBwcm9wcyxcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICAgIGNhbGxiYWNrIChvcHRpb25WYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGl0ZW0uZGF0YSA9IG9wdGlvblZhbHVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjogZ2V0RmlsdGVyRXZlbnRzKHtcclxuICAgICAgICAgIFt0eXBlXSAoZXZudDogYW55KSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIocGFyYW1zLCBjb2x1bW4sICEhaXRlbS5kYXRhLCBpdGVtKVxyXG4gICAgICAgICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgICAgICAgIGV2ZW50c1t0eXBlXShwYXJhbXMsIGV2bnQpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgIH0pXHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ29uZmlybUZpbHRlciAocGFyYW1zOiBhbnksIGNvbHVtbjogYW55LCBjaGVja2VkOiBhbnksIGl0ZW06IGFueSkge1xyXG4gIGNvbnN0ICRwYW5lbCA9IHBhcmFtcy4kcGFuZWwgfHwgcGFyYW1zLmNvbnRleHRcclxuICAkcGFuZWxbY29sdW1uLmZpbHRlck11bHRpcGxlID8gJ2NoYW5nZU11bHRpcGxlT3B0aW9uJyA6ICdjaGFuZ2VSYWRpb09wdGlvbiddKHt9LCBjaGVja2VkLCBpdGVtKVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyTWV0aG9kICh7IG9wdGlvbiwgcm93LCBjb2x1bW4gfTogYW55KSB7XHJcbiAgbGV0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPT09IGRhdGFcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyT3B0aW9ucyAoaDogRnVuY3Rpb24sIG9wdGlvbnM6IGFueSwgb3B0aW9uUHJvcHM6IGFueSkge1xyXG4gIGxldCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgbGV0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICBsZXQgZGlzYWJsZWRQcm9wID0gb3B0aW9uUHJvcHMuZGlzYWJsZWQgfHwgJ2Rpc2FibGVkJ1xyXG4gIHJldHVybiBYRVV0aWxzLm1hcChvcHRpb25zLCAoaXRlbTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0aW9uJywge1xyXG4gICAgICBwcm9wczoge1xyXG4gICAgICAgIHZhbHVlOiBpdGVtW3ZhbHVlUHJvcF0sXHJcbiAgICAgICAgZGlzYWJsZWQ6IGl0ZW1bZGlzYWJsZWRQcm9wXVxyXG4gICAgICB9LFxyXG4gICAgICBrZXk6IGluZGV4XHJcbiAgICB9LCBpdGVtW2xhYmVsUHJvcF0pXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2VsbFRleHQgKGg6IEZ1bmN0aW9uLCBjZWxsVmFsdWU6IGFueSkge1xyXG4gIHJldHVybiBbJycgKyAoaXNFbXB0eVZhbHVlKGNlbGxWYWx1ZSkgPyAnJyA6IGNlbGxWYWx1ZSldXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZvcm1JdGVtUmVuZGVyIChkZWZhdWx0UHJvcHM/OiBhbnkpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICBsZXQgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBsZXQgeyBuYW1lIH0gPSByZW5kZXJPcHRzXHJcbiAgICBsZXQgeyBhdHRycyB9OiBhbnkgPSByZW5kZXJPcHRzXHJcbiAgICBsZXQgcHJvcHM6IGFueSA9IGdldEZvcm1JdGVtUHJvcHMocGFyYW1zLCByZW5kZXJPcHRzLCBkZWZhdWx0UHJvcHMpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKG5hbWUsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wcyxcclxuICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KSxcclxuICAgICAgICAgIGNhbGxiYWNrICh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIFhFVXRpbHMuc2V0KGRhdGEsIHByb3BlcnR5LCB2YWx1ZSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiBnZXRGb3JtRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgfSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRCdXR0b25JdGVtUmVuZGVyIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGNvbnN0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICBjb25zdCBwcm9wczogYW55ID0gZ2V0Rm9ybUl0ZW1Qcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgcmV0dXJuIFtcclxuICAgIGgoJ2EtYnV0dG9uJywge1xyXG4gICAgICBhdHRycyxcclxuICAgICAgcHJvcHMsXHJcbiAgICAgIG9uOiBnZXRGb3JtRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgIH0sIGNlbGxUZXh0KGgsIHByb3BzLmNvbnRlbnQpKVxyXG4gIF1cclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEJ1dHRvbnNJdGVtUmVuZGVyIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIHJldHVybiByZW5kZXJPcHRzLmNoaWxkcmVuLm1hcCgoY2hpbGRSZW5kZXJPcHRzOiBhbnkpID0+IGRlZmF1bHRCdXR0b25JdGVtUmVuZGVyKGgsIGNoaWxkUmVuZGVyT3B0cywgcGFyYW1zKVswXSlcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Rm9ybUl0ZW1Qcm9wcyAoeyAkZm9ybSB9OiBhbnksIHsgcHJvcHMgfTogYW55LCBkZWZhdWx0UHJvcHM/OiBhbnkpIHtcclxuICByZXR1cm4gWEVVdGlscy5hc3NpZ24oJGZvcm0udlNpemUgPyB7IHNpemU6ICRmb3JtLnZTaXplIH0gOiB7fSwgZGVmYXVsdFByb3BzLCBwcm9wcylcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Rm9ybUV2ZW50cyAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IGV2ZW50cyB9OiBhbnkgPSByZW5kZXJPcHRzXHJcbiAgbGV0IHsgJGZvcm0gfSA9IHBhcmFtc1xyXG4gIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgIGNhc2UgJ0FBdXRvQ29tcGxldGUnOlxyXG4gICAgICB0eXBlID0gJ3NlbGVjdCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dCc6XHJcbiAgICAgIHR5cGUgPSAnaW5wdXQnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXROdW1iZXInOlxyXG4gICAgICB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgbGV0IG9uID0ge1xyXG4gICAgW3R5cGVdOiAoZXZudDogYW55KSA9PiB7XHJcbiAgICAgICRmb3JtLnVwZGF0ZVN0YXR1cyhwYXJhbXMpXHJcbiAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgZXZlbnRzW3R5cGVdKHBhcmFtcywgZXZudClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoZXZlbnRzKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5hc3NpZ24oe30sIFhFVXRpbHMub2JqZWN0TWFwKGV2ZW50cywgKGNiOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGNiLmFwcGx5KG51bGwsIFtwYXJhbXNdLmNvbmNhdC5hcHBseShwYXJhbXMsIGFyZ3MpKVxyXG4gICAgfSksIG9uKVxyXG4gIH1cclxuICByZXR1cm4gb25cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCAoZGVmYXVsdEZvcm1hdDogc3RyaW5nLCBpc0VkaXQ/OiBib29sZWFuKSB7XHJcbiAgY29uc3QgcmVuZGVyUHJvcGVydHkgPSBpc0VkaXQgPyAnZWRpdFJlbmRlcicgOiAnY2VsbFJlbmRlcidcclxuICByZXR1cm4gZnVuY3Rpb24gKHBhcmFtczogYW55KSB7XHJcbiAgICByZXR1cm4gZ2V0RGF0ZVBpY2tlckNlbGxWYWx1ZShwYXJhbXMuY29sdW1uW3JlbmRlclByb3BlcnR5XSwgcGFyYW1zLCBkZWZhdWx0Rm9ybWF0KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRXhwb3J0TWV0aG9kICh2YWx1ZU1ldGhvZDogRnVuY3Rpb24sIGlzRWRpdD86IGJvb2xlYW4pIHtcclxuICBjb25zdCByZW5kZXJQcm9wZXJ0eSA9IGlzRWRpdCA/ICdlZGl0UmVuZGVyJyA6ICdjZWxsUmVuZGVyJ1xyXG4gIHJldHVybiBmdW5jdGlvbiAocGFyYW1zOiBhbnkpIHtcclxuICAgIHJldHVybiB2YWx1ZU1ldGhvZChwYXJhbXMuY29sdW1uW3JlbmRlclByb3BlcnR5XSwgcGFyYW1zKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyICgpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICBsZXQgeyBuYW1lLCBvcHRpb25zLCBvcHRpb25Qcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICBsZXQgeyBkYXRhLCBwcm9wZXJ0eSB9ID0gcGFyYW1zXHJcbiAgICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgbGV0IHByb3BzOiBhbnkgPSBnZXRGb3JtSXRlbVByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgIGxldCBsYWJlbFByb3A6IHN0cmluZyA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgIGxldCB2YWx1ZVByb3A6IHN0cmluZyA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICAgIGxldCBkaXNhYmxlZFByb3A6IHN0cmluZyA9IG9wdGlvblByb3BzLmRpc2FibGVkIHx8ICdkaXNhYmxlZCdcclxuICAgIHJldHVybiBbXHJcbiAgICAgIGgoYCR7bmFtZX1Hcm91cGAsIHtcclxuICAgICAgICBwcm9wcyxcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KSxcclxuICAgICAgICAgIGNhbGxiYWNrIChjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICBYRVV0aWxzLnNldChkYXRhLCBwcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IGdldEZvcm1FdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICB9LCBvcHRpb25zLm1hcCgob3B0aW9uOiBhbnkpID0+IHtcclxuICAgICAgICByZXR1cm4gaChuYW1lLCB7XHJcbiAgICAgICAgICBwcm9wczoge1xyXG4gICAgICAgICAgICB2YWx1ZTogb3B0aW9uW3ZhbHVlUHJvcF0sXHJcbiAgICAgICAgICAgIGRpc2FibGVkOiBvcHRpb25bZGlzYWJsZWRQcm9wXVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIG9wdGlvbltsYWJlbFByb3BdKVxyXG4gICAgICB9KSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmuLLmn5Plh73mlbBcclxuICovXHJcbmNvbnN0IHJlbmRlck1hcCA9IHtcclxuICBBQXV0b0NvbXBsZXRlOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFJbnB1dDoge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBSW5wdXROdW1iZXI6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dC1udW1iZXItaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFTZWxlY3Q6IHtcclxuICAgIHJlbmRlckVkaXQgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IG9wdGlvbnMsIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBsZXQgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSksXHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBYRVV0aWxzLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXA6IGFueSwgZ0luZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSksXHJcbiAgICAgICAgICAgIGNhbGxiYWNrIChjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCBjZWxsVmFsdWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjogZ2V0Q2VsbEV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZW5kZXJDZWxsIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0U2VsZWN0Q2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyRmlsdGVyIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgeyBhdHRycywgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgICAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBsZXQgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICAgICAgICBjYWxsYmFjayAob3B0aW9uVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kYXRhID0gb3B0aW9uVmFsdWVcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uOiBnZXRGaWx0ZXJFdmVudHMoe1xyXG4gICAgICAgICAgICAgIFt0eXBlXSAodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihwYXJhbXMsIGNvbHVtbiwgdmFsdWUgJiYgdmFsdWUubGVuZ3RoID4gMCwgaXRlbSlcclxuICAgICAgICAgICAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgICAgICAgICAgIGV2ZW50c1t0eXBlXShwYXJhbXMsIHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgcmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXA6IGFueSwgZ0luZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrIChvcHRpb25WYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgaXRlbS5kYXRhID0gb3B0aW9uVmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9uOiBnZXRGaWx0ZXJFdmVudHMoe1xyXG4gICAgICAgICAgICBjaGFuZ2UgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKHBhcmFtcywgY29sdW1uLCB2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwLCBpdGVtKVxyXG4gICAgICAgICAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudHNbdHlwZV0ocGFyYW1zLCB2YWx1ZSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBmaWx0ZXJNZXRob2QgKHsgb3B0aW9uLCByb3csIGNvbHVtbiB9OiBhbnkpIHtcclxuICAgICAgbGV0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgICAgIGxldCB7IHByb3BlcnR5LCBmaWx0ZXJSZW5kZXI6IHJlbmRlck9wdHMgfSA9IGNvbHVtblxyXG4gICAgICBsZXQgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIHByb3BlcnR5KVxyXG4gICAgICBpZiAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJykge1xyXG4gICAgICAgIGlmIChYRVV0aWxzLmlzQXJyYXkoY2VsbFZhbHVlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIFhFVXRpbHMuaW5jbHVkZUFycmF5cyhjZWxsVmFsdWUsIGRhdGEpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhLmluZGV4T2YoY2VsbFZhbHVlKSA+IC0xXHJcbiAgICAgIH1cclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgICAgIHJldHVybiBjZWxsVmFsdWUgPT0gZGF0YVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW0gKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IG9wdGlvbnMsIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCB7IGRhdGEsIHByb3BlcnR5IH0gPSBwYXJhbXNcclxuICAgICAgbGV0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHByb3BzOiBhbnkgPSBnZXRGb3JtSXRlbVByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGxldCBncm91cE9wdGlvbnM6IHN0cmluZyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBsZXQgZ3JvdXBMYWJlbDogc3RyaW5nID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KSxcclxuICAgICAgICAgICAgICBjYWxsYmFjayAoY2VsbFZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIFhFVXRpbHMuc2V0KGRhdGEsIHByb3BlcnR5LCBjZWxsVmFsdWUpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbjogZ2V0Rm9ybUV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgICB9LCBYRVV0aWxzLm1hcChvcHRpb25Hcm91cHMsIChncm91cDogYW55LCBnSW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgIGtleTogZ0luZGV4XHJcbiAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xyXG4gICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxyXG4gICAgICAgICAgICApKVxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KGRhdGEsIHByb3BlcnR5KSxcclxuICAgICAgICAgICAgY2FsbGJhY2sgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgWEVVdGlscy5zZXQoZGF0YSwgcHJvcGVydHksIGNlbGxWYWx1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9uOiBnZXRGb3JtRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRTZWxlY3RDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRTZWxlY3RDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBQ2FzY2FkZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRDYXNjYWRlckNlbGxWYWx1ZShyZW5kZXJPcHRzLCBwYXJhbXMpKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKCksXHJcbiAgICBjZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0Q2FzY2FkZXJDZWxsVmFsdWUpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRDYXNjYWRlckNlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFEYXRlUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NLUREJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTS1ERCcpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0tREQnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQU1vbnRoUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnWVlZWS1NTScpLFxyXG4gICAgZWRpdENlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktTU0nLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVJhbmdlUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUocmVuZGVyT3B0cywgcGFyYW1zKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpLFxyXG4gICAgY2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRXhwb3J0TWV0aG9kKGdldFJhbmdlUGlja2VyQ2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0UmFuZ2VQaWNrZXJDZWxsVmFsdWUsIHRydWUpXHJcbiAgfSxcclxuICBBV2Vla1BpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1XV+WRqCcpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ1lZWVktV1flkagnKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVEYXRlUGlja2VyRXhwb3J0TWV0aG9kKCdZWVlZLVdX5ZGoJywgdHJ1ZSlcclxuICB9LFxyXG4gIEFUaW1lUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdISDptbTpzcycpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZURhdGVQaWNrZXJFeHBvcnRNZXRob2QoJ0hIOm1tOnNzJyksXHJcbiAgICBlZGl0Q2VsbEV4cG9ydE1ldGhvZDogY3JlYXRlRGF0ZVBpY2tlckV4cG9ydE1ldGhvZCgnSEg6bW06c3MnLCB0cnVlKVxyXG4gIH0sXHJcbiAgQVRyZWVTZWxlY3Q6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlKHJlbmRlck9wdHMsIHBhcmFtcykpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKSxcclxuICAgIGNlbGxFeHBvcnRNZXRob2Q6IGNyZWF0ZUV4cG9ydE1ldGhvZChnZXRUcmVlU2VsZWN0Q2VsbFZhbHVlKSxcclxuICAgIGVkaXRDZWxsRXhwb3J0TWV0aG9kOiBjcmVhdGVFeHBvcnRNZXRob2QoZ2V0VHJlZVNlbGVjdENlbGxWYWx1ZSwgdHJ1ZSlcclxuICB9LFxyXG4gIEFSYXRlOiB7XHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQVN3aXRjaDoge1xyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFSYWRpbzoge1xyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyKClcclxuICB9LFxyXG4gIEFDaGVja2JveDoge1xyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SYWRpb0FuZENoZWNrYm94UmVuZGVyKClcclxuICB9LFxyXG4gIEFCdXR0b246IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRCdXR0b25FZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEJ1dHRvbkVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJJdGVtOiBkZWZhdWx0QnV0dG9uSXRlbVJlbmRlclxyXG4gIH0sXHJcbiAgQUJ1dHRvbnM6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRCdXR0b25zRWRpdFJlbmRlcixcclxuICAgIHJlbmRlckl0ZW06IGRlZmF1bHRCdXR0b25zSXRlbVJlbmRlclxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOS6i+S7tuWFvOWuueaAp+WkhOeQhlxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlQ2xlYXJFdmVudCAocGFyYW1zOiBhbnksIGV2bnQ6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgY29uc3QgeyAkdGFibGUgfSA9IHBhcmFtc1xyXG4gIGNvbnN0IGdldEV2ZW50VGFyZ2V0Tm9kZSA9ICR0YWJsZSA/ICR0YWJsZS5nZXRFdmVudFRhcmdldE5vZGUgOiBjb250ZXh0LmdldEV2ZW50VGFyZ2V0Tm9kZVxyXG4gIGNvbnN0IGJvZHlFbGVtOiBIVE1MRWxlbWVudCA9IGRvY3VtZW50LmJvZHlcclxuICBpZiAoXHJcbiAgICAvLyDkuIvmi4nmoYZcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1zZWxlY3QtZHJvcGRvd24nKS5mbGFnIHx8XHJcbiAgICAvLyDnuqfogZRcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYXNjYWRlci1tZW51cycpLmZsYWcgfHxcclxuICAgIC8vIOaXpeacn1xyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhbGVuZGFyLXBpY2tlci1jb250YWluZXInKS5mbGFnIHx8XHJcbiAgICAvLyDml7bpl7TpgInmi6lcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC10aW1lLXBpY2tlci1wYW5lbCcpLmZsYWdcclxuICApIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOWfuuS6jiB2eGUtdGFibGUg6KGo5qC855qE6YCC6YWN5o+S5Lu277yM55So5LqO5YW85a65IGFudC1kZXNpZ24tdnVlIOe7hOS7tuW6k1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFZYRVRhYmxlUGx1Z2luQW50ZCA9IHtcclxuICBpbnN0YWxsICh4dGFibGU6IHR5cGVvZiBWWEVUYWJsZSkge1xyXG4gICAgbGV0IHsgaW50ZXJjZXB0b3IsIHJlbmRlcmVyIH0gPSB4dGFibGVcclxuICAgIHJlbmRlcmVyLm1peGluKHJlbmRlck1hcClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJGaWx0ZXInLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gICAgaW50ZXJjZXB0b3IuYWRkKCdldmVudC5jbGVhckFjdGl2ZWQnLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdG9Nb21lbnRTdHJpbmcgKGNlbGxWYWx1ZTogYW55LCBmb3JtYXQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA/IGNlbGxWYWx1ZS5mb3JtYXQoZm9ybWF0KSA6ICcnXHJcbn1cclxuXHJcbmRlY2xhcmUgbW9kdWxlICd4ZS11dGlscy9tZXRob2RzL3hlLXV0aWxzJyB7XHJcbiAgaW50ZXJmYWNlIFhFVXRpbHNNZXRob2RzIHtcclxuICAgIC8qKlxyXG4gICAgICog5bCGIE1vbWVudCDml6XmnJ/moLzlvI/ljJbkuLrlrZfnrKbkuLJcclxuICAgICAqIEBwYXJhbSBjZWxsVmFsdWUg5YC8XHJcbiAgICAgKiBAcGFyYW0gZm9ybWF0IOagvOW8j+WMllxyXG4gICAgICovXHJcbiAgICB0b01vbWVudFN0cmluZzogdHlwZW9mIHRvTW9tZW50U3RyaW5nO1xyXG4gIH1cclxufVxyXG5cclxuWEVVdGlscy5taXhpbih7XHJcbiAgdG9Nb21lbnRTdHJpbmdcclxufSlcclxuXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVlhFVGFibGUpIHtcclxuICB3aW5kb3cuVlhFVGFibGUudXNlKFZYRVRhYmxlUGx1Z2luQW50ZClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5BbnRkXHJcbiJdfQ==
