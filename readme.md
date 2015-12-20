
定义一组变量，定义一组操作。执行操作。执行开始，变量会被替换到操作里的所有定义，以让操作组正确执行

##主要用到的东西
@React @React-Bootstrap @Q @Reflux @nwjs @weback


## 使用源码
+ 安装nodejs，npm 并设置环境变量（一般是自动的）
+ 下载nwjs 并设置环境变量
+ npm install (安装代码依赖)
+ npm run build-run （编译，侦听文件变化编译）
如此，你可以修改代码，程序会被自动编译输出到public目录
+ 找代码可以看readme.png，可能有用

## 使用工具
+ 下载nwjs 并设置环境变量
+ 直接运行run.bat
+ 如果运行失败说明环境变量相关问题，可以运行$nwDir\nw.exe .\public，$nwDir为你的nwjs的目录

## 使用流程
+ 添加工作空间
+ 为工作空间添加项目
+ 为项目设置变量，添加工作序列，<b>变量会将被替换到工作序列中的##所有字段##及##所有读取的文本文件##</b>
+ 复制项目，更改变量
+ 导出你的内容，你的同事导入你的内容，更换path之类的变量
+ 加入执行队列，<b>批量运行</b>或<b>运行单独项目</b>
+ 结构请参照使用范例


##使用范例
+ public\export.data为本工具导出数据，可以选择导入、清空导入查看范例

![图片](https://github.com/Daley/BatWorker/blob/master/readme.png)

##todo
+ 现在的文件相关操作都是用dos命令的，如果需要在mac,linux使用要改JobCfgs.js

