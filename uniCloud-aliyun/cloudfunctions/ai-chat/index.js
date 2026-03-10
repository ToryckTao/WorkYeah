'use strict';

const AI_RESPONSES = {
  project: [
    '根据项目分析，当前进度正常。建议关注以下几点：\n1. 核心功能模块开发\n2. UI/UX 优化\n3. 性能测试',
    '项目状态良好！已完成 65% 的开发任务。下一步建议：\n• 完善用户反馈机制\n• 优化加载速度\n• 准备测试用例'
  ],
  task: [
    '已为你生成任务清单：\n1. 需求分析与文档整理\n2. 原型设计与评审\n3. 核心功能开发\n4. 单元测试\n5. 集成测试与部署\n\n任务已同步到项目工作台。',
    '任务分解完成：\n📋 阶段一：准备工作（2天）\n📋 阶段二：核心开发（5天）\n📋 阶段三：测试优化（3天）\n\n预计总工期：10天'
  ],
  risk: [
    '风险分析报告：\n⚠️ 高风险：后端 API 延期可能影响前端联调\n⚠️ 中风险：UI 设计稿未最终确认\n⚠️ 低风险：测试时间偏紧\n\n建议：优先协调 API 开发进度',
    '检测到以下风险点：\n1. 技术债务积累 - 建议重构\n2. 依赖版本过旧 - 建议升级\n3. 文档缺失 - 建议补充'
  ],
  progress: [
    '项目进度报告：\n✅ 已完成：需求分析、原型设计、数据库设计\n🔄 进行中：功能开发（65%）\n⏳ 待开始：测试、部署上线\n\n预计完成时间：2周后',
    '当前进度：70%\n\n本周完成：\n• 用户模块开发\n• 登录功能联调\n\n下周计划：\n• 核心业务逻辑\n• 接口对接'
  ],
  default: [
    '我理解你的问题。基于当前项目上下文，我建议你可以：\n1. 查看项目工作台的任务分解\n2. 检查当前进度状态\n3. 让我帮你分析具体问题',
    '好的，我来帮你分析。请问你想了解：\n• 项目进度情况？\n• 任务分解建议？\n• 风险评估报告？\n\n或者直接描述你的具体需求。',
    '收到！让我为你处理这个问题。根据项目数据分析，我有以下建议...'
  ]
};

function getRandomResponse(category) {
  const responses = AI_RESPONSES[category] || AI_RESPONSES.default;
  return responses[Math.floor(Math.random() * responses.length)];
}

function analyzeIntent(message) {
  const lowerMsg = message.toLowerCase();
  if (lowerMsg.includes('项目') || lowerMsg.includes('project')) return 'project';
  if (lowerMsg.includes('任务') || lowerMsg.includes('task') || lowerMsg.includes('清单')) return 'task';
  if (lowerMsg.includes('风险') || lowerMsg.includes('risk') || lowerMsg.includes('问题')) return 'risk';
  if (lowerMsg.includes('进度') || lowerMsg.includes('progress') || lowerMsg.includes('状态')) return 'progress';
  return 'default';
}

exports.main = async (event, context) => {
  const { action, message, conversationId, projectContext } = event;
  
  if (action === 'chat') {
    const intent = analyzeIntent(message);
    const response = getRandomResponse(intent);
    
    return {
      code: 0,
      data: {
        message: response,
        intent: intent,
        conversationId: conversationId || `conv_${Date.now()}`,
        timestamp: new Date().toISOString(),
        model: 'xiaoye-v1'
      }
    };
  }
  
  if (action === 'analyze') {
    return {
      code: 0,
      data: {
        analysis: {
          projectHealth: Math.floor(Math.random() * 20) + 80,
          riskLevel: ['低', '中', '高'][Math.floor(Math.random() * 3)],
          suggestions: [
            '建议优化代码结构',
            '建议增加单元测试覆盖',
            '建议完善项目文档'
          ],
          completionRate: Math.floor(Math.random() * 30) + 60
        },
        timestamp: new Date().toISOString()
      }
    };
  }
  
  if (action === 'generateTasks') {
    return {
      code: 0,
      data: {
        tasks: [
          { id: 1, title: '需求分析', priority: '高', estimatedHours: 8 },
          { id: 2, title: '技术方案设计', priority: '高', estimatedHours: 4 },
          { id: 3, title: '核心功能开发', priority: '高', estimatedHours: 24 },
          { id: 4, title: '单元测试', priority: '中', estimatedHours: 8 },
          { id: 5, title: '文档编写', priority: '低', estimatedHours: 4 }
        ],
        totalEstimatedHours: 48,
        timestamp: new Date().toISOString()
      }
    };
  }
  
  return {
    code: -1,
    message: '未知操作'
  };
};

