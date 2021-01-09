## Docker常用命令3000

- docker images: 查看所有image

- docker run -p 8080:80 -d image

image 80端口映射到本地8080的端口
-d 允许程序直接返回

docker run ubuntu echo hello docker
下载ubuntu 输出hello docker

- docker ps: 当前运行docker的container -a 查看所有运行的container

在host和container之间拷贝文件
- docker cp index.html container_id://usr/share/nginx/html

- docker stop

- docker commit -m 'fun' container_id name

- docker rm id: 删掉docker实例

- docker rmi 删除image

- docker pull 获取image

- docker build 创建image

- docker run 运行container

- docker ps 列出container

## Dockerfile

通过Dockerfile: 创建docker镜像

- example
1. 
```Dockerfile
 From alpine:latest
 MAINTAINER andyxu
 CMD echo 'hello docker'
```

docker build -t (tag) hello_docker .
.代表这个路径所有内容

2. 

```Dockerfile
  FROM ubuntu
  MAINTAINER xbf
  RUN sed -i 's/archive.ubuntu.com/mirrros.ustc.edu.cn/g' /etc/apt/sources.list
  RUN apt-get update
  RUN apt-get install -y nginx
  COPY index.html /var/www/html
  ENTRYPOINT ["/usr/sbin/nginx", "-g", "Daemon off;"]
  EXPOSE 80
```


FROM base image
RUN 执行命令
ADD 添加文件
CMD 执行命令
EXPOST 暴露端口
WORKDIR 指定路径
MAINTAINER 维护者
ENV 设定环境变量
ENTRYPOINT 容器入口
USER 指定用户
VOLUMNE mount point

- curl 测试
curl http://localhost

sudo docker exec -it 775c7c9ee1e1 /bin/bash  

docker rm $(docker ps -qf status=exited)

docker rmi `docker image ls -f dangling=true -q`


vim /etc/sysctl.conf
net.ipv4.ip_forward = 0 改为 net.ipv4.ip_forward = 1

systemctl restart network

docker run -it --name node-test node

问题： 
sudo iptables -t filter -F
sudo iptables -t filter -X
systemctl restart docker


sysctl net.ipv4.ip_forward IP转发

### Volume

提供独立于容器之外的持久化存储; 因此能提供容器之间的共享数据


### Registey 仓库


### daemon 守护程序


### client 客户端

### container 容器入口

### host 宿主机

### compose 多容器app - docker-compose
