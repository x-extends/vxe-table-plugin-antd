import VXETable from 'vxe-table'

export interface VXETablePluginStatic {
  install(xTable: typeof VXETable): void;
}

/**
 * vxe-table renderer plugins for ant-design-vue.
 */
declare var VXETablePluginAntd: VXETablePluginStatic;

export default VXETablePluginAntd;