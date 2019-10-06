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

  var on = _defineProperty({}, type, function () {
    return $table.updateStatus(params);
  });

  if (events) {
    _xeUtils["default"].assign(on, _xeUtils["default"].objectMap(events, function (cb) {
      return function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }

        cb.apply(null, [params].concat.apply(params, args));
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
        for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
          args[_key2] = arguments[_key2];
        }

        cb.apply(null, [params].concat.apply(params, args));
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluZGV4LnRzIl0sIm5hbWVzIjpbIm1hdGNoQ2FzY2FkZXJEYXRhIiwiaW5kZXgiLCJsaXN0IiwidmFsdWVzIiwibGFiZWxzIiwidmFsIiwibGVuZ3RoIiwiWEVVdGlscyIsImVhY2giLCJpdGVtIiwidmFsdWUiLCJwdXNoIiwibGFiZWwiLCJjaGlsZHJlbiIsImZvcm1hdERhdGVQaWNrZXIiLCJkZWZhdWx0Rm9ybWF0IiwiaCIsInBhcmFtcyIsInByb3BzIiwicm93IiwiY29sdW1uIiwiY2VsbFZhbHVlIiwiZ2V0IiwicHJvcGVydHkiLCJmb3JtYXQiLCJjZWxsVGV4dCIsImdldFByb3BzIiwiJHRhYmxlIiwiYXNzaWduIiwidlNpemUiLCJzaXplIiwiZ2V0Q2VsbEV2ZW50cyIsInJlbmRlck9wdHMiLCJuYW1lIiwiZXZlbnRzIiwidHlwZSIsIm9uIiwidXBkYXRlU3RhdHVzIiwib2JqZWN0TWFwIiwiY2IiLCJhcmdzIiwiYXBwbHkiLCJjb25jYXQiLCJkZWZhdWx0RWRpdFJlbmRlciIsImF0dHJzIiwibW9kZWwiLCJjYWxsYmFjayIsInNldCIsImdldEZpbHRlckV2ZW50cyIsImRlZmF1bHRGaWx0ZXJSZW5kZXIiLCJjb250ZXh0IiwiZmlsdGVycyIsIm1hcCIsImRhdGEiLCJvcHRpb25WYWx1ZSIsImhhbmRsZUNvbmZpcm1GaWx0ZXIiLCJjaGVja2VkIiwiZmlsdGVyTXVsdGlwbGUiLCJkZWZhdWx0RmlsdGVyTWV0aG9kIiwib3B0aW9uIiwicmVuZGVyT3B0aW9ucyIsIm9wdGlvbnMiLCJvcHRpb25Qcm9wcyIsImxhYmVsUHJvcCIsInZhbHVlUHJvcCIsImtleSIsInJlbmRlck1hcCIsIkFBdXRvQ29tcGxldGUiLCJhdXRvZm9jdXMiLCJyZW5kZXJEZWZhdWx0IiwicmVuZGVyRWRpdCIsInJlbmRlckZpbHRlciIsImZpbHRlck1ldGhvZCIsIkFJbnB1dCIsIkFJbnB1dE51bWJlciIsIkFTZWxlY3QiLCJvcHRpb25Hcm91cHMiLCJvcHRpb25Hcm91cFByb3BzIiwiZ3JvdXBPcHRpb25zIiwiZ3JvdXBMYWJlbCIsImdyb3VwIiwiZ0luZGV4Iiwic2xvdCIsInJlbmRlckNlbGwiLCJ1bmRlZmluZWQiLCJtb2RlIiwic2VsZWN0SXRlbSIsImZpbmQiLCJqb2luIiwiY2hhbmdlIiwiZmlsdGVyUmVuZGVyIiwiaXNBcnJheSIsImluY2x1ZGVBcnJheXMiLCJpbmRleE9mIiwiQUNhc2NhZGVyIiwic2hvd0FsbExldmVscyIsInNsaWNlIiwic2VwYXJhdG9yIiwiQURhdGVQaWNrZXIiLCJBTW9udGhQaWNrZXIiLCJBUmFuZ2VQaWNrZXIiLCJkYXRlIiwiQVdlZWtQaWNrZXIiLCJBVGltZVBpY2tlciIsIkFUcmVlU2VsZWN0IiwidHJlZUNoZWNrYWJsZSIsIm11bHRpcGxlIiwiQVJhdGUiLCJBU3dpdGNoIiwiaGFuZGxlQ2xlYXJFdmVudCIsImV2bnQiLCJnZXRFdmVudFRhcmdldE5vZGUiLCJib2R5RWxlbSIsImRvY3VtZW50IiwiYm9keSIsImZsYWciLCJWWEVUYWJsZVBsdWdpbkFudGQiLCJpbnN0YWxsIiwieHRhYmxlIiwiaW50ZXJjZXB0b3IiLCJyZW5kZXJlciIsIm1peGluIiwiYWRkIiwid2luZG93IiwiVlhFVGFibGUiLCJ1c2UiLCJ0b01vbWVudFN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOzs7Ozs7QUFHQSxTQUFTQSxpQkFBVCxDQUE0QkMsS0FBNUIsRUFBMkNDLElBQTNDLEVBQTZEQyxNQUE3RCxFQUFpRkMsTUFBakYsRUFBbUc7QUFDakcsTUFBSUMsR0FBRyxHQUFHRixNQUFNLENBQUNGLEtBQUQsQ0FBaEI7O0FBQ0EsTUFBSUMsSUFBSSxJQUFJQyxNQUFNLENBQUNHLE1BQVAsR0FBZ0JMLEtBQTVCLEVBQW1DO0FBQ2pDTSx3QkFBUUMsSUFBUixDQUFhTixJQUFiLEVBQW1CLFVBQUNPLElBQUQsRUFBYztBQUMvQixVQUFJQSxJQUFJLENBQUNDLEtBQUwsS0FBZUwsR0FBbkIsRUFBd0I7QUFDdEJELFFBQUFBLE1BQU0sQ0FBQ08sSUFB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eC5jb21tb24uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgWEVVdGlscyBmcm9tICd4ZS11dGlscy9tZXRob2RzL3hlLXV0aWxzJ1xyXG5pbXBvcnQgVlhFVGFibGUgZnJvbSAndnhlLXRhYmxlL2xpYi92eGUtdGFibGUnXHJcblxyXG5mdW5jdGlvbiBtYXRjaENhc2NhZGVyRGF0YSAoaW5kZXg6IG51bWJlciwgbGlzdDogQXJyYXk8YW55PiwgdmFsdWVzOiBBcnJheTxhbnk+LCBsYWJlbHM6IEFycmF5PGFueT4pIHtcclxuICBsZXQgdmFsID0gdmFsdWVzW2luZGV4XVxyXG4gIGlmIChsaXN0ICYmIHZhbHVlcy5sZW5ndGggPiBpbmRleCkge1xyXG4gICAgWEVVdGlscy5lYWNoKGxpc3QsIChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgaWYgKGl0ZW0udmFsdWUgPT09IHZhbCkge1xyXG4gICAgICAgIGxhYmVscy5wdXNoKGl0ZW0ubGFiZWwpXHJcbiAgICAgICAgbWF0Y2hDYXNjYWRlckRhdGEoKytpbmRleCwgaXRlbS5jaGlsZHJlbiwgdmFsdWVzLCBsYWJlbHMpXHJcbiAgICAgIH1cclxuICAgIH0pXHJcbiAgfVxyXG59XHJcblxyXG5mdW5jdGlvbiBmb3JtYXREYXRlUGlja2VyIChkZWZhdWx0Rm9ybWF0OiBhbnkpIHtcclxuICByZXR1cm4gZnVuY3Rpb24gKGg6IEZ1bmN0aW9uLCB7IHByb3BzID0ge30gfTogYW55LCBwYXJhbXM6IGFueSkge1xyXG4gICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgaWYgKGNlbGxWYWx1ZSkge1xyXG4gICAgICBjZWxsVmFsdWUgPSBjZWxsVmFsdWUuZm9ybWF0KHByb3BzLmZvcm1hdCB8fCBkZWZhdWx0Rm9ybWF0KVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGNlbGxUZXh0KGgsIGNlbGxWYWx1ZSlcclxuICB9XHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldFByb3BzICh7ICR0YWJsZSB9OiBhbnksIHsgcHJvcHMgfTogYW55KSB7XHJcbiAgcmV0dXJuIFhFVXRpbHMuYXNzaWduKCR0YWJsZS52U2l6ZSA/IHsgc2l6ZTogJHRhYmxlLnZTaXplIH0gOiB7fSwgcHJvcHMpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGdldENlbGxFdmVudHMgKHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyBuYW1lLCBldmVudHMgfSA9IHJlbmRlck9wdHNcclxuICBsZXQgeyAkdGFibGUgfSA9IHBhcmFtc1xyXG4gIGxldCB0eXBlID0gJ2NoYW5nZSdcclxuICBzd2l0Y2ggKG5hbWUpIHtcclxuICAgIGNhc2UgJ0FBdXRvQ29tcGxldGUnOlxyXG4gICAgICB0eXBlID0gJ3NlbGVjdCdcclxuICAgICAgYnJlYWtcclxuICAgIGNhc2UgJ0FJbnB1dCc6XHJcbiAgICAgIHR5cGUgPSAnaW5wdXQnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXROdW1iZXInOlxyXG4gICAgICB0eXBlID0gJ2NoYW5nZSdcclxuICAgICAgYnJlYWtcclxuICB9XHJcbiAgbGV0IG9uID0ge1xyXG4gICAgW3R5cGVdOiAoKSA9PiAkdGFibGUudXBkYXRlU3RhdHVzKHBhcmFtcylcclxuICB9XHJcbiAgaWYgKGV2ZW50cykge1xyXG4gICAgWEVVdGlscy5hc3NpZ24ob24sIFhFVXRpbHMub2JqZWN0TWFwKGV2ZW50cywgKGNiOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGNiLmFwcGx5KG51bGwsIFtwYXJhbXNdLmNvbmNhdC5hcHBseShwYXJhbXMsIGFyZ3MpKVxyXG4gICAgfSkpXHJcbiAgfVxyXG4gIHJldHVybiBvblxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0RWRpdFJlbmRlciAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICBsZXQgeyByb3csIGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgbGV0IHsgYXR0cnMgfSA9IHJlbmRlck9wdHNcclxuICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgcmV0dXJuIFtcclxuICAgIGgocmVuZGVyT3B0cy5uYW1lLCB7XHJcbiAgICAgIHByb3BzLFxyXG4gICAgICBhdHRycyxcclxuICAgICAgbW9kZWw6IHtcclxuICAgICAgICB2YWx1ZTogWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpLFxyXG4gICAgICAgIGNhbGxiYWNrICh2YWx1ZTogYW55KSB7XHJcbiAgICAgICAgICBYRVV0aWxzLnNldChyb3csIGNvbHVtbi5wcm9wZXJ0eSwgdmFsdWUpXHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgICBvbjogZ2V0Q2VsbEV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICB9KVxyXG4gIF1cclxufVxyXG5cclxuZnVuY3Rpb24gZ2V0RmlsdGVyRXZlbnRzIChvbjogYW55LCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgbGV0IHsgZXZlbnRzIH0gPSByZW5kZXJPcHRzXHJcbiAgaWYgKGV2ZW50cykge1xyXG4gICAgWEVVdGlscy5hc3NpZ24ob24sIFhFVXRpbHMub2JqZWN0TWFwKGV2ZW50cywgKGNiOiBGdW5jdGlvbikgPT4gZnVuY3Rpb24gKC4uLmFyZ3M6IGFueVtdKSB7XHJcbiAgICAgIGNiLmFwcGx5KG51bGwsIFtwYXJhbXNdLmNvbmNhdC5hcHBseShwYXJhbXMsIGFyZ3MpKVxyXG4gICAgfSkpXHJcbiAgfVxyXG4gIHJldHVybiBvblxyXG59XHJcblxyXG5mdW5jdGlvbiBkZWZhdWx0RmlsdGVyUmVuZGVyIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgbGV0IHsgY29sdW1uIH0gPSBwYXJhbXNcclxuICBsZXQgeyBuYW1lLCBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICBsZXQgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgc3dpdGNoIChuYW1lKSB7XHJcbiAgICBjYXNlICdBQXV0b0NvbXBsZXRlJzpcclxuICAgICAgdHlwZSA9ICdzZWxlY3QnXHJcbiAgICAgIGJyZWFrXHJcbiAgICBjYXNlICdBSW5wdXQnOlxyXG4gICAgICB0eXBlID0gJ2lucHV0J1xyXG4gICAgICBicmVha1xyXG4gICAgY2FzZSAnQUlucHV0TnVtYmVyJzpcclxuICAgICAgdHlwZSA9ICdjaGFuZ2UnXHJcbiAgICAgIGJyZWFrXHJcbiAgfVxyXG4gIHJldHVybiBjb2x1bW4uZmlsdGVycy5tYXAoKGl0ZW06IGFueSkgPT4ge1xyXG4gICAgcmV0dXJuIGgobmFtZSwge1xyXG4gICAgICBwcm9wcyxcclxuICAgICAgYXR0cnMsXHJcbiAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgdmFsdWU6IGl0ZW0uZGF0YSxcclxuICAgICAgICBjYWxsYmFjayAob3B0aW9uVmFsdWU6IGFueSkge1xyXG4gICAgICAgICAgaXRlbS5kYXRhID0gb3B0aW9uVmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgIH0sXHJcbiAgICAgIG9uOiBnZXRGaWx0ZXJFdmVudHMoe1xyXG4gICAgICAgIFt0eXBlXSAoKSB7XHJcbiAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKGNvbnRleHQsIGNvbHVtbiwgISFpdGVtLmRhdGEsIGl0ZW0pXHJcbiAgICAgICAgfVxyXG4gICAgICB9LCByZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICB9KVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGhhbmRsZUNvbmZpcm1GaWx0ZXIgKGNvbnRleHQ6IGFueSwgY29sdW1uOiBhbnksIGNoZWNrZWQ6IGFueSwgaXRlbTogYW55KSB7XHJcbiAgY29udGV4dFtjb2x1bW4uZmlsdGVyTXVsdGlwbGUgPyAnY2hhbmdlTXVsdGlwbGVPcHRpb24nIDogJ2NoYW5nZVJhZGlvT3B0aW9uJ10oe30sIGNoZWNrZWQsIGl0ZW0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGRlZmF1bHRGaWx0ZXJNZXRob2QgKHsgb3B0aW9uLCByb3csIGNvbHVtbiB9OiBhbnkpIHtcclxuICBsZXQgeyBkYXRhIH0gPSBvcHRpb25cclxuICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgLyogZXNsaW50LWRpc2FibGUgZXFlcWVxICovXHJcbiAgcmV0dXJuIGNlbGxWYWx1ZSA9PT0gZGF0YVxyXG59XHJcblxyXG5mdW5jdGlvbiByZW5kZXJPcHRpb25zIChoOiBGdW5jdGlvbiwgb3B0aW9uczogYW55LCBvcHRpb25Qcm9wczogYW55KSB7XHJcbiAgbGV0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICBsZXQgdmFsdWVQcm9wID0gb3B0aW9uUHJvcHMudmFsdWUgfHwgJ3ZhbHVlJ1xyXG4gIHJldHVybiBYRVV0aWxzLm1hcChvcHRpb25zLCAoaXRlbTogYW55LCBpbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0aW9uJywge1xyXG4gICAgICBwcm9wczoge1xyXG4gICAgICAgIHZhbHVlOiBpdGVtW3ZhbHVlUHJvcF1cclxuICAgICAgfSxcclxuICAgICAga2V5OiBpbmRleFxyXG4gICAgfSwgaXRlbVtsYWJlbFByb3BdKVxyXG4gIH0pXHJcbn1cclxuXHJcbmZ1bmN0aW9uIGNlbGxUZXh0IChoOiBGdW5jdGlvbiwgY2VsbFZhbHVlOiBhbnkpIHtcclxuICByZXR1cm4gWycnICsgKGNlbGxWYWx1ZSA9PT0gbnVsbCB8fCBjZWxsVmFsdWUgPT09IHZvaWQgMCA/ICcnIDogY2VsbFZhbHVlKV1cclxufVxyXG5cclxuLyoqXHJcbiAqIOa4suafk+WHveaVsFxyXG4gKi9cclxuY29uc3QgcmVuZGVyTWFwID0ge1xyXG4gIEFBdXRvQ29tcGxldGU6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBkZWZhdWx0RmlsdGVyUmVuZGVyLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kXHJcbiAgfSxcclxuICBBSW5wdXQ6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dCcsXHJcbiAgICByZW5kZXJEZWZhdWx0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyRmlsdGVyOiBkZWZhdWx0RmlsdGVyUmVuZGVyLFxyXG4gICAgZmlsdGVyTWV0aG9kOiBkZWZhdWx0RmlsdGVyTWV0aG9kXHJcbiAgfSxcclxuICBBSW5wdXROdW1iZXI6IHtcclxuICAgIGF1dG9mb2N1czogJ2lucHV0LmFudC1pbnB1dC1udW1iZXItaW5wdXQnLFxyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckZpbHRlcjogZGVmYXVsdEZpbHRlclJlbmRlcixcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZFxyXG4gIH0sXHJcbiAgQVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdCAoaDogRnVuY3Rpb24sIHJlbmRlck9wdHM6IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgb3B0aW9ucywgb3B0aW9uR3JvdXBzLCBvcHRpb25Qcm9wcyA9IHt9LCBvcHRpb25Hcm91cFByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgeyBhdHRycyB9ID0gcmVuZGVyT3B0c1xyXG4gICAgICBsZXQgcHJvcHMgPSBnZXRQcm9wcyhwYXJhbXMsIHJlbmRlck9wdHMpXHJcbiAgICAgIGlmIChvcHRpb25Hcm91cHMpIHtcclxuICAgICAgICBsZXQgZ3JvdXBPcHRpb25zID0gb3B0aW9uR3JvdXBQcm9wcy5vcHRpb25zIHx8ICdvcHRpb25zJ1xyXG4gICAgICAgIGxldCBncm91cExhYmVsID0gb3B0aW9uR3JvdXBQcm9wcy5sYWJlbCB8fCAnbGFiZWwnXHJcbiAgICAgICAgcmV0dXJuIFtcclxuICAgICAgICAgIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgICAgYXR0cnMsXHJcbiAgICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KSxcclxuICAgICAgICAgICAgICBjYWxsYmFjayAoY2VsbFZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIFhFVXRpbHMuc2V0KHJvdywgY29sdW1uLnByb3BlcnR5LCBjZWxsVmFsdWUpXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbjogZ2V0Q2VsbEV2ZW50cyhyZW5kZXJPcHRzLCBwYXJhbXMpXHJcbiAgICAgICAgICB9LCBYRVV0aWxzLm1hcChvcHRpb25Hcm91cHMsIChncm91cDogYW55LCBnSW5kZXg6IG51bWJlcikgPT4ge1xyXG4gICAgICAgICAgICByZXR1cm4gaCgnYS1zZWxlY3Qtb3B0LWdyb3VwJywge1xyXG4gICAgICAgICAgICAgIGtleTogZ0luZGV4XHJcbiAgICAgICAgICAgIH0sIFtcclxuICAgICAgICAgICAgICBoKCdzcGFuJywge1xyXG4gICAgICAgICAgICAgICAgc2xvdDogJ2xhYmVsJ1xyXG4gICAgICAgICAgICAgIH0sIGdyb3VwW2dyb3VwTGFiZWxdKVxyXG4gICAgICAgICAgICBdLmNvbmNhdChcclxuICAgICAgICAgICAgICByZW5kZXJPcHRpb25zKGgsIGdyb3VwW2dyb3VwT3B0aW9uc10sIG9wdGlvblByb3BzKVxyXG4gICAgICAgICAgICApKVxyXG4gICAgICAgICAgfSkpXHJcbiAgICAgICAgXVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBbXHJcbiAgICAgICAgaCgnYS1zZWxlY3QnLCB7XHJcbiAgICAgICAgICBwcm9wcyxcclxuICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgbW9kZWw6IHtcclxuICAgICAgICAgICAgdmFsdWU6IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KSxcclxuICAgICAgICAgICAgY2FsbGJhY2sgKGNlbGxWYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgWEVVdGlscy5zZXQocm93LCBjb2x1bW4ucHJvcGVydHksIGNlbGxWYWx1ZSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9uOiBnZXRDZWxsRXZlbnRzKHJlbmRlck9wdHMsIHBhcmFtcylcclxuICAgICAgICB9LCByZW5kZXJPcHRpb25zKGgsIG9wdGlvbnMsIG9wdGlvblByb3BzKSlcclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHJlbmRlckNlbGwgKGg6IEZ1bmN0aW9uLCByZW5kZXJPcHRzOiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IG9wdGlvbnMsIG9wdGlvbkdyb3VwcywgcHJvcHMgPSB7fSwgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IGxhYmVsUHJvcCA9IG9wdGlvblByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgbGV0IHZhbHVlUHJvcCA9IG9wdGlvblByb3BzLnZhbHVlIHx8ICd2YWx1ZSdcclxuICAgICAgbGV0IGdyb3VwT3B0aW9ucyA9IG9wdGlvbkdyb3VwUHJvcHMub3B0aW9ucyB8fCAnb3B0aW9ucydcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICBpZiAoIShjZWxsVmFsdWUgPT09IG51bGwgfHwgY2VsbFZhbHVlID09PSB1bmRlZmluZWQgfHwgY2VsbFZhbHVlID09PSAnJykpIHtcclxuICAgICAgICByZXR1cm4gY2VsbFRleHQoaCwgWEVVdGlscy5tYXAocHJvcHMubW9kZSA9PT0gJ211bHRpcGxlJyA/IGNlbGxWYWx1ZSA6IFtjZWxsVmFsdWVdLCBvcHRpb25Hcm91cHMgPyAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgbGV0IHNlbGVjdEl0ZW1cclxuICAgICAgICAgIGZvciAobGV0IGluZGV4ID0gMDsgaW5kZXggPCBvcHRpb25Hcm91cHMubGVuZ3RoOyBpbmRleCsrKSB7XHJcbiAgICAgICAgICAgIHNlbGVjdEl0ZW0gPSBYRVV0aWxzLmZpbmQob3B0aW9uR3JvdXBzW2luZGV4XVtncm91cE9wdGlvbnNdLCAoaXRlbTogYW55KSA9PiBpdGVtW3ZhbHVlUHJvcF0gPT09IHZhbHVlKVxyXG4gICAgICAgICAgICBpZiAoc2VsZWN0SXRlbSkge1xyXG4gICAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBzZWxlY3RJdGVtID8gc2VsZWN0SXRlbVtsYWJlbFByb3BdIDogbnVsbFxyXG4gICAgICAgIH0gOiAodmFsdWU6IGFueSkgPT4ge1xyXG4gICAgICAgICAgbGV0IHNlbGVjdEl0ZW0gPSBYRVV0aWxzLmZpbmQob3B0aW9ucywgKGl0ZW06IGFueSkgPT4gaXRlbVt2YWx1ZVByb3BdID09PSB2YWx1ZSlcclxuICAgICAgICAgIHJldHVybiBzZWxlY3RJdGVtID8gc2VsZWN0SXRlbVtsYWJlbFByb3BdIDogbnVsbFxyXG4gICAgICAgIH0pLmpvaW4oJzsnKSlcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgJycpXHJcbiAgICB9LFxyXG4gICAgcmVuZGVyRmlsdGVyIChoOiBGdW5jdGlvbiwgcmVuZGVyT3B0czogYW55LCBwYXJhbXM6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgICAgIGxldCB7IG9wdGlvbnMsIG9wdGlvbkdyb3Vwcywgb3B0aW9uUHJvcHMgPSB7fSwgb3B0aW9uR3JvdXBQcm9wcyA9IHt9IH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCB7IGNvbHVtbiB9ID0gcGFyYW1zXHJcbiAgICAgIGxldCB7IGF0dHJzIH0gPSByZW5kZXJPcHRzXHJcbiAgICAgIGxldCBwcm9wcyA9IGdldFByb3BzKHBhcmFtcywgcmVuZGVyT3B0cylcclxuICAgICAgaWYgKG9wdGlvbkdyb3Vwcykge1xyXG4gICAgICAgIGxldCBncm91cE9wdGlvbnMgPSBvcHRpb25Hcm91cFByb3BzLm9wdGlvbnMgfHwgJ29wdGlvbnMnXHJcbiAgICAgICAgbGV0IGdyb3VwTGFiZWwgPSBvcHRpb25Hcm91cFByb3BzLmxhYmVsIHx8ICdsYWJlbCdcclxuICAgICAgICByZXR1cm4gY29sdW1uLmZpbHRlcnMubWFwKChpdGVtOiBhbnkpID0+IHtcclxuICAgICAgICAgIHJldHVybiBoKCdhLXNlbGVjdCcsIHtcclxuICAgICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICAgIGF0dHJzLFxyXG4gICAgICAgICAgICBtb2RlbDoge1xyXG4gICAgICAgICAgICAgIHZhbHVlOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgICAgICAgY2FsbGJhY2sgKG9wdGlvblZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGl0ZW0uZGF0YSA9IG9wdGlvblZhbHVlXHJcbiAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBvbjogZ2V0RmlsdGVyRXZlbnRzKHtcclxuICAgICAgICAgICAgICBjaGFuZ2UgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICAgIGhhbmRsZUNvbmZpcm1GaWx0ZXIoY29udGV4dCwgY29sdW1uLCB2YWx1ZSAmJiB2YWx1ZS5sZW5ndGggPiAwLCBpdGVtKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSwgcmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgICAgfSwgWEVVdGlscy5tYXAob3B0aW9uR3JvdXBzLCAoZ3JvdXA6IGFueSwgZ0luZGV4OiBudW1iZXIpID0+IHtcclxuICAgICAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0LW9wdC1ncm91cCcsIHtcclxuICAgICAgICAgICAgICBrZXk6IGdJbmRleFxyXG4gICAgICAgICAgICB9LCBbXHJcbiAgICAgICAgICAgICAgaCgnc3BhbicsIHtcclxuICAgICAgICAgICAgICAgIHNsb3Q6ICdsYWJlbCdcclxuICAgICAgICAgICAgICB9LCBncm91cFtncm91cExhYmVsXSlcclxuICAgICAgICAgICAgXS5jb25jYXQoXHJcbiAgICAgICAgICAgICAgcmVuZGVyT3B0aW9ucyhoLCBncm91cFtncm91cE9wdGlvbnNdLCBvcHRpb25Qcm9wcylcclxuICAgICAgICAgICAgKSlcclxuICAgICAgICAgIH0pKVxyXG4gICAgICAgIH0pXHJcbiAgICAgIH1cclxuICAgICAgcmV0dXJuIGNvbHVtbi5maWx0ZXJzLm1hcCgoaXRlbTogYW55KSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGgoJ2Etc2VsZWN0Jywge1xyXG4gICAgICAgICAgcHJvcHMsXHJcbiAgICAgICAgICBhdHRycyxcclxuICAgICAgICAgIG1vZGVsOiB7XHJcbiAgICAgICAgICAgIHZhbHVlOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgICAgIGNhbGxiYWNrIChvcHRpb25WYWx1ZTogYW55KSB7XHJcbiAgICAgICAgICAgICAgaXRlbS5kYXRhID0gb3B0aW9uVmFsdWVcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIG9uOiBnZXRGaWx0ZXJFdmVudHMoe1xyXG4gICAgICAgICAgICBjaGFuZ2UgKHZhbHVlOiBhbnkpIHtcclxuICAgICAgICAgICAgICBoYW5kbGVDb25maXJtRmlsdGVyKGNvbnRleHQsIGNvbHVtbiwgdmFsdWUgJiYgdmFsdWUubGVuZ3RoID4gMCwgaXRlbSlcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSwgcmVuZGVyT3B0cywgcGFyYW1zKVxyXG4gICAgICAgIH0sIHJlbmRlck9wdGlvbnMoaCwgb3B0aW9ucywgb3B0aW9uUHJvcHMpKVxyXG4gICAgICB9KVxyXG4gICAgfSxcclxuICAgIGZpbHRlck1ldGhvZCAoeyBvcHRpb24sIHJvdywgY29sdW1uIH06IGFueSkge1xyXG4gICAgICBsZXQgeyBkYXRhIH0gPSBvcHRpb25cclxuICAgICAgbGV0IHsgcHJvcGVydHksIGZpbHRlclJlbmRlcjogcmVuZGVyT3B0cyB9ID0gY29sdW1uXHJcbiAgICAgIGxldCB7IHByb3BzID0ge30gfSA9IHJlbmRlck9wdHNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgcHJvcGVydHkpXHJcbiAgICAgIGlmIChwcm9wcy5tb2RlID09PSAnbXVsdGlwbGUnKSB7XHJcbiAgICAgICAgaWYgKFhFVXRpbHMuaXNBcnJheShjZWxsVmFsdWUpKSB7XHJcbiAgICAgICAgICByZXR1cm4gWEVVdGlscy5pbmNsdWRlQXJyYXlzKGNlbGxWYWx1ZSwgZGF0YSlcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIGRhdGEuaW5kZXhPZihjZWxsVmFsdWUpID4gLTFcclxuICAgICAgfVxyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBlcWVxZXEgKi9cclxuICAgICAgcmV0dXJuIGNlbGxWYWx1ZSA9PSBkYXRhXHJcbiAgICB9XHJcbiAgfSxcclxuICBBQ2FzY2FkZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogRnVuY3Rpb24sIHsgcHJvcHMgPSB7fSB9OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICB2YXIgdmFsdWVzID0gY2VsbFZhbHVlIHx8IFtdXHJcbiAgICAgIHZhciBsYWJlbHM6IEFycmF5PGFueT4gPSBbXVxyXG4gICAgICBtYXRjaENhc2NhZGVyRGF0YSgwLCBwcm9wcy5vcHRpb25zLCB2YWx1ZXMsIGxhYmVscylcclxuICAgICAgcmV0dXJuIGNlbGxUZXh0KGgsIChwcm9wcy5zaG93QWxsTGV2ZWxzID09PSBmYWxzZSA/IGxhYmVscy5zbGljZShsYWJlbHMubGVuZ3RoIC0gMSwgbGFiZWxzLmxlbmd0aCkgOiBsYWJlbHMpLmpvaW4oYCAke3Byb3BzLnNlcGFyYXRvciB8fCAnLyd9IGApKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgQURhdGVQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTS1ERCcpXHJcbiAgfSxcclxuICBBTW9udGhQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1NTScpXHJcbiAgfSxcclxuICBBUmFuZ2VQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbCAoaDogRnVuY3Rpb24sIHsgcHJvcHMgPSB7fSB9OiBhbnksIHBhcmFtczogYW55KSB7XHJcbiAgICAgIGxldCB7IHJvdywgY29sdW1uIH0gPSBwYXJhbXNcclxuICAgICAgbGV0IGNlbGxWYWx1ZSA9IFhFVXRpbHMuZ2V0KHJvdywgY29sdW1uLnByb3BlcnR5KVxyXG4gICAgICBpZiAoY2VsbFZhbHVlKSB7XHJcbiAgICAgICAgY2VsbFZhbHVlID0gWEVVdGlscy5tYXAoY2VsbFZhbHVlLCAoZGF0ZTogYW55KSA9PiBkYXRlLmZvcm1hdChwcm9wcy5mb3JtYXQgfHwgJ1lZWVktTU0tREQnKSkuam9pbignIH4gJylcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gY2VsbFRleHQoaCwgY2VsbFZhbHVlKVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgQVdlZWtQaWNrZXI6IHtcclxuICAgIHJlbmRlckVkaXQ6IGRlZmF1bHRFZGl0UmVuZGVyLFxyXG4gICAgcmVuZGVyQ2VsbDogZm9ybWF0RGF0ZVBpY2tlcignWVlZWS1XV+WRqCcpXHJcbiAgfSxcclxuICBBVGltZVBpY2tlcjoge1xyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJDZWxsOiBmb3JtYXREYXRlUGlja2VyKCdISDptbTpzcycpXHJcbiAgfSxcclxuICBBVHJlZVNlbGVjdDoge1xyXG4gICAgcmVuZGVyRWRpdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJDZWxsIChoOiBGdW5jdGlvbiwgeyBwcm9wcyA9IHt9IH06IGFueSwgcGFyYW1zOiBhbnkpIHtcclxuICAgICAgbGV0IHsgcm93LCBjb2x1bW4gfSA9IHBhcmFtc1xyXG4gICAgICBsZXQgY2VsbFZhbHVlID0gWEVVdGlscy5nZXQocm93LCBjb2x1bW4ucHJvcGVydHkpXHJcbiAgICAgIGlmIChjZWxsVmFsdWUgJiYgKHByb3BzLnRyZWVDaGVja2FibGUgfHwgcHJvcHMubXVsdGlwbGUpKSB7XHJcbiAgICAgICAgY2VsbFZhbHVlID0gY2VsbFZhbHVlLmpvaW4oJzsnKVxyXG4gICAgICB9XHJcbiAgICAgIHJldHVybiBjZWxsVGV4dChoLCBjZWxsVmFsdWUpXHJcbiAgICB9XHJcbiAgfSxcclxuICBBUmF0ZToge1xyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckZpbHRlcjogZGVmYXVsdEZpbHRlclJlbmRlcixcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZFxyXG4gIH0sXHJcbiAgQVN3aXRjaDoge1xyXG4gICAgcmVuZGVyRGVmYXVsdDogZGVmYXVsdEVkaXRSZW5kZXIsXHJcbiAgICByZW5kZXJFZGl0OiBkZWZhdWx0RWRpdFJlbmRlcixcclxuICAgIHJlbmRlckZpbHRlcjogZGVmYXVsdEZpbHRlclJlbmRlcixcclxuICAgIGZpbHRlck1ldGhvZDogZGVmYXVsdEZpbHRlck1ldGhvZFxyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIOS6i+S7tuWFvOWuueaAp+WkhOeQhlxyXG4gKi9cclxuZnVuY3Rpb24gaGFuZGxlQ2xlYXJFdmVudCAocGFyYW1zOiBhbnksIGV2bnQ6IGFueSwgY29udGV4dDogYW55KSB7XHJcbiAgbGV0IHsgZ2V0RXZlbnRUYXJnZXROb2RlIH0gPSBjb250ZXh0XHJcbiAgbGV0IGJvZHlFbGVtID0gZG9jdW1lbnQuYm9keVxyXG4gIGlmIChcclxuICAgIC8vIOS4i+aLieahhlxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LXNlbGVjdC1kcm9wZG93bicpLmZsYWcgfHxcclxuICAgIC8vIOe6p+iBlFxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LWNhc2NhZGVyLW1lbnVzJykuZmxhZyB8fFxyXG4gICAgLy8g5pel5pyfXHJcbiAgICBnZXRFdmVudFRhcmdldE5vZGUoZXZudCwgYm9keUVsZW0sICdhbnQtY2FsZW5kYXItcGlja2VyLWNvbnRhaW5lcicpLmZsYWcgfHxcclxuICAgIC8vIOaXtumXtOmAieaLqVxyXG4gICAgZ2V0RXZlbnRUYXJnZXROb2RlKGV2bnQsIGJvZHlFbGVtLCAnYW50LXRpbWUtcGlja2VyLXBhbmVsJykuZmxhZ1xyXG4gICkge1xyXG4gICAgcmV0dXJuIGZhbHNlXHJcbiAgfVxyXG59XHJcblxyXG4vKipcclxuICog5Z+65LqOIHZ4ZS10YWJsZSDooajmoLznmoTpgILphY3mj5Lku7bvvIznlKjkuo7lhbzlrrkgYW50LWRlc2lnbi12dWUg57uE5Lu25bqTXHJcbiAqL1xyXG5leHBvcnQgY29uc3QgVlhFVGFibGVQbHVnaW5BbnRkID0ge1xyXG4gIGluc3RhbGwgKHh0YWJsZTogdHlwZW9mIFZYRVRhYmxlKSB7XHJcbiAgICBsZXQgeyBpbnRlcmNlcHRvciwgcmVuZGVyZXIgfSA9IHh0YWJsZVxyXG4gICAgcmVuZGVyZXIubWl4aW4ocmVuZGVyTWFwKVxyXG4gICAgaW50ZXJjZXB0b3IuYWRkKCdldmVudC5jbGVhckZpbHRlcicsIGhhbmRsZUNsZWFyRXZlbnQpXHJcbiAgICBpbnRlcmNlcHRvci5hZGQoJ2V2ZW50LmNsZWFyQWN0aXZlZCcsIGhhbmRsZUNsZWFyRXZlbnQpXHJcbiAgfVxyXG59XHJcblxyXG5pZiAodHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCcgJiYgd2luZG93LlZYRVRhYmxlKSB7XHJcbiAgd2luZG93LlZYRVRhYmxlLnVzZShWWEVUYWJsZVBsdWdpbkFudGQpXHJcbn1cclxuXHJcbmZ1bmN0aW9uIHRvTW9tZW50U3RyaW5nIChjZWxsVmFsdWU6IGFueSwgZm9ybWF0OiBzdHJpbmcpOiBzdHJpbmcge1xyXG4gIHJldHVybiBjZWxsVmFsdWUgPyBjZWxsVmFsdWUuZm9ybWF0KGZvcm1hdCkgOiAnJ1xyXG59XHJcblxyXG5kZWNsYXJlIG1vZHVsZSAneGUtdXRpbHMvbWV0aG9kcy94ZS11dGlscycge1xyXG4gIGludGVyZmFjZSBYRVV0aWxzTWV0aG9kcyB7XHJcbiAgICAvKipcclxuICAgICAqIOWwhiBNb21lbnQg5pel5pyf5qC85byP5YyW5Li65a2X56ym5LiyXHJcbiAgICAgKiBAcGFyYW0gY2VsbFZhbHVlIOWAvFxyXG4gICAgICogQHBhcmFtIGZvcm1hdCDmoLzlvI/ljJZcclxuICAgICAqL1xyXG4gICAgdG9Nb21lbnRTdHJpbmc6IHR5cGVvZiB0b01vbWVudFN0cmluZztcclxuICB9XHJcbn1cclxuXHJcblhFVXRpbHMubWl4aW4oe1xyXG4gIHRvTW9tZW50U3RyaW5nXHJcbn0pXHJcblxyXG5leHBvcnQgZGVmYXVsdCBWWEVUYWJsZVBsdWdpbkFudGRcclxuIl19
