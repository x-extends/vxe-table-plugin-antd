(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("vxe-table-plugin-antd", [], factory);
  } else if (typeof exports !== "undefined") {
    factory();
  } else {
    var mod = {
      exports: {}
    };
    factory();
    global.VXETablePluginAntd = mod.exports.default;
  }
})(this, function () {
  "use strict";

  exports.__esModule = true;

  var xe_utils_1 = require("xe-utils");

  function matchCascaderData(index, list, values, labels) {
    var val = values[index];

    if (list && values.length > index) {
      xe_utils_1["default"].each(list, function (item) {
        if (item.value === val) {
          labels.push(item.label);
          matchCascaderData(++index, item.children, values, labels);
        }
      });
    }
  }

  function formatDatePicker(defaultFormat) {
    return function (h, _a, params) {
      var _b = _a.props,
          props = _b === void 0 ? {} : _b;
      var row = params.row,
          column = params.column;
      var cellValue = xe_utils_1["default"].get(row, column.property);

      if (cellValue) {
        cellValue = cellValue.format(props.format || defaultFormat);
      }

      return cellText(h, cellValue);
    };
  }

  function getProps(_a, _b) {
    var $table = _a.$table;
    var props = _b.props;
    return xe_utils_1["default"].assign($table.vSize ? {
      size: $table.vSize
    } : {}, props);
  }

  function getCellEvents(renderOpts, params) {
    var _a;

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

    var on = (_a = {}, _a[type] = function () {
      return $table.updateStatus(params);
    }, _a);

    if (events) {
      xe_utils_1["default"].assign(on, xe_utils_1["default"].objectMap(events, function (cb) {
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
        value: xe_utils_1["default"].get(row, column.property),
        callback: function callback(value) {
          xe_utils_1["default"].set(row, column.property, value);
        }
      },
      on: getCellEvents(renderOpts, params)
    })];
  }

  function getFilterEvents(on, renderOpts, params) {
    var events = renderOpts.events;

    if (events) {
      xe_utils_1["default"].assign(on, xe_utils_1["default"].objectMap(events, function (cb) {
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
      var _a;

      return h(name, {
        props: props,
        attrs: attrs,
        model: {
          value: item.data,
          callback: function callback(optionValue) {
            item.data = optionValue;
          }
        },
        on: getFilterEvents((_a = {}, _a[type] = function () {
          handleConfirmFilter(context, column, !!item.data, item);
        }, _a), renderOpts, params)
      });
    });
  }

  function handleConfirmFilter(context, column, checked, item) {
    context[column.filterMultiple ? 'changeMultipleOption' : 'changeRadioOption']({}, checked, item);
  }

  function defaultFilterMethod(_a) {
    var option = _a.option,
        row = _a.row,
        column = _a.column;
    var data = option.data;
    var cellValue = xe_utils_1["default"].get(row, column.property);
    /* eslint-disable eqeqeq */

    return cellValue === data;
  }

  function renderOptions(h, options, optionProps) {
    var labelProp = optionProps.label || 'label';
    var valueProp = optionProps.value || 'value';
    return xe_utils_1["default"].map(options, function (item, index) {
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
            _a = renderOpts.optionProps,
            optionProps = _a === void 0 ? {} : _a,
            _b = renderOpts.optionGroupProps,
            optionGroupProps = _b === void 0 ? {} : _b;
        var row = params.row,
            column = params.column;
        var attrs = renderOpts.attrs;
        var props = getProps(params, renderOpts);

        if (optionGroups) {
          var groupOptions_1 = optionGroupProps.options || 'options';
          var groupLabel_1 = optionGroupProps.label || 'label';
          return [h('a-select', {
            props: props,
            attrs: attrs,
            model: {
              value: xe_utils_1["default"].get(row, column.property),
              callback: function callback(cellValue) {
                xe_utils_1["default"].set(row, column.property, cellValue);
              }
            },
            on: getCellEvents(renderOpts, params)
          }, xe_utils_1["default"].map(optionGroups, function (group, gIndex) {
            return h('a-select-opt-group', {
              key: gIndex
            }, [h('span', {
              slot: 'label'
            }, group[groupLabel_1])].concat(renderOptions(h, group[groupOptions_1], optionProps)));
          }))];
        }

        return [h('a-select', {
          props: props,
          attrs: attrs,
          model: {
            value: xe_utils_1["default"].get(row, column.property),
            callback: function callback(cellValue) {
              xe_utils_1["default"].set(row, column.property, cellValue);
            }
          },
          on: getCellEvents(renderOpts, params)
        }, renderOptions(h, options, optionProps))];
      },
      renderCell: function renderCell(h, renderOpts, params) {
        var options = renderOpts.options,
            optionGroups = renderOpts.optionGroups,
            _a = renderOpts.props,
            props = _a === void 0 ? {} : _a,
            _b = renderOpts.optionProps,
            optionProps = _b === void 0 ? {} : _b,
            _c = renderOpts.optionGroupProps,
            optionGroupProps = _c === void 0 ? {} : _c;
        var row = params.row,
            column = params.column;
        var labelProp = optionProps.label || 'label';
        var valueProp = optionProps.value || 'value';
        var groupOptions = optionGroupProps.options || 'options';
        var cellValue = xe_utils_1["default"].get(row, column.property);

        if (!(cellValue === null || cellValue === undefined || cellValue === '')) {
          return cellText(h, xe_utils_1["default"].map(props.mode === 'multiple' ? cellValue : [cellValue], optionGroups ? function (value) {
            var selectItem;

            for (var index = 0; index < optionGroups.length; index++) {
              selectItem = xe_utils_1["default"].find(optionGroups[index][groupOptions], function (item) {
                return item[valueProp] === value;
              });

              if (selectItem) {
                break;
              }
            }

            return selectItem ? selectItem[labelProp] : null;
          } : function (value) {
            var selectItem = xe_utils_1["default"].find(options, function (item) {
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
            _a = renderOpts.optionProps,
            optionProps = _a === void 0 ? {} : _a,
            _b = renderOpts.optionGroupProps,
            optionGroupProps = _b === void 0 ? {} : _b;
        var column = params.column;
        var attrs = renderOpts.attrs;
        var props = getProps(params, renderOpts);

        if (optionGroups) {
          var groupOptions_2 = optionGroupProps.options || 'options';
          var groupLabel_2 = optionGroupProps.label || 'label';
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
            }, xe_utils_1["default"].map(optionGroups, function (group, gIndex) {
              return h('a-select-opt-group', {
                key: gIndex
              }, [h('span', {
                slot: 'label'
              }, group[groupLabel_2])].concat(renderOptions(h, group[groupOptions_2], optionProps)));
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
      filterMethod: function filterMethod(_a) {
        var option = _a.option,
            row = _a.row,
            column = _a.column;
        var data = option.data;
        var property = column.property,
            renderOpts = column.filterRender;
        var _b = renderOpts.props,
            props = _b === void 0 ? {} : _b;
        var cellValue = xe_utils_1["default"].get(row, property);

        if (props.mode === 'multiple') {
          if (xe_utils_1["default"].isArray(cellValue)) {
            return xe_utils_1["default"].includeArrays(cellValue, data);
          }

          return data.indexOf(cellValue) > -1;
        }
        /* eslint-disable eqeqeq */


        return cellValue == data;
      }
    },
    ACascader: {
      renderEdit: defaultEditRender,
      renderCell: function renderCell(h, _a, params) {
        var _b = _a.props,
            props = _b === void 0 ? {} : _b;
        var row = params.row,
            column = params.column;
        var cellValue = xe_utils_1["default"].get(row, column.property);
        var values = cellValue || [];
        var labels = [];
        matchCascaderData(0, props.options, values, labels);
        return cellText(h, (props.showAllLevels === false ? labels.slice(labels.length - 1, labels.length) : labels).join(" " + (props.separator || '/') + " "));
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
      renderCell: function renderCell(h, _a, params) {
        var _b = _a.props,
            props = _b === void 0 ? {} : _b;
        var row = params.row,
            column = params.column;
        var cellValue = xe_utils_1["default"].get(row, column.property);

        if (cellValue) {
          cellValue = xe_utils_1["default"].map(cellValue, function (date) {
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
      renderCell: function renderCell(h, _a, params) {
        var _b = _a.props,
            props = _b === void 0 ? {} : _b;
        var row = params.row,
            column = params.column;
        var cellValue = xe_utils_1["default"].get(row, column.property);

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


  exports.VXETablePluginAntd = {
    install: function install(xtable) {
      var interceptor = xtable.interceptor,
          renderer = xtable.renderer;
      renderer.mixin(renderMap);
      interceptor.add('event.clear_filter', handleClearEvent);
      interceptor.add('event.clear_actived', handleClearEvent);
    }
  };

  if (typeof window !== 'undefined' && window.VXETable) {
    window.VXETable.use(exports.VXETablePluginAntd);
  }

  xe_utils_1["default"].mixin({
    toMomentString: function toMomentString(cellValue, format) {
      return cellValue ? cellValue.format(format) : '';
    }
  });
  exports["default"] = exports.VXETablePluginAntd;
});