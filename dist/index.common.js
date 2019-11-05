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

function getProps(_ref2, _ref3) {
  var $table = _ref2.$table;
  var props = _ref3.props;
  return _xeUtils["default"].assign($table.vSize ? {
    size: $table.vSize
  } : {}, props);
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

function defaultEditRender(h, renderOpts, params) {
  var row = params.row,
      column = params.column;
  var attrs = renderOpts.attrs;
  var props = getProps(params, renderOpts);
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

function defaultFilterRender(h, renderOpts, params, context) {
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
/**
 * 渲染函数
 */


var renderMap = {
  AAutoComplete: {
    autofocus: 'input.ant-input',
    renderDefault: defaultEditRender,
    renderEdit: defaultEditRender,
    renderFilter: defaultFilterRender,
    filterMethod: defaultFilterMethod
  },
  AInput: {
    autofocus: 'input.ant-input',
    renderDefault: defaultEditRender,
    renderEdit: defaultEditRender,
    renderFilter: defaultFilterRender,
    filterMethod: defaultFilterMethod
  },
  AInputNumber: {
    autofocus: 'input.ant-input-number-input',
    renderDefault: defaultEditRender,
    renderEdit: defaultEditRender,
    renderFilter: defaultFilterRender,
    filterMethod: defaultFilterMethod
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

          return selectItem ? selectItem[labelProp] : null;
        } : function (value) {
          var selectItem = _xeUtils["default"].find(options, function (item) {
            return item[valueProp] === value;
          });

          return selectItem ? selectItem[labelProp] : null;
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
    filterMethod: function filterMethod(_ref5) {
      var option = _ref5.option,
          row = _ref5.row,
          column = _ref5.column;
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
    }
  },
  ACascader: {
    renderEdit: defaultEditRender,
    renderCell: function renderCell(h, _ref6, params) {
      var _ref6$props = _ref6.props,
          props = _ref6$props === void 0 ? {} : _ref6$props;
      var row = params.row,
          column = params.column;

      var cellValue = _xeUtils["default"].get(row, column.property);

      var values = cellValue || [];
      var labels = [];
      matchCascaderData(0, props.options, values, labels);
      return cellText(h, (props.showAllLevels === false ? labels.slice(labels.length - 1, labels.length) : labels).join(" ".concat(props.separator || '/', " ")));
    }
  },
  ADatePicker: {
    renderEdit: defaultEditRender,
    renderCell: formatDatePicker('YYYY-MM-DD')
  },
  AMonthPicker: {
    renderEdit: defaultEditRender,
    renderCell: formatDatePicker('YYYY-MM')
  },
  ARangePicker: {
    renderEdit: defaultEditRender,
    renderCell: function renderCell(h, _ref7, params) {
      var _ref7$props = _ref7.props,
          props = _ref7$props === void 0 ? {} : _ref7$props;
      var row = params.row,
          column = params.column;

      var cellValue = _xeUtils["default"].get(row, column.property);

      if (cellValue) {
        cellValue = _xeUtils["default"].map(cellValue, function (date) {
          return date.format(props.format || 'YYYY-MM-DD');
        }).join(' ~ ');
      }

      return cellText(h, cellValue);
    }
  },
  AWeekPicker: {
    renderEdit: defaultEditRender,
    renderCell: formatDatePicker('YYYY-WW周')
  },
  ATimePicker: {
    renderEdit: defaultEditRender,
    renderCell: formatDatePicker('HH:mm:ss')
  },
  ATreeSelect: {
    renderEdit: defaultEditRender,
    renderCell: function renderCell(h, _ref8, params) {
      var _ref8$props = _ref8.props,
          props = _ref8$props === void 0 ? {} : _ref8$props;
      var row = params.row,
          column = params.column;

      var cellValue = _xeUtils["default"].get(row, column.property);

      if (cellValue && (props.treeCheckable || props.multiple)) {
        cellValue = cellValue.join(';');
      }

      return cellText(h, cellValue);
    }
  },
  ARate: {
    renderDefault: defaultEditRender,
    renderEdit: defaultEditRender,
    renderFilter: defaultFilterRender,
    filterMethod: defaultFilterMethod
  },
  ASwitch: {
    renderDefault: defaultEditRender,
    renderEdit: defaultEditRender,
    renderFilter: defaultFilterRender,
    filterMethod: defaultFilterMethod
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

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginAntd);
}

function toMomentString(cellValue, format) {
  return cellValue ? cellValue.format(format) : '';
}

_xeUtils["default"].mixin({
  toMomentString: toMomentString
});

var _default = VXETablePluginAntd;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiWEVVdGlscyIsImVhY2giLCJpdGVtIiwidmFsdWUiLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsInBhcmFtcyIsInByb3BzIiwicm93IiwiY29sdW1uIiwiY2VsbFZhbHVlIiwiZ2V0IiwicHJvcGVydHkiLCJmb3JtYXQiLCJjZWxsVGV4dCIsImdldFByb3BzIiwiJHRhYmxlIiwiYXNzaWduIiwidlNpemUiLCJzaXplIiwiZ2V0Q2VsbEV2ZW50cyIsInJlbmRlck9wdHMiLCJuYW1lIiwiZXZlbnRzIiwidHlwZSIsIm9uIiwiZXZudCIsInVwZGF0ZVN0YXR1cyIsIm9iamVjdE1hcCIsImNiIiwiYXJncyIsImFwcGx5IiwiY29uY2F0IiwiZGVmYXVsdEVkaXRSZW5kZXIiLCJhdHRycyIsIm1vZGVsIiwiY2FsbGJhY2siLCJzZXQiLCJnZXRGaWx0ZXJFdmVudHMiLCJjb250ZXh0IiwiT2JqZWN0IiwiZGVmYXVsdEZpbHRlclJlbmRlciIsImZpbHRlcnMiLCJtYXAiLCJkYXRhIiwib3B0aW9uVmFsdWUiLCJoYW5kbGVDb25maXJtRmlsdGVyIiwiY2hlY2tlZCIsImZpbHRlck11bHRpcGxlIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsIm9wdGlvbiIsInJlbmRlck9wdGlvbnMiLCJvcHRpb25zIiwib3B0aW9uUHJvcHMiLCJsYWJlbFByb3AiLCJ2YWx1ZVByb3AiLCJkaXNhYmxlZFByb3AiLCJkaXNhYmxlZCIsImtleSIsInJlbmRlck1hcCIsIkFBdXRvQ29tcGxldGUiLCJhdXRvZm9jdXMiLCJyZW5kZXJEZWZhdWx0IiwicmVuZGVyRWRpdCIsInJlbmRlckZpbHRlciIsImZpbHRlck1ldGhvZCIsIkFJbnB1dCIsIkFJbnB1dE51bWJlciIsIkFTZWxlY3QiLCJvcHRpb25Hcm91cHMiLCJvcHRpb25Hcm91cFByb3BzIiwiZ3JvdXBPcHRpb25zIiwiZ3JvdXBMYWJlbCIsImdyb3VwIiwiZ0luZGV4Iiwic2xvdCIsInJlbmRlckNlbGwiLCJ1bmRlZmluZWQiLCJtb2RlIiwic2VsZWN0SXRlbSIsImZpbmQiLCJqb2luIiwiY2hhbmdlIiwiZmlsdGVyUmVuZGVyIiwiaXNBcnJheSIsImluY2x1ZGVBcnJheXMiLCJpbmRleE9mIiwiQUNhc2NhZGVyIiwic2hvd0FsbExldmVscyIsInNsaWNlIiwic2VwYXJhdG9yIiwiQURhdGVQaWNrZXIiLCJBTW9udGhQaWNrZXIiLCJBUmFuZ2VQaWNrZXIiLCJkYXRlIiwiQVdlZWtQaWNrZXIiLCJBVGltZVBpY2tlciIsIkFUcmVlU2VsZWN0IiwidHJlZUNoZWNrYWJsZSIsIm11bHRpcGxlIiwiQVJhdGUiLCJBU3dpdGNoIiwiaGFuZGxlQ2xlYXJFdmVudCIsImdldEV2ZW50VGFyZ2V0Tm9kZSIsImJvZHlFbGVtIiwiZG9jdW1lbnQiLCJib2R5IiwiZmxhZyIsIlZYRVRhYmxlUGx1Z2luQW50ZCIsImluc3RhbGwiLCJ4dGFibGUiLCJpbnRlcmNlcHRvciIsInJlbmRlcmVyIiwibWl4aW4iLCJhZGQiLCJ3aW5kb3ciLCJWWEVUYWJsZSIsInVzZSIsInRvTW9tZW50U3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUdBLFNBQVNBLGlCQUFULENBQTJCQyxLQUEzQixFQUEwQ0MsSUFBMUMsRUFBNERDLE1BQTVELEVBQWdGQyxNQUFoRixFQUFrRztBQUNoRyxNQUFJQyxHQUFHLEdBQUdGLE1BQU0sQ0FBQ0YsS0FBRCxDQUFoQjs7QUFDQSxNQUFJQyxJQUFJLElBQUlDLE1BQU0sQ0FBQ0csTUFBUCxHQUFnQkwsS0FBNUIsRUFBbUM7QUFDakNNLHdCQUFRQyxJQUFSLENBQWFOLElBQWIsRUFBbUIsVUFBQ08sSUFBRCxFQUFjO0FBQy9CLFVBQUlBLElBQUksQ0FBQ0MsS0FBTCxLQUFlTCxHQUFu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TSxDQUFDQyxRQUFQLENBQWdCQyxHQUFoQixDQUFvQlQsa0JBQXBCO0FBQ0Q7O0FBRUQsU0FBU1UsY0FBVCxDQUF3QjVHLFNBQXhCLEVBQXdDRyxNQUF4QyxFQUFzRDtBQUNwRCxTQUFPSCxTQUFTLEdBQUdBLFNBQVMsQ0FBQ0csTUFBVixDQUFpQkEsTUFBakIsQ0FBSCxHQUE4QixFQUE5QztBQUNEOztBQWFEakIsb0JBQVFxSCxLQUFSLENBQWM7QUFDWkssRUFBQUEsY0FBYyxFQUFkQTtBQURZLENBQWQ7O2VBSWVWLGtCIiwiZmlsZSI6ImluZGV4LmNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBYRVV0aWxzIGZyb20gJ3hlLXV0aWxzL21ldGhvZHMveGUtdXRpbHMnXHJcbmltcG9ydCBWWEVUYWJsZSBmcm9tICd2eGUtdGFibGUvbGliL3Z4ZS10YWJsZSdcclxuXHJcbmZ1bmN0aW9uIG1hdGNoQ2FzY2FkZXJEYXRhKGluZGV4OiBudW1iZXIsIGxpc3Q6IEFycmF5PGFueT4sIHZhbHVlczogQXJyYXk8YW55PiwgbGFiZWxzOiBBcnJheTxhbnk+KSB7XHJcbiAgbGV0IHZhbCA9IHZhbHVlc1tpbmRleF1cclxuICBpZiAobGlzdCAmJiB2YWx1ZXMubGVuZ3RoID4gaW5kZXgpIHtcclxuICAgIFhFVXRpbHMuZWFjaChsaXN0LCAoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLnZhbHVlID09PSB2YWwpIHtcclxuICAgICAgICBsYWJlbHMucHVzaChpdGVtLmxhYmVsKVxyXG4gICAgICAgIG1hdGNoQ2FzY2FkZXJEYXRhKCsraW5kZXgsIGl0ZW0uY2hpbGRyZW4sIHZhbHVlcywgbGFiZWxzKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybWF0RGF0ZVBpY2tlcihkZWZhdWx0Rm9ybWF0OiBhbnkpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCB7IHByb3BzID0ge30gfTogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgICBjZWxsVmFsdWUgPSBjZWxsVmFsdWUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCBkZWZhdWx0Rm9ybWF0KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNlbGxUZXh0KGgsIGNlbGxWYWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFByb3BzKHsgJHRhYmxlIH06IGFueSwgeyBwcm9wcyB9OiBhbnkpIHtcclxuICByZXR1cm4gWEVVdGlscy5hc3NpZ24oJHRhYmxlLnZTaXplID8geyBzaXplOiAkdGFibGUudlNpemUgfSA6IHt9LCBwcm9wcylcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2VsbEV2ZW50cyhyZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgbGV0IHsgbmFtZSwgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgbGV0IHsgJHRhYmxlIH0gPSBwYXJhbXNcclxuICBsZXQgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICBjYXNlICdBQXV0b0NvbXBsZXRlJzpcclxuICAgICAgdHlwZSA9ICdzZWxlY3QnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXQnOlxyXG4gICAgICB0eXBlID0gJ2lucHV0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0TnVtYmVyJzpcclxuICAgICAgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIGxldCBvbiA9IHtcclxuICAgIFt0eXBlXTogKGV2bnQ6IGFueSkgPT4ge1xyXG4gICAgICAkdGFibGUudXBkYXRlU3RhdHVzKHBhcmFtcylcclxuICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICBldmVudHNbdHlwZV0ocGFyYW1zLCBldm50KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChldmVudHMpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLmFzc2lnbih7fSwgWEVVdGlscy5vYmplY3RNYXAoZXZlbnRzLCAoY2I6IEZ1bmN0aW9uKSA9PiBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgY2IuYXBwbHkobnVsbCwgW3BhcmFtc10uY29uY2F0LmFwcGx5KHBhcmFtcywgYXJncykpXHJcbiAgICB9KSwgb24pXHJcbiAgfVxyXG4gIHJldHVybiBvblxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0RWRpdFJlbmRlcihoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICByZXR1cm4gW1xyXG4gICAgaChyZW5kZXJPcHRzLm5hbWUsIHtcclxuICAgICAgcHJvcHMsXHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBtb2RlbDoge1xyXG4gICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSksXHJcbiAgICAgICAgY2FsbGJhY2sodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIHZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgfSlcclxuICBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZpbHRlckV2ZW50cyhvbjogYW55LCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICBsZXQgeyBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBpZiAoZXZlbnRzKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5hc3NpZ24oe30sIFhFVXRpbHMub2JqZWN0TWFwKGV2ZW50cywgKGNiOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIHBhcmFtcyA9IE9iamVjdC5hc3NpZ24oeyBjb250ZXh0IH0sIHBhcmFtcylcclxuICAgICAgY2IuYXBwbHkobnVsbCwgW3BhcmFtc10uY29uY2F0LmFwcGx5KHBhcmFtcywgYXJncykpXHJcbiAgICB9KSwgb24pXHJcbiAgfVxyXG4gIHJldHVybiBvblxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyUmVuZGVyKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICBsZXQgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCB7IG5hbWUsIGF0dHJzLCBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gIHN3aXRjaCAobmFtZSkge1xyXG4gICAgY2FzZSAnQUF1dG9Db21wbGV0ZSc6XHJcbiAgICAgIHR5cGUgPSAnc2VsZWN0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgdHlwZSA9ICdpbnB1dCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dE51bWJlcic6XHJcbiAgICAgIHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgcHJvcHMsXHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBtb2RlbDoge1xyXG4gICAgICAgIHZhbHVlOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgY2FsbGJhY2sob3B0aW9uVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgaXRlbS5kYXRhID0gb3B0aW9uVmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIG9uOiBnZXRGaWx0ZXJFdmVudHMoe1xyXG4gICAgICAgIFt0eXBlXShldm50OiBhbnkpIHtcclxuICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dCwgY29sdW1uLCAhIWl0ZW0uZGF0YSwgaXRlbSlcclxuICAgICAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgICAgIGV2ZW50c1t0eXBlXShPYmplY3QuYXNzaWduKHsgY29udGV4dCB9LCBwYXJhbXMpLCBldm50KVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfSwgcmVuZGVyT3B0cywgcGFyYW1zLCBjb250ZXh0KVxyXG4gICAgfSlcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBoYW5kbGVDb25maXJtRmlsdGVyKGNvbnRleHQ6IGFueSwgY29sdW1uOiBhbnksIGNoZWNrZWQ6IGFueSwgaXRlbTogYW55KSB7XHJcbiAgY29udGV4dFtjb2x1bW4uZmlsdGVyTXVsdGlwbGUgPyAnY2hhbmdlTXVsdGlwbGVPcHRpb24nIDogJ2NoYW5nZVJhZGlvT3B0aW9uJ10oe30sIGNoZWNrZWQsIGl0ZW0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXJNZXRob2QoeyBvcHRpb24sIHJvdywgY29sdW1uIH06IGFueSkge1xyXG4gIGxldCB7IGRhdGEgfSA9IG9wdGlvblxyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cclxuICByZXR1cm4gY2VsbFZhbHVlID09PSBkYXRhXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlck9wdGlvbnMoaDogRnVuY3Rpb24sIG9wdGlvbnM6IGFueSwgb3B0aW9uUHJvcHM6IGFueSkge1xyXG4gIGxldCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgbGV0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICBsZXQgZGlzYWJsZWRQcm9wID0gb3B0aW9uUHJvcHMuZGlzYWJsZWQgfHwgJ2Rpc2FibGVkJ1xyXG4gIHJldHVybiBYRVV0aWxzLm1hcChvcHRpb25zLCAoaXRlbTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0aW9uJywge1xyXG4gICAgICBwcm9wczoge1xyXG4gICAgICAgIHZhbHVlOiBpdGVtW3ZhbHVlUHJvcF0sXHJcbiAgICAgICAgZGlzYWJsZWQ6IGl0ZW1bZGlzYWJsZWRQcm9wXVxyXG4gICAgICB9LFxyXG4gICAgICBrZXk6IGluZGV4XHJcbiAgICB9LCBpdGVtW2xhYmVsUHJvcF0pXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2VsbFRleHQoaDogRnVuY3Rpb24sIGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgcmV0dXJuIFsnJyArIChjZWxsVmFsdWUgPT09IG51bGwgfHwgY2VsbFZhbHVlID09PSB2b2lkIDAgPyAnJyA6IGNlbGxWYWx1ZSldXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmuLLmn5Plh73mlbBcclxuICovXHJcbmNvbnN0IHJlbmRlck1hcCA9IHtcclxuICBBQXV0b0NvbXBsZXRlOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckZpbHRlcjogZGVmYXVsdEZpbHRlclJlbmRlcixcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZFxyXG4gIH0sXHJcbiAgQUlucHV0OiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckZpbHRlcjogZGVmYXVsdEZpbHRlclJlbmRlcixcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZFxyXG4gIH0sXHJcbiAgQUlucHV0TnVtYmVyOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQtbnVtYmVyLWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJGaWx0ZXI6IGRlZmF1bHRGaWx0ZXJSZW5kZXIsXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuICB9LFxyXG4gIEFTZWxlY3Q6IHtcclxuICAgIHJlbmRlckVkaXQoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcclxuICAgICAgICBsZXQgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGxldCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KSxcclxuICAgICAgICAgICAgICBjYWxsYmFjayhjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIGNlbGxWYWx1ZSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwOiBhbnksIGdJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgICAgICBjYWxsYmFjayhjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCBjZWxsVmFsdWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjogZ2V0Q2VsbEV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZW5kZXJDZWxsKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IG9wdGlvbnMsIG9wdGlvbkdyb3VwcywgcHJvcHMgPSB7fSwgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgbGV0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICAgICAgbGV0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICBpZiAoIShjZWxsVmFsdWUgPT09IG51bGwgfHwgY2VsbFZhbHVlID09PSB1bmRlZmluZWQgfHwgY2VsbFZhbHVlID09PSAnJykpIHtcclxuICAgICAgICByZXR1cm4gY2VsbFRleHQoaCwgWEVVdGlscy5tYXAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJyA/IGNlbGxWYWx1ZSA6IFtjZWxsVmFsdWVdLCBvcHRpb25Hcm91cHMgPyAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgbGV0IHNlbGVjdEl0ZW1cclxuICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvcHRpb25Hcm91cHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdEl0ZW0gPSBYRVV0aWxzLmZpbmQob3B0aW9uR3JvdXBzW2luZGV4XVtncm91cE9wdGlvbnNdLCAoaXRlbTogYW55KSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICAgICAgICBpZiAoc2VsZWN0SXRlbSkge1xyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBzZWxlY3RJdGVtID8gc2VsZWN0SXRlbVtsYWJlbFByb3BdIDogbnVsbFxyXG4gICAgICAgIH0gOiAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgbGV0IHNlbGVjdEl0ZW0gPSBYRVV0aWxzLmZpbmQob3B0aW9ucywgKGl0ZW06IGFueSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgICAgIHJldHVybiBzZWxlY3RJdGVtID8gc2VsZWN0SXRlbVtsYWJlbFByb3BdIDogbnVsbFxyXG4gICAgICAgIH0pLmpvaW4oJzsnKSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgJycpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyRmlsdGVyKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICAgICAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IHsgYXR0cnMsIGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgICAgIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGxldCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgbGV0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICAgIHZhbHVlOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sob3B0aW9uVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kYXRhID0gb3B0aW9uVmFsdWVcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uOiBnZXRGaWx0ZXJFdmVudHMoe1xyXG4gICAgICAgICAgICAgIFt0eXBlXSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKGNvbnRleHQsIGNvbHVtbiwgdmFsdWUgJiYgdmFsdWUubGVuZ3RoID4gMCwgaXRlbSlcclxuICAgICAgICAgICAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgICAgICAgICAgIGV2ZW50c1t0eXBlXShPYmplY3QuYXNzaWduKHsgY29udGV4dCB9LCBwYXJhbXMpLCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHJlbmRlck9wdHMsIHBhcmFtcywgY29udGV4dClcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwOiBhbnksIGdJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogaXRlbS5kYXRhLFxyXG4gICAgICAgICAgICBjYWxsYmFjayhvcHRpb25WYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgaXRlbS5kYXRhID0gb3B0aW9uVmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9uOiBnZXRGaWx0ZXJFdmVudHMoe1xyXG4gICAgICAgICAgICBjaGFuZ2UodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dCwgY29sdW1uLCB2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwLCBpdGVtKVxyXG4gICAgICAgICAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudHNbdHlwZV0oT2JqZWN0LmFzc2lnbih7IGNvbnRleHQgfSwgcGFyYW1zKSwgdmFsdWUpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMsIGNvbnRleHQpXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyTWV0aG9kKHsgb3B0aW9uLCByb3csIGNvbHVtbiB9OiBhbnkpIHtcclxuICAgICAgbGV0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgICAgIGxldCB7IHByb3BlcnR5LCBmaWx0ZXJSZW5kZXI6IHJlbmRlck9wdHMgfSA9IGNvbHVtblxyXG4gICAgICBsZXQgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIHByb3BlcnR5KVxyXG4gICAgICBpZiAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJykge1xyXG4gICAgICAgIGlmIChYRVV0aWxzLmlzQXJyYXkoY2VsbFZhbHVlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIFhFVXRpbHMuaW5jbHVkZUFycmF5cyhjZWxsVmFsdWUsIGRhdGEpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhLmluZGV4T2YoY2VsbFZhbHVlKSA+IC0xXHJcbiAgICAgIH1cclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgICAgIHJldHVybiBjZWxsVmFsdWUgPT0gZGF0YVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgQUNhc2NhZGVyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckNlbGwoaDogRnVuY3Rpb24sIHsgcHJvcHMgPSB7fSB9OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICB2YXIgdmFsdWVzID0gY2VsbFZhbHVlIHx8IFtdXHJcbiAgICAgIHZhciBsYWJlbHM6IEFycmF5PGFueT4gPSBbXVxyXG4gICAgICBtYXRjaENhc2NhZGVyRGF0YSgwLCBwcm9wcy5vcHRpb25zLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIChwcm9wcy5zaG93QWxsTGV2ZWxzID09PSBmYWxzZSA/IGxhYmVscy5zbGljZShsYWJlbHMubGVuZ3RoIC0gMSwgbGFiZWxzLmxlbmd0aCkgOiBsYWJlbHMpLmpvaW4oYCAke3Byb3BzLnNlcGFyYXRvciB8fCAnLyd9IGApKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgQURhdGVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTS1ERCcpXHJcbiAgfSxcclxuICBBTW9udGhQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTScpXHJcbiAgfSxcclxuICBBUmFuZ2VQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbChoOiBGdW5jdGlvbiwgeyBwcm9wcyA9IHt9IH06IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICAgIGlmIChjZWxsVmFsdWUpIHtcclxuICAgICAgICBjZWxsVmFsdWUgPSBYRVV0aWxzLm1hcChjZWxsVmFsdWUsIChkYXRlOiBhbnkpID0+IGRhdGUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCAnWVlZWS1NTS1ERCcpKS5qb2luKCcgfiAnKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBjZWxsVmFsdWUpXHJcbiAgICB9XHJcbiAgfSxcclxuICBBV2Vla1BpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLVdX5ZGoJylcclxuICB9LFxyXG4gIEFUaW1lUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ0hIOm1tOnNzJylcclxuICB9LFxyXG4gIEFUcmVlU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckNlbGwoaDogRnVuY3Rpb24sIHsgcHJvcHMgPSB7fSB9OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICBpZiAoY2VsbFZhbHVlICYmIChwcm9wcy50cmVlQ2hlY2thYmxlIHx8IHByb3BzLm11bHRpcGxlKSkge1xyXG4gICAgICAgIGNlbGxWYWx1ZSA9IGNlbGxWYWx1ZS5qb2luKCc7JylcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgY2VsbFZhbHVlKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgQVJhdGU6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJGaWx0ZXI6IGRlZmF1bHRGaWx0ZXJSZW5kZXIsXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuICB9LFxyXG4gIEFTd2l0Y2g6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJGaWx0ZXI6IGRlZmF1bHRGaWx0ZXJSZW5kZXIsXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDkuovku7blhbzlrrnmgKflpITnkIZcclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZUNsZWFyRXZlbnQocGFyYW1zOiBhbnksIGV2bnQ6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgbGV0IHsgZ2V0RXZlbnRUYXJnZXROb2RlIH0gPSBjb250ZXh0XHJcbiAgbGV0IGJvZHlFbGVtID0gZG9jdW1lbnQuYm9keVxyXG4gIGlmIChcclxuICAgIC8vIOS4i+aLieahhlxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LXNlbGVjdC1kcm9wZG93bicpLmZsYWcgfHxcclxuICAgIC8vIOe6p+iBlFxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhc2NhZGVyLW1lbnVzJykuZmxhZyB8fFxyXG4gICAgLy8g5pel5pyfXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FsZW5kYXItcGlja2VyLWNvbnRhaW5lcicpLmZsYWcgfHxcclxuICAgIC8vIOaXtumXtOmAieaLqVxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LXRpbWUtcGlja2VyLXBhbmVsJykuZmxhZ1xyXG4gICkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5Z+65LqOIHZ4ZS10YWJsZSDooajmoLznmoTpgILphY3mj5Lku7bvvIznlKjkuo7lhbzlrrkgYW50LWRlc2lnbi12dWUg57uE5Lu25bqTXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgVlhFVGFibGVQbHVnaW5BbnRkID0ge1xyXG4gIGluc3RhbGwoeHRhYmxlOiB0eXBlb2YgVlhFVGFibGUpIHtcclxuICAgIGxldCB7IGludGVyY2VwdG9yLCByZW5kZXJlciB9ID0geHRhYmxlXHJcbiAgICByZW5kZXJlci5taXhpbihyZW5kZXJNYXApXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyRmlsdGVyJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJBY3RpdmVkJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICB9XHJcbn1cclxuXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVlhFVGFibGUpIHtcclxuICB3aW5kb3cuVlhFVGFibGUudXNlKFZYRVRhYmxlUGx1Z2luQW50ZClcclxufVxyXG5cclxuZnVuY3Rpb24gdG9Nb21lbnRTdHJpbmcoY2VsbFZhbHVlOiBhbnksIGZvcm1hdDogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gY2VsbFZhbHVlID8gY2VsbFZhbHVlLmZvcm1hdChmb3JtYXQpIDogJydcclxufVxyXG5cclxuZGVjbGFyZSBtb2R1bGUgJ3hlLXV0aWxzL21ldGhvZHMveGUtdXRpbHMnIHtcclxuICBpbnRlcmZhY2UgWEVVdGlsc01ldGhvZHMge1xyXG4gICAgLyoqXHJcbiAgICAgKiDlsIYgTW9tZW50IOaXpeacn+agvOW8j+WMluS4uuWtl+espuS4slxyXG4gICAgICogQHBhcmFtIGNlbGxWYWx1ZSDlgLxcclxuICAgICAqIEBwYXJhbSBmb3JtYXQg5qC85byP5YyWXHJcbiAgICAgKi9cclxuICAgIHRvTW9tZW50U3RyaW5nOiB0eXBlb2YgdG9Nb21lbnRTdHJpbmc7XHJcbiAgfVxyXG59XHJcblxyXG5YRVV0aWxzLm1peGluKHtcclxuICB0b01vbWVudFN0cmluZ1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5BbnRkXHJcbiJdfQ==
