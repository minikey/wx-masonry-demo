const app = getApp()

Page({
	data: {

	},
	onLoad() {
		this.masonry = this.selectComponent('.masonry');
		this.onReachBottom();
	},
	onReachBottom() {
		this.getList();
	},
	random(min, max) {
		return Math.round((max - min) * Math.random()) + min;
	},
	createData() {
		const colorList = [
			'#FFFFCC',
			'#CCFFFF',
			'#FFCCCC',
			'#FFCC99',
			'#FFFF99',
			'#99CC99',
		];
		return {
			bgColor: colorList[this.random(0, colorList.length - 1)],
			size: this.random(1, 100) < 20 ? 'big' : 'small',
			height: this.random(200, 300),
		};
	},
	getData() {
		const list = [];
		for (let i = 0; i < 20; i++) {
			list.push(this.createData());
		}
		return list;
	},
	getList() {
		const list = this.getData();
		list.forEach(item => {
			this.masonry.add(item);
		});
		console.log(list);
	},
})
