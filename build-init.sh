#!/bin/sh

# 脚本相关路径
#SH_FULLPATH=$(readlink -f "$0")                    # 脚本完整路径，如 /var/jenkins_home/workspace/demo/frontend-cmdb/build-init.sh
#SH_CURRENT_DIR=$(dirname ${SH_FULLPATH})           # 脚本所在目录，如 /var/jenkins_home/workspace/demo/frontend-cmdb
#SH_PARENT_DIR=$(dirname ${SH_CURRENT_DIR})         # 脚本所在父级目录，如 /var/jenkins_home/workspace/demo
#SH_DIR_BASENAME=$(basename ${SH_CURRENT_DIR})      # 脚本所在目录名称，如 frontend-cmdb


#docker run --rm -v ${SH_CURRENT_DIR}:/code -w /code node npm install --registry https://registry.npm.taobao.org
#docker run --rm -v ${SH_CURRENT_DIR}:/code -w /code node npm audit fix --force --registry https://registry.npm.taobao.org
#docker run --rm -v ${SH_CURRENT_DIR}:/code -w /code node npm run build:prod --registry https://registry.npm.taobao.org

