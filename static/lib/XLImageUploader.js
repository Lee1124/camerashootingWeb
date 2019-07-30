"use strict";

function _instanceof(left, right) { if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) { return right[Symbol.hasInstance](left); } else { return left instanceof right; } }

function _classCallCheck(instance, Constructor) { if (!_instanceof(instance, Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var XLImageUploader =
  /*#__PURE__*/
  function () {
    /**
     * 构造方法
     * @param {Object} config
     */
    function XLImageUploader() {
      var config = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      _classCallCheck(this, XLImageUploader);

      this.bucket = config.bucket ? config.bucket : 'xlfile-1256392453';
      this.region = config.region ? config.region : 'ap-chengdu';
      this.protocol = location.protocol === 'https:' ? 'https:' : 'http:';
      this.cosPrefix = this.protocol + '//' + this.bucket + '.cos.' + this.region + '.myqcloud.com';
      this.returnval = config.returnval ? config.returnval : "http://localhost:5080/|1|1|xlhl|http://localhost:5819/|http://171.211.126.122:8092/|3,1|3,1|http://localhost:8088"; //请求头

      this.prefix = "/" + (config.prefix ? config.prefix : '');
      this.txsing = "";
    }
    /**
     * 获取文件后缀名
     * @param {String} filename
     */


    _createClass(XLImageUploader, [{
      key: "getSuffix",
      value: function getSuffix(filename) {
        return filename.substring(filename.lastIndexOf(".") + 1, filename.length);
      }
      /**
       * 生成唯一id
       */

    }, {
      key: "newGuid",
      value: function newGuid() {
        var guid = "";

        for (var i = 1; i <= 32; i++) {
          var n = Math.floor(Math.random() * 16.0).toString(16);
          guid += n;
          if (i == 8 || i == 12 || i == 16 || i == 20) guid += "-";
        }

        return guid;
      }
      /**
       * 获取签名
       * @param {*} key
       * @param {*} strModel
       */

    }, {
      key: "gettxkey",
      value: function gettxkey(key, strModel) {
        var _this = this;

        var txkey = '';
        var xhr = new XMLHttpRequest();

        xhr.onreadystatechange = function () {
          if (xhr.readyState == 4) {
            if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
              _this.txsing = eval(xhr.responseText);
              txkey = eval(xhr.responseText);
            }
          }
        };

        xhr.open('get', "https://xilai99.com/xlapi/Login/Login/User/gettxkey?strModel=" + strModel + "&pathname=" + key + "&qheaderlist=&qurlparamlist=&strtime=", false); //同步请求

        xhr.setRequestHeader('Authorization', this.returnval);
        xhr.send();
        return txkey;
      }
      /**
       * 上传文件
       * @param {*} file 文件
       * @param {*} key
       * @param {Boolean} loadingBar 是否显示正在上传加载bar
       */

    }, {
      key: "upFile",
      value: function upFile(_ref) {
        var _this2 = this;

        var file = _ref.file,
          key = _ref.key,
          _ref$loadingBar = _ref.loadingBar,
          loadingBar = _ref$loadingBar === void 0 ? true : _ref$loadingBar,
          _ref$callback = _ref.callback,
          callback = _ref$callback === void 0 ? function () { } : _ref$callback,
          _ref$onProgress = _ref.onProgress,
          onProgress = _ref$onProgress === void 0 ? function () { } : _ref$onProgress,
          _ref$onError = _ref.onError,
          onError = _ref$onError === void 0 ? function () { } : _ref$onError;
        var up = {}; // 如果key存在，则用key直接上传，不然就取新的

        up.guid = key ? undefined : this.newGuid();
        up.fileName = file.name;
        up.suffix = this.getSuffix(up.fileName);
        up.key = key ? key : this.prefix + '/' + up.guid + "." + up.suffix;
        up.url = this.cosPrefix + up.key;
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', up.url, true);
        xhr.setRequestHeader('Authorization', this.gettxkey(up.key, "PUT"));

        xhr.onload = function () {
          if (xhr.status === 200 || xhr.status === 206) {
            callback(up);
          } else {
            onError('错误码：' + xhr.status);
          }

          window.xl_uploader_current_count--;

          if (window.xl_uploader_current_count == 0) {
            _this2.hideLoadingBar();
          }
        };

        if (window.xl_uploader_current_count) {
          window.xl_uploader_current_count++;
        } else {
          window.xl_uploader_current_count = 1;
        }

        if (loadingBar) {
          this.showLoadingBar();
        }

        xhr.upload.onprogress = onProgress;

        xhr.onerror = function () {
          onError('请检查是否没配置 CORS 跨域规则');
        };

        xhr.send(file);
      }
      /**
       * 显示上传加载中
       */

    }, {
      key: "showLoadingBar",
      value: function showLoadingBar() {
        var bar = document.getElementById("xl_uploader_loading_bar");

        if (bar) {
          bar.style.display = "block";
        } else {
          bar = document.createElement("div");
          bar.style = "position: fixed; padding: 0 20px 20px;left: 50%; top: 50%; z-index: 9999;display:block;width:220px;height:91px;background:white;margin-left:-130px;margin-top:-45px;box-shadow: 0 0px 9px #80808070;";
          bar.innerHTML = "<img src=\"https://xilai99.com/image/loading.gif\"/>";
          bar.id = "xl_uploader_loading_bar";
          document.body.appendChild(bar);
        }
      }
      /**
       * 隐藏上传加载中
       */

    }, {
      key: "hideLoadingBar",
      value: function hideLoadingBar() {
        var bar = document.getElementById("xl_uploader_loading_bar");

        if (bar) {
          bar.style.display = "none";
        }
      }
      /**
       * 上传图片
       * @param {*} file
       * @param {*} ys 0:只传原图 1：只传压缩图 2：传原图和压缩图
       * @param {*} oWidth
       * @param {*} oHeight
       */

    }, {
      key: "upImg",
      value: function upImg(_ref2) {
        var _this3 = this;

        var file = _ref2.file,
          _ref2$ys = _ref2.ys,
          ys = _ref2$ys === void 0 ? 0 : _ref2$ys,
          _ref2$oWidth = _ref2.oWidth,
          oWidth = _ref2$oWidth === void 0 ? 800 : _ref2$oWidth,
          _ref2$oHeight = _ref2.oHeight,
          oHeight = _ref2$oHeight === void 0 ? 600 : _ref2$oHeight,
          loadingBar = _ref2.loadingBar,
          _ref2$callback = _ref2.callback,
          _callback = _ref2$callback === void 0 ? function () { } : _ref2$callback,
          _ref2$onProgress = _ref2.onProgress,
          onProgress = _ref2$onProgress === void 0 ? function () { } : _ref2$onProgress,
          _ref2$onError = _ref2.onError,
          _onError = _ref2$onError === void 0 ? function () { } : _ref2$onError;

        var fileName = file.name;
        var suffix = this.getSuffix(fileName);
        console.log("file", file.type);
        // if ("bmp,jpg,png,tiff,gif,jpeg,mp4,mov,m4v".indexOf(suffix.toLowerCase()) == -1 && !this.isVideo) {
        //   alert("选择的文件不是图片格式");
        //   return;
        // }

        if (ys == 1) {
          lrz(file, {
            width: oWidth,
            height: oHeight,
            quality: 0.95 //图片质量

          }).then(function (rst) {
            _this3.upFile({
              file: _this3.dataURLtoBlob(rst.base64, fileName),
              callback: function callback(data) {
                return _callback(data);
              },
              loadingBar: loadingBar,
              onProgress: onProgress,
              onError: function onError(msg) {
                _onError("文件：" + fileName + "上传失败 " + msg);
              }
            });
          });
        } else if (ys == 3) {
          lrz(file, {
            quality: 0.9 //图片质量

          }).then(function (rst) {
            _this3.upFile({
              file: _this3.dataURLtoBlob(rst.base64, fileName),
              key: _this3.prefix + '/' + _this3.newGuid() + '-ys.' + _this3.getSuffix(fileName),
              callback: function callback(data) {
                return _callback(data);
              },
              loadingBar: loadingBar,
              onProgress: onProgress,
              onError: function onError(msg) {
                _onError("文件：" + fileName + "上传失败 " + msg);
              }
            });
          });
        } else {
          this.upFile({
            file: file,
            callback: function callback(data) {
              if (ys == 2) {
                lrz(file, {
                  width: oWidth,
                  height: oHeight,
                  quality: 0.95 //图片质量

                }).then(function (rst) {
                  _this3.upFile({
                    file: _this3.dataURLtoBlob(rst.base64, fileName),
                    key: _this3.prefix + '/' + data.guid + "-ys." + data.suffix,
                    onProgress: onProgress,
                    loadingBar: loadingBar,
                    onError: function onError(msg) {
                      _onError("文件：" + fileName + "上传失败 " + msg);
                    },
                    callback: function callback(data1) {
                      return _callback(Object.assign(data, {
                        ysKey: data1.key,
                        ysUrl: data1.url,
                        ys: ys
                      }));
                    }
                  });
                });
              } else {
                _callback(data);
              }
            },
            loadingBar: loadingBar,
            onProgress: ys == 2 ? undefined : onProgress,
            //如果原图和缩略图都传，只取缩略图的进度
            onError: function onError(msg) {
              _onError("文件：" + fileName + "上传失败 " + msg);
            }
          });
        }
      }
      /**
       * 将base64字符串转换为二进制
       * @param {String} dataurl
       * @param {String} name 文件名
       */

    }, {
      key: "dataURLtoBlob",
      value: function dataURLtoBlob(dataurl, name) {
        var arr = dataurl.split(','),
          mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]),
          n = bstr.length,
          u8arr = new Uint8Array(n);

        while (n--) {
          u8arr[n] = bstr.charCodeAt(n);
        }

        var blob = new Blob([u8arr], {
          type: mime
        });
        blob.name = name;
        return blob;
      }
      /**
       * 按照key删除指定的文件
       * @param {String} key
       * @param {Function} callback
       */

    }, {
      key: "delObject",
      value: function delObject(_ref3) {
        var key = _ref3.key,
          url = _ref3.url,
          _ref3$callback = _ref3.callback,
          callback = _ref3$callback === void 0 ? function () { } : _ref3$callback;

        if (!key && !url) {
          throw new Error("key、url必须传一个");
        }

        key = key ? key.split("?")[0] : url.split("?")[0].split('com')[1];
        var reqUrl = this.cosPrefix + key;
        var xhr = new XMLHttpRequest();
        xhr.open('DELETE', reqUrl, true);
        xhr.setRequestHeader('Authorization', this.gettxkey(key, "DELETE"));

        xhr.onload = function () {
          if (xhr.status === 200 || xhr.status === 204) {
            callback(1001);
          } else {
            callback(1002);
          }
        };

        xhr.send();
      }
      /**
       * 选择文件弹出框 可指定是否多选,上传完后返回文件列表(upImg或upFile的返回)
       * type = file或者img, 当为img时，ys oWidth oHeight 才有效
       *
       */

    }, {
      key: "chooseFiles",
      value: function chooseFiles() {
        var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
          _ref4$type = _ref4.type,
          type = _ref4$type === void 0 ? 'file' : _ref4$type,
          ys = _ref4.ys,
          oWidth = _ref4.oWidth,
          oHeight = _ref4.oHeight,
          _ref4$multiple = _ref4.multiple,
          multiple = _ref4$multiple === void 0 ? true : _ref4$multiple,
          fileType = _ref4.fileType;

        if (!fileType) fileType = 'file';

        if (!Vue || !layer) {
          throw new Error('需要引入Vue和layer');
        }

        var uploader = this;
        return new Promise(function (resolve, reject) {
          var style = document.createElement('style');
          style.innerText = '.xlfuc-img-file-pane {width: 70%;margin: 12px auto;box-shadow: 0 0 4px #8080809e;padding: 12px;background: #F6F6F6;}.xlfuc-img-file-pane:hover {box-shadow: 0 0 8px #808080d8;transition: .3s;}.xlfuc-close-btn {float: right;cursor: pointer;}.xlfuc-close-btn:hover {color: orangered;}.xlfuc-progress-wrap {margin-top: 5px;background-color: lightgray;width: 100%;height: 8px;border-radius: 8px;}.xlfuc-progress-bar {width:0;height: 8px;border-radius: 8px;background-color: green;}.xlfuc-progress-btn {padding: 5px 10px}.xlfuc-file-name {width: 90%;overflow: hidden;display: inline-block;text-overflow: ellipsis;}';
          document.querySelector('body').appendChild(style);
          var index = layer.open({
            type: 1,
            title: "".concat(type == 'file' ? '文件' : '图片', "\u4E0A\u4F20(").concat(multiple ? '多选' : '单选', ")"),
            shadeClose: false,
            area: ["600px", "400px"],
            zIndex: 19999999,
            content: "\n                    <div id=\"xl_file_upload_chooser\">\n                        <div style=\"text-align: center;margin-top: 16px;\">\n                            <div style=\"text-align: center; margin: 20px;\">\n                                <span style=\"cursor: pointer;color: #BB9860; font-size: 15px;\" @click=\"$refs.imageInput.click()\">[\u9009\u62E9".concat(type == 'file' ? '文件' : '图片', "]</span>\n                            </div>\n                            <div v-for=\"file in files\" class=\"xlfuc-img-file-pane\">\n                                <div>\n                                    <span class=\"xlfuc-file-name\" :title=\"file.name\">{{file.name}}</span>\n                                    <span class=\"xlfuc-close-btn\" @click=\"files.remove(file)\">\u2716</span>\n                                </div>\n                                <div v-if=\"file.progress < 100\" class=\"xlfuc-progress-wrap\">\n                                    <div class=\"xlfuc-progress-bar\" :style=\"'width:' + file.progress + '%'\"></div>\n                                </div>\n                            </div>\n                            <div style=\"margin: 40px 0;\" v-if=\"files.length>0\">\n                                <button class=\"xlfuc-progress-btn\" style=\"margin-right: 20px\" @click=\"cancel\">\u53D6\u6D88</button>\n                                <button class=\"xlfuc-progress-btn\" @click=\"onOk\">\u786E\u5B9A</button>\n                            </div>\n                        </div>\n                        <input type=\"file\" ref=\"imageInput\" hidden @change=\"chooseFile\" ").concat(multiple ? 'multiple' : '', ">\n                    </div>\n                ")
          });
          new Vue({
            el: '#xl_file_upload_chooser',
            data: {
              files: [],
              completeCount: 0
            },
            methods: {
              chooseFile: function chooseFile() {
                var list = this.$refs.imageInput.files;

                if (list.length > 0) {
                  for (var i = 0; i < list.length; i++) {
                    if (!multiple) {
                      this.files = [];
                    }

                    this.files.push({
                      file: list[i],
                      name: list[i].name,
                      progress: 0
                    });
                  }
                } // 重置input


                this.$refs.imageInput.value = null;
              },
              onOk: function onOk() {
                var _this4 = this;

                this.files.forEach(function (f) {
                  if (type == 'file') {
                    if (fileType == "video") {
                      if (f.name.indexOf(".mp4") == -1) {
                        alert("选择的文件不是视频格式");
                        return;
                      }
                    }

                    uploader.upFile({
                      file: f.file,
                      callback: function callback(res) {
                        _this4.completeCount++;
                        Object.assign(f, res);

                        if (_this4.completeCount === _this4.files.length) {
                          layer.close(index);
                          resolve(_this4.files);
                        }
                      },
                      onProgress: function onProgress(e) {
                        return f.progress = Math.round(e.loaded / e.total * 100);
                      },
                      onError: function onError(msg) {
                        layer.close(index);
                        reject(msg);
                      }
                    });
                  } else {
                    uploader.upImg({
                      file: f.file,
                      ys: ys,
                      oWidth: oWidth,
                      oHeight: oHeight,
                      callback: function callback(res) {
                        _this4.completeCount++;
                        Object.assign(f, res);

                        if (_this4.completeCount === _this4.files.length) {
                          layer.close(index);
                          resolve(_this4.files);
                        }
                      },
                      onProgress: function onProgress(e) {
                        return f.progress = Math.round(e.loaded / e.total * 100);
                      },
                      onError: function onError(msg) {
                        layer.close(index);
                        reject(msg);
                      }
                    });
                  }
                });
              },
              cancel: function cancel() {
                layer.close(index);
              }
            }
          });
        });
      }
      /**
       * 复制腾讯云文件到新路径
       * @param {String} key
       * @param {Function} callback
       */

    }, {
      key: "CopyObject",
      value: function CopyObject(_ref5) {
        var path = _ref5.path,
          key = _ref5.key,
          url = _ref5.url,
          _ref5$callback = _ref5.callback,
          callback = _ref5$callback === void 0 ? function () { } : _ref5$callback;

        if (!key && !url) {
          throw new Error("key、url必须传一个");
        }

        var rkey = path.split('com')[1];
        var reqUrl = key ? key.split("?")[0] : url.split("?")[0].split('com')[1];
        var xhr = new XMLHttpRequest();
        xhr.open('PUT', path, true);
        xhr.setRequestHeader('Authorization', this.gettxkey(rkey, "PUT"));
        xhr.setRequestHeader('x-cos-copy-source', this.bucket + '.cos.' + this.region + '.myqcloud.com' + reqUrl); //源文件 URL 路径

        xhr.onload = function () {
          if (xhr.status === 200 || xhr.status === 204) {
            callback(1001);
          } else {
            callback(1002);
          }
        };

        xhr.send();
      }
      /**
       * 下载文件
       * @param {*} param0
       */

    }, {
      key: "download",
      value: function download(_ref6) {
        var key = _ref6.key,
          url = _ref6.url,
          fileName = _ref6.fileName,
          _ref6$callback = _ref6.callback,
          callback = _ref6$callback === void 0 ? function () { } : _ref6$callback,
          onProgress = _ref6.onProgress;

        if (!key && !url) {
          throw new Error('key或url必传');
        }

        if (key) {
          url = this.cosPrefix + key;
        } // 如果没有传onProgress, 就用默认的defaultDownloadProgress, 需要先打开弹出框


        if (onProgress) {
          _download(url, fileName, onProgress);
        } else {
          if (layer) {
            window.xl_download_progress_layer = layer.open({
              title: "<a style='font-size:15px;'>\u6B63\u5728\u4E0B\u8F7D</span></a>",
              type: 1,
              area: ['300px', '120px'],
              fixed: false,
              //不固定
              maxmin: false,
              zIndex: 1000,
              shade: .3,
              content: "\n                        <div style=\"height:100%;text-align:center;display:flex;padding: 0 20px;\">\n                            <div id=\"xl_download_progress\" style=\"background-color: lightgray;width: 100%;height: 8px;border-radius: 8px;margin: auto 0;\">\n                                <div id=\"xl_download_progressbar\" style=\"width:0;height: 8px;border-radius: 8px;background-color: green;\" ></div>\n                            </div>\n                            <div id=\"xl_download_progress_success\" style=\"display:none;margin:auto;\">\u4E0B\u8F7D\u5B8C\u6210</div>\n                        </div>\n                    "
            });
          } else {
            throw new Error('需要引入layer');
          }

          _download(url, fileName, this.defaultDownloadProgress);
        }
      }
    }, {
      key: "defaultDownloadProgress",
      value: function defaultDownloadProgress(e) {
        var bar = document.getElementById('xl_download_progressbar');

        if (bar) {
          bar.style.width = e.loaded / e.total * 100 + '%';

          if (e.loaded == e.total) {
            document.getElementById('xl_download_progress').style.display = 'none';
            document.getElementById('xl_download_progress_success').style.display = 'block'; // 1秒自动关闭

            setTimeout(function () {
              layer.close(window.xl_download_progress_layer);
            }, 1000);
          }
        }
      }
    }]);

    return XLImageUploader;
  }();

function getBlob(url, onProgress) {
  return new Promise(function (resolve) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'blob'; //监听进度事件

    xhr.addEventListener("progress", onProgress, false);

    xhr.onload = function () {
      if (xhr.status === 200) {
        resolve(xhr.response);
      }
    };

    xhr.send();
  });
}
/**
 * 保存
 * @param  {Blob} blob
 * @param  {String} filename 想要保存的文件名称
 */


function saveAs(blob, filename) {
  if (window.navigator.msSaveOrOpenBlob) {
    navigator.msSaveBlob(blob, filename);
  } else {
    var link = document.createElement('a');
    var body = document.querySelector('body');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename; // fix Firefox

    link.style.display = 'none';
    body.appendChild(link);
    link.click();
    body.removeChild(link);
    window.URL.revokeObjectURL(link.href);
  }
}
/**
 * 下载
 * @param  {String} url 目标文件地址
 * @param  {String} filename 想要保存的文件名称
 * @param  {Function} onProgress 进度事件
 */


function _download(url, filename, onProgress) {
  getBlob(url, onProgress).then(function (blob) {
    saveAs(blob, filename);
  });
}
