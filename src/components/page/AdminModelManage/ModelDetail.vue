<template>
	<div>
		<div class="crumbs">
			<el-breadcrumb separator="/">
				<el-breadcrumb-item>
					<i class="el-icon-lx-calendar"></i> 模型
				</el-breadcrumb-item>
				<el-breadcrumb-item>训练模型</el-breadcrumb-item>
			</el-breadcrumb>
		</div>
		<div class="container">
			<!-- 模型信息部分 -->
			<el-card shadow="hover">

				<div slot="header" class="clearfix">
					<span>模型信息</span>
				</div>
				<el-table :data="tableModelData" border class="table" ref="multipleTable"
					header-cell-class-name="table-header">

					<el-table-column type="index" label="序号" width="55" align="center"></el-table-column>

					<el-table-column prop="model_id" label="模型ID" align="center"></el-table-column>

					<el-table-column prop="model_name" label="模型名称" align="center"></el-table-column>

					<el-table-column prop="dataset_id" label="数据集ID" align="center"></el-table-column>

					<el-table-column prop="dataset_name" label="数据集名称" align="center"></el-table-column>
					<el-table-column prop="start_date" label="开始时间" align="center"></el-table-column>

					<el-table-column prop="train_cost" label="训练时长" align="center"></el-table-column>

					<el-table-column prop="status" label="模型状态" align="center">
						<div slot-scope="scope" v-if="scope.row.train_status == '0'">
							<el-tag type="normal">训练中...</el-tag>
							
						</div>
						<div slot-scope="scope" v-else-if="scope.row.train_status == '1'">
							<el-tag type="success">训练完成</el-tag>
						</div>
						<div slot-scope="scope" v-else-if="scope.row.train_status == '2'">
							<el-tag type="danger">训练终止</el-tag>
						</div>
					</el-table-column>

				</el-table>

				<el-table :data="tableModelDetail" border class="table" ref="multipleTable"
					header-cell-class-name="table-header">

					<el-table-column prop="detail" label="模型介绍" align="center" style="width: 50%;"></el-table-column>

					<el-table-column prop="accuracy" label="准确率" align="center"></el-table-column>

				</el-table>
			</el-card>
			<el-row :gutter="24">
				<el-col :span="12">
					<el-card shadow="hover" style="height: 400px;">
						<schart ref="line" class="schart" canvasId="line" :options="options" style="height: 400px;">
						</schart>
					</el-card>
				</el-col>

				<el-col :span="12">
					<el-card shadow="hover" style="height:400px;">

						<h4>【模型训练状态】</h4><br>
						<p>训练开始时间：{{start_date}}</p>
						<p>训练时长：{{train_cost}}</p>

						<br>
						<p>训练进度：</p>
						<el-progress :percentage="process" color="#66CCFF"></el-progress>
						<br>

						<h4>【模型训练结果】</h4><br>
						<div class="leftBox12" style="width: 30%;float: left;margin-left: 3%;">
							<el-progress :width="128" :height="128" type="circle" :percentage="current_accuracy">
							</el-progress>
							<p align="center">准确率</p>
						</div>

						<div class="leftBox12" style="width: 30%;float: left;margin-left: 3%;">
							<el-progress :width="128" :height="128" type="circle" :percentage="gpu_core_usage">
							</el-progress>
							<p align="center">GPU使用率</p>
						</div>

						<div class="leftBox12" style="width: 30%;float: left;margin-left: 3%;">
							<el-progress :width="128" :height="128" type="circle" :percentage="gpu_memory_usage">
							</el-progress>
							<p align="center">GPU显存占用率</p>
						</div>

					</el-card>
				</el-col>

			</el-row>

		</div>
	</div>
</template>

<script>
	import Schart from 'vue-schart';
	import {adminGetModelDetailById} from '@/api/ModelManage.js'

	export default {
		name: 'trainClassify',
		data() {
			return {
				user_id: localStorage.getItem('ms_user_id'),//管理员ID
				model_id: localStorage.getItem('ms_model_id'),//模型ID
				gpu_core_usage: 0,//gpu使用率
				gpu_memory_usage: 0,//内存使用率
				current_accuracy: 0,//当前精度
				process: 0,//训练进度
				start_date: '',//训练开始时间
				train_cost: '',//训练结束时间
				train_infos: {},//训练信息
				options: {
					type: 'line',
					title: {
						text: '模型损失趋势图'
					},
					labels: [],

					datasets: [{
						label: 'Loss',
						data: []
					}],
				},//折线图
				tableModelData: [{
					'model_id': '',
					'name': '',
					'dataset_id': '',
					'dataset_name': '',
					'train_cost': '',
					'train_status': '',
					'start_date':''
				}],//模型信息
				tableModelDetail: [{
					'detail': '',
					'accuracy': '',
					'status': '',
					}], //模型详情
			}
		},
		mounted() {
			this.getData();
			//this.createSetInterval();
		},
		components: {
			Schart
		},
		destroyed: function(){
			this.stopSetInterval();
		},
		methods: {
			//查询模型详情
			getData() {
				let params = {
					admin_id: this.user_id,
					model_id: this.model_id,
				}
				adminGetModelDetailById(params).then(res =>{
					let {data} = res;
					// 数据信息部分
					this.tableModelData[0].model_id = data.model.model_id;
					this.tableModelData[0].model_name = data.model.name;
					this.tableModelData[0].dataset_id = data.model.dataset_id;
					this.tableModelData[0].dataset_name = data.model.dataset_name;
					this.tableModelData[0].start_date = data.model.start_date;
					this.tableModelData[0].train_cost = data.model.train_cost;
					this.tableModelData[0].train_status = data.model.train_status;

					// 详细信息部分
					this.tableModelDetail[0].detail = data.model.detail;
					this.tableModelDetail[0].accuracy = data.model.val_info.accuracy;
					//左侧
					let chartDatas = data.model.log_info;
					// 图标部分数据转换
					let datas = []
					let labels = []
					for (let i = chartDatas.length - 1; i >= 0; i--) {
						datas.push(chartDatas[i].loss.toFixed(2));
						labels.push(chartDatas[i].step);
					}
					this.options.datasets[0]['data'] = datas;
					this.options.labels = labels;
					//右侧
					this.start_date = data.model.start_date;
					this.train_cost = data.model.train_cost;
					this.process = (data.model.cur_step * 100 / data.model.total_step)*1;
					this.gpu_core_usage = ((data.model.gpu_core_usage * 100).toFixed(2))*1;
					this.gpu_memory_usage = ((data.model.gpu_memory_usage * 100).toFixed(2))*1;
					this.current_accuracy = ((data.model.val_info.accuracy * 100).toFixed(2))*1;
				}).catch(error =>{
					this.$message.error('模型查询失败!')
				})
			},
			// 开启轮询  如果存在则先销毁定时器后重新开启
			createSetInterval() {
				this.stopSetInterval()
				let _this = this
				this.timer = setInterval(() => {
                    _this.getData()
				}, 3000)
			},
		}
	}
</script>

<style scoped>
</style>
