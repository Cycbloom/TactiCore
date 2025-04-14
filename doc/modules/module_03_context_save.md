# 现场保存与恢复模块

## 概述

现场保存与恢复模块负责在任务切换或中断时，自动保存当前工作环境状态，并在需要时快速恢复，确保工作连续性。该模块可以记录和恢复多种类型的工作现场，包括打开的文件、网页链接、编辑器状态等，使用户能够无缝地在不同任务间切换。

## 功能详解

### 1. 多格式现场保存

#### 1.1 应用状态保存

- **窗口布局与位置**：记录应用窗口的大小、位置和布局设置。
- **打开的界面**：保存当前打开的所有标签页和视图。
- **滚动位置**：记录各视图的滚动位置和焦点位置。

#### 1.2 外部应用现场保存

- **网页浏览器**：保存打开的网页链接、滚动位置和表单输入状态。
- **文档编辑器**：保存打开的文档、光标位置和编辑历史。
- **代码编辑器**：保存源代码文件、断点位置和终端输出。

#### 1.3 系统资源状态

- **运行中的服务**：记录任务相关的运行中服务状态。
- **环境变量**：保存特定任务所需的环境变量设置。
- **系统连接**：记录网络连接、数据库连接等状态。

### 2. 智能中断与恢复机制

#### 2.1 中断类型识别

- **主动中断**：用户主动切换任务时触发的保存。
- **被动中断**：因紧急任务插入而触发的保存。
- **系统中断**：因系统事件（如更新、重启）导致的中断和保存。

#### 2.2 恢复策略

- **完全恢复**：恢复所有保存的状态，包括窗口布局、打开的文件和光标位置等。
- **部分恢复**：仅恢复最重要的状态，如打开的文件，但不恢复详细位置。
- **延迟恢复**：对于资源密集型的状态，采用需要时才加载的策略，提高恢复速度。

#### 2.3 多版本现场管理

- **历史现场**：保存任务的多个历史现场，允许回到特定时间点的工作状态。
- **现场分支**：支持现场状态的分支管理，便于在不同思路间切换。
- **自动合并**：当在不同设备上处理同一任务时，智能合并不同现场的状态。

### 3. 现场切换与任务流转

#### 3.1 快速任务切换

- **热键切换**：通过快捷键迅速在不同任务现场间切换。
- **任务栈管理**：维护任务切换历史，支持前进/后退导航。
- **预览功能**：在完全恢复前先预览任务现场内容。

#### 3.2 任务上下文传递

- **数据传递**：将当前任务的相关数据传递给下一个任务。
- **上下文关联**：建立任务间的上下文关联，便于相关任务间的快速切换。
- **任务组切换**：支持一次性切换到一组相关任务的现场。

#### 3.3 状态冲突处理

- **编辑冲突解决**：当恢复的现场与当前状态冲突时，提供解决机制。
- **资源占用处理**：处理因资源（如端口、文件锁）冲突导致的恢复问题。
- **优雅降级**：当无法完全恢复时，提供尽可能接近的状态并通知用户差异。

### 4. 现场元数据与搜索

#### 4.1 元数据记录

- **时间戳**：记录现场保存的准确时间。
- **任务关联**：将现场与特定任务明确关联。
- **标签与描述**：支持添加自定义标签和描述，便于后续查找。

#### 4.2 现场搜索与过滤

- **全文搜索**：搜索现场中的文本内容和元数据。
- **基于时间的过滤**：按时间范围筛选现场。
- **基于内容的过滤**：按文件类型、网页域名等内容特征筛选。

#### 4.3 智能推荐

- **相关现场推荐**：基于当前任务推荐可能相关的历史现场。
- **使用频率分析**：识别常用的现场组合，提供快速恢复选项。
- **工作模式识别**：学习用户的工作模式，预测可能需要的现场。

### 5. 隐私与安全保护

#### 5.1 敏感信息处理

- **敏感数据识别**：自动识别和标记现场中的敏感信息。
- **选择性保存**：允许用户选择哪些类型的信息可以保存，哪些应该排除。
- **数据脱敏**：对敏感信息进行脱敏处理，确保安全性。

#### 5.2 加密与访问控制

- **本地加密**：对保存的现场数据进行本地加密。
- **访问验证**：恢复敏感现场时要求身份验证。
- **自动过期**：设置现场数据的自动过期机制，避免长期存储敏感信息。

## 技术实现

### 数据结构

```
Context {
    id: String,                  // 现场唯一标识符
    taskId: String,              // 关联的任务ID
    name: String,                // 现场名称
    description: String,         // 现场描述
    createdAt: DateTime,         // 创建时间
    updatedAt: DateTime,         // 最后更新时间
    type: ContextType,           // 现场类型(手动保存、自动保存、中断保存)
    tags: Array<String>,         // 标签列表
    applicationStates: Array<ApplicationState>, // 应用状态列表
    systemResources: SystemResources, // 系统资源状态
    metaData: Object             // 其他元数据
}

ApplicationState {
    appId: String,               // 应用ID
    appName: String,             // 应用名称
    windowState: {               // 窗口状态
        position: {x: Number, y: Number}, // 窗口位置
        size: {width: Number, height: Number}, // 窗口大小
        isMaximized: Boolean,    // 是否最大化
        isMinimized: Boolean     // 是否最小化
    },
    openFiles: Array<FileState>, // 打开的文件列表
    openUrls: Array<UrlState>,   // 打开的URL列表
    appSpecificState: Object     // 应用特定状态
}

FileState {
    path: String,                // 文件路径
    cursorPosition: {            // 光标位置
        line: Number,            // 行
        column: Number           // 列
    },
    scrollPosition: {            // 滚动位置
        top: Number,             // 顶部偏移
        left: Number             // 左侧偏移
    },
    selection: {                 // 选中区域
        start: {line: Number, column: Number}, // 开始位置
        end: {line: Number, column: Number}    // 结束位置
    },
    lastModified: DateTime,      // 最后修改时间
    encoding: String,            // 文件编码
    isUnsaved: Boolean           // 是否有未保存的更改
}

UrlState {
    url: String,                 // URL地址
    title: String,               // 页面标题
    favicon: String,             // 网站图标
    scrollPosition: {            // 滚动位置
        top: Number,             // 顶部偏移
        left: Number             // 左侧偏移
    },
    formData: Object,            // 表单数据
    lastVisited: DateTime        // 最后访问时间
}

SystemResources {
    runningServices: Array<ServiceState>, // 运行中的服务
    environmentVariables: Object, // 环境变量
    connections: Array<ConnectionState>, // 活动连接
    clipboardContent: String     // 剪贴板内容
}

ServiceState {
    name: String,                // 服务名称
    status: String,              // 服务状态
    pid: Number,                 // 进程ID
    ports: Array<Number>,        // 占用的端口
    startedAt: DateTime          // 启动时间
}

ConnectionState {
    type: String,                // 连接类型
    target: String,              // 连接目标
    credentials: EncryptedObject, // 加密的凭据
    status: String               // 连接状态
}

ContextType = {
    MANUAL_SAVE,                 // 手动保存
    AUTO_SAVE,                   // 自动定期保存
    INTERRUPT_SAVE               // 中断时保存
}
```

### 算法

1. **现场保存算法**：

   ```
   saveContext(taskId, contextType) {
     // 创建新的现场对象
     const context = new Context({
       id: generateUUID(),
       taskId,
       name: generateContextName(),
       createdAt: new Date(),
       updatedAt: new Date(),
       type: contextType,
       tags: getTaskTags(taskId)
     });

     // 收集应用状态
     const apps = getRunningApps();
     for (const app of apps) {
       if (shouldSaveAppState(app)) {
         const appState = collectApplicationState(app);
         context.applicationStates.push(appState);
       }
     }

     // 收集系统资源状态
     context.systemResources = collectSystemResources();

     // 处理敏感信息
     sanitizeSensitiveInfo(context);

     // 保存现场
     const success = saveContextToStorage(context);

     // 记录元数据
     updateContextMetadata(context);

     return success ? context.id : null;
   }
   ```

2. **现场恢复算法**：

   ```
   restoreContext(contextId) {
     // 从存储中加载现场
     const context = loadContextFromStorage(contextId);
     if (!context) return false;

     // 更新元数据
     context.lastRestoredAt = new Date();
     updateContextMetadata(context);

     // 准备恢复步骤
     const restorationPlan = createRestorationPlan(context);

     // 处理冲突
     const conflicts = detectRestoreConflicts(restorationPlan);
     if (conflicts.length > 0) {
       const resolution = resolveConflicts(conflicts);
       if (!resolution.canProceed) return false;
       applyConflictResolution(restorationPlan, resolution);
     }

     // 执行恢复
     try {
       // 先恢复系统资源
       restoreSystemResources(context.systemResources);

       // 然后恢复应用状态
       for (const appState of context.applicationStates) {
         restoreApplicationState(appState);
       }

       // 记录恢复成功
       logSuccessfulRestore(context);
       return true;
     } catch (error) {
       // 恢复失败，进行回滚
       performRestoreRollback();
       logRestoreFailure(context, error);
       return false;
     }
   }
   ```

## 界面设计

### 现场管理界面

1. **现场列表**：显示所有保存的现场，支持按任务、日期、类型等过滤。
2. **现场详情**：查看特定现场的详细内容，包括保存的应用和文件列表。
3. **现场比较**：比较两个现场之间的差异，帮助用户选择要恢复的版本。

### 快速操作界面

1. **任务切换面板**：显示最近的任务和相关现场，支持一键切换。
2. **现场预览**：在恢复前预览现场内容，确认是否为所需状态。
3. **恢复选项**：提供完全恢复、部分恢复等选择，以及处理冲突的界面。

## 与其他模块的集成

- **任务管理模块**：获取任务信息，关联现场与任务。
- **提醒模块**：在任务切换或紧急中断时触发现场保存。
- **知识库模块**：将现场中的重要信息提取到知识库中。
- **数据同步模块**：在多设备间同步现场数据，确保一致性。

## 未来扩展

- **智能工作流分析**：分析用户的工作模式和现场切换行为，提供工作流优化建议。
- **跨设备无缝切换**：在不同设备间无缝切换工作现场，如从电脑切换到平板或手机。
- **AR/VR 支持**：扩展现场保存能力以支持 AR/VR 工作环境的状态保存和恢复。
- **自动化保存策略**：根据任务类型和用户行为模式，自动调整现场保存的频率和范围。
