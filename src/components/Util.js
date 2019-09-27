class Util {
    get(url) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        resolve(xhr.responseText);
                    }else {
                        reject(xhr.status);
                    }
                }
            }
            xhr.open('GET', url, true); //true代表是异步请求
            xhr.send(null);
        })
    }
}

export default Util;