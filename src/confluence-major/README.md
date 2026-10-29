# Confluence 复制原始 pageId 链接（油猴脚本）

在 Confluence 页面顶部导航栏一键复制该页面的**原始 pageId 链接**，方便跨实例、跨环境直接定位同一篇文档，而不依赖当前站点的友好 URL 或空间路径。

---

## 一、功能特性

- **一键复制**：在页面顶部右侧导航栏（`aui-header-secondary` 内的 `ul.aui-nav`）最前方插入一个 `复制pageId链接` 按钮。
- **复制原始链接**：点击后写入剪贴板的内容为 `https://<当前域名>/pages/viewpage.action?pageId=<数字ID>`。
- **精准定位**：仅当页面 URL 路径中包含 `/pages/<数字ID>` 时才显示按钮，普通页面、仪表盘、搜索页不会出现。
- **复用原生样式**：按钮直接套用 Confluence 自带的 `aui-button aui-button-primary` 样式，不注入任何自定义 CSS，与站点外观保持一致。
- **兼容异步渲染**：部分 Confluence 页面导航为延迟渲染，脚本会自动轮询等待目标导航出现后再插入。
- **兼容前端路由**：页面内跳转（SPA 式）导致 URL 变化时，会重新检测并插入按钮。
- **剪贴板兜底**：优先使用现代 Clipboard API，非安全上下文（如本地 `file://` 打开的存档页）自动回退到 `execCommand`，保证可用。

## 二、适用场景

- 不同 Confluence 实例 / 环境之间，用稳定的 `pageId` 链接引用同一篇文档。
- 把页面链接贴进工单、IM、文档时，希望对方打开的是“原始页面”而非带空间别名或中文标题的友好链接。
- 复制后做二次加工（例如拼成 Markdown 链接、批量收集文档清单）。

## 三、安装步骤

1. 浏览器安装 Tampermonkey（或兼容的用户脚本管理器：Violentmonkey、Greasemonkey 4+）。
2. 打开脚本管理器的“新建脚本 / Add User Script”。
3. 清空默认模板，粘贴本脚本全部内容并保存。
4. 确保脚本已启用，访问任意 Confluence 页面即可。

> 提示：脚本匹配规则为 `https://*/*pages*`，会作用于所有域名下路径包含 `pages` 的页面。如只想在特定站点生效，可把 `@match` 改为具体域名，例如 `https://wiki.example.com/*`。

## 四、使用方法

1. 打开任意 Confluence 文档页面（地址栏形如 `…/spaces/KEY/pages/123456/标题`）。
2. 页面顶部右侧导航栏（搜索、帮助附近）会出现绿色按钮 **复制pageId链接**。
3. 点击按钮，按钮文字短暂变为 `已复制 ✓`，表示链接已写入剪贴板。
4. 粘贴（Ctrl/Cmd + V）即可得到形如：
   ```
   https://wiki.example.com/pages/viewpage.action?pageId=123456
   ```


## 五、常见问题

1.按钮不显示
* console输入`allow pasting`
* 篡改猴开启“允许运行用户脚本”

2.已经是pageId=xxx的页面不显示