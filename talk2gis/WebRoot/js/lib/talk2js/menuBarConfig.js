define([ {
	img : './images/1.png',
	text : '警情态势',
	menuItems : [ {
		iconClass : "commonIcons showCaseIcon",
		label : "警情撒点",
		privilege : 'showCase'
	}, {
		iconClass : "commonIcons showCaseIcon",
		label : "警情明细查询",
		privilege : 'showCase'
	}, {
		iconClass : "commonIcons prewarningIcon",
		label : "四色预警",
		privilege : 'prewarning'
	}, {
		iconClass : "commonIcons hotmapIcon",
		label : "热点渲染",
		privilege : 'hotmap'
	}, {
		iconClass : "commonIcons chartAnalysisIcon",
		label : "图表分析",
		privilege : 'chartAnalysis'
	} ]
}, {
	img : './images/2.png',
	text : '勤务管理',
	menuItems : [ {
		iconClass : "commonIcons fourcolorWarningAssessment",
		label : "四色预警考核",
		privilege : 'stalkingResource'
	}, {
		iconClass : "commonIcons serviceLevelAssessment",
		label : "勤务等级考核",
		privilege : 'stalkingResource'
	}, {
		iconClass : "commonIcons patrolGuardAssessment",
		label : "巡逻防范考核",
		privilege : 'stalkingResource'
	}, {
		iconClass : "commonIcons rankingPoliceIntelligenceAssessment",
		label : "警情排名考核",
		privilege : 'stalkingResource'
	}, {
		iconClass : "commonIcons systemSettingIcon",
		label : "久坐越界查询",
		privilege : 'stalkingResource'
	}, {
		iconClass : "commonIcons systemSettingIcon",
		label : "勤务统计查询",
		privilege : 'stalkingResource'
	}, {
		iconClass : "commonIcons systemSettingIcon",
		label : "勤务等级设置",
		privilege : 'stalkingResource'
	} ]
}, {
	img : './images/3.png',
	text : '警力态势',
	menuItems : [ {
		iconClass : "commonIcons policeSurveillance",
		label : "警力监控",
		privilege : 'carMonitor'
	}, {
		iconClass : "commonIcons carDutyIcon",
		label : "视频监控",
		privilege : 'carDuty'
	}, {
		iconClass : "commonIcons policeInquiry",
		label : "警力查询",
		privilege : 'policeQuery'
	}, {
		iconClass : "commonIcons analogAlarmPositioning",
		label : "模拟报警定位",
		privilege : 'mobileAlarm'
	} ]
}, {
	img : './images/4.png',
	text : '卡口布控',
	menuItems : [ {
		iconClass : "commonIcons bayonetInquiry",
		label : "卡口查询",
		privilege : 'roadControl'
	}, {
		iconClass : "commonIcons carTrack",
		label : "过车轨迹",
		privilege : 'roadControl'
	}, {
		iconClass : "commonIcons dispatchedTask",
		label : "布控任务",
		privilege : 'roadControl'
	} ]
}, {
	img : './images/5.png',
	text : '系统设置',
	menuItems : [ {
		iconClass : "commonIcons theme",
		label : "主题",
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