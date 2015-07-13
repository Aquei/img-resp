(function(){
	"use strict";
	var doc = (document._currentScript || document.currentScript).ownerDocument
		, isSrcsetSupported = srcsetSupportCheck() 
		, Proto = Object.create(HTMLImageElement.prototype)
		, ImgResp;

	
	Proto.createdCallback = createdCallback;
	Proto.attributeChangedCallback = attributeChangedCallback;
	Proto.update = update;

	//arg1 String - URL, arg2 Number - maxWidth, arg3 Number - quality = 50
	//return String
	Proto.calcSrcset = calcSrcset;

	//arg1 String - URL
	//return String
	Proto.absUrl = absUrl;


	//登録

	try{
		ImgResp = document.registerElement('img-resp', {prototype: Proto, extends: 'img'});
	}catch(e){
		//すでに登録済み
		console.warn("<img-resp>は既に登録されています。");
		return;
	}


	function createdCallback(){
		var that = this;


		this.update();

		return this;
	}


	function attributeChangedCallback(attrName, oldVal, newVal){
		if((attrName === "data-src" || attrName === "max-width") && newVal){
			this.update(true);
		}
	}
			

	function srcsetSupportCheck(){
		var e = new window.Image;
		return "srcset"in e&&"sizes"in e&&"currentSrc"in e;
	}

	function absUrl(url){
		var a = document.createElement("a");
		a.href = url;
		
		return a.href;
	}

	function calcSrcset(url, maxWidth, q){
		var srcset = []
			, i
			, url
			, q = q || "mid"
			, query = encodeURIComponent(url);

		if(!url){
			return "";
		}

		for(i = maxWidth; i > 0; i -= 50){
			url = "https://www.srytk.com/a/image-proxy/img/" + q + "/" + i +"/image?";
			srcset.push(url + query + " " + i + "w");
		}


		return srcset.join(", ");
	}

	function update(isForceUpdate){
		var that = this
			, url = that.getAttribute("data-src")
			, srcset
			, maxWidth = that.getAttribute("max-width")
			, quality = that.getAttribute("q") || undefined;

		if(!url || !maxWidth){
			return that;
		}


		if(isForceUpdate || !that.getAttribute("srcset")){
			srcset = that.calcSrcset(that.absUrl(url), maxWidth, quality);
			that.setAttribute("srcset", srcset);
		}
		


		if(!isSrcsetSupported && (isForceUpdate || !that.getAttribute("src"))){
			//srcをセット
			that.setAttribute("src", "https://www.srytk.com/a/image-proxy/img/mid/" + maxWidth && maxWidth <= 500?maxWidth:"500" + "/image?" + encodeURIComponent(that.absUrl(url)));
		}


		return that;
	}





})();
