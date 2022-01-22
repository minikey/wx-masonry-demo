import SysInfo from '../sysinfo';

let tick = 0;
Component({
	/**
	 * 组件的属性列表
	 */
	properties: {
		margin: {
			type: Number,
			value: 24,
		}
	},

	/**
	 * 组件的初始数据
	 */
	data: {
		list: [],
		height: 0,
	},

	/**
	 * 组件的方法列表
	 */
	methods: {
		clear() {
			this.tick = tick++;
			this.height = [0, 0];
			this.setData({
				list: [],
				height: 0,
			});
		},
		$setData(data) {
			return new Promise(resolve => {
				this.setData(data, () => {
					resolve();
				});
			});
		},
		addItem(item) {
			let tick = this.tick;
			return this.getRect(item).then(rect => {
				if (tick !== this.tick) {
					return Promise.reject('tick');
				}
				let { height, width } = rect;
				const { margin } = this.data;
				const windowWidth = this.sysInfo.windowWidth;
				let [ leftTotal, rightTotal ] = this.height;
				let marginPx = this.sysInfo.getPx(margin);
				let bPx = this.sysInfo.getPx(18);
				let style = '';
				console.info(width, windowWidth);
				if (Math.abs(width - windowWidth) < 3) {
					// 占满屏幕宽度
					style = `left:0;top:${ Math.max(leftTotal, rightTotal) }px;width:100%;`;
					leftTotal = rightTotal = Math.max(leftTotal + height, rightTotal + height);
				} else if (rightTotal < leftTotal) {
					// 放入右边
					style = `right:${ marginPx }px;top:${ rightTotal }px;`;
					rightTotal += height;
				} else {
					// 放入左边
					style = `left:${ marginPx }px;top:${ leftTotal }px;`;
					leftTotal += height;
				}

				const { list = [] } = this.data;
				const targetKey = `list[${list.length}]`;
				this.height = [leftTotal, rightTotal];
				return this.$setData({
					[targetKey]: {
						data: item,
						style,
					},
					height: Math.max(leftTotal, rightTotal),
				});
			});
		},
		delay(delay = 0) {
			return new Promise(resolve => {
				setTimeout(resolve, delay);
			});
		},
		getRect(item) {
			return this.$setData({
				tmp: item,
			}).then(() => {
				return new Promise((resolve, reject) => {
					const query = this.createSelectorQuery();
					query.select('.computed-zone .wrapper').boundingClientRect();
					query.exec(ret => {
						if (ret[0]) {
							resolve(ret[0]);
						} else {
							reject('not found dom!');
						}
					});
				});
			});
		},
		add(item) {
			let pending = this.pending || Promise.resolve();
			return this.pending = pending.then(() => {
				return this.addItem(item);
			}).catch(err => {
				console.error(err);
				this.pending = null;
				throw err;
			});
		},
	},
	attached() {
    this.sysInfo = new SysInfo();
    this.clear();
	},
});
