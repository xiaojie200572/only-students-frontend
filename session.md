# 后端收藏夹 API 实现讨论与前后端改动需求

**Session ID:** ses_38fc12201ffezXk9xuyfCBbrfs
**Created:** 2026/2/18 18:14:54
**Updated:** 2026/2/19 14:34:59

---

## Assistant (Build · big-pickle · 12.1s)

**Tool: edit**

---

## Assistant (Build · big-pickle · 8.6s)

**Tool: read**

---

## Assistant (Build · big-pickle · 15.1s)

**Tool: read**

---

## Assistant (Build · big-pickle · 12.3s)

**Tool: edit**

---

## Assistant (Build · big-pickle · 11.0s)

**Tool: edit**

---

## Assistant (Build · big-pickle · 21.8s)

已完成基本结构：
- 三条横线按钮
- 点击后显示操作菜单（移动、删除）
- 删除功能已连接
- 移动功能目前显示"开发中"

需要实现移动功能吗？

---

## User

移动就是把这个笔记移动到另一个收藏夹，实现吧

---

## Assistant (Build · big-pickle · 34.2s)

**Tool: edit**

---

## Assistant (Build · big-pickle · 9.8s)

**Tool: edit**

---

## Assistant (Build · big-pickle · 14.7s)

**Tool: read**

---

## Assistant (Build · big-pickle · 8.6s)

**Tool: grep**

---

## Assistant (Build · big-pickle · 13.6s)

**Tool: read**

---

## Assistant (Build · big-pickle · 13.6s)

**Tool: edit**

---

## Assistant (Build · big-pickle · 7.7s)

**Tool: read**

---

## Assistant (Build · big-pickle · 14.1s)

**Tool: grep**

---

## Assistant (Build · big-pickle · 21.7s)

**Tool: read**

---

## Assistant (Build · big-pickle · 26.2s)

**Tool: edit**

---

## Assistant (Build · big-pickle · 7.5s)

**Tool: read**

---

## Assistant (Build · big-pickle · 8.7s)

**Tool: grep**

---

## Assistant (Build · big-pickle · 9.6s)

**Tool: edit**

---

## Assistant (Build · big-pickle · 22.2s)

已完成移动功能：
- 点击三条横线显示操作菜单
- 点击"移动"打开收藏夹选择弹窗
- 标题会显示"移动到"或"选择收藏夹"
- 选择收藏夹后调用API移动笔记

---

## User

D:/Project/java_project/only-students-frontend/src/pages/user/my-favorites.vue
296|
297|  // 选择收藏夹
298|  const selectFolder = (folder: Folder) => {
   |        ^
299|    currentFolderId.value = folder.id
300|    closeFolderSelector()
at pages/user/my-favorites.vue:298:6
  64 |              <text class="folder-modal-count">{{ folder.count }}条</text>
  65 |              <view class="folder-actions">
  66 |                <view v-if="folder.id !== null" class="delete-btn" @click="deleteFolder(folder, $event)">
     |               ^
  67 |                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
  68 |                    <line x1="18" y1="6" x2="6" y2="18"/> 

---

## Assistant (Build · big-pickle · 21.2s)

**Tool: read**

---

## Assistant (Build · big-pickle · 9.3s)

**Tool: grep**

---

## Assistant (Build · big-pickle · 9.8s)

**Tool: read**

---

## Assistant (Build · big-pickle · 10.3s)

**Tool: edit**

---

## Assistant (Build · big-pickle · 12.0s)

已修复重复定义问题。

---

## User

comment一直有个问题，首先ide没有显示端口号，进程确实正常启动，nacos却也没有注册到，导致前端POST http://localhost:8080/api/comment 503 (Service Unavailable)

---

## Assistant (Build · big-pickle · 65.5s)

**Tool: glob**

---

## Assistant (Build · big-pickle · 6.4s)

**Tool: read**

---

## Assistant (Build · big-pickle · 17.9s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 6.2s)

**Tool: glob**

---

## Assistant (Build · big-pickle · 7.5s)

**Tool: read**

---

## Assistant (Build · big-pickle · 6.4s)

**Tool: grep**

---

## Assistant (Build · big-pickle · 8.2s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 6.6s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 8.6s)

端口8006（comment-service）没有启动。请确认你启动的是comment-service：

```bash
# 在comment-service目录下运行
cd D:\Project\java_project\only-students\comment-service
mvn spring-boot:run
```

或者检查IDE中是否选择了正确的启动配置。

---

## User

2026-02-19T14:06:23.183+08:00  WARN 21912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.commons.config.CommonsConfigAutoConfiguration' of type [org.springframework.cloud.commons.config.CommonsConfigAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies. 
我确实启动了，但是有一些这个警告，而且也没显示端口是在8006

---

## Assistant (Build · big-pickle · 13.2s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 7.7s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 8.2s)

**Tool: grep**

---

## Assistant (Build · big-pickle · 8.1s)

**Tool: read**

---

## Assistant (Build · big-pickle · 9.6s)

**Tool: glob**

---

## Assistant (Build · big-pickle · 6.3s)

**Tool: glob**

---

## Assistant (Build · big-pickle · 6.9s)

**Tool: read**

---

## Assistant (Build · big-pickle · 18.3s)

网关配置了comment-service路由，问题在于comment-service没有启动或没注册到Nacos。

请检查：
1. IDE控制台中comment-service是否完全启动（不是只有警告）
2. Nacos控制台 http://localhost:8848/nacos 查看服务列表

或者直接重新启动comment-service：

```bash
cd D:\Project\java_project\only-students\comment-service
mvn spring-boot:run
```

启动完成后确认8006端口监听。

---

## User

2026-02-19T14:10:06.001+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerInterceptor' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerInterceptor] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
Logging initialized using 'class org.apache.ibatis.logging.stdout.StdOutImpl' adapter.
Get /172.27.16.1 network interface 
Get network interface info: name:eth12 (Hyper-V Virtual Ethernet Adapter)
Initialization Sequence datacenterId:28 workerId:10 

---

## Assistant (Build · big-pickle · 19.0s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 8.8s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 9.0s)

comment-service进程存在(PID 6912)但端口8006没启动。可能是启动时出错了。

请查看IDE中comment-service的完整控制台输出，看看有没有红色的错误信息？或者尝试：

1. 停止当前进程
2. 重新启动并查看完整日志
3. 确认是否有数据库连接错误或其他异常

---

## User

2026-02-19T14:10:04.170+08:00  INFO 6912 --- [comment-service] [           main] c.o.comment.CommentServiceApplication    : No active profile set, falling back to 1 default profile: "default"
2026-02-19T14:10:04.212+08:00  WARN 6912 --- [comment-service] [           main] c.a.c.n.c.NacosConfigDataLoader          : [Nacos Config] config[dataId=application-.yaml, group=DEFAULT_GROUP] is empty
2026-02-19T14:10:05.221+08:00  INFO 6912 --- [comment-service] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Multiple Spring Data modules found, entering strict repository configuration mode
2026-02-19T14:10:05.223+08:00  INFO 6912 --- [comment-service] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data Redis repositories in DEFAULT mode.
2026-02-19T14:10:05.258+08:00  INFO 6912 --- [comment-service] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 15 ms. Found 0 Redis repository interfaces.
2026-02-19T14:10:05.457+08:00  INFO 6912 --- [comment-service] [           main] o.s.cloud.context.scope.GenericScope     : BeanFactory id=56b27703-3c69-3bd8-9fd0-082b78e8436a
2026-02-19T14:10:05.942+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.client.loadbalancer.LoadBalancerAutoConfiguration$LoadBalancerInterceptorConfig' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerAutoConfiguration$LoadBalancerInterceptorConfig] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). The currently created BeanPostProcessor [lbRestClientPostProcessor] is declared through a non-static factory method on that class; consider declaring it as static instead.
2026-02-19T14:10:05.945+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.loadbalancer.config.BlockingLoadBalancerClientAutoConfiguration' of type [org.springframework.cloud.loadbalancer.config.BlockingLoadBalancerClientAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:05.947+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.loadbalancer.config.LoadBalancerAutoConfiguration' of type [org.springframework.cloud.loadbalancer.config.LoadBalancerAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:05.956+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.commons.config.CommonsConfigAutoConfiguration' of type [org.springframework.cloud.commons.config.CommonsConfigAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:05.959+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.client.loadbalancer.LoadBalancerDefaultMappingsProviderAutoConfiguration' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerDefaultMappingsProviderAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:05.960+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerClientsDefaultsMappingsProvider' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerDefaultMappingsProviderAutoConfiguration$$Lambda$673/0x00000211da6487b0] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:05.963+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'defaultsBindHandlerAdvisor' of type [org.springframework.cloud.commons.config.DefaultsBindHandlerAdvisor] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:05.969+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'spring.cloud.loadbalancer-org.springframework.cloud.client.loadbalancer.LoadBalancerClientsProperties' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerClientsProperties] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:05.975+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'default.org.springframework.cloud.loadbalancer.config.LoadBalancerAutoConfiguration.LoadBalancerClientSpecification' of type [org.springframework.cloud.loadbalancer.annotation.LoadBalancerClientSpecification] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:05.977+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'default.org.springframework.cloud.loadbalancer.config.BlockingLoadBalancerClientAutoConfiguration.LoadBalancerClientSpecification' of type [org.springframework.cloud.loadbalancer.annotation.LoadBalancerClientSpecification] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:05.978+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerClientFactory' of type [org.springframework.cloud.loadbalancer.support.LoadBalancerClientFactory] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:05.985+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'blockingLoadBalancerClient' of type [org.springframework.cloud.loadbalancer.blocking.client.BlockingLoadBalancerClient] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:05.993+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerServiceInstanceCookieTransformer' of type [org.springframework.cloud.loadbalancer.core.LoadBalancerServiceInstanceCookieTransformer] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:05.995+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'xForwarderHeadersTransformer' of type [org.springframework.cloud.loadbalancer.blocking.XForwardedHeadersTransformer] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:05.996+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.client.loadbalancer.LoadBalancerAutoConfiguration' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:05.999+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerRequestFactory' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerRequestFactory] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:10:06.001+08:00  WARN 6912 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerInterceptor' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerInterceptor] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
Logging initialized using 'class org.apache.ibatis.logging.stdout.StdOutImpl' adapter.
Get /172.27.16.1 network interface 
Get network interface info: name:eth12 (Hyper-V Virtual Ethernet Adapter)
Initialization Sequence datacenterId:28 workerId:10
 _ _   |_  _ _|_. ___ _ |    _ 
| | |\/|_)(_| | |_\  |_)||_|_\ 
     /               |         
                        3.5.7 

---

## Assistant (Build · big-pickle · 13.6s)

日志显示启动卡在Druid数据库连接，没有显示端口启动成功。可能数据库连接有问题。

请检查：
1. MySQL数据库是否运行
2. 数据库`only_students_comment`是否存在

或者试试直接在IDE中以Debug模式启动查看更多信息。

---

## User

你检查comment服务，包括yaml文件

---

## Assistant (Build · big-pickle · 8.2s)

**Tool: read**

---

## Assistant (Build · big-pickle · 7.3s)

**Tool: grep**

---

## Assistant (Build · big-pickle · 6.7s)

**Tool: read**

---

## Assistant (Build · big-pickle · 14.4s)

**Tool: edit**

---

## Assistant (Build · big-pickle · 6.9s)

**Tool: glob**

---

## Assistant (Build · big-pickle · 6.9s)

**Tool: read**

---

## Assistant (Build · big-pickle · 7.5s)

**Tool: read**

---

## Assistant (Build · big-pickle · 10.5s)

已添加Nacos用户名密码配置。请：

1. 停止comment-service
2. 重新启动

如果还是卡住，可能是MySQL数据库连接问题。请确认：
- MySQL服务是否运行
- 数据库`only_students_comment`是否存在
- 用户名密码是否正确

或者查看IDE控制台有没有红色的错误信息？

---

## User

version: '3.8'

services:
  # Redis 7 (使用现有镜像 latest，加密码)
  redis:
    image: redis:latest
    container_name: only-students-redis
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes --requirepass xiaojie666
    networks:
      - only-students-network

  # Nacos (使用现有镜像 v2.3.2，连接物理机MySQL)
  nacos:
    image: nacos/nacos-server:v2.3.2
    container_name: only-students-nacos
    environment:
      MODE: standalone
      SPRING_DATASOURCE_PLATFORM: mysql
      MYSQL_SERVICE_HOST: host.docker.internal  # 使用宿主机MySQL
      MYSQL_SERVICE_DB_NAME: nacos
      MYSQL_SERVICE_PORT: 3306
      MYSQL_SERVICE_USER: root
      MYSQL_SERVICE_PASSWORD: xiaojie666
      # 关闭认证（开发环境）
      NACOS_AUTH_ENABLE: false
      NACOS_CORE_AUTH_ENABLED: false
    ports:
      - "8848:8848"
      - "9848:9848"
    networks:
      - only-students-network
    extra_hosts:
      - "host.docker.internal:host-gateway"

  # RabbitMQ (使用现有镜像 3.8.5)
  rabbitmq:
    image: rabbitmq:3.8.5-management-alpine
    container_name: only-students-rabbitmq
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin123
    ports:
      - "5672:5672"
      - "15672:15672"
    volumes:
      - rabbitmq_data:/var/lib/rabbitmq
    networks:
      - only-students-network

  # Elasticsearch 7.17 (使用现有镜像)
  elasticsearch:
    image: elasticsearch:7.17.23
    container_name: only-students-es
    environment:
      - discovery.type=single-node
      - xpack.security.enabled=false
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    ports:
      - "9200:9200"
    volumes:
      - es_data:/usr/share/elasticsearch/data
    networks:
      - only-students-network

  # Kibana 7.17 (匹配ES版本)
  kibana:
    image: kibana:7.17.23
    container_name: only-students-kibana
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    ports:
      - "5601:5601"
    depends_on:
      - elasticsearch
    networks:
      - only-students-network

  # MinIO (需要下载)
  minio:
    image: minio/minio:latest
    container_name: only-students-minio
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin123
    ports:
      - "9000:9000"
      - "9001:9001"
    volumes:
      - minio_data:/data
    command: server /data --console-address ":9001"
    networks:
      - only-students-network

  # Sentinel Dashboard (可选，使用现有镜像)
  sentinel:
    image: bladex/sentinel-dashboard:1.8.6
    container_name: only-students-sentinel
    ports:
      - "8858:8858"
    networks:
      - only-students-network

  # Gotenberg (文档转换服务，基于LibreOffice)
  # 用于将Office文档(doc/docx/xls/xlsx/ppt/pptx)转换为PDF
  gotenberg:
    image: gotenberg/gotenberg:8
    container_name: only-students-gotenberg
    ports:
      - "3000:3000"
    environment:
      - GOTENBERG_CHROMIUM_DISABLE_JAVASCRIPT=true
      - GOTENBERG_LIBREOFFICE_AUTO_START=true
    networks:
      - only-students-network
    restart: unless-stopped

volumes:
  redis_data:
  rabbitmq_data:
  es_data:
  minio_data:

networks:
  only-students-network:
    driver: bridge 
我配置nacos没有用户名和密码吧
mysql都正常启动，ide也没报错

---

## Assistant (Build · big-pickle · 25.7s)

**Tool: edit**

---

## Assistant (Build · big-pickle · 8.4s)

已移除Nacos认证配置。请重新启动comment-service并查看完整日志，看看有没有红色的错误信息？

---

## User

没有任何报错
最后几行[Pasted ~42026-02-19T14:17:25.194+08:00  INFO 12156 --- [comment-service] [)-192.168.198.1] com.alibaba.nacos.common.remote.client   : [612112af-09fd-4453-be1b-3516bcf29630] Register server push request handler:com.alibaba.nacos.common.remote.client.RpcClient$$Lambda$348/0x0000022d813e75d8
2026-02-19T14:17:25.194+08:00  INFO 12156 --- [comment-service] [t.remote.worker] com.alibaba.nacos.common.remote.client   : [612112af-09fd-4453-be1b-3516bcf29630] Notify connected event to listeners.
2026-02-19T14:17:25.195+08:00  INFO 12156 --- [comment-service] [t.remote.worker] com.alibaba.nacos.client.naming          : Grpc connection connect
2026-02-19T14:17:25.249+08:00  INFO 12156 --- [comment-service] [)-192.168.198.1] com.alibaba.druid.pool.DruidDataSource   : {dataSource-1} inited

---

## Assistant (Build · big-pickle · 11.4s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 10.4s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 9.1s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 8.4s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 26.0s)

进程12156连接了Redis和MySQL，但8006端口没有启动。日志显示初始化完成但Tomcat没有启动。

请在IDE中查看更多日志，搜索`Tomcat`或`Started`关键字，或者尝试：
1. 停止当前进程
2. 清理并重新编译
3. 以Debug模式启动看卡在哪里

---

## User

我发现运行状况中显示discovery client not initial

---

## Assistant (Build · big-pickle · 34.9s)

**Tool: read**

---

## Assistant (Build · big-pickle · 9.0s)

**Tool: read**

---

## Assistant (Build · big-pickle · 11.3s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 8.8s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 9.7s)

8006端口确实没有启动。请：

1. 停止当前运行的comment-service
2. 重新启动并等待完整启动日志

启动成功后应该看到类似：
```
Started CommentServiceApplication in X seconds
```

如果还是没有端口显示，请把完整的IDE控制台日志发给我看看。

---

## User

D:\CodeEnvironment\java\java_17\bin\java.exe -agentlib:jdwp=transport=dt_socket,address=127.0.0.1:56906,suspend=y,server=n -javaagent:C:\Users\colorful\AppData\Local\JetBrains\IntelliJIdea2025.2\captureAgent\debugger-agent.jar=file:///C:/Users/colorful/AppData/Local/Temp/capture7963730264967931463.props -agentpath:C:\Users\colorful\AppData\Local\Temp\idea_libasyncProfiler_dll_temp_folder\libasyncProfiler.dll=version,jfr,event=wall,interval=10ms,cstack=no,file=C:\Users\colorful\IdeaSnapshots\CommentServiceApplication_2026_02_19_142254.jfr,dbghelppath=C:\Users\colorful\AppData\Local\Temp\idea_dbghelp_dll_temp_folder\dbghelp.dll,log=C:\Users\colorful\AppData\Local\Temp\CommentServiceApplication_2026_02_19_142254.jfr.log.txt,logLevel=DEBUG -XX:TieredStopAtLevel=1 -Dspring.output.ansi.enabled=always -Dcom.sun.management.jmxremote -Dspring.jmx.enabled=true -Dspring.liveBeansView.mbeanDomain -Dspring.application.admin.enabled=true "-Dmanagement.endpoints.jmx.exposure.include=*" -Dkotlinx.coroutines.debug.enable.creation.stack.trace=false -Ddebugger.agent.enable.coroutines=true -Dkotlinx.coroutines.debug.enable.flows.stack.trace=true -Dkotlinx.coroutines.debug.enable.mutable.state.flows.stack.trace=true -Dfile.encoding=UTF-8 -classpath "D:\Project\java_project\only-students\comment-service\target\classes;D:\Project\java_project\only-students\only-students-common\target\classes;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\slf4j\slf4j-api\2.0.9\slf4j-api-2.0.9.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\cn\hutool\hutool-all\5.8.22\hutool-all-5.8.22.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-web\6.1.1\spring-web-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-beans\6.1.1\spring-beans-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-core\6.1.1\spring-core-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-jcl\6.1.1\spring-jcl-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\micrometer\micrometer-observation\1.12.0\micrometer-observation-1.12.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\micrometer\micrometer-commons\1.12.0\micrometer-commons-1.12.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-context\6.1.1\spring-context-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-aop\6.1.1\spring-aop-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-expression\6.1.1\spring-expression-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\auth0\java-jwt\4.4.0\java-jwt-4.4.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\fasterxml\jackson\core\jackson-databind\2.15.3\jackson-databind-2.15.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\fasterxml\jackson\datatype\jackson-datatype-jsr310\2.15.3\jackson-datatype-jsr310-2.15.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\fasterxml\jackson\core\jackson-annotations\2.15.3\jackson-annotations-2.15.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\fasterxml\jackson\core\jackson-core\2.15.3\jackson-core-2.15.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\baomidou\mybatis-plus-spring-boot3-starter\3.5.7\mybatis-plus-spring-boot3-starter-3.5.7.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\baomidou\mybatis-plus\3.5.7\mybatis-plus-3.5.7.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\baomidou\mybatis-plus-core\3.5.7\mybatis-plus-core-3.5.7.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\baomidou\mybatis-plus-annotation\3.5.7\mybatis-plus-annotation-3.5.7.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\baomidou\mybatis-plus-extension\3.5.7\mybatis-plus-extension-3.5.7.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\mybatis\mybatis\3.5.16\mybatis-3.5.16.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\github\jsqlparser\jsqlparser\4.9\jsqlparser-4.9.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\mybatis\mybatis-spring\3.0.3\mybatis-spring-3.0.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\baomidou\mybatis-plus-spring-boot-autoconfigure\3.5.7\mybatis-plus-spring-boot-autoconfigure-3.5.7.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-autoconfigure\3.2.0\spring-boot-autoconfigure-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot\3.2.0\spring-boot-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-starter-jdbc\3.2.0\spring-boot-starter-jdbc-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\zaxxer\HikariCP\5.0.1\HikariCP-5.0.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-jdbc\6.1.1\spring-jdbc-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\druid-spring-boot-starter\1.2.20\druid-spring-boot-starter-1.2.20.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\druid\1.2.20\druid-1.2.20.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\glassfish\jaxb\jaxb-runtime\4.0.4\jaxb-runtime-4.0.4.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\glassfish\jaxb\jaxb-core\4.0.4\jaxb-core-4.0.4.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\jakarta\xml\bind\jakarta.xml.bind-api\4.0.1\jakarta.xml.bind-api-4.0.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\jakarta\activation\jakarta.activation-api\2.1.2\jakarta.activation-api-2.1.2.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\eclipse\angus\angus-activation\2.0.1\angus-activation-2.0.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\glassfish\jaxb\txw2\4.0.4\txw2-4.0.4.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\sun\istack\istack-commons-runtime\4.1.2\istack-commons-runtime-4.1.2.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\mysql\mysql-connector-j\8.0.33\mysql-connector-j-8.0.33.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\redisson\redisson-spring-boot-starter\3.24.3\redisson-spring-boot-starter-3.24.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-starter-actuator\3.2.0\spring-boot-starter-actuator-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-actuator-autoconfigure\3.2.0\spring-boot-actuator-autoconfigure-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-actuator\3.2.0\spring-boot-actuator-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\micrometer\micrometer-jakarta9\1.12.0\micrometer-jakarta9-1.12.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\micrometer\micrometer-core\1.12.0\micrometer-core-1.12.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\hdrhistogram\HdrHistogram\2.1.12\HdrHistogram-2.1.12.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\latencyutils\LatencyUtils\2.0.3\LatencyUtils-2.0.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\redisson\redisson\3.24.3\redisson-3.24.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-common\4.1.101.Final\netty-common-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-codec\4.1.101.Final\netty-codec-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-buffer\4.1.101.Final\netty-buffer-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-transport\4.1.101.Final\netty-transport-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-resolver\4.1.101.Final\netty-resolver-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-resolver-dns\4.1.101.Final\netty-resolver-dns-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-codec-dns\4.1.101.Final\netty-codec-dns-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-handler\4.1.101.Final\netty-handler-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-transport-native-unix-common\4.1.101.Final\netty-transport-native-unix-common-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\javax\cache\cache-api\1.1.1\cache-api-1.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\projectreactor\reactor-core\3.6.0\reactor-core-3.6.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\reactivestreams\reactive-streams\1.0.4\reactive-streams-1.0.4.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\reactivex\rxjava3\rxjava\3.1.8\rxjava-3.1.8.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\jboss\marshalling\jboss-marshalling\2.0.11.Final\jboss-marshalling-2.0.11.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\jboss\marshalling\jboss-marshalling-river\2.0.11.Final\jboss-marshalling-river-2.0.11.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\esotericsoftware\kryo\5.5.0\kryo-5.5.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\esotericsoftware\reflectasm\1.11.9\reflectasm-1.11.9.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\objenesis\objenesis\3.3\objenesis-3.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\esotericsoftware\minlog\1.3.1\minlog-1.3.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\fasterxml\jackson\dataformat\jackson-dataformat-yaml\2.15.3\jackson-dataformat-yaml-2.15.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\net\bytebuddy\byte-buddy\1.14.10\byte-buddy-1.14.10.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\jodd\jodd-bean\5.1.6\jodd-bean-5.1.6.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\jodd\jodd-core\5.1.6\jodd-core-5.1.6.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\redisson\redisson-spring-data-31\3.24.3\redisson-spring-data-31-3.24.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-starter-data-redis\3.2.0\spring-boot-starter-data-redis-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-starter\3.2.0\spring-boot-starter-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-starter-logging\3.2.0\spring-boot-starter-logging-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\ch\qos\logback\logback-classic\1.4.11\logback-classic-1.4.11.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\ch\qos\logback\logback-core\1.4.11\logback-core-1.4.11.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\apache\logging\log4j\log4j-to-slf4j\2.21.1\log4j-to-slf4j-2.21.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\apache\logging\log4j\log4j-api\2.21.1\log4j-api-2.21.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\slf4j\jul-to-slf4j\2.0.9\jul-to-slf4j-2.0.9.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\yaml\snakeyaml\2.2\snakeyaml-2.2.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\lettuce\lettuce-core\6.3.0.RELEASE\lettuce-core-6.3.0.RELEASE.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\data\spring-data-redis\3.2.0\spring-data-redis-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\data\spring-data-keyvalue\3.2.0\spring-data-keyvalue-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\data\spring-data-commons\3.2.0\spring-data-commons-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-tx\6.1.1\spring-tx-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-oxm\6.1.1\spring-oxm-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-context-support\6.1.1\spring-context-support-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\cloud\spring-cloud-starter-alibaba-nacos-discovery\2023.0.0.0-RC1\spring-cloud-starter-alibaba-nacos-discovery-2023.0.0.0-RC1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\cloud\spring-cloud-alibaba-commons\2023.0.0.0-RC1\spring-cloud-alibaba-commons-2023.0.0.0-RC1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\nacos\nacos-client\2.3.0\nacos-client-2.3.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\nacos\nacos-auth-plugin\2.3.0\nacos-auth-plugin-2.3.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\nacos\nacos-encryption-plugin\2.3.0\nacos-encryption-plugin-2.3.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\commons-codec\commons-codec\1.16.0\commons-codec-1.16.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\apache\httpcomponents\httpasyncclient\4.1.5\httpasyncclient-4.1.5.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\apache\httpcomponents\httpcore-nio\4.4.16\httpcore-nio-4.4.16.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\apache\httpcomponents\httpclient\4.5.13\httpclient-4.5.13.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\apache\httpcomponents\httpcore\4.4.16\httpcore-4.4.16.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\prometheus\simpleclient\0.16.0\simpleclient-0.16.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\prometheus\simpleclient_tracer_otel\0.16.0\simpleclient_tracer_otel-0.16.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\prometheus\simpleclient_tracer_common\0.16.0\simpleclient_tracer_common-0.16.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\prometheus\simpleclient_tracer_otel_agent\0.16.0\simpleclient_tracer_otel_agent-0.16.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\spring\spring-context-support\1.0.11\spring-context-support-1.0.11.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\cloud\spring-cloud-commons\4.1.0\spring-cloud-commons-4.1.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\security\spring-security-crypto\6.2.0\spring-security-crypto-6.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\cloud\spring-cloud-context\4.1.0\spring-cloud-context-4.1.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\cloud\spring-cloud-starter-openfeign\4.1.0\spring-cloud-starter-openfeign-4.1.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\cloud\spring-cloud-starter\4.1.0\spring-cloud-starter-4.1.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\security\spring-security-rsa\1.1.1\spring-security-rsa-1.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\bouncycastle\bcprov-jdk18on\1.74\bcprov-jdk18on-1.74.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\cloud\spring-cloud-openfeign-core\4.1.0\spring-cloud-openfeign-core-4.1.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-starter-aop\3.2.0\spring-boot-starter-aop-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\aspectj\aspectjweaver\1.9.20.1\aspectjweaver-1.9.20.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\github\openfeign\form\feign-form-spring\3.8.0\feign-form-spring-3.8.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\github\openfeign\form\feign-form\3.8.0\feign-form-3.8.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\commons-fileupload\commons-fileupload\1.5\commons-fileupload-1.5.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\commons-io\commons-io\2.11.0\commons-io-2.11.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\github\openfeign\feign-core\13.1\feign-core-13.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\github\openfeign\feign-slf4j\13.1\feign-slf4j-13.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\cloud\spring-cloud-starter-loadbalancer\4.1.0\spring-cloud-starter-loadbalancer-4.1.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\cloud\spring-cloud-loadbalancer\4.1.0\spring-cloud-loadbalancer-4.1.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\projectreactor\addons\reactor-extra\3.5.1\reactor-extra-3.5.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-starter-cache\3.2.0\spring-boot-starter-cache-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\stoyanr\evictor\1.0.0\evictor-1.0.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\cloud\spring-cloud-starter-alibaba-nacos-config\2023.0.0.0-RC1\spring-cloud-starter-alibaba-nacos-config-2023.0.0.0-RC1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\jakarta\annotation\jakarta.annotation-api\2.1.1\jakarta.annotation-api-2.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\github\xiaoymin\knife4j-openapi3-jakarta-spring-boot-starter\4.5.0\knife4j-openapi3-jakarta-spring-boot-starter-4.5.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\github\xiaoymin\knife4j-core\4.5.0\knife4j-core-4.5.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\github\xiaoymin\knife4j-openapi3-ui\4.5.0\knife4j-openapi3-ui-4.5.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springdoc\springdoc-openapi-starter-webmvc-ui\2.3.0\springdoc-openapi-starter-webmvc-ui-2.3.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springdoc\springdoc-openapi-starter-webmvc-api\2.3.0\springdoc-openapi-starter-webmvc-api-2.3.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springdoc\springdoc-openapi-starter-common\2.3.0\springdoc-openapi-starter-common-2.3.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\swagger\core\v3\swagger-core-jakarta\2.2.19\swagger-core-jakarta-2.2.19.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\apache\commons\commons-lang3\3.13.0\commons-lang3-3.13.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\swagger\core\v3\swagger-annotations-jakarta\2.2.19\swagger-annotations-jakarta-2.2.19.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\swagger\core\v3\swagger-models-jakarta\2.2.19\swagger-models-jakarta-2.2.19.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\jakarta\validation\jakarta.validation-api\3.0.2\jakarta.validation-api-3.0.2.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-webmvc\6.1.1\spring-webmvc-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\webjars\swagger-ui\5.10.3\swagger-ui-5.10.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\projectlombok\lombok\1.18.30\lombok-1.18.30.jar;D:\CodeTools\IntelliJ IDEA 2025.2.4\lib\idea_rt.jar" com.onlystudents.comment.CommentServiceApplication
已连接到地址为 ''127.0.0.1:56906'，传输: '套接字'' 的目标虚拟机

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

2026-02-19T14:22:56.659+08:00  INFO 23176 --- [comment-service] [           main] c.o.comment.CommentServiceApplication    : Starting CommentServiceApplication using Java 17.0.16 with PID 23176 (D:\Project\java_project\only-students\comment-service\target\classes started by colorful in D:\Project\java_project\only-students)
2026-02-19T14:22:56.662+08:00  INFO 23176 --- [comment-service] [           main] c.o.comment.CommentServiceApplication    : No active profile set, falling back to 1 default profile: "default"
2026-02-19T14:22:56.697+08:00  WARN 23176 --- [comment-service] [           main] c.a.c.n.c.NacosConfigDataLoader          : [Nacos Config] config[dataId=application-.yaml, group=DEFAULT_GROUP] is empty
2026-02-19T14:22:57.653+08:00  INFO 23176 --- [comment-service] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Multiple Spring Data modules found, entering strict repository configuration mode
2026-02-19T14:22:57.656+08:00  INFO 23176 --- [comment-service] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data Redis repositories in DEFAULT mode.
2026-02-19T14:22:57.690+08:00  INFO 23176 --- [comment-service] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 16 ms. Found 0 Redis repository interfaces.
2026-02-19T14:22:57.951+08:00  INFO 23176 --- [comment-service] [           main] o.s.cloud.context.scope.GenericScope     : BeanFactory id=56b27703-3c69-3bd8-9fd0-082b78e8436a
2026-02-19T14:22:58.492+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.client.loadbalancer.LoadBalancerAutoConfiguration$LoadBalancerInterceptorConfig' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerAutoConfiguration$LoadBalancerInterceptorConfig] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). The currently created BeanPostProcessor [lbRestClientPostProcessor] is declared through a non-static factory method on that class; consider declaring it as static instead.
2026-02-19T14:22:58.495+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.loadbalancer.config.BlockingLoadBalancerClientAutoConfiguration' of type [org.springframework.cloud.loadbalancer.config.BlockingLoadBalancerClientAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.498+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.loadbalancer.config.LoadBalancerAutoConfiguration' of type [org.springframework.cloud.loadbalancer.config.LoadBalancerAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.509+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.commons.config.CommonsConfigAutoConfiguration' of type [org.springframework.cloud.commons.config.CommonsConfigAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.512+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.client.loadbalancer.LoadBalancerDefaultMappingsProviderAutoConfiguration' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerDefaultMappingsProviderAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.513+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerClientsDefaultsMappingsProvider' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerDefaultMappingsProviderAutoConfiguration$$Lambda$673/0x000001f0a66d0e88] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.519+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'defaultsBindHandlerAdvisor' of type [org.springframework.cloud.commons.config.DefaultsBindHandlerAdvisor] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.526+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'spring.cloud.loadbalancer-org.springframework.cloud.client.loadbalancer.LoadBalancerClientsProperties' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerClientsProperties] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.533+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'default.org.springframework.cloud.loadbalancer.config.LoadBalancerAutoConfiguration.LoadBalancerClientSpecification' of type [org.springframework.cloud.loadbalancer.annotation.LoadBalancerClientSpecification] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.535+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'default.org.springframework.cloud.loadbalancer.config.BlockingLoadBalancerClientAutoConfiguration.LoadBalancerClientSpecification' of type [org.springframework.cloud.loadbalancer.annotation.LoadBalancerClientSpecification] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.536+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerClientFactory' of type [org.springframework.cloud.loadbalancer.support.LoadBalancerClientFactory] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.544+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'blockingLoadBalancerClient' of type [org.springframework.cloud.loadbalancer.blocking.client.BlockingLoadBalancerClient] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.554+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerServiceInstanceCookieTransformer' of type [org.springframework.cloud.loadbalancer.core.LoadBalancerServiceInstanceCookieTransformer] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.556+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'xForwarderHeadersTransformer' of type [org.springframework.cloud.loadbalancer.blocking.XForwardedHeadersTransformer] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.558+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.client.loadbalancer.LoadBalancerAutoConfiguration' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.560+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerRequestFactory' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerRequestFactory] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.562+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerInterceptor' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerInterceptor] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
Logging initialized using 'class org.apache.ibatis.logging.stdout.StdOutImpl' adapter.
Get /172.27.16.1 network interface 
Get network interface info: name:eth12 (Hyper-V Virtual Ethernet Adapter)
Initialization Sequence datacenterId:28 workerId:9
 _ _   |_  _ _|_. ___ _ |    _ 
| | |\/|_)(_| | |_\  |_)||_|_\ 
     /               |         
                        3.5.7 
2026-02-19T14:22:59.418+08:00  INFO 23176 --- [comment-service] [           main] o.s.c.openfeign.FeignClientFactoryBean   : For 'user-service' URL not provided. Will try picking an instance via load-balancing.
2026-02-19T14:22:59.819+08:00  INFO 23176 --- [comment-service] [           main] org.redisson.Version                     : Redisson 3.24.3
2026-02-19T14:23:00.236+08:00  INFO 23176 --- [comment-service] [isson-netty-2-6] o.r.c.pool.MasterPubSubConnectionPool    : 1 connections initialized for localhost/127.0.0.1:6379
2026-02-19T14:23:00.339+08:00  INFO 23176 --- [comment-service] [sson-netty-2-20] o.r.c.pool.D:\CodeEnvironment\java\java_17\bin\java.exe -agentlib:jdwp=transport=dt_socket,address=127.0.0.1:56906,suspend=y,server=n -javaagent:C:\Users\colorful\AppData\Local\JetBrains\IntelliJIdea2025.2\captureAgent\debugger-agent.jar=file:///C:/Users/colorful/AppData/Local/Temp/capture7963730264967931463.props -agentpath:C:\Users\colorful\AppData\Local\Temp\idea_libasyncProfiler_dll_temp_folder\libasyncProfiler.dll=version,jfr,event=wall,interval=10ms,cstack=no,file=C:\Users\colorful\IdeaSnapshots\CommentServiceApplication_2026_02_19_142254.jfr,dbghelppath=C:\Users\colorful\AppData\Local\Temp\idea_dbghelp_dll_temp_folder\dbghelp.dll,log=C:\Users\colorful\AppData\Local\Temp\CommentServiceApplication_2026_02_19_142254.jfr.log.txt,logLevel=DEBUG -XX:TieredStopAtLevel=1 -Dspring.output.ansi.enabled=always -Dcom.sun.management.jmxremote -Dspring.jmx.enabled=true -Dspring.liveBeansView.mbeanDomain -Dspring.application.admin.enabled=true "-Dmanagement.endpoints.jmx.exposure.include=*" -Dkotlinx.coroutines.debug.enable.creation.stack.trace=false -Ddebugger.agent.enable.coroutines=true -Dkotlinx.coroutines.debug.enable.flows.stack.trace=true -Dkotlinx.coroutines.debug.enable.mutable.state.flows.stack.trace=true -Dfile.encoding=UTF-8 -classpath "D:\Project\java_project\only-students\comment-service\target\classes;D:\Project\java_project\only-students\only-students-common\target\classes;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\slf4j\slf4j-api\2.0.9\slf4j-api-2.0.9.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\cn\hutool\hutool-all\5.8.22\hutool-all-5.8.22.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-web\6.1.1\spring-web-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-beans\6.1.1\spring-beans-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-core\6.1.1\spring-core-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-jcl\6.1.1\spring-jcl-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\micrometer\micrometer-observation\1.12.0\micrometer-observation-1.12.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\micrometer\micrometer-commons\1.12.0\micrometer-commons-1.12.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-context\6.1.1\spring-context-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-aop\6.1.1\spring-aop-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-expression\6.1.1\spring-expression-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\auth0\java-jwt\4.4.0\java-jwt-4.4.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\fasterxml\jackson\core\jackson-databind\2.15.3\jackson-databind-2.15.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\fasterxml\jackson\datatype\jackson-datatype-jsr310\2.15.3\jackson-datatype-jsr310-2.15.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\fasterxml\jackson\core\jackson-annotations\2.15.3\jackson-annotations-2.15.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\fasterxml\jackson\core\jackson-core\2.15.3\jackson-core-2.15.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\baomidou\mybatis-plus-spring-boot3-starter\3.5.7\mybatis-plus-spring-boot3-starter-3.5.7.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\baomidou\mybatis-plus\3.5.7\mybatis-plus-3.5.7.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\baomidou\mybatis-plus-core\3.5.7\mybatis-plus-core-3.5.7.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\baomidou\mybatis-plus-annotation\3.5.7\mybatis-plus-annotation-3.5.7.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\baomidou\mybatis-plus-extension\3.5.7\mybatis-plus-extension-3.5.7.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\mybatis\mybatis\3.5.16\mybatis-3.5.16.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\github\jsqlparser\jsqlparser\4.9\jsqlparser-4.9.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\mybatis\mybatis-spring\3.0.3\mybatis-spring-3.0.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\baomidou\mybatis-plus-spring-boot-autoconfigure\3.5.7\mybatis-plus-spring-boot-autoconfigure-3.5.7.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-autoconfigure\3.2.0\spring-boot-autoconfigure-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot\3.2.0\spring-boot-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-starter-jdbc\3.2.0\spring-boot-starter-jdbc-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\zaxxer\HikariCP\5.0.1\HikariCP-5.0.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-jdbc\6.1.1\spring-jdbc-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\druid-spring-boot-starter\1.2.20\druid-spring-boot-starter-1.2.20.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\druid\1.2.20\druid-1.2.20.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\glassfish\jaxb\jaxb-runtime\4.0.4\jaxb-runtime-4.0.4.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\glassfish\jaxb\jaxb-core\4.0.4\jaxb-core-4.0.4.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\jakarta\xml\bind\jakarta.xml.bind-api\4.0.1\jakarta.xml.bind-api-4.0.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\jakarta\activation\jakarta.activation-api\2.1.2\jakarta.activation-api-2.1.2.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\eclipse\angus\angus-activation\2.0.1\angus-activation-2.0.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\glassfish\jaxb\txw2\4.0.4\txw2-4.0.4.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\sun\istack\istack-commons-runtime\4.1.2\istack-commons-runtime-4.1.2.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\mysql\mysql-connector-j\8.0.33\mysql-connector-j-8.0.33.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\redisson\redisson-spring-boot-starter\3.24.3\redisson-spring-boot-starter-3.24.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-starter-actuator\3.2.0\spring-boot-starter-actuator-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-actuator-autoconfigure\3.2.0\spring-boot-actuator-autoconfigure-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-actuator\3.2.0\spring-boot-actuator-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\micrometer\micrometer-jakarta9\1.12.0\micrometer-jakarta9-1.12.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\micrometer\micrometer-core\1.12.0\micrometer-core-1.12.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\hdrhistogram\HdrHistogram\2.1.12\HdrHistogram-2.1.12.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\latencyutils\LatencyUtils\2.0.3\LatencyUtils-2.0.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\redisson\redisson\3.24.3\redisson-3.24.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-common\4.1.101.Final\netty-common-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-codec\4.1.101.Final\netty-codec-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-buffer\4.1.101.Final\netty-buffer-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-transport\4.1.101.Final\netty-transport-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-resolver\4.1.101.Final\netty-resolver-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-resolver-dns\4.1.101.Final\netty-resolver-dns-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-codec-dns\4.1.101.Final\netty-codec-dns-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-handler\4.1.101.Final\netty-handler-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\netty\netty-transport-native-unix-common\4.1.101.Final\netty-transport-native-unix-common-4.1.101.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\javax\cache\cache-api\1.1.1\cache-api-1.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\projectreactor\reactor-core\3.6.0\reactor-core-3.6.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\reactivestreams\reactive-streams\1.0.4\reactive-streams-1.0.4.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\reactivex\rxjava3\rxjava\3.1.8\rxjava-3.1.8.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\jboss\marshalling\jboss-marshalling\2.0.11.Final\jboss-marshalling-2.0.11.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\jboss\marshalling\jboss-marshalling-river\2.0.11.Final\jboss-marshalling-river-2.0.11.Final.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\esotericsoftware\kryo\5.5.0\kryo-5.5.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\esotericsoftware\reflectasm\1.11.9\reflectasm-1.11.9.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\objenesis\objenesis\3.3\objenesis-3.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\esotericsoftware\minlog\1.3.1\minlog-1.3.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\fasterxml\jackson\dataformat\jackson-dataformat-yaml\2.15.3\jackson-dataformat-yaml-2.15.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\net\bytebuddy\byte-buddy\1.14.10\byte-buddy-1.14.10.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\jodd\jodd-bean\5.1.6\jodd-bean-5.1.6.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\jodd\jodd-core\5.1.6\jodd-core-5.1.6.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\redisson\redisson-spring-data-31\3.24.3\redisson-spring-data-31-3.24.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-starter-data-redis\3.2.0\spring-boot-starter-data-redis-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-starter\3.2.0\spring-boot-starter-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-starter-logging\3.2.0\spring-boot-starter-logging-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\ch\qos\logback\logback-classic\1.4.11\logback-classic-1.4.11.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\ch\qos\logback\logback-core\1.4.11\logback-core-1.4.11.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\apache\logging\log4j\log4j-to-slf4j\2.21.1\log4j-to-slf4j-2.21.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\apache\logging\log4j\log4j-api\2.21.1\log4j-api-2.21.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\slf4j\jul-to-slf4j\2.0.9\jul-to-slf4j-2.0.9.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\yaml\snakeyaml\2.2\snakeyaml-2.2.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\lettuce\lettuce-core\6.3.0.RELEASE\lettuce-core-6.3.0.RELEASE.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\data\spring-data-redis\3.2.0\spring-data-redis-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\data\spring-data-keyvalue\3.2.0\spring-data-keyvalue-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\data\spring-data-commons\3.2.0\spring-data-commons-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-tx\6.1.1\spring-tx-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-oxm\6.1.1\spring-oxm-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-context-support\6.1.1\spring-context-support-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\cloud\spring-cloud-starter-alibaba-nacos-discovery\2023.0.0.0-RC1\spring-cloud-starter-alibaba-nacos-discovery-2023.0.0.0-RC1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\cloud\spring-cloud-alibaba-commons\2023.0.0.0-RC1\spring-cloud-alibaba-commons-2023.0.0.0-RC1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\nacos\nacos-client\2.3.0\nacos-client-2.3.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\nacos\nacos-auth-plugin\2.3.0\nacos-auth-plugin-2.3.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\nacos\nacos-encryption-plugin\2.3.0\nacos-encryption-plugin-2.3.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\commons-codec\commons-codec\1.16.0\commons-codec-1.16.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\apache\httpcomponents\httpasyncclient\4.1.5\httpasyncclient-4.1.5.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\apache\httpcomponents\httpcore-nio\4.4.16\httpcore-nio-4.4.16.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\apache\httpcomponents\httpclient\4.5.13\httpclient-4.5.13.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\apache\httpcomponents\httpcore\4.4.16\httpcore-4.4.16.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\prometheus\simpleclient\0.16.0\simpleclient-0.16.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\prometheus\simpleclient_tracer_otel\0.16.0\simpleclient_tracer_otel-0.16.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\prometheus\simpleclient_tracer_common\0.16.0\simpleclient_tracer_common-0.16.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\prometheus\simpleclient_tracer_otel_agent\0.16.0\simpleclient_tracer_otel_agent-0.16.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\spring\spring-context-support\1.0.11\spring-context-support-1.0.11.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\cloud\spring-cloud-commons\4.1.0\spring-cloud-commons-4.1.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\security\spring-security-crypto\6.2.0\spring-security-crypto-6.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\cloud\spring-cloud-context\4.1.0\spring-cloud-context-4.1.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\cloud\spring-cloud-starter-openfeign\4.1.0\spring-cloud-starter-openfeign-4.1.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\cloud\spring-cloud-starter\4.1.0\spring-cloud-starter-4.1.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\security\spring-security-rsa\1.1.1\spring-security-rsa-1.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\bouncycastle\bcprov-jdk18on\1.74\bcprov-jdk18on-1.74.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\cloud\spring-cloud-openfeign-core\4.1.0\spring-cloud-openfeign-core-4.1.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-starter-aop\3.2.0\spring-boot-starter-aop-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\aspectj\aspectjweaver\1.9.20.1\aspectjweaver-1.9.20.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\github\openfeign\form\feign-form-spring\3.8.0\feign-form-spring-3.8.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\github\openfeign\form\feign-form\3.8.0\feign-form-3.8.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\commons-fileupload\commons-fileupload\1.5\commons-fileupload-1.5.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\commons-io\commons-io\2.11.0\commons-io-2.11.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\github\openfeign\feign-core\13.1\feign-core-13.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\github\openfeign\feign-slf4j\13.1\feign-slf4j-13.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\cloud\spring-cloud-starter-loadbalancer\4.1.0\spring-cloud-starter-loadbalancer-4.1.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\cloud\spring-cloud-loadbalancer\4.1.0\spring-cloud-loadbalancer-4.1.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\projectreactor\addons\reactor-extra\3.5.1\reactor-extra-3.5.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\boot\spring-boot-starter-cache\3.2.0\spring-boot-starter-cache-3.2.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\stoyanr\evictor\1.0.0\evictor-1.0.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\alibaba\cloud\spring-cloud-starter-alibaba-nacos-config\2023.0.0.0-RC1\spring-cloud-starter-alibaba-nacos-config-2023.0.0.0-RC1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\jakarta\annotation\jakarta.annotation-api\2.1.1\jakarta.annotation-api-2.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\github\xiaoymin\knife4j-openapi3-jakarta-spring-boot-starter\4.5.0\knife4j-openapi3-jakarta-spring-boot-starter-4.5.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\github\xiaoymin\knife4j-core\4.5.0\knife4j-core-4.5.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\com\github\xiaoymin\knife4j-openapi3-ui\4.5.0\knife4j-openapi3-ui-4.5.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springdoc\springdoc-openapi-starter-webmvc-ui\2.3.0\springdoc-openapi-starter-webmvc-ui-2.3.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springdoc\springdoc-openapi-starter-webmvc-api\2.3.0\springdoc-openapi-starter-webmvc-api-2.3.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springdoc\springdoc-openapi-starter-common\2.3.0\springdoc-openapi-starter-common-2.3.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\swagger\core\v3\swagger-core-jakarta\2.2.19\swagger-core-jakarta-2.2.19.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\apache\commons\commons-lang3\3.13.0\commons-lang3-3.13.0.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\swagger\core\v3\swagger-annotations-jakarta\2.2.19\swagger-annotations-jakarta-2.2.19.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\io\swagger\core\v3\swagger-models-jakarta\2.2.19\swagger-models-jakarta-2.2.19.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\jakarta\validation\jakarta.validation-api\3.0.2\jakarta.validation-api-3.0.2.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\springframework\spring-webmvc\6.1.1\spring-webmvc-6.1.1.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\webjars\swagger-ui\5.10.3\swagger-ui-5.10.3.jar;D:\CodeEnvironment\apache-maven-3.9.11\mvn_resp\org\projectlombok\lombok\1.18.30\lombok-1.18.30.jar;D:\CodeTools\IntelliJ IDEA 2025.2.4\lib\idea_rt.jar" com.onlystudents.comment.CommentServiceApplication
已连接到地址为 ''127.0.0.1:56906'，传输: '套接字'' 的目标虚拟机

  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/
 :: Spring Boot ::                (v3.2.0)

2026-02-19T14:22:56.659+08:00  INFO 23176 --- [comment-service] [           main] c.o.comment.CommentServiceApplication    : Starting CommentServiceApplication using Java 17.0.16 with PID 23176 (D:\Project\java_project\only-students\comment-service\target\classes started by colorful in D:\Project\java_project\only-students)
2026-02-19T14:22:56.662+08:00  INFO 23176 --- [comment-service] [           main] c.o.comment.CommentServiceApplication    : No active profile set, falling back to 1 default profile: "default"
2026-02-19T14:22:56.697+08:00  WARN 23176 --- [comment-service] [           main] c.a.c.n.c.NacosConfigDataLoader          : [Nacos Config] config[dataId=application-.yaml, group=DEFAULT_GROUP] is empty
2026-02-19T14:22:57.653+08:00  INFO 23176 --- [comment-service] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Multiple Spring Data modules found, entering strict repository configuration mode
2026-02-19T14:22:57.656+08:00  INFO 23176 --- [comment-service] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Bootstrapping Spring Data Redis repositories in DEFAULT mode.
2026-02-19T14:22:57.690+08:00  INFO 23176 --- [comment-service] [           main] .s.d.r.c.RepositoryConfigurationDelegate : Finished Spring Data repository scanning in 16 ms. Found 0 Redis repository interfaces.
2026-02-19T14:22:57.951+08:00  INFO 23176 --- [comment-service] [           main] o.s.cloud.context.scope.GenericScope     : BeanFactory id=56b27703-3c69-3bd8-9fd0-082b78e8436a
2026-02-19T14:22:58.492+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.client.loadbalancer.LoadBalancerAutoConfiguration$LoadBalancerInterceptorConfig' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerAutoConfiguration$LoadBalancerInterceptorConfig] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). The currently created BeanPostProcessor [lbRestClientPostProcessor] is declared through a non-static factory method on that class; consider declaring it as static instead.
2026-02-19T14:22:58.495+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.loadbalancer.config.BlockingLoadBalancerClientAutoConfiguration' of type [org.springframework.cloud.loadbalancer.config.BlockingLoadBalancerClientAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.498+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.loadbalancer.config.LoadBalancerAutoConfiguration' of type [org.springframework.cloud.loadbalancer.config.LoadBalancerAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.509+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.commons.config.CommonsConfigAutoConfiguration' of type [org.springframework.cloud.commons.config.CommonsConfigAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.512+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.client.loadbalancer.LoadBalancerDefaultMappingsProviderAutoConfiguration' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerDefaultMappingsProviderAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.513+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerClientsDefaultsMappingsProvider' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerDefaultMappingsProviderAutoConfiguration$$Lambda$673/0x000001f0a66d0e88] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.519+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'defaultsBindHandlerAdvisor' of type [org.springframework.cloud.commons.config.DefaultsBindHandlerAdvisor] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.526+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'spring.cloud.loadbalancer-org.springframework.cloud.client.loadbalancer.LoadBalancerClientsProperties' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerClientsProperties] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.533+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'default.org.springframework.cloud.loadbalancer.config.LoadBalancerAutoConfiguration.LoadBalancerClientSpecification' of type [org.springframework.cloud.loadbalancer.annotation.LoadBalancerClientSpecification] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.535+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'default.org.springframework.cloud.loadbalancer.config.BlockingLoadBalancerClientAutoConfiguration.LoadBalancerClientSpecification' of type [org.springframework.cloud.loadbalancer.annotation.LoadBalancerClientSpecification] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.536+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerClientFactory' of type [org.springframework.cloud.loadbalancer.support.LoadBalancerClientFactory] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.544+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'blockingLoadBalancerClient' of type [org.springframework.cloud.loadbalancer.blocking.client.BlockingLoadBalancerClient] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.554+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerServiceInstanceCookieTransformer' of type [org.springframework.cloud.loadbalancer.core.LoadBalancerServiceInstanceCookieTransformer] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.556+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'xForwarderHeadersTransformer' of type [org.springframework.cloud.loadbalancer.blocking.XForwardedHeadersTransformer] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.558+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'org.springframework.cloud.client.loadbalancer.LoadBalancerAutoConfiguration' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerAutoConfiguration] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.560+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerRequestFactory' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerRequestFactory] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
2026-02-19T14:22:58.562+08:00  WARN 23176 --- [comment-service] [           main] trationDelegate$BeanPostProcessorChecker : Bean 'loadBalancerInterceptor' of type [org.springframework.cloud.client.loadbalancer.LoadBalancerInterceptor] is not eligible for getting processed by all BeanPostProcessors (for example: not eligible for auto-proxying). Is this bean getting eagerly injected into a currently created BeanPostProcessor [lbRestClientPostProcessor]? Check the corresponding BeanPostProcessor declaration and its dependencies.
Logging initialized using 'class org.apache.ibatis.logging.stdout.StdOutImpl' adapter.
Get /172.27.16.1 network interface 
Get network interface info: name:eth12 (Hyper-V Virtual Ethernet Adapter)
Initialization Sequence datacenterId:28 workerId:9
 _ _   |_  _ _|_. ___ _ |    _ 
| | |\/|_)(_| | |_\  |_)||_|_\ 
     /               |         
                        3.5.7 
2026-02-19T14:22:59.418+08:00  INFO 23176 --- [comment-service] [           main] o.s.c.openfeign.FeignClientFactoryBean   : For 'user-service' URL not provided. Will try picking an instance via load-balancing.
2026-02-19T14:22:59.819+08:00  INFO 23176 --- [comment-service] [           main] org.redisson.Version                     : Redisson 3.24.3
2026-02-19T14:23:00.236+08:00  INFO 23176 --- [comment-service] [isson-netty-2-6] o.r.c.pool.MasterPubSubConnectionPool    : 1 connections initialized for localhost/127.0.0.1:6379
2026-02-19T14:23:00.339+08:00  INFO 23176 --- [comment-service] [sson-netty-2-20] o.r.c.pool.MasterConnectionPool          : 24 connections initialized for localhost/127.0.0.1:6379
2026-02-19T14:23:01.381+08:00  WARN 23176 --- [comment-service] [           main] iguration$LoadBalancerCaffeineWarnLogger : Spring Cloud LoadBalancer is currently working with the default cache. While this cache implementation is useful for development and tests, it's recommended to use Caffeine cache in production.You can switch to using Caffeine cache, by adding it and org.springframework.cache.caffeine.CaffeineCacheManager to the classpath.
2026-02-19T14:23:01.458+08:00  INFO 23176 --- [comment-service] [           main] c.o.comment.CommentServiceApplication    : Started CommentServiceApplication in 6.369 seconds (process running for 7.38)
2026-02-19T14:23:01.464+08:00  INFO 23176 --- [comment-service] [           main] c.a.nacos.client.config.impl.CacheData   : config listener notify warn timeout millis use default 60000 millis 
2026-02-19T14:23:01.464+08:00  INFO 23176 --- [comment-service] [           main] c.a.nacos.client.config.impl.CacheData   : nacos.cache.data.init.snapshot = true 
2026-02-19T14:23:01.464+08:00  INFO 23176 --- [comment-service] [           main] c.a.n.client.config.impl.ClientWorker    : [fixed-localhost_8848] [subscribe] application-.yaml+DEFAULT_GROUP
2026-02-19T14:23:01.475+08:00  INFO 23176 --- [comment-service] [           main] c.a.nacos.client.config.impl.CacheData   : [fixed-localhost_8848] [add-listener] ok, tenant=, dataId=application-.yaml, group=DEFAULT_GROUP, cnt=1
2026-02-19T14:23:01.476+08:00  INFO 23176 --- [comment-service] [           main] c.a.c.n.refresh.NacosContextRefresher    : [Nacos Config] Listening config: dataId=application-.yaml, group=DEFAULT_GROUP
2026-02-19T14:23:01.910+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] com.alibaba.nacos.client.naming          : initializer namespace from ans.namespace attribute : null
2026-02-19T14:23:01.911+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] com.alibaba.nacos.client.naming          : initializer namespace from ALIBABA_ALIWARE_NAMESPACE attribute :null
2026-02-19T14:23:01.912+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] com.alibaba.nacos.client.naming          : initializer namespace from namespace attribute :null
2026-02-19T14:23:01.926+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] c.a.n.p.a.s.c.ClientAuthPluginManager    : [ClientAuthPluginManager] Load ClientAuthService com.alibaba.nacos.client.auth.impl.NacosClientAuthServiceImpl success.
2026-02-19T14:23:01.926+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] c.a.n.p.a.s.c.ClientAuthPluginManager    : [ClientAuthPluginManager] Load ClientAuthService com.alibaba.nacos.client.auth.ram.RamClientAuthServiceImpl success.
2026-02-19T14:23:01.933+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] com.alibaba.nacos.common.remote.client   : [RpcClientFactory] create a new rpc client of dcb64754-3512-41e1-884b-6c978ed38699
2026-02-19T14:23:01.936+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] com.alibaba.nacos.client.naming          : Create naming rpc client for uuid->dcb64754-3512-41e1-884b-6c978ed38699
2026-02-19T14:23:01.936+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] com.alibaba.nacos.common.remote.client   : [dcb64754-3512-41e1-884b-6c978ed38699] RpcClient init, ServerListFactory = com.alibaba.nacos.client.naming.core.ServerListManager
2026-02-19T14:23:01.936+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] com.alibaba.nacos.common.remote.client   : [dcb64754-3512-41e1-884b-6c978ed38699] Registry connection listener to current client:com.alibaba.nacos.client.naming.remote.gprc.redo.NamingGrpcRedoService
2026-02-19T14:23:01.936+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] com.alibaba.nacos.common.remote.client   : [dcb64754-3512-41e1-884b-6c978ed38699] Register server push request handler:com.alibaba.nacos.client.naming.remote.gprc.NamingPushRequestHandler
2026-02-19T14:23:01.937+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] com.alibaba.nacos.common.remote.client   : [dcb64754-3512-41e1-884b-6c978ed38699] Try to connect to server on start up, server: {serverIp = 'localhost', server main port = 8848}
2026-02-19T14:23:01.937+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] c.a.n.c.remote.client.grpc.GrpcClient    : grpc client connection server:localhost ip,serverPort:9848,grpcTslConfig:{"sslProvider":"","enableTls":false,"mutualAuthEnable":false,"trustAll":false}
2026-02-19T14:23:01.957+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] com.alibaba.nacos.common.remote.client   : [dcb64754-3512-41e1-884b-6c978ed38699] Success to connect to server [localhost:8848] on start up, connectionId = 1771482181947_172.18.0.1_58004
2026-02-19T14:23:01.957+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] com.alibaba.nacos.common.remote.client   : [dcb64754-3512-41e1-884b-6c978ed38699] Register server push request handler:com.alibaba.nacos.common.remote.client.RpcClient$ConnectResetRequestHandler
2026-02-19T14:23:01.957+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] com.alibaba.nacos.common.remote.client   : [dcb64754-3512-41e1-884b-6c978ed38699] Register server push request handler:com.alibaba.nacos.common.remote.client.RpcClient$$Lambda$348/0x000001f0a63f6160
2026-02-19T14:23:01.957+08:00  INFO 23176 --- [comment-service] [t.remote.worker] com.alibaba.nacos.common.remote.client   : [dcb64754-3512-41e1-884b-6c978ed38699] Notify connected event to listeners.
2026-02-19T14:23:01.957+08:00  INFO 23176 --- [comment-service] [t.remote.worker] com.alibaba.nacos.client.naming          : Grpc connection connect
2026-02-19T14:23:02.009+08:00  INFO 23176 --- [comment-service] [)-192.168.198.1] com.alibaba.druid.pool.DruidDataSource   : {dataSource-1} inited 

---

## Assistant (Build · big-pickle · 24.4s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 8.4s)

**Tool: bash**

---

## Assistant (Build · big-pickle · 18.6s)

**Tool: grep**

---

## Assistant (Build · big-pickle · 15.1s)

问题找到了！comment-service缺少`spring-boot-starter-web`依赖，所以没有启动Tomcat服务器。

**Tool: read**

---

## Assistant (Build · big-pickle · 15.8s)

**Tool: edit**

---

## Assistant (Build · big-pickle · 11.7s)

已添加`spring-boot-starter-web`依赖。请：

1. 停止comment-service
2. 重新编译：`mvn clean compile`
3. 重新启动

现在应该能看到8006端口了。

---

## User

我在发表评论后能够上传到数据库，但前端没有显示

---

## Assistant (Build · big-pickle · 14.7s)

**Tool: grep**

---

## Assistant (Build · big-pickle · 9.2s)

**Tool: read**

---

## Assistant (Build · big-pickle · 9.3s)

**Tool: read**

---

## Assistant (Build · big-pickle · 9.6s)

**Tool: read**

---

## Assistant (Build · big-pickle · 8.6s)

**Tool: glob**

---

## Assistant (Build · big-pickle · 11.5s)

**Tool: read**

---

## Assistant (Build · big-pickle · 13.2s)

问题找到了！后端API返回的是`List<CommentDTO>`，但前端期望的是分页格式`{list: [], total: number}`。

让我检查后端是否有分页接口：

**Tool: grep**

---

## Assistant (Build · big-pickle · 12.9s)

后端没有分页接口，返回的是普通数组。修改前端适配：

**Tool: edit**

---

## Assistant (Build · big-pickle · 10.6s)

**Tool: edit**

---

## Assistant (Build · big-pickle · 11.1s)

已修复！后端返回数组而不是分页对象，前端已适配。现在再试试发表评论后能否显示。

---

## User

你先看看后端的层级评论系统应该没问题吧
然后设计前端的，当我点击某个评论后应该跳转到该评论的详情页，根评论在最上方，下面是他的评论

---

## Assistant (Build · big-pickle · 13.9s)

**Tool: read**

---

## Assistant (Build · big-pickle · 6.3s)

**Tool: grep**

---

## Assistant (Build · big-pickle · 7.1s)

**Tool: read**

---

## Assistant (Build · big-pickle · 7.9s)

**Tool: read**

---

## Assistant (Build · big-pickle · 2.4s)

---

