const state = {
  datasetId: '', //项目集编号
  projectMission: null,//数据集类型
  labels: [],//标签数组
  detectImageList: [], //显示检测图片数组
  currentImage: null, //选中图片的信息
  currentImageIndex: 0,//选中图片的编号
  imageStretching: false,//用于判断图片是否由于太小而被放大
  isDeleteAndToggleShowByCanvas: false,
  imageAnnotateMemory: [], //图片标注信息
  imageAnnotateShower: [], // 图像注释展示数组
  toolType: 'toolDrag',//工具栏被选中类型
  currentRectangle: {},//选中矩形的信息
  imageIWidth: 0, //选中图片的高
  imageIHeight: 0, //选中图片的高
  rectangleMidPoint: {
    x: 0,
    y: 0
  }, //传递来矩形的中点
  createRectangle: true,//是创建矩形，显示编辑标签框位置用
};

const mutations = {
  setDatasetId(state, data) {
    state.datasetId = data;
  },
  setProjectMission(state, data) {
    state.projectMission = data;
  },
  setLabels(state, data) {
    state.labels = data;
  },
  setDetectImageList(state, data) {
    state.detectImageList = data;
  },
  setCurrentImage(state, image) {
    state.currentImage = image;
  },
  setCurrentImageIndex(state, index) {
    state.currentImageIndex = index;
  },

  setImageStretching(state, index) {
    state.imageStretching = index;
  },

  toggleShowAndDeleteBtnByCanvas(state, data) {
    state.isDeleteAndToggleShowByCanvas = data;
  },
  updateImageAnnotateMemory(state, data) {
    state.imageAnnotateMemory = data;
  },
  updateImageAnnotateShower(state, data) {
    state.imageAnnotateShower = data;
  },
  updateToolType(state, data) {
    state.toolType = data;
  },
  updateCurrentRectangle(state, data) {
    state.currentRectangle = data;
  },
  updateImageIWidth(state, data) {
    state.imageIWidth = data;
  },
  updateImageIHeight(state, data) {
    state.imageIHeight = data;
  },
  updateRectangleMidPoint(state, data) {
    state.rectangleMidPoint = data;
  },
  updateCreateRectangle(state, data) {
    state.createRectangle = data;
  },
}
const actions = {
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}