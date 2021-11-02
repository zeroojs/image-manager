## 资源
MySQL：8.0.25 MySQL Community Server - GPL
Navicat Premium：15.0.25
Postman for Windows：Version 9.1.1
## 文档
nest-typeorm：https://github.com/nestjs/typeorm  
nest中文文档：https://nestjs.bootcss.com  
## 今日遇到的问题以及解决方案：
#### 解决SyntaxError: Cannot use import statement outside a module问题  
https://stackoverflow.com/questions/59435293/typeorm-entity-in-nestjs-cannot-use-import-statement-outside-a-module  

#### 解决Client does not support authentication protocol requested by server； conside  
https://blog.csdn.net/weixin_43111077/article/details/108811949

#### 解决 rxjs_1.lastValueFrom is not a function
将rxjs更新到>=7.4.0
```bash
yarn upgrade rxjs@7.4.0
```