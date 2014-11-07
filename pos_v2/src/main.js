//TODO: Please write code in this file.
function printInventory(inputs) {
	var cart = new Cart();
	inputs.forEach(function(i){
		cart.add(i);
	});
	cart.getSave();
	cart.getTotal();
	cart.print();
}

function Cart() {
	this.itemList = [];
	this.total = 0;
	this.save = 0;
	this.date = new FormattedDate();
	this.parseCode = function(str){
		return str.split("-")[0];
	}
	this.parseAmount = function(str){
		return str.indexOf("-") >= 0 ? str.split("-")[1] - "0" : 1;
	}
	this.add = function(inputStr){
		tempCode = this.parseCode(inputStr);
		item = this.findItem(tempCode);
		amount = this.parseAmount(inputStr);
		var index = -1;
			for(var i = 0; i<this.itemList.length; i++){
				if(this.itemList[i].barcode === item.barcode){
					this.itemList[i].amount += amount;
					index = i;
					break;
				}	
			}
			if(index < 0){
				index = this.itemList.length;
				this.itemList.push(this.cartItem(item, amount));
			}
			if(this.hasPromotion(this.itemList[index])){
				this.itemList[index].promotionAmount = this.itemList[index].amount > 1 ? 1 : 0;
				this.itemList[index].save = this.itemList[index].price * this.itemList[index].promotionAmount;
			}
			this.itemList[index].charge = (this.itemList[index].amount - this.itemList[index].promotionAmount) * this.itemList[index].price;
	}
	this.cartItem = function(item,amount){
		return {barcode: item.barcode, name:item.name, price:item.price, unit:item.unit, amount:amount, promotionAmount: 0, save: 0.00, charge: item.price * amount};
	}
	this.hasPromotion=function (item){
		var r = false;
		var promotions = loadPromotions()[0].barcodes;
		for(var i =0; i< promotions.length; i++){
			if(promotions[i] === item.barcode){
				r = true;
			}
		}
		return r;
	}
	this.findItem=function (code){
		var item;
		var items = loadAllItems();
		items.forEach(function(i){
			if(i.barcode === code){
				item = i;
			}
		});
		return item;
	}
	this.getTotal=function (){
		for(var i = 0; i<this.itemList.length; i++){
			this.total += this.itemList[i].charge;
		}
	}
	this.getSave=function (){
		for(var i = 0; i<this.itemList.length; i++){
			this.save += this.itemList[i].save;
		}
	}
	this.print=function(){
		var text = "***<没钱赚商店>购物清单***\n";
		text += '打印时间：'+this.date.getFormattedDateString()+'\n';
		text += '----------------------\n';
		for(var i =0; i<this.itemList.length; i++){
			text += "名称：" + this.itemList[i].name +"，数量：" + this.itemList[i].amount + this.itemList[i].unit + "，单价：" + this.itemList[i].price.toFixed(2) + "(元)，小计：" + this.itemList[i].charge.toFixed(2) + "(元)\n";	
		}
		text += '----------------------\n';
		text += '挥泪赠送商品：\n' ;
		for(var i =0; i<this.itemList.length; i++){
			if(this.itemList[i].promotionAmount > 0){
				text += "名称：" + this.itemList[i].name + "，数量：" + this.itemList[i].promotionAmount + this.itemList[i].unit + "\n";		
			}
		}
		text += '----------------------\n';
		text += "总计：" + this.total.toFixed(2) + "(元)\n";
		text += "节省：" + this.save.toFixed(2) + "(元)\n";
		text += '**********************';

        console.log(text);
	}
}

function FormattedDate() {
    this.dateDigitToString = function(num){
    	return num < 10 ? '0' + num : num;
    }
    this.getFormattedDateString = function() {
    	var currentDate = new Date();
		year = this.dateDigitToString(currentDate.getFullYear()),
	    month = this.dateDigitToString(currentDate.getMonth() + 1),
	    date = this.dateDigitToString(currentDate.getDate()),
	    hour = this.dateDigitToString(currentDate.getHours()),
	    minute = this.dateDigitToString(currentDate.getMinutes()),
	    second = this.dateDigitToString(currentDate.getSeconds()),
	    formattedDateString = year + '年' + month + '月' + date + '日 ' + hour + ':' + minute + ':' + second;
	    return formattedDateString;
    }
}