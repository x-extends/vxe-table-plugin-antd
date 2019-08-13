import VXETable from 'vxe-table'

export interface VXETablePluginAntdStatic {
  install(xTable: typeof VXETable): void;
}

/**
 * vxe-table renderer plugins for ant-design-vue.
 */
declare var VXETablePluginAntd: VXETablePluginAntdStatic;

export default VXETablePluginAntd;