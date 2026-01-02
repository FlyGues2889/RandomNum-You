/**
 * 保存背景图片到IndexedDB
 * @param {File | Blob} file 要保存的图片文件
 * @returns {Promise<string>} 返回保存的ID
 */
export async function saveBackgroundImage(file) {
  return new Promise((resolve, reject) => {
    const dbName = "RandomNumYouDB";
    const storeName = "background";
    const fixedFileId = "backgroundImage";

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
        console.log("Background image saved successfully");
        resolve(fixedFileId);
      };

      putRequest.onerror = (err) => {
        console.error("Failed to save background image:", err);
        reject(err);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };

    request.onerror = (err) => {
      console.error("Failed to open database:", err);
      reject(err);
    };
  });
}

/**
 * 从IndexedDB获取背景图片
 * @returns {Promise<Blob | null>} 返回图片Blob对象，如果没有则返回null
 */
export async function getBackgroundImage() {
  return new Promise((resolve, reject) => {
    const dbName = "RandomNumYouDB";
    const storeName = "background";
    const fixedFileId = "backgroundImage";

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
          console.log("Background image loaded successfully");
          resolve(getRequest.result.data);
        } else {
          console.log("No background image found");
          resolve(null);
        }
      };

      getRequest.onerror = (err) => {
        console.error("Failed to get background image:", err);
        reject(err);
      };

      transaction.oncomplete = () => {
        db.close();
      };
    };

    request.onerror = (err) => {
      console.error("Failed to open database:", err);
      reject(err);
    };
  });
}

/**
 * 加载并应用背景图片
 */
export async function applyBackgroundImage() {
  const fileBlob = await getBackgroundImage();
  const backgroundEnabled = localStorage.getItem("backgroundImageSwitch") === "true";

  if (fileBlob && backgroundEnabled) {
    const url = URL.createObjectURL(fileBlob);
    const mainPage = document.body;
    
    mainPage.style.backgroundImage = `url('${url}')`;
    mainPage.style.backgroundSize = "cover";
    mainPage.style.backgroundAttachment = "fixed";
    mainPage.style.backgroundPosition = "center";
    
    console.log("Background image applied successfully");
  }
}

/**
 * 清除背景图片
 */
export function clearBackgroundImage() {
  document.body.style.backgroundImage = "";
  localStorage.setItem("backgroundImageSwitch", "false");
}