## 使用源码
+ 安装nodejs，npm 并设置环境变量（一般是自动的）
+ 下载nwjs 并设置环境变量
+ npm install (安装代码依赖)
+ npm run build-run （编译，侦听文件变化编译）
如此，你可以修改代码，程序会被自动编译输出到public目录
+ 找代码可以看readme.png，可能有用

## 运行项目
+ 下载nwjs 并设置环境变量
+ 直接运行run.bat
+ 如果运行失败说明环境变量相关问题，可以运行$nwDir\nw.exe .\public,$nwDir为你的nwjs的目录

##使用范例
+ public\export.data为本工具导出数据，可以选择导入、清空导入查看范例

##todo
+ 现在的文件相关操作都是用dos命令的，如果需要在mac,linux使用要改JobCfgs.js
+ 帮助说明
+ XEditableExt可能使用方式不对，现在会有些问题。那就是点击编辑时显示的内容可能不对