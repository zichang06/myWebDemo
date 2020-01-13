window.onload = function () {
    imgLocation("container", "box");
    var imgData = {"data": [{"src": "01.jpg"}, {"src": "02.jpg"}, {"src": "03.jpg"}, {"src": "04.jpg"}, {"src": "05.jpg"}, {"src": "06.jpg"}, {"src": "07.jpg"}, {"src": "08.jpg"}, {"src": "09.jpg"}]}
    window.onscroll = function () {
        if (checkFlag()) {
            var cparent = document.getElementById("container");
            for (var i = 0; i < imgData.data.length; i++) {
                var ccontent = document.createElement("div");
                ccontent.className = "box";
                cparent.appendChild(ccontent);
                var boximg = document.createElement("div");
                boximg.className = "box_img";
                ccontent.appendChild(boximg);
                var img = document.createElement("img");
                img.src = "img/" + imgData.data[i].src;
                boximg.appendChild(img);
            }
            imgLocation("container", "box");
        }
    }
}

// 下滑到最后一张图片出现的时候,返回true
function checkFlag() {
    var cparent = document.getElementById("container");
    var ccontent = getChildElement(cparent, "box");
    var lastContentHeight = ccontent[ccontent.length - 1].offsetTop;  // 距离顶部的高度
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    //console.log(scrollTop); // 随着页面向下滚动，控制台不断显示当前距顶端距离
    var pageHeight = document.documentElement.clientHeight || document.body.clientHeight;
    //console.log(lastContentHeight + ":"+scrollTop+":"+pageHeight)
    // pageHeight:当前页面高度
    // 当第一者值大于后二者值之和，即滚到最后一张图的顶端时，说明应继续加载图片了
    if (lastContentHeight < scrollTop + pageHeight) {
        return true;
    }
}

function imgLocation(parent, content) {
    // 将parent(container)下所有的content(box)全部取出
    var cparent = document.getElementById(parent);
    var ccontent = getChildElement(cparent, content);
    // console.log(ccontent)  // 显示所有class为box的div
    var imgWidth = ccontent[0].offsetWidth;  // 图片宽度
    var num = Math.floor(document.documentElement.clientWidth / imgWidth);
    // 如此宽的页面可以放多少张图片
    cparent.style.cssText = "width:" + imgWidth * num + "px;margin: 0 auto;";
    // 该项的css内容继续添加
    // 当前页面能放多少列图片，设置container宽度为列数乘以图片宽度。
    // 结果就是因为container宽度固定，伸缩网页页面图片不会自适应了

    // 保存第一行每个图片盒子的高度
    var boxHeightArr = [];
    for (var i = 0; i < ccontent.length; i++) {
        if (i < num) {
            boxHeightArr[i] = ccontent[i].offsetHeight;
        } else {
            var minHeight = Math.min.apply(null, boxHeightArr);
            var minHeightIndex = getMinHeightImgLocation(boxHeightArr, minHeight);

            ccontent[i].style.position = "absolute";
            ccontent[i].style.top = minHeight + "px";
            ccontent[i].style.left = ccontent[minHeightIndex].offsetLeft + "px";
            boxHeightArr[minHeightIndex] = boxHeightArr[minHeightIndex] + ccontent[i].offsetHeight;
        }
    }
}

function getMinHeightImgLocation(boxHeightArr, minHeight) {
    for (var i in boxHeightArr) {
        if (boxHeightArr[i] == minHeight) {
            return i;
        }
    }
}

function getChildElement(parent, content) {
    // 找出名为“container”子元素中所有名为‘box’的项
    var contentArr = [];
    var allContent = parent.getElementsByTagName("*")
    for (var i = 0; i < allContent.length; i++) {
        if (allContent[i].className == content) {
            contentArr.push(allContent[i]);
        }
    }
    return contentArr;
}

/*
    ****** 元素视图属性
    * offsetWidth 水平方向 width + 左右padding + 左右border-width
    * offsetHeight 垂直方向 height + 上下padding + 上下border-width
    *
    * offsetTop 获取当前元素到 定位父节点 的top方向的距离
    * offsetLeft 获取当前元素到 定位父节点 的left方向的距离
    *
    * clientWidth 水平方向 width + 左右padding
    * clientHeight 垂直方向 height + 上下padding
    *
    * scrollWidth 元素内容真实的宽度，内容不超出盒子高度时为盒子的clientWidth
    * scrollHeight 元素内容真实的高度，内容不超出盒子高度时为盒子的clientHeight
*/