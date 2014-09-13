/* File Created: 九月 26, 2013 */
define([ {
	id : 'earth',
	img : '/Content/themes/egis_blue/images/icon-7.png',
	text : '警情态势',
	menuItems : [ {
		id : 'showCase',
		iconClass : "commonIcons showCaseIcon",
		label : "警情撒点",
		index : 2,
		privilege : 'showCase'
	}, {
		id : 'caseQuery',
		iconClass : "commonIcons showCaseIcon",
		label : "警情明细查询",
		index : 2,
		privilege : 'showCase'
	}, {
		id : 'prewarning',
		iconClass : "commonIcons prewarningIcon",
		label : "四色预警",
		index : 2,
		privilege : 'prewarning'
	}, {
		id : 'hotmap',
		iconClass : "commonIcons hotmapIcon",
		label : "热点渲染",
		index : 2,
		privilege : 'hotmap'
	}, {
		id : 'chartAnalysis',
		iconClass : "commonIcons chartAnalysisIcon",
		label : "图表分析",
		index : 2,
		privilege : 'chartAnalysis'
	} ]
}, {
	id : 'report',
	img : '/Content/themes/egis_blue/images/icon-13.png',
	text : '勤务管理',
	menuItems : [ {
		id : 'prewarningReport',
		iconClass : "commonIcons fourcolorWarningAssessment",
		label : "四色预警考核",
		privilege : 'stalkingResource'
	}, {
		id : 'dutyLevelReport',
		iconClass : "commonIcons serviceLevelAssessment",
		label : "勤务等级考核",
		privilege : 'stalkingResource'
	}, {
		id : 'patrolGuardReport',
		iconClass : "commonIcons patrolGuardAssessment",
		label : "巡逻防范考核",
		privilege : 'stalkingResource'
	}, {
		id : 'policeRankReport',
		iconClass : "commonIcons rankingPoliceIntelligenceAssessment",
		label : "警情排名考核",
		privilege : 'stalkingResource'
	}, {
		id : 'ruleBreakQuery',
		iconClass : "commonIcons systemSettingIcon",
		label : "久坐越界查询",
		privilege : 'stalkingResource'
	}, {
		id : 'policeDutyStatistics',
		iconClass : "commonIcons systemSettingIcon",
		label : "勤务统计查询",
		privilege : 'stalkingResource'
	}, {
		id : 'dutyLevelSetting',
		iconClass : "commonIcons systemSettingIcon",
		label : "勤务等级设置",
		privilege : 'stalkingResource'
	} ]
}, {
	id : 'police',
	img : '/Content/themes/egis_blue/images/icon-8.png',
	text : '警力态势',
	menuItems : [ {
		id : 'carMonitor',
		iconClass : "commonIcons policeSurveillance",
		label : "警力监控",
		privilege : 'carMonitor'
	}, {
		id : 'videoMonitor',
		iconClass : "commonIcons carDutyIcon",
		label : "视频监控",
		privilege : 'carDuty'
	}, {
		id : 'policeQuery',
		iconClass : "commonIcons policeInquiry",
		label : "警力查询",
		privilege : 'policeQuery'
	}, {
		id : 'mobileAlarm',
		iconClass : "commonIcons analogAlarmPositioning",
		label : "模拟报警定位",
		privilege : 'mobileAlarm'
	} ]
}, {
	id : 'control',
	img : '/Content/themes/egis_blue/images/icon-10.png',
	text : '卡口布控',
	menuItems : [ {
		id : 'detectorQuery',
		iconClass : "commonIcons bayonetInquiry",
		label : "卡口查询",
		privilege : 'roadControl'
	}, {
		id : 'passedCarQuery',
		iconClass : "commonIcons carTrack",
		label : "过车轨迹",
		privilege : 'roadControl'
	}, {
		id : 'roadControl',
		iconClass : "commonIcons dispatchedTask",
		label : "布控任务",
		privilege : 'roadControl'
	} ]
}, {
	id : 'stalking',
	img : '/Content/themes/egis_blue/images/icon-9.png',
	text : '应急堵控',
	menuItems : [ {
		id : 'stalkingResource',
		iconClass : "commonIcons blockingHandles",
		label : "堵控点",
		privilege : 'stalkingResource'
	}, {
		id : 'blockTask',
		iconClass : "commonIcons blockingHandles",
		label : "堵控任务",
		privilege : 'stalkingResource'
	}, {
		id : 'plan',
		iconClass : "commonIcons deductionPlan",
		label : "预案推演"
	} ]
}, {
	id : 'system',
	img : '/Content/themes/egis_blue/images/icon-11.png',
	text : '系统设置',
	menuItems : [ {
		id : 'theme',
		iconClass : "commonIcons theme",
		label : "主题",
		privilege : 'theme'
	}, {
		id : 'logout',
		iconClass : "commonIcons quit",
		label : "退出系统",
		privilege : 'homePage'
	} ]
} ]);