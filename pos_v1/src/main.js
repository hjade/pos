//TODO: Please write code in this file.
function printInventory(inputs) {
	
	var itemInfo;
	var uniqueInputs = new Array();
	var itemNum = new Array();
	var j=0;
	var indexOf_;
	var indexOfExistItem;
	var tempNum;
	var totalPrice=0;
	var savePrice=0;
	var finalStr;
	finalStr = '***<没钱赚商店>购物清单***\n';

	for(var i=0;i<inputs.length;i++) {
		indexOf_ = inputs[i].indexOf('-');
		if(indexOf_!=-1){
			uniqueInputs[j] = inputs[i].substr(0,indexOf_); 
			itemNum[j] = parseFloat(inputs[i].substr(indexOf_+1,inputs[i].length-indexOf_-1));
			j++;
			continue;
		}
		indexOfExistItem = isExisted(inputs[i],uniqueInputs);
		if(indexOfExistItem!=-1) {
			itemNum[indexOfExistItem]++;
			continue;				
		}
		uniqueInputs[j] = inputs[i];
		itemNum[j] = 1;
		j++;
	}
	
	for(var i=0;i<uniqueInputs.length;i++) {
		itemInfo = getItemInfo(uniqueInputs[i]);
		if(isPromoted(uniqueInputs[i])) {
			tempNum = itemNum[i]-parseInt(itemNum[i]/3);
			finalStr+='名称：'+itemInfo[0]+'，数量：'+itemNum[i]+itemInfo[1]+'，单价：'+itemInfo[2]+'(元)，小计：'+(itemInfo[2]*tempNum).toFixed(2)+'(元)\n';				
		}else{
			finalStr+='名称：'+itemInfo[0]+'，数量：'+itemNum[i]+itemInfo[1]+'，单价：'+itemInfo[2]+'(元)，小计：'+(itemInfo[2]*itemNum[i]).toFixed(2)+'(元)\n';
		}	
	}

	finalStr+='----------------------\n';

	finalStr+='挥泪赠送商品：\n';
	for(var i=0;i<uniqueInputs.length;i++) {
		itemInfo = getItemInfo(uniqueInputs[i]);
		if(isPromoted(uniqueInputs[i])) {
			tempNum = parseInt(itemNum[i]/3);
			finalStr+='名称：'+itemInfo[0]+'，数量：'+tempNum+itemInfo[1]+'\n';
		}	
	}
	
	finalStr+='----------------------\n';

	for(var i=0;i<uniqueInputs.length;i++) {
		itemInfo = getItemInfo(uniqueInputs[i]);
		if(isPromoted(uniqueInputs[i]))	{
			totalPrice += itemInfo[2]*(itemNum[i]-parseInt(itemNum[i]/3));
		}else{
			totalPrice += itemInfo[2]*itemNum[i];
		}
	}
	finalStr+='总计：'+totalPrice.toFixed(2)+'(元)\n';

	for(var i=0;i<uniqueInputs.length;i++) {
		itemInfo = getItemInfo(uniqueInputs[i]);
		if(isPromoted(uniqueInputs[i]))	{
			savePrice += itemInfo[2]*parseInt(itemNum[i]/3);
		}
	}
	finalStr+='节省：'+savePrice.toFixed(2)+'(元)\n';

	finalStr+='**********************';
	
	console.log(finalStr);
}

function getItemInfo(item) {
	var allItems = loadAllItems();
	var infos = new Array();
	for(var i=0;i<allItems.length;i++) {
		if(item==allItems[i].barcode){
			infos[0] = allItems[i].name;
			infos[1] = allItems[i].unit;
			infos[2] = allItems[i].price.toFixed(2);
			return infos;
		}	
	}
}

function isExisted(targetStr,allStr){
	for(var i=0;i<allStr.length;i++){
		if(targetStr==allStr[i]){
			return i;
		}
	}
	return -1;
}

function isPromoted(targetItem) {
	var allPromotions = loadPromotions();
	for(var i=0;i<allPromotions.length;i++){
		for(var j=0;j<allPromotions[i].barcodes.length;j++){
			if(targetItem==allPromotions[i].barcodes[j])
				return true;
		}
		return false;
	}
}
