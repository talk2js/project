define([ {
	img : './images/1.png',
	text : '查询',
	menuItems : [ {
		id: "poiQuery",
		iconClass : "commonIcons showCaseIcon",
		label : "兴趣点查询",
		privilege : 'showCase'
	}, {
		id: "busQuery",
		iconClass : "commonIcons showCaseIcon",
		label : "公交查询",
		privilege : 'showCase'
	}, {
		id: "roadQuery",
		iconClass : "commonIcons hotmapIcon",
		label : "道路查询",
		privilege : 'hotmap'
	}, {
		id: "distinctQuery",
		iconClass : "commonIcons prewarningIcon",
		label : "行政区查询",
		privilege : 'prewarning'
	} ]
}, {
	img : './images/2.png',
	text : '地图编辑',
	menuItems : [ {
		id: "drawGraph",
		iconClass : "commonIcons fourcolorWarningAssessment",
		label : "绘图功能",
		privilege : 'stalkingResource'
	}, {
		iconClass : "commonIcons serviceLevelAssessment",
		label : "编辑图形",
		privilege : 'stalkingResource'
	}, {
		iconClass : "commonIcons serviceLevelAssessment",
		label : "添加可拖拽图标",
		privilege : 'stalkingResource'
	} ]
}, {
	img : './images/3.png',
	text : '图表展示',
	menuItems : [ {
		id: "dojoCharts",
		iconClass : "commonIcons policeSurveillance",
		label : "Dojo charts",
		privilege : 'carMonitor'
	}, {
		id: "fusionCharts",
		iconClass : "commonIcons carDutyIcon",
		label : "FusionCharts",
		privilege : 'carDuty'
	} ]
}, {
	img : './images/4.png',
	text : '车辆监控',
	menuItems : [ {
		iconClass : "commonIcons bayonetInquiry",
		label : "车辆监控",
		privilege : 'roadControl'
	}, {
		iconClass : "commonIcons carTrack",
		label : "轨迹回放",
		privilege : 'roadControl'
	}, {
		iconClass : "commonIcons dispatchedTask",
		label : "单车跟踪",
		privilege : 'roadControl'
	} ]
}, {
	img : './images/5.png',
	text : '系统设置',
	menuItems : [ {
		iconClass : "commonIcons theme",
		label : "参数设置",
		privilege : 'theme'
	}, {
		iconClass : "commonIcons quit",
		label : "退出系统",
		privilege : 'homePage'
	} ]
}, {
	img : './images/6.png',
	text : '代码下载',
	menuItems : [ {
		iconClass : "commonIcons theme",
		label : "代码下载",
		privilege : 'theme'
	} ]
} ]);