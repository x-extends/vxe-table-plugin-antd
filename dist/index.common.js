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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiWEVVdGlscyIsImVhY2giLCJpdGVtIiwidmFsdWUiLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsInBhcmFtcyIsInByb3BzIiwicm93IiwiY29sdW1uIiwiY2VsbFZhbHVlIiwiZ2V0IiwicHJvcGVydHkiLCJmb3JtYXQiLCJjZWxsVGV4dCIsImdldFByb3BzIiwiJHRhYmxlIiwiYXNzaWduIiwidlNpemUiLCJzaXplIiwiZ2V0Q2VsbEV2ZW50cyIsInJlbmRlck9wdHMiLCJuYW1lIiwiZXZlbnRzIiwidHlwZSIsIm9uIiwiZXZudCIsInVwZGF0ZVN0YXR1cyIsIm9iamVjdE1hcCIsImNiIiwiYXJncyIsImFwcGx5IiwiY29uY2F0IiwiZGVmYXVsdEVkaXRSZW5kZXIiLCJhdHRycyIsIm1vZGVsIiwiY2FsbGJhY2siLCJzZXQiLCJnZXRGaWx0ZXJFdmVudHMiLCJkZWZhdWx0RmlsdGVyUmVuZGVyIiwiY29udGV4dCIsImZpbHRlcnMiLCJtYXAiLCJkYXRhIiwib3B0aW9uVmFsdWUiLCJoYW5kbGVDb25maXJtRmlsdGVyIiwiY2hlY2tlZCIsImZpbHRlck11bHRpcGxlIiwiZGVmYXVsdEZpbHRlck1ldGhvZCIsIm9wdGlvbiIsInJlbmRlck9wdGlvbnMiLCJvcHRpb25zIiwib3B0aW9uUHJvcHMiLCJsYWJlbFByb3AiLCJ2YWx1ZVByb3AiLCJrZXkiLCJyZW5kZXJNYXAiLCJBQXV0b0NvbXBsZXRlIiwiYXV0b2ZvY3VzIiwicmVuZGVyRGVmYXVsdCIsInJlbmRlckVkaXQiLCJyZW5kZXJGaWx0ZXIiLCJmaWx0ZXJNZXRob2QiLCJBSW5wdXQiLCJBSW5wdXROdW1iZXIiLCJBU2VsZWN0Iiwib3B0aW9uR3JvdXBzIiwib3B0aW9uR3JvdXBQcm9wcyIsImdyb3VwT3B0aW9ucyIsImdyb3VwTGFiZWwiLCJncm91cCIsImdJbmRleCIsInNsb3QiLCJyZW5kZXJDZWxsIiwidW5kZWZpbmVkIiwibW9kZSIsInNlbGVjdEl0ZW0iLCJmaW5kIiwiam9pbiIsImNoYW5nZSIsImZpbHRlclJlbmRlciIsImlzQXJyYXkiLCJpbmNsdWRlQXJyYXlzIiwiaW5kZXhPZiIsIkFDYXNjYWRlciIsInNob3dBbGxMZXZlbHMiLCJzbGljZSIsInNlcGFyYXRvciIsIkFEYXRlUGlja2VyIiwiQU1vbnRoUGlja2VyIiwiQVJhbmdlUGlja2VyIiwiZGF0ZSIsIkFXZWVrUGlja2VyIiwiQVRpbWVQaWNrZXIiLCJBVHJlZVNlbGVjdCIsInRyZWVDaGVja2FibGUiLCJtdWx0aXBsZSIsIkFSYXRlIiwiQVN3aXRjaCIsImhhbmRsZUNsZWFyRXZlbnQiLCJnZXRFdmVudFRhcmdldE5vZGUiLCJib2R5RWxlbSIsImRvY3VtZW50IiwiYm9keSIsImZsYWciLCJWWEVUYWJsZVBsdWdpbkFudGQiLCJpbnN0YWxsIiwieHRhYmxlIiwiaW50ZXJjZXB0b3IiLCJyZW5kZXJlciIsIm1peGluIiwiYWRkIiwid2luZG93IiwiVlhFVGFibGUiLCJ1c2UiLCJ0b01vbWVudFN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7QUFHQSxTQUFTQSxpQkFBVCxDQUE0QkMsS0FBNUIsRUFBMkNDLElBQTNDLEVBQTZEQyxNQUE3RCxFQUFpRkMsTUFBakYsRUFBbUc7QUFDakcsTUFBSUMsR0FBRyxHQUFHRixNQUFNLENBQUNGLEtBQUQsQ0FBaEI7O0FBQ0EsTUFBSUMsSUFBSSxJQUFJQyxNQUFNLENBQUNHLE1BQVAsR0FBZ0JMLEtBQTVCLEVBQW1DO0FBQ2pDTSx3QkFBUUMsSUFBUixDQUFhTixJQUFiLEVBQW1CLFVBQUNPLElBQUQsRUFBYztBQUMvQixVQUFJQSxJQUFJLENBQUNDLEtBQUwsS0FBZUwsR0FBbkIsRUFBd0I7QUFDdEJELFFBQUFBLE1BQU0sQ0FBQ08sSUFB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QUFDaENDLEVBQUFBLE9BRGdDLG1CQUN2QkMsTUFEdUIsRUFDQTtBQUFBLFFBQ3hCQyxXQUR3QixHQUNFRCxNQURGLENBQ3hCQyxXQUR3QjtBQUFBLFFBQ1hDLFFBRFcsR0FDRUYsTUFERixDQUNYRSxRQURXO0FBRTlCQSxJQUFBQSxRQUFRLENBQUNDLEtBQVQsQ0FBZXRELFNBQWY7QUFDQW9ELElBQUFBLFdBQVcsQ0FBQ0csR0FBWixDQUFnQixtQkFBaEIsRUFBcUNaLGdCQUFyQztBQUNBUyxJQUFBQSxXQUFXLENBQUNHLEdBQVosQ0FBZ0Isb0JBQWhCLEVBQXNDWixnQkFBdEM7QUFDRDtBQU4rQixDQUEzQjs7O0FBU1AsSUFBSSxPQUFPYSxNQUFQLEtBQWtCLFdBQWxCLElBQWlDQSxNQUFNLENBQUNDLFFBQTVDLEVBQXNEO0FBQ3BERCxFQUFBQSxNQUFNLENBQUNDLFFBQVAsQ0FBZ0JDLEdBQWhCLENBQW9CVCxrQkFBcEI7QUFDRDs7QUFFRCxTQUFTVSxjQUFULENBQXlCekcsU0FBekIsRUFBeUNHLE1BQXpDLEVBQXVEO0FBQ3JELFNBQU9ILFNBQVMsR0FBR0EsU0FBUyxDQUFDRyxNQUFWLENBQWlCQSxNQUFqQixDQUFILEdBQThCLEVBQTlDO0FBQ0Q7O0FBYURqQixvQkFBUWtILEtBQVIsQ0FBYztBQUNaSyxFQUFBQSxjQUFjLEVBQWRBO0FBRFksQ0FBZDs7ZUFJZVYsa0IiLCJmaWxlIjoiaW5kZXguY29tbW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFhFVXRpbHMgZnJvbSAneGUtdXRpbHMvbWV0aG9kcy94ZS11dGlscydcclxuaW1wb3J0IFZYRVRhYmxlIGZyb20gJ3Z4ZS10YWJsZS9saWIvdnhlLXRhYmxlJ1xyXG5cclxuZnVuY3Rpb24gbWF0Y2hDYXNjYWRlckRhdGEgKGluZGV4OiBudW1iZXIsIGxpc3Q6IEFycmF5PGFueT4sIHZhbHVlczogQXJyYXk8YW55PiwgbGFiZWxzOiBBcnJheTxhbnk+KSB7XHJcbiAgbGV0IHZhbCA9IHZhbHVlc1tpbmRleF1cclxuICBpZiAobGlzdCAmJiB2YWx1ZXMubGVuZ3RoID4gaW5kZXgpIHtcclxuICAgIFhFVXRpbHMuZWFjaChsaXN0LCAoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLnZhbHVlID09PSB2YWwpIHtcclxuICAgICAgICBsYWJlbHMucHVzaChpdGVtLmxhYmVsKVxyXG4gICAgICAgIG1hdGNoQ2FzY2FkZXJEYXRhKCsraW5kZXgsIGl0ZW0uY2hpbGRyZW4sIHZhbHVlcywgbGFiZWxzKVxyXG4gICAgICB9XHJcbiAgICB9KVxyXG4gIH1cclxufVxyXG5cclxuZnVuY3Rpb24gZm9ybWF0RGF0ZVBpY2tlciAoZGVmYXVsdEZvcm1hdDogYW55KSB7XHJcbiAgcmV0dXJuIGZ1bmN0aW9uIChoOiBGdW5jdGlvbiwgeyBwcm9wcyA9IHt9IH06IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgIGlmIChjZWxsVmFsdWUpIHtcclxuICAgICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgZGVmYXVsdEZvcm1hdClcclxuICAgIH1cclxuICAgIHJldHVybiBjZWxsVGV4dChoLCBjZWxsVmFsdWUpXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRQcm9wcyAoeyAkdGFibGUgfTogYW55LCB7IHByb3BzIH06IGFueSkge1xyXG4gIHJldHVybiBYRVV0aWxzLmFzc2lnbigkdGFibGUudlNpemUgPyB7IHNpemU6ICR0YWJsZS52U2l6ZSB9IDoge30sIHByb3BzKVxyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRDZWxsRXZlbnRzIChyZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgbGV0IHsgbmFtZSwgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgbGV0IHsgJHRhYmxlIH0gPSBwYXJhbXNcclxuICBsZXQgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICBjYXNlICdBQXV0b0NvbXBsZXRlJzpcclxuICAgICAgdHlwZSA9ICdzZWxlY3QnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXQnOlxyXG4gICAgICB0eXBlID0gJ2lucHV0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0TnVtYmVyJzpcclxuICAgICAgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIGxldCBvbiA9IHtcclxuICAgIFt0eXBlXTogKGV2bnQ6IGFueSkgPT4ge1xyXG4gICAgICAkdGFibGUudXBkYXRlU3RhdHVzKHBhcmFtcylcclxuICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICBldmVudHNbdHlwZV0ocGFyYW1zLCBldm50KVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG4gIGlmIChldmVudHMpIHtcclxuICAgIFhFVXRpbHMuYXNzaWduKFxyXG4gICAgICB7fSwgXHJcbiAgICAgIFhFVXRpbHMub2JqZWN0TWFwKGV2ZW50cywgKGNiOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgICAgY2IuYXBwbHkobnVsbCwgW3BhcmFtc10uY29uY2F0LmFwcGx5KHBhcmFtcywgYXJncykpXHJcbiAgICAgIH0pLFxyXG4gICAgICBvblxyXG4gICAgKVxyXG4gIH1cclxuICByZXR1cm4gb25cclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEVkaXRSZW5kZXIgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgbGV0IHByb3BzID0gZ2V0UHJvcHMocGFyYW1zLCByZW5kZXJPcHRzKVxyXG4gIHJldHVybiBbXHJcbiAgICBoKHJlbmRlck9wdHMubmFtZSwge1xyXG4gICAgICBwcm9wcyxcclxuICAgICAgYXR0cnMsXHJcbiAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KSxcclxuICAgICAgICBjYWxsYmFjayAodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIHZhbHVlKVxyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgfSlcclxuICBdXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldEZpbHRlckV2ZW50cyAob246IGFueSwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gIGxldCB7IGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gIGlmIChldmVudHMpIHtcclxuICAgIFhFVXRpbHMuYXNzaWduKHt9LCBYRVV0aWxzLm9iamVjdE1hcChldmVudHMsIChjYjogRnVuY3Rpb24pID0+IGZ1bmN0aW9uICguLi5hcmdzOiBhbnlbXSkge1xyXG4gICAgICBjYi5hcHBseShudWxsLCBbcGFyYW1zXS5jb25jYXQuYXBwbHkocGFyYW1zLCBhcmdzKSlcclxuICAgIH0pLCBvbilcclxuICB9XHJcbiAgcmV0dXJuIG9uXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXJSZW5kZXIgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICBsZXQgeyBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gIGxldCB7IG5hbWUsIGF0dHJzLCBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgbGV0IHR5cGUgPSAnY2hhbmdlJ1xyXG4gIHN3aXRjaCAobmFtZSkge1xyXG4gICAgY2FzZSAnQUF1dG9Db21wbGV0ZSc6XHJcbiAgICAgIHR5cGUgPSAnc2VsZWN0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0JzpcclxuICAgICAgdHlwZSA9ICdpbnB1dCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dE51bWJlcic6XHJcbiAgICAgIHR5cGUgPSAnY2hhbmdlJ1xyXG4gICAgICBicmVha1xyXG4gIH1cclxuICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgIHJldHVybiBoKG5hbWUsIHtcclxuICAgICAgcHJvcHMsXHJcbiAgICAgIGF0dHJzLFxyXG4gICAgICBtb2RlbDoge1xyXG4gICAgICAgIHZhbHVlOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgY2FsbGJhY2sgKG9wdGlvblZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgIGl0ZW0uZGF0YSA9IG9wdGlvblZhbHVlXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBvbjogZ2V0RmlsdGVyRXZlbnRzKHtcclxuICAgICAgICBbdHlwZV0gKGV2bnQ6IGFueSkge1xyXG4gICAgICAgICAgaGFuZGxlQ29uZmlybUZpbHRlcihjb250ZXh0LCBjb2x1bW4sICEhaXRlbS5kYXRhLCBpdGVtKVxyXG4gICAgICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICAgICAgZXZlbnRzW3R5cGVdKHBhcmFtcywgZXZudClcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0sIHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgIH0pXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gaGFuZGxlQ29uZmlybUZpbHRlciAoY29udGV4dDogYW55LCBjb2x1bW46IGFueSwgY2hlY2tlZDogYW55LCBpdGVtOiBhbnkpIHtcclxuICBjb250ZXh0W2NvbHVtbi5maWx0ZXJNdWx0aXBsZSA/ICdjaGFuZ2VNdWx0aXBsZU9wdGlvbicgOiAnY2hhbmdlUmFkaW9PcHRpb24nXSh7fSwgY2hlY2tlZCwgaXRlbSlcclxufVxyXG5cclxuZnVuY3Rpb24gZGVmYXVsdEZpbHRlck1ldGhvZCAoeyBvcHRpb24sIHJvdywgY29sdW1uIH06IGFueSkge1xyXG4gIGxldCB7IGRhdGEgfSA9IG9wdGlvblxyXG4gIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cclxuICByZXR1cm4gY2VsbFZhbHVlID09PSBkYXRhXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlbmRlck9wdGlvbnMgKGg6IEZ1bmN0aW9uLCBvcHRpb25zOiBhbnksIG9wdGlvblByb3BzOiBhbnkpIHtcclxuICBsZXQgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gIGxldCB2YWx1ZVByb3AgPSBvcHRpb25Qcm9wcy52YWx1ZSB8fCAndmFsdWUnXHJcbiAgcmV0dXJuIFhFVXRpbHMubWFwKG9wdGlvbnMsIChpdGVtOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHtcclxuICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHRpb24nLCB7XHJcbiAgICAgIHByb3BzOiB7XHJcbiAgICAgICAgdmFsdWU6IGl0ZW1bdmFsdWVQcm9wXVxyXG4gICAgICB9LFxyXG4gICAgICBrZXk6IGluZGV4XHJcbiAgICB9LCBpdGVtW2xhYmVsUHJvcF0pXHJcbiAgfSlcclxufVxyXG5cclxuZnVuY3Rpb24gY2VsbFRleHQgKGg6IEZ1bmN0aW9uLCBjZWxsVmFsdWU6IGFueSkge1xyXG4gIHJldHVybiBbJycgKyAoY2VsbFZhbHVlID09PSBudWxsIHx8IGNlbGxWYWx1ZSA9PT0gdm9pZCAwID8gJycgOiBjZWxsVmFsdWUpXVxyXG59XHJcblxyXG4vKipcclxuICog5riy5p+T5Ye95pWwXHJcbiAqL1xyXG5jb25zdCByZW5kZXJNYXAgPSB7XHJcbiAgQUF1dG9Db21wbGV0ZToge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJGaWx0ZXI6IGRlZmF1bHRGaWx0ZXJSZW5kZXIsXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuICB9LFxyXG4gIEFJbnB1dDoge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0JyxcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJGaWx0ZXI6IGRlZmF1bHRGaWx0ZXJSZW5kZXIsXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuICB9LFxyXG4gIEFJbnB1dE51bWJlcjoge1xyXG4gICAgYXV0b2ZvY3VzOiAnaW5wdXQuYW50LWlucHV0LW51bWJlci1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBkZWZhdWx0RmlsdGVyUmVuZGVyLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kXHJcbiAgfSxcclxuICBBU2VsZWN0OiB7XHJcbiAgICByZW5kZXJFZGl0IChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICBsZXQgeyBvcHRpb25zLCBvcHRpb25Hcm91cHMsIG9wdGlvblByb3BzID0ge30sIG9wdGlvbkdyb3VwUHJvcHMgPSB7fSB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGxldCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgbGV0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gW1xyXG4gICAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgICAgICAgIGNhbGxiYWNrIChjZWxsVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIGNlbGxWYWx1ZSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICAgIH0sIFhFVXRpbHMubWFwKG9wdGlvbkdyb3VwcywgKGdyb3VwOiBhbnksIGdJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdC1vcHQtZ3JvdXAnLCB7XHJcbiAgICAgICAgICAgICAga2V5OiBnSW5kZXhcclxuICAgICAgICAgICAgfSwgW1xyXG4gICAgICAgICAgICAgIGgoJ3NwYW4nLCB7XHJcbiAgICAgICAgICAgICAgICBzbG90OiAnbGFiZWwnXHJcbiAgICAgICAgICAgICAgfSwgZ3JvdXBbZ3JvdXBMYWJlbF0pXHJcbiAgICAgICAgICAgIF0uY29uY2F0KFxyXG4gICAgICAgICAgICAgIHJlbmRlck9wdGlvbnMoaCwgZ3JvdXBbZ3JvdXBPcHRpb25zXSwgb3B0aW9uUHJvcHMpXHJcbiAgICAgICAgICAgICkpXHJcbiAgICAgICAgICB9KSlcclxuICAgICAgICBdXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIFtcclxuICAgICAgICBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgIHByb3BzLFxyXG4gICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgICAgICBjYWxsYmFjayAoY2VsbFZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICBYRVV0aWxzLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgY2VsbFZhbHVlKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgb246IGdldENlbGxFdmVudHMocmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBwcm9wcyA9IHt9LCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgbGFiZWxQcm9wID0gb3B0aW9uUHJvcHMubGFiZWwgfHwgJ2xhYmVsJ1xyXG4gICAgICBsZXQgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gICAgICBsZXQgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICAgIGlmICghKGNlbGxWYWx1ZSA9PT0gbnVsbCB8fCBjZWxsVmFsdWUgPT09IHVuZGVmaW5lZCB8fCBjZWxsVmFsdWUgPT09ICcnKSkge1xyXG4gICAgICAgIHJldHVybiBjZWxsVGV4dChoLCBYRVV0aWxzLm1hcChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnID8gY2VsbFZhbHVlIDogW2NlbGxWYWx1ZV0sIG9wdGlvbkdyb3VwcyA/ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgICAgICBsZXQgc2VsZWN0SXRlbVxyXG4gICAgICAgICAgZm9yIChsZXQgaW5kZXggPSAwOyBpbmRleCA8IG9wdGlvbkdyb3Vwcy5sZW5ndGg7IGluZGV4KyspIHtcclxuICAgICAgICAgICAgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25Hcm91cHNbaW5kZXhdW2dyb3VwT3B0aW9uc10sIChpdGVtOiBhbnkpID0+IGl0ZW1bdmFsdWVQcm9wXSA9PT0gdmFsdWUpXHJcbiAgICAgICAgICAgIGlmIChzZWxlY3RJdGVtKSB7XHJcbiAgICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiBudWxsXHJcbiAgICAgICAgfSA6ICh2YWx1ZTogYW55KSA9PiB7XHJcbiAgICAgICAgICBsZXQgc2VsZWN0SXRlbSA9IFhFVXRpbHMuZmluZChvcHRpb25zLCAoaXRlbTogYW55KSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICAgICAgcmV0dXJuIHNlbGVjdEl0ZW0gPyBzZWxlY3RJdGVtW2xhYmVsUHJvcF0gOiBudWxsXHJcbiAgICAgICAgfSkuam9pbignOycpKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCAnJylcclxuICAgIH0sXHJcbiAgICByZW5kZXJGaWx0ZXIgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55LCBjb250ZXh0OiBhbnkpIHtcclxuICAgICAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IHsgYXR0cnMsIGV2ZW50cyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgICAgIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGxldCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgbGV0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICAgIHZhbHVlOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sgKG9wdGlvblZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZGF0YSA9IG9wdGlvblZhbHVlXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbjogZ2V0RmlsdGVyRXZlbnRzKHtcclxuICAgICAgICAgICAgICBbdHlwZV0gKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dCwgY29sdW1uLCB2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwLCBpdGVtKVxyXG4gICAgICAgICAgICAgICAgaWYgKGV2ZW50cyAmJiBldmVudHNbdHlwZV0pIHtcclxuICAgICAgICAgICAgICAgICAgZXZlbnRzW3R5cGVdKHBhcmFtcywgdmFsdWUpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgICB9LCBYRVV0aWxzLm1hcChvcHRpb25Hcm91cHMsIChncm91cDogYW55LCBnSW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgIGtleTogZ0luZGV4XHJcbiAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xyXG4gICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxyXG4gICAgICAgICAgICApKVxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgfSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICAgICAgY2FsbGJhY2sgKG9wdGlvblZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICBpdGVtLmRhdGEgPSBvcHRpb25WYWx1ZVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgb246IGdldEZpbHRlckV2ZW50cyh7XHJcbiAgICAgICAgICAgIGNoYW5nZSAodmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dCwgY29sdW1uLCB2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwLCBpdGVtKVxyXG4gICAgICAgICAgICAgIGlmIChldmVudHMgJiYgZXZlbnRzW3R5cGVdKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudHNbdHlwZV0ocGFyYW1zLCB2YWx1ZSlcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sIHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgfSlcclxuICAgIH0sXHJcbiAgICBmaWx0ZXJNZXRob2QgKHsgb3B0aW9uLCByb3csIGNvbHVtbiB9OiBhbnkpIHtcclxuICAgICAgbGV0IHsgZGF0YSB9ID0gb3B0aW9uXHJcbiAgICAgIGxldCB7IHByb3BlcnR5LCBmaWx0ZXJSZW5kZXI6IHJlbmRlck9wdHMgfSA9IGNvbHVtblxyXG4gICAgICBsZXQgeyBwcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIHByb3BlcnR5KVxyXG4gICAgICBpZiAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJykge1xyXG4gICAgICAgIGlmIChYRVV0aWxzLmlzQXJyYXkoY2VsbFZhbHVlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIFhFVXRpbHMuaW5jbHVkZUFycmF5cyhjZWxsVmFsdWUsIGRhdGEpXHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBkYXRhLmluZGV4T2YoY2VsbFZhbHVlKSA+IC0xXHJcbiAgICAgIH1cclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgICAgIHJldHVybiBjZWxsVmFsdWUgPT0gZGF0YVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgQUNhc2NhZGVyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckNlbGwgKGg6IEZ1bmN0aW9uLCB7IHByb3BzID0ge30gfTogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgdmFyIHZhbHVlcyA9IGNlbGxWYWx1ZSB8fCBbXVxyXG4gICAgICB2YXIgbGFiZWxzOiBBcnJheTxhbnk+ID0gW11cclxuICAgICAgbWF0Y2hDYXNjYWRlckRhdGEoMCwgcHJvcHMub3B0aW9ucywgdmFsdWVzLCBsYWJlbHMpXHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCAocHJvcHMuc2hvd0FsbExldmVscyA9PT0gZmFsc2UgPyBsYWJlbHMuc2xpY2UobGFiZWxzLmxlbmd0aCAtIDEsIGxhYmVscy5sZW5ndGgpIDogbGFiZWxzKS5qb2luKGAgJHtwcm9wcy5zZXBhcmF0b3IgfHwgJy8nfSBgKSlcclxuICAgIH1cclxuICB9LFxyXG4gIEFEYXRlUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktTU0tREQnKVxyXG4gIH0sXHJcbiAgQU1vbnRoUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktTU0nKVxyXG4gIH0sXHJcbiAgQVJhbmdlUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckNlbGwgKGg6IEZ1bmN0aW9uLCB7IHByb3BzID0ge30gfTogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCBjZWxsVmFsdWUgPSBYRVV0aWxzLmdldChyb3csIGNvbHVtbi5wcm9wZXJ0eSlcclxuICAgICAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgICAgIGNlbGxWYWx1ZSA9IFhFVXRpbHMubWFwKGNlbGxWYWx1ZSwgKGRhdGU6IGFueSkgPT4gZGF0ZS5mb3JtYXQocHJvcHMuZm9ybWF0IHx8ICdZWVlZLU1NLUREJykpLmpvaW4oJyB+ICcpXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIGNlbGxWYWx1ZSlcclxuICAgIH1cclxuICB9LFxyXG4gIEFXZWVrUGlja2VyOiB7XHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckNlbGw6IGZvcm1hdERhdGVQaWNrZXIoJ1lZWVktV1flkagnKVxyXG4gIH0sXHJcbiAgQVRpbWVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignSEg6bW06c3MnKVxyXG4gIH0sXHJcbiAgQVRyZWVTZWxlY3Q6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogRnVuY3Rpb24sIHsgcHJvcHMgPSB7fSB9OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICBpZiAoY2VsbFZhbHVlICYmIChwcm9wcy50cmVlQ2hlY2thYmxlIHx8IHByb3BzLm11bHRpcGxlKSkge1xyXG4gICAgICAgIGNlbGxWYWx1ZSA9IGNlbGxWYWx1ZS5qb2luKCc7JylcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgY2VsbFZhbHVlKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgQVJhdGU6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJGaWx0ZXI6IGRlZmF1bHRGaWx0ZXJSZW5kZXIsXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuICB9LFxyXG4gIEFTd2l0Y2g6IHtcclxuICAgIHJlbmRlckRlZmF1bHQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJGaWx0ZXI6IGRlZmF1bHRGaWx0ZXJSZW5kZXIsXHJcbiAgICBmaWx0ZXJNZXRob2Q6IGRlZmF1bHRGaWx0ZXJNZXRob2RcclxuICB9XHJcbn1cclxuXHJcbi8qKlxyXG4gKiDkuovku7blhbzlrrnmgKflpITnkIZcclxuICovXHJcbmZ1bmN0aW9uIGhhbmRsZUNsZWFyRXZlbnQgKHBhcmFtczogYW55LCBldm50OiBhbnksIGNvbnRleHQ6IGFueSkge1xyXG4gIGxldCB7IGdldEV2ZW50VGFyZ2V0Tm9kZSB9ID0gY29udGV4dFxyXG4gIGxldCBib2R5RWxlbSA9IGRvY3VtZW50LmJvZHlcclxuICBpZiAoXHJcbiAgICAvLyDkuIvmi4nmoYZcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1zZWxlY3QtZHJvcGRvd24nKS5mbGFnIHx8XHJcbiAgICAvLyDnuqfogZRcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC1jYXNjYWRlci1tZW51cycpLmZsYWcgfHxcclxuICAgIC8vIOaXpeacn1xyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhbGVuZGFyLXBpY2tlci1jb250YWluZXInKS5mbGFnIHx8XHJcbiAgICAvLyDml7bpl7TpgInmi6lcclxuICAgIGdldEV2ZW50VGFyZ2V0Tm9kZShldm50LCBib2R5RWxlbSwgJ2FudC10aW1lLXBpY2tlci1wYW5lbCcpLmZsYWdcclxuICApIHtcclxuICAgIHJldHVybiBmYWxzZVxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOWfuuS6jiB2eGUtdGFibGUg6KGo5qC855qE6YCC6YWN5o+S5Lu277yM55So5LqO5YW85a65IGFudC1kZXNpZ24tdnVlIOe7hOS7tuW6k1xyXG4gKi9cclxuZXhwb3J0IGNvbnN0IFZYRVRhYmxlUGx1Z2luQW50ZCA9IHtcclxuICBpbnN0YWxsICh4dGFibGU6IHR5cGVvZiBWWEVUYWJsZSkge1xyXG4gICAgbGV0IHsgaW50ZXJjZXB0b3IsIHJlbmRlcmVyIH0gPSB4dGFibGVcclxuICAgIHJlbmRlcmVyLm1peGluKHJlbmRlck1hcClcclxuICAgIGludGVyY2VwdG9yLmFkZCgnZXZlbnQuY2xlYXJGaWx0ZXInLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gICAgaW50ZXJjZXB0b3IuYWRkKCdldmVudC5jbGVhckFjdGl2ZWQnLCBoYW5kbGVDbGVhckV2ZW50KVxyXG4gIH1cclxufVxyXG5cclxuaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5WWEVUYWJsZSkge1xyXG4gIHdpbmRvdy5WWEVUYWJsZS51c2UoVlhFVGFibGVQbHVnaW5BbnRkKVxyXG59XHJcblxyXG5mdW5jdGlvbiB0b01vbWVudFN0cmluZyAoY2VsbFZhbHVlOiBhbnksIGZvcm1hdDogc3RyaW5nKTogc3RyaW5nIHtcclxuICByZXR1cm4gY2VsbFZhbHVlID8gY2VsbFZhbHVlLmZvcm1hdChmb3JtYXQpIDogJydcclxufVxyXG5cclxuZGVjbGFyZSBtb2R1bGUgJ3hlLXV0aWxzL21ldGhvZHMveGUtdXRpbHMnIHtcclxuICBpbnRlcmZhY2UgWEVVdGlsc01ldGhvZHMge1xyXG4gICAgLyoqXHJcbiAgICAgKiDlsIYgTW9tZW50IOaXpeacn+agvOW8j+WMluS4uuWtl+espuS4slxyXG4gICAgICogQHBhcmFtIGNlbGxWYWx1ZSDlgLxcclxuICAgICAqIEBwYXJhbSBmb3JtYXQg5qC85byP5YyWXHJcbiAgICAgKi9cclxuICAgIHRvTW9tZW50U3RyaW5nOiB0eXBlb2YgdG9Nb21lbnRTdHJpbmc7XHJcbiAgfVxyXG59XHJcblxyXG5YRVV0aWxzLm1peGluKHtcclxuICB0b01vbWVudFN0cmluZ1xyXG59KVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVlhFVGFibGVQbHVnaW5BbnRkXHJcbiJdfQ==
