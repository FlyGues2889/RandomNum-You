/**
 * 保存一个文件（Blob 或 File 对象）到 IndexedDB。
 * 如果存在同名的 'singleImage' 记录，则会覆盖它，确保只存储一个文件。
 * @param {File | Blob} file 要保存的文件对象。
 * @returns {Promise<string>} resolve 时返回保存的 ID ('singleImage')，reject 时返回错误。
 */
async function saveFile(file) {
  return new Promise((resolve, reject) => {
    const dbName = "MediaStoreDB";
    const storeName = "media";
    const fixedFileId = "singleImage"; // 使用一个固定的 ID 来存储唯一的图片

    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        // keyPath 不需要 autoIncrement，因为我们使用固定的 ID
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);

      // 使用 put 方法来添加或更新数据。
      // 如果 'fixedFileId' 存在，它会更新现有条目；否则会添加新条目。
      const putRequest = store.put({
        id: fixedFileId, // 始终使用这个固定的 ID
        name: file.name,
        type: file.type,
        data: file, // 直接存储文件 Blob 对象
      });

      putRequest.onsuccess = () => {
        console.log("文件保存成功！旧文件已被替换（如果存在）。");
        resolve(fixedFileId); // 返回这个固定的 ID
      };

      putRequest.onerror = (err) => {
        console.error("文件保存失败:", err);
        reject(err);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };

    request.onerror = (err) => {
      console.error("数据库打开失败:", err);
      reject(err);
    };
  });
}

/**
 * 从 IndexedDB 获取唯一存储的文件。
 * @returns {Promise<Blob | null>} resolve 时返回文件的 Blob 对象，如果未找到则返回 null；reject 时返回错误。
 */
async function getFile() {
  return new Promise((resolve, reject) => {
    const dbName = "MediaStoreDB";
    const storeName = "media";
    const fixedFileId = "singleImage";

    const request = indexedDB.open(dbName, 1);

    // 新增 onupgradeneeded，确保 object store 存在
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], "readonly");
      const store = transaction.objectStore(storeName);

      const getRequest = store.get(fixedFileId);

      getRequest.onsuccess = () => {
        if (getRequest.result) {
          console.log("文件获取成功！");
          resolve(getRequest.result.data);
        } else {
          console.warn("未找到文件。");
          resolve(null);
        }
      };

      getRequest.onerror = (err) => {
        console.error("文件获取失败:", err);
        reject(err);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };

    request.onerror = (err) => {
      console.error("数据库打开失败:", err);
      reject(err);
    };
  });
}

async function loadBackgroundImage() {
  // 调用之前定义的 getFile 函数来获取图片数据
  const fileBlob = await getFile();

  if (fileBlob) {
    // 创建一个 Blob URL
    const url = URL.createObjectURL(fileBlob);
    // 获取 html 元素（更简洁的方式）
      const mainPage = document.body;
    mainPage.style.backgroundImage = `url('${url}')`;
    mainPage.style.backgroundSize = "cover";

    console.log("背景图片已成功加载并应用。");
    localStorage.setItem("backgroundImageSwitch", "true");
    // 注意：Blob URL 在不再需要时应该被释放，以避免内存泄漏。
    // 但对于持久的背景图片，通常不会立即释放，因为它需要持续显示。
    // 如果你的应用有背景图片切换或清除的逻辑，可以在那时调用 URL.revokeObjectURL(url);
  }
}
