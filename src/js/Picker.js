/**
 * 随机数抽取器类
 * 实现随机数抽取的核心逻辑
 */
export default class Picker {
  constructor() {
    // 初始化属性
    this.minNum = 1;              // 最小值
    this.maxNum = 100;            // 最大值
    this.animationInterval = 100; // 动画间隔时间(ms)
    this.pickTime = 2000;         // 抽取总时间(ms)
    this.isManned = false;        // 是否手动控制
    this.isRepeat = false;        // 是否重复抽取
    this.exNumArr = [];           // 排除数字数组

    this.dataArr = [];            // 数据数组
    this.pickArr = [];            // 可抽取数组
    this.result = null;           // 当前抽取结果
    this.isPicking = false;       // 是否正在抽取
    this.pickInterval = null;     // 抽取定时器
    this.totalHistory = [];       // 总历史记录

    // 初始化数据数组
    this.initData();
  }

  /**
   * 初始化数据数组
   */
  initData() {
    this.dataArr = [];
    for (let i = this.minNum; i <= this.maxNum; i++) {
      this.dataArr.push(i);
    }
    this.updatePickArr();
  }

  /**
   * 更新可抽取数组
   */
  updatePickArr() {
    // 从数据数组中过滤掉排除数字
    this.pickArr = this.dataArr.filter(num => !this.exNumArr.includes(num));
  }

  /**
   * 设置参数
   * @param {Object} params 参数对象
   */
  setParams(params) {
    const { minNum, maxNum, pickTime, isManned, isRepeat, exNumArr } = params;

    // 更新参数
    if (minNum !== undefined) this.minNum = minNum;
    if (maxNum !== undefined) this.maxNum = maxNum;
    if (pickTime !== undefined) this.pickTime = pickTime;
    if (isManned !== undefined) this.isManned = isManned;
    if (isRepeat !== undefined) this.isRepeat = isRepeat;
    if (exNumArr !== undefined) this.exNumArr = exNumArr;

    // 重新初始化数据
    this.initData();
  }

  /**
   * 开始抽取
   * @param {Function} callback 回调函数，接收当前抽取的数字
   */
  startPick(callback) {
    if (this.isPicking) return;

    // 检查是否有可抽取的数字
    if (this.pickArr.length === 0) {
      callback && callback(null);
      return;
    }

    this.isPicking = true;
    this.animationTimer = null;
    this.finalTimer = null;

    console.log('Starting pick process, mode:', this.isManned ? 'manual' : 'auto');

    // 开始动画效果（数字持续变化）
    this.startAnimation(callback);

    // 如果是自动模式，设置定时器在指定时间后停止并输出最终结果
    if (!this.isManned) {
      console.log(`Auto mode: Will stop after ${this.pickTime}ms`);
      this.finalTimer = setTimeout(() => {
        this.stopPick(callback);
      }, this.pickTime);
    }
  }

  /**
   * 开始动画效果
   * @param {Function} callback 回调函数
   */
  startAnimation(callback) {
    // 设置动画定时器，以固定间隔（100ms）更新显示的数字
    this.animationTimer = setInterval(() => {
      try {
        // 随机抽取一个数字作为动画效果
        const randomIndex = Math.floor(Math.random() * this.pickArr.length);
        const animationResult = this.pickArr[randomIndex];

        // 回调当前动画数字
        if (callback) {
          callback(animationResult);
        }
      } catch (error) {
        console.error('Error in animation:', error);
        this.stopAnimation();
      }
    }, this.animationInterval);
  }

  /**
   * 停止动画效果
   */
  stopAnimation() {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }

    if (this.finalTimer) {
      clearTimeout(this.finalTimer);
      this.finalTimer = null;
    }
  }

  /**
   * 停止抽取
   * @param {Function} callback 回调函数，接收最终抽取结果
   */
  stopPick(callback) {
    if (!this.isPicking) return;

    console.log('Stopping pick process');
    this.isPicking = false;

    // 停止动画
    this.stopAnimation();

    // 清除定时器
    if (this.pickInterval) {
      clearInterval(this.pickInterval);
      this.pickInterval = null;
    }

    // 生成最终结果
    if (this.pickArr.length > 0) {
      const randomIndex = Math.floor(Math.random() * this.pickArr.length);
      this.result = this.pickArr[randomIndex];
      console.log('Final result:', this.result);
    } else {
      this.result = null;
      console.log('No numbers available for final result');
    }

    // 保存到历史记录
    this.saveToHistory();

    // 从可抽取数组中移除当前结果（如果不允许重复）
    if (!this.isRepeat && this.result !== null) {
      const index = this.pickArr.indexOf(this.result);
      if (index > -1) {
        this.pickArr.splice(index, 1);
      }
    }

    // 回调最终结果
    if (callback) {
      callback(this.result);
    }
  }

  /**
   * 单次抽取
   * @param {Function} callback 回调函数
   */
  pickOnce(callback) {
    console.log('pickOnce called, available numbers:', this.pickArr.length);

    // 检查是否有可抽取的数字
    if (!this.pickArr || this.pickArr.length === 0) {
      console.warn('No numbers to pick from');
      if (callback) {
        callback(null);
      }
      this.stopPick(callback);
      return;
    }

    try {
      // 随机抽取一个数字
      const randomIndex = Math.floor(Math.random() * this.pickArr.length);
      this.result = this.pickArr[randomIndex];
      console.log('Picked number:', this.result, 'from index:', randomIndex);

      // 回调当前结果
      if (callback) {
        callback(this.result);
      }
    } catch (error) {
      console.error('Error in pickOnce:', error);
      if (callback) {
        callback(null);
      }
    }
  }

  /**
   * 保存到历史记录
   */
  saveToHistory() {
    if (this.result !== null) {
      const record = {
        number: this.result,
        timestamp: new Date().toLocaleString()
      };
      this.totalHistory.push(record);
    }
  }

  /**
   * 获取历史记录
   * @returns {Array} 历史记录数组
   */
  getHistory() {
    return this.totalHistory;
  }

  /**
   * 清除历史记录
   */
  clearHistory() {
    this.totalHistory = [];
  }

  /**
   * 添加排除数字
   * @param {Number} num 要排除的数字
   */
  addExcludeNum(num) {
    if (!this.exNumArr.includes(num)) {
      this.exNumArr.push(num);
      this.updatePickArr();
    }
  }

  /**
   * 移除排除数字
   * @param {Number} num 要移除的排除数字
   */
  removeExcludeNum(num) {
    const index = this.exNumArr.indexOf(num);
    if (index > -1) {
      this.exNumArr.splice(index, 1);
      this.updatePickArr();
    }
  }

  /**
   * 清除排除数字
   */
  clearExcludeNums() {
    this.exNumArr = [];
    this.updatePickArr();
  }
}