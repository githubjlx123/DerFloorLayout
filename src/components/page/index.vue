<template>
    <div class="index-panel">
        <div class="panel1" ref="panel1">
            <div class="panel1-head">
                <img src="../../assets/img/Index/code.png"/>
                <div class="panel1-title">DeepOnce</div>
                <div v-for="item in toolList" :key="item.id" class="panel1-tool-text" @click="handleTool(item.id)">{{item.title}}</div>
            </div>
            <div class="panel1-section">
                <div class="panel1-section-text1">零代码深度学习</div>
                <div class="panel1-section-text2">工业视觉现在只需要鼠标的轻轻点击</div>
                <div v-for="item in infoList" :key="item.id" class="panel1-section-text3">{{item.name}}</div>
                <div class="panel1-section-text4">从零基础到落地<br/>跨越专业的沟壑</div>
                <div class="panel1-section-btn" @click="handleUse">点击使用</div>
            </div>
        </div>
        <div class="panel2" ref="panel2">
            <div class="panel2-title">什么是DeepOnce?</div>
            <div class="panel2-section">
                <div class="panel2-section-info">
                    <p v-for="item in contentList" :key="item.id" class="info-text2">{{item.content}}</p>
                </div>
                <div class="panel2-section-image">
                    <img src="@assets/img/Index/index2.jpg" style="width: 100%"/>
                </div>
            </div>
        </div>
        <div class="panel3" ref="panel3">
            <div class="panel3-section">
                <div class="panel3-text1">工业视觉</div>
                <div class="panel3-text2">DeepOnce专注于工业视觉的检测，支持多个工业中不同行业的视觉任务！</div>
                <div class="panel3-display">
                    <div v-for="item in projectList" :key="item.id" class="display">
                        <img :src="item.path" class="display-image">
                        <div class="display-title">{{item.title}}</div>
                    </div>
                </div>
            </div>

        </div>
        <div class="panel4" ref="panel4">
            <div class="panel4-section">
                <div class="panel4-text1">如何使用？</div>
                <div class="panel4-text2">DeepOnce只需要准备好数据，即可根据自己的需求类型，选择对应的算法模型进行训练</div>
                <div class="panel4-line">
                    <div v-for="item in stepList" :key="item.id" class="line-node">
                        <div class="node-num">{{item.id}}</div>
                        <div class="node-content">
                            <div class="node-title">{{item.title}}</div>
                            <div class="sub-node-title" v-for="list in item.nodes" :key="list.sid">{{list.sid}}:{{list.title}}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="foot-panel"  ref="foot-panel">
            <div class="foot-panel-section">
                <div class="panel-content">
                    <div class="content1">
                        <p class="content-text1">关于我们</p>
                        <p class="content-text2">我们的使命</p>
                        <p class="content-text2">正在招聘！</p>
                    </div>
                    <div class="content1">
                        <p class="content-text1">合作方向</p>
                        <p class="content-text2">工业质检</p>
                        <p class="content-text2">平台使用</p>
                    </div>
                    <div class="content1">
                        <p class="content-text1">联系我们</p>
                        <p class="content-text2">152-9564-6429</p>
                        <p class="content-text2">zhouhan@iict.ac.cn</p>
                    </div>
                </div>
                <div class="panel-line"></div>
                <div class="panel-dep" @click="handleOpen">中科苏州智能计算技术研究院</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'index',
    data() {
        return {
            toolList: [
                { id: '01', title: '关于' },
                { id: '02', title: '使用流程' },
                { id: '03', title: '联系我们' }
            ],
            infoList: [
                { id: '01', name: '算力支持' },
                { id: '02', name: '算法储备' },
                { id: '03', name: '数据管理' },
                { id: '04', name: '项目部署' }
            ],
            contentList: [
                {
                    id: '01',
                    content: 'DeepOnce是一个在线的深度学习计算平台，提供足够的算力支持、算法储备，提供一个项目数据、项目模型的管理平台。让您的项目从数据的准备、数据的标注、算法模型的训练、项目模型的部署全部流水线般完成。'
                },
                { id: '02', content: 'DeepOnce不需要您有任何计算机专业知识，只需要鼠标的点击，不需要写一句代码就可以完成从数据到模型的跨越。' }
            ],
            projectList: [
                { id: '01', path: require('@assets/img/Index/projectImage1.png'), title: '纸张、布匹、木材等质检' },
                { id: '02', path: require('@assets/img/Index/projectImage2.png'), title: '玻璃、PCB、钢铁等缺陷检测' },
                { id: '03', path: require('@assets/img/Index/projectImage3.png'), title: '工业异常行为检测' }
            ],
            stepList: [
                {
                    id: '1',
                    title: '制造to数据',
                    nodes: [
                        { sid: 'Step1', title: '上传数据' },
                        { sid: 'Step2', title: '数据标注' }
                    ]
                },
                {
                    id: '2',
                    title: '数据to模型',
                    nodes: [
                        { sid: 'Step1', title: '根据需求选择AI模型' },
                        { sid: 'Step2', title: '一键点击训练' },
                        { sid: 'Step3', title: '训练情况的实时监控' }]
                },
                {
                    id: '3',
                    title: '模型to制造',
                    nodes: [
                        { sid: 'Step1', title: '完成AI模型的训练' },
                        { sid: 'Step2', title: '选择需要部署的平台' },
                        { sid: 'Step3', title: '点击下载部署到平台' }]
                }
            ]
        };
    },
    methods:{
        handleTool(id){
            switch (id) {
                case '01':{
                    this.$refs['panel2'].scrollIntoView({ behavior: "smooth" });
                    break
                }
                case '02':{
                    this.$refs['panel4'].scrollIntoView({ behavior: "smooth" });
                    break
                }
                case '03':{
                    this.$refs['foot-panel'].scrollIntoView({ behavior: "smooth" });
                    break
                }
                default: break
            }
        },
        handleUse(){
            this.$router.push('/login')
        },
        handleOpen(){
            window.open('http://iict.ac.cn/yjyjj')
        }
    }


};
</script>

<style scoped lang="less">
    .index-panel {
        width: 100%;
        height: 100%;
        color: #ffffff;
        font-family: lato, helvetica, 'PingFang SC', "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", sans-serif;
        overflow-y: auto;
    }

    .panel1 {
        background-repeat: no-repeat;
        background-size: cover;
        background-color: rgb(13, 55, 68);
        background-position: 50% 50%;
        background-image: url("../../assets/img/Index/index1.jpg");
        padding-bottom: 75px;

        .panel1-head {
            display: flex;
            align-items: center;
            padding: 20px;

            .panel1-title {
                flex: 1;
                font-size: 30px;
                font-weight: 700;
                margin: 0 20px;
            }

            .panel1-tool-text {
                margin-right: 20px;
                font-weight: bold;
                cursor: pointer;
                border-bottom: 1px solid transparent;
                transition: all .2s ease-in;
            }

            .panel1-tool-text:hover {
                border-bottom: 1px solid #fff;
            }
        }

        .panel1-section {
            box-sizing: border-box;
            width: 60%;
            margin: 0 auto;
            padding: 10px 12px;

            .panel1-section-text1 {
                line-height: 1.7;
                text-align: left;
                font-size: 48px;
                font-weight: 700;
                margin-bottom: 20px;
            }

            .panel1-section-text2 {
                text-align: left;
                font-size: 24px;
                font-weight: 700;
                line-height: 1.7;
                margin-bottom: 30px;
            }

            .panel1-section-text3 {
                font-size: 24px;
                font-style: italic;
                text-align: left;
                font-weight: 700;
                line-height: 1.7;
                padding: 5px;
            }

            .panel1-section-text4 {
                font-size: 20px;
                text-align: left;
                font-weight: 700;
                line-height: 1.7;
                margin: 30px 0px;
            }

            .panel1-section-btn {
                font-size: 20px;
                padding: 16px 28px;
                color: rgb(255, 255, 255);
                background: rgb(31, 88, 160);
                border: none;
                font-family: "poppins", 'PingFang SC', "Microsoft YaHei", "微软雅黑", STXihei, "华文细黑", sans-serif;
                display: inline-block;
                font-weight: 700;
                text-decoration: none;
                cursor: pointer;
                margin-top: 15px;
                border-radius: 5px;
            }
        }
    }

    .panel2 {
        color: #222;
        background-color: rgb(243, 242, 238);
        padding: 75px 0;

        .panel2-title {
            width: 60%;
            margin: 0 auto;
            font-size: 36px;
            line-height: 1.7;
            font-weight: 700;
            padding: 10px 12px 20px 12px;
        }

        .panel2-section {
            width: 60%;
            margin: 0 auto;
            display: flex;

            .panel2-section-info {
                flex: 1;

                .info-text2 {
                    text-align: left;
                    font-size: 19px;
                    line-height: 1.7;
                    margin-bottom: 30px;
                }
            }

            .panel2-section-image {
                flex: 1;
                box-sizing: border-box;
                padding: 10px 12px;
            }
        }
    }

    .panel3 {
        background-color: rgb(13, 55, 68);
        padding: 75px 0;

        .panel3-section {
            width: 60%;
            margin: 0 auto;
            padding: 10px 12px;

            .panel3-text1 {
                font-size: 36px;
                font-weight: 700;
                line-height: 1.45;
                margin-bottom: 10px;
            }

            .panel3-text2 {
                color: #ececec;
                text-align: left;
                font-size: 20px;
                line-height: 1.45;
                margin-bottom: 30px;
            }

            .panel3-display {
                display: flex;
                justify-content: space-between;

                .display {
                    flex: 1;
                    margin-right: 24px;
                }

                .display-image {
                    width: 100%;
                }

                .display-title {
                    display: flex;
                    justify-content: center;
                    padding: 10px 12px;
                    font-size: 24px;
                    font-weight: 700;
                    line-height: 1.45;
                }
            }
        }
    }

    .panel4 {
        color: #222;
        background-color: rgb(243, 242, 238);
        padding: 75px 0;

        .panel4-section {
            width: 60%;
            margin: 0 auto;

            .panel4-text1 {
                font-size: 36px;
                line-height: 1.45;
                font-weight: 700;
                margin-bottom: 10px;
                text-align: center;
            }

            .panel4-text2 {
                font-size: 18px;
                text-align: center;
                margin-bottom: 30px;
            }

            .panel4-line {
                width: 50%;
                margin: 0 auto;

                .line-node {
                    display: flex;
                    margin-bottom: 100px;

                    .node-num {
                        display: inline-flex;
                        border: 1px solid;
                        width: 52px;
                        height: 52px;
                        justify-content: center;
                        align-items: center;
                        margin-bottom: 12px;
                        font-size: 26px;
                        font-weight: 700;
                        margin-right: 20px;
                        position: relative;
                    }

                    .node-num:not(:last-child)::after {
                        height: 150px;
                        border-right: 1px solid #222;
                        content: "";
                        position: absolute;
                        top: 70px;
                    }

                    .node-content {
                        .node-title {
                            font-size: 18px;
                            font-weight: 700;
                            line-height: 1.45;
                            margin-bottom: 40px;
                        }

                        .sub-node-title {
                            font-size: 16px;
                            font-weight: 700;
                            line-height: 1.45;
                            margin-bottom: 40px;
                        }

                        .sub-node-title:last-child {
                            margin-bottom: 0;
                        }
                    }
                }

                .line-node:last-child {
                    margin-bottom: 0;
                }
            }
        }
    }


    .foot-panel {
        /*   background-color: rgb(167, 186, 193);*/
        padding: 75px 0;

        .foot-panel-section {
            width: 40%;
            margin: 0 auto;
            color: rgb(80, 85, 92);

            .panel-content {
                position: relative;
                display: flex;
                align-items: center;
                margin-bottom:30px;

                .content1 {
                    flex: 1;
                    text-align: left;

                }
                .content-text1{
                    font-size: 17px;
                    line-height: 1.45;
                    font-weight: 700;
                }
                .content-text1{
                    font-size: 17px;
                    line-height: 1.45;
                }
            }
            .panel-line{
                border-bottom: 1px solid rgba(0,0,0,.15);
                margin-bottom: 15px;
            }
            .panel-dep{
                font-size: 16px;
                line-height: 1.7;
                cursor: pointer;
            }
        }
    }
</style>