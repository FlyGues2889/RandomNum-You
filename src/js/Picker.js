/**
 * 随机数抽取器类
 * 实现随机数抽取的核心逻辑（纯手动控制）
 */
export default class Picker {
  constructor() {
    // 初始化属性
    this.minNum = 1;              // 最小值
    this.maxNum = 100;            // 最大值
    this.animationInterval = 100; // 动画间隔时间(ms)
    this.isRepeat = false;        // 是否重复抽取
    this.exNumArr = [];           // 排除数字数组

    this.dataArr = [];            // 数据数组
    this.pickArr = [];            // 可抽取数组
    this.result = null;           // 当前抽取结果
    this.isPicking = false;       // 是否正在抽取
    this.animationTimer = null;   // 动画定时器
    this.totalHistory = [];       // 总历史记录

    // 初始化数据数组
    this.initData();
  }

  /**
   * 初始化数据数组
   */
  initData() {
    // 边界值检查
    if (this.minNum > this.maxNum) {
      console.warn('最小值不能大于最大值，已自动交换');
      [this.minNum, this.maxNum] = [this.maxNum, this.minNum];
    }

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
    if (typeof params !== 'object' || params === null) return;

    const { minNum, maxNum, animationInterval, isRepeat, exNumArr } = params;

    // 更新参数（添加类型检查）
    if (typeof minNum === 'number') this.minNum = minNum;
    if (typeof maxNum === 'number') this.maxNum = maxNum;
    if (typeof animationInterval === 'number' && animationInterval > 0) {
      this.animationInterval = animationInterval;
    }
    if (typeof isRepeat === 'boolean') this.isRepeat = isRepeat;
    if (Array.isArray(exNumArr)) this.exNumArr = exNumArr.filter(num => typeof num === 'number');

    // 重新初始化数据
    this.initData();
  }

  /**
   * 开始抽取（仅动画，无自动停止）
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
    this.result = null;

    // 仅启动动画，移除自动停止定时器
    this.startAnimation(callback);
  }

  /**
   * 开始动画效果
   * @param {Function} callback 回调函数
   */
  startAnimation(callback) {
    // 先清除已有定时器
    this.stopAnimation();

    // 设置动画定时器，以固定间隔更新显示的数字
    this.animationTimer = setInterval(() => {
      try {
        if (this.pickArr.length === 0) {
          this.stopAnimation();
          callback && callback(null);
          return;
        }
        // 随机抽取一个数字作为动画效果
        const randomIndex = Math.floor(Math.random() * this.pickArr.length);
        const animationResult = this.pickArr[randomIndex];

        // 回调当前动画数字
        callback && callback(animationResult);
      } catch (error) {
        console.error('Error in animation:', error);
        this.stopAnimation();
      }
    }, this.animationInterval);
  }

  /**
   * 停止动画效果（仅清除定时器，无其他逻辑）
   */
  stopAnimation() {
    if (this.animationTimer) {
      clearInterval(this.animationTimer);
      this.animationTimer = null;
    }
  }

  /**
   * 停止抽取（手动调用才会终止）
   * @param {Function} callback 回调函数，接收最终抽取结果
   */
  stopPick(callback) {
    if (!this.isPicking) return;

    console.log('Stopping pick process');
    this.isPicking = false;

    // 停止动画
    this.stopAnimation();

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
    callback && callback(this.result);
  }

  /**
   * 单次抽取（无动画，直接返回结果）
   * @param {Function} callback 回调函数
   */
  pickOnce(callback) {
    console.log('pickOnce called, available numbers:', this.pickArr.length);

    // 检查是否有可抽取的数字
    if (this.pickArr.length === 0) {
      console.warn('No numbers to pick from');
      callback && callback(null);
      return;
    }

    try {
      // 随机抽取一个数字
      const randomIndex = Math.floor(Math.random() * this.pickArr.length);
      this.result = this.pickArr[randomIndex];
      console.log('Picked number:', this.result, 'from index:', randomIndex);

      // 保存到历史记录
      this.saveToHistory();

      // 从可抽取数组中移除当前结果（如果不允许重复）
      if (!this.isRepeat) {
        const index = this.pickArr.indexOf(this.result);
        if (index > -1) {
          this.pickArr.splice(index, 1);
        }
      }

      // 回调结果
      callback && callback(this.result);
    } catch (error) {
      console.error('Error in pickOnce:', error);
      callback && callback(null);
    }
  }

  /**
   * 保存到历史记录
   */
  saveToHistory() {
    if (this.result !== null) {
      const record = {
        number: this.result,
        timestamp: new Date().toLocaleString(),
        timestampMs: Date.now() // 添加时间戳（毫秒）便于排序
      };
      this.totalHistory.push(record);
    }
  }

  /**
   * 获取历史记录
   * @param {Boolean} sorted 是否按时间排序（默认true）
   * @returns {Array} 历史记录数组
   */
  getHistory(sorted = true) {
    if (sorted) {
      return [...this.totalHistory].sort((a, b) => a.timestampMs - b.timestampMs);
    }
    return [...this.totalHistory]; // 返回副本，防止外部修改
  }

  /**
   * 清除历史记录
   */
  clearHistory() {
    this.totalHistory = [];
  }

  /**
   * 添加排除数字
   * @param {Number|Array} num 要排除的数字或数字数组
   */
  addExcludeNum(num) {
    if (Array.isArray(num)) {
      num.forEach(n => {
        if (typeof n === 'number' && !this.exNumArr.includes(n)) {
          this.exNumArr.push(n);
        }
      });
    } else if (typeof num === 'number' && !this.exNumArr.includes(num)) {
      this.exNumArr.push(num);
    }
    this.updatePickArr();
  }

  /**
   * 移除排除数字
   * @param {Number|Array} num 要移除的排除数字或数字数组
   */
  removeExcludeNum(num) {
    if (Array.isArray(num)) {
      num.forEach(n => {
        const index = this.exNumArr.indexOf(n);
        if (index > -1) {
          this.exNumArr.splice(index, 1);
        }
      });
    } else if (typeof num === 'number') {
      const index = this.exNumArr.indexOf(num);
      if (index > -1) {
        this.exNumArr.splice(index, 1);
      }
    }
    this.updatePickArr();
  }

  /**
   * 清除排除数字
   */
  clearExcludeNums() {
    this.exNumArr = [];
    this.updatePickArr();
  }

  /**
   * 重置抽取器
   */
  reset() {
    this.stopAnimation();
    this.isPicking = false;
    this.result = null;
    this.initData();
  }

  /**
   * 获取可抽取数字数量
   * @returns {Number} 数量
   */
  getAvailableCount() {
    return this.pickArr.length;
  }
}