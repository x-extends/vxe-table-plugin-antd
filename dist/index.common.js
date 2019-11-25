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
/**
 * 渲染函数
 */


var renderMap = {
  AAutoComplete: {
    autofocus: 'input.ant-input',
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
    filterMethod: defaultFilterMethod
  },
  AInput: {
    autofocus: 'input.ant-input',
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
    filterMethod: defaultFilterMethod
  },
  AInputNumber: {
    autofocus: 'input.ant-input-number-input',
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
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
    renderEdit: createEditRender(),
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
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-MM-DD')
  },
  AMonthPicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-MM')
  },
  ARangePicker: {
    renderEdit: createEditRender(),
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
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('YYYY-WW周')
  },
  ATimePicker: {
    renderEdit: createEditRender(),
    renderCell: formatDatePicker('HH:mm:ss')
  },
  ATreeSelect: {
    renderEdit: createEditRender(),
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
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
    filterMethod: defaultFilterMethod
  },
  ASwitch: {
    renderDefault: createEditRender(),
    renderEdit: createEditRender(),
    renderFilter: createFilterRender(),
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiWEVVdGlscyIsImVhY2giLCJpdGVtIiwidmFsdWUiLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsInBhcmFtcyIsInByb3BzIiwicm93IiwiY29sdW1uIiwiY2VsbFZhbHVlIiwiZ2V0IiwicHJvcGVydHkiLCJmb3JtYXQiLCJjZWxsVGV4dCIsImdldFByb3BzIiwiZGVmYXVsdFByb3BzIiwiJHRhYmxlIiwiYXNzaWduIiwidlNpemUiLCJzaXplIiwiZ2V0Q2VsbEV2ZW50cyIsInJlbmRlck9wdHMiLCJuYW1lIiwiZXZlbnRzIiwidHlwZSIsIm9uIiwiZXZudCIsInVwZGF0ZVN0YXR1cyIsIm9iamVjdE1hcCIsImNiIiwiYXJncyIsImFwcGx5IiwiY29uY2F0IiwiY3JlYXRlRWRpdFJlbmRlciIsImF0dHJzIiwibW9kZWwiLCJjYWxsYmFjayIsInNldCIsImdldEZpbHRlckV2ZW50cyIsImNvbnRleHQiLCJPYmplY3QiLCJjcmVhdGVGaWx0ZXJSZW5kZXIiLCJmaWx0ZXJzIiwibWFwIiwiZGF0YSIsIm9wdGlvblZhbHVlIiwiaGFuZGxlQ29uZmlybUZpbHRlciIsImNoZWNrZWQiLCJmaWx0ZXJNdWx0aXBsZSIsImRlZmF1bHRGaWx0ZXJNZXRob2QiLCJvcHRpb24iLCJyZW5kZXJPcHRpb25zIiwib3B0aW9ucyIsIm9wdGlvblByb3BzIiwibGFiZWxQcm9wIiwidmFsdWVQcm9wIiwiZGlzYWJsZWRQcm9wIiwiZGlzYWJsZWQiLCJrZXkiLCJyZW5kZXJNYXAiLCJBQXV0b0NvbXBsZXRlIiwiYXV0b2ZvY3VzIiwicmVuZGVyRGVmYXVsdCIsInJlbmRlckVkaXQiLCJyZW5kZXJGaWx0ZXIiLCJmaWx0ZXJNZXRob2QiLCJBSW5wdXQiLCJBSW5wdXROdW1iZXIiLCJBU2VsZWN0Iiwib3B0aW9uR3JvdXBzIiwib3B0aW9uR3JvdXBQcm9wcyIsImdyb3VwT3B0aW9ucyIsImdyb3VwTGFiZWwiLCJncm91cCIsImdJbmRleCIsInNsb3QiLCJyZW5kZXJDZWxsIiwidW5kZWZpbmVkIiwibW9kZSIsInNlbGVjdEl0ZW0iLCJmaW5kIiwiam9pbiIsImNoYW5nZSIsImZpbHRlclJlbmRlciIsImlzQXJyYXkiLCJpbmNsdWRlQXJyYXlzIiwiaW5kZXhPZiIsIkFDYXNjYWRlciIsInNob3dBbGxMZXZlbHMiLCJzbGljZSIsInNlcGFyYXRvciIsIkFEYXRlUGlja2VyIiwiQU1vbnRoUGlja2VyIiwiQVJhbmdlUGlja2VyIiwiZGF0ZSIsIkFXZWVrUGlja2VyIiwiQVRpbWVQaWNrZXIiLCJBVHJlZVNlbGVjdCIsInRyZWVDaGVja2FibGUiLCJtdWx0aXBsZSIsIkFSYXRlIiwiQVN3aXRjaCIsImhhbmRsZUNsZWFyRXZlbnQiLCJnZXRFdmVudFRhcmdldE5vZGUiLCJib2R5RWxlbSIsImRvY3VtZW50IiwiYm9keSIsImZsYWciLCJWWEVUYWJsZVBsdWdpbkFudGQiLCJpbnN0YWxsIiwieHRhYmxlIiwiaW50ZXJjZXB0b3IiLCJyZW5kZXJlciIsIm1peGluIiwiYWRkIiwid2luZG93IiwiVlhFVGFibGUiLCJ1c2UiLCJ0b01vbWVudFN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7QUFHQSxTQUFTQSxpQkFBVCxDQUEyQkMsS0FBM0IsRUFBMENDLElBQTFDLEVBQTREQyxNQUE1RCxFQUFnRkMsTUFBaEYsRUFBa0c7QUFDaEcsTUFBSUMsR0FBRyxHQUFHRixNQUFNLENBQUNGLEtBQUQsQ0FBaEI7O0FBQ0EsTUFBSUMsSUFBSSxJQUFJQyxNQUFNLENBQUNHLE1BQVAsR0FBZ0JMLEtBQTVCLEVBQW1DO0FBQ2pDTSx3QkFBUUMsSUFBUixDQUFhTixJQUFiLEVBQW1CLFVBQUNPLElBQUQsRUFBYztBQUMvQixVQUFJQSxJQUFJLENBQUNDLEtBQUwsS0FBZUwsR0FBbkIsRUFBd0I7QUFDdEJELFFBQUFBLE1BQU0sQ0FBQ08sSUFBUCxDQUFZRixJQUFJLENBQUNHLEtBQWpCO0FBQ0FaLFFBQUFBLGlCQUFpQixDQUFDLEVBQUVDLEtBQUgsRUFBVVEsSUFBSSxDQUFDSSxRQUFmLEVBQXlCVixNQUF6QixFQUFpQ0MsTUFBakMsQ0FBakI7QUFDRDtBQUNGLEtBTEQ7QUFNRDtBQUNGOztBQUVELFNBQVNVLGdCQUFULENBQTBCQyxhQUExQixFQUE0QztBQUMxQyxTQUFPLFVBQVVDLENBQVYsUUFBNENDLE1BQTVDLEVBQXVEO0FBQUEsMEJBQTlCQyxLQUE4QjtBQUFBLFFBQTlCQSxLQUE4QiwyQkFBdEIsRUFBc0I7QUFBQSxRQUN0REMsR0FEc0QsR0FDdENGLE1BRHNDLENBQ3RERSxHQURzRDtBQUFBLFFBQ2pEQyxNQURpRCxHQUN0Q0gsTUFEc0MsQ0FDakRHLE1BRGlEOztBQUU1RCxRQUFJQyxTQUFTLEdBQUdkLG9CQUFRZSxHQUFSLENBQVlILEdBQVosRUFBaUJDLE1BQU0sQ0FBQ0csUUFBeEIsQ0FBaEI7O0FBQ0EsUUFBSUYsU0FBSixFQUFlO0FBQ2JBLE1BQUFBLFNBQVMsR0FBR0EsU0FBUyxDQUFDRyxNQUFWLENBQWlCTixLQUFLLENBQUNNLE1BQU4sSUFBZ0JULGFBQWpDLENBQVo7QUFDRDs7QUFDRCxXQUFPVSxRQUFRLENBQUNULENBQUQsRUFBSUssU0FBSixDQUFmO0FBQ0QsR0FQRDtBQVFEOztBQUVELFNBQVNLLFFBQVQsZUFBbURDLFlBQW5ELEVBQXFFO0FBQUEsTUFBakRDLE1BQWlELFNBQWpEQSxNQUFpRDtBQUFBLE1BQWhDVixLQUFnQyxTQUFoQ0EsS0FBZ0M7QUFDbkUsU0FBT1gsb0JBQVFzQixNQUFSLENBQWVELE1BQU0sQ0FBQ0UsS0FBUCxHQUFlO0FBQUVDLElBQUFBLElBQUksRUFBRUgsTUFBTSxDQUFDRTtBQUFmLEdBQWYsR0FBd0MsRUFBdkQsRUFBMkRILFlBQTNELEVBQXlFVCxLQUF6RSxDQUFQO0FBQ0Q7O0FBRUQsU0FBU2MsYUFBVCxDQUF1QkMsVUFBdkIsRUFBd0NoQixNQUF4QyxFQUFtRDtBQUFBLE1BQzNDaUIsSUFEMkMsR0FDMUJELFVBRDBCLENBQzNDQyxJQUQyQztBQUFBLE1BQ3JDQyxNQURxQyxHQUMxQkYsVUFEMEIsQ0FDckNFLE1BRHFDO0FBQUEsTUFFM0NQLE1BRjJDLEdBRWhDWCxNQUZnQyxDQUUzQ1csTUFGMkM7QUFHakQsTUFBSVEsSUFBSSxHQUFHLFFBQVg7O0FBQ0EsVUFBUUYsSUFBUjtBQUNFLFNBQUssZUFBTDtBQUNFRSxNQUFBQSxJQUFJLEdBQUcsUUFBUDtBQUNBOztBQUNGLFNBQUssUUFBTDtBQUNFQSxNQUFBQSxJQUFJLEdBQUcsT0FBUDtBQUNBOztBQUNGLFNBQUssY0FBTDtBQUNFQSxNQUFBQSxJQUFJLEdBQUcsUUFBUDtBQUNBO0FBVEo7O0FBV0EsTUFBSUMsRUFBRSx1QkFDSEQsSUFERyxFQUNJLFVBQUNFLElBQUQsRUFBYztBQUNwQlYsSUFBQUEsTUFBTSxDQUFDVyxZQUFQLENBQW9CdEIsTUFBcEI7O0FBQ0EsUUFBSWtCLE1BQU0sSUFBSUEsTUFBTSxDQUFDQyxJQUFELENBQXBCLEVBQTRCO0FBQzFCRCxNQUFBQSxNQUFNLENBQUNDLElBQUQsQ0FBTixDQUFhbkIsTUFBYixFQUFxQnFCLElBQXJCO0FBQ0Q7QUFDRixHQU5HLENBQU47O0FBUUEsTUFBSUgsTUFBSixFQUFZO0FBQ1YsV0FBTzVCLG9CQUFRc0IsTUFBUixDQUFlLEVBQWYsRUFBbUJ0QixvQkFBUWlDLFNBQVIsQ0FBa0JMLE1BQWxCLEVBQTBCLFVBQUNNLEVBQUQ7QUFBQSxhQUFrQixZQUF3QjtBQUFBLDBDQUFYQyxJQUFXO0FBQVhBLFVBQUFBLElBQVc7QUFBQTs7QUFDNUZELFFBQUFBLEVBQUUsQ0FBQ0UsS0FBSCxDQUFTLElBQVQsRUFBZSxDQUFDMUIsTUFBRCxFQUFTMkIsTUFBVCxDQUFnQkQsS0FBaEIsQ0FBc0IxQixNQUF0QixFQUE4QnlCLElBQTlCLENBQWY7QUFDRCxPQUZtRDtBQUFBLEtBQTFCLENBQW5CLEVBRUhMLEVBRkcsQ0FBUDtBQUdEOztBQUNELFNBQU9BLEVBQVA7QUFDRDs7QUFFRCxTQUFTUSxnQkFBVCxDQUEwQmxCLFlBQTFCLEVBQTRDO0FBQzFDLFNBQU8sVUFBVVgsQ0FBVixFQUF1QmlCLFVBQXZCLEVBQXdDaEIsTUFBeEMsRUFBbUQ7QUFBQSxRQUNsREUsR0FEa0QsR0FDbENGLE1BRGtDLENBQ2xERSxHQURrRDtBQUFBLFFBQzdDQyxNQUQ2QyxHQUNsQ0gsTUFEa0MsQ0FDN0NHLE1BRDZDO0FBQUEsUUFFbEQwQixLQUZrRCxHQUV4Q2IsVUFGd0MsQ0FFbERhLEtBRmtEO0FBR3hELFFBQUk1QixLQUFLLEdBQUdRLFFBQVEsQ0FBQ1QsTUFBRCxFQUFTZ0IsVUFBVCxFQUFxQk4sWUFBckIsQ0FBcEI7QUFDQSxXQUFPLENBQ0xYLENBQUMsQ0FBQ2lCLFVBQVUsQ0FBQ0MsSUFBWixFQUFrQjtBQUNqQmhCLE1BQUFBLEtBQUssRUFBTEEsS0FEaUI7QUFFakI0QixNQUFBQSxLQUFLLEVBQUxBLEtBRmlCO0FBR2pCQyxNQUFBQSxLQUFLLEVBQUU7QUFDTHJDLFFBQUFBLEtBQUssRUFBRUgsb0JBQVFlLEdBQVIsQ0FBWUgsR0FBWixFQUFpQkMsTUFBTSxDQUFDRyxRQUF4QixDQURGO0FBRUx5QixRQUFBQSxRQUZLLG9CQUVJdEMsS0FGSixFQUVjO0FBQ2pCSCw4QkFBUTBDLEdBQVIsQ0FBWTlCLEdBQVosRUFBaUJDLE1BQU0sQ0FBQ0csUUFBeEIsRUFBa0NiLEtBQWxDO0FBQ0Q7QUFKSSxPQUhVO0FBU2pCMkIsTUFBQUEsRUFBRSxFQUFFTCxhQUFhLENBQUNDLFVBQUQsRUFBYWhCLE1BQWI7QUFUQSxLQUFsQixDQURJLENBQVA7QUFhRCxHQWpCRDtBQWtCRDs7QUFFRCxTQUFTaUMsZUFBVCxDQUF5QmIsRUFBekIsRUFBa0NKLFVBQWxDLEVBQW1EaEIsTUFBbkQsRUFBZ0VrQyxPQUFoRSxFQUE0RTtBQUFBLE1BQ3BFaEIsTUFEb0UsR0FDekRGLFVBRHlELENBQ3BFRSxNQURvRTs7QUFFMUUsTUFBSUEsTUFBSixFQUFZO0FBQ1YsV0FBTzVCLG9CQUFRc0IsTUFBUixDQUFlLEVBQWYsRUFBbUJ0QixvQkFBUWlDLFNBQVIsQ0FBa0JMLE1BQWxCLEVBQTBCLFVBQUNNLEVBQUQ7QUFBQSxhQUFrQixZQUF3QjtBQUM1RnhCLFFBQUFBLE1BQU0sR0FBR21DLE1BQU0sQ0FBQ3ZCLE1BQVAsQ0FBYztBQUFFc0IsVUFBQUEsT0FBTyxFQUFQQTtBQUFGLFNBQWQsRUFBMkJsQyxNQUEzQixDQUFUOztBQUQ0RiwyQ0FBWHlCLElBQVc7QUFBWEEsVUFBQUEsSUFBVztBQUFBOztBQUU1RkQsUUFBQUEsRUFBRSxDQUFDRSxLQUFILENBQVMsSUFBVCxFQUFlLENBQUMxQixNQUFELEVBQVMyQixNQUFULENBQWdCRCxLQUFoQixDQUFzQjFCLE1BQXRCLEVBQThCeUIsSUFBOUIsQ0FBZjtBQUNELE9BSG1EO0FBQUEsS0FBMUIsQ0FBbkIsRUFHSEwsRUFIRyxDQUFQO0FBSUQ7O0FBQ0QsU0FBT0EsRUFBUDtBQUNEOztBQUVELFNBQVNnQixrQkFBVCxDQUE0QjFCLFlBQTVCLEVBQThDO0FBQzVDLFNBQU8sVUFBVVgsQ0FBVixFQUF1QmlCLFVBQXZCLEVBQXdDaEIsTUFBeEMsRUFBcURrQyxPQUFyRCxFQUFpRTtBQUFBLFFBQ2hFL0IsTUFEZ0UsR0FDckRILE1BRHFELENBQ2hFRyxNQURnRTtBQUFBLFFBRWhFYyxJQUZnRSxHQUV4Q0QsVUFGd0MsQ0FFaEVDLElBRmdFO0FBQUEsUUFFMURZLEtBRjBELEdBRXhDYixVQUZ3QyxDQUUxRGEsS0FGMEQ7QUFBQSxRQUVuRFgsTUFGbUQsR0FFeENGLFVBRndDLENBRW5ERSxNQUZtRDtBQUd0RSxRQUFJakIsS0FBSyxHQUFHUSxRQUFRLENBQUNULE1BQUQsRUFBU2dCLFVBQVQsQ0FBcEI7QUFDQSxRQUFJRyxJQUFJLEdBQUcsUUFBWDs7QUFDQSxZQUFRRixJQUFSO0FBQ0UsV0FBSyxlQUFMO0FBQ0VFLFFBQUFBLElBQUksR0FBRyxRQUFQO0FBQ0E7O0FBQ0YsV0FBSyxRQUFMO0FBQ0VBLFFBQUFBLElBQUksR0FBRyxPQUFQO0FBQ0E7O0FBQ0YsV0FBSyxjQUFMO0FBQ0VBLFFBQUFBLElBQUksR0FBRyxRQUFQO0FBQ0E7QUFUSjs7QUFXQSxXQUFPaEIsTUFBTSxDQUFDa0MsT0FBUCxDQUFlQyxHQUFmLENBQW1CLFVBQUM5QyxJQUFELEVBQWM7QUFDdEMsYUFBT08sQ0FBQyxDQUFDa0IsSUFBRCxFQUFPO0FBQ2JoQixRQUFBQSxLQUFLLEVBQUxBLEtBRGE7QUFFYjRCLFFBQUFBLEtBQUssRUFBTEEsS0FGYTtBQUdiQyxRQUFBQSxLQUFLLEVBQUU7QUFDTHJDLFVBQUFBLEtBQUssRUFBRUQsSUFBSSxDQUFDK0MsSUFEUDtBQUVMUixVQUFBQSxRQUZLLG9CQUVJUyxXQUZKLEVBRW9CO0FBQ3ZCaEQsWUFBQUEsSUFBSSxDQUFDK0MsSUFBTCxHQUFZQyxXQUFaO0FBQ0Q7QUFKSSxTQUhNO0FBU2JwQixRQUFBQSxFQUFFLEVBQUVhLGVBQWUscUJBQ2hCZCxJQURnQixZQUNWRSxJQURVLEVBQ0Q7QUFDZG9CLFVBQUFBLG1CQUFtQixDQUFDUCxPQUFELEVBQVUvQixNQUFWLEVBQWtCLENBQUMsQ0FBQ1gsSUFBSSxDQUFDK0MsSUFBekIsRUFBK0IvQyxJQUEvQixDQUFuQjs7QUFDQSxjQUFJMEIsTUFBTSxJQUFJQSxNQUFNLENBQUNDLElBQUQsQ0FBcEIsRUFBNEI7QUFDMUJELFlBQUFBLE1BQU0sQ0FBQ0MsSUFBRCxDQUFOLENBQWFnQixNQUFNLENBQUN2QixNQUFQLENBQWM7QUFBRXNCLGNBQUFBLE9BQU8sRUFBUEE7QUFBRixhQUFkLEVBQTJCbEMsTUFBM0IsQ0FBYixFQUFpRHFCLElBQWpEO0FBQ0Q7QUFDRixTQU5nQixHQU9oQkwsVUFQZ0IsRUFPSmhCLE1BUEksRUFPSWtDLE9BUEo7QUFUTixPQUFQLENBQVI7QUFrQkQsS0FuQk0sQ0FBUDtBQW9CRCxHQXBDRDtBQXFDRDs7QUFFRCxTQUFTTyxtQkFBVCxDQUE2QlAsT0FBN0IsRUFBMkMvQixNQUEzQyxFQUF3RHVDLE9BQXhELEVBQXNFbEQsSUFBdEUsRUFBK0U7QUFDN0UwQyxFQUFBQSxPQUFPLENBQUMvQixNQUFNLENBQUN3QyxjQUFQLEdBQXdCLHNCQUF4QixHQUFpRCxtQkFBbEQsQ0FBUCxDQUE4RSxFQUE5RSxFQUFrRkQsT0FBbEYsRUFBMkZsRCxJQUEzRjtBQUNEOztBQUVELFNBQVNvRCxtQkFBVCxRQUF5RDtBQUFBLE1BQTFCQyxNQUEwQixTQUExQkEsTUFBMEI7QUFBQSxNQUFsQjNDLEdBQWtCLFNBQWxCQSxHQUFrQjtBQUFBLE1BQWJDLE1BQWEsU0FBYkEsTUFBYTtBQUFBLE1BQ2pEb0MsSUFEaUQsR0FDeENNLE1BRHdDLENBQ2pETixJQURpRDs7QUFFdkQsTUFBSW5DLFNBQVMsR0FBR2Qsb0JBQVFlLEdBQVIsQ0FBWUgsR0FBWixFQUFpQkMsTUFBTSxDQUFDRyxRQUF4QixDQUFoQjtBQUNBOzs7QUFDQSxTQUFPRixTQUFTLEtBQUttQyxJQUFyQjtBQUNEOztBQUVELFNBQVNPLGFBQVQsQ0FBdUIvQyxDQUF2QixFQUFvQ2dELE9BQXBDLEVBQWtEQyxXQUFsRCxFQUFrRTtBQUNoRSxNQUFJQyxTQUFTLEdBQUdELFdBQVcsQ0FBQ3JELEtBQVosSUFBcUIsT0FBckM7QUFDQSxNQUFJdUQsU0FBUyxHQUFHRixXQUFXLENBQUN2RCxLQUFaLElBQXFCLE9BQXJDO0FBQ0EsTUFBSTBELFlBQVksR0FBR0gsV0FBVyxDQUFDSSxRQUFaLElBQXdCLFVBQTNDO0FBQ0EsU0FBTzlELG9CQUFRZ0QsR0FBUixDQUFZUyxPQUFaLEVBQXFCLFVBQUN2RCxJQUFELEVBQVlSLEtBQVosRUFBNkI7QUFDdkQsV0FBT2UsQ0FBQyxDQUFDLGlCQUFELEVBQW9CO0FBQzFCRSxNQUFBQSxLQUFLLEVBQUU7QUFDTFIsUUFBQUEsS0FBSyxFQUFFRCxJQUFJLENBQUMwRCxTQUFELENBRE47QUFFTEUsUUFBQUEsUUFBUSxFQUFFNUQsSUFBSSxDQUFDMkQsWUFBRDtBQUZULE9BRG1CO0FBSzFCRSxNQUFBQSxHQUFHLEVBQUVyRTtBQUxxQixLQUFwQixFQU1MUSxJQUFJLENBQUN5RCxTQUFELENBTkMsQ0FBUjtBQU9ELEdBUk0sQ0FBUDtBQVNEOztBQUVELFNBQVN6QyxRQUFULENBQWtCVCxDQUFsQixFQUErQkssU0FBL0IsRUFBNkM7QUFDM0MsU0FBTyxDQUFDLE1BQU1BLFNBQVMsS0FBSyxJQUFkLElBQXNCQSxTQUFTLEtBQUssS0FBSyxDQUF6QyxHQUE2QyxFQUE3QyxHQUFrREEsU0FBeEQsQ0FBRCxDQUFQO0FBQ0Q7QUFFRDs7Ozs7QUFHQSxJQUFNa0QsU0FBUyxHQUFHO0FBQ2hCQyxFQUFBQSxhQUFhLEVBQUU7QUFDYkMsSUFBQUEsU0FBUyxFQUFFLGlCQURFO0FBRWJDLElBQUFBLGFBQWEsRUFBRTdCLGdCQUFnQixFQUZsQjtBQUdiOEIsSUFBQUEsVUFBVSxFQUFFOUIsZ0JBQWdCLEVBSGY7QUFJYitCLElBQUFBLFlBQVksRUFBRXZCLGtCQUFrQixFQUpuQjtBQUtid0IsSUFBQUEsWUFBWSxFQUFFaEI7QUFMRCxHQURDO0FBUWhCaUIsRUFBQUEsTUFBTSxFQUFFO0FBQ05MLElBQUFBLFNBQVMsRUFBRSxpQkFETDtBQUVOQyxJQUFBQSxhQUFhLEVBQUU3QixnQkFBZ0IsRUFGekI7QUFHTjhCLElBQUFBLFVBQVUsRUFBRTlCLGdCQUFnQixFQUh0QjtBQUlOK0IsSUFBQUEsWUFBWSxFQUFFdkIsa0JBQWtCLEVBSjFCO0FBS053QixJQUFBQSxZQUFZLEVBQUVoQjtBQUxSLEdBUlE7QUFlaEJrQixFQUFBQSxZQUFZLEVBQUU7QUFDWk4sSUFBQUEsU0FBUyxFQUFFLDhCQURDO0FBRVpDLElBQUFBLGFBQWEsRUFBRTdCLGdCQUFnQixFQUZuQjtBQUdaOEIsSUFBQUEsVUFBVSxFQUFFOUIsZ0JBQWdCLEVBSGhCO0FBSVorQixJQUFBQSxZQUFZLEVBQUV2QixrQkFBa0IsRUFKcEI7QUFLWndCLElBQUFBLFlBQVksRUFBRWhCO0FBTEYsR0FmRTtBQXNCaEJtQixFQUFBQSxPQUFPLEVBQUU7QUFDUEwsSUFBQUEsVUFETyxzQkFDSTNELENBREosRUFDaUJpQixVQURqQixFQUNrQ2hCLE1BRGxDLEVBQzZDO0FBQUEsVUFDNUMrQyxPQUQ0QyxHQUN1Qi9CLFVBRHZCLENBQzVDK0IsT0FENEM7QUFBQSxVQUNuQ2lCLFlBRG1DLEdBQ3VCaEQsVUFEdkIsQ0FDbkNnRCxZQURtQztBQUFBLGtDQUN1QmhELFVBRHZCLENBQ3JCZ0MsV0FEcUI7QUFBQSxVQUNyQkEsV0FEcUIsc0NBQ1AsRUFETztBQUFBLGtDQUN1QmhDLFVBRHZCLENBQ0hpRCxnQkFERztBQUFBLFVBQ0hBLGdCQURHLHNDQUNnQixFQURoQjtBQUFBLFVBRTVDL0QsR0FGNEMsR0FFNUJGLE1BRjRCLENBRTVDRSxHQUY0QztBQUFBLFVBRXZDQyxNQUZ1QyxHQUU1QkgsTUFGNEIsQ0FFdkNHLE1BRnVDO0FBQUEsVUFHNUMwQixLQUg0QyxHQUdsQ2IsVUFIa0MsQ0FHNUNhLEtBSDRDO0FBSWxELFVBQUk1QixLQUFLLEdBQUdRLFFBQVEsQ0FBQ1QsTUFBRCxFQUFTZ0IsVUFBVCxDQUFwQjs7QUFDQSxVQUFJZ0QsWUFBSixFQUFrQjtBQUNoQixZQUFJRSxZQUFZLEdBQUdELGdCQUFnQixDQUFDbEIsT0FBakIsSUFBNEIsU0FBL0M7QUFDQSxZQUFJb0IsVUFBVSxHQUFHRixnQkFBZ0IsQ0FBQ3RFLEtBQWpCLElBQTBCLE9BQTNDO0FBQ0EsZUFBTyxDQUNMSSxDQUFDLENBQUMsVUFBRCxFQUFhO0FBQ1pFLFVBQUFBLEtBQUssRUFBTEEsS0FEWTtBQUVaNEIsVUFBQUEsS0FBSyxFQUFMQSxLQUZZO0FBR1pDLFVBQUFBLEtBQUssRUFBRTtBQUNMckMsWUFBQUEsS0FBSyxFQUFFSCxvQkFBUWUsR0FBUixDQUFZSCxHQUFaLEVBQWlCQyxNQUFNLENBQUNHLFFBQXhCLENBREY7QUFFTHlCLFlBQUFBLFFBRkssb0JBRUkzQixTQUZKLEVBRWtCO0FBQ3JCZCxrQ0FBUTBDLEdBQVIsQ0FBWTlCLEdBQVosRUFBaUJDLE1BQU0sQ0FBQ0csUUFBeEIsRUFBa0NGLFNBQWxDO0FBQ0Q7QUFKSSxXQUhLO0FBU1pnQixVQUFBQSxFQUFFLEVBQUVMLGFBQWEsQ0FBQ0MsVUFBRCxFQUFhaEIsTUFBYjtBQVRMLFNBQWIsRUFVRVYsb0JBQVFnRCxHQUFSLENBQVkwQixZQUFaLEVBQTBCLFVBQUNJLEtBQUQsRUFBYUMsTUFBYixFQUErQjtBQUMxRCxpQkFBT3RFLENBQUMsQ0FBQyxvQkFBRCxFQUF1QjtBQUM3QnNELFlBQUFBLEdBQUcsRUFBRWdCO0FBRHdCLFdBQXZCLEVBRUwsQ0FDRHRFLENBQUMsQ0FBQyxNQUFELEVBQVM7QUFDUnVFLFlBQUFBLElBQUksRUFBRTtBQURFLFdBQVQsRUFFRUYsS0FBSyxDQUFDRCxVQUFELENBRlAsQ0FEQSxFQUlEeEMsTUFKQyxDQUtEbUIsYUFBYSxDQUFDL0MsQ0FBRCxFQUFJcUUsS0FBSyxDQUFDRixZQUFELENBQVQsRUFBeUJsQixXQUF6QixDQUxaLENBRkssQ0FBUjtBQVNELFNBVkUsQ0FWRixDQURJLENBQVA7QUF1QkQ7O0FBQ0QsYUFBTyxDQUNMakQsQ0FBQyxDQUFDLFVBQUQsRUFBYTtBQUNaRSxRQUFBQSxLQUFLLEVBQUxBLEtBRFk7QUFFWjRCLFFBQUFBLEtBQUssRUFBTEEsS0FGWTtBQUdaQyxRQUFBQSxLQUFLLEVBQUU7QUFDTHJDLFVBQUFBLEtBQUssRUFBRUgsb0JBQVFlLEdBQVIsQ0FBWUgsR0FBWixFQUFpQkMsTUFBTSxDQUFDRyxRQUF4QixDQURGO0FBRUx5QixVQUFBQSxRQUZLLG9CQUVJM0IsU0FGSixFQUVrQjtBQUNyQmQsZ0NBQVEwQyxHQUFSLENBQVk5QixHQUFaLEVBQWlCQyxNQUFNLENBQUNHLFFBQXhCLEVBQWtDRixTQUFsQztBQUNEO0FBSkksU0FISztBQVNaZ0IsUUFBQUEsRUFBRSxFQUFFTCxhQUFhLENBQUNDLFVBQUQsRUFBYWhCLE1BQWI7QUFUTCxPQUFiLEVBVUU4QyxhQUFhLENBQUMvQyxDQUFELEVBQUlnRCxPQUFKLEVBQWFDLFdBQWIsQ0FWZixDQURJLENBQVA7QUFhRCxLQTlDTTtBQStDUHVCLElBQUFBLFVBL0NPLHNCQStDSXhFLENBL0NKLEVBK0NpQmlCLFVBL0NqQixFQStDa0NoQixNQS9DbEMsRUErQzZDO0FBQUEsVUFDNUMrQyxPQUQ0QyxHQUNtQy9CLFVBRG5DLENBQzVDK0IsT0FENEM7QUFBQSxVQUNuQ2lCLFlBRG1DLEdBQ21DaEQsVUFEbkMsQ0FDbkNnRCxZQURtQztBQUFBLDhCQUNtQ2hELFVBRG5DLENBQ3JCZixLQURxQjtBQUFBLFVBQ3JCQSxLQURxQixrQ0FDYixFQURhO0FBQUEsbUNBQ21DZSxVQURuQyxDQUNUZ0MsV0FEUztBQUFBLFVBQ1RBLFdBRFMsdUNBQ0ssRUFETDtBQUFBLG1DQUNtQ2hDLFVBRG5DLENBQ1NpRCxnQkFEVDtBQUFBLFVBQ1NBLGdCQURULHVDQUM0QixFQUQ1QjtBQUFBLFVBRTVDL0QsR0FGNEMsR0FFNUJGLE1BRjRCLENBRTVDRSxHQUY0QztBQUFBLFVBRXZDQyxNQUZ1QyxHQUU1QkgsTUFGNEIsQ0FFdkNHLE1BRnVDO0FBR2xELFVBQUk4QyxTQUFTLEdBQUdELFdBQVcsQ0FBQ3JELEtBQVosSUFBcUIsT0FBckM7QUFDQSxVQUFJdUQsU0FBUyxHQUFHRixXQUFXLENBQUN2RCxLQUFaLElBQXFCLE9BQXJDO0FBQ0EsVUFBSXlFLFlBQVksR0FBR0QsZ0JBQWdCLENBQUNsQixPQUFqQixJQUE0QixTQUEvQzs7QUFDQSxVQUFJM0MsU0FBUyxHQUFHZCxvQkFBUWUsR0FBUixDQUFZSCxHQUFaLEVBQWlCQyxNQUFNLENBQUNHLFFBQXhCLENBQWhCOztBQUNBLFVBQUksRUFBRUYsU0FBUyxLQUFLLElBQWQsSUFBc0JBLFNBQVMsS0FBS29FLFNBQXBDLElBQWlEcEUsU0FBUyxLQUFLLEVBQWpFLENBQUosRUFBMEU7QUFDeEUsZUFBT0ksUUFBUSxDQUFDVCxDQUFELEVBQUlULG9CQUFRZ0QsR0FBUixDQUFZckMsS0FBSyxDQUFDd0UsSUFBTixLQUFlLFVBQWYsR0FBNEJyRSxTQUE1QixHQUF3QyxDQUFDQSxTQUFELENBQXBELEVBQWlFNEQsWUFBWSxHQUFHLFVBQUN2RSxLQUFELEVBQWU7QUFDaEgsY0FBSWlGLFVBQUo7O0FBQ0EsZUFBSyxJQUFJMUYsS0FBSyxHQUFHLENBQWpCLEVBQW9CQSxLQUFLLEdBQUdnRixZQUFZLENBQUMzRSxNQUF6QyxFQUFpREwsS0FBSyxFQUF0RCxFQUEwRDtBQUN4RDBGLFlBQUFBLFVBQVUsR0FBR3BGLG9CQUFRcUYsSUFBUixDQUFhWCxZQUFZLENBQUNoRixLQUFELENBQVosQ0FBb0JrRixZQUFwQixDQUFiLEVBQWdELFVBQUMxRSxJQUFEO0FBQUEscUJBQWVBLElBQUksQ0FBQzBELFNBQUQsQ0FBSixLQUFvQnpELEtBQW5DO0FBQUEsYUFBaEQsQ0FBYjs7QUFDQSxnQkFBSWlGLFVBQUosRUFBZ0I7QUFDZDtBQUNEO0FBQ0Y7O0FBQ0QsaUJBQU9BLFVBQVUsR0FBR0EsVUFBVSxDQUFDekIsU0FBRCxDQUFiLEdBQTJCLElBQTVDO0FBQ0QsU0FUK0YsR0FTNUYsVUFBQ3hELEtBQUQsRUFBZTtBQUNqQixjQUFJaUYsVUFBVSxHQUFHcEYsb0JBQVFxRixJQUFSLENBQWE1QixPQUFiLEVBQXNCLFVBQUN2RCxJQUFEO0FBQUEsbUJBQWVBLElBQUksQ0FBQzBELFNBQUQsQ0FBSixLQUFvQnpELEtBQW5DO0FBQUEsV0FBdEIsQ0FBakI7O0FBQ0EsaUJBQU9pRixVQUFVLEdBQUdBLFVBQVUsQ0FBQ3pCLFNBQUQsQ0FBYixHQUEyQixJQUE1QztBQUNELFNBWmtCLEVBWWhCMkIsSUFaZ0IsQ0FZWCxHQVpXLENBQUosQ0FBZjtBQWFEOztBQUNELGFBQU9wRSxRQUFRLENBQUNULENBQUQsRUFBSSxFQUFKLENBQWY7QUFDRCxLQXRFTTtBQXVFUDRELElBQUFBLFlBdkVPLHdCQXVFTTVELENBdkVOLEVBdUVtQmlCLFVBdkVuQixFQXVFb0NoQixNQXZFcEMsRUF1RWlEa0MsT0F2RWpELEVBdUU2RDtBQUFBLFVBQzVEYSxPQUQ0RCxHQUNPL0IsVUFEUCxDQUM1RCtCLE9BRDREO0FBQUEsVUFDbkRpQixZQURtRCxHQUNPaEQsVUFEUCxDQUNuRGdELFlBRG1EO0FBQUEsbUNBQ09oRCxVQURQLENBQ3JDZ0MsV0FEcUM7QUFBQSxVQUNyQ0EsV0FEcUMsdUNBQ3ZCLEVBRHVCO0FBQUEsbUNBQ09oQyxVQURQLENBQ25CaUQsZ0JBRG1CO0FBQUEsVUFDbkJBLGdCQURtQix1Q0FDQSxFQURBO0FBQUEsVUFFNUQ5RCxNQUY0RCxHQUVqREgsTUFGaUQsQ0FFNURHLE1BRjREO0FBQUEsVUFHNUQwQixLQUg0RCxHQUcxQ2IsVUFIMEMsQ0FHNURhLEtBSDREO0FBQUEsVUFHckRYLE1BSHFELEdBRzFDRixVQUgwQyxDQUdyREUsTUFIcUQ7QUFJbEUsVUFBSWpCLEtBQUssR0FBR1EsUUFBUSxDQUFDVCxNQUFELEVBQVNnQixVQUFULENBQXBCO0FBQ0EsVUFBSUcsSUFBSSxHQUFHLFFBQVg7O0FBQ0EsVUFBSTZDLFlBQUosRUFBa0I7QUFDaEIsWUFBSUUsWUFBWSxHQUFHRCxnQkFBZ0IsQ0FBQ2xCLE9BQWpCLElBQTRCLFNBQS9DO0FBQ0EsWUFBSW9CLFVBQVUsR0FBR0YsZ0JBQWdCLENBQUN0RSxLQUFqQixJQUEwQixPQUEzQztBQUNBLGVBQU9RLE1BQU0sQ0FBQ2tDLE9BQVAsQ0FBZUMsR0FBZixDQUFtQixVQUFDOUMsSUFBRCxFQUFjO0FBQ3RDLGlCQUFPTyxDQUFDLENBQUMsVUFBRCxFQUFhO0FBQ25CRSxZQUFBQSxLQUFLLEVBQUxBLEtBRG1CO0FBRW5CNEIsWUFBQUEsS0FBSyxFQUFMQSxLQUZtQjtBQUduQkMsWUFBQUEsS0FBSyxFQUFFO0FBQ0xyQyxjQUFBQSxLQUFLLEVBQUVELElBQUksQ0FBQytDLElBRFA7QUFFTFIsY0FBQUEsUUFGSyxvQkFFSVMsV0FGSixFQUVvQjtBQUN2QmhELGdCQUFBQSxJQUFJLENBQUMrQyxJQUFMLEdBQVlDLFdBQVo7QUFDRDtBQUpJLGFBSFk7QUFTbkJwQixZQUFBQSxFQUFFLEVBQUVhLGVBQWUscUJBQ2hCZCxJQURnQixZQUNWMUIsS0FEVSxFQUNBO0FBQ2ZnRCxjQUFBQSxtQkFBbUIsQ0FBQ1AsT0FBRCxFQUFVL0IsTUFBVixFQUFrQlYsS0FBSyxJQUFJQSxLQUFLLENBQUNKLE1BQU4sR0FBZSxDQUExQyxFQUE2Q0csSUFBN0MsQ0FBbkI7O0FBQ0Esa0JBQUkwQixNQUFNLElBQUlBLE1BQU0sQ0FBQ0MsSUFBRCxDQUFwQixFQUE0QjtBQUMxQkQsZ0JBQUFBLE1BQU0sQ0FBQ0MsSUFBRCxDQUFOLENBQWFnQixNQUFNLENBQUN2QixNQUFQLENBQWM7QUFBRXNCLGtCQUFBQSxPQUFPLEVBQVBBO0FBQUYsaUJBQWQsRUFBMkJsQyxNQUEzQixDQUFiLEVBQWlEUCxLQUFqRDtBQUNEO0FBQ0YsYUFOZ0IsR0FPaEJ1QixVQVBnQixFQU9KaEIsTUFQSSxFQU9Ja0MsT0FQSjtBQVRBLFdBQWIsRUFpQkw1QyxvQkFBUWdELEdBQVIsQ0FBWTBCLFlBQVosRUFBMEIsVUFBQ0ksS0FBRCxFQUFhQyxNQUFiLEVBQStCO0FBQzFELG1CQUFPdEUsQ0FBQyxDQUFDLG9CQUFELEVBQXVCO0FBQzdCc0QsY0FBQUEsR0FBRyxFQUFFZ0I7QUFEd0IsYUFBdkIsRUFFTCxDQUNEdEUsQ0FBQyxDQUFDLE1BQUQsRUFBUztBQUNSdUUsY0FBQUEsSUFBSSxFQUFFO0FBREUsYUFBVCxFQUVFRixLQUFLLENBQUNELFVBQUQsQ0FGUCxDQURBLEVBSUR4QyxNQUpDLENBS0RtQixhQUFhLENBQUMvQyxDQUFELEVBQUlxRSxLQUFLLENBQUNGLFlBQUQsQ0FBVCxFQUF5QmxCLFdBQXpCLENBTFosQ0FGSyxDQUFSO0FBU0QsV0FWRSxDQWpCSyxDQUFSO0FBNEJELFNBN0JNLENBQVA7QUE4QkQ7O0FBQ0QsYUFBTzdDLE1BQU0sQ0FBQ2tDLE9BQVAsQ0FBZUMsR0FBZixDQUFtQixVQUFDOUMsSUFBRCxFQUFjO0FBQ3RDLGVBQU9PLENBQUMsQ0FBQyxVQUFELEVBQWE7QUFDbkJFLFVBQUFBLEtBQUssRUFBTEEsS0FEbUI7QUFFbkI0QixVQUFBQSxLQUFLLEVBQUxBLEtBRm1CO0FBR25CQyxVQUFBQSxLQUFLLEVBQUU7QUFDTHJDLFlBQUFBLEtBQUssRUFBRUQsSUFBSSxDQUFDK0MsSUFEUDtBQUVMUixZQUFBQSxRQUZLLG9CQUVJUyxXQUZKLEVBRW9CO0FBQ3ZCaEQsY0FBQUEsSUFBSSxDQUFDK0MsSUFBTCxHQUFZQyxXQUFaO0FBQ0Q7QUFKSSxXQUhZO0FBU25CcEIsVUFBQUEsRUFBRSxFQUFFYSxlQUFlLENBQUM7QUFDbEI0QyxZQUFBQSxNQURrQixrQkFDWHBGLEtBRFcsRUFDRDtBQUNmZ0QsY0FBQUEsbUJBQW1CLENBQUNQLE9BQUQsRUFBVS9CLE1BQVYsRUFBa0JWLEtBQUssSUFBSUEsS0FBSyxDQUFDSixNQUFOLEdBQWUsQ0FBMUMsRUFBNkNHLElBQTdDLENBQW5COztBQUNBLGtCQUFJMEIsTUFBTSxJQUFJQSxNQUFNLENBQUNDLElBQUQsQ0FBcEIsRUFBNEI7QUFDMUJELGdCQUFBQSxNQUFNLENBQUNDLElBQUQsQ0FBTixDQUFhZ0IsTUFBTSxDQUFDdkIsTUFBUCxDQUFjO0FBQUVzQixrQkFBQUEsT0FBTyxFQUFQQTtBQUFGLGlCQUFkLEVBQTJCbEMsTUFBM0IsQ0FBYixFQUFpRFAsS0FBakQ7QUFDRDtBQUNGO0FBTmlCLFdBQUQsRUFPaEJ1QixVQVBnQixFQU9KaEIsTUFQSSxFQU9Ja0MsT0FQSjtBQVRBLFNBQWIsRUFpQkxZLGFBQWEsQ0FBQy9DLENBQUQsRUFBSWdELE9BQUosRUFBYUMsV0FBYixDQWpCUixDQUFSO0FBa0JELE9BbkJNLENBQVA7QUFvQkQsS0FuSU07QUFvSVBZLElBQUFBLFlBcElPLCtCQW9Ja0M7QUFBQSxVQUExQmYsTUFBMEIsU0FBMUJBLE1BQTBCO0FBQUEsVUFBbEIzQyxHQUFrQixTQUFsQkEsR0FBa0I7QUFBQSxVQUFiQyxNQUFhLFNBQWJBLE1BQWE7QUFBQSxVQUNqQ29DLElBRGlDLEdBQ3hCTSxNQUR3QixDQUNqQ04sSUFEaUM7QUFBQSxVQUVqQ2pDLFFBRmlDLEdBRU1ILE1BRk4sQ0FFakNHLFFBRmlDO0FBQUEsVUFFVFUsVUFGUyxHQUVNYixNQUZOLENBRXZCMkUsWUFGdUI7QUFBQSwrQkFHbEI5RCxVQUhrQixDQUdqQ2YsS0FIaUM7QUFBQSxVQUdqQ0EsS0FIaUMsbUNBR3pCLEVBSHlCOztBQUl2QyxVQUFJRyxTQUFTLEdBQUdkLG9CQUFRZSxHQUFSLENBQVlILEdBQVosRUFBaUJJLFFBQWpCLENBQWhCOztBQUNBLFVBQUlMLEtBQUssQ0FBQ3dFLElBQU4sS0FBZSxVQUFuQixFQUErQjtBQUM3QixZQUFJbkYsb0JBQVF5RixPQUFSLENBQWdCM0UsU0FBaEIsQ0FBSixFQUFnQztBQUM5QixpQkFBT2Qsb0JBQVEwRixhQUFSLENBQXNCNUUsU0FBdEIsRUFBaUNtQyxJQUFqQyxDQUFQO0FBQ0Q7O0FBQ0QsZUFBT0EsSUFBSSxDQUFDMEMsT0FBTCxDQUFhN0UsU0FBYixJQUEwQixDQUFDLENBQWxDO0FBQ0Q7QUFDRDs7O0FBQ0EsYUFBT0EsU0FBUyxJQUFJbUMsSUFBcEI7QUFDRDtBQWpKTSxHQXRCTztBQXlLaEIyQyxFQUFBQSxTQUFTLEVBQUU7QUFDVHhCLElBQUFBLFVBQVUsRUFBRTlCLGdCQUFnQixFQURuQjtBQUVUMkMsSUFBQUEsVUFGUyxzQkFFRXhFLENBRkYsU0FFb0NDLE1BRnBDLEVBRStDO0FBQUEsOEJBQTlCQyxLQUE4QjtBQUFBLFVBQTlCQSxLQUE4Qiw0QkFBdEIsRUFBc0I7QUFBQSxVQUNoREMsR0FEZ0QsR0FDaENGLE1BRGdDLENBQ2hERSxHQURnRDtBQUFBLFVBQzNDQyxNQUQyQyxHQUNoQ0gsTUFEZ0MsQ0FDM0NHLE1BRDJDOztBQUV0RCxVQUFJQyxTQUFTLEdBQUdkLG9CQUFRZSxHQUFSLENBQVlILEdBQVosRUFBaUJDLE1BQU0sQ0FBQ0csUUFBeEIsQ0FBaEI7O0FBQ0EsVUFBSXBCLE1BQU0sR0FBR2tCLFNBQVMsSUFBSSxFQUExQjtBQUNBLFVBQUlqQixNQUFNLEdBQWUsRUFBekI7QUFDQUosTUFBQUEsaUJBQWlCLENBQUMsQ0FBRCxFQUFJa0IsS0FBSyxDQUFDOEMsT0FBVixFQUFtQjdELE1BQW5CLEVBQTJCQyxNQUEzQixDQUFqQjtBQUNBLGFBQU9xQixRQUFRLENBQUNULENBQUQsRUFBSSxDQUFDRSxLQUFLLENBQUNrRixhQUFOLEtBQXdCLEtBQXhCLEdBQWdDaEcsTUFBTSxDQUFDaUcsS0FBUCxDQUFhakcsTUFBTSxDQUFDRSxNQUFQLEdBQWdCLENBQTdCLEVBQWdDRixNQUFNLENBQUNFLE1BQXZDLENBQWhDLEdBQWlGRixNQUFsRixFQUEwRnlGLElBQTFGLFlBQW1HM0UsS0FBSyxDQUFDb0YsU0FBTixJQUFtQixHQUF0SCxPQUFKLENBQWY7QUFDRDtBQVRRLEdBektLO0FBb0xoQkMsRUFBQUEsV0FBVyxFQUFFO0FBQ1g1QixJQUFBQSxVQUFVLEVBQUU5QixnQkFBZ0IsRUFEakI7QUFFWDJDLElBQUFBLFVBQVUsRUFBRTFFLGdCQUFnQixDQUFDLFlBQUQ7QUFGakIsR0FwTEc7QUF3TGhCMEYsRUFBQUEsWUFBWSxFQUFFO0FBQ1o3QixJQUFBQSxVQUFVLEVBQUU5QixnQkFBZ0IsRUFEaEI7QUFFWjJDLElBQUFBLFVBQVUsRUFBRTFFLGdCQUFnQixDQUFDLFNBQUQ7QUFGaEIsR0F4TEU7QUE0TGhCMkYsRUFBQUEsWUFBWSxFQUFFO0FBQ1o5QixJQUFBQSxVQUFVLEVBQUU5QixnQkFBZ0IsRUFEaEI7QUFFWjJDLElBQUFBLFVBRlksc0JBRUR4RSxDQUZDLFNBRWlDQyxNQUZqQyxFQUU0QztBQUFBLDhCQUE5QkMsS0FBOEI7QUFBQSxVQUE5QkEsS0FBOEIsNEJBQXRCLEVBQXNCO0FBQUEsVUFDaERDLEdBRGdELEdBQ2hDRixNQURnQyxDQUNoREUsR0FEZ0Q7QUFBQSxVQUMzQ0MsTUFEMkMsR0FDaENILE1BRGdDLENBQzNDRyxNQUQyQzs7QUFFdEQsVUFBSUMsU0FBUyxHQUFHZCxvQkFBUWUsR0FBUixDQUFZSCxHQUFaLEVBQWlCQyxNQUFNLENBQUNHLFFBQXhCLENBQWhCOztBQUNBLFVBQUlGLFNBQUosRUFBZTtBQUNiQSxRQUFBQSxTQUFTLEdBQUdkLG9CQUFRZ0QsR0FBUixDQUFZbEMsU0FBWixFQUF1QixVQUFDcUYsSUFBRDtBQUFBLGlCQUFlQSxJQUFJLENBQUNsRixNQUFMLENBQVlOLEtBQUssQ0FBQ00sTUFBTixJQUFnQixZQUE1QixDQUFmO0FBQUEsU0FBdkIsRUFBaUZxRSxJQUFqRixDQUFzRixLQUF0RixDQUFaO0FBQ0Q7O0FBQ0QsYUFBT3BFLFFBQVEsQ0FBQ1QsQ0FBRCxFQUFJSyxTQUFKLENBQWY7QUFDRDtBQVRXLEdBNUxFO0FBdU1oQnNGLEVBQUFBLFdBQVcsRUFBRTtBQUNYaEMsSUFBQUEsVUFBVSxFQUFFOUIsZ0JBQWdCLEVBRGpCO0FBRVgyQyxJQUFBQSxVQUFVLEVBQUUxRSxnQkFBZ0IsQ0FBQyxVQUFEO0FBRmpCLEdBdk1HO0FBMk1oQjhGLEVBQUFBLFdBQVcsRUFBRTtBQUNYakMsSUFBQUEsVUFBVSxFQUFFOUIsZ0JBQWdCLEVBRGpCO0FBRVgyQyxJQUFBQSxVQUFVLEVBQUUxRSxnQkFBZ0IsQ0FBQyxVQUFEO0FBRmpCLEdBM01HO0FBK01oQitGLEVBQUFBLFdBQVcsRUFBRTtBQUNYbEMsSUFBQUEsVUFBVSxFQUFFOUIsZ0JBQWdCLEVBRGpCO0FBRVgyQyxJQUFBQSxVQUZXLHNCQUVBeEUsQ0FGQSxTQUVrQ0MsTUFGbEMsRUFFNkM7QUFBQSw4QkFBOUJDLEtBQThCO0FBQUEsVUFBOUJBLEtBQThCLDRCQUF0QixFQUFzQjtBQUFBLFVBQ2hEQyxHQURnRCxHQUNoQ0YsTUFEZ0MsQ0FDaERFLEdBRGdEO0FBQUEsVUFDM0NDLE1BRDJDLEdBQ2hDSCxNQURnQyxDQUMzQ0csTUFEMkM7O0FBRXRELFVBQUlDLFNBQVMsR0FBR2Qsb0JBQVFlLEdBQVIsQ0FBWUgsR0FBWixFQUFpQkMsTUFBTSxDQUFDRyxRQUF4QixDQUFoQjs7QUFDQSxVQUFJRixTQUFTLEtBQUtILEtBQUssQ0FBQzRGLGFBQU4sSUFBdUI1RixLQUFLLENBQUM2RixRQUFsQyxDQUFiLEVBQTBEO0FBQ3hEMUYsUUFBQUEsU0FBUyxHQUFHQSxTQUFTLENBQUN3RSxJQUFWLENBQWUsR0FBZixDQUFaO0FBQ0Q7O0FBQ0QsYUFBT3BFLFFBQVEsQ0FBQ1QsQ0FBRCxFQUFJSyxTQUFKLENBQWY7QUFDRDtBQVRVLEdBL01HO0FBME5oQjJGLEVBQUFBLEtBQUssRUFBRTtBQUNMdEMsSUFBQUEsYUFBYSxFQUFFN0IsZ0JBQWdCLEVBRDFCO0FBRUw4QixJQUFBQSxVQUFVLEVBQUU5QixnQkFBZ0IsRUFGdkI7QUFHTCtCLElBQUFBLFlBQVksRUFBRXZCLGtCQUFrQixFQUgzQjtBQUlMd0IsSUFBQUEsWUFBWSxFQUFFaEI7QUFKVCxHQTFOUztBQWdPaEJvRCxFQUFBQSxPQUFPLEVBQUU7QUFDUHZDLElBQUFBLGFBQWEsRUFBRTdCLGdCQUFnQixFQUR4QjtBQUVQOEIsSUFBQUEsVUFBVSxFQUFFOUIsZ0JBQWdCLEVBRnJCO0FBR1ArQixJQUFBQSxZQUFZLEVBQUV2QixrQkFBa0IsRUFIekI7QUFJUHdCLElBQUFBLFlBQVksRUFBRWhCO0FBSlA7QUFoT08sQ0FBbEI7QUF3T0E7Ozs7QUFHQSxTQUFTcUQsZ0JBQVQsQ0FBMEJqRyxNQUExQixFQUF1Q3FCLElBQXZDLEVBQWtEYSxPQUFsRCxFQUE4RDtBQUFBLE1BQ3REZ0Usa0JBRHNELEdBQy9CaEUsT0FEK0IsQ0FDdERnRSxrQkFEc0Q7QUFFNUQsTUFBSUMsUUFBUSxHQUFHQyxRQUFRLENBQUNDLElBQXhCOztBQUNBLE9BQ0U7QUFDQUgsRUFBQUEsa0JBQWtCLENBQUM3RSxJQUFELEVBQU84RSxRQUFQLEVBQWlCLHFCQUFqQixDQUFsQixDQUEwREcsSUFBMUQsSUFDQTtBQUNBSixFQUFBQSxrQkFBa0IsQ0FBQzdFLElBQUQsRUFBTzhFLFFBQVAsRUFBaUIsb0JBQWpCLENBQWxCLENBQXlERyxJQUZ6RCxJQUdBO0FBQ0FKLEVBQUFBLGtCQUFrQixDQUFDN0UsSUFBRCxFQUFPOEUsUUFBUCxFQUFpQiwrQkFBakIsQ0FBbEIsQ0FBb0VHLElBSnBFLElBS0E7QUFDQUosRUFBQUEsa0JBQWtCLENBQUM3RSxJQUFELEVBQU84RSxRQUFQLEVBQWlCLHVCQUFqQixDQUFsQixDQUE0REcsSUFSOUQsRUFTRTtBQUNBLFdBQU8sS0FBUDtBQUNEO0FBQ0Y7QUFFRDs7Ozs7QUFHTyxJQUFNQyxrQkFBa0IsR0FBRztBQUNoQ0MsRUFBQUEsT0FEZ0MsbUJBQ3hCQyxNQUR3QixFQUNEO0FBQUEsUUFDdkJDLFdBRHVCLEdBQ0dELE1BREgsQ0FDdkJDLFdBRHVCO0FBQUEsUUFDVkMsUUFEVSxHQUNHRixNQURILENBQ1ZFLFFBRFU7QUFFN0JBLElBQUFBLFFBQVEsQ0FBQ0MsS0FBVCxDQUFldEQsU0FBZjtBQUNBb0QsSUFBQUEsV0FBVyxDQUFDRyxHQUFaLENBQWdCLG1CQUFoQixFQUFxQ1osZ0JBQXJDO0FBQ0FTLElBQUFBLFdBQVcsQ0FBQ0csR0FBWixDQUFnQixvQkFBaEIsRUFBc0NaLGdCQUF0QztBQUNEO0FBTitCLENBQTNCOzs7QUFTUCxJQUFJLE9BQU9hLE1BQVAsS0FBa0IsV0FBbEIsSUFBaUNBLE1BQU0sQ0FBQ0MsUUFBNUMsRUFBc0Q7QUFDcERELEVBQUFBLE1BQU0sQ0FBQ0MsUUFBUCxDQUFnQkMsR0FBaEIsQ0FBb0JULGtCQUFwQjtBQUNEOztBQUVELFNBQVNVLGNBQVQsQ0FBd0I3RyxTQUF4QixFQUF3Q0csTUFBeEMsRUFBc0Q7QUFDcEQsU0FBT0gsU0FBUyxHQUFHQSxTQUFTLENBQUNHLE1BQVYsQ0FBaUJBLE1BQWpCLENBQUgsR0FBOEIsRUFBOUM7QUFDRDs7QUFhRGpCLG9CQUFRc0gsS0FBUixDQUFjO0FBQ1pLLEVBQUFBLGNBQWMsRUFBZEE7QUFEWSxDQUFkOztlQUllVixrQiIsImZpbGUiOiJpbmRleC5jb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgWEVVdGlscyBmcm9tICd4ZS11dGlscy9tZXRob2RzL3hlLXV0aWxzJ1xyXG5pbXBvcnQgVlhFVGFibGUgZnJvbSAndnhlLXRhYmxlL2xpYi92eGUtdGFibGUnXHJcblxyXG5mdW5jdGlvbiBtYXRjaENhc2NhZGVyRGF0YShpbmRleDogbnVtYmVyLCBsaXN0OiBBcnJheTxhbnk+LCB2YWx1ZXM6IEFycmF5PGFueT4sIGxhYmVsczogQXJyYXk8YW55Pikge1xyXG4gIGxldCB2YWwgPSB2YWx1ZXNbaW5kZXhdXHJcbiAgaWYgKGxpc3QgJiYgdmFsdWVzLmxlbmd0aCA+IGluZGV4KSB7XHJcbiAgICBYRVV0aWxzLmVhY2gobGlzdCwgKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICBpZiAoaXRlbS52YWx1ZSA9PT0gdmFsKSB7XHJcbiAgICAgICAgbGFiZWxzLnB1c2goaXRlbS5sYWJlbClcclxuICAgICAgICBtYXRjaENhc2NhZGVyRGF0YSgrK2luZGV4LCBpdGVtLmNoaWxkcmVuLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgfVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGZvcm1hdERhdGVQaWNrZXIoZGVmYXVsdEZvcm1hdDogYW55KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBGdW5jdGlvbiwgeyBwcm9wcyA9IHt9IH06IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgIGlmIChjZWxsVmFsdWUpIHtcclxuICAgICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgZGVmYXVsdEZvcm1hdClcclxuICAgIH1cclxuICAgIHJldHVybiBjZWxsVGV4dChoLCBjZWxsVmFsdWUpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQcm9wcyh7ICR0YWJsZSB9OiBhbnksIHsgcHJvcHMgfTogYW55LCBkZWZhdWx0UHJvcHM/OiBhbnkpIHtcclxuICByZXR1cm4gWEVVdGlscy5hc3NpZ24oJHRhYmxlLnZTaXplID8geyBzaXplOiAkdGFibGUudlNpemUgfSA6IHt9LCBkZWZhdWx0UHJvcHMsIHByb3BzKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyBuYW1lLCBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyAkdGFibGUgfSA9IHBhcmFtc1xyXG4gIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgIGNhc2UgJ0FBdXRvQ29tcGxldGUnOlxyXG4gICAgICB0eXBlID0gJ3NlbGVjdCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dCc6XHJcbiAgICAgIHR5cGUgPSAnaW5wdXQnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXROdW1iZXInOlxyXG4gICAgICB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgbGV0IG9uID0ge1xyXG4gICAgW3R5cGVdOiAoZXZudDogYW55KSA9PiB7XHJcbiAgICAgICR0YWJsZS51cGRhdGVTdGF0dXMocGFyYW1zKVxyXG4gICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgIGV2ZW50c1t0eXBlXShwYXJhbXMsIGV2bnQpXHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcbiAgaWYgKGV2ZW50cykge1xyXG4gICAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKHt9LCBYRVV0aWxzLm9iamVjdE1hcChldmVudHMsIChjYjogRnVuY3Rpb24pID0+IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICBjYi5hcHBseShudWxsLCBbcGFyYW1zXS5jb25jYXQuYXBwbHkocGFyYW1zLCBhcmdzKSlcclxuICAgIH0pLCBvbilcclxuICB9XHJcbiAgcmV0dXJuIG9uXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUVkaXRSZW5kZXIoZGVmYXVsdFByb3BzPzogYW55KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgbGV0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cywgZGVmYXVsdFByb3BzKVxyXG4gICAgcmV0dXJuIFtcclxuICAgICAgaChyZW5kZXJPcHRzLm5hbWUsIHtcclxuICAgICAgICBwcm9wcyxcclxuICAgICAgICBhdHRycyxcclxuICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KSxcclxuICAgICAgICAgIGNhbGxiYWNrKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIHZhbHVlKVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICB9KVxyXG4gICAgXVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RmlsdGVyRXZlbnRzKG9uOiBhbnksIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gIGxldCB7IGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gIGlmIChldmVudHMpIHtcclxuICAgIHJldHVybiBYRVV0aWxzLmFzc2lnbih7fSwgWEVVdGlscy5vYmplY3RNYXAoZXZlbnRzLCAoY2I6IEZ1bmN0aW9uKSA9PiBmdW5jdGlvbiAoLi4uYXJnczogYW55W10pIHtcclxuICAgICAgcGFyYW1zID0gT2JqZWN0LmFzc2lnbih7IGNvbnRleHQgfSwgcGFyYW1zKVxyXG4gICAgICBjYi5hcHBseShudWxsLCBbcGFyYW1zXS5jb25jYXQuYXBwbHkocGFyYW1zLCBhcmdzKSlcclxuICAgIH0pLCBvbilcclxuICB9XHJcbiAgcmV0dXJuIG9uXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNyZWF0ZUZpbHRlclJlbmRlcihkZWZhdWx0UHJvcHM/OiBhbnkpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICAgIGxldCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICBsZXQgeyBuYW1lLCBhdHRycywgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgICBsZXQgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgICAgY2FzZSAnQUF1dG9Db21wbGV0ZSc6XHJcbiAgICAgICAgdHlwZSA9ICdzZWxlY3QnXHJcbiAgICAgICAgYnJlYWtcclxuICAgICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgICB0eXBlID0gJ2lucHV0J1xyXG4gICAgICAgIGJyZWFrXHJcbiAgICAgIGNhc2UgJ0FJbnB1dE51bWJlcic6XHJcbiAgICAgICAgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgICAgICAgYnJlYWtcclxuICAgIH1cclxuICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICByZXR1cm4gaChuYW1lLCB7XHJcbiAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgIHZhbHVlOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgICBjYWxsYmFjayhvcHRpb25WYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgIGl0ZW0uZGF0YSA9IG9wdGlvblZhbHVlXHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSxcclxuICAgICAgICBvbjogZ2V0RmlsdGVyRXZlbnRzKHtcclxuICAgICAgICAgIFt0eXBlXShldm50OiBhbnkpIHtcclxuICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihjb250ZXh0LCBjb2x1bW4sICEhaXRlbS5kYXRhLCBpdGVtKVxyXG4gICAgICAgICAgICBpZiAoZXZlbnRzICYmIGV2ZW50c1t0eXBlXSkge1xyXG4gICAgICAgICAgICAgIGV2ZW50c1t0eXBlXShPYmplY3QuYXNzaWduKHsgY29udGV4dCB9LCBwYXJhbXMpLCBldm50KVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSwgcmVuZGVyT3B0cywgcGFyYW1zLCBjb250ZXh0KVxyXG4gICAgICB9KVxyXG4gICAgfSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dDogYW55LCBjb2x1bW46IGFueSwgY2hlY2tlZDogYW55LCBpdGVtOiBhbnkpIHtcclxuICBjb250ZXh0W2NvbHVtbi5maWx0ZXJNdWx0aXBsZSA/ICdjaGFuZ2VNdWx0aXBsZU9wdGlvbicgOiAnY2hhbmdlUmFkaW9PcHRpb24nXSh7fSwgY2hlY2tlZCwgaXRlbSlcclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEZpbHRlck1ldGhvZCh7IG9wdGlvbiwgcm93LCBjb2x1bW4gfTogYW55KSB7XHJcbiAgbGV0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gIC8qIGVzbGludC1kaXNhYmxlIGVxZXFlcSAqL1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPT09IGRhdGFcclxufVxyXG5cclxuZnVuY3Rpb24gcmVuZGVyT3B0aW9ucyhoOiBGdW5jdGlvbiwgb3B0aW9uczogYW55LCBvcHRpb25Qcm9wczogYW55KSB7XHJcbiAgbGV0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICBsZXQgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gIGxldCBkaXNhYmxlZFByb3AgPSBvcHRpb25Qcm9wcy5kaXNhYmxlZCB8fCAnZGlzYWJsZWQnXHJcbiAgcmV0dXJuIFhFVXRpbHMubWFwKG9wdGlvbnMsIChpdGVtOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHRpb24nLCB7XHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgdmFsdWU6IGl0ZW1bdmFsdWVQcm9wXSxcclxuICAgICAgICBkaXNhYmxlZDogaXRlbVtkaXNhYmxlZFByb3BdXHJcbiAgICAgIH0sXHJcbiAgICAgIGtleTogaW5kZXhcclxuICAgIH0sIGl0ZW1bbGFiZWxQcm9wXSlcclxuICB9KVxyXG59XHJcblxyXG5mdW5jdGlvbiBjZWxsVGV4dChoOiBGdW5jdGlvbiwgY2VsbFZhbHVlOiBhbnkpIHtcclxuICByZXR1cm4gWycnICsgKGNlbGxWYWx1ZSA9PT0gbnVsbCB8fCBjZWxsVmFsdWUgPT09IHZvaWQgMCA/ICcnIDogY2VsbFZhbHVlKV1cclxufVxyXG5cclxuLyoqXHJcbiAqIOa4suafk+WHveaVsFxyXG4gKi9cclxuY29uc3QgcmVuZGVyTWFwID0ge1xyXG4gIEFBdXRvQ29tcGxldGU6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kXHJcbiAgfSxcclxuICBBSW5wdXQ6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJGaWx0ZXI6IGNyZWF0ZUZpbHRlclJlbmRlcigpLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kXHJcbiAgfSxcclxuICBBSW5wdXROdW1iZXI6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dC1udW1iZXItaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBjcmVhdGVGaWx0ZXJSZW5kZXIoKSxcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZFxyXG4gIH0sXHJcbiAgQVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGxldCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgbGV0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgICAgICAgIGNhbGxiYWNrKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBYRVV0aWxzLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXA6IGFueSwgZ0luZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIF1cclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gW1xyXG4gICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSksXHJcbiAgICAgICAgICAgIGNhbGxiYWNrKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIGNlbGxWYWx1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHJlbmRlckNlbGwoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBwcm9wcyA9IHt9LCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICBsZXQgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gICAgICBsZXQgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICAgIGlmICghKGNlbGxWYWx1ZSA9PT0gbnVsbCB8fCBjZWxsVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBjZWxsVmFsdWUgPT09ICcnKSkge1xyXG4gICAgICAgIHJldHVybiBjZWxsVGV4dChoLCBYRVV0aWxzLm1hcChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnID8gY2VsbFZhbHVlIDogW2NlbGxWYWx1ZV0sIG9wdGlvbkdyb3VwcyA/ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgICAgICBsZXQgc2VsZWN0SXRlbVxyXG4gICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9wdGlvbkdyb3Vwcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25Hcm91cHNbaW5kZXhdW2dyb3VwT3B0aW9uc10sIChpdGVtOiBhbnkpID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RJdGVtKSB7XHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiBudWxsXHJcbiAgICAgICAgfSA6ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgICAgICBsZXQgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25zLCAoaXRlbTogYW55KSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiBudWxsXHJcbiAgICAgICAgfSkuam9pbignOycpKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCAnJylcclxuICAgIH0sXHJcbiAgICByZW5kZXJGaWx0ZXIoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gICAgICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgeyBhdHRycywgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgICAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICBpZiAob3B0aW9uR3JvdXBzKSB7XHJcbiAgICAgICAgbGV0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgICBsZXQgZ3JvdXBMYWJlbCA9IG9wdGlvbkdyb3VwUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICAgIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICAgICAgICBjYWxsYmFjayhvcHRpb25WYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgICBpdGVtLmRhdGEgPSBvcHRpb25WYWx1ZVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgb246IGdldEZpbHRlckV2ZW50cyh7XHJcbiAgICAgICAgICAgICAgW3R5cGVdKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dCwgY29sdW1uLCB2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwLCBpdGVtKVxyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICAgICAgICAgICAgZXZlbnRzW3R5cGVdKE9iamVjdC5hc3NpZ24oeyBjb250ZXh0IH0sIHBhcmFtcyksIHZhbHVlKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgcmVuZGVyT3B0cywgcGFyYW1zLCBjb250ZXh0KVxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXA6IGFueSwgZ0luZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrKG9wdGlvblZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICBpdGVtLmRhdGEgPSBvcHRpb25WYWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgb246IGdldEZpbHRlckV2ZW50cyh7XHJcbiAgICAgICAgICAgIGNoYW5nZSh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihjb250ZXh0LCBjb2x1bW4sIHZhbHVlICYmIHZhbHVlLmxlbmd0aCA+IDAsIGl0ZW0pXHJcbiAgICAgICAgICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICAgICAgICAgIGV2ZW50c1t0eXBlXShPYmplY3QuYXNzaWduKHsgY29udGV4dCB9LCBwYXJhbXMpLCB2YWx1ZSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIHJlbmRlck9wdHMsIHBhcmFtcywgY29udGV4dClcclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBmaWx0ZXJNZXRob2QoeyBvcHRpb24sIHJvdywgY29sdW1uIH06IGFueSkge1xyXG4gICAgICBsZXQgeyBkYXRhIH0gPSBvcHRpb25cclxuICAgICAgbGV0IHsgcHJvcGVydHksIGZpbHRlclJlbmRlcjogcmVuZGVyT3B0cyB9ID0gY29sdW1uXHJcbiAgICAgIGxldCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgcHJvcGVydHkpXHJcbiAgICAgIGlmIChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnKSB7XHJcbiAgICAgICAgaWYgKFhFVXRpbHMuaXNBcnJheShjZWxsVmFsdWUpKSB7XHJcbiAgICAgICAgICByZXR1cm4gWEVVdGlscy5pbmNsdWRlQXJyYXlzKGNlbGxWYWx1ZSwgZGF0YSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGEuaW5kZXhPZihjZWxsVmFsdWUpID4gLTFcclxuICAgICAgfVxyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cclxuICAgICAgcmV0dXJuIGNlbGxWYWx1ZSA9PSBkYXRhXHJcbiAgICB9XHJcbiAgfSxcclxuICBBQ2FzY2FkZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwoaDogRnVuY3Rpb24sIHsgcHJvcHMgPSB7fSB9OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICB2YXIgdmFsdWVzID0gY2VsbFZhbHVlIHx8IFtdXHJcbiAgICAgIHZhciBsYWJlbHM6IEFycmF5PGFueT4gPSBbXVxyXG4gICAgICBtYXRjaENhc2NhZGVyRGF0YSgwLCBwcm9wcy5vcHRpb25zLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIChwcm9wcy5zaG93QWxsTGV2ZWxzID09PSBmYWxzZSA/IGxhYmVscy5zbGljZShsYWJlbHMubGVuZ3RoIC0gMSwgbGFiZWxzLmxlbmd0aCkgOiBsYWJlbHMpLmpvaW4oYCAke3Byb3BzLnNlcGFyYXRvciB8fCAnLyd9IGApKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgQURhdGVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktTU0tREQnKVxyXG4gIH0sXHJcbiAgQU1vbnRoUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBjcmVhdGVFZGl0UmVuZGVyKCksXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdZWVlZLU1NJylcclxuICB9LFxyXG4gIEFSYW5nZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbChoOiBGdW5jdGlvbiwgeyBwcm9wcyA9IHt9IH06IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICAgIGlmIChjZWxsVmFsdWUpIHtcclxuICAgICAgICBjZWxsVmFsdWUgPSBYRVV0aWxzLm1hcChjZWxsVmFsdWUsIChkYXRlOiBhbnkpID0+IGRhdGUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCAnWVlZWS1NTS1ERCcpKS5qb2luKCcgfiAnKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBjZWxsVmFsdWUpXHJcbiAgICB9XHJcbiAgfSxcclxuICBBV2Vla1BpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1XV+WRqCcpXHJcbiAgfSxcclxuICBBVGltZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogY3JlYXRlRWRpdFJlbmRlcigpLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignSEg6bW06c3MnKVxyXG4gIH0sXHJcbiAgQVRyZWVTZWxlY3Q6IHtcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckNlbGwoaDogRnVuY3Rpb24sIHsgcHJvcHMgPSB7fSB9OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICBpZiAoY2VsbFZhbHVlICYmIChwcm9wcy50cmVlQ2hlY2thYmxlIHx8IHByb3BzLm11bHRpcGxlKSkge1xyXG4gICAgICAgIGNlbGxWYWx1ZSA9IGNlbGxWYWx1ZS5qb2luKCc7JylcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgY2VsbFZhbHVlKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgQVJhdGU6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuICB9LFxyXG4gIEFTd2l0Y2g6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckVkaXQ6IGNyZWF0ZUVkaXRSZW5kZXIoKSxcclxuICAgIHJlbmRlckZpbHRlcjogY3JlYXRlRmlsdGVyUmVuZGVyKCksXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDkuovku7blhbzlrrnmgKflpITnkIZcclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZUNsZWFyRXZlbnQocGFyYW1zOiBhbnksIGV2bnQ6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgbGV0IHsgZ2V0RXZlbnRUYXJnZXROb2RlIH0gPSBjb250ZXh0XHJcbiAgbGV0IGJvZHlFbGVtID0gZG9jdW1lbnQuYm9keVxyXG4gIGlmIChcclxuICAgIC8vIOS4i+aLieahhlxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LXNlbGVjdC1kcm9wZG93bicpLmZsYWcgfHxcclxuICAgIC8vIOe6p+iBlFxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhc2NhZGVyLW1lbnVzJykuZmxhZyB8fFxyXG4gICAgLy8g5pel5pyfXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FsZW5kYXItcGlja2VyLWNvbnRhaW5lcicpLmZsYWcgfHxcclxuICAgIC8vIOaXtumXtOmAieaLqVxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LXRpbWUtcGlja2VyLXBhbmVsJykuZmxhZ1xyXG4gICkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5Z+65LqOIHZ4ZS10YWJsZSDooajmoLznmoTpgILphY3mj5Lku7bvvIznlKjkuo7lhbzlrrkgYW50LWRlc2lnbi12dWUg57uE5Lu25bqTXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgVlhFVGFibGVQbHVnaW5BbnRkID0ge1xyXG4gIGluc3RhbGwoeHRhYmxlOiB0eXBlb2YgVlhFVGFibGUpIHtcclxuICAgIGxldCB7IGludGVyY2VwdG9yLCByZW5kZXJlciB9ID0geHRhYmxlXHJcbiAgICByZW5kZXJlci5taXhpbihyZW5kZXJNYXApXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyRmlsdGVyJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJBY3RpdmVkJywgaGFuZGxlQ2xlYXJFdmVudClcclxuICB9XHJcbn1cclxuXHJcbmlmICh0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuVlhFVGFibGUpIHtcclxuICB3aW5kb3cuVlhFVGFibGUudXNlKFZYRVRhYmxlUGx1Z2luQW50ZClcclxufVxyXG5cclxuZnVuY3Rpb24gdG9Nb21lbnRTdHJpbmcoY2VsbFZhbHVlOiBhbnksIGZvcm1hdDogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gY2VsbFZhbHVlID8gY2VsbFZhbHVlLmZvcm1hdChmb3JtYXQpIDogJydcclxufVxyXG5cclxuZGVjbGFyZSBtb2R1bGUgJ3hlLXV0aWxzL21ldGhvZHMveGUtdXRpbHMnIHtcclxuICBpbnRlcmZhY2UgWEVVdGlsc01ldGhvZHMge1xyXG4gICAgLyoqXHJcbiAgICAgKiDlsIYgTW9tZW50IOaXpeacn+agvOW8j+WMluS4uuWtl+espuS4slxyXG4gICAgICogQHBhcmFtIGNlbGxWYWx1ZSDlgLxcclxuICAgICAqIEBwYXJhbSBmb3JtYXQg5qC85byP5YyWXHJcbiAgICAgKi9cclxuICAgIHRvTW9tZW50U3RyaW5nOiB0eXBlb2YgdG9Nb21lbnRTdHJpbmc7XHJcbiAgfVxyXG59XHJcblxyXG5YRVV0aWxzLm1peGluKHtcclxuICB0b01vbWVudFN0cmluZ1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5BbnRkXHJcbiJdfQ==
