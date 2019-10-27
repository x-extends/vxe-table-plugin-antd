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
    _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
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

function getFilterEvents(on, renderOpts, params) {
  var events = renderOpts.events;

  if (events) {
    _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
      return function () {
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
          events[type](params, evnt);
        }
      }), renderOpts, params)
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
              handleConfirmFilter(context, column, value && value.length > 0, item);

              if (events && events[type]) {
                events[type](params, value);
              }
            }
          }, renderOpts, params)
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiWEVVdGlscyIsImVhY2giLCJpdGVtIiwidmFsdWUiLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsInBhcmFtcyIsInByb3BzIiwicm93IiwiY29sdW1uIiwiY2VsbFZhbHVlIiwiZ2V0IiwicHJvcGVydHkiLCJmb3JtYXQiLCJjZWxsVGV4dCIsImdldFByb3BzIiwiJHRhYmxlIiwiYXNzaWduIiwidlNpemUiLCJzaXplIiwiZ2V0Q2VsbEV2ZW50cyIsInJlbmRlck9wdHMiLCJuYW1lIiwiZXZlbnRzIiwidHlwZSIsIm9uIiwiZXZudCIsInVwZGF0ZVN0YXR1cyIsIm9iamVjdE1hcCIsImNiIiwiYXJncyIsImFwcGx5IiwiY29uY2F0IiwiZGVmYXVsdEVkaXRSZW5kZXIiLCJhdHRycyIsIm1vZGVsIiwiY2FsbGJhY2siLCJzZXQiLCJnZXRGaWx0ZXJFdmVudHMiLCJkZWZhdWx0RmlsdGVyUmVuZGVyIiwiY29udGV4dCIsImZpbHRlcnMiLCJtYXAiLCJkYXRhIiwib3B0aW9uVmFsdWUiLCJoYW5kbGVDb25maXJtRmlsdGVyIiwiY2hlY2tlZCIsImZpbHRlck11bHRpcGxlIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsIm9wdGlvbiIsInJlbmRlck9wdGlvbnMiLCJvcHRpb25zIiwib3B0aW9uUHJvcHMiLCJsYWJlbFByb3AiLCJ2YWx1ZVByb3AiLCJkaXNhYmxlZFByb3AiLCJkaXNhYmxlZCIsImtleSIsInJlbmRlck1hcCIsIkFBdXRvQ29tcGxldGUiLCJhdXRvZm9jdXMiLCJyZW5kZXJEZWZhdWx0IiwicmVuZGVyRWRpdCIsInJlbmRlckZpbHRlciIsImZpbHRlck1ldGhvZCIsIkFJbnB1dCIsIkFJbnB1dE51bWJlciIsIkFTZWxlY3QiLCJvcHRpb25Hcm91cHMiLCJvcHRpb25Hcm91cFByb3BzIiwiZ3JvdXBPcHRpb25zIiwiZ3JvdXBMYWJlbCIsImdyb3VwIiwiZ0luZGV4Iiwic2xvdCIsInJlbmRlckNlbGwiLCJ1bmRlZmluZWQiLCJtb2RlIiwic2VsZWN0SXRlbSIsImZpbmQiLCJqb2luIiwiY2hhbmdlIiwiZmlsdGVyUmVuZGVyIiwiaXNBcnJheSIsImluY2x1ZGVBcnJheXMiLCJpbmRleE9mIiwiQUNhc2NhZGVyIiwic2hvd0FsbExldmVscyIsInNsaWNlIiwic2VwYXJhdG9yIiwiQURhdGVQaWNrZXIiLCJBTW9udGhQaWNrZXIiLCJBUmFuZ2VQaWNrZXIiLCJkYXRlIiwiQVdlZWtQaWNrZXIiLCJBVGltZVBpY2tlciIsIkFUcmVlU2VsZWN0IiwidHJlZUNoZWNrYWJsZSIsIm11bHRpcGxlIiwiQVJhdGUiLCJBU3dpdGNoIiwiaGFuZGxlQ2xlYXJFdmVudCIsImdldEV2ZW50VGFyZ2V0Tm9kZSIsImJvZHlFbGVtIiwiZG9jdW1lbnQiLCJib2R5IiwiZmxhZyIsIlZYRVRhYmxlUGx1Z2luQW50ZCIsImluc3RhbGwiLCJ4dGFibGUiLCJpbnRlcmNlcHRvciIsInJlbmRlcmVyIiwibWl4aW4iLCJhZGQiLCJ3aW5kb3ciLCJWWEVUYWJsZSIsInVzZSIsInRvTW9tZW50U3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUdBLFNBQVNBLGlCQUFULENBQTRCQyxLQUE1QixFQUEyQ0MsSUFBM0MsRUFBNkRDLE1BQTdELEVBQWlGQyxNQUFqRixFQUFtRztBQUNqRyxNQUFJQyxHQUFHLEdBQUdGLE1BQU0sQ0FBQ0YsS0FBRCxDQUFoQjs7QUFDQSxNQUFJQyxJQUFJLElBQUlDLE1BQU0sQ0FBQ0csTUFBUCxHQUFnQkwsS0FBNUIsRUFBbUM7QUFDakNNLHdCQUFRQyxJQUFSLENBQWFOLElBQWIsRUFBbUIsVUFBQ08sSUFBRCxFQUFjO0FBQy9CLFVBQUlBLElBQUksQ0FBQ0MsS0FBTCxLQUFlTCxHQUFuQixFQUF3QjtB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SixFQUFBQSxrQkFBa0IsQ0FBQzVFLElBQUQsRUFBTzZFLFFBQVAsRUFBaUIsdUJBQWpCLENBQWxCLENBQTRERyxJQVI5RCxFQVNFO0FBQ0EsV0FBTyxLQUFQO0FBQ0Q7QUFDRjtBQUVEOzs7OztBQUdPLElBQU1DLGtCQUFrQixHQUFHO0FBQ2hDQyxFQUFBQSxPQURnQyxtQkFDdkJDLE1BRHVCLEVBQ0E7QUFBQSxRQUN4QkMsV0FEd0IsR0FDRUQsTUFERixDQUN4QkMsV0FEd0I7QUFBQSxRQUNYQyxRQURXLEdBQ0VGLE1BREYsQ0FDWEUsUUFEVztBQUU5QkEsSUFBQUEsUUFBUSxDQUFDQyxLQUFULENBQWV0RCxTQUFmO0FBQ0FvRCxJQUFBQSxXQUFXLENBQUNHLEdBQVosQ0FBZ0IsbUJBQWhCLEVBQXFDWixnQkFBckM7QUFDQVMsSUFBQUEsV0FBVyxDQUFDRyxHQUFaLENBQWdCLG9CQUFoQixFQUFzQ1osZ0JBQXRDO0FBQ0Q7QUFOK0IsQ0FBM0I7OztBQVNQLElBQUksT0FBT2EsTUFBUCxLQUFrQixXQUFsQixJQUFpQ0EsTUFBTSxDQUFDQyxRQUE1QyxFQUFzRDtBQUNwREQsRUFBQUEsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxHQUFoQixDQUFvQlQsa0JBQXBCO0FBQ0Q7O0FBRUQsU0FBU1UsY0FBVCxDQUF5QjNHLFNBQXpCLEVBQXlDRyxNQUF6QyxFQUF1RDtBQUNyRCxTQUFPSCxTQUFTLEdBQUdBLFNBQVMsQ0FBQ0csTUFBVixDQUFpQkEsTUFBakIsQ0FBSCxHQUE4QixFQUE5QztBQUNEOztBQWFEakIsb0JBQVFvSCxLQUFSLENBQWM7QUFDWkssRUFBQUEsY0FBYyxFQUFkQTtBQURZLENBQWQ7O2VBSWVWLGtCIiwiZmlsZSI6ImluZGV4LmNvbW1vbi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBYRVV0aWxzIGZyb20gJ3hlLXV0aWxzL21ldGhvZHMveGUtdXRpbHMnXHJcbmltcG9ydCBWWEVUYWJsZSBmcm9tICd2eGUtdGFibGUvbGliL3Z4ZS10YWJsZSdcclxuXHJcbmZ1bmN0aW9uIG1hdGNoQ2FzY2FkZXJEYXRhIChpbmRleDogbnVtYmVyLCBsaXN0OiBBcnJheTxhbnk+LCB2YWx1ZXM6IEFycmF5PGFueT4sIGxhYmVsczogQXJyYXk8YW55Pikge1xyXG4gIGxldCB2YWwgPSB2YWx1ZXNbaW5kZXhdXHJcbiAgaWYgKGxpc3QgJiYgdmFsdWVzLmxlbmd0aCA+IGluZGV4KSB7XHJcbiAgICBYRVV0aWxzLmVhY2gobGlzdCwgKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS52YWx1ZSA9PT0gdmFsKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goaXRlbS5sYWJlbClcclxuICAgICAgICBtYXRjaENhc2NhZGVyRGF0YSgrK2luZGV4LCBpdGVtLmNoaWxkcmVuLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdERhdGVQaWNrZXIgKGRlZmF1bHRGb3JtYXQ6IGFueSkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogRnVuY3Rpb24sIHsgcHJvcHMgPSB7fSB9OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICBpZiAoY2VsbFZhbHVlKSB7XHJcbiAgICAgIGNlbGxWYWx1ZSA9IGNlbGxWYWx1ZS5mb3JtYXQocHJvcHMuZm9ybWF0IHx8IGRlZmF1bHRGb3JtYXQpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2VsbFRleHQoaCwgY2VsbFZhbHVlKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UHJvcHMgKHsgJHRhYmxlIH06IGFueSwgeyBwcm9wcyB9OiBhbnkpIHtcclxuICByZXR1cm4gWEVVdGlscy5hc3NpZ24oJHRhYmxlLnZTaXplID8geyBzaXplOiAkdGFibGUudlNpemUgfSA6IHt9LCBwcm9wcylcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2VsbEV2ZW50cyAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IG5hbWUsIGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7ICR0YWJsZSB9ID0gcGFyYW1zXHJcbiAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gIHN3aXRjaCAobmFtZSkge1xyXG4gICAgY2FzZSAnQUF1dG9Db21wbGV0ZSc6XHJcbiAgICAgIHR5cGUgPSAnc2VsZWN0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgdHlwZSA9ICdpbnB1dCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dE51bWJlcic6XHJcbiAgICAgIHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICBicmVha1xyXG4gIH1cclxuICBsZXQgb24gPSB7XHJcbiAgICBbdHlwZV06IChldm50OiBhbnkpID0+IHtcclxuICAgICAgJHRhYmxlLnVwZGF0ZVN0YXR1cyhwYXJhbXMpXHJcbiAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgZXZlbnRzW3R5cGVdKHBhcmFtcywgZXZudClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoZXZlbnRzKSB7XHJcbiAgICBYRVV0aWxzLmFzc2lnbihcclxuICAgICAge30sIFxyXG4gICAgICBYRVV0aWxzLm9iamVjdE1hcChldmVudHMsIChjYjogRnVuY3Rpb24pID0+IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICAgIGNiLmFwcGx5KG51bGwsIFtwYXJhbXNdLmNvbmNhdC5hcHBseShwYXJhbXMsIGFyZ3MpKVxyXG4gICAgICB9KSxcclxuICAgICAgb25cclxuICAgIClcclxuICB9XHJcbiAgcmV0dXJuIG9uXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRFZGl0UmVuZGVyIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICByZXR1cm4gW1xyXG4gICAgaChyZW5kZXJPcHRzLm5hbWUsIHtcclxuICAgICAgcHJvcHMsXHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBtb2RlbDoge1xyXG4gICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSksXHJcbiAgICAgICAgY2FsbGJhY2sgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCB2YWx1ZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgIH0pXHJcbiAgXVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGaWx0ZXJFdmVudHMgKG9uOiBhbnksIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBpZiAoZXZlbnRzKSB7XHJcbiAgICBYRVV0aWxzLmFzc2lnbih7fSwgWEVVdGlscy5vYmplY3RNYXAoZXZlbnRzLCAoY2I6IEZ1bmN0aW9uKSA9PiBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgY2IuYXBwbHkobnVsbCwgW3BhcmFtc10uY29uY2F0LmFwcGx5KHBhcmFtcywgYXJncykpXHJcbiAgICB9KSwgb24pXHJcbiAgfVxyXG4gIHJldHVybiBvblxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyUmVuZGVyIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgbGV0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgeyBuYW1lLCBhdHRycywgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgIGNhc2UgJ0FBdXRvQ29tcGxldGUnOlxyXG4gICAgICB0eXBlID0gJ3NlbGVjdCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dCc6XHJcbiAgICAgIHR5cGUgPSAnaW5wdXQnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXROdW1iZXInOlxyXG4gICAgICB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICByZXR1cm4gaChuYW1lLCB7XHJcbiAgICAgIHByb3BzLFxyXG4gICAgICBhdHRycyxcclxuICAgICAgbW9kZWw6IHtcclxuICAgICAgICB2YWx1ZTogaXRlbS5kYXRhLFxyXG4gICAgICAgIGNhbGxiYWNrIChvcHRpb25WYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICBpdGVtLmRhdGEgPSBvcHRpb25WYWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgb246IGdldEZpbHRlckV2ZW50cyh7XHJcbiAgICAgICAgW3R5cGVdIChldm50OiBhbnkpIHtcclxuICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dCwgY29sdW1uLCAhIWl0ZW0uZGF0YSwgaXRlbSlcclxuICAgICAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgICAgIGV2ZW50c1t0eXBlXShwYXJhbXMsIGV2bnQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICB9KVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNvbmZpcm1GaWx0ZXIgKGNvbnRleHQ6IGFueSwgY29sdW1uOiBhbnksIGNoZWNrZWQ6IGFueSwgaXRlbTogYW55KSB7XHJcbiAgY29udGV4dFtjb2x1bW4uZmlsdGVyTXVsdGlwbGUgPyAnY2hhbmdlTXVsdGlwbGVPcHRpb24nIDogJ2NoYW5nZVJhZGlvT3B0aW9uJ10oe30sIGNoZWNrZWQsIGl0ZW0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXJNZXRob2QgKHsgb3B0aW9uLCByb3csIGNvbHVtbiB9OiBhbnkpIHtcclxuICBsZXQgeyBkYXRhIH0gPSBvcHRpb25cclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gZGF0YVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJPcHRpb25zIChoOiBGdW5jdGlvbiwgb3B0aW9uczogYW55LCBvcHRpb25Qcm9wczogYW55KSB7XHJcbiAgbGV0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICBsZXQgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gIGxldCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgcmV0dXJuIFhFVXRpbHMubWFwKG9wdGlvbnMsIChpdGVtOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHRpb24nLCB7XHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgdmFsdWU6IGl0ZW1bdmFsdWVQcm9wXSxcclxuICAgICAgICBkaXNhYmxlZDogaXRlbVtkaXNhYmxlZFByb3BdXHJcbiAgICAgIH0sXHJcbiAgICAgIGtleTogaW5kZXhcclxuICAgIH0sIGl0ZW1bbGFiZWxQcm9wXSlcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBjZWxsVGV4dCAoaDogRnVuY3Rpb24sIGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgcmV0dXJuIFsnJyArIChjZWxsVmFsdWUgPT09IG51bGwgfHwgY2VsbFZhbHVlID09PSB2b2lkIDAgPyAnJyA6IGNlbGxWYWx1ZSldXHJcbn1cclxuXHJcbi8qKlxyXG4gKiDmuLLmn5Plh73mlbBcclxuICovXHJcbmNvbnN0IHJlbmRlck1hcCA9IHtcclxuICBBQXV0b0NvbXBsZXRlOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckZpbHRlcjogZGVmYXVsdEZpbHRlclJlbmRlcixcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZFxyXG4gIH0sXHJcbiAgQUlucHV0OiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckZpbHRlcjogZGVmYXVsdEZpbHRlclJlbmRlcixcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZFxyXG4gIH0sXHJcbiAgQUlucHV0TnVtYmVyOiB7XHJcbiAgICBhdXRvZm9jdXM6ICdpbnB1dC5hbnQtaW5wdXQtbnVtYmVyLWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJGaWx0ZXI6IGRlZmF1bHRGaWx0ZXJSZW5kZXIsXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuICB9LFxyXG4gIEFTZWxlY3Q6IHtcclxuICAgIHJlbmRlckVkaXQgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IG9wdGlvbnMsIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBsZXQgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBbXHJcbiAgICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSksXHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBYRVV0aWxzLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXA6IGFueSwgZ0luZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSksXHJcbiAgICAgICAgICAgIGNhbGxiYWNrIChjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCBjZWxsVmFsdWUpXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjogZ2V0Q2VsbEV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICByZW5kZXJDZWxsIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIHByb3BzID0ge30sIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCBsYWJlbFByb3AgPSBvcHRpb25Qcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgIGxldCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgICAgIGxldCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgaWYgKCEoY2VsbFZhbHVlID09PSBudWxsIHx8IGNlbGxWYWx1ZSA9PT0gdW5kZWZpbmVkIHx8IGNlbGxWYWx1ZSA9PT0gJycpKSB7XHJcbiAgICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIFhFVXRpbHMubWFwKHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScgPyBjZWxsVmFsdWUgOiBbY2VsbFZhbHVlXSwgb3B0aW9uR3JvdXBzID8gKHZhbHVlOiBhbnkpID0+IHtcclxuICAgICAgICAgIGxldCBzZWxlY3RJdGVtXHJcbiAgICAgICAgICBmb3IgKGxldCBpbmRleCA9IDA7IGluZGV4IDwgb3B0aW9uR3JvdXBzLmxlbmd0aDsgaW5kZXgrKykge1xyXG4gICAgICAgICAgICBzZWxlY3RJdGVtID0gWEVVdGlscy5maW5kKG9wdGlvbkdyb3Vwc1tpbmRleF1bZ3JvdXBPcHRpb25zXSwgKGl0ZW06IGFueSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgICAgICAgaWYgKHNlbGVjdEl0ZW0pIHtcclxuICAgICAgICAgICAgICBicmVha1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICByZXR1cm4gc2VsZWN0SXRlbSA/IHNlbGVjdEl0ZW1bbGFiZWxQcm9wXSA6IG51bGxcclxuICAgICAgICB9IDogKHZhbHVlOiBhbnkpID0+IHtcclxuICAgICAgICAgIGxldCBzZWxlY3RJdGVtID0gWEVVdGlscy5maW5kKG9wdGlvbnMsIChpdGVtOiBhbnkpID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXHJcbiAgICAgICAgICByZXR1cm4gc2VsZWN0SXRlbSA/IHNlbGVjdEl0ZW1bbGFiZWxQcm9wXSA6IG51bGxcclxuICAgICAgICB9KS5qb2luKCc7JykpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsICcnKVxyXG4gICAgfSxcclxuICAgIHJlbmRlckZpbHRlciAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gICAgICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgeyBhdHRycywgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgICAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBsZXQgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICAgICAgICBjYWxsYmFjayAob3B0aW9uVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kYXRhID0gb3B0aW9uVmFsdWVcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uOiBnZXRGaWx0ZXJFdmVudHMoe1xyXG4gICAgICAgICAgICAgIFt0eXBlXSAodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihjb250ZXh0LCBjb2x1bW4sIHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDAsIGl0ZW0pXHJcbiAgICAgICAgICAgICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgICAgICAgICAgICBldmVudHNbdHlwZV0ocGFyYW1zLCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwOiBhbnksIGdJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICB9KVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogaXRlbS5kYXRhLFxyXG4gICAgICAgICAgICBjYWxsYmFjayAob3B0aW9uVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIGl0ZW0uZGF0YSA9IG9wdGlvblZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjogZ2V0RmlsdGVyRXZlbnRzKHtcclxuICAgICAgICAgICAgY2hhbmdlICh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihjb250ZXh0LCBjb2x1bW4sIHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDAsIGl0ZW0pXHJcbiAgICAgICAgICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50c1t0eXBlXShwYXJhbXMsIHZhbHVlKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSwgcmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGZpbHRlck1ldGhvZCAoeyBvcHRpb24sIHJvdywgY29sdW1uIH06IGFueSkge1xyXG4gICAgICBsZXQgeyBkYXRhIH0gPSBvcHRpb25cclxuICAgICAgbGV0IHsgcHJvcGVydHksIGZpbHRlclJlbmRlcjogcmVuZGVyT3B0cyB9ID0gY29sdW1uXHJcbiAgICAgIGxldCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgcHJvcGVydHkpXHJcbiAgICAgIGlmIChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnKSB7XHJcbiAgICAgICAgaWYgKFhFVXRpbHMuaXNBcnJheShjZWxsVmFsdWUpKSB7XHJcbiAgICAgICAgICByZXR1cm4gWEVVdGlscy5pbmNsdWRlQXJyYXlzKGNlbGxWYWx1ZSwgZGF0YSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGEuaW5kZXhPZihjZWxsVmFsdWUpID4gLTFcclxuICAgICAgfVxyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cclxuICAgICAgcmV0dXJuIGNlbGxWYWx1ZSA9PSBkYXRhXHJcbiAgICB9XHJcbiAgfSxcclxuICBBQ2FzY2FkZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogRnVuY3Rpb24sIHsgcHJvcHMgPSB7fSB9OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICB2YXIgdmFsdWVzID0gY2VsbFZhbHVlIHx8IFtdXHJcbiAgICAgIHZhciBsYWJlbHM6IEFycmF5PGFueT4gPSBbXVxyXG4gICAgICBtYXRjaENhc2NhZGVyRGF0YSgwLCBwcm9wcy5vcHRpb25zLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIChwcm9wcy5zaG93QWxsTGV2ZWxzID09PSBmYWxzZSA/IGxhYmVscy5zbGljZShsYWJlbHMubGVuZ3RoIC0gMSwgbGFiZWxzLmxlbmd0aCkgOiBsYWJlbHMpLmpvaW4oYCAke3Byb3BzLnNlcGFyYXRvciB8fCAnLyd9IGApKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgQURhdGVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTS1ERCcpXHJcbiAgfSxcclxuICBBTW9udGhQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTScpXHJcbiAgfSxcclxuICBBUmFuZ2VQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogRnVuY3Rpb24sIHsgcHJvcHMgPSB7fSB9OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICBpZiAoY2VsbFZhbHVlKSB7XHJcbiAgICAgICAgY2VsbFZhbHVlID0gWEVVdGlscy5tYXAoY2VsbFZhbHVlLCAoZGF0ZTogYW55KSA9PiBkYXRlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgJ1lZWVktTU0tREQnKSkuam9pbignIH4gJylcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgY2VsbFZhbHVlKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgQVdlZWtQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1XV+WRqCcpXHJcbiAgfSxcclxuICBBVGltZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdISDptbTpzcycpXHJcbiAgfSxcclxuICBBVHJlZVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJDZWxsIChoOiBGdW5jdGlvbiwgeyBwcm9wcyA9IHt9IH06IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICAgIGlmIChjZWxsVmFsdWUgJiYgKHByb3BzLnRyZWVDaGVja2FibGUgfHwgcHJvcHMubXVsdGlwbGUpKSB7XHJcbiAgICAgICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmpvaW4oJzsnKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBjZWxsVmFsdWUpXHJcbiAgICB9XHJcbiAgfSxcclxuICBBUmF0ZToge1xyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckZpbHRlcjogZGVmYXVsdEZpbHRlclJlbmRlcixcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZFxyXG4gIH0sXHJcbiAgQVN3aXRjaDoge1xyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckZpbHRlcjogZGVmYXVsdEZpbHRlclJlbmRlcixcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZFxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOS6i+S7tuWFvOWuueaAp+WkhOeQhlxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlQ2xlYXJFdmVudCAocGFyYW1zOiBhbnksIGV2bnQ6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgbGV0IHsgZ2V0RXZlbnRUYXJnZXROb2RlIH0gPSBjb250ZXh0XHJcbiAgbGV0IGJvZHlFbGVtID0gZG9jdW1lbnQuYm9keVxyXG4gIGlmIChcclxuICAgIC8vIOS4i+aLieahhlxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LXNlbGVjdC1kcm9wZG93bicpLmZsYWcgfHxcclxuICAgIC8vIOe6p+iBlFxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhc2NhZGVyLW1lbnVzJykuZmxhZyB8fFxyXG4gICAgLy8g5pel5pyfXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FsZW5kYXItcGlja2VyLWNvbnRhaW5lcicpLmZsYWcgfHxcclxuICAgIC8vIOaXtumXtOmAieaLqVxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LXRpbWUtcGlja2VyLXBhbmVsJykuZmxhZ1xyXG4gICkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5Z+65LqOIHZ4ZS10YWJsZSDooajmoLznmoTpgILphY3mj5Lku7bvvIznlKjkuo7lhbzlrrkgYW50LWRlc2lnbi12dWUg57uE5Lu25bqTXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgVlhFVGFibGVQbHVnaW5BbnRkID0ge1xyXG4gIGluc3RhbGwgKHh0YWJsZTogdHlwZW9mIFZYRVRhYmxlKSB7XHJcbiAgICBsZXQgeyBpbnRlcmNlcHRvciwgcmVuZGVyZXIgfSA9IHh0YWJsZVxyXG4gICAgcmVuZGVyZXIubWl4aW4ocmVuZGVyTWFwKVxyXG4gICAgaW50ZXJjZXB0b3IuYWRkKCdldmVudC5jbGVhckZpbHRlcicsIGhhbmRsZUNsZWFyRXZlbnQpXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyQWN0aXZlZCcsIGhhbmRsZUNsZWFyRXZlbnQpXHJcbiAgfVxyXG59XHJcblxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LlZYRVRhYmxlKSB7XHJcbiAgd2luZG93LlZYRVRhYmxlLnVzZShWWEVUYWJsZVBsdWdpbkFudGQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvTW9tZW50U3RyaW5nIChjZWxsVmFsdWU6IGFueSwgZm9ybWF0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPyBjZWxsVmFsdWUuZm9ybWF0KGZvcm1hdCkgOiAnJ1xyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSAneGUtdXRpbHMvbWV0aG9kcy94ZS11dGlscycge1xyXG4gIGludGVyZmFjZSBYRVV0aWxzTWV0aG9kcyB7XHJcbiAgICAvKipcclxuICAgICAqIOWwhiBNb21lbnQg5pel5pyf5qC85byP5YyW5Li65a2X56ym5LiyXHJcbiAgICAgKiBAcGFyYW0gY2VsbFZhbHVlIOWAvFxyXG4gICAgICogQHBhcmFtIGZvcm1hdCDmoLzlvI/ljJZcclxuICAgICAqL1xyXG4gICAgdG9Nb21lbnRTdHJpbmc6IHR5cGVvZiB0b01vbWVudFN0cmluZztcclxuICB9XHJcbn1cclxuXHJcblhFVXRpbHMubWl4aW4oe1xyXG4gIHRvTW9tZW50U3RyaW5nXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWWEVUYWJsZVBsdWdpbkFudGRcclxuIl19
