"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.VXETablePluginAntd = void 0;

var _xeUtils = _interopRequireDefault(require("xe-utils/methods/xe-utils"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// import { VXETable } from 'vxe-table'
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

  var on = _defineProperty({}, type, function () {
    return $table.updateStatus(params);
  });

  if (events) {
    _xeUtils["default"].assign(on, _xeUtils["default"].objectMap(events, function (cb) {
      return function () {
        cb.apply(null, [params].concat.apply(params, arguments));
      };
    }));
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
    _xeUtils["default"].assign(on, _xeUtils["default"].objectMap(events, function (cb) {
      return function () {
        cb.apply(null, [params].concat.apply(params, arguments));
      };
    }));
  }

  return on;
}

function defaultFilterRender(h, renderOpts, params, context) {
  var column = params.column;
  var name = renderOpts.name,
      attrs = renderOpts.attrs;
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
      on: getFilterEvents(_defineProperty({}, type, function () {
        handleConfirmFilter(context, column, !!item.data, item);
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
  return _xeUtils["default"].map(options, function (item, index) {
    return h('a-select-option', {
      props: {
        value: item[valueProp]
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
      var attrs = renderOpts.attrs;
      var props = getProps(params, renderOpts);

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
            on: getFilterEvents({
              change: function change(value) {
                handleConfirmFilter(context, column, value && value.length > 0, item);
              }
            }, renderOpts, params)
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
    interceptor.add('event.clear_filter', handleClearEvent);
    interceptor.add('event.clear_actived', handleClearEvent);
  }
};
exports.VXETablePluginAntd = VXETablePluginAntd;

if (typeof window !== 'undefined' && window.VXETable) {
  window.VXETable.use(VXETablePluginAntd);
}

_xeUtils["default"].mixin({
  toMomentString: function toMomentString(cellValue, format) {
    return cellValue ? cellValue.format(format) : '';
  }
});

var _default = VXETablePluginAntd;
exports["default"] = _default;
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiWEVVdGlscyIsImVhY2giLCJpdGVtIiwidmFsdWUiLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsInBhcmFtcyIsInByb3BzIiwicm93IiwiY29sdW1uIiwiY2VsbFZhbHVlIiwiZ2V0IiwicHJvcGVydHkiLCJmb3JtYXQiLCJjZWxsVGV4dCIsImdldFByb3BzIiwiJHRhYmxlIiwiYXNzaWduIiwidlNpemUiLCJzaXplIiwiZ2V0Q2VsbEV2ZW50cyIsInJlbmRlck9wdHMiLCJuYW1lIiwiZXZlbnRzIiwidHlwZSIsIm9uIiwidXBkYXRlU3RhdHVzIiwib2JqZWN0TWFwIiwiY2IiLCJhcHBseSIsImNvbmNhdCIsImFyZ3VtZW50cyIsImRlZmF1bHRFZGl0UmVuZGVyIiwiYXR0cnMiLCJtb2RlbCIsImNhbGxiYWNrIiwic2V0IiwiZ2V0RmlsdGVyRXZlbnRzIiwiZGVmYXVsdEZpbHRlclJlbmRlciIsImNvbnRleHQiLCJmaWx0ZXJzIiwibWFwIiwiZGF0YSIsIm9wdGlvblZhbHVlIiwiaGFuZGxlQ29uZmlybUZpbHRlciIsImNoZWNrZWQiLCJmaWx0ZXJNdWx0aXBsZSIsImRlZmF1bHRGaWx0ZXJNZXRob2QiLCJvcHRpb24iLCJyZW5kZXJPcHRpb25zIiwib3B0aW9ucyIsIm9wdGlvblByb3BzIiwibGFiZWxQcm9wIiwidmFsdWVQcm9wIiwia2V5IiwicmVuZGVyTWFwIiwiQUF1dG9Db21wbGV0ZSIsImF1dG9mb2N1cyIsInJlbmRlckRlZmF1bHQiLCJyZW5kZXJFZGl0IiwicmVuZGVyRmlsdGVyIiwiZmlsdGVyTWV0aG9kIiwiQUlucHV0IiwiQUlucHV0TnVtYmVyIiwiQVNlbGVjdCIsIm9wdGlvbkdyb3VwcyIsIm9wdGlvbkdyb3VwUHJvcHMiLCJncm91cE9wdGlvbnMiLCJncm91cExhYmVsIiwiZ3JvdXAiLCJnSW5kZXgiLCJzbG90IiwicmVuZGVyQ2VsbCIsInVuZGVmaW5lZCIsIm1vZGUiLCJzZWxlY3RJdGVtIiwiZmluZCIsImpvaW4iLCJjaGFuZ2UiLCJmaWx0ZXJSZW5kZXIiLCJpc0FycmF5IiwiaW5jbHVkZUFycmF5cyIsImluZGV4T2YiLCJBQ2FzY2FkZXIiLCJzaG93QWxsTGV2ZWxzIiwic2xpY2UiLCJzZXBhcmF0b3IiLCJBRGF0ZVBpY2tlciIsIkFNb250aFBpY2tlciIsIkFSYW5nZVBpY2tlciIsImRhdGUiLCJBV2Vla1BpY2tlciIsIkFUaW1lUGlja2VyIiwiQVRyZWVTZWxlY3QiLCJ0cmVlQ2hlY2thYmxlIiwibXVsdGlwbGUiLCJBUmF0ZSIsIkFTd2l0Y2giLCJoYW5kbGVDbGVhckV2ZW50IiwiZXZudCIsImdldEV2ZW50VGFyZ2V0Tm9kZSIsImJvZHlFbGVtIiwiZG9jdW1lbnQiLCJib2R5IiwiZmxhZyIsIlZYRVRhYmxlUGx1Z2luQW50ZCIsImluc3RhbGwiLCJ4dGFibGUiLCJpbnRlcmNlcHRvciIsInJlbmRlcmVyIiwibWl4aW4iLCJhZGQiLCJ3aW5kb3ciLCJWWEVUYWJsZSIsInVzZSIsInRvTW9tZW50U3RyaW5nIl0sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBQUE7Ozs7OztBQUNBO0FBRUEsU0FBU0EsaUJBQVQsQ0FBNEJDLEtBQTVCLEVBQTJDQyxJQUEzQyxFQUE2REMsTUFBN0QsRUFBaUZDLE1BQWpGLEVBQW1HO0FBQ2pHLE1BQUlDLEdBQUcsR0FBR0YsTUFBTSxDQUFDRixLQUFELENBQWhCOztBQUNBLE1BQUlDLElBQUksSUFBSUMsTUFBTSxDQUFDRyxNQUFQLEdBQWdCTCxLQUE1QixFQUFtQztBQUNqQ00sd0JBQVFDLElBQVIsQ0FBYU4sSUFBYixFQUFtQixVQUFDTyxJQUFELEVBQWM7QUFDL0IsVUFBSUEsSUFBSSxDQUFDQyxLQUFMLEtBQWVMLEdBQW5CLEVBQXdCO0FBQ3RCRCxRQUFBQSxNQUFN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SixFQUFBQSxrQkFBa0IsQ0FBQ0QsSUFBRCxFQUFPRSxRQUFQLEVBQWlCLCtCQUFqQixDQUFsQixDQUFvRUcsSUFKcEUsSUFLQTtBQUNBSixFQUFBQSxrQkFBa0IsQ0FBQ0QsSUFBRCxFQUFPRSxRQUFQLEVBQWlCLHVCQUFqQixDQUFsQixDQUE0REcsSUFSOUQsRUFTRTtBQUNBLFdBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFFRDs7Ozs7QUFHTyxJQUFNQyxrQkFBa0IsR0FBRztBQUNoQ0MsRUFBQUEsT0FEZ0MsbUJBQ3ZCQyxNQUR1QixFQUNaO0FBQUEsUUFDWkMsV0FEWSxHQUNjRCxNQURkLENBQ1pDLFdBRFk7QUFBQSxRQUNDQyxRQURELEdBQ2NGLE1BRGQsQ0FDQ0UsUUFERDtBQUVsQkEsSUFBQUEsUUFBUSxDQUFDQyxLQUFULENBQWV2RCxTQUFmO0FBQ0FxRCxJQUFBQSxXQUFXLENBQUNHLEdBQVosQ0FBZ0Isb0JBQWhCLEVBQXNDYixnQkFBdEM7QUFDQVUsSUFBQUEsV0FBVyxDQUFDRyxHQUFaLENBQWdCLHFCQUFoQixFQUF1Q2IsZ0JBQXZDO0FBQ0Q7QUFOK0IsQ0FBM0I7OztBQWVQLElBQUksT0FBT2MsTUFBUCxLQUFrQixXQUFsQixJQUFpQ0EsTUFBTSxDQUFDQyxRQUE1QyxFQUFzRDtBQUNwREQsRUFBQUEsTUFBTSxDQUFDQyxRQUFQLENBQWdCQyxHQUFoQixDQUFvQlQsa0JBQXBCO0FBQ0Q7O0FBRUQ3RyxvQkFBUWtILEtBQVIsQ0FBYztBQUNaSyxFQUFBQSxjQURZLDBCQUNJekcsU0FESixFQUNvQkcsTUFEcEIsRUFDK0I7QUFDekMsV0FBT0gsU0FBUyxHQUFHQSxTQUFTLENBQUNHLE1BQVYsQ0FBaUJBLE1BQWpCLENBQUgsR0FBOEIsRUFBOUM7QUFDRDtBQUhXLENBQWQ7O2VBTWU0RixrQiIsImZpbGUiOiJpbmRleC5jb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgWEVVdGlscyBmcm9tICd4ZS11dGlscy9tZXRob2RzL3hlLXV0aWxzJ1xyXG4vLyBpbXBvcnQgeyBWWEVUYWJsZSB9IGZyb20gJ3Z4ZS10YWJsZSdcclxuXHJcbmZ1bmN0aW9uIG1hdGNoQ2FzY2FkZXJEYXRhIChpbmRleDogbnVtYmVyLCBsaXN0OiBBcnJheTxhbnk+LCB2YWx1ZXM6IEFycmF5PGFueT4sIGxhYmVsczogQXJyYXk8YW55Pikge1xyXG4gIGxldCB2YWwgPSB2YWx1ZXNbaW5kZXhdXHJcbiAgaWYgKGxpc3QgJiYgdmFsdWVzLmxlbmd0aCA+IGluZGV4KSB7XHJcbiAgICBYRVV0aWxzLmVhY2gobGlzdCwgKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS52YWx1ZSA9PT0gdmFsKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goaXRlbS5sYWJlbClcclxuICAgICAgICBtYXRjaENhc2NhZGVyRGF0YSgrK2luZGV4LCBpdGVtLmNoaWxkcmVuLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdERhdGVQaWNrZXIgKGRlZmF1bHRGb3JtYXQ6IGFueSkge1xyXG4gIHJldHVybiBmdW5jdGlvbiAoaDogRnVuY3Rpb24sIHsgcHJvcHMgPSB7fSB9OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICBpZiAoY2VsbFZhbHVlKSB7XHJcbiAgICAgIGNlbGxWYWx1ZSA9IGNlbGxWYWx1ZS5mb3JtYXQocHJvcHMuZm9ybWF0IHx8IGRlZmF1bHRGb3JtYXQpXHJcbiAgICB9XHJcbiAgICByZXR1cm4gY2VsbFRleHQoaCwgY2VsbFZhbHVlKVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0UHJvcHMgKHsgJHRhYmxlIH06IGFueSwgeyBwcm9wcyB9OiBhbnkpIHtcclxuICByZXR1cm4gWEVVdGlscy5hc3NpZ24oJHRhYmxlLnZTaXplID8geyBzaXplOiAkdGFibGUudlNpemUgfSA6IHt9LCBwcm9wcylcclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0Q2VsbEV2ZW50cyAocmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IG5hbWUsIGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCB7ICR0YWJsZSB9ID0gcGFyYW1zXHJcbiAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gIHN3aXRjaCAobmFtZSkge1xyXG4gICAgY2FzZSAnQUF1dG9Db21wbGV0ZSc6XHJcbiAgICAgIHR5cGUgPSAnc2VsZWN0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgdHlwZSA9ICdpbnB1dCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dE51bWJlcic6XHJcbiAgICAgIHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICBicmVha1xyXG4gIH1cclxuICBsZXQgb24gPSB7XHJcbiAgICBbdHlwZV06ICgpID0+ICR0YWJsZS51cGRhdGVTdGF0dXMocGFyYW1zKVxyXG4gIH1cclxuICBpZiAoZXZlbnRzKSB7XHJcbiAgICBYRVV0aWxzLmFzc2lnbihvbiwgWEVVdGlscy5vYmplY3RNYXAoZXZlbnRzLCAoY2I6IEZ1bmN0aW9uKSA9PiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNiLmFwcGx5KG51bGwsIFtwYXJhbXNdLmNvbmNhdC5hcHBseShwYXJhbXMsIGFyZ3VtZW50cykpXHJcbiAgICB9KSlcclxuICB9XHJcbiAgcmV0dXJuIG9uXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRFZGl0UmVuZGVyIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICByZXR1cm4gW1xyXG4gICAgaChyZW5kZXJPcHRzLm5hbWUsIHtcclxuICAgICAgcHJvcHMsXHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBtb2RlbDoge1xyXG4gICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSksXHJcbiAgICAgICAgY2FsbGJhY2sgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCB2YWx1ZSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgIH0pXHJcbiAgXVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRGaWx0ZXJFdmVudHMgKG9uOiBhbnksIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBpZiAoZXZlbnRzKSB7XHJcbiAgICBYRVV0aWxzLmFzc2lnbihvbiwgWEVVdGlscy5vYmplY3RNYXAoZXZlbnRzLCAoY2I6IEZ1bmN0aW9uKSA9PiBmdW5jdGlvbiAoKSB7XHJcbiAgICAgIGNiLmFwcGx5KG51bGwsIFtwYXJhbXNdLmNvbmNhdC5hcHBseShwYXJhbXMsIGFyZ3VtZW50cykpXHJcbiAgICB9KSlcclxuICB9XHJcbiAgcmV0dXJuIG9uXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXJSZW5kZXIgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICBsZXQgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCB7IG5hbWUsIGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgIGNhc2UgJ0FBdXRvQ29tcGxldGUnOlxyXG4gICAgICB0eXBlID0gJ3NlbGVjdCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dCc6XHJcbiAgICAgIHR5cGUgPSAnaW5wdXQnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXROdW1iZXInOlxyXG4gICAgICB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICByZXR1cm4gaChuYW1lLCB7XHJcbiAgICAgIHByb3BzLFxyXG4gICAgICBhdHRycyxcclxuICAgICAgbW9kZWw6IHtcclxuICAgICAgICB2YWx1ZTogaXRlbS5kYXRhLFxyXG4gICAgICAgIGNhbGxiYWNrIChvcHRpb25WYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICBpdGVtLmRhdGEgPSBvcHRpb25WYWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgb246IGdldEZpbHRlckV2ZW50cyh7XHJcbiAgICAgICAgW3R5cGVdICgpIHtcclxuICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dCwgY29sdW1uLCAhIWl0ZW0uZGF0YSwgaXRlbSlcclxuICAgICAgICB9XHJcbiAgICAgIH0sIHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgIH0pXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ29uZmlybUZpbHRlciAoY29udGV4dDogYW55LCBjb2x1bW46IGFueSwgY2hlY2tlZDogYW55LCBpdGVtOiBhbnkpIHtcclxuICBjb250ZXh0W2NvbHVtbi5maWx0ZXJNdWx0aXBsZSA/ICdjaGFuZ2VNdWx0aXBsZU9wdGlvbicgOiAnY2hhbmdlUmFkaW9PcHRpb24nXSh7fSwgY2hlY2tlZCwgaXRlbSlcclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEZpbHRlck1ldGhvZCAoeyBvcHRpb24sIHJvdywgY29sdW1uIH06IGFueSkge1xyXG4gIGxldCB7IGRhdGEgfSA9IG9wdGlvblxyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cclxuICByZXR1cm4gY2VsbFZhbHVlID09PSBkYXRhXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlck9wdGlvbnMgKGg6IEZ1bmN0aW9uLCBvcHRpb25zOiBhbnksIG9wdGlvblByb3BzOiBhbnkpIHtcclxuICBsZXQgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gIGxldCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgcmV0dXJuIFhFVXRpbHMubWFwKG9wdGlvbnMsIChpdGVtOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHRpb24nLCB7XHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgdmFsdWU6IGl0ZW1bdmFsdWVQcm9wXVxyXG4gICAgICB9LFxyXG4gICAgICBrZXk6IGluZGV4XHJcbiAgICB9LCBpdGVtW2xhYmVsUHJvcF0pXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2VsbFRleHQgKGg6IEZ1bmN0aW9uLCBjZWxsVmFsdWU6IGFueSkge1xyXG4gIHJldHVybiBbJycgKyAoY2VsbFZhbHVlID09PSBudWxsIHx8IGNlbGxWYWx1ZSA9PT0gdm9pZCAwID8gJycgOiBjZWxsVmFsdWUpXVxyXG59XHJcblxyXG4vKipcclxuICog5riy5p+T5Ye95pWwXHJcbiAqL1xyXG5jb25zdCByZW5kZXJNYXAgPSB7XHJcbiAgQUF1dG9Db21wbGV0ZToge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJGaWx0ZXI6IGRlZmF1bHRGaWx0ZXJSZW5kZXIsXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuICB9LFxyXG4gIEFJbnB1dDoge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJGaWx0ZXI6IGRlZmF1bHRGaWx0ZXJSZW5kZXIsXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuICB9LFxyXG4gIEFJbnB1dE51bWJlcjoge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0LW51bWJlci1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBkZWZhdWx0RmlsdGVyUmVuZGVyLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kXHJcbiAgfSxcclxuICBBU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0IChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGxldCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgbGV0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgICAgICAgIGNhbGxiYWNrIChjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIGNlbGxWYWx1ZSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwOiBhbnksIGdJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgICAgICBjYWxsYmFjayAoY2VsbFZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICBYRVV0aWxzLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBwcm9wcyA9IHt9LCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICBsZXQgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gICAgICBsZXQgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICAgIGlmICghKGNlbGxWYWx1ZSA9PT0gbnVsbCB8fCBjZWxsVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBjZWxsVmFsdWUgPT09ICcnKSkge1xyXG4gICAgICAgIHJldHVybiBjZWxsVGV4dChoLCBYRVV0aWxzLm1hcChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnID8gY2VsbFZhbHVlIDogW2NlbGxWYWx1ZV0sIG9wdGlvbkdyb3VwcyA/ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgICAgICBsZXQgc2VsZWN0SXRlbVxyXG4gICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9wdGlvbkdyb3Vwcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25Hcm91cHNbaW5kZXhdW2dyb3VwT3B0aW9uc10sIChpdGVtOiBhbnkpID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RJdGVtKSB7XHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiBudWxsXHJcbiAgICAgICAgfSA6ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgICAgICBsZXQgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25zLCAoaXRlbTogYW55KSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiBudWxsXHJcbiAgICAgICAgfSkuam9pbignOycpKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCAnJylcclxuICAgIH0sXHJcbiAgICByZW5kZXJGaWx0ZXIgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICAgICAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBsZXQgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICAgICAgICBjYWxsYmFjayAob3B0aW9uVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaXRlbS5kYXRhID0gb3B0aW9uVmFsdWVcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uOiBnZXRGaWx0ZXJFdmVudHMoe1xyXG4gICAgICAgICAgICAgIGNoYW5nZSAodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihjb250ZXh0LCBjb2x1bW4sIHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDAsIGl0ZW0pXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgICB9LCBYRVV0aWxzLm1hcChvcHRpb25Hcm91cHMsIChncm91cDogYW55LCBnSW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgIGtleTogZ0luZGV4XHJcbiAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xyXG4gICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxyXG4gICAgICAgICAgICApKVxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICAgICAgY2FsbGJhY2sgKG9wdGlvblZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICBpdGVtLmRhdGEgPSBvcHRpb25WYWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgb246IGdldEZpbHRlckV2ZW50cyh7XHJcbiAgICAgICAgICAgIGNoYW5nZSAodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dCwgY29sdW1uLCB2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwLCBpdGVtKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgfSwgcmVuZGVyT3B0aW9ucyhoLCBvcHRpb25zLCBvcHRpb25Qcm9wcykpXHJcbiAgICAgIH0pXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyTWV0aG9kICh7IG9wdGlvbiwgcm93LCBjb2x1bW4gfTogYW55KSB7XHJcbiAgICAgIGxldCB7IGRhdGEgfSA9IG9wdGlvblxyXG4gICAgICBsZXQgeyBwcm9wZXJ0eSwgZmlsdGVyUmVuZGVyOiByZW5kZXJPcHRzIH0gPSBjb2x1bW5cclxuICAgICAgbGV0IHsgcHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBwcm9wZXJ0eSlcclxuICAgICAgaWYgKHByb3BzLm1vZGUgPT09ICdtdWx0aXBsZScpIHtcclxuICAgICAgICBpZiAoWEVVdGlscy5pc0FycmF5KGNlbGxWYWx1ZSkpIHtcclxuICAgICAgICAgIHJldHVybiBYRVV0aWxzLmluY2x1ZGVBcnJheXMoY2VsbFZhbHVlLCBkYXRhKVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gZGF0YS5pbmRleE9mKGNlbGxWYWx1ZSkgPiAtMVxyXG4gICAgICB9XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xyXG4gICAgICByZXR1cm4gY2VsbFZhbHVlID09IGRhdGFcclxuICAgIH1cclxuICB9LFxyXG4gIEFDYXNjYWRlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJDZWxsIChoOiBGdW5jdGlvbiwgeyBwcm9wcyA9IHt9IH06IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICAgIHZhciB2YWx1ZXMgPSBjZWxsVmFsdWUgfHwgW11cclxuICAgICAgdmFyIGxhYmVsczogQXJyYXk8YW55PiA9IFtdXHJcbiAgICAgIG1hdGNoQ2FzY2FkZXJEYXRhKDAsIHByb3BzLm9wdGlvbnMsIHZhbHVlcywgbGFiZWxzKVxyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgKHByb3BzLnNob3dBbGxMZXZlbHMgPT09IGZhbHNlID8gbGFiZWxzLnNsaWNlKGxhYmVscy5sZW5ndGggLSAxLCBsYWJlbHMubGVuZ3RoKSA6IGxhYmVscykuam9pbihgICR7cHJvcHMuc2VwYXJhdG9yIHx8ICcvJ30gYCkpXHJcbiAgICB9XHJcbiAgfSxcclxuICBBRGF0ZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NLUREJylcclxuICB9LFxyXG4gIEFNb250aFBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NJylcclxuICB9LFxyXG4gIEFSYW5nZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJDZWxsIChoOiBGdW5jdGlvbiwgeyBwcm9wcyA9IHt9IH06IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICAgIGlmIChjZWxsVmFsdWUpIHtcclxuICAgICAgICBjZWxsVmFsdWUgPSBYRVV0aWxzLm1hcChjZWxsVmFsdWUsIChkYXRlOiBhbnkpID0+IGRhdGUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCAnWVlZWS1NTS1ERCcpKS5qb2luKCcgfiAnKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBjZWxsVmFsdWUpXHJcbiAgICB9XHJcbiAgfSxcclxuICBBV2Vla1BpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLVdX5ZGoJylcclxuICB9LFxyXG4gIEFUaW1lUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ0hIOm1tOnNzJylcclxuICB9LFxyXG4gIEFUcmVlU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckNlbGwgKGg6IEZ1bmN0aW9uLCB7IHByb3BzID0ge30gfTogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgaWYgKGNlbGxWYWx1ZSAmJiAocHJvcHMudHJlZUNoZWNrYWJsZSB8fCBwcm9wcy5tdWx0aXBsZSkpIHtcclxuICAgICAgICBjZWxsVmFsdWUgPSBjZWxsVmFsdWUuam9pbignOycpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGNlbGxWYWx1ZSlcclxuICAgIH1cclxuICB9LFxyXG4gIEFSYXRlOiB7XHJcbiAgICByZW5kZXJEZWZhdWx0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBkZWZhdWx0RmlsdGVyUmVuZGVyLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kXHJcbiAgfSxcclxuICBBU3dpdGNoOiB7XHJcbiAgICByZW5kZXJEZWZhdWx0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBkZWZhdWx0RmlsdGVyUmVuZGVyLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5LqL5Lu25YW85a655oCn5aSE55CGXHJcbiAqL1xyXG5mdW5jdGlvbiBoYW5kbGVDbGVhckV2ZW50IChwYXJhbXM6IGFueSwgZXZudDogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICBsZXQgeyBnZXRFdmVudFRhcmdldE5vZGUgfSA9IGNvbnRleHRcclxuICBsZXQgYm9keUVsZW0gPSBkb2N1bWVudC5ib2R5XHJcbiAgaWYgKFxyXG4gICAgLy8g5LiL5ouJ5qGGXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtc2VsZWN0LWRyb3Bkb3duJykuZmxhZyB8fFxyXG4gICAgLy8g57qn6IGUXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FzY2FkZXItbWVudXMnKS5mbGFnIHx8XHJcbiAgICAvLyDml6XmnJ9cclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYWxlbmRhci1waWNrZXItY29udGFpbmVyJykuZmxhZyB8fFxyXG4gICAgLy8g5pe26Ze06YCJ5oupXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtdGltZS1waWNrZXItcGFuZWwnKS5mbGFnXHJcbiAgKSB7XHJcbiAgICByZXR1cm4gZmFsc2VcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDln7rkuo4gdnhlLXRhYmxlIOihqOagvOeahOmAgumFjeaPkuS7tu+8jOeUqOS6juWFvOWuuSBhbnQtZGVzaWduLXZ1ZSDnu4Tku7blupNcclxuICovXHJcbmV4cG9ydCBjb25zdCBWWEVUYWJsZVBsdWdpbkFudGQgPSB7XHJcbiAgaW5zdGFsbCAoeHRhYmxlOiBhbnkpIHtcclxuICAgIGxldCB7IGludGVyY2VwdG9yLCByZW5kZXJlciB9ID0geHRhYmxlXHJcbiAgICByZW5kZXJlci5taXhpbihyZW5kZXJNYXApXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyX2ZpbHRlcicsIGhhbmRsZUNsZWFyRXZlbnQpXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyX2FjdGl2ZWQnLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gIH1cclxufVxyXG5cclxuZGVjbGFyZSBnbG9iYWwge1xyXG4gIGludGVyZmFjZSBXaW5kb3cge1xyXG4gICAgVlhFVGFibGU6IGFueVxyXG4gIH1cclxufVxyXG5cclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5WWEVUYWJsZSkge1xyXG4gIHdpbmRvdy5WWEVUYWJsZS51c2UoVlhFVGFibGVQbHVnaW5BbnRkKVxyXG59XHJcblxyXG5YRVV0aWxzLm1peGluKHtcclxuICB0b01vbWVudFN0cmluZyAoY2VsbFZhbHVlOiBhbnksIGZvcm1hdDogYW55KSB7XHJcbiAgICByZXR1cm4gY2VsbFZhbHVlID8gY2VsbFZhbHVlLmZvcm1hdChmb3JtYXQpIDogJydcclxuICB9XHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWWEVUYWJsZVBsdWdpbkFudGRcclxuIl19
