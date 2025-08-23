async function saveFile(file) {
  return new Promise((resolve, reject) => {
    const dbName = "MediaStoreDB";
    const storeName = "media";
    const fixedFileId = "singleImage";

    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const transaction = db.transaction([storeName], "readwrite");
      const store = transaction.objectStore(storeName);

      const putRequest = store.put({
        id: fixedFileId,
        name: file.name,
        type: file.type,
        data: file,
      });

      putRequest.onsuccess = () => {
        notice("修改背景图片成功。");
        resolve(fixedFileId); 
      };

      putRequest.onerror = (err) => {
        notice("修改背景图片失败。");
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

async function getFile() {
  return new Promise((resolve, reject) => {
    const dbName = "MediaStoreDB";
    const storeName = "media";
    const fixedFileId = "singleImage";

    const request = indexedDB.open(dbName, 1);

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
        notice("文件获取失败。");
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

    notice("背景图片已成功加载并应用。");
    localStorage.setItem("backgroundImageSwitch", "true");
  }
}
