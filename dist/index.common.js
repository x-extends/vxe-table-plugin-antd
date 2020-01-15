"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.VXETablePluginAntd = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils/methods/xe-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

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
  return function (h, _ref, params) {
    var _ref$props = _ref.props,
        props = _ref$props === void 0 ? {} : _ref$props;
    var row = params.row,
        column = params.column;

    var cellValue = _xeUtils["default"].get(row, column.property);

    if (cellValue) {
      cellValue = cellValue.format(props.format || defaultFormat);
    }

    return cellText(h, cellValue);
  };
}

function getProps(_ref2, _ref3, defaultProps) {
  var $table = _ref2.$table;
  var props = _ref3.props;
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

function defaultFilterMethod(_ref4) {
  var option = _ref4.option,
      row = _ref4.row,
      column = _ref4.column;
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
  return ['' + (cellValue === null || cellValue === void 0 ? '' : cellValue)];
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

function getFormProps(_ref5, _ref6, defaultProps) {
  var $form = _ref5.$form;
  var props = _ref6.props;
  return _xeUtils["default"].assign($form.vSize ? {
    size: $form.vSize
  } : {}, defaultProps, props);
}

function getFormEvents(renderOpts, params, context) {
  var events = renderOpts.events;
  var on;

  if (events) {
    on = _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
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
          _renderOpts$optionPro = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro === void 0 ? {} : _renderOpts$optionPro,
          _renderOpts$optionGro = renderOpts.optionGroupProps,
          optionGroupProps = _renderOpts$optionGro === void 0 ? {} : _renderOpts$optionGro;
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
      var options = renderOpts.options,
          optionGroups = renderOpts.optionGroups,
          _renderOpts$props = renderOpts.props,
          props = _renderOpts$props === void 0 ? {} : _renderOpts$props,
          _renderOpts$optionPro2 = renderOpts.optionProps,
          optionProps = _renderOpts$optionPro2 === void 0 ? {} : _renderOpts$optionPro2,
          _renderOpts$optionGro2 = renderOpts.optionGroupProps,
          optionGroupProps = _renderOpts$optionGro2 === void 0 ? {} : _renderOpts$optionGro2;
      var row = params.row,
          column = params.column;
      var labelProp = optionProps.label || 'label';
      var valueProp = optionProps.value || 'value';
      var groupOptions = optionGroupProps.options || 'options';

      var cellValue = _xeUtils["default"].get(row, column.property);

      if (!(cellValue === null || cellValue === undefined || cellValue === '')) {
        return cellText(h, _xeUtils["default"].map(props.mode === 'multiple' ? cellValue : [cellValue], optionGroups ? function (value) {
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
        }).join(';'));
      }

      return cellText(h, '');
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
    filterMethod: function filterMethod(_ref7) {
      var option = _ref7.option,
          row = _ref7.row,
          column = _ref7.column;
      var data = option.data;
      var property = column.property,
          renderOpts = column.filterRender;
      var _renderOpts$props2 = renderOpts.props,
          props = _renderOpts$props2 === void 0 ? {} : _renderOpts$props2;

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
    }
  },
  ACascader: {
    renderEdit: createEditRender(),
    renderCell: function renderCell(h, _ref8, params) {
      var _ref8$props = _ref8.props,
          props = _ref8$props === void 0 ? {} : _ref8$props;
      var row = params.row,
          column = params.column;

      var cellValue = _xeUtils["default"].get(row, column.property);

      var values = cellValue || [];
      var labels = [];
      matchCascaderData(0, props.options, values, labels);
      return cellText(h, (props.showAllLevels === false ? labels.slice(labels.length - 1, labels.length) : labels).join(" ".concat(props.separator || '/', " ")));
    },
    renderItem: createFormItemRender()
  },
  ADatePicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-MM-DD'),
    renderItem: createFormItemRender()
  },
  AMonthPicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-MM'),
    renderItem: createFormItemRender()
  },
  ARangePicker: {
    renderEdit: createEditRender(),
    renderCell: function renderCell(h, _ref9, params) {
      var _ref9$props = _ref9.props,
          props = _ref9$props === void 0 ? {} : _ref9$props;
      var row = params.row,
          column = params.column;

      var cellValue = _xeUtils["default"].get(row, column.property);

      if (cellValue) {
        cellValue = _xeUtils["default"].map(cellValue, function (date) {
          return date.format(props.format || 'YYYY-MM-DD');
        }).join(' ~ ');
      }

      return cellText(h, cellValue);
    },
    renderItem: createFormItemRender()
  },
  AWeekPicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-WW周'),
    renderItem: createFormItemRender()
  },
  ATimePicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('HH:mm:ss'),
    renderItem: createFormItemRender()
  },
  ATreeSelect: {
    renderEdit: createEditRender(),
    renderCell: function renderCell(h, _ref10, params) {
      var _ref10$props = _ref10.props,
          props = _ref10$props === void 0 ? {} : _ref10$props;
      var row = params.row,
          column = params.column;

      var cellValue = _xeUtils["default"].get(row, column.property);

      if (cellValue && (props.treeCheckable || props.multiple)) {
        cellValue = cellValue.join(';');
      }

      return cellText(h, cellValue);
    },
    renderItem: createFormItemRender()
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiWEVVdGlscyIsImVhY2giLCJpdGVtIiwidmFsdWUiLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsInBhcmFtcyIsInByb3BzIiwicm93IiwiY29sdW1uIiwiY2VsbFZhbHVlIiwiZ2V0IiwicHJvcGVydHkiLCJmb3JtYXQiLCJjZWxsVGV4dCIsImdldFByb3BzIiwiZGVmYXVsdFByb3BzIiwiJHRhYmxlIiwiYXNzaWduIiwidlNpemUiLCJzaXplIiwiZ2V0Q2VsbEV2ZW50cyIsInJlbmRlck9wdHMiLCJuYW1lIiwiZXZlbnRzIiwidHlwZSIsIm9uIiwiZXZudCIsInVwZGF0ZVN0YXR1cyIsIm9iamVjdE1hcCIsImNiIiwiYXJncyIsImFwcGx5IiwiY29uY2F0IiwiY3JlYXRlRWRpdFJlbmRlciIsImF0dHJzIiwibW9kZWwiLCJjYWxsYmFjayIsInNldCIsImdldEZpbHRlckV2ZW50cyIsImNvbnRleHQiLCJPYmplY3QiLCJjcmVhdGVGaWx0ZXJSZW5kZXIiLCJmaWx0ZXJzIiwibWFwIiwiZGF0YSIsIm9wdGlvblZhbHVlIiwiaGFuZGxlQ29uZmlybUZpbHRlciIsImNoZWNrZWQiLCJmaWx0ZXJNdWx0aXBsZSIsImRlZmF1bHRGaWx0ZXJNZXRob2QiLCJvcHRpb24iLCJyZW5kZXJPcHRpb25zIiwib3B0aW9ucyIsIm9wdGlvblByb3BzIiwibGFiZWxQcm9wIiwidmFsdWVQcm9wIiwiZGlzYWJsZWRQcm9wIiwiZGlzYWJsZWQiLCJrZXkiLCJjcmVhdGVGb3JtSXRlbVJlbmRlciIsImZpZWxkIiwiZ2V0Rm9ybVByb3BzIiwiZ2V0Rm9ybUV2ZW50cyIsIiRmb3JtIiwicmVuZGVyTWFwIiwiQUF1dG9Db21wbGV0ZSIsImF1dG9mb2N1cyIsInJlbmRlckRlZmF1bHQiLCJyZW5kZXJFZGl0IiwicmVuZGVyRmlsdGVyIiwiZmlsdGVyTWV0aG9kIiwicmVuZGVySXRlbSIsIkFJbnB1dCIsIkFJbnB1dE51bWJlciIsIkFTZWxlY3QiLCJvcHRpb25Hcm91cHMiLCJvcHRpb25Hcm91cFByb3BzIiwiZ3JvdXBPcHRpb25zIiwiZ3JvdXBMYWJlbCIsImdyb3VwIiwiZ0luZGV4Iiwic2xvdCIsInJlbmRlckNlbGwiLCJ1bmRlZmluZWQiLCJtb2RlIiwic2VsZWN0SXRlbSIsImZpbmQiLCJqb2luIiwiY2hhbmdlIiwiZmlsdGVyUmVuZGVyIiwiaXNBcnJheSIsImluY2x1ZGVBcnJheXMiLCJpbmRleE9mIiwiQUNhc2NhZGVyIiwic2hvd0FsbExldmVscyIsInNsaWNlIiwic2VwYXJhdG9yIiwiQURhdGVQaWNrZXIiLCJBTW9udGhQaWNrZXIiLCJBUmFuZ2VQaWNrZXIiLCJkYXRlIiwiQVdlZWtQaWNrZXIiLCJBVGltZVBpY2tlciIsIkFUcmVlU2VsZWN0IiwidHJlZUNoZWNrYWJsZSIsIm11bHRpcGxlIiwiQVJhdGUiLCJBU3dpdGNoIiwiaGFuZGxlQ2xlYXJFdmVudCIsImdldEV2ZW50VGFyZ2V0Tm9kZSIsImJvZHlFbGVtIiwiZG9jdW1lbnQiLCJib2R5IiwiZmxhZyIsIlZYRVRhYmxlUGx1Z2luQW50ZCIsImluc3RhbGwiLCJ4dGFibGUiLCJpbnRlcmNlcHRvciIsInJlbmRlcmVyIiwibWl4aW4iLCJhZGQiLCJ0b01vbWVudFN0cmluZyIsIndpbmRvdyIsIlZYRVRhYmxlIiwidXNlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUdBLFNBQVNBLGlCQUFULENBQTRCQyxLQUE1QixFQUEyQ0MsSUFBM0MsRUFBNkRDLE1BQTdELEVBQWlGQyxNQUFqRixFQUFtRztBQUNqRyxNQUFJQyxHQUFHLEdBQUdGLE1BQU0sQ0FBQ0YsS0FBRCxDQUFoQjs7QUFDQSxNQUFJQyxJQUFJLElBQUlDLE1BQU0sQ0FBQ0csTUFBUCxHQUFnQkwsS0FBNUIsRUFBbUM7QUFDakNNLHdCQUFRQyxJQUFSLENBQWFOLElBQWIsRUFBbUIsVUFBQ08sSUFBRCxFQUFjO0FBQy9CLFVBQUlBLElBQUksQ0FBQ0MsS0FBTCxLQUFlTCxHQUFuQixFQUF3QjtBQUN0QkQsUUFBQUEsTUFBTSxDQUFDTyxJQUFQLENBQVlGLElBQUksQ0FBQ0csS0FBakI7QUFDQVosUUFBQUEsaUJBQWlCLENBQUMsRUFBRUMsS0FBSCxFQUFVUSxJQUFJLENBQUNJLFFBQWYsRUFBeUJWLE1BQXpCLEVBQWlDQyxNQUFqQyxDQUFqQjtBQUNEO0FBQ0YsS0FMRDtBQU1EO0FBQ0Y7O0FBRUQsU0FBU1UsZ0JBQVQsQ0FBMkJDLGFBQTNCLEVBQTZDO0FBQzNDLFNBQU8sVUFBVUMsQ0FBVixRQUE0Q0MsTUFBNUMsRUFBdUQ7QUFBQSwwQkFBOUJDLEtBQThCO0FBQUEsUUFBOUJBLEtBQThCLDJCQUF0QixFQUFzQjtBQUFBLFFBQ3REQyxHQURzRCxHQUN0Q0YsTUFEc0MsQ0FDdERFLEdBRHNEO0FBQUEsUUFDakRDLE1BRGlELEdBQ3RDSCxNQURzQyxDQUNqREcsTUFEaUQ7O0FBRTVELFFBQUlDLFNBQVMsR0FBR2Qsb0JBQVFlLEdBQVIsQ0FBWUgsR0FBWixFQUFpQkMsTUFBTSxDQUFDRyxRQUF4QixDQUFoQjs7QUFDQSxRQUFJRixTQUFKLEVBQWU7QUFDYkEsTUFBQUEsU0FBUyxHQUFHQSxTQUFTLENBQUNHLE1BQVYsQ0FBaUJOLEtBQUssQ0FBQ00sTUFBTixJQUFnQlQsYUFBakMsQ0FBWjtBQUNEOztBQUNELFdBQU9VLFFBQVEsQ0FBQ1QsQ0FBRCxFQUFJSyxTQUFKLENBQWY7QUFDRCxHQVBEO0FBUUQ7O0FBRUQsU0FBU0ssUUFBVCxlQUFvREMsWUFBcEQsRUFBc0U7QUFBQSxNQUFqREMsTUFBaUQsU0FBakRBLE1BQWlEO0FBQUEsTUFBaENWLEtBQWdDLFNBQWhDQSxLQUFnQztBQUNwRSxTQUFPWCxvQkFBUXNCLE1BQVIsQ0FBZUQsTUFBTSxDQUFDRSxLQUFQLEdBQWU7QUFBRUMsSUFBQUEsSUFBSSxFQUFFSCxNQUFNLENBQUNFO0FBQWYsR0FBZixHQUF3QyxFQUF2RCxFQUEyREgsWUFBM0QsRUFBeUVULEtBQXpFLENBQVA7QUFDRDs7QUFFRCxTQUFTYyxhQUFULENBQXdCQyxVQUF4QixFQUF5Q2hCLE1BQXpDLEVBQW9EO0FBQUEsTUFDNUNpQixJQUQ0QyxHQUMzQkQsVUFEMkIsQ0FDNUNDLElBRDRDO0FBQUEsTUFDdENDLE1BRHNDLEdBQzNCRixVQUQyQixDQUN0Q0UsTUFEc0M7QUFBQSxNQUU1Q1AsTUFGNEMsR0FFakNYLE1BRmlDLENBRTVDVyxNQUY0QztBQUdsRCxNQUFJUSxJQUFJLEdBQUcsUUFBWDs7QUFDQSxVQUFRRixJQUFSO0FBQ0UsU0FBSyxlQUFMO0FBQ0VFLE1BQUFBLElBQUksR0FBRyxRQUFQO0FBQ0E7O0FBQ0YsU0FBSyxRQUFMO0FBQ0VBLE1BQUFBLElBQUksR0FBRyxPQUFQO0FBQ0E7O0FBQ0YsU0FBSyxjQUFMO0FBQ0VBLE1BQUFBLElBQUksR0FBRyxRQUFQO0FBQ0E7QUFUSjs7QUFXQSxNQUFJQyxFQUFFLHVCQUNIRCxJQURHLEVBQ0ksVUFBQ0UsSUFBRCxFQUFjO0FBQ3BCVixJQUFBQSxNQUFNLENBQUNXLFlBQVAsQ0FBb0J0QixNQUFwQjs7QUFDQSxRQUFJa0IsTUFBTSxJQUFJQSxNQUFNLENBQUNDLElBQUQsQ0FBcEIsRUFBNEI7QUFDMUJELE1BQUFBLE1BQU0sQ0FBQ0MsSUFBRCxDQUFOLENBQWFuQixNQUFiLEVBQXFCcUIsSUFBckI7QUFDRDtBQUNGLEdBTkcsQ0FBTjs7QUFRQSxNQUFJSCxNQUFKLEVBQVk7QUFDVixXQUFPNUIsb0JBQVFzQixNQUFSLENBQWUsRUFBZixFQUFtQnRCLG9CQUFRaUMsU0FBUixDQUFrQkwsTUFBbEIsRUFBMEIsVUFBQ00sRUFBRDtBQUFBLGFBQWtCLFlBQXdCO0FBQUEsMENBQVhDLElBQVc7QUFBWEEsVUFBQUEsSUFBVztBQUFBOztBQUM1RkQsUUFBQUEsRUFBRSxDQUFDRSxLQUFILENBQVMsSUFBVCxFQUFlLENBQUMxQixNQUFELEVBQVMyQixNQUFULENBQWdCRCxLQUFoQixDQUFzQjFCLE1BQXRCLEVBQThCeUIsSUFBOUIsQ0FBZjtBQUNELE9BRm1EO0FBQUEsS0FBMUIsQ0FBbkIsRUFFSEwsRUFGRyxDQUFQO0FBR0Q7O0FBQ0QsU0FBT0EsRUFBUDtBQUNEOztBQUVELFNBQVNRLGdCQUFULENBQTJCbEIsWUFBM0IsRUFBNkM7QUFDM0MsU0FBTyxVQUFVWCxDQUFWLEVBQXVCaUIsVUFBdkIsRUFBd0NoQixNQUF4QyxFQUFtRDtBQUFBLFFBQ2xERSxHQURrRCxHQUNsQ0YsTUFEa0MsQ0FDbERFLEdBRGtEO0FBQUEsUUFDN0NDLE1BRDZDLEdBQ2xDSCxNQURrQyxDQUM3Q0csTUFENkM7QUFBQSxRQUVsRDBCLEtBRmtELEdBRXhDYixVQUZ3QyxDQUVsRGEsS0FGa0Q7QUFHeEQsUUFBSTVCLEtBQUssR0FBR1EsUUFBUSxDQUFDVCxNQUFELEVBQVNnQixVQUFULEVBQXFCTixZQUFyQixDQUFwQjtBQUNBLFdBQU8sQ0FDTFgsQ0FBQyxDQUFDaUIsVUFBVSxDQUFDQyxJQUFaLEVBQWtCO0FBQ2pCaEIsTUFBQUEsS0FBSyxFQUFMQSxLQURpQjtBQUVqQjRCLE1BQUFBLEtBQUssRUFBTEEsS0FGaUI7QUFHakJDLE1BQUFBLEtBQUssRUFBRTtBQUNMckMsUUFBQUEsS0FBSyxFQUFFSCxvQkFBUWUsR0FBUixDQUFZSCxHQUFaLEVBQWlCQyxNQUFNLENBQUNHLFFBQXhCLENBREY7QUFFTHlCLFFBQUFBLFFBRkssb0JBRUt0QyxLQUZMLEVBRWU7QUFDbEJILDhCQUFRMEMsR0FBUixDQUFZOUIsR0FBWixFQUFpQkMsTUFBTSxDQUFDRyxRQUF4QixFQUFrQ2IsS0FBbEM7QUFDRDtBQUpJLE9BSFU7QUFTakIyQixNQUFBQSxFQUFFLEVBQUVMLGFBQWEsQ0FBQ0MsVUFBRCxFQUFhaEIsTUFBYjtBQVRBLEtBQWxCLENBREksQ0FBUDtBQWFELEdBakJEO0FBa0JEOztBQUVELFNBQVNpQyxlQUFULENBQTBCYixFQUExQixFQUFtQ0osVUFBbkMsRUFBb0RoQixNQUFwRCxFQUFpRWtDLE9BQWpFLEVBQTZFO0FBQUEsTUFDckVoQixNQURxRSxHQUMxREYsVUFEMEQsQ0FDckVFLE1BRHFFOztBQUUzRSxNQUFJQSxNQUFKLEVBQVk7QUFDVixXQUFPNUIsb0JBQVFzQixNQUFSLENBQWUsRUFBZixFQUFtQnRCLG9CQUFRaUMsU0FBUixDQUFrQkwsTUFBbEIsRUFBMEIsVUFBQ00sRUFBRDtBQUFBLGFBQWtCLFlBQXdCO0FBQzVGeEIsUUFBQUEsTUFBTSxHQUFHbUMsTUFBTSxDQUFDdkIsTUFBUCxDQUFjO0FBQUVzQixVQUFBQSxPQUFPLEVBQVBBO0FBQUYsU0FBZCxFQUEyQmxDLE1BQTNCLENBQVQ7O0FBRDRGLDJDQUFYeUIsSUFBVztBQUFYQSxVQUFBQSxJQUFXO0FBQUE7O0FBRTVGRCxRQUFBQSxFQUFFLENBQUNFLEtBQUgsQ0FBUyxJQUFULEVBQWUsQ0FBQzFCLE1BQUQsRUFBUzJCLE1BQVQsQ0FBZ0JELEtBQWhCLENBQXNCMUIsTUFBdEIsRUFBOEJ5QixJQUE5QixDQUFmO0FBQ0QsT0FIbUQ7QUFBQSxLQUExQixDQUFuQixFQUdITCxFQUhHLENBQVA7QUFJRDs7QUFDRCxTQUFPQSxFQUFQO0FBQ0Q7O0FBRUQsU0FBU2dCLGtCQUFULENBQTZCMUIsWUFBN0IsRUFBK0M7QUFDN0MsU0FBTyxVQUFVWCxDQUFWLEVBQXVCaUIsVUFBdkIsRUFBd0NoQixNQUF4QyxFQUFxRGtDLE9BQXJELEVBQWlFO0FBQUEsUUFDaEUvQixNQURnRSxHQUNyREgsTUFEcUQsQ0FDaEVHLE1BRGdFO0FBQUEsUUFFaEVjLElBRmdFLEdBRXhDRCxVQUZ3QyxDQUVoRUMsSUFGZ0U7QUFBQSxRQUUxRFksS0FGMEQsR0FFeENiLFVBRndDLENBRTFEYSxLQUYwRDtBQUFBLFFBRW5EWCxNQUZtRCxHQUV4Q0YsVUFGd0MsQ0FFbkRFLE1BRm1EO0FBR3RFLFFBQUlqQixLQUFLLEdBQUdRLFFBQVEsQ0FBQ1QsTUFBRCxFQUFTZ0IsVUFBVCxDQUFwQjtBQUNBLFFBQUlHLElBQUksR0FBRyxRQUFYOztBQUNBLFlBQVFGLElBQVI7QUFDRSxXQUFLLGVBQUw7QUFDRUUsUUFBQUEsSUFBSSxHQUFHLFFBQVA7QUFDQTs7QUFDRixXQUFLLFFBQUw7QUFDRUEsUUFBQUEsSUFBSSxHQUFHLE9BQVA7QUFDQTs7QUFDRixXQUFLLGNBQUw7QUFDRUEsUUFBQUEsSUFBSSxHQUFHLFFBQVA7QUFDQTtBQVRKOztBQVdBLFdBQU9oQixNQUFNLENBQUNrQyxPQUFQLENBQWVDLEdBQWYsQ0FBbUIsVUFBQzlDLElBQUQsRUFBYztBQUN0QyxhQUFPTyxDQUFDLENBQUNrQixJQUFELEVBQU87QUFDYmhCLFFBQUFBLEtBQUssRUFBTEEsS0FEYTtBQUViNEIsUUFBQUEsS0FBSyxFQUFMQSxLQUZhO0FBR2JDLFFBQUFBLEtBQUssRUFBRTtBQUNMckMsVUFBQUEsS0FBSyxFQUFFRCxJQUFJLENBQUMrQyxJQURQO0FBRUxSLFVBQUFBLFFBRkssb0JBRUtTLFdBRkwsRUFFcUI7QUFDeEJoRCxZQUFBQSxJQUFJLENBQUMrQyxJQUFMLEdBQVlDLFdBQVo7QUFDRDtBQUpJLFNBSE07QUFTYnBCLFFBQUFBLEVBQUUsRUFBRWEsZUFBZSxxQkFDaEJkLElBRGdCLFlBQ1RFLElBRFMsRUFDQTtBQUNmb0IsVUFBQUEsbUJBQW1CLENBQUNQLE9BQUQsRUFBVS9CLE1BQVYsRUFBa0IsQ0FBQyxDQUFDWCxJQUFJLENBQUMrQyxJQUF6QixFQUErQi9DLElBQS9CLENBQW5COztBQUNBLGNBQUkwQixNQUFNLElBQUlBLE1BQU0sQ0FBQ0MsSUFBRCxDQUFwQixFQUE0QjtBQUMxQkQsWUFBQUEsTUFBTSxDQUFDQyxJQUFELENBQU4sQ0FBYWdCLE1BQU0sQ0FBQ3ZCLE1BQVAsQ0FBYztBQUFFc0IsY0FBQUEsT0FBTyxFQUFQQTtBQUFGLGFBQWQsRUFBMkJsQyxNQUEzQixDQUFiLEVBQWlEcUIsSUFBakQ7QUFDRDtBQUNGLFNBTmdCLEdBT2hCTCxVQVBnQixFQU9KaEIsTUFQSSxFQU9Ja0MsT0FQSjtBQVROLE9BQVAsQ0FBUjtBQWtCRCxLQW5CTSxDQUFQO0FBb0JELEdBcENEO0FBcUNEOztBQUVELFNBQVNPLG1CQUFULENBQThCUCxPQUE5QixFQUE0Qy9CLE1BQTVDLEVBQXlEdUMsT0FBekQsRUFBdUVsRCxJQUF2RSxFQUFnRjtBQUM5RTBDLEVBQUFBLE9BQU8sQ0FBQy9CLE1BQU0sQ0FBQ3dDLGNBQVAsR0FBd0Isc0JBQXhCLEdBQWlELG1CQUFsRCxDQUFQLENBQThFLEVBQTlFLEVBQWtGRCxPQUFsRixFQUEyRmxELElBQTNGO0FBQ0Q7O0FBRUQsU0FBU29ELG1CQUFULFFBQTBEO0FBQUEsTUFBMUJDLE1BQTBCLFNBQTFCQSxNQUEwQjtBQUFBLE1BQWxCM0MsR0FBa0IsU0FBbEJBLEdBQWtCO0FBQUEsTUFBYkMsTUFBYSxTQUFiQSxNQUFhO0FBQUEsTUFDbERvQyxJQURrRCxHQUN6Q00sTUFEeUMsQ0FDbEROLElBRGtEOztBQUV4RCxNQUFJbkMsU0FBUyxHQUFHZCxvQkFBUWUsR0FBUixDQUFZSCxHQUFaLEVBQWlCQyxNQUFNLENBQUNHLFFBQXhCLENBQWhCO0FBQ0E7OztBQUNBLFNBQU9GLFNBQVMsS0FBS21DLElBQXJCO0FBQ0Q7O0FBRUQsU0FBU08sYUFBVCxDQUF3Qi9DLENBQXhCLEVBQXFDZ0QsT0FBckMsRUFBbURDLFdBQW5ELEVBQW1FO0FBQ2pFLE1BQUlDLFNBQVMsR0FBR0QsV0FBVyxDQUFDckQsS0FBWixJQUFxQixPQUFyQztBQUNBLE1BQUl1RCxTQUFTLEdBQUdGLFdBQVcsQ0FBQ3ZELEtBQVosSUFBcUIsT0FBckM7QUFDQSxNQUFJMEQsWUFBWSxHQUFHSCxXQUFXLENBQUNJLFFBQVosSUFBd0IsVUFBM0M7QUFDQSxTQUFPOUQsb0JBQVFnRCxHQUFSLENBQVlTLE9BQVosRUFBcUIsVUFBQ3ZELElBQUQsRUFBWVIsS0FBWixFQUE2QjtBQUN2RCxXQUFPZSxDQUFDLENBQUMsaUJBQUQsRUFBb0I7QUFDMUJFLE1BQUFBLEtBQUssRUFBRTtBQUNMUixRQUFBQSxLQUFLLEVBQUVELElBQUksQ0FBQzBELFNBQUQsQ0FETjtBQUVMRSxRQUFBQSxRQUFRLEVBQUU1RCxJQUFJLENBQUMyRCxZQUFEO0FBRlQsT0FEbUI7QUFLMUJFLE1BQUFBLEdBQUcsRUFBRXJFO0FBTHFCLEtBQXBCLEVBTUxRLElBQUksQ0FBQ3lELFNBQUQsQ0FOQyxDQUFSO0FBT0QsR0FSTSxDQUFQO0FBU0Q7O0FBRUQsU0FBU3pDLFFBQVQsQ0FBbUJULENBQW5CLEVBQWdDSyxTQUFoQyxFQUE4QztBQUM1QyxTQUFPLENBQUMsTUFBTUEsU0FBUyxLQUFLLElBQWQsSUFBc0JBLFNBQVMsS0FBSyxLQUFLLENBQXpDLEdBQTZDLEVBQTdDLEdBQWtEQSxTQUF4RCxDQUFELENBQVA7QUFDRDs7QUFFRCxTQUFTa0Qsb0JBQVQsQ0FBK0I1QyxZQUEvQixFQUFpRDtBQUMvQyxTQUFPLFVBQVVYLENBQVYsRUFBdUJpQixVQUF2QixFQUF3Q2hCLE1BQXhDLEVBQXFEa0MsT0FBckQsRUFBaUU7QUFBQSxRQUNoRUssSUFEZ0UsR0FDaER2QyxNQURnRCxDQUNoRXVDLElBRGdFO0FBQUEsUUFDMURnQixLQUQwRCxHQUNoRHZELE1BRGdELENBQzFEdUQsS0FEMEQ7QUFBQSxRQUVoRXRDLElBRmdFLEdBRXZERCxVQUZ1RCxDQUVoRUMsSUFGZ0U7QUFBQSxRQUdoRVksS0FIZ0UsR0FHakRiLFVBSGlELENBR2hFYSxLQUhnRTtBQUl0RSxRQUFJNUIsS0FBSyxHQUFRdUQsWUFBWSxDQUFDdEIsT0FBRCxFQUFVbEIsVUFBVixFQUFzQk4sWUFBdEIsQ0FBN0I7QUFDQSxXQUFPLENBQ0xYLENBQUMsQ0FBQ2tCLElBQUQsRUFBTztBQUNOWSxNQUFBQSxLQUFLLEVBQUxBLEtBRE07QUFFTjVCLE1BQUFBLEtBQUssRUFBTEEsS0FGTTtBQUdONkIsTUFBQUEsS0FBSyxFQUFFO0FBQ0xyQyxRQUFBQSxLQUFLLEVBQUVILG9CQUFRZSxHQUFSLENBQVlrQyxJQUFaLEVBQWtCZ0IsS0FBbEIsQ0FERjtBQUVMeEIsUUFBQUEsUUFGSyxvQkFFS3RDLEtBRkwsRUFFZTtBQUNsQkgsOEJBQVEwQyxHQUFSLENBQVlPLElBQVosRUFBa0JnQixLQUFsQixFQUF5QjlELEtBQXpCO0FBQ0Q7QUFKSSxPQUhEO0FBU04yQixNQUFBQSxFQUFFLEVBQUVxQyxhQUFhLENBQUN6QyxVQUFELEVBQWFoQixNQUFiLEVBQXFCa0MsT0FBckI7QUFUWCxLQUFQLENBREksQ0FBUDtBQWFELEdBbEJEO0FBbUJEOztBQUVELFNBQVNzQixZQUFULGVBQXVEOUMsWUFBdkQsRUFBeUU7QUFBQSxNQUFoRGdELEtBQWdELFNBQWhEQSxLQUFnRDtBQUFBLE1BQWhDekQsS0FBZ0MsU0FBaENBLEtBQWdDO0FBQ3ZFLFNBQU9YLG9CQUFRc0IsTUFBUixDQUFlOEMsS0FBSyxDQUFDN0MsS0FBTixHQUFjO0FBQUVDLElBQUFBLElBQUksRUFBRTRDLEtBQUssQ0FBQzdDO0FBQWQsR0FBZCxHQUFzQyxFQUFyRCxFQUF5REgsWUFBekQsRUFBdUVULEtBQXZFLENBQVA7QUFDRDs7QUFFRCxTQUFTd0QsYUFBVCxDQUF3QnpDLFVBQXhCLEVBQXlDaEIsTUFBekMsRUFBc0RrQyxPQUF0RCxFQUFrRTtBQUFBLE1BQzFEaEIsTUFEMEQsR0FDMUNGLFVBRDBDLENBQzFERSxNQUQwRDtBQUVoRSxNQUFJRSxFQUFKOztBQUNBLE1BQUlGLE1BQUosRUFBWTtBQUNWRSxJQUFBQSxFQUFFLEdBQUc5QixvQkFBUXNCLE1BQVIsQ0FBZSxFQUFmLEVBQW1CdEIsb0JBQVFpQyxTQUFSLENBQWtCTCxNQUFsQixFQUEwQixVQUFDTSxFQUFEO0FBQUEsYUFBa0IsWUFBd0I7QUFBQSwyQ0FBWEMsSUFBVztBQUFYQSxVQUFBQSxJQUFXO0FBQUE7O0FBQzFGRCxRQUFBQSxFQUFFLENBQUNFLEtBQUgsQ0FBUyxJQUFULEVBQWUsQ0FBQzFCLE1BQUQsRUFBUzJCLE1BQVQsQ0FBZ0JELEtBQWhCLENBQXNCMUIsTUFBdEIsRUFBOEJ5QixJQUE5QixDQUFmO0FBQ0QsT0FGaUQ7QUFBQSxLQUExQixDQUFuQixFQUVETCxFQUZDLENBQUw7QUFHRDs7QUFDRCxTQUFPQSxFQUFQO0FBQ0Q7QUFFRDs7Ozs7QUFHQSxJQUFNdUMsU0FBUyxHQUFHO0FBQ2hCQyxFQUFBQSxhQUFhLEVBQUU7QUFDYkMsSUFBQUEsU0FBUyxFQUFFLGlCQURFO0FBRWJDLElBQUFBLGFBQWEsRUFBRWxDLGdCQUFnQixFQUZsQjtBQUdibUMsSUFBQUEsVUFBVSxFQUFFbkMsZ0JBQWdCLEVBSGY7QUFJYm9DLElBQUFBLFlBQVksRUFBRTVCLGtCQUFrQixFQUpuQjtBQUtiNkIsSUFBQUEsWUFBWSxFQUFFckIsbUJBTEQ7QUFNYnNCLElBQUFBLFVBQVUsRUFBRVosb0JBQW9CO0FBTm5CLEdBREM7QUFTaEJhLEVBQUFBLE1BQU0sRUFBRTtBQUNOTixJQUFBQSxTQUFTLEVBQUUsaUJBREw7QUFFTkMsSUFBQUEsYUFBYSxFQUFFbEMsZ0JBQWdCLEVBRnpCO0FBR05tQyxJQUFBQSxVQUFVLEVBQUVuQyxnQkFBZ0IsRUFIdEI7QUFJTm9DLElBQUFBLFlBQVksRUFBRTVCLGtCQUFrQixFQUoxQjtBQUtONkIsSUFBQUEsWUFBWSxFQUFFckIsbUJBTFI7QUFNTnNCLElBQUFBLFVBQVUsRUFBRVosb0JBQW9CO0FBTjFCLEdBVFE7QUFpQmhCYyxFQUFBQSxZQUFZLEVBQUU7QUFDWlAsSUFBQUEsU0FBUyxFQUFFLDhCQURDO0FBRVpDLElBQUFBLGFBQWEsRUFBRWxDLGdCQUFnQixFQUZuQjtBQUdabUMsSUFBQUEsVUFBVSxFQUFFbkMsZ0JBQWdCLEVBSGhCO0FBSVpvQyxJQUFBQSxZQUFZLEVBQUU1QixrQkFBa0IsRUFKcEI7QUFLWjZCLElBQUFBLFlBQVksRUFBRXJCLG1CQUxGO0FBTVpzQixJQUFBQSxVQUFVLEVBQUVaLG9CQUFvQjtBQU5wQixHQWpCRTtBQXlCaEJlLEVBQUFBLE9BQU8sRUFBRTtBQUNQTixJQUFBQSxVQURPLHNCQUNLaEUsQ0FETCxFQUNrQmlCLFVBRGxCLEVBQ21DaEIsTUFEbkMsRUFDOEM7QUFBQSxVQUM3QytDLE9BRDZDLEdBQ3NCL0IsVUFEdEIsQ0FDN0MrQixPQUQ2QztBQUFBLFVBQ3BDdUIsWUFEb0MsR0FDc0J0RCxVQUR0QixDQUNwQ3NELFlBRG9DO0FBQUEsa0NBQ3NCdEQsVUFEdEIsQ0FDdEJnQyxXQURzQjtBQUFBLFVBQ3RCQSxXQURzQixzQ0FDUixFQURRO0FBQUEsa0NBQ3NCaEMsVUFEdEIsQ0FDSnVELGdCQURJO0FBQUEsVUFDSkEsZ0JBREksc0NBQ2UsRUFEZjtBQUFBLFVBRTdDckUsR0FGNkMsR0FFN0JGLE1BRjZCLENBRTdDRSxHQUY2QztBQUFBLFVBRXhDQyxNQUZ3QyxHQUU3QkgsTUFGNkIsQ0FFeENHLE1BRndDO0FBQUEsVUFHN0MwQixLQUg2QyxHQUduQ2IsVUFIbUMsQ0FHN0NhLEtBSDZDO0FBSW5ELFVBQUk1QixLQUFLLEdBQUdRLFFBQVEsQ0FBQ1QsTUFBRCxFQUFTZ0IsVUFBVCxDQUFwQjs7QUFDQSxVQUFJc0QsWUFBSixFQUFrQjtBQUNoQixZQUFJRSxZQUFZLEdBQUdELGdCQUFnQixDQUFDeEIsT0FBakIsSUFBNEIsU0FBL0M7QUFDQSxZQUFJMEIsVUFBVSxHQUFHRixnQkFBZ0IsQ0FBQzVFLEtBQWpCLElBQTBCLE9BQTNDO0FBQ0EsZUFBTyxDQUNMSSxDQUFDLENBQUMsVUFBRCxFQUFhO0FBQ1pFLFVBQUFBLEtBQUssRUFBTEEsS0FEWTtBQUVaNEIsVUFBQUEsS0FBSyxFQUFMQSxLQUZZO0FBR1pDLFVBQUFBLEtBQUssRUFBRTtBQUNMckMsWUFBQUEsS0FBSyxFQUFFSCxvQkFBUWUsR0FBUixDQUFZSCxHQUFaLEVBQWlCQyxNQUFNLENBQUNHLFFBQXhCLENBREY7QUFFTHlCLFlBQUFBLFFBRkssb0JBRUszQixTQUZMLEVBRW1CO0FBQ3RCZCxrQ0FBUTBDLEdBQVIsQ0FBWTlCLEdBQVosRUFBaUJDLE1BQU0sQ0FBQ0csUUFBeEIsRUFBa0NGLFNBQWxDO0FBQ0Q7QUFKSSxXQUhLO0FBU1pnQixVQUFBQSxFQUFFLEVBQUVMLGFBQWEsQ0FBQ0MsVUFBRCxFQUFhaEIsTUFBYjtBQVRMLFNBQWIsRUFVRVYsb0JBQVFnRCxHQUFSLENBQVlnQyxZQUFaLEVBQTBCLFVBQUNJLEtBQUQsRUFBYUMsTUFBYixFQUErQjtBQUMxRCxpQkFBTzVFLENBQUMsQ0FBQyxvQkFBRCxFQUF1QjtBQUM3QnNELFlBQUFBLEdBQUcsRUFBRXNCO0FBRHdCLFdBQXZCLEVBRUwsQ0FDRDVFLENBQUMsQ0FBQyxNQUFELEVBQVM7QUFDUjZFLFlBQUFBLElBQUksRUFBRTtBQURFLFdBQVQsRUFFRUYsS0FBSyxDQUFDRCxVQUFELENBRlAsQ0FEQSxFQUlEOUMsTUFKQyxDQUtEbUIsYUFBYSxDQUFDL0MsQ0FBRCxFQUFJMkUsS0FBSyxDQUFDRixZQUFELENBQVQsRUFBeUJ4QixXQUF6QixDQUxaLENBRkssQ0FBUjtBQVNELFNBVkUsQ0FWRixDQURJLENBQVA7QUF1QkQ7O0FBQ0QsYUFBTyxDQUNMakQsQ0FBQyxDQUFDLFVBQUQsRUFBYTtBQUNaRSxRQUFBQSxLQUFLLEVBQUxBLEtBRFk7QUFFWjRCLFFBQUFBLEtBQUssRUFBTEEsS0FGWTtBQUdaQyxRQUFBQSxLQUFLLEVBQUU7QUFDTHJDLFVBQUFBLEtBQUssRUFBRUgsb0JBQVFlLEdBQVIsQ0FBWUgsR0FBWixFQUFpQkMsTUFBTSxDQUFDRyxRQUF4QixDQURGO0FBRUx5QixVQUFBQSxRQUZLLG9CQUVLM0IsU0FGTCxFQUVtQjtBQUN0QmQsZ0NBQVEwQyxHQUFSLENBQVk5QixHQUFaLEVBQWlCQyxNQUFNLENBQUNHLFFBQXhCLEVBQWtDRixTQUFsQztBQUNEO0FBSkksU0FISztBQVNaZ0IsUUFBQUEsRUFBRSxFQUFFTCxhQUFhLENBQUNDLFVBQUQsRUFBYWhCLE1BQWI7QUFUTCxPQUFiLEVBVUU4QyxhQUFhLENBQUMvQyxDQUFELEVBQUlnRCxPQUFKLEVBQWFDLFdBQWIsQ0FWZixDQURJLENBQVA7QUFhRCxLQTlDTTtBQStDUDZCLElBQUFBLFVBL0NPLHNCQStDSzlFLENBL0NMLEVBK0NrQmlCLFVBL0NsQixFQStDbUNoQixNQS9DbkMsRUErQzhDO0FBQUEsVUFDN0MrQyxPQUQ2QyxHQUNrQy9CLFVBRGxDLENBQzdDK0IsT0FENkM7QUFBQSxVQUNwQ3VCLFlBRG9DLEdBQ2tDdEQsVUFEbEMsQ0FDcENzRCxZQURvQztBQUFBLDhCQUNrQ3RELFVBRGxDLENBQ3RCZixLQURzQjtBQUFBLFVBQ3RCQSxLQURzQixrQ0FDZCxFQURjO0FBQUEsbUNBQ2tDZSxVQURsQyxDQUNWZ0MsV0FEVTtBQUFBLFVBQ1ZBLFdBRFUsdUNBQ0ksRUFESjtBQUFBLG1DQUNrQ2hDLFVBRGxDLENBQ1F1RCxnQkFEUjtBQUFBLFVBQ1FBLGdCQURSLHVDQUMyQixFQUQzQjtBQUFBLFVBRTdDckUsR0FGNkMsR0FFN0JGLE1BRjZCLENBRTdDRSxHQUY2QztBQUFBLFVBRXhDQyxNQUZ3QyxHQUU3QkgsTUFGNkIsQ0FFeENHLE1BRndDO0FBR25ELFVBQUk4QyxTQUFTLEdBQUdELFdBQVcsQ0FBQ3JELEtBQVosSUFBcUIsT0FBckM7QUFDQSxVQUFJdUQsU0FBUyxHQUFHRixXQUFXLENBQUN2RCxLQUFaLElBQXFCLE9BQXJDO0FBQ0EsVUFBSStFLFlBQVksR0FBR0QsZ0JBQWdCLENBQUN4QixPQUFqQixJQUE0QixTQUEvQzs7QUFDQSxVQUFJM0MsU0FBUyxHQUFHZCxvQkFBUWUsR0FBUixDQUFZSCxHQUFaLEVBQWlCQyxNQUFNLENBQUNHLFFBQXhCLENBQWhCOztBQUNBLFVBQUksRUFBRUYsU0FBUyxLQUFLLElBQWQsSUFBc0JBLFNBQVMsS0FBSzBFLFNBQXBDLElBQWlEMUUsU0FBUyxLQUFLLEVBQWpFLENBQUosRUFBMEU7QUFDeEUsZUFBT0ksUUFBUSxDQUFDVCxDQUFELEVBQUlULG9CQUFRZ0QsR0FBUixDQUFZckMsS0FBSyxDQUFDOEUsSUFBTixLQUFlLFVBQWYsR0FBNEIzRSxTQUE1QixHQUF3QyxDQUFDQSxTQUFELENBQXBELEVBQWlFa0UsWUFBWSxHQUFHLFVBQUM3RSxLQUFELEVBQWU7QUFDaEgsY0FBSXVGLFVBQUo7O0FBQ0EsZUFBSyxJQUFJaEcsS0FBSyxHQUFHLENBQWpCLEVBQW9CQSxLQUFLLEdBQUdzRixZQUFZLENBQUNqRixNQUF6QyxFQUFpREwsS0FBSyxFQUF0RCxFQUEwRDtBQUN4RGdHLFlBQUFBLFVBQVUsR0FBRzFGLG9CQUFRMkYsSUFBUixDQUFhWCxZQUFZLENBQUN0RixLQUFELENBQVosQ0FBb0J3RixZQUFwQixDQUFiLEVBQWdELFVBQUNoRixJQUFEO0FBQUEscUJBQWVBLElBQUksQ0FBQzBELFNBQUQsQ0FBSixLQUFvQnpELEtBQW5DO0FBQUEsYUFBaEQsQ0FBYjs7QUFDQSxnQkFBSXVGLFVBQUosRUFBZ0I7QUFDZDtBQUNEO0FBQ0Y7O0FBQ0QsaUJBQU9BLFVBQVUsR0FBR0EsVUFBVSxDQUFDL0IsU0FBRCxDQUFiLEdBQTJCeEQsS0FBNUM7QUFDRCxTQVQrRixHQVM1RixVQUFDQSxLQUFELEVBQWU7QUFDakIsY0FBSXVGLFVBQVUsR0FBRzFGLG9CQUFRMkYsSUFBUixDQUFhbEMsT0FBYixFQUFzQixVQUFDdkQsSUFBRDtBQUFBLG1CQUFlQSxJQUFJLENBQUMwRCxTQUFELENBQUosS0FBb0J6RCxLQUFuQztBQUFBLFdBQXRCLENBQWpCOztBQUNBLGlCQUFPdUYsVUFBVSxHQUFHQSxVQUFVLENBQUMvQixTQUFELENBQWIsR0FBMkJ4RCxLQUE1QztBQUNELFNBWmtCLEVBWWhCeUYsSUFaZ0IsQ0FZWCxHQVpXLENBQUosQ0FBZjtBQWFEOztBQUNELGFBQU8xRSxRQUFRLENBQUNULENBQUQsRUFBSSxFQUFKLENBQWY7QUFDRCxLQXRFTTtBQXVFUGlFLElBQUFBLFlBdkVPLHdCQXVFT2pFLENBdkVQLEVBdUVvQmlCLFVBdkVwQixFQXVFcUNoQixNQXZFckMsRUF1RWtEa0MsT0F2RWxELEVBdUU4RDtBQUFBLFVBQzdEYSxPQUQ2RCxHQUNNL0IsVUFETixDQUM3RCtCLE9BRDZEO0FBQUEsVUFDcER1QixZQURvRCxHQUNNdEQsVUFETixDQUNwRHNELFlBRG9EO0FBQUEsbUNBQ010RCxVQUROLENBQ3RDZ0MsV0FEc0M7QUFBQSxVQUN0Q0EsV0FEc0MsdUNBQ3hCLEVBRHdCO0FBQUEsbUNBQ01oQyxVQUROLENBQ3BCdUQsZ0JBRG9CO0FBQUEsVUFDcEJBLGdCQURvQix1Q0FDRCxFQURDO0FBQUEsVUFFN0RwRSxNQUY2RCxHQUVsREgsTUFGa0QsQ0FFN0RHLE1BRjZEO0FBQUEsVUFHN0QwQixLQUg2RCxHQUczQ2IsVUFIMkMsQ0FHN0RhLEtBSDZEO0FBQUEsVUFHdERYLE1BSHNELEdBRzNDRixVQUgyQyxDQUd0REUsTUFIc0Q7QUFJbkUsVUFBSWpCLEtBQUssR0FBR1EsUUFBUSxDQUFDVCxNQUFELEVBQVNnQixVQUFULENBQXBCO0FBQ0EsVUFBSUcsSUFBSSxHQUFHLFFBQVg7O0FBQ0EsVUFBSW1ELFlBQUosRUFBa0I7QUFDaEIsWUFBSUUsWUFBWSxHQUFHRCxnQkFBZ0IsQ0FBQ3hCLE9BQWpCLElBQTRCLFNBQS9DO0FBQ0EsWUFBSTBCLFVBQVUsR0FBR0YsZ0JBQWdCLENBQUM1RSxLQUFqQixJQUEwQixPQUEzQztBQUNBLGVBQU9RLE1BQU0sQ0FBQ2tDLE9BQVAsQ0FBZUMsR0FBZixDQUFtQixVQUFDOUMsSUFBRCxFQUFjO0FBQ3RDLGlCQUFPTyxDQUFDLENBQUMsVUFBRCxFQUFhO0FBQ25CRSxZQUFBQSxLQUFLLEVBQUxBLEtBRG1CO0FBRW5CNEIsWUFBQUEsS0FBSyxFQUFMQSxLQUZtQjtBQUduQkMsWUFBQUEsS0FBSyxFQUFFO0FBQ0xyQyxjQUFBQSxLQUFLLEVBQUVELElBQUksQ0FBQytDLElBRFA7QUFFTFIsY0FBQUEsUUFGSyxvQkFFS1MsV0FGTCxFQUVxQjtBQUN4QmhELGdCQUFBQSxJQUFJLENBQUMrQyxJQUFMLEdBQVlDLFdBQVo7QUFDRDtBQUpJLGFBSFk7QUFTbkJwQixZQUFBQSxFQUFFLEVBQUVhLGVBQWUscUJBQ2hCZCxJQURnQixZQUNUMUIsS0FEUyxFQUNDO0FBQ2hCZ0QsY0FBQUEsbUJBQW1CLENBQUNQLE9BQUQsRUFBVS9CLE1BQVYsRUFBa0JWLEtBQUssSUFBSUEsS0FBSyxDQUFDSixNQUFOLEdBQWUsQ0FBMUMsRUFBNkNHLElBQTdDLENBQW5COztBQUNBLGtCQUFJMEIsTUFBTSxJQUFJQSxNQUFNLENBQUNDLElBQUQsQ0FBcEIsRUFBNEI7QUFDMUJELGdCQUFBQSxNQUFNLENBQUNDLElBQUQsQ0FBTixDQUFhZ0IsTUFBTSxDQUFDdkIsTUFBUCxDQUFjO0FBQUVzQixrQkFBQUEsT0FBTyxFQUFQQTtBQUFGLGlCQUFkLEVBQTJCbEMsTUFBM0IsQ0FBYixFQUFpRFAsS0FBakQ7QUFDRDtBQUNGLGFBTmdCLEdBT2hCdUIsVUFQZ0IsRUFPSmhCLE1BUEksRUFPSWtDLE9BUEo7QUFUQSxXQUFiLEVBaUJMNUMsb0JBQVFnRCxHQUFSLENBQVlnQyxZQUFaLEVBQTBCLFVBQUNJLEtBQUQsRUFBYUMsTUFBYixFQUErQjtBQUMxRCxtQkFBTzVFLENBQUMsQ0FBQyxvQkFBRCxFQUF1QjtBQUM3QnNELGNBQUFBLEdBQUcsRUFBRXNCO0FBRHdCLGFBQXZCLEVBRUwsQ0FDRDVFLENBQUMsQ0FBQyxNQUFELEVBQVM7QUFDUjZFLGNBQUFBLElBQUksRUFBRTtBQURFLGFBQVQsRUFFRUYsS0FBSyxDQUFDRCxVQUFELENBRlAsQ0FEQSxFQUlEOUMsTUFKQyxDQUtEbUIsYUFBYSxDQUFDL0MsQ0FBRCxFQUFJMkUsS0FBSyxDQUFDRixZQUFELENBQVQsRUFBeUJ4QixXQUF6QixDQUxaLENBRkssQ0FBUjtBQVNELFdBVkUsQ0FqQkssQ0FBUjtBQTRCRCxTQTdCTSxDQUFQO0FBOEJEOztBQUNELGFBQU83QyxNQUFNLENBQUNrQyxPQUFQLENBQWVDLEdBQWYsQ0FBbUIsVUFBQzlDLElBQUQsRUFBYztBQUN0QyxlQUFPTyxDQUFDLENBQUMsVUFBRCxFQUFhO0FBQ25CRSxVQUFBQSxLQUFLLEVBQUxBLEtBRG1CO0FBRW5CNEIsVUFBQUEsS0FBSyxFQUFMQSxLQUZtQjtBQUduQkMsVUFBQUEsS0FBSyxFQUFFO0FBQ0xyQyxZQUFBQSxLQUFLLEVBQUVELElBQUksQ0FBQytDLElBRFA7QUFFTFIsWUFBQUEsUUFGSyxvQkFFS1MsV0FGTCxFQUVxQjtBQUN4QmhELGNBQUFBLElBQUksQ0FBQytDLElBQUwsR0FBWUMsV0FBWjtBQUNEO0FBSkksV0FIWTtBQVNuQnBCLFVBQUFBLEVBQUUsRUFBRWEsZUFBZSxDQUFDO0FBQ2xCa0QsWUFBQUEsTUFEa0Isa0JBQ1YxRixLQURVLEVBQ0E7QUFDaEJnRCxjQUFBQSxtQkFBbUIsQ0FBQ1AsT0FBRCxFQUFVL0IsTUFBVixFQUFrQlYsS0FBSyxJQUFJQSxLQUFLLENBQUNKLE1BQU4sR0FBZSxDQUExQyxFQUE2Q0csSUFBN0MsQ0FBbkI7O0FBQ0Esa0JBQUkwQixNQUFNLElBQUlBLE1BQU0sQ0FBQ0MsSUFBRCxDQUFwQixFQUE0QjtBQUMxQkQsZ0JBQUFBLE1BQU0sQ0FBQ0MsSUFBRCxDQUFOLENBQWFnQixNQUFNLENBQUN2QixNQUFQLENBQWM7QUFBRXNCLGtCQUFBQSxPQUFPLEVBQVBBO0FBQUYsaUJBQWQsRUFBMkJsQyxNQUEzQixDQUFiLEVBQWlEUCxLQUFqRDtBQUNEO0FBQ0Y7QUFOaUIsV0FBRCxFQU9oQnVCLFVBUGdCLEVBT0poQixNQVBJLEVBT0lrQyxPQVBKO0FBVEEsU0FBYixFQWlCTFksYUFBYSxDQUFDL0MsQ0FBRCxFQUFJZ0QsT0FBSixFQUFhQyxXQUFiLENBakJSLENBQVI7QUFrQkQsT0FuQk0sQ0FBUDtBQW9CRCxLQW5JTTtBQW9JUGlCLElBQUFBLFlBcElPLCtCQW9JbUM7QUFBQSxVQUExQnBCLE1BQTBCLFNBQTFCQSxNQUEwQjtBQUFBLFVBQWxCM0MsR0FBa0IsU0FBbEJBLEdBQWtCO0FBQUEsVUFBYkMsTUFBYSxTQUFiQSxNQUFhO0FBQUEsVUFDbENvQyxJQURrQyxHQUN6Qk0sTUFEeUIsQ0FDbENOLElBRGtDO0FBQUEsVUFFbENqQyxRQUZrQyxHQUVLSCxNQUZMLENBRWxDRyxRQUZrQztBQUFBLFVBRVZVLFVBRlUsR0FFS2IsTUFGTCxDQUV4QmlGLFlBRndCO0FBQUEsK0JBR25CcEUsVUFIbUIsQ0FHbENmLEtBSGtDO0FBQUEsVUFHbENBLEtBSGtDLG1DQUcxQixFQUgwQjs7QUFJeEMsVUFBSUcsU0FBUyxHQUFHZCxvQkFBUWUsR0FBUixDQUFZSCxHQUFaLEVBQWlCSSxRQUFqQixDQUFoQjs7QUFDQSxVQUFJTCxLQUFLLENBQUM4RSxJQUFOLEtBQWUsVUFBbkIsRUFBK0I7QUFDN0IsWUFBSXpGLG9CQUFRK0YsT0FBUixDQUFnQmpGLFNBQWhCLENBQUosRUFBZ0M7QUFDOUIsaUJBQU9kLG9CQUFRZ0csYUFBUixDQUFzQmxGLFNBQXRCLEVBQWlDbUMsSUFBakMsQ0FBUDtBQUNEOztBQUNELGVBQU9BLElBQUksQ0FBQ2dELE9BQUwsQ0FBYW5GLFNBQWIsSUFBMEIsQ0FBQyxDQUFsQztBQUNEO0FBQ0Q7OztBQUNBLGFBQU9BLFNBQVMsSUFBSW1DLElBQXBCO0FBQ0QsS0FqSk07QUFrSlAyQixJQUFBQSxVQWxKTyxzQkFrSktuRSxDQWxKTCxFQWtKa0JpQixVQWxKbEIsRUFrSm1DaEIsTUFsSm5DLEVBa0pnRGtDLE9BbEpoRCxFQWtKNEQ7QUFBQSxVQUMzRGEsT0FEMkQsR0FDUS9CLFVBRFIsQ0FDM0QrQixPQUQyRDtBQUFBLFVBQ2xEdUIsWUFEa0QsR0FDUXRELFVBRFIsQ0FDbERzRCxZQURrRDtBQUFBLG1DQUNRdEQsVUFEUixDQUNwQ2dDLFdBRG9DO0FBQUEsVUFDcENBLFdBRG9DLHVDQUN0QixFQURzQjtBQUFBLG1DQUNRaEMsVUFEUixDQUNsQnVELGdCQURrQjtBQUFBLFVBQ2xCQSxnQkFEa0IsdUNBQ0MsRUFERDtBQUFBLFVBRTNEaEMsSUFGMkQsR0FFeEN2QyxNQUZ3QyxDQUUzRHVDLElBRjJEO0FBQUEsVUFFckRqQyxRQUZxRCxHQUV4Q04sTUFGd0MsQ0FFckRNLFFBRnFEO0FBQUEsVUFHM0R1QixLQUgyRCxHQUdqRGIsVUFIaUQsQ0FHM0RhLEtBSDJEO0FBSWpFLFVBQUk1QixLQUFLLEdBQVF1RCxZQUFZLENBQUN0QixPQUFELEVBQVVsQixVQUFWLENBQTdCOztBQUNBLFVBQUlzRCxZQUFKLEVBQWtCO0FBQ2hCLFlBQUlFLFlBQVksR0FBV0QsZ0JBQWdCLENBQUN4QixPQUFqQixJQUE0QixTQUF2RDtBQUNBLFlBQUkwQixVQUFVLEdBQVdGLGdCQUFnQixDQUFDNUUsS0FBakIsSUFBMEIsT0FBbkQ7QUFDQSxlQUFPLENBQ0xJLENBQUMsQ0FBQyxVQUFELEVBQWE7QUFDWkUsVUFBQUEsS0FBSyxFQUFMQSxLQURZO0FBRVo0QixVQUFBQSxLQUFLLEVBQUxBLEtBRlk7QUFHWkMsVUFBQUEsS0FBSyxFQUFFO0FBQ0xyQyxZQUFBQSxLQUFLLEVBQUVILG9CQUFRZSxHQUFSLENBQVlrQyxJQUFaLEVBQWtCakMsUUFBbEIsQ0FERjtBQUVMeUIsWUFBQUEsUUFGSyxvQkFFSzNCLFNBRkwsRUFFbUI7QUFDdEJkLGtDQUFRMEMsR0FBUixDQUFZTyxJQUFaLEVBQWtCakMsUUFBbEIsRUFBNEJGLFNBQTVCO0FBQ0Q7QUFKSSxXQUhLO0FBU1pnQixVQUFBQSxFQUFFLEVBQUVxQyxhQUFhLENBQUN6QyxVQUFELEVBQWFoQixNQUFiLEVBQXFCa0MsT0FBckI7QUFUTCxTQUFiLEVBVUU1QyxvQkFBUWdELEdBQVIsQ0FBWWdDLFlBQVosRUFBMEIsVUFBQ0ksS0FBRCxFQUFhQyxNQUFiLEVBQStCO0FBQzFELGlCQUFPNUUsQ0FBQyxDQUFDLG9CQUFELEVBQXVCO0FBQzdCc0QsWUFBQUEsR0FBRyxFQUFFc0I7QUFEd0IsV0FBdkIsRUFFTCxDQUNENUUsQ0FBQyxDQUFDLE1BQUQsRUFBUztBQUNSNkUsWUFBQUEsSUFBSSxFQUFFO0FBREUsV0FBVCxFQUVFRixLQUFLLENBQUNELFVBQUQsQ0FGUCxDQURBLEVBSUQ5QyxNQUpDLENBS0RtQixhQUFhLENBQUMvQyxDQUFELEVBQUkyRSxLQUFLLENBQUNGLFlBQUQsQ0FBVCxFQUF5QnhCLFdBQXpCLENBTFosQ0FGSyxDQUFSO0FBU0QsU0FWRSxDQVZGLENBREksQ0FBUDtBQXVCRDs7QUFDRCxhQUFPLENBQ0xqRCxDQUFDLENBQUMsVUFBRCxFQUFhO0FBQ1pFLFFBQUFBLEtBQUssRUFBTEEsS0FEWTtBQUVaNEIsUUFBQUEsS0FBSyxFQUFMQSxLQUZZO0FBR1pDLFFBQUFBLEtBQUssRUFBRTtBQUNMckMsVUFBQUEsS0FBSyxFQUFFSCxvQkFBUWUsR0FBUixDQUFZa0MsSUFBWixFQUFrQmpDLFFBQWxCLENBREY7QUFFTHlCLFVBQUFBLFFBRkssb0JBRUszQixTQUZMLEVBRW1CO0FBQ3RCZCxnQ0FBUTBDLEdBQVIsQ0FBWU8sSUFBWixFQUFrQmpDLFFBQWxCLEVBQTRCRixTQUE1QjtBQUNEO0FBSkksU0FISztBQVNaZ0IsUUFBQUEsRUFBRSxFQUFFcUMsYUFBYSxDQUFDekMsVUFBRCxFQUFhaEIsTUFBYixFQUFxQmtDLE9BQXJCO0FBVEwsT0FBYixFQVVFWSxhQUFhLENBQUMvQyxDQUFELEVBQUlnRCxPQUFKLEVBQWFDLFdBQWIsQ0FWZixDQURJLENBQVA7QUFhRDtBQS9MTSxHQXpCTztBQTBOaEJ3QyxFQUFBQSxTQUFTLEVBQUU7QUFDVHpCLElBQUFBLFVBQVUsRUFBRW5DLGdCQUFnQixFQURuQjtBQUVUaUQsSUFBQUEsVUFGUyxzQkFFRzlFLENBRkgsU0FFcUNDLE1BRnJDLEVBRWdEO0FBQUEsOEJBQTlCQyxLQUE4QjtBQUFBLFVBQTlCQSxLQUE4Qiw0QkFBdEIsRUFBc0I7QUFBQSxVQUNqREMsR0FEaUQsR0FDakNGLE1BRGlDLENBQ2pERSxHQURpRDtBQUFBLFVBQzVDQyxNQUQ0QyxHQUNqQ0gsTUFEaUMsQ0FDNUNHLE1BRDRDOztBQUV2RCxVQUFJQyxTQUFTLEdBQUdkLG9CQUFRZSxHQUFSLENBQVlILEdBQVosRUFBaUJDLE1BQU0sQ0FBQ0csUUFBeEIsQ0FBaEI7O0FBQ0EsVUFBSXBCLE1BQU0sR0FBR2tCLFNBQVMsSUFBSSxFQUExQjtBQUNBLFVBQUlqQixNQUFNLEdBQWUsRUFBekI7QUFDQUosTUFBQUEsaUJBQWlCLENBQUMsQ0FBRCxFQUFJa0IsS0FBSyxDQUFDOEMsT0FBVixFQUFtQjdELE1BQW5CLEVBQTJCQyxNQUEzQixDQUFqQjtBQUNBLGFBQU9xQixRQUFRLENBQUNULENBQUQsRUFBSSxDQUFDRSxLQUFLLENBQUN3RixhQUFOLEtBQXdCLEtBQXhCLEdBQWdDdEcsTUFBTSxDQUFDdUcsS0FBUCxDQUFhdkcsTUFBTSxDQUFDRSxNQUFQLEdBQWdCLENBQTdCLEVBQWdDRixNQUFNLENBQUNFLE1BQXZDLENBQWhDLEdBQWlGRixNQUFsRixFQUEwRitGLElBQTFGLFlBQW1HakYsS0FBSyxDQUFDMEYsU0FBTixJQUFtQixHQUF0SCxPQUFKLENBQWY7QUFDRCxLQVRRO0FBVVR6QixJQUFBQSxVQUFVLEVBQUVaLG9CQUFvQjtBQVZ2QixHQTFOSztBQXNPaEJzQyxFQUFBQSxXQUFXLEVBQUU7QUFDWDdCLElBQUFBLFVBQVUsRUFBRW5DLGdCQUFnQixFQURqQjtBQUVYaUQsSUFBQUEsVUFBVSxFQUFFaEYsZ0JBQWdCLENBQUMsWUFBRCxDQUZqQjtBQUdYcUUsSUFBQUEsVUFBVSxFQUFFWixvQkFBb0I7QUFIckIsR0F0T0c7QUEyT2hCdUMsRUFBQUEsWUFBWSxFQUFFO0FBQ1o5QixJQUFBQSxVQUFVLEVBQUVuQyxnQkFBZ0IsRUFEaEI7QUFFWmlELElBQUFBLFVBQVUsRUFBRWhGLGdCQUFnQixDQUFDLFNBQUQsQ0FGaEI7QUFHWnFFLElBQUFBLFVBQVUsRUFBRVosb0JBQW9CO0FBSHBCLEdBM09FO0FBZ1BoQndDLEVBQUFBLFlBQVksRUFBRTtBQUNaL0IsSUFBQUEsVUFBVSxFQUFFbkMsZ0JBQWdCLEVBRGhCO0FBRVppRCxJQUFBQSxVQUZZLHNCQUVBOUUsQ0FGQSxTQUVrQ0MsTUFGbEMsRUFFNkM7QUFBQSw4QkFBOUJDLEtBQThCO0FBQUEsVUFBOUJBLEtBQThCLDRCQUF0QixFQUFzQjtBQUFBLFVBQ2pEQyxHQURpRCxHQUNqQ0YsTUFEaUMsQ0FDakRFLEdBRGlEO0FBQUEsVUFDNUNDLE1BRDRDLEdBQ2pDSCxNQURpQyxDQUM1Q0csTUFENEM7O0FBRXZELFVBQUlDLFNBQVMsR0FBR2Qsb0JBQVFlLEdBQVIsQ0FBWUgsR0FBWixFQUFpQkMsTUFBTSxDQUFDRyxRQUF4QixDQUFoQjs7QUFDQSxVQUFJRixTQUFKLEVBQWU7QUFDYkEsUUFBQUEsU0FBUyxHQUFHZCxvQkFBUWdELEdBQVIsQ0FBWWxDLFNBQVosRUFBdUIsVUFBQzJGLElBQUQ7QUFBQSxpQkFBZUEsSUFBSSxDQUFDeEYsTUFBTCxDQUFZTixLQUFLLENBQUNNLE1BQU4sSUFBZ0IsWUFBNUIsQ0FBZjtBQUFBLFNBQXZCLEVBQWlGMkUsSUFBakYsQ0FBc0YsS0FBdEYsQ0FBWjtBQUNEOztBQUNELGFBQU8xRSxRQUFRLENBQUNULENBQUQsRUFBSUssU0FBSixDQUFmO0FBQ0QsS0FUVztBQVVaOEQsSUFBQUEsVUFBVSxFQUFFWixvQkFBb0I7QUFWcEIsR0FoUEU7QUE0UGhCMEMsRUFBQUEsV0FBVyxFQUFFO0FBQ1hqQyxJQUFBQSxVQUFVLEVBQUVuQyxnQkFBZ0IsRUFEakI7QUFFWGlELElBQUFBLFVBQVUsRUFBRWhGLGdCQUFnQixDQUFDLFVBQUQsQ0FGakI7QUFHWHFFLElBQUFBLFVBQVUsRUFBRVosb0JBQW9CO0FBSHJCLEdBNVBHO0FBaVFoQjJDLEVBQUFBLFdBQVcsRUFBRTtBQUNYbEMsSUFBQUEsVUFBVSxFQUFFbkMsZ0JBQWdCLEVBRGpCO0FBRVhpRCxJQUFBQSxVQUFVLEVBQUVoRixnQkFBZ0IsQ0FBQyxVQUFELENBRmpCO0FBR1hxRSxJQUFBQSxVQUFVLEVBQUVaLG9CQUFvQjtBQUhyQixHQWpRRztBQXNRaEI0QyxFQUFBQSxXQUFXLEVBQUU7QUFDWG5DLElBQUFBLFVBQVUsRUFBRW5DLGdCQUFnQixFQURqQjtBQUVYaUQsSUFBQUEsVUFGVyxzQkFFQzlFLENBRkQsVUFFbUNDLE1BRm5DLEVBRThDO0FBQUEsZ0NBQTlCQyxLQUE4QjtBQUFBLFVBQTlCQSxLQUE4Qiw2QkFBdEIsRUFBc0I7QUFBQSxVQUNqREMsR0FEaUQsR0FDakNGLE1BRGlDLENBQ2pERSxHQURpRDtBQUFBLFVBQzVDQyxNQUQ0QyxHQUNqQ0gsTUFEaUMsQ0FDNUNHLE1BRDRDOztBQUV2RCxVQUFJQyxTQUFTLEdBQUdkLG9CQUFRZSxHQUFSLENBQVlILEdBQVosRUFBaUJDLE1BQU0sQ0FBQ0csUUFBeEIsQ0FBaEI7O0FBQ0EsVUFBSUYsU0FBUyxLQUFLSCxLQUFLLENBQUNrRyxhQUFOLElBQXVCbEcsS0FBSyxDQUFDbUcsUUFBbEMsQ0FBYixFQUEwRDtBQUN4RGhHLFFBQUFBLFNBQVMsR0FBR0EsU0FBUyxDQUFDOEUsSUFBVixDQUFlLEdBQWYsQ0FBWjtBQUNEOztBQUNELGFBQU8xRSxRQUFRLENBQUNULENBQUQsRUFBSUssU0FBSixDQUFmO0FBQ0QsS0FUVTtBQVVYOEQsSUFBQUEsVUFBVSxFQUFFWixvQkFBb0I7QUFWckIsR0F0UUc7QUFrUmhCK0MsRUFBQUEsS0FBSyxFQUFFO0FBQ0x2QyxJQUFBQSxhQUFhLEVBQUVsQyxnQkFBZ0IsRUFEMUI7QUFFTG1DLElBQUFBLFVBQVUsRUFBRW5DLGdCQUFnQixFQUZ2QjtBQUdMb0MsSUFBQUEsWUFBWSxFQUFFNUIsa0JBQWtCLEVBSDNCO0FBSUw2QixJQUFBQSxZQUFZLEVBQUVyQixtQkFKVDtBQUtMc0IsSUFBQUEsVUFBVSxFQUFFWixvQkFBb0I7QUFMM0IsR0FsUlM7QUF5UmhCZ0QsRUFBQUEsT0FBTyxFQUFFO0FBQ1B4QyxJQUFBQSxhQUFhLEVBQUVsQyxnQkFBZ0IsRUFEeEI7QUFFUG1DLElBQUFBLFVBQVUsRUFBRW5DLGdCQUFnQixFQUZyQjtBQUdQb0MsSUFBQUEsWUFBWSxFQUFFNUIsa0JBQWtCLEVBSHpCO0FBSVA2QixJQUFBQSxZQUFZLEVBQUVyQixtQkFKUDtBQUtQc0IsSUFBQUEsVUFBVSxFQUFFWixvQkFBb0I7QUFMekI7QUF6Uk8sQ0FBbEI7QUFrU0E7Ozs7QUFHQSxTQUFTaUQsZ0JBQVQsQ0FBMkJ2RyxNQUEzQixFQUF3Q3FCLElBQXhDLEVBQW1EYSxPQUFuRCxFQUErRDtBQUFBLE1BQ3ZEc0Usa0JBRHVELEdBQ2hDdEUsT0FEZ0MsQ0FDdkRzRSxrQkFEdUQ7QUFFN0QsTUFBSUMsUUFBUSxHQUFHQyxRQUFRLENBQUNDLElBQXhCOztBQUNBLE9BQ0U7QUFDQUgsRUFBQUEsa0JBQWtCLENBQUNuRixJQUFELEVBQU9vRixRQUFQLEVBQWlCLHFCQUFqQixDQUFsQixDQUEwREcsSUFBMUQsSUFDQTtBQUNBSixFQUFBQSxrQkFBa0IsQ0FBQ25GLElBQUQsRUFBT29GLFFBQVAsRUFBaUIsb0JBQWpCLENBQWxCLENBQXlERyxJQUZ6RCxJQUdBO0FBQ0FKLEVBQUFBLGtCQUFrQixDQUFDbkYsSUFBRCxFQUFPb0YsUUFBUCxFQUFpQiwrQkFBakIsQ0FBbEIsQ0FBb0VHLElBSnBFLElBS0E7QUFDQUosRUFBQUEsa0JBQWtCLENBQUNuRixJQUFELEVBQU9vRixRQUFQLEVBQWlCLHVCQUFqQixDQUFsQixDQUE0REcsSUFSOUQsRUFTRTtBQUNBLFdBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFFRDs7Ozs7QUFHTyxJQUFNQyxrQkFBa0IsR0FBRztBQUNoQ0MsRUFBQUEsT0FEZ0MsbUJBQ3ZCQyxNQUR1QixFQUNBO0FBQUEsUUFDeEJDLFdBRHdCLEdBQ0VELE1BREYsQ0FDeEJDLFdBRHdCO0FBQUEsUUFDWEMsUUFEVyxHQUNFRixNQURGLENBQ1hFLFFBRFc7QUFFOUJBLElBQUFBLFFBQVEsQ0FBQ0MsS0FBVCxDQUFldkQsU0FBZjtBQUNBcUQsSUFBQUEsV0FBVyxDQUFDRyxHQUFaLENBQWdCLG1CQUFoQixFQUFxQ1osZ0JBQXJDO0FBQ0FTLElBQUFBLFdBQVcsQ0FBQ0csR0FBWixDQUFnQixvQkFBaEIsRUFBc0NaLGdCQUF0QztBQUNEO0FBTitCLENBQTNCOzs7QUFTUCxTQUFTYSxjQUFULENBQXlCaEgsU0FBekIsRUFBeUNHLE1BQXpDLEVBQXVEO0FBQ3JELFNBQU9ILFNBQVMsR0FBR0EsU0FBUyxDQUFDRyxNQUFWLENBQWlCQSxNQUFqQixDQUFILEdBQThCLEVBQTlDO0FBQ0Q7O0FBYURqQixvQkFBUTRILEtBQVIsQ0FBYztBQUNaRSxFQUFBQSxjQUFjLEVBQWRBO0FBRFksQ0FBZDs7QUFJQSxJQUFJLE9BQU9DLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE1BQU0sQ0FBQ0MsUUFBNUMsRUFBc0Q7QUFDcERELEVBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JWLGtCQUFwQjtBQUNEOztlQUVjQSxrQiIsImZpbGUiOiJpbmRleC5jb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgWEVVdGlscyBmcm9tICd4ZS11dGlscy9tZXRob2RzL3hlLXV0aWxzJ1xyXG5pbXBvcnQgVlhFVGFibGUgZnJvbSAndnhlLXRhYmxlL2xpYi92eGUtdGFibGUnXHJcblxyXG5mdW5jdGlvbiBtYXRjaENhc2NhZGVyRGF0YSAoaW5kZXg6IG51bWJlciwgbGlzdDogQXJyYXk8YW55PiwgdmFsdWVzOiBBcnJheTxhbnk+LCBsYWJlbHM6IEFycmF5PGFueT4pIHtcclxuICBsZXQgdmFsID0gdmFsdWVzW2luZGV4XVxyXG4gIGlmIChsaXN0ICYmIHZhbHVlcy5sZW5ndGggPiBpbmRleCkge1xyXG4gICAgWEVVdGlscy5lYWNoKGxpc3QsIChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IHZhbCkge1xyXG4gICAgICAgIGxhYmVscy5wdXNoKGl0ZW0ubGFiZWwpXHJcbiAgICAgICAgbWF0Y2hDYXNjYWRlckRhdGEoKytpbmRleCwgaXRlbS5jaGlsZHJlbiwgdmFsdWVzLCBsYWJlbHMpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXREYXRlUGlja2VyIChkZWZhdWx0Rm9ybWF0OiBhbnkpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCB7IHByb3BzID0ge30gfTogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgICBjZWxsVmFsdWUgPSBjZWxsVmFsdWUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCBkZWZhdWx0Rm9ybWF0KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNlbGxUZXh0KGgsIGNlbGxWYWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFByb3BzICh7ICR0YWJsZSB9OiBhbnksIHsgcHJvcHMgfTogYW55LCBkZWZhdWx0UHJvcHM/OiBhbnkpIHtcclxuICByZXR1cm4gWEVVdGlscy5hc3NpZ24oJHRhYmxlLnZTaXplID8geyBzaXplOiAkdGFibGUudlNpemUgfSA6IHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDZWxsRXZlbnRzIChyZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgbGV0IHsgbmFtZSwgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgbGV0IHsgJHRhYmxlIH0gPSBwYXJhbXNcclxuICBsZXQgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICBjYXNlICdBQXV0b0NvbXBsZXRlJzpcclxuICAgICAgdHlwZSA9ICdzZWxlY3QnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXQnOlxyXG4gICAgICB0eXBlID0gJ2lucHV0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0TnVtYmVyJzpcclxuICAgICAgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIGxldCBvbiA9IHtcclxuICAgIFt0eXBlXTogKGV2bnQ6IGFueSkgPT4ge1xyXG4gICAgICAkdGFibGUudXBkYXRlU3RhdHVzKHBhcmFtcylcclxuICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICBldmVudHNbdHlwZV0ocGFyYW1zLCBldm50KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChldmVudHMpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLmFzc2lnbih7fSwgWEVVdGlscy5vYmplY3RNYXAoZXZlbnRzLCAoY2I6IEZ1bmN0aW9uKSA9PiBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgY2IuYXBwbHkobnVsbCwgW3BhcmFtc10uY29uY2F0LmFwcGx5KHBhcmFtcywgYXJncykpXHJcbiAgICB9KSwgb24pXHJcbiAgfVxyXG4gIHJldHVybiBvblxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVFZGl0UmVuZGVyIChkZWZhdWx0UHJvcHM/OiBhbnkpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzLCBkZWZhdWx0UHJvcHMpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKHJlbmRlck9wdHMubmFtZSwge1xyXG4gICAgICAgIHByb3BzLFxyXG4gICAgICAgIGF0dHJzLFxyXG4gICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgICAgY2FsbGJhY2sgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIHZhbHVlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICB9KVxyXG4gICAgXVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RmlsdGVyRXZlbnRzIChvbjogYW55LCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICBsZXQgeyBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBpZiAoZXZlbnRzKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5hc3NpZ24oe30sIFhFVXRpbHMub2JqZWN0TWFwKGV2ZW50cywgKGNiOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oeyBjb250ZXh0IH0sIHBhcmFtcylcclxuICAgICAgY2IuYXBwbHkobnVsbCwgW3BhcmFtc10uY29uY2F0LmFwcGx5KHBhcmFtcywgYXJncykpXHJcbiAgICB9KSwgb24pXHJcbiAgfVxyXG4gIHJldHVybiBvblxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGaWx0ZXJSZW5kZXIgKGRlZmF1bHRQcm9wcz86IGFueSkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gICAgbGV0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgIGxldCB7IG5hbWUsIGF0dHJzLCBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICAgIHN3aXRjaCAobmFtZSkge1xyXG4gICAgICBjYXNlICdBQXV0b0NvbXBsZXRlJzpcclxuICAgICAgICB0eXBlID0gJ3NlbGVjdCdcclxuICAgICAgICBicmVha1xyXG4gICAgICBjYXNlICdBSW5wdXQnOlxyXG4gICAgICAgIHR5cGUgPSAnaW5wdXQnXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnQUlucHV0TnVtYmVyJzpcclxuICAgICAgICB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgICBicmVha1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgICBwcm9wcyxcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICAgIGNhbGxiYWNrIChvcHRpb25WYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGl0ZW0uZGF0YSA9IG9wdGlvblZhbHVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjogZ2V0RmlsdGVyRXZlbnRzKHtcclxuICAgICAgICAgIFt0eXBlXSAoZXZudDogYW55KSB7XHJcbiAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dCwgY29sdW1uLCAhIWl0ZW0uZGF0YSwgaXRlbSlcclxuICAgICAgICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICAgICAgICBldmVudHNbdHlwZV0oT2JqZWN0LmFzc2lnbih7IGNvbnRleHQgfSwgcGFyYW1zKSwgZXZudClcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sIHJlbmRlck9wdHMsIHBhcmFtcywgY29udGV4dClcclxuICAgICAgfSlcclxuICAgIH0pXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVDb25maXJtRmlsdGVyIChjb250ZXh0OiBhbnksIGNvbHVtbjogYW55LCBjaGVja2VkOiBhbnksIGl0ZW06IGFueSkge1xyXG4gIGNvbnRleHRbY29sdW1uLmZpbHRlck11bHRpcGxlID8gJ2NoYW5nZU11bHRpcGxlT3B0aW9uJyA6ICdjaGFuZ2VSYWRpb09wdGlvbiddKHt9LCBjaGVja2VkLCBpdGVtKVxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyTWV0aG9kICh7IG9wdGlvbiwgcm93LCBjb2x1bW4gfTogYW55KSB7XHJcbiAgbGV0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPT09IGRhdGFcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyT3B0aW9ucyAoaDogRnVuY3Rpb24sIG9wdGlvbnM6IGFueSwgb3B0aW9uUHJvcHM6IGFueSkge1xyXG4gIGxldCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgbGV0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICBsZXQgZGlzYWJsZWRQcm9wID0gb3B0aW9uUHJvcHMuZGlzYWJsZWQgfHwgJ2Rpc2FibGVkJ1xyXG4gIHJldHVybiBYRVV0aWxzLm1hcChvcHRpb25zLCAoaXRlbTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0aW9uJywge1xyXG4gICAgICBwcm9wczoge1xyXG4gICAgICAgIHZhbHVlOiBpdGVtW3ZhbHVlUHJvcF0sXHJcbiAgICAgICAgZGlzYWJsZWQ6IGl0ZW1bZGlzYWJsZWRQcm9wXVxyXG4gICAgICB9LFxyXG4gICAgICBrZXk6IGluZGV4XHJcbiAgICB9LCBpdGVtW2xhYmVsUHJvcF0pXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2VsbFRleHQgKGg6IEZ1bmN0aW9uLCBjZWxsVmFsdWU6IGFueSkge1xyXG4gIHJldHVybiBbJycgKyAoY2VsbFZhbHVlID09PSBudWxsIHx8IGNlbGxWYWx1ZSA9PT0gdm9pZCAwID8gJycgOiBjZWxsVmFsdWUpXVxyXG59XHJcblxyXG5mdW5jdGlvbiBjcmVhdGVGb3JtSXRlbVJlbmRlciAoZGVmYXVsdFByb3BzPzogYW55KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgICBsZXQgeyBkYXRhLCBmaWVsZCB9ID0gcGFyYW1zXHJcbiAgICBsZXQgeyBuYW1lIH0gPSByZW5kZXJPcHRzXHJcbiAgICBsZXQgeyBhdHRycyB9OiBhbnkgPSByZW5kZXJPcHRzXHJcbiAgICBsZXQgcHJvcHM6IGFueSA9IGdldEZvcm1Qcm9wcyhjb250ZXh0LCByZW5kZXJPcHRzLCBkZWZhdWx0UHJvcHMpXHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBoKG5hbWUsIHtcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBwcm9wcyxcclxuICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KGRhdGEsIGZpZWxkKSxcclxuICAgICAgICAgIGNhbGxiYWNrICh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIFhFVXRpbHMuc2V0KGRhdGEsIGZpZWxkLCB2YWx1ZSlcclxuICAgICAgICAgIH1cclxuICAgICAgICB9LFxyXG4gICAgICAgIG9uOiBnZXRGb3JtRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcywgY29udGV4dClcclxuICAgICAgfSlcclxuICAgIF1cclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZvcm1Qcm9wcyAoeyAkZm9ybSB9OiBhbnksIHsgcHJvcHMgfTogYW55LCBkZWZhdWx0UHJvcHM/OiBhbnkpIHtcclxuICByZXR1cm4gWEVVdGlscy5hc3NpZ24oJGZvcm0udlNpemUgPyB7IHNpemU6ICRmb3JtLnZTaXplIH0gOiB7fSwgZGVmYXVsdFByb3BzLCBwcm9wcylcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Rm9ybUV2ZW50cyAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgbGV0IHsgZXZlbnRzIH06IGFueSA9IHJlbmRlck9wdHNcclxuICBsZXQgb25cclxuICBpZiAoZXZlbnRzKSB7XHJcbiAgICBvbiA9IFhFVXRpbHMuYXNzaWduKHt9LCBYRVV0aWxzLm9iamVjdE1hcChldmVudHMsIChjYjogRnVuY3Rpb24pID0+IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICBjYi5hcHBseShudWxsLCBbcGFyYW1zXS5jb25jYXQuYXBwbHkocGFyYW1zLCBhcmdzKSlcclxuICAgIH0pLCBvbilcclxuICB9XHJcbiAgcmV0dXJuIG9uXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmuLLmn5Plh73mlbBcclxuICovXHJcbmNvbnN0IHJlbmRlck1hcCA9IHtcclxuICBBQXV0b0NvbXBsZXRlOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFJbnB1dDoge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2QsXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBSW5wdXROdW1iZXI6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dC1udW1iZXItaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFTZWxlY3Q6IHtcclxuICAgIHJlbmRlckVkaXQgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IG9wdGlvbnMsIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBsZXQgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSksXHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBYRVV0aWxzLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXA6IGFueSwgZ0luZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSksXHJcbiAgICAgICAgICAgIGNhbGxiYWNrIChjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCBjZWxsVmFsdWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjogZ2V0Q2VsbEV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZW5kZXJDZWxsIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIHByb3BzID0ge30sIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgIGxldCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgICAgIGxldCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgaWYgKCEoY2VsbFZhbHVlID09PSBudWxsIHx8IGNlbGxWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGNlbGxWYWx1ZSA9PT0gJycpKSB7XHJcbiAgICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIFhFVXRpbHMubWFwKHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScgPyBjZWxsVmFsdWUgOiBbY2VsbFZhbHVlXSwgb3B0aW9uR3JvdXBzID8gKHZhbHVlOiBhbnkpID0+IHtcclxuICAgICAgICAgIGxldCBzZWxlY3RJdGVtXHJcbiAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb3B0aW9uR3JvdXBzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBzZWxlY3RJdGVtID0gWEVVdGlscy5maW5kKG9wdGlvbkdyb3Vwc1tpbmRleF1bZ3JvdXBPcHRpb25zXSwgKGl0ZW06IGFueSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgICAgICAgaWYgKHNlbGVjdEl0ZW0pIHtcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gc2VsZWN0SXRlbSA/IHNlbGVjdEl0ZW1bbGFiZWxQcm9wXSA6IHZhbHVlXHJcbiAgICAgICAgfSA6ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgICAgICBsZXQgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25zLCAoaXRlbTogYW55KSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiB2YWx1ZVxyXG4gICAgICAgIH0pLmpvaW4oJzsnKSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgJycpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyRmlsdGVyIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgICAgIGxldCB7IG9wdGlvbnMsIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCB7IGF0dHJzLCBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gICAgICBsZXQgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcclxuICAgICAgICBsZXQgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGxldCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICB2YWx1ZTogaXRlbS5kYXRhLFxyXG4gICAgICAgICAgICAgIGNhbGxiYWNrIChvcHRpb25WYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmRhdGEgPSBvcHRpb25WYWx1ZVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb246IGdldEZpbHRlckV2ZW50cyh7XHJcbiAgICAgICAgICAgICAgW3R5cGVdICh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKGNvbnRleHQsIGNvbHVtbiwgdmFsdWUgJiYgdmFsdWUubGVuZ3RoID4gMCwgaXRlbSlcclxuICAgICAgICAgICAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgICAgICAgICAgIGV2ZW50c1t0eXBlXShPYmplY3QuYXNzaWduKHsgY29udGV4dCB9LCBwYXJhbXMpLCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHJlbmRlck9wdHMsIHBhcmFtcywgY29udGV4dClcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwOiBhbnksIGdJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogaXRlbS5kYXRhLFxyXG4gICAgICAgICAgICBjYWxsYmFjayAob3B0aW9uVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIGl0ZW0uZGF0YSA9IG9wdGlvblZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjogZ2V0RmlsdGVyRXZlbnRzKHtcclxuICAgICAgICAgICAgY2hhbmdlICh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihjb250ZXh0LCBjb2x1bW4sIHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDAsIGl0ZW0pXHJcbiAgICAgICAgICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50c1t0eXBlXShPYmplY3QuYXNzaWduKHsgY29udGV4dCB9LCBwYXJhbXMpLCB2YWx1ZSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIHJlbmRlck9wdHMsIHBhcmFtcywgY29udGV4dClcclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBmaWx0ZXJNZXRob2QgKHsgb3B0aW9uLCByb3csIGNvbHVtbiB9OiBhbnkpIHtcclxuICAgICAgbGV0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgICAgIGxldCB7IHByb3BlcnR5LCBmaWx0ZXJSZW5kZXI6IHJlbmRlck9wdHMgfSA9IGNvbHVtblxyXG4gICAgICBsZXQgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIHByb3BlcnR5KVxyXG4gICAgICBpZiAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJykge1xyXG4gICAgICAgIGlmIChYRVV0aWxzLmlzQXJyYXkoY2VsbFZhbHVlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIFhFVXRpbHMuaW5jbHVkZUFycmF5cyhjZWxsVmFsdWUsIGRhdGEpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhLmluZGV4T2YoY2VsbFZhbHVlKSA+IC0xXHJcbiAgICAgIH1cclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgICAgIHJldHVybiBjZWxsVmFsdWUgPT0gZGF0YVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW0gKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICAgICAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHsgZGF0YSwgcHJvcGVydHkgfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgcHJvcHM6IGFueSA9IGdldEZvcm1Qcm9wcyhjb250ZXh0LCByZW5kZXJPcHRzKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwT3B0aW9uczogc3RyaW5nID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGxldCBncm91cExhYmVsOiBzdHJpbmcgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQoZGF0YSwgcHJvcGVydHkpLFxyXG4gICAgICAgICAgICAgIGNhbGxiYWNrIChjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgWEVVdGlscy5zZXQoZGF0YSwgcHJvcGVydHksIGNlbGxWYWx1ZSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uOiBnZXRGb3JtRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcywgY29udGV4dClcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwOiBhbnksIGdJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQoZGF0YSwgcHJvcGVydHkpLFxyXG4gICAgICAgICAgICBjYWxsYmFjayAoY2VsbFZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICBYRVV0aWxzLnNldChkYXRhLCBwcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgb246IGdldEZvcm1FdmVudHMocmVuZGVyT3B0cywgcGFyYW1zLCBjb250ZXh0KVxyXG4gICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgfSxcclxuICBBQ2FzY2FkZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwgKGg6IEZ1bmN0aW9uLCB7IHByb3BzID0ge30gfTogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgdmFyIHZhbHVlcyA9IGNlbGxWYWx1ZSB8fCBbXVxyXG4gICAgICB2YXIgbGFiZWxzOiBBcnJheTxhbnk+ID0gW11cclxuICAgICAgbWF0Y2hDYXNjYWRlckRhdGEoMCwgcHJvcHMub3B0aW9ucywgdmFsdWVzLCBsYWJlbHMpXHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCAocHJvcHMuc2hvd0FsbExldmVscyA9PT0gZmFsc2UgPyBsYWJlbHMuc2xpY2UobGFiZWxzLmxlbmd0aCAtIDEsIGxhYmVscy5sZW5ndGgpIDogbGFiZWxzKS5qb2luKGAgJHtwcm9wcy5zZXBhcmF0b3IgfHwgJy8nfSBgKSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBRGF0ZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTS1ERCcpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQU1vbnRoUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBUmFuZ2VQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwgKGg6IEZ1bmN0aW9uLCB7IHByb3BzID0ge30gfTogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgICAgIGNlbGxWYWx1ZSA9IFhFVXRpbHMubWFwKGNlbGxWYWx1ZSwgKGRhdGU6IGFueSkgPT4gZGF0ZS5mb3JtYXQocHJvcHMuZm9ybWF0IHx8ICdZWVlZLU1NLUREJykpLmpvaW4oJyB+ICcpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGNlbGxWYWx1ZSlcclxuICAgIH0sXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBV2Vla1BpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1XV+WRqCcpLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQVRpbWVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ0hIOm1tOnNzJyksXHJcbiAgICByZW5kZXJJdGVtOiBjcmVhdGVGb3JtSXRlbVJlbmRlcigpXHJcbiAgfSxcclxuICBBVHJlZVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogRnVuY3Rpb24sIHsgcHJvcHMgPSB7fSB9OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICBpZiAoY2VsbFZhbHVlICYmIChwcm9wcy50cmVlQ2hlY2thYmxlIHx8IHByb3BzLm11bHRpcGxlKSkge1xyXG4gICAgICAgIGNlbGxWYWx1ZSA9IGNlbGxWYWx1ZS5qb2luKCc7JylcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgY2VsbFZhbHVlKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9LFxyXG4gIEFSYXRlOiB7XHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kLFxyXG4gICAgcmVuZGVySXRlbTogY3JlYXRlRm9ybUl0ZW1SZW5kZXIoKVxyXG4gIH0sXHJcbiAgQVN3aXRjaDoge1xyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZCxcclxuICAgIHJlbmRlckl0ZW06IGNyZWF0ZUZvcm1JdGVtUmVuZGVyKClcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDkuovku7blhbzlrrnmgKflpITnkIZcclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZUNsZWFyRXZlbnQgKHBhcmFtczogYW55LCBldm50OiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gIGxldCB7IGdldEV2ZW50VGFyZ2V0Tm9kZSB9ID0gY29udGV4dFxyXG4gIGxldCBib2R5RWxlbSA9IGRvY3VtZW50LmJvZHlcclxuICBpZiAoXHJcbiAgICAvLyDkuIvmi4nmoYZcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1zZWxlY3QtZHJvcGRvd24nKS5mbGFnIHx8XHJcbiAgICAvLyDnuqfogZRcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYXNjYWRlci1tZW51cycpLmZsYWcgfHxcclxuICAgIC8vIOaXpeacn1xyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhbGVuZGFyLXBpY2tlci1jb250YWluZXInKS5mbGFnIHx8XHJcbiAgICAvLyDml7bpl7TpgInmi6lcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC10aW1lLXBpY2tlci1wYW5lbCcpLmZsYWdcclxuICApIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOWfuuS6jiB2eGUtdGFibGUg6KGo5qC855qE6YCC6YWN5o+S5Lu277yM55So5LqO5YW85a65IGFudC1kZXNpZ24tdnVlIOe7hOS7tuW6k1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFZYRVRhYmxlUGx1Z2luQW50ZCA9IHtcclxuICBpbnN0YWxsICh4dGFibGU6IHR5cGVvZiBWWEVUYWJsZSkge1xyXG4gICAgbGV0IHsgaW50ZXJjZXB0b3IsIHJlbmRlcmVyIH0gPSB4dGFibGVcclxuICAgIHJlbmRlcmVyLm1peGluKHJlbmRlck1hcClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJGaWx0ZXInLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gICAgaW50ZXJjZXB0b3IuYWRkKCdldmVudC5jbGVhckFjdGl2ZWQnLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gdG9Nb21lbnRTdHJpbmcgKGNlbGxWYWx1ZTogYW55LCBmb3JtYXQ6IHN0cmluZyk6IHN0cmluZyB7XHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA/IGNlbGxWYWx1ZS5mb3JtYXQoZm9ybWF0KSA6ICcnXHJcbn1cclxuXHJcbmRlY2xhcmUgbW9kdWxlICd4ZS11dGlscy9tZXRob2RzL3hlLXV0aWxzJyB7XHJcbiAgaW50ZXJmYWNlIFhFVXRpbHNNZXRob2RzIHtcclxuICAgIC8qKlxyXG4gICAgICog5bCGIE1vbWVudCDml6XmnJ/moLzlvI/ljJbkuLrlrZfnrKbkuLJcclxuICAgICAqIEBwYXJhbSBjZWxsVmFsdWUg5YC8XHJcbiAgICAgKiBAcGFyYW0gZm9ybWF0IOagvOW8j+WMllxyXG4gICAgICovXHJcbiAgICB0b01vbWVudFN0cmluZzogdHlwZW9mIHRvTW9tZW50U3RyaW5nO1xyXG4gIH1cclxufVxyXG5cclxuWEVVdGlscy5taXhpbih7XHJcbiAgdG9Nb21lbnRTdHJpbmdcclxufSlcclxuXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVlhFVGFibGUpIHtcclxuICB3aW5kb3cuVlhFVGFibGUudXNlKFZYRVRhYmxlUGx1Z2luQW50ZClcclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5BbnRkXHJcbiJdfQ==
