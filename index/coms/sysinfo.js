/**
 * 系统信息基础类
 * （单例模式）
 *
 * @export
 * @class Screen
 */
let instance = null;
export default class SysInfo {
	constructor() {
		if (instance) {
			return instance;
		}
		instance = this;
		this.refresh();
	}

	/**
	 * 重新获取系统信息
	 *
	 * @memberof SysInfo
	 */
	refresh() {
		Object.assign(this, wx.getSystemInfoSync()); // 系统信息克隆进对象
	}

	/**
	 * 根据rpx获取像素
	 *
	 * @param {number} [rpx=0]
	 * @returns
	 * @memberof SysInfo
	 */
	getPx(rpx = 0, accurate = false) {
		const v = (this.windowWidth / 750) * rpx;
		if (accurate) {
			return v;
		}
		return Math.floor(v);
	}
}
