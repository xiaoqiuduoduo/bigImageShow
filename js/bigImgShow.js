
var Slider = null;
(function(){
			Slider = function(){	
				var container = $(".slider-container"),		//容器
					panels = $(".panel"),					//元素集合
					current = panels.first(),				//目标元素
					related = current.next().first(),		//之前的目标元素
					leftBtn = $(".scrollBtn-left"),			//左按钮
					rightBtn = $(".scrollBtn-right"),		//右按钮
					imgWrapClass = "picWrap",				//图片外层的元素
					tabActiveClass = "pic-tab-active",		//当前圆点的类名
					tabClass = "pic-tab",					//圆点类名
					tabs = $(".pic-tabs"),					//圆点容器
					tabWidth = 437,							//圆点容器宽度
					title = $(".pic-title"),				//图片描述区域
					top = 188,								//小图距离顶部的top值
					length = panels.length,					//元素个数
					baseWidth = 875,						//容器宽度，也就是每次滚动的距离长度
					currentWidth = 875,						//焦点元素的宽度
					currentHeight = 575,					//焦点元素的高度
					relatedWidth = 500,						//小图宽度
					relatedHeight = 330,					//小图高度
					dir,									//方向
					changeSpeed = 700,						//元素大小以及位置的变化速度
					scrollSpeed = 500,						//滚动速度
					timeout = null;							//延时

				//单纯改变元素大小和位置，没有变化的过程
				function changeSize(obj){
					obj.targetO.find("." + imgWrapClass).css({width: obj.w, height: obj.h, marginTop: obj.mTop});
					obj.targetO.find("img").css({width: obj.w});
				}
				//改变元素大小和位置，并有显示变化过程
				function changeScrollSize(obj){
					obj.targetO.find("." + imgWrapClass).animate({width: obj.w, height: obj.h, marginTop: obj.mTop}, changeSpeed);
					obj.targetO.find("img").animate({width: obj.w}, changeSpeed);
				}
				//切换图片时将目标图片的描述显示在相应位置
				function changeTitle(cur,index){
					var text = cur.attr("title");
						title.html("<ins>" + (index + 1) + "</ins>/" + length + text);
						$("."+tabClass).removeClass(tabActiveClass).eq(index).addClass(tabActiveClass);
				}
				//设置左右切换按钮的显示和隐藏，当目标元素为第一张时，左按钮隐藏；为最后一张时右按钮隐藏；否则都显示
				function setBtnShow(index){
					if(index == 0){
						leftBtn.hide();
						rightBtn.show();
					}else if(index == length-1){
						rightBtn.hide();
						leftBtn.show();
					}else{
						leftBtn.show();
						rightBtn.show();
					}
				}
				//开始滚动元素，每次滚动一个元素，设置timeout防止重复点击
				function startScroll(cur, dir){
					clearTimeout(timeout);
					timeout = setTimeout(function(){
						var index = cur.index();
						related = current;
						current = cur;
						container.animate({marginLeft: dir + "=" + baseWidth + "px"}, scrollSpeed);
						changeScrollSize({
							targetO: current,
							w: currentWidth,
							h: currentHeight,
							mTop: 0
						});
						changeScrollSize({
							targetO: related,
							w: relatedWidth,
							h: relatedHeight,
							mTop: top
						});
						changeTitle(current,index);
						setBtnShow(index);
					}, 200);
				}
				//设置目标元素，直接切换，没有过程，同时设置前一张图片和后一张图片的src
				function setCur(cur){
					var index = cur.index();
					related = current;
					current = cur;
					setImg(cur);
					container.css("margin-left", "-" + (index * baseWidth) + "px");
					changeSize({
						targetO: current,
						w: currentWidth,
						h: currentHeight,
						mTop: 0
					});
					if(cur != current){
						changeSize({
							targetO: related,
							w: relatedWidth,
							h: relatedHeight,
							mTop: top
						});
					}
					changeTitle(current,index);
					setBtnShow(index);
					setImg(cur.next().first());
					setImg(cur.prev().last());
				}
				//创建用于切换的小圆点
				function createTabs(){
					var tabList = "";
					for (var i=0; i<length + 2; i++){
						if(i==0){
							tabList = "<i class='pic-tab-intro'>外观</i>";
						}else if(i==1){
							tabList += "<i class='pic-tab pic-tab-active' index='"+i+"'>.</i>";
						}else if(i==12){
							tabList += "<i class='pic-tab-intro'>内饰</i>"
						}else if(i>12){
							tabList += "<i class='pic-tab' index='"+(i-1)+"'>.</i>";
						}else{
							tabList += "<i class='pic-tab' index='"+i+"'>.</i>";
						}
					}
					tabs.append(tabList);
				}
				//出于性能考虑，没有直接将图片加载出来，而是暂存在li标签的imgSrc属性中，切换时再去设置图片src的值（如果没有的话）
				function setImg(cur){
					var src = cur.attr("imgSrc"),
						img = cur.find("img");
					if(!img.attr("src")){
						img.attr("src", src);
					}
				}
				//左按钮点击滚动，同时设置前一张图片的src
				leftBtn.click(function(){
					var cur = panels.eq(current.index() - 1);
					startScroll(cur, "+");
					setImg(cur.prev().last());
				});
				//右按钮点击滚动，同时设置下一张图片的src
				rightBtn.click(function(){
					var cur = panels.eq(current.index() + 1);
					startScroll(cur, "-");
					setImg(cur.next().first());
				})
				//小圆点切换
				tabs.click(function(event){
					var target = $(event.target);
					if(target.attr("class") == tabClass){
						setCur(panels.eq(parseInt(target.attr("index")) - 1));
					}
				})
				//关闭按钮
				$(".slider-close").mouseenter(function(){
					$(this).addClass("close-hover");
				}).mouseleave(function(){
					$(this).removeClass("close-hover");
				}).click(function(){
					$(this).parent().hide();
				})
				return {
					//初始化，可以对一些值进行自定义，如果没有则采用默认值
					"init":function(args){
						container = args.container || container;
						panels = args.panels || panels;
						length = args.length || length;
						leftBtn = args.leftBtn || leftBtn;
						rightBtn = args.rightBtn || rightBtn;
						baseWidth = args.baseWidth || baseWidth;
						currentWidth = args.currentWidth || currentWidth;
						currentHeight = args.currentHeight || currentHeight;
						relatedWidth = args.relatedWidth || relatedWidth;
						relatedHeight = args.relatedHeight || relatedHeight;
						imgWrapClass = args.imgWrapClass || imgWrapClass;
						tabs = args.tabs || tabs;
						tabsWidth = args.tabWidth || tabWidth;
						title = args.title || title;
						top = args.marginTop || top;
						scrollSpeed = args.scrollSpeed || scrollSpeed;
						changeSpeed = args.changeSpeed || changeSpeed;
						container.width(length * baseWidth);
						tabs.width(tabsWidth);
						createTabs();
						changeTitle(current,0)
						setBtnShow(0);
					},
					//显示设置目标元素
					"setCurrent":function(index){

						setCur(panels.eq(index));
					}
				}
			}();
		})();