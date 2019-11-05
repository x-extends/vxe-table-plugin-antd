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

function getFilterEvents(on, renderOpts, params) {
  var events = renderOpts.events;

  if (events) {
    return _xeUtils["default"].assign({}, _xeUtils["default"].objectMap(events, function (cb) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiWEVVdGlscyIsImVhY2giLCJpdGVtIiwidmFsdWUiLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsInBhcmFtcyIsInByb3BzIiwicm93IiwiY29sdW1uIiwiY2VsbFZhbHVlIiwiZ2V0IiwicHJvcGVydHkiLCJmb3JtYXQiLCJjZWxsVGV4dCIsImdldFByb3BzIiwiJHRhYmxlIiwiYXNzaWduIiwidlNpemUiLCJzaXplIiwiZ2V0Q2VsbEV2ZW50cyIsInJlbmRlck9wdHMiLCJuYW1lIiwiZXZlbnRzIiwidHlwZSIsIm9uIiwiZXZudCIsInVwZGF0ZVN0YXR1cyIsIm9iamVjdE1hcCIsImNiIiwiYXJncyIsImFwcGx5IiwiY29uY2F0IiwiZGVmYXVsdEVkaXRSZW5kZXIiLCJhdHRycyIsIm1vZGVsIiwiY2FsbGJhY2siLCJzZXQiLCJnZXRGaWx0ZXJFdmVudHMiLCJkZWZhdWx0RmlsdGVyUmVuZGVyIiwiY29udGV4dCIsImZpbHRlcnMiLCJtYXAiLCJkYXRhIiwib3B0aW9uVmFsdWUiLCJoYW5kbGVDb25maXJtRmlsdGVyIiwiY2hlY2tlZCIsImZpbHRlck11bHRpcGxlIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsIm9wdGlvbiIsInJlbmRlck9wdGlvbnMiLCJvcHRpb25zIiwib3B0aW9uUHJvcHMiLCJsYWJlbFByb3AiLCJ2YWx1ZVByb3AiLCJkaXNhYmxlZFByb3AiLCJkaXNhYmxlZCIsImtleSIsInJlbmRlck1hcCIsIkFBdXRvQ29tcGxldGUiLCJhdXRvZm9jdXMiLCJyZW5kZXJEZWZhdWx0IiwicmVuZGVyRWRpdCIsInJlbmRlckZpbHRlciIsImZpbHRlck1ldGhvZCIsIkFJbnB1dCIsIkFJbnB1dE51bWJlciIsIkFTZWxlY3QiLCJvcHRpb25Hcm91cHMiLCJvcHRpb25Hcm91cFByb3BzIiwiZ3JvdXBPcHRpb25zIiwiZ3JvdXBMYWJlbCIsImdyb3VwIiwiZ0luZGV4Iiwic2xvdCIsInJlbmRlckNlbGwiLCJ1bmRlZmluZWQiLCJtb2RlIiwic2VsZWN0SXRlbSIsImZpbmQiLCJqb2luIiwiY2hhbmdlIiwiZmlsdGVyUmVuZGVyIiwiaXNBcnJheSIsImluY2x1ZGVBcnJheXMiLCJpbmRleE9mIiwiQUNhc2NhZGVyIiwic2hvd0FsbExldmVscyIsInNsaWNlIiwic2VwYXJhdG9yIiwiQURhdGVQaWNrZXIiLCJBTW9udGhQaWNrZXIiLCJBUmFuZ2VQaWNrZXIiLCJkYXRlIiwiQVdlZWtQaWNrZXIiLCJBVGltZVBpY2tlciIsIkFUcmVlU2VsZWN0IiwidHJlZUNoZWNrYWJsZSIsIm11bHRpcGxlIiwiQVJhdGUiLCJBU3dpdGNoIiwiaGFuZGxlQ2xlYXJFdmVudCIsImdldEV2ZW50VGFyZ2V0Tm9kZSIsImJvZHlFbGVtIiwiZG9jdW1lbnQiLCJib2R5IiwiZmxhZyIsIlZYRVRhYmxlUGx1Z2luQW50ZCIsImluc3RhbGwiLCJ4dGFibGUiLCJpbnRlcmNlcHRvciIsInJlbmRlcmVyIiwibWl4aW4iLCJhZGQiLCJ3aW5kb3ciLCJWWEVUYWJsZSIsInVzZSIsInRvTW9tZW50U3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUdBLFNBQVNBLGlCQUFULENBQTJCQyxLQUEzQixFQUEwQ0MsSUFBMUMsRUFBNERDLE1BQTVELEVBQWdGQyxNQUFoRixFQUFrRztBQUNoRyxNQUFJQyxHQUFHLEdBQUdGLE1BQU0sQ0FBQ0YsS0FBRCxDQUFoQjs7QUFDQSxNQUFJQyxJQUFJLElBQUlDLE1BQU0sQ0FBQ0csTUFBUCxHQUFnQkwsS0FBNUIsRUFBbUM7QUFDakNNLHdCQUFRQyxJQUFSLENBQWFOLElBQWIsRUFBbUIsVUFBQ08sSUFBRCxFQUFjO0FBQy9CLFVBQUlBLElBQUksQ0FBQ0MsS0FBTCxLQUFlTCxHQUFuQixFQUF3QjtBQUN0QkQsUUFBQUEsTUFBTSxDQUFDTyxJQUFQLENBQVlGLElBQUksQ0FBQ0csS0FBakI7QUFDQVosUUFBQUEsaUJBQWlCLENBQUMsRUFBRUMsS0FBSCxFQUFVUSxJQUFJLENBQUNJLFFBQWYsRUFBeUJWLE1BQXpCLEVBQWlDQyxNQUFqQyxDQUFqQjtBQUNEO0FBQ0YsS0FMRDtBQU1EO0FBQ0Y7O0FBRUQsU0FBU1UsZ0JBQVQsQ0FBMEJDLGFBQTFCLEVBQTRDO0FBQzFDLFNBQU8sVUFBVUMsQ0FBVixRQUE0Q0MsTUFBNUMsRUFBdUQ7QUFBQSwwQkFBOUJDLEtBQThCO0FBQUEsUUFBOUJBLEtBQThCLDJCQUF0QixFQUFzQjtBQUFBLFFBQ3REQyxHQURzRCxHQUN0Q0YsTUFEc0MsQ0FDdERFLEdBRHNEO0FBQUEsUUFDakRDLE1BRGlELEdBQ3RDSCxNQURzQyxDQUNqREcsTUFEaUQ7O0FBRTVELFFBQUlDLFNBQVMsR0FBR2Qsb0JBQVFlLEdBQVIsQ0FBWUgsR0FBWixFQUFpQkMsTUFBTSxDQUFDRyxRQUF4QixDQUFoQjs7QUFDQSxRQUFJRixTQUFKLEVBQWU7QUFDYkEsTUFBQUEsU0FBUyxHQUFHQSxTQUFTLENBQUNHLE1BQVYsQ0FBaUJOLEtBQUssQ0FBQ00sTUFBTixJQUFnQlQsYUFBakMsQ0FBWjtBQUNEOztBQUNELFdBQU9VLFFBQVEsQ0FBQ1QsQ0FBRCxFQUFJSyxTQUFKLENBQWY7QUFDRCxHQVBEO0FBUUQ7O0FBRUQsU0FBU0ssUUFBVCxlQUFpRDtBQUFBLE1BQTdCQyxNQUE2QixTQUE3QkEsTUFBNkI7QUFBQSxNQUFaVCxLQUFZLFNBQVpBLEtBQVk7QUFDL0MsU0FBT1gsb0JBQVFxQixNQUFSLENBQWVELE1BQU0sQ0FBQ0UsS0FBUCxHQUFlO0FBQUVDLElBQUFBLElBQUksRUFBRUgsTUFBTSxDQUFDRTtBQUFmLEdBQWYsR0FBd0MsRUFBdkQsRUFBMkRYLEtBQTNELENBQVA7QUFDRDs7QUFFRCxTQUFTYSxhQUFULENBQXVCQyxVQUF2QixFQUF3Q2YsTUFBeEMsRUFBbUQ7QUFBQSxNQUMzQ2dCLElBRDJDLEdBQzFCRCxVQUQwQixDQUMzQ0MsSUFEMkM7QUFBQSxNQUNyQ0MsTUFEcUMsR0FDMUJGLFVBRDBCLENBQ3JDRSxNQURxQztBQUFBLE1BRTNDUCxNQUYyQyxHQUVoQ1YsTUFGZ0MsQ0FFM0NVLE1BRjJDO0FBR2pELE1BQUlRLElBQUksR0FBRyxRQUFYOztBQUNBLFVBQVFGLElBQVI7QUFDRSxTQUFLLGVBQUw7QUFDRUUsTUFBQUEsSUFBSSxHQUFHLFFBQVA7QUFDQTs7QUFDRixTQUFLLFFBQUw7QUFDRUEsTUFBQUEsSUFBSSxHQUFHLE9BQVA7QUFDQTs7QUFDRixTQUFLLGNBQUw7QUFDRUEsTUFBQUEsSUFBSSxHQUFHLFFBQVA7QUFDQTtBQVRKOztBQVdBLE1BQUlDLEVBQUUsdUJBQ0hELElBREcsRUFDSSxVQUFDRSxJQUFELEVBQWM7QUFDcEJWLElBQUFBLE1BQU0sQ0FBQ1csWUFBUCxDQUFvQnJCLE1BQXBCOztBQUNBLFFBQUlpQixNQUFNLElBQUlBLE1BQU0sQ0FBQ0MsSUFBRCxDQUFwQixFQUE0QjtBQUMxQkQsTUFBQUEsTUFBTSxDQUFDQyxJQUFELENBQU4sQ0FBYWxCLE1BQWIsRUFBcUJvQixJQUFyQjtBQUNEO0FBQ0YsR0FORyxDQUFOOztBQVFBLE1BQUlILE1BQUosRUFBWTtBQUNWLFdBQU8zQixvQkFBUXFCLE1BQVIsQ0FBZSxFQUFmLEVBQW1CckIsb0JBQVFnQyxTQUFSLENBQWtCTCxNQUFsQixFQUEwQixVQUFDTSxFQUFEO0FBQUEsYUFBa0IsWUFBd0I7QUFBQSwwQ0FBWEMsSUFBVztBQUFYQSxVQUFBQSxJQUFXO0FBQUE7O0FBQzVGRCxRQUFBQSxFQUFFLENBQUNFLEtBQUgsQ0FBUyxJQUFULEVBQWUsQ0FBQ3pCLE1BQUQsRUFBUzBCLE1BQVQsQ0FBZ0JELEtBQWhCLENBQXNCekIsTUFBdEIsRUFBOEJ3QixJQUE5QixDQUFmO0FBQ0QsT0FGbUQ7QUFBQSxLQUExQixDQUFuQixFQUVITCxFQUZHLENBQVA7QUFHRDs7QUFDRCxTQUFPQSxFQUFQO0FBQ0Q7O0FBRUQsU0FBU1EsaUJBQVQsQ0FBMkI1QixDQUEzQixFQUF3Q2dCLFVBQXhDLEVBQXlEZixNQUF6RCxFQUFvRTtBQUFBLE1BQzVERSxHQUQ0RCxHQUM1Q0YsTUFENEMsQ0FDNURFLEdBRDREO0FBQUEsTUFDdkRDLE1BRHVELEdBQzVDSCxNQUQ0QyxDQUN2REcsTUFEdUQ7QUFBQSxNQUU1RHlCLEtBRjRELEdBRWxEYixVQUZrRCxDQUU1RGEsS0FGNEQ7QUFHbEUsTUFBSTNCLEtBQUssR0FBR1EsUUFBUSxDQUFDVCxNQUFELEVBQVNlLFVBQVQsQ0FBcEI7QUFDQSxTQUFPLENBQ0xoQixDQUFDLENBQUNnQixVQUFVLENBQUNDLElBQVosRUFBa0I7QUFDakJmLElBQUFBLEtBQUssRUFBTEEsS0FEaUI7QUFFakIyQixJQUFBQSxLQUFLLEVBQUxBLEtBRmlCO0FBR2pCQyxJQUFBQSxLQUFLLEVBQUU7QUFDTHBDLE1BQUFBLEtBQUssRUFBRUgsb0JBQVFlLEdBQVIsQ0FBWUgsR0FBWixFQUFpQkMsTUFBTSxDQUFDRyxRQUF4QixDQURGO0FBRUx3QixNQUFBQSxRQUZLLG9CQUVJckMsS0FGSixFQUVjO0FBQ2pCSCw0QkFBUXlDLEdBQVIsQ0FBWTdCLEdBQVosRUFBaUJDLE1BQU0sQ0FBQ0csUUFBeEIsRUFBa0NiLEtBQWxDO0FBQ0Q7QUFKSSxLQUhVO0FBU2pCMEIsSUFBQUEsRUFBRSxFQUFFTCxhQUFhLENBQUNDLFVBQUQsRUFBYWYsTUFBYjtBQVRBLEdBQWxCLENBREksQ0FBUDtBQWFEOztBQUVELFNBQVNnQyxlQUFULENBQXlCYixFQUF6QixFQUFrQ0osVUFBbEMsRUFBbURmLE1BQW5ELEVBQThEO0FBQUEsTUFDdERpQixNQURzRCxHQUMzQ0YsVUFEMkMsQ0FDdERFLE1BRHNEOztBQUU1RCxNQUFJQSxNQUFKLEVBQVk7QUFDVixXQUFPM0Isb0JBQVFxQixNQUFSLENBQWUsRUFBZixFQUFtQnJCLG9CQUFRZ0MsU0FBUixDQUFrQkwsTUFBbEIsRUFBMEIsVUFBQ00sRUFBRDtBQUFBLGFBQWtCLFlBQXdCO0FBQUEsMkNBQVhDLElBQVc7QUFBWEEsVUFBQUEsSUFBVztBQUFBOztBQUM1RkQsUUFBQUEsRUFBRSxDQUFDRSxLQUFILENBQVMsSUFBVCxFQUFlLENBQUN6QixNQUFELEVBQVMwQixNQUFULENBQWdCRCxLQUFoQixDQUFzQnpCLE1BQXRCLEVBQThCd0IsSUFBOUIsQ0FBZjtBQUNELE9BRm1EO0FBQUEsS0FBMUIsQ0FBbkIsRUFFSEwsRUFGRyxDQUFQO0FBR0Q7O0FBQ0QsU0FBT0EsRUFBUDtBQUNEOztBQUVELFNBQVNjLG1CQUFULENBQTZCbEMsQ0FBN0IsRUFBMENnQixVQUExQyxFQUEyRGYsTUFBM0QsRUFBd0VrQyxPQUF4RSxFQUFvRjtBQUFBLE1BQzVFL0IsTUFENEUsR0FDakVILE1BRGlFLENBQzVFRyxNQUQ0RTtBQUFBLE1BRTVFYSxJQUY0RSxHQUVwREQsVUFGb0QsQ0FFNUVDLElBRjRFO0FBQUEsTUFFdEVZLEtBRnNFLEdBRXBEYixVQUZvRCxDQUV0RWEsS0FGc0U7QUFBQSxNQUUvRFgsTUFGK0QsR0FFcERGLFVBRm9ELENBRS9ERSxNQUYrRDtBQUdsRixNQUFJaEIsS0FBSyxHQUFHUSxRQUFRLENBQUNULE1BQUQsRUFBU2UsVUFBVCxDQUFwQjtBQUNBLE1BQUlHLElBQUksR0FBRyxRQUFYOztBQUNBLFVBQVFGLElBQVI7QUFDRSxTQUFLLGVBQUw7QUFDRUUsTUFBQUEsSUFBSSxHQUFHLFFBQVA7QUFDQTs7QUFDRixTQUFLLFFBQUw7QUFDRUEsTUFBQUEsSUFBSSxHQUFHLE9BQVA7QUFDQTs7QUFDRixTQUFLLGNBQUw7QUFDRUEsTUFBQUEsSUFBSSxHQUFHLFFBQVA7QUFDQTtBQVRKOztBQVdBLFNBQU9mLE1BQU0sQ0FBQ2dDLE9BQVAsQ0FBZUMsR0FBZixDQUFtQixVQUFDNUMsSUFBRCxFQUFjO0FBQ3RDLFdBQU9PLENBQUMsQ0FBQ2lCLElBQUQsRUFBTztBQUNiZixNQUFBQSxLQUFLLEVBQUxBLEtBRGE7QUFFYjJCLE1BQUFBLEtBQUssRUFBTEEsS0FGYTtBQUdiQyxNQUFBQSxLQUFLLEVBQUU7QUFDTHBDLFFBQUFBLEtBQUssRUFBRUQsSUFBSSxDQUFDNkMsSUFEUDtBQUVMUCxRQUFBQSxRQUZLLG9CQUVJUSxXQUZKLEVBRW9CO0FBQ3ZCOUMsVUFBQUEsSUFBSSxDQUFDNkMsSUFBTCxHQUFZQyxXQUFaO0FBQ0Q7QUFKSSxPQUhNO0FBU2JuQixNQUFBQSxFQUFFLEVBQUVhLGVBQWUscUJBQ2hCZCxJQURnQixZQUNWRSxJQURVLEVBQ0Q7QUFDZG1CLFFBQUFBLG1CQUFtQixDQUFDTCxPQUFELEVBQVUvQixNQUFWLEVBQWtCLENBQUMsQ0FBQ1gsSUFBSSxDQUFDNkMsSUFBekIsRUFBK0I3QyxJQUEvQixDQUFuQjs7QUFDQSxZQUFJeUIsTUFBTSxJQUFJQSxNQUFNLENBQUNDLElBQUQsQ0FBcEIsRUFBNEI7QUFDMUJELFVBQUFBLE1BQU0sQ0FBQ0MsSUFBRCxDQUFOLENBQWFsQixNQUFiLEVBQXFCb0IsSUFBckI7QUFDRDtBQUNGLE9BTmdCLEdBT2hCTCxVQVBnQixFQU9KZixNQVBJO0FBVE4sS0FBUCxDQUFSO0FBa0JELEdBbkJNLENBQVA7QUFvQkQ7O0FBRUQsU0FBU3VDLG1CQUFULENBQTZCTCxPQUE3QixFQUEyQy9CLE1BQTNDLEVBQXdEcUMsT0FBeEQsRUFBc0VoRCxJQUF0RSxFQUErRTtBQUM3RTBDLEVBQUFBLE9BQU8sQ0FBQy9CLE1BQU0sQ0FBQ3NDLGNBQVAsR0FBd0Isc0JBQXhCLEdBQWlELG1CQUFsRCxDQUFQLENBQThFLEVBQTlFLEVBQWtGRCxPQUFsRixFQUEyRmhELElBQTNGO0FBQ0Q7O0FBRUQsU0FBU2tELG1CQUFULFFBQXlEO0FBQUEsTUFBMUJDLE1BQTBCLFNBQTFCQSxNQUEwQjtBQUFBLE1BQWxCekMsR0FBa0IsU0FBbEJBLEdBQWtCO0FBQUEsTUFBYkMsTUFBYSxTQUFiQSxNQUFhO0FBQUEsTUFDakRrQyxJQURpRCxHQUN4Q00sTUFEd0MsQ0FDakROLElBRGlEOztBQUV2RCxNQUFJakMsU0FBUyxHQUFHZCxvQkFBUWUsR0FBUixDQUFZSCxHQUFaLEVBQWlCQyxNQUFNLENBQUNHLFFBQXhCLENBQWhCO0FBQ0E7OztBQUNBLFNBQU9GLFNBQVMsS0FBS2lDLElBQXJCO0FBQ0Q7O0FBRUQsU0FBU08sYUFBVCxDQUF1QjdDLENBQXZCLEVBQW9DOEMsT0FBcEMsRUFBa0RDLFdBQWxELEVBQWtFO0FBQ2hFLE1BQUlDLFNBQVMsR0FBR0QsV0FBVyxDQUFDbkQsS0FBWixJQUFxQixPQUFyQztBQUNBLE1BQUlxRCxTQUFTLEdBQUdGLFdBQVcsQ0FBQ3JELEtBQVosSUFBcUIsT0FBckM7QUFDQSxNQUFJd0QsWUFBWSxHQUFHSCxXQUFXLENBQUNJLFFBQVosSUFBd0IsVUFBM0M7QUFDQSxTQUFPNUQsb0JBQVE4QyxHQUFSLENBQVlTLE9BQVosRUFBcUIsVUFBQ3JELElBQUQsRUFBWVIsS0FBWixFQUE2QjtBQUN2RCxXQUFPZSxDQUFDLENBQUMsaUJBQUQsRUFBb0I7QUFDMUJFLE1BQUFBLEtBQUssRUFBRTtBQUNMUixRQUFBQSxLQUFLLEVBQUVELElBQUksQ0FBQ3dELFNBQUQsQ0FETjtBQUVMRSxRQUFBQSxRQUFRLEVBQUUxRCxJQUFJLENBQUN5RCxZQUFEO0FBRlQsT0FEbUI7QUFLMUJFLE1BQUFBLEdBQUcsRUFBRW5FO0FBTHFCLEtBQXBCLEVBTUxRLElBQUksQ0FBQ3VELFNBQUQsQ0FOQyxDQUFSO0FBT0QsR0FSTSxDQUFQO0FBU0Q7O0FBRUQsU0FBU3ZDLFFBQVQsQ0FBa0JULENBQWxCLEVBQStCSyxTQUEvQixFQUE2QztBQUMzQyxTQUFPLENBQUMsTUFBTUEsU0FBUyxLQUFLLElBQWQsSUFBc0JBLFNBQVMsS0FBSyxLQUFLLENBQXpDLEdBQTZDLEVBQTdDLEdBQWtEQSxTQUF4RCxDQUFELENBQVA7QUFDRDtBQUVEOzs7OztBQUdBLElBQU1nRCxTQUFTLEdBQUc7QUFDaEJDLEVBQUFBLGFBQWEsRUFBRTtBQUNiQyxJQUFBQSxTQUFTLEVBQUUsaUJBREU7QUFFYkMsSUFBQUEsYUFBYSxFQUFFNUIsaUJBRkY7QUFHYjZCLElBQUFBLFVBQVUsRUFBRTdCLGlCQUhDO0FBSWI4QixJQUFBQSxZQUFZLEVBQUV4QixtQkFKRDtBQUtieUIsSUFBQUEsWUFBWSxFQUFFaEI7QUFMRCxHQURDO0FBUWhCaUIsRUFBQUEsTUFBTSxFQUFFO0FBQ05MLElBQUFBLFNBQVMsRUFBRSxpQkFETDtBQUVOQyxJQUFBQSxhQUFhLEVBQUU1QixpQkFGVDtBQUdONkIsSUFBQUEsVUFBVSxFQUFFN0IsaUJBSE47QUFJTjhCLElBQUFBLFlBQVksRUFBRXhCLG1CQUpSO0FBS055QixJQUFBQSxZQUFZLEVBQUVoQjtBQUxSLEdBUlE7QUFlaEJrQixFQUFBQSxZQUFZLEVBQUU7QUFDWk4sSUFBQUEsU0FBUyxFQUFFLDhCQURDO0FBRVpDLElBQUFBLGFBQWEsRUFBRTVCLGlCQUZIO0FBR1o2QixJQUFBQSxVQUFVLEVBQUU3QixpQkFIQTtBQUlaOEIsSUFBQUEsWUFBWSxFQUFFeEIsbUJBSkY7QUFLWnlCLElBQUFBLFlBQVksRUFBRWhCO0FBTEYsR0FmRTtBQXNCaEJtQixFQUFBQSxPQUFPLEVBQUU7QUFDUEwsSUFBQUEsVUFETyxzQkFDSXpELENBREosRUFDaUJnQixVQURqQixFQUNrQ2YsTUFEbEMsRUFDNkM7QUFBQSxVQUM1QzZDLE9BRDRDLEdBQ3VCOUIsVUFEdkIsQ0FDNUM4QixPQUQ0QztBQUFBLFVBQ25DaUIsWUFEbUMsR0FDdUIvQyxVQUR2QixDQUNuQytDLFlBRG1DO0FBQUEsa0NBQ3VCL0MsVUFEdkIsQ0FDckIrQixXQURxQjtBQUFBLFVBQ3JCQSxXQURxQixzQ0FDUCxFQURPO0FBQUEsa0NBQ3VCL0IsVUFEdkIsQ0FDSGdELGdCQURHO0FBQUEsVUFDSEEsZ0JBREcsc0NBQ2dCLEVBRGhCO0FBQUEsVUFFNUM3RCxHQUY0QyxHQUU1QkYsTUFGNEIsQ0FFNUNFLEdBRjRDO0FBQUEsVUFFdkNDLE1BRnVDLEdBRTVCSCxNQUY0QixDQUV2Q0csTUFGdUM7QUFBQSxVQUc1Q3lCLEtBSDRDLEdBR2xDYixVQUhrQyxDQUc1Q2EsS0FINEM7QUFJbEQsVUFBSTNCLEtBQUssR0FBR1EsUUFBUSxDQUFDVCxNQUFELEVBQVNlLFVBQVQsQ0FBcEI7O0FBQ0EsVUFBSStDLFlBQUosRUFBa0I7QUFDaEIsWUFBSUUsWUFBWSxHQUFHRCxnQkFBZ0IsQ0FBQ2xCLE9BQWpCLElBQTRCLFNBQS9DO0FBQ0EsWUFBSW9CLFVBQVUsR0FBR0YsZ0JBQWdCLENBQUNwRSxLQUFqQixJQUEwQixPQUEzQztBQUNBLGVBQU8sQ0FDTEksQ0FBQyxDQUFDLFVBQUQsRUFBYTtBQUNaRSxVQUFBQSxLQUFLLEVBQUxBLEtBRFk7QUFFWjJCLFVBQUFBLEtBQUssRUFBTEEsS0FGWTtBQUdaQyxVQUFBQSxLQUFLLEVBQUU7QUFDTHBDLFlBQUFBLEtBQUssRUFBRUgsb0JBQVFlLEdBQVIsQ0FBWUgsR0FBWixFQUFpQkMsTUFBTSxDQUFDRyxRQUF4QixDQURGO0FBRUx3QixZQUFBQSxRQUZLLG9CQUVJMUIsU0FGSixFQUVrQjtBQUNyQmQsa0NBQVF5QyxHQUFSLENBQVk3QixHQUFaLEVBQWlCQyxNQUFNLENBQUNHLFFBQXhCLEVBQWtDRixTQUFsQztBQUNEO0FBSkksV0FISztBQVNaZSxVQUFBQSxFQUFFLEVBQUVMLGFBQWEsQ0FBQ0MsVUFBRCxFQUFhZixNQUFiO0FBVEwsU0FBYixFQVVFVixvQkFBUThDLEdBQVIsQ0FBWTBCLFlBQVosRUFBMEIsVUFBQ0ksS0FBRCxFQUFhQyxNQUFiLEVBQStCO0FBQzFELGlCQUFPcEUsQ0FBQyxDQUFDLG9CQUFELEVBQXVCO0FBQzdCb0QsWUFBQUEsR0FBRyxFQUFFZ0I7QUFEd0IsV0FBdkIsRUFFTCxDQUNEcEUsQ0FBQyxDQUFDLE1BQUQsRUFBUztBQUNScUUsWUFBQUEsSUFBSSxFQUFFO0FBREUsV0FBVCxFQUVFRixLQUFLLENBQUNELFVBQUQsQ0FGUCxDQURBLEVBSUR2QyxNQUpDLENBS0RrQixhQUFhLENBQUM3QyxDQUFELEVBQUltRSxLQUFLLENBQUNGLFlBQUQsQ0FBVCxFQUF5QmxCLFdBQXpCLENBTFosQ0FGSyxDQUFSO0FBU0QsU0FWRSxDQVZGLENBREksQ0FBUDtBQXVCRDs7QUFDRCxhQUFPLENBQ0wvQyxDQUFDLENBQUMsVUFBRCxFQUFhO0FBQ1pFLFFBQUFBLEtBQUssRUFBTEEsS0FEWTtBQUVaMkIsUUFBQUEsS0FBSyxFQUFMQSxLQUZZO0FBR1pDLFFBQUFBLEtBQUssRUFBRTtBQUNMcEMsVUFBQUEsS0FBSyxFQUFFSCxvQkFBUWUsR0FBUixDQUFZSCxHQUFaLEVBQWlCQyxNQUFNLENBQUNHLFFBQXhCLENBREY7QUFFTHdCLFVBQUFBLFFBRkssb0JBRUkxQixTQUZKLEVBRWtCO0FBQ3JCZCxnQ0FBUXlDLEdBQVIsQ0FBWTdCLEdBQVosRUFBaUJDLE1BQU0sQ0FBQ0csUUFBeEIsRUFBa0NGLFNBQWxDO0FBQ0Q7QUFKSSxTQUhLO0FBU1plLFFBQUFBLEVBQUUsRUFBRUwsYUFBYSxDQUFDQyxVQUFELEVBQWFmLE1BQWI7QUFUTCxPQUFiLEVBVUU0QyxhQUFhLENBQUM3QyxDQUFELEVBQUk4QyxPQUFKLEVBQWFDLFdBQWIsQ0FWZixDQURJLENBQVA7QUFhRCxLQTlDTTtBQStDUHVCLElBQUFBLFVBL0NPLHNCQStDSXRFLENBL0NKLEVBK0NpQmdCLFVBL0NqQixFQStDa0NmLE1BL0NsQyxFQStDNkM7QUFBQSxVQUM1QzZDLE9BRDRDLEdBQ21DOUIsVUFEbkMsQ0FDNUM4QixPQUQ0QztBQUFBLFVBQ25DaUIsWUFEbUMsR0FDbUMvQyxVQURuQyxDQUNuQytDLFlBRG1DO0FBQUEsOEJBQ21DL0MsVUFEbkMsQ0FDckJkLEtBRHFCO0FBQUEsVUFDckJBLEtBRHFCLGtDQUNiLEVBRGE7QUFBQSxtQ0FDbUNjLFVBRG5DLENBQ1QrQixXQURTO0FBQUEsVUFDVEEsV0FEUyx1Q0FDSyxFQURMO0FBQUEsbUNBQ21DL0IsVUFEbkMsQ0FDU2dELGdCQURUO0FBQUEsVUFDU0EsZ0JBRFQsdUNBQzRCLEVBRDVCO0FBQUEsVUFFNUM3RCxHQUY0QyxHQUU1QkYsTUFGNEIsQ0FFNUNFLEdBRjRDO0FBQUEsVUFFdkNDLE1BRnVDLEdBRTVCSCxNQUY0QixDQUV2Q0csTUFGdUM7QUFHbEQsVUFBSTRDLFNBQVMsR0FBR0QsV0FBVyxDQUFDbkQsS0FBWixJQUFxQixPQUFyQztBQUNBLFVBQUlxRCxTQUFTLEdBQUdGLFdBQVcsQ0FBQ3JELEtBQVosSUFBcUIsT0FBckM7QUFDQSxVQUFJdUUsWUFBWSxHQUFHRCxnQkFBZ0IsQ0FBQ2xCLE9BQWpCLElBQTRCLFNBQS9DOztBQUNBLFVBQUl6QyxTQUFTLEdBQUdkLG9CQUFRZSxHQUFSLENBQVlILEdBQVosRUFBaUJDLE1BQU0sQ0FBQ0csUUFBeEIsQ0FBaEI7O0FBQ0EsVUFBSSxFQUFFRixTQUFTLEtBQUssSUFBZCxJQUFzQkEsU0FBUyxLQUFLa0UsU0FBcEMsSUFBaURsRSxTQUFTLEtBQUssRUFBakUsQ0FBSixFQUEwRTtBQUN4RSxlQUFPSSxRQUFRLENBQUNULENBQUQsRUFBSVQsb0JBQVE4QyxHQUFSLENBQVluQyxLQUFLLENBQUNzRSxJQUFOLEtBQWUsVUFBZixHQUE0Qm5FLFNBQTVCLEdBQXdDLENBQUNBLFNBQUQsQ0FBcEQsRUFBaUUwRCxZQUFZLEdBQUcsVUFBQ3JFLEtBQUQsRUFBZTtBQUNoSCxjQUFJK0UsVUFBSjs7QUFDQSxlQUFLLElBQUl4RixLQUFLLEdBQUcsQ0FBakIsRUFBb0JBLEtBQUssR0FBRzhFLFlBQVksQ0FBQ3pFLE1BQXpDLEVBQWlETCxLQUFLLEVBQXRELEVBQTBEO0FBQ3hEd0YsWUFBQUEsVUFBVSxHQUFHbEYsb0JBQVFtRixJQUFSLENBQWFYLFlBQVksQ0FBQzlFLEtBQUQsQ0FBWixDQUFvQmdGLFlBQXBCLENBQWIsRUFBZ0QsVUFBQ3hFLElBQUQ7QUFBQSxxQkFBZUEsSUFBSSxDQUFDd0QsU0FBRCxDQUFKLEtBQW9CdkQsS0FBbkM7QUFBQSxhQUFoRCxDQUFiOztBQUNBLGdCQUFJK0UsVUFBSixFQUFnQjtBQUNkO0FBQ0Q7QUFDRjs7QUFDRCxpQkFBT0EsVUFBVSxHQUFHQSxVQUFVLENBQUN6QixTQUFELENBQWIsR0FBMkIsSUFBNUM7QUFDRCxTQVQrRixHQVM1RixVQUFDdEQsS0FBRCxFQUFlO0FBQ2pCLGNBQUkrRSxVQUFVLEdBQUdsRixvQkFBUW1GLElBQVIsQ0FBYTVCLE9BQWIsRUFBc0IsVUFBQ3JELElBQUQ7QUFBQSxtQkFBZUEsSUFBSSxDQUFDd0QsU0FBRCxDQUFKLEtBQW9CdkQsS0FBbkM7QUFBQSxXQUF0QixDQUFqQjs7QUFDQSxpQkFBTytFLFVBQVUsR0FBR0EsVUFBVSxDQUFDekIsU0FBRCxDQUFiLEdBQTJCLElBQTVDO0FBQ0QsU0Faa0IsRUFZaEIyQixJQVpnQixDQVlYLEdBWlcsQ0FBSixDQUFmO0FBYUQ7O0FBQ0QsYUFBT2xFLFFBQVEsQ0FBQ1QsQ0FBRCxFQUFJLEVBQUosQ0FBZjtBQUNELEtBdEVNO0FBdUVQMEQsSUFBQUEsWUF2RU8sd0JBdUVNMUQsQ0F2RU4sRUF1RW1CZ0IsVUF2RW5CLEVBdUVvQ2YsTUF2RXBDLEVBdUVpRGtDLE9BdkVqRCxFQXVFNkQ7QUFBQSxVQUM1RFcsT0FENEQsR0FDTzlCLFVBRFAsQ0FDNUQ4QixPQUQ0RDtBQUFBLFVBQ25EaUIsWUFEbUQsR0FDTy9DLFVBRFAsQ0FDbkQrQyxZQURtRDtBQUFBLG1DQUNPL0MsVUFEUCxDQUNyQytCLFdBRHFDO0FBQUEsVUFDckNBLFdBRHFDLHVDQUN2QixFQUR1QjtBQUFBLG1DQUNPL0IsVUFEUCxDQUNuQmdELGdCQURtQjtBQUFBLFVBQ25CQSxnQkFEbUIsdUNBQ0EsRUFEQTtBQUFBLFVBRTVENUQsTUFGNEQsR0FFakRILE1BRmlELENBRTVERyxNQUY0RDtBQUFBLFVBRzVEeUIsS0FINEQsR0FHMUNiLFVBSDBDLENBRzVEYSxLQUg0RDtBQUFBLFVBR3JEWCxNQUhxRCxHQUcxQ0YsVUFIMEMsQ0FHckRFLE1BSHFEO0FBSWxFLFVBQUloQixLQUFLLEdBQUdRLFFBQVEsQ0FBQ1QsTUFBRCxFQUFTZSxVQUFULENBQXBCO0FBQ0EsVUFBSUcsSUFBSSxHQUFHLFFBQVg7O0FBQ0EsVUFBSTRDLFlBQUosRUFBa0I7QUFDaEIsWUFBSUUsWUFBWSxHQUFHRCxnQkFBZ0IsQ0FBQ2xCLE9BQWpCLElBQTRCLFNBQS9DO0FBQ0EsWUFBSW9CLFVBQVUsR0FBR0YsZ0JBQWdCLENBQUNwRSxLQUFqQixJQUEwQixPQUEzQztBQUNBLGVBQU9RLE1BQU0sQ0FBQ2dDLE9BQVAsQ0FBZUMsR0FBZixDQUFtQixVQUFDNUMsSUFBRCxFQUFjO0FBQ3RDLGlCQUFPTyxDQUFDLENBQUMsVUFBRCxFQUFhO0FBQ25CRSxZQUFBQSxLQUFLLEVBQUxBLEtBRG1CO0FBRW5CMkIsWUFBQUEsS0FBSyxFQUFMQSxLQUZtQjtBQUduQkMsWUFBQUEsS0FBSyxFQUFFO0FBQ0xwQyxjQUFBQSxLQUFLLEVBQUVELElBQUksQ0FBQzZDLElBRFA7QUFFTFAsY0FBQUEsUUFGSyxvQkFFSVEsV0FGSixFQUVvQjtBQUN2QjlDLGdCQUFBQSxJQUFJLENBQUM2QyxJQUFMLEdBQVlDLFdBQVo7QUFDRDtBQUpJLGFBSFk7QUFTbkJuQixZQUFBQSxFQUFFLEVBQUVhLGVBQWUscUJBQ2hCZCxJQURnQixZQUNWekIsS0FEVSxFQUNBO0FBQ2Y4QyxjQUFBQSxtQkFBbUIsQ0FBQ0wsT0FBRCxFQUFVL0IsTUFBVixFQUFrQlYsS0FBSyxJQUFJQSxLQUFLLENBQUNKLE1BQU4sR0FBZSxDQUExQyxFQUE2Q0csSUFBN0MsQ0FBbkI7O0FBQ0Esa0JBQUl5QixNQUFNLElBQUlBLE1BQU0sQ0FBQ0MsSUFBRCxDQUFwQixFQUE0QjtBQUMxQkQsZ0JBQUFBLE1BQU0sQ0FBQ0MsSUFBRCxDQUFOLENBQWFsQixNQUFiLEVBQXFCUCxLQUFyQjtBQUNEO0FBQ0YsYUFOZ0IsR0FPaEJzQixVQVBnQixFQU9KZixNQVBJO0FBVEEsV0FBYixFQWlCTFYsb0JBQVE4QyxHQUFSLENBQVkwQixZQUFaLEVBQTBCLFVBQUNJLEtBQUQsRUFBYUMsTUFBYixFQUErQjtBQUMxRCxtQkFBT3BFLENBQUMsQ0FBQyxvQkFBRCxFQUF1QjtBQUM3Qm9ELGNBQUFBLEdBQUcsRUFBRWdCO0FBRHdCLGFBQXZCLEVBRUwsQ0FDRHBFLENBQUMsQ0FBQyxNQUFELEVBQVM7QUFDUnFFLGNBQUFBLElBQUksRUFBRTtBQURFLGFBQVQsRUFFRUYsS0FBSyxDQUFDRCxVQUFELENBRlAsQ0FEQSxFQUlEdkMsTUFKQyxDQUtEa0IsYUFBYSxDQUFDN0MsQ0FBRCxFQUFJbUUsS0FBSyxDQUFDRixZQUFELENBQVQsRUFBeUJsQixXQUF6QixDQUxaLENBRkssQ0FBUjtBQVNELFdBVkUsQ0FqQkssQ0FBUjtBQTRCRCxTQTdCTSxDQUFQO0FBOEJEOztBQUNELGFBQU8zQyxNQUFNLENBQUNnQyxPQUFQLENBQWVDLEdBQWYsQ0FBbUIsVUFBQzVDLElBQUQsRUFBYztBQUN0QyxlQUFPTyxDQUFDLENBQUMsVUFBRCxFQUFhO0FBQ25CRSxVQUFBQSxLQUFLLEVBQUxBLEtBRG1CO0FBRW5CMkIsVUFBQUEsS0FBSyxFQUFMQSxLQUZtQjtBQUduQkMsVUFBQUEsS0FBSyxFQUFFO0FBQ0xwQyxZQUFBQSxLQUFLLEVBQUVELElBQUksQ0FBQzZDLElBRFA7QUFFTFAsWUFBQUEsUUFGSyxvQkFFSVEsV0FGSixFQUVvQjtBQUN2QjlDLGNBQUFBLElBQUksQ0FBQzZDLElBQUwsR0FBWUMsV0FBWjtBQUNEO0FBSkksV0FIWTtBQVNuQm5CLFVBQUFBLEVBQUUsRUFBRWEsZUFBZSxDQUFDO0FBQ2xCMkMsWUFBQUEsTUFEa0Isa0JBQ1hsRixLQURXLEVBQ0Q7QUFDZjhDLGNBQUFBLG1CQUFtQixDQUFDTCxPQUFELEVBQVUvQixNQUFWLEVBQWtCVixLQUFLLElBQUlBLEtBQUssQ0FBQ0osTUFBTixHQUFlLENBQTFDLEVBQTZDRyxJQUE3QyxDQUFuQjs7QUFDQSxrQkFBSXlCLE1BQU0sSUFBSUEsTUFBTSxDQUFDQyxJQUFELENBQXBCLEVBQTRCO0FBQzFCRCxnQkFBQUEsTUFBTSxDQUFDQyxJQUFELENBQU4sQ0FBYWxCLE1BQWIsRUFBcUJQLEtBQXJCO0FBQ0Q7QUFDRjtBQU5pQixXQUFELEVBT2hCc0IsVUFQZ0IsRUFPSmYsTUFQSTtBQVRBLFNBQWIsRUFpQkw0QyxhQUFhLENBQUM3QyxDQUFELEVBQUk4QyxPQUFKLEVBQWFDLFdBQWIsQ0FqQlIsQ0FBUjtBQWtCRCxPQW5CTSxDQUFQO0FBb0JELEtBbklNO0FBb0lQWSxJQUFBQSxZQXBJTywrQkFvSWtDO0FBQUEsVUFBMUJmLE1BQTBCLFNBQTFCQSxNQUEwQjtBQUFBLFVBQWxCekMsR0FBa0IsU0FBbEJBLEdBQWtCO0FBQUEsVUFBYkMsTUFBYSxTQUFiQSxNQUFhO0FBQUEsVUFDakNrQyxJQURpQyxHQUN4Qk0sTUFEd0IsQ0FDakNOLElBRGlDO0FBQUEsVUFFakMvQixRQUZpQyxHQUVNSCxNQUZOLENBRWpDRyxRQUZpQztBQUFBLFVBRVRTLFVBRlMsR0FFTVosTUFGTixDQUV2QnlFLFlBRnVCO0FBQUEsK0JBR2xCN0QsVUFIa0IsQ0FHakNkLEtBSGlDO0FBQUEsVUFHakNBLEtBSGlDLG1DQUd6QixFQUh5Qjs7QUFJdkMsVUFBSUcsU0FBUyxHQUFHZCxvQkFBUWUsR0FBUixDQUFZSCxHQUFaLEVBQWlCSSxRQUFqQixDQUFoQjs7QUFDQSxVQUFJTCxLQUFLLENBQUNzRSxJQUFOLEtBQWUsVUFBbkIsRUFBK0I7QUFDN0IsWUFBSWpGLG9CQUFRdUYsT0FBUixDQUFnQnpFLFNBQWhCLENBQUosRUFBZ0M7QUFDOUIsaUJBQU9kLG9CQUFRd0YsYUFBUixDQUFzQjFFLFNBQXRCLEVBQWlDaUMsSUFBakMsQ0FBUDtBQUNEOztBQUNELGVBQU9BLElBQUksQ0FBQzBDLE9BQUwsQ0FBYTNFLFNBQWIsSUFBMEIsQ0FBQyxDQUFsQztBQUNEO0FBQ0Q7OztBQUNBLGFBQU9BLFNBQVMsSUFBSWlDLElBQXBCO0FBQ0Q7QUFqSk0sR0F0Qk87QUF5S2hCMkMsRUFBQUEsU0FBUyxFQUFFO0FBQ1R4QixJQUFBQSxVQUFVLEVBQUU3QixpQkFESDtBQUVUMEMsSUFBQUEsVUFGUyxzQkFFRXRFLENBRkYsU0FFb0NDLE1BRnBDLEVBRStDO0FBQUEsOEJBQTlCQyxLQUE4QjtBQUFBLFVBQTlCQSxLQUE4Qiw0QkFBdEIsRUFBc0I7QUFBQSxVQUNoREMsR0FEZ0QsR0FDaENGLE1BRGdDLENBQ2hERSxHQURnRDtBQUFBLFVBQzNDQyxNQUQyQyxHQUNoQ0gsTUFEZ0MsQ0FDM0NHLE1BRDJDOztBQUV0RCxVQUFJQyxTQUFTLEdBQUdkLG9CQUFRZSxHQUFSLENBQVlILEdBQVosRUFBaUJDLE1BQU0sQ0FBQ0csUUFBeEIsQ0FBaEI7O0FBQ0EsVUFBSXBCLE1BQU0sR0FBR2tCLFNBQVMsSUFBSSxFQUExQjtBQUNBLFVBQUlqQixNQUFNLEdBQWUsRUFBekI7QUFDQUosTUFBQUEsaUJBQWlCLENBQUMsQ0FBRCxFQUFJa0IsS0FBSyxDQUFDNEMsT0FBVixFQUFtQjNELE1BQW5CLEVBQTJCQyxNQUEzQixDQUFqQjtBQUNBLGFBQU9xQixRQUFRLENBQUNULENBQUQsRUFBSSxDQUFDRSxLQUFLLENBQUNnRixhQUFOLEtBQXdCLEtBQXhCLEdBQWdDOUYsTUFBTSxDQUFDK0YsS0FBUCxDQUFhL0YsTUFBTSxDQUFDRSxNQUFQLEdBQWdCLENBQTdCLEVBQWdDRixNQUFNLENBQUNFLE1BQXZDLENBQWhDLEdBQWlGRixNQUFsRixFQUEwRnVGLElBQTFGLFlBQW1HekUsS0FBSyxDQUFDa0YsU0FBTixJQUFtQixHQUF0SCxPQUFKLENBQWY7QUFDRDtBQVRRLEdBektLO0FBb0xoQkMsRUFBQUEsV0FBVyxFQUFFO0FBQ1g1QixJQUFBQSxVQUFVLEVBQUU3QixpQkFERDtBQUVYMEMsSUFBQUEsVUFBVSxFQUFFeEUsZ0JBQWdCLENBQUMsWUFBRDtBQUZqQixHQXBMRztBQXdMaEJ3RixFQUFBQSxZQUFZLEVBQUU7QUFDWjdCLElBQUFBLFVBQVUsRUFBRTdCLGlCQURBO0FBRVowQyxJQUFBQSxVQUFVLEVBQUV4RSxnQkFBZ0IsQ0FBQyxTQUFEO0FBRmhCLEdBeExFO0FBNExoQnlGLEVBQUFBLFlBQVksRUFBRTtBQUNaOUIsSUFBQUEsVUFBVSxFQUFFN0IsaUJBREE7QUFFWjBDLElBQUFBLFVBRlksc0JBRUR0RSxDQUZDLFNBRWlDQyxNQUZqQyxFQUU0QztBQUFBLDhCQUE5QkMsS0FBOEI7QUFBQSxVQUE5QkEsS0FBOEIsNEJBQXRCLEVBQXNCO0FBQUEsVUFDaERDLEdBRGdELEdBQ2hDRixNQURnQyxDQUNoREUsR0FEZ0Q7QUFBQSxVQUMzQ0MsTUFEMkMsR0FDaENILE1BRGdDLENBQzNDRyxNQUQyQzs7QUFFdEQsVUFBSUMsU0FBUyxHQUFHZCxvQkFBUWUsR0FBUixDQUFZSCxHQUFaLEVBQWlCQyxNQUFNLENBQUNHLFFBQXhCLENBQWhCOztBQUNBLFVBQUlGLFNBQUosRUFBZTtBQUNiQSxRQUFBQSxTQUFTLEdBQUdkLG9CQUFROEMsR0FBUixDQUFZaEMsU0FBWixFQUF1QixVQUFDbUYsSUFBRDtBQUFBLGlCQUFlQSxJQUFJLENBQUNoRixNQUFMLENBQVlOLEtBQUssQ0FBQ00sTUFBTixJQUFnQixZQUE1QixDQUFmO0FBQUEsU0FBdkIsRUFBaUZtRSxJQUFqRixDQUFzRixLQUF0RixDQUFaO0FBQ0Q7O0FBQ0QsYUFBT2xFLFFBQVEsQ0FBQ1QsQ0FBRCxFQUFJSyxTQUFKLENBQWY7QUFDRDtBQVRXLEdBNUxFO0FBdU1oQm9GLEVBQUFBLFdBQVcsRUFBRTtBQUNYaEMsSUFBQUEsVUFBVSxFQUFFN0IsaUJBREQ7QUFFWDBDLElBQUFBLFVBQVUsRUFBRXhFLGdCQUFnQixDQUFDLFVBQUQ7QUFGakIsR0F2TUc7QUEyTWhCNEYsRUFBQUEsV0FBVyxFQUFFO0FBQ1hqQyxJQUFBQSxVQUFVLEVBQUU3QixpQkFERDtBQUVYMEMsSUFBQUEsVUFBVSxFQUFFeEUsZ0JBQWdCLENBQUMsVUFBRDtBQUZqQixHQTNNRztBQStNaEI2RixFQUFBQSxXQUFXLEVBQUU7QUFDWGxDLElBQUFBLFVBQVUsRUFBRTdCLGlCQUREO0FBRVgwQyxJQUFBQSxVQUZXLHNCQUVBdEUsQ0FGQSxTQUVrQ0MsTUFGbEMsRUFFNkM7QUFBQSw4QkFBOUJDLEtBQThCO0FBQUEsVUFBOUJBLEtBQThCLDRCQUF0QixFQUFzQjtBQUFBLFVBQ2hEQyxHQURnRCxHQUNoQ0YsTUFEZ0MsQ0FDaERFLEdBRGdEO0FBQUEsVUFDM0NDLE1BRDJDLEdBQ2hDSCxNQURnQyxDQUMzQ0csTUFEMkM7O0FBRXRELFVBQUlDLFNBQVMsR0FBR2Qsb0JBQVFlLEdBQVIsQ0FBWUgsR0FBWixFQUFpQkMsTUFBTSxDQUFDRyxRQUF4QixDQUFoQjs7QUFDQSxVQUFJRixTQUFTLEtBQUtILEtBQUssQ0FBQzBGLGFBQU4sSUFBdUIxRixLQUFLLENBQUMyRixRQUFsQyxDQUFiLEVBQTBEO0FBQ3hEeEYsUUFBQUEsU0FBUyxHQUFHQSxTQUFTLENBQUNzRSxJQUFWLENBQWUsR0FBZixDQUFaO0FBQ0Q7O0FBQ0QsYUFBT2xFLFFBQVEsQ0FBQ1QsQ0FBRCxFQUFJSyxTQUFKLENBQWY7QUFDRDtBQVRVLEdBL01HO0FBME5oQnlGLEVBQUFBLEtBQUssRUFBRTtBQUNMdEMsSUFBQUEsYUFBYSxFQUFFNUIsaUJBRFY7QUFFTDZCLElBQUFBLFVBQVUsRUFBRTdCLGlCQUZQO0FBR0w4QixJQUFBQSxZQUFZLEVBQUV4QixtQkFIVDtBQUlMeUIsSUFBQUEsWUFBWSxFQUFFaEI7QUFKVCxHQTFOUztBQWdPaEJvRCxFQUFBQSxPQUFPLEVBQUU7QUFDUHZDLElBQUFBLGFBQWEsRUFBRTVCLGlCQURSO0FBRVA2QixJQUFBQSxVQUFVLEVBQUU3QixpQkFGTDtBQUdQOEIsSUFBQUEsWUFBWSxFQUFFeEIsbUJBSFA7QUFJUHlCLElBQUFBLFlBQVksRUFBRWhCO0FBSlA7QUFoT08sQ0FBbEI7QUF3T0E7Ozs7QUFHQSxTQUFTcUQsZ0JBQVQsQ0FBMEIvRixNQUExQixFQUF1Q29CLElBQXZDLEVBQWtEYyxPQUFsRCxFQUE4RDtBQUFBLE1BQ3REOEQsa0JBRHNELEdBQy9COUQsT0FEK0IsQ0FDdEQ4RCxrQkFEc0Q7QUFFNUQsTUFBSUMsUUFBUSxHQUFHQyxRQUFRLENBQUNDLElBQXhCOztBQUNBLE9BQ0U7QUFDQUgsRUFBQUEsa0JBQWtCLENBQUM1RSxJQUFELEVBQU82RSxRQUFQLEVBQWlCLHFCQUFqQixDQUFsQixDQUEwREcsSUFBMUQsSUFDQTtBQUNBSixFQUFBQSxrQkFBa0IsQ0FBQzVFLElBQUQsRUFBTzZFLFFBQVAsRUFBaUIsb0JBQWpCLENBQWxCLENBQXlERyxJQUZ6RCxJQUdBO0FBQ0FKLEVBQUFBLGtCQUFrQixDQUFDNUUsSUFBRCxFQUFPNkUsUUFBUCxFQUFpQiwrQkFBakIsQ0FBbEIsQ0FBb0VHLElBSnBFLElBS0E7QUFDQUosRUFBQUEsa0JBQWtCLENBQUM1RSxJQUFELEVBQU82RSxRQUFQLEVBQWlCLHVCQUFqQixDQUFsQixDQUE0REcsSUFSOUQsRUFTRTtBQUNBLFdBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFFRDs7Ozs7QUFHTyxJQUFNQyxrQkFBa0IsR0FBRztBQUNoQ0MsRUFBQUEsT0FEZ0MsbUJBQ3hCQyxNQUR3QixFQUNEO0FBQUEsUUFDdkJDLFdBRHVCLEdBQ0dELE1BREgsQ0FDdkJDLFdBRHVCO0FBQUEsUUFDVkMsUUFEVSxHQUNHRixNQURILENBQ1ZFLFFBRFU7QUFFN0JBLElBQUFBLFFBQVEsQ0FBQ0MsS0FBVCxDQUFldEQsU0FBZjtBQUNBb0QsSUFBQUEsV0FBVyxDQUFDRyxHQUFaLENBQWdCLG1CQUFoQixFQUFxQ1osZ0JBQXJDO0FBQ0FTLElBQUFBLFdBQVcsQ0FBQ0csR0FBWixDQUFnQixvQkFBaEIsRUFBc0NaLGdCQUF0QztBQUNEO0FBTitCLENBQTNCOzs7QUFTUCxJQUFJLE9BQU9hLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE1BQU0sQ0FBQ0MsUUFBNUMsRUFBc0Q7QUFDcERELEVBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JULGtCQUFwQjtBQUNEOztBQUVELFNBQVNVLGNBQVQsQ0FBd0IzRyxTQUF4QixFQUF3Q0csTUFBeEMsRUFBc0Q7QUFDcEQsU0FBT0gsU0FBUyxHQUFHQSxTQUFTLENBQUNHLE1BQVYsQ0FBaUJBLE1BQWpCLENBQUgsR0FBOEIsRUFBOUM7QUFDRDs7QUFhRGpCLG9CQUFRb0gsS0FBUixDQUFjO0FBQ1pLLEVBQUFBLGNBQWMsRUFBZEE7QUFEWSxDQUFkOztlQUllVixrQiIsImZpbGUiOiJpbmRleC5jb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgWEVVdGlscyBmcm9tICd4ZS11dGlscy9tZXRob2RzL3hlLXV0aWxzJ1xyXG5pbXBvcnQgVlhFVGFibGUgZnJvbSAndnhlLXRhYmxlL2xpYi92eGUtdGFibGUnXHJcblxyXG5mdW5jdGlvbiBtYXRjaENhc2NhZGVyRGF0YShpbmRleDogbnVtYmVyLCBsaXN0OiBBcnJheTxhbnk+LCB2YWx1ZXM6IEFycmF5PGFueT4sIGxhYmVsczogQXJyYXk8YW55Pikge1xyXG4gIGxldCB2YWwgPSB2YWx1ZXNbaW5kZXhdXHJcbiAgaWYgKGxpc3QgJiYgdmFsdWVzLmxlbmd0aCA+IGluZGV4KSB7XHJcbiAgICBYRVV0aWxzLmVhY2gobGlzdCwgKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS52YWx1ZSA9PT0gdmFsKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goaXRlbS5sYWJlbClcclxuICAgICAgICBtYXRjaENhc2NhZGVyRGF0YSgrK2luZGV4LCBpdGVtLmNoaWxkcmVuLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdERhdGVQaWNrZXIoZGVmYXVsdEZvcm1hdDogYW55KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBGdW5jdGlvbiwgeyBwcm9wcyA9IHt9IH06IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgIGlmIChjZWxsVmFsdWUpIHtcclxuICAgICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgZGVmYXVsdEZvcm1hdClcclxuICAgIH1cclxuICAgIHJldHVybiBjZWxsVGV4dChoLCBjZWxsVmFsdWUpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQcm9wcyh7ICR0YWJsZSB9OiBhbnksIHsgcHJvcHMgfTogYW55KSB7XHJcbiAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKCR0YWJsZS52U2l6ZSA/IHsgc2l6ZTogJHRhYmxlLnZTaXplIH0gOiB7fSwgcHJvcHMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENlbGxFdmVudHMocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IG5hbWUsIGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7ICR0YWJsZSB9ID0gcGFyYW1zXHJcbiAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gIHN3aXRjaCAobmFtZSkge1xyXG4gICAgY2FzZSAnQUF1dG9Db21wbGV0ZSc6XHJcbiAgICAgIHR5cGUgPSAnc2VsZWN0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgdHlwZSA9ICdpbnB1dCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dE51bWJlcic6XHJcbiAgICAgIHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICBicmVha1xyXG4gIH1cclxuICBsZXQgb24gPSB7XHJcbiAgICBbdHlwZV06IChldm50OiBhbnkpID0+IHtcclxuICAgICAgJHRhYmxlLnVwZGF0ZVN0YXR1cyhwYXJhbXMpXHJcbiAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgZXZlbnRzW3R5cGVdKHBhcmFtcywgZXZudClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuICBpZiAoZXZlbnRzKSB7XHJcbiAgICByZXR1cm4gWEVVdGlscy5hc3NpZ24oe30sIFhFVXRpbHMub2JqZWN0TWFwKGV2ZW50cywgKGNiOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGNiLmFwcGx5KG51bGwsIFtwYXJhbXNdLmNvbmNhdC5hcHBseShwYXJhbXMsIGFyZ3MpKVxyXG4gICAgfSksIG9uKVxyXG4gIH1cclxuICByZXR1cm4gb25cclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEVkaXRSZW5kZXIoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgcmV0dXJuIFtcclxuICAgIGgocmVuZGVyT3B0cy5uYW1lLCB7XHJcbiAgICAgIHByb3BzLFxyXG4gICAgICBhdHRycyxcclxuICAgICAgbW9kZWw6IHtcclxuICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgIGNhbGxiYWNrKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCB2YWx1ZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgIH0pXHJcbiAgXVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGaWx0ZXJFdmVudHMob246IGFueSwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gIGlmIChldmVudHMpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLmFzc2lnbih7fSwgWEVVdGlscy5vYmplY3RNYXAoZXZlbnRzLCAoY2I6IEZ1bmN0aW9uKSA9PiBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgY2IuYXBwbHkobnVsbCwgW3BhcmFtc10uY29uY2F0LmFwcGx5KHBhcmFtcywgYXJncykpXHJcbiAgICB9KSwgb24pXHJcbiAgfVxyXG4gIHJldHVybiBvblxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyUmVuZGVyKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICBsZXQgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCB7IG5hbWUsIGF0dHJzLCBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gIHN3aXRjaCAobmFtZSkge1xyXG4gICAgY2FzZSAnQUF1dG9Db21wbGV0ZSc6XHJcbiAgICAgIHR5cGUgPSAnc2VsZWN0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgdHlwZSA9ICdpbnB1dCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dE51bWJlcic6XHJcbiAgICAgIHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgcHJvcHMsXHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBtb2RlbDoge1xyXG4gICAgICAgIHZhbHVlOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgY2FsbGJhY2sob3B0aW9uVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgaXRlbS5kYXRhID0gb3B0aW9uVmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIG9uOiBnZXRGaWx0ZXJFdmVudHMoe1xyXG4gICAgICAgIFt0eXBlXShldm50OiBhbnkpIHtcclxuICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dCwgY29sdW1uLCAhIWl0ZW0uZGF0YSwgaXRlbSlcclxuICAgICAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgICAgIGV2ZW50c1t0eXBlXShwYXJhbXMsIGV2bnQpXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICB9KVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dDogYW55LCBjb2x1bW46IGFueSwgY2hlY2tlZDogYW55LCBpdGVtOiBhbnkpIHtcclxuICBjb250ZXh0W2NvbHVtbi5maWx0ZXJNdWx0aXBsZSA/ICdjaGFuZ2VNdWx0aXBsZU9wdGlvbicgOiAnY2hhbmdlUmFkaW9PcHRpb24nXSh7fSwgY2hlY2tlZCwgaXRlbSlcclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEZpbHRlck1ldGhvZCh7IG9wdGlvbiwgcm93LCBjb2x1bW4gfTogYW55KSB7XHJcbiAgbGV0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPT09IGRhdGFcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyT3B0aW9ucyhoOiBGdW5jdGlvbiwgb3B0aW9uczogYW55LCBvcHRpb25Qcm9wczogYW55KSB7XHJcbiAgbGV0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICBsZXQgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gIGxldCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgcmV0dXJuIFhFVXRpbHMubWFwKG9wdGlvbnMsIChpdGVtOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHRpb24nLCB7XHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgdmFsdWU6IGl0ZW1bdmFsdWVQcm9wXSxcclxuICAgICAgICBkaXNhYmxlZDogaXRlbVtkaXNhYmxlZFByb3BdXHJcbiAgICAgIH0sXHJcbiAgICAgIGtleTogaW5kZXhcclxuICAgIH0sIGl0ZW1bbGFiZWxQcm9wXSlcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBjZWxsVGV4dChoOiBGdW5jdGlvbiwgY2VsbFZhbHVlOiBhbnkpIHtcclxuICByZXR1cm4gWycnICsgKGNlbGxWYWx1ZSA9PT0gbnVsbCB8fCBjZWxsVmFsdWUgPT09IHZvaWQgMCA/ICcnIDogY2VsbFZhbHVlKV1cclxufVxyXG5cclxuLyoqXHJcbiAqIOa4suafk+WHveaVsFxyXG4gKi9cclxuY29uc3QgcmVuZGVyTWFwID0ge1xyXG4gIEFBdXRvQ29tcGxldGU6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBkZWZhdWx0RmlsdGVyUmVuZGVyLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kXHJcbiAgfSxcclxuICBBSW5wdXQ6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBkZWZhdWx0RmlsdGVyUmVuZGVyLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kXHJcbiAgfSxcclxuICBBSW5wdXROdW1iZXI6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dC1udW1iZXItaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckZpbHRlcjogZGVmYXVsdEZpbHRlclJlbmRlcixcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZFxyXG4gIH0sXHJcbiAgQVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGxldCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgbGV0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBYRVV0aWxzLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXA6IGFueSwgZ0luZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSksXHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIGNlbGxWYWx1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHJlbmRlckNlbGwoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBwcm9wcyA9IHt9LCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICBsZXQgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gICAgICBsZXQgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICAgIGlmICghKGNlbGxWYWx1ZSA9PT0gbnVsbCB8fCBjZWxsVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBjZWxsVmFsdWUgPT09ICcnKSkge1xyXG4gICAgICAgIHJldHVybiBjZWxsVGV4dChoLCBYRVV0aWxzLm1hcChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnID8gY2VsbFZhbHVlIDogW2NlbGxWYWx1ZV0sIG9wdGlvbkdyb3VwcyA/ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgICAgICBsZXQgc2VsZWN0SXRlbVxyXG4gICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9wdGlvbkdyb3Vwcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25Hcm91cHNbaW5kZXhdW2dyb3VwT3B0aW9uc10sIChpdGVtOiBhbnkpID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RJdGVtKSB7XHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiBudWxsXHJcbiAgICAgICAgfSA6ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgICAgICBsZXQgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25zLCAoaXRlbTogYW55KSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiBudWxsXHJcbiAgICAgICAgfSkuam9pbignOycpKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCAnJylcclxuICAgIH0sXHJcbiAgICByZW5kZXJGaWx0ZXIoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gICAgICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgeyBhdHRycywgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgICAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBsZXQgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICAgICAgICBjYWxsYmFjayhvcHRpb25WYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmRhdGEgPSBvcHRpb25WYWx1ZVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb246IGdldEZpbHRlckV2ZW50cyh7XHJcbiAgICAgICAgICAgICAgW3R5cGVdKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dCwgY29sdW1uLCB2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwLCBpdGVtKVxyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICAgICAgICAgICAgZXZlbnRzW3R5cGVdKHBhcmFtcywgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgICB9LCBYRVV0aWxzLm1hcChvcHRpb25Hcm91cHMsIChncm91cDogYW55LCBnSW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgIGtleTogZ0luZGV4XHJcbiAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xyXG4gICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxyXG4gICAgICAgICAgICApKVxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICAgICAgY2FsbGJhY2sob3B0aW9uVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIGl0ZW0uZGF0YSA9IG9wdGlvblZhbHVlXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBvbjogZ2V0RmlsdGVyRXZlbnRzKHtcclxuICAgICAgICAgICAgY2hhbmdlKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKGNvbnRleHQsIGNvbHVtbiwgdmFsdWUgJiYgdmFsdWUubGVuZ3RoID4gMCwgaXRlbSlcclxuICAgICAgICAgICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgICAgICAgICAgZXZlbnRzW3R5cGVdKHBhcmFtcywgdmFsdWUpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyTWV0aG9kKHsgb3B0aW9uLCByb3csIGNvbHVtbiB9OiBhbnkpIHtcclxuICAgICAgbGV0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgICAgIGxldCB7IHByb3BlcnR5LCBmaWx0ZXJSZW5kZXI6IHJlbmRlck9wdHMgfSA9IGNvbHVtblxyXG4gICAgICBsZXQgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIHByb3BlcnR5KVxyXG4gICAgICBpZiAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJykge1xyXG4gICAgICAgIGlmIChYRVV0aWxzLmlzQXJyYXkoY2VsbFZhbHVlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIFhFVXRpbHMuaW5jbHVkZUFycmF5cyhjZWxsVmFsdWUsIGRhdGEpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhLmluZGV4T2YoY2VsbFZhbHVlKSA+IC0xXHJcbiAgICAgIH1cclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgICAgIHJldHVybiBjZWxsVmFsdWUgPT0gZGF0YVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgQUNhc2NhZGVyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckNlbGwoaDogRnVuY3Rpb24sIHsgcHJvcHMgPSB7fSB9OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICB2YXIgdmFsdWVzID0gY2VsbFZhbHVlIHx8IFtdXHJcbiAgICAgIHZhciBsYWJlbHM6IEFycmF5PGFueT4gPSBbXVxyXG4gICAgICBtYXRjaENhc2NhZGVyRGF0YSgwLCBwcm9wcy5vcHRpb25zLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIChwcm9wcy5zaG93QWxsTGV2ZWxzID09PSBmYWxzZSA/IGxhYmVscy5zbGljZShsYWJlbHMubGVuZ3RoIC0gMSwgbGFiZWxzLmxlbmd0aCkgOiBsYWJlbHMpLmpvaW4oYCAke3Byb3BzLnNlcGFyYXRvciB8fCAnLyd9IGApKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgQURhdGVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTS1ERCcpXHJcbiAgfSxcclxuICBBTW9udGhQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTScpXHJcbiAgfSxcclxuICBBUmFuZ2VQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbChoOiBGdW5jdGlvbiwgeyBwcm9wcyA9IHt9IH06IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICAgIGlmIChjZWxsVmFsdWUpIHtcclxuICAgICAgICBjZWxsVmFsdWUgPSBYRVV0aWxzLm1hcChjZWxsVmFsdWUsIChkYXRlOiBhbnkpID0+IGRhdGUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCAnWVlZWS1NTS1ERCcpKS5qb2luKCcgfiAnKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBjZWxsVmFsdWUpXHJcbiAgICB9XHJcbiAgfSxcclxuICBBV2Vla1BpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLVdX5ZGoJylcclxuICB9LFxyXG4gIEFUaW1lUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ0hIOm1tOnNzJylcclxuICB9LFxyXG4gIEFUcmVlU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckNlbGwoaDogRnVuY3Rpb24sIHsgcHJvcHMgPSB7fSB9OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICBpZiAoY2VsbFZhbHVlICYmIChwcm9wcy50cmVlQ2hlY2thYmxlIHx8IHByb3BzLm11bHRpcGxlKSkge1xyXG4gICAgICAgIGNlbGxWYWx1ZSA9IGNlbGxWYWx1ZS5qb2luKCc7JylcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgY2VsbFZhbHVlKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgQVJhdGU6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJGaWx0ZXI6IGRlZmF1bHRGaWx0ZXJSZW5kZXIsXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuICB9LFxyXG4gIEFTd2l0Y2g6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJGaWx0ZXI6IGRlZmF1bHRGaWx0ZXJSZW5kZXIsXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDkuovku7blhbzlrrnmgKflpITnkIZcclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZUNsZWFyRXZlbnQocGFyYW1zOiBhbnksIGV2bnQ6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgbGV0IHsgZ2V0RXZlbnRUYXJnZXROb2RlIH0gPSBjb250ZXh0XHJcbiAgbGV0IGJvZHlFbGVtID0gZG9jdW1lbnQuYm9keVxyXG4gIGlmIChcclxuICAgIC8vIOS4i+aLieahhlxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LXNlbGVjdC1kcm9wZG93bicpLmZsYWcgfHxcclxuICAgIC8vIOe6p+iBlFxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhc2NhZGVyLW1lbnVzJykuZmxhZyB8fFxyXG4gICAgLy8g5pel5pyfXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FsZW5kYXItcGlja2VyLWNvbnRhaW5lcicpLmZsYWcgfHxcclxuICAgIC8vIOaXtumXtOmAieaLqVxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LXRpbWUtcGlja2VyLXBhbmVsJykuZmxhZ1xyXG4gICkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5Z+65LqOIHZ4ZS10YWJsZSDooajmoLznmoTpgILphY3mj5Lku7bvvIznlKjkuo7lhbzlrrkgYW50LWRlc2lnbi12dWUg57uE5Lu25bqTXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgVlhFVGFibGVQbHVnaW5BbnRkID0ge1xyXG4gIGluc3RhbGwoeHRhYmxlOiB0eXBlb2YgVlhFVGFibGUpIHtcclxuICAgIGxldCB7IGludGVyY2VwdG9yLCByZW5kZXJlciB9ID0geHRhYmxlXHJcbiAgICByZW5kZXJlci5taXhpbihyZW5kZXJNYXApXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyRmlsdGVyJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJBY3RpdmVkJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICB9XHJcbn1cclxuXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVlhFVGFibGUpIHtcclxuICB3aW5kb3cuVlhFVGFibGUudXNlKFZYRVRhYmxlUGx1Z2luQW50ZClcclxufVxyXG5cclxuZnVuY3Rpb24gdG9Nb21lbnRTdHJpbmcoY2VsbFZhbHVlOiBhbnksIGZvcm1hdDogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gY2VsbFZhbHVlID8gY2VsbFZhbHVlLmZvcm1hdChmb3JtYXQpIDogJydcclxufVxyXG5cclxuZGVjbGFyZSBtb2R1bGUgJ3hlLXV0aWxzL21ldGhvZHMveGUtdXRpbHMnIHtcclxuICBpbnRlcmZhY2UgWEVVdGlsc01ldGhvZHMge1xyXG4gICAgLyoqXHJcbiAgICAgKiDlsIYgTW9tZW50IOaXpeacn+agvOW8j+WMluS4uuWtl+espuS4slxyXG4gICAgICogQHBhcmFtIGNlbGxWYWx1ZSDlgLxcclxuICAgICAqIEBwYXJhbSBmb3JtYXQg5qC85byP5YyWXHJcbiAgICAgKi9cclxuICAgIHRvTW9tZW50U3RyaW5nOiB0eXBlb2YgdG9Nb21lbnRTdHJpbmc7XHJcbiAgfVxyXG59XHJcblxyXG5YRVV0aWxzLm1peGluKHtcclxuICB0b01vbWVudFN0cmluZ1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5BbnRkXHJcbiJdfQ==
