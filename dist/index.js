(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define("vxe-table-plugin-antd", ["exports", "xe-utils"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("xe-utils"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.XEUtils);
    global.VXETablePluginAntd = mod.exports.default;
  }
})(this, function (_exports, _xeUtils) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports["default"] = void 0;
  _xeUtils = _interopRequireDefault(_xeUtils);

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

  function getCellEvents(editRender, params) {
    var name = editRender.name,
        events = editRender.events;
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

  function defaultCellRender(h, editRender, params) {
    var $table = params.$table,
        row = params.row,
        column = params.column;
    var props = editRender.props;

    if ($table.vSize) {
      props = _xeUtils["default"].assign({
        size: $table.vSize
      }, props);
    }

    return [h(editRender.name, {
      props: props,
      model: {
        value: _xeUtils["default"].get(row, column.property),
        callback: function callback(value) {
          _xeUtils["default"].set(row, column.property, value);
        }
      },
      on: getCellEvents(editRender, params)
    })];
  }

  function getFilterEvents(on, filterRender, params) {
    var events = filterRender.events;

    if (events) {
      _xeUtils["default"].assign(on, _xeUtils["default"].objectMap(events, function (cb) {
        return function () {
          cb.apply(null, [params].concat.apply(params, arguments));
        };
      }));
    }

    return on;
  }

  function defaultFilterRender(h, filterRender, params, context) {
    var $table = params.$table,
        column = params.column;
    var name = filterRender.name,
        props = filterRender.props;
    var type = 'input';

    if ($table.vSize) {
      props = _xeUtils["default"].assign({
        size: $table.vSize
      }, props);
    }

    switch (name) {
      case 'AAutoComplete':
        type = 'select';
        break;

      case 'AInputNumber':
        type = 'change';
        break;
    }

    return column.filters.map(function (item) {
      return h(name, {
        props: props,
        model: {
          value: item.data,
          callback: function callback(optionValue) {
            item.data = optionValue;
          }
        },
        on: getFilterEvents(_defineProperty({}, type, function () {
          context.changeMultipleOption({}, !!item.data, item);
        }), filterRender, params)
      });
    });
  }

  function defaultFilterMethod(_ref2) {
    var option = _ref2.option,
        row = _ref2.row,
        column = _ref2.column;
    var data = option.data;

    var cellValue = _xeUtils["default"].get(row, column.property);

    return cellValue === data;
  }

  function cellText(h, cellValue) {
    return ['' + (cellValue === null || cellValue === void 0 ? '' : cellValue)];
  }
  /**
   * 渲染函数
   * renderEdit(h, editRender, params, context)
   * renderCell(h, editRender, params, context)
   */


  var renderMap = {
    AAutoComplete: {
      autofocus: 'input.ant-input',
      renderEdit: defaultCellRender,
      renderFilter: defaultFilterRender,
      filterMethod: defaultFilterMethod
    },
    AInput: {
      autofocus: 'input.ant-input',
      renderEdit: defaultCellRender,
      renderFilter: defaultFilterRender,
      filterMethod: defaultFilterMethod
    },
    AInputNumber: {
      autofocus: 'input.ant-input-number-input',
      renderEdit: defaultCellRender,
      renderFilter: defaultFilterRender,
      filterMethod: defaultFilterMethod
    },
    ASelect: {
      renderEdit: function renderEdit(h, editRender, params) {
        var options = editRender.options,
            optionGroups = editRender.optionGroups,
            _editRender$props = editRender.props,
            props = _editRender$props === void 0 ? {} : _editRender$props,
            _editRender$optionPro = editRender.optionProps,
            optionProps = _editRender$optionPro === void 0 ? {} : _editRender$optionPro,
            _editRender$optionGro = editRender.optionGroupProps,
            optionGroupProps = _editRender$optionGro === void 0 ? {} : _editRender$optionGro;
        var $table = params.$table,
            row = params.row,
            column = params.column;
        var labelProp = optionProps.label || 'label';
        var valueProp = optionProps.value || 'value';

        if ($table.vSize) {
          props = _xeUtils["default"].assign({
            size: $table.vSize
          }, props);
        }

        if (optionGroups) {
          var groupOptions = optionGroupProps.options || 'options';
          var groupLabel = optionGroupProps.label || 'label';
          return [h('a-select', {
            props: props,
            model: {
              value: _xeUtils["default"].get(row, column.property),
              callback: function callback(cellValue) {
                _xeUtils["default"].set(row, column.property, cellValue);
              }
            },
            on: getCellEvents(editRender, params)
          }, _xeUtils["default"].map(optionGroups, function (group, gIndex) {
            return h('a-select-opt-group', {
              key: gIndex
            }, [h('span', {
              slot: 'label'
            }, group[groupLabel])].concat(_xeUtils["default"].map(group[groupOptions], function (item, index) {
              return h('a-select-option', {
                props: {
                  value: item[valueProp]
                },
                key: index
              }, item[labelProp]);
            })));
          }))];
        }

        return [h('a-select', {
          props: props,
          model: {
            value: _xeUtils["default"].get(row, column.property),
            callback: function callback(cellValue) {
              _xeUtils["default"].set(row, column.property, cellValue);
            }
          },
          on: getCellEvents(editRender, params)
        }, _xeUtils["default"].map(options, function (item, index) {
          return h('a-select-option', {
            props: {
              value: item[valueProp]
            },
            key: index
          }, item[labelProp]);
        }))];
      },
      renderCell: function renderCell(h, editRender, params) {
        var options = editRender.options,
            optionGroups = editRender.optionGroups,
            _editRender$props2 = editRender.props,
            props = _editRender$props2 === void 0 ? {} : _editRender$props2,
            _editRender$optionPro2 = editRender.optionProps,
            optionProps = _editRender$optionPro2 === void 0 ? {} : _editRender$optionPro2,
            _editRender$optionGro2 = editRender.optionGroupProps,
            optionGroupProps = _editRender$optionGro2 === void 0 ? {} : _editRender$optionGro2;
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
      }
    },
    ACascader: {
      renderEdit: defaultCellRender,
      renderCell: function renderCell(h, _ref3, params) {
        var _ref3$props = _ref3.props,
            props = _ref3$props === void 0 ? {} : _ref3$props;
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
      renderEdit: defaultCellRender,
      renderCell: formatDatePicker('YYYY-MM-DD')
    },
    AMonthPicker: {
      renderEdit: defaultCellRender,
      renderCell: formatDatePicker('YYYY-MM')
    },
    ARangePicker: {
      renderEdit: defaultCellRender,
      renderCell: function renderCell(h, _ref4, params) {
        var _ref4$props = _ref4.props,
            props = _ref4$props === void 0 ? {} : _ref4$props;
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
      renderEdit: defaultCellRender,
      renderCell: formatDatePicker('YYYY-WW周')
    },
    ATimePicker: {
      renderEdit: defaultCellRender,
      renderCell: formatDatePicker('HH:mm:ss')
    },
    ATreeSelect: {
      renderEdit: defaultCellRender,
      renderCell: function renderCell(h, _ref5, params) {
        var _ref5$props = _ref5.props,
            props = _ref5$props === void 0 ? {} : _ref5$props;
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
      renderEdit: defaultCellRender
    },
    ASwitch: {
      renderEdit: defaultCellRender
    }
    /**
     * 筛选兼容性处理
     */

  };

  function handleClearFilterEvent(params, evnt, _ref6) {
    var getEventTargetNode = _ref6.getEventTargetNode;

    if ( // 下拉框
    getEventTargetNode(evnt, document.body, 'ant-select-dropdown').flag) {
      return false;
    }
  }
  /**
   * 单元格兼容性处理
   */


  function handleClearActivedEvent(params, evnt, _ref7) {
    var getEventTargetNode = _ref7.getEventTargetNode;

    if ( // 下拉框
    getEventTargetNode(evnt, document.body, 'ant-select-dropdown').flag || // 级联
    getEventTargetNode(evnt, document.body, 'ant-cascader-menus').flag || // 日期
    getEventTargetNode(evnt, document.body, 'ant-calendar-picker-container').flag || // 时间选择
    getEventTargetNode(evnt, document.body, 'ant-time-picker-panel').flag) {
      return false;
    }
  }

  function VXETablePluginAntd() {}

  VXETablePluginAntd.install = function (_ref8) {
    var interceptor = _ref8.interceptor,
        renderer = _ref8.renderer;
    // 添加到渲染器
    renderer.mixin(renderMap); // 处理事件冲突

    interceptor.add('event.clear_filter', handleClearFilterEvent);
    interceptor.add('event.clear_actived', handleClearActivedEvent);
  };

  if (typeof window !== 'undefined' && window.VXETable) {
    window.VXETable.use(VXETablePluginAntd);
  }

  var _default = VXETablePluginAntd;
  _exports["default"] = _default;
});